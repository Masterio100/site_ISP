import psycopg2
from psycopg2.extras import RealDictCursor

import config
import rules

HAS_DISCOUNT_SQL = """
    NOT EXISTS (
        SELECT 1
        FROM order_item oi
        JOIN customer_order o ON o.order_id = oi.order_id
        WHERE oi.product_id = p.product_id
          AND o.order_date >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
          AND o.order_date <  date_trunc('month', CURRENT_DATE)
    )
"""

CATALOG_SQL = """
    SELECT p.product_id, p.product_name, p.description, p.composition, p.price, p.image_file,
           c.category_name, m.manufacturer_name,
           COALESCE(SUM(ps.quantity), 0) AS total_quantity,
           {has_discount} AS has_discount
    FROM product p
    JOIN category c ON c.category_id = p.category_id
    JOIN manufacturer m ON m.manufacturer_id = p.manufacturer_id
    LEFT JOIN product_size ps ON ps.product_id = p.product_id
    {where}
    GROUP BY p.product_id, c.category_name, m.manufacturer_name
    ORDER BY p.product_name
"""

FULL_NAME_SQL = "u.last_name || ' ' || u.first_name || COALESCE(' ' || u.patronymic, '')"


def open_connection():
    return psycopg2.connect(**config.DB_SETTINGS)


def fetch_all(query, params=()):
    connection = open_connection()
    try:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(query, params)
            return cursor.fetchall()
    finally:
        connection.close()


def run_in_transaction(work):
    connection = open_connection()
    try:
        with connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                return work(cursor)
    finally:
        connection.close()


def add_final_price(row):
    row["total_quantity"] = int(row["total_quantity"])
    row["final_price"] = rules.calc_final_price(row["price"], row["has_discount"])
    return row


def load_catalog(product_id=None):
    where = ""
    params = ()
    if product_id is not None:
        where = "WHERE p.product_id = %s"
        params = (product_id,)
    query = CATALOG_SQL.format(has_discount=HAS_DISCOUNT_SQL, where=where)
    return [add_final_price(row) for row in fetch_all(query, params)]


def load_categories():
    rows = fetch_all("SELECT category_name FROM category ORDER BY category_name")
    return [row["category_name"] for row in rows]


def load_sizes(product_id):
    return fetch_all(
        "SELECT size_value, quantity FROM product_size WHERE product_id = %s ORDER BY size_value",
        (product_id,),
    )


def find_user_by_login(login):
    rows = fetch_all(
        "SELECT u.user_id, u.login, " + FULL_NAME_SQL + " AS full_name, r.role_name "
        "FROM app_user u JOIN role r ON r.role_id = u.role_id WHERE u.login = %s",
        (login,),
    )
    return rows[0] if rows else None


def load_customers():
    return fetch_all(
        "SELECT u.user_id, " + FULL_NAME_SQL + " AS full_name "
        "FROM app_user u JOIN role r ON r.role_id = u.role_id "
        "WHERE r.role_name = %s ORDER BY full_name",
        (config.ROLE_CLIENT,),
    )


def create_order(customer_id, cart_items):
    def work(cursor):
        cursor.execute(
            "INSERT INTO customer_order (order_date, customer_id) "
            "VALUES (CURRENT_DATE, %s) RETURNING order_id",
            (customer_id,),
        )
        order_id = cursor.fetchone()["order_id"]
        for item in cart_items:
            cursor.execute(
                "UPDATE product_size SET quantity = quantity - %s "
                "WHERE product_id = %s AND size_value = %s AND quantity >= %s",
                (item["quantity"], item["product_id"], item["size_value"], item["quantity"]),
            )
            if cursor.rowcount == 0:
                raise ValueError(
                    "Недостаточно пар: " + item["product_name"] + ", размер " + str(item["size_value"])
                )
            cursor.execute(
                "INSERT INTO order_item (order_id, product_id, size_value, quantity) "
                "VALUES (%s, %s, %s, %s) "
                "ON CONFLICT (order_id, product_id, size_value) "
                "DO UPDATE SET quantity = order_item.quantity + EXCLUDED.quantity",
                (order_id, item["product_id"], item["size_value"], item["quantity"]),
            )
        return order_id

    return run_in_transaction(work)


def load_orders():
    return fetch_all(
        "SELECT o.order_id, o.order_date, " + FULL_NAME_SQL + " AS customer_name "
        "FROM customer_order o JOIN app_user u ON u.user_id = o.customer_id "
        "ORDER BY o.order_date DESC, o.order_id DESC"
    )


def load_order_items(order_id):
    query = (
        "SELECT p.product_id, p.product_name, m.manufacturer_name, oi.size_value, oi.quantity, p.price, "
        + HAS_DISCOUNT_SQL
        + " AS has_discount "
        "FROM order_item oi "
        "JOIN product p ON p.product_id = oi.product_id "
        "JOIN manufacturer m ON m.manufacturer_id = p.manufacturer_id "
        "WHERE oi.order_id = %s ORDER BY p.product_name, oi.size_value"
    )
    items = fetch_all(query, (order_id,))
    for item in items:
        item["unit_price"] = rules.calc_final_price(item["price"], item["has_discount"])
    return items


def delete_order(order_id):
    def work(cursor):
        cursor.execute(
            "UPDATE product_size ps SET quantity = ps.quantity + oi.quantity "
            "FROM order_item oi WHERE oi.order_id = %s "
            "AND ps.product_id = oi.product_id AND ps.size_value = oi.size_value",
            (order_id,),
        )
        cursor.execute("DELETE FROM customer_order WHERE order_id = %s", (order_id,))

    run_in_transaction(work)


def delete_order_item(order_id, product_id, size_value):
    def work(cursor):
        cursor.execute(
            "UPDATE product_size ps SET quantity = ps.quantity + oi.quantity "
            "FROM order_item oi WHERE oi.order_id = %s AND oi.product_id = %s AND oi.size_value = %s "
            "AND ps.product_id = oi.product_id AND ps.size_value = oi.size_value",
            (order_id, product_id, size_value),
        )
        cursor.execute(
            "DELETE FROM order_item WHERE order_id = %s AND product_id = %s AND size_value = %s",
            (order_id, product_id, size_value),
        )

    run_in_transaction(work)


def change_order_date(order_id, new_date):
    run_in_transaction(
        lambda cursor: cursor.execute(
            "UPDATE customer_order SET order_date = %s WHERE order_id = %s", (new_date, order_id)
        )
    )
