from decimal import Decimal

DISCOUNT_RATE = Decimal("0.25")
MANY_PAIRS_LIMIT = 5
LOW_STOCK_LIMIT = 3

ALL_CATEGORIES = "Все категории"
SORT_ASCENDING = "Цена: по возрастанию"
SORT_DESCENDING = "Цена: по убыванию"


def calc_final_price(price, has_discount):
    if has_discount:
        return (price * (1 - DISCOUNT_RATE)).quantize(Decimal("0.01"))
    return price


def stock_label(total_quantity):
    if total_quantity > MANY_PAIRS_LIMIT:
        return "много"
    return "мало"


def is_low_stock(total_quantity):
    return total_quantity <= LOW_STOCK_LIMIT


def filter_and_sort(products, category_name, search_text, sort_mode):
    query = search_text.strip().lower()
    visible = []
    for product in products:
        if category_name != ALL_CATEGORIES and product["category_name"] != category_name:
            continue
        in_name = query in product["product_name"].lower()
        in_description = query in (product["description"] or "").lower()
        if query and not (in_name or in_description):
            continue
        visible.append(product)
    visible.sort(key=lambda item: item["final_price"], reverse=(sort_mode == SORT_DESCENDING))
    return visible


def calc_order_total(order_items):
    return sum((item["unit_price"] * item["quantity"] for item in order_items), Decimal("0"))
