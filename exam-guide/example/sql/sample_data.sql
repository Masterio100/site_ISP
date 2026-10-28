-- Учебные данные. Порядок важен: сначала справочники, потом всё остальное.

INSERT INTO role (role_name) VALUES ('Клиент'), ('Менеджер'), ('Администратор');

INSERT INTO category (category_name) VALUES ('Кроссовки'), ('Ботинки'), ('Сандалии');

INSERT INTO manufacturer (manufacturer_name) VALUES ('Nord Steps'), ('Альпина'), ('Sun Walk');

INSERT INTO app_user (login, last_name, first_name, patronymic, role_id)
SELECT 'client1', 'Иванов', 'Иван', 'Иванович', role_id FROM role WHERE role_name = 'Клиент';
INSERT INTO app_user (login, last_name, first_name, patronymic, role_id)
SELECT 'client2', 'Петрова', 'Мария', 'Сергеевна', role_id FROM role WHERE role_name = 'Клиент';
INSERT INTO app_user (login, last_name, first_name, patronymic, role_id)
SELECT 'manager1', 'Сидоров', 'Алексей', 'Петрович', role_id FROM role WHERE role_name = 'Менеджер';
INSERT INTO app_user (login, last_name, first_name, patronymic, role_id)
SELECT 'admin1', 'Кузнецова', 'Ольга', 'Николаевна', role_id FROM role WHERE role_name = 'Администратор';

INSERT INTO product (product_name, description, composition, price, image_file, category_id, manufacturer_id)
SELECT 'Кроссовки Runner', 'Лёгкие кроссовки для бега', 'Текстиль, резина', 4500.00, NULL, c.category_id, m.manufacturer_id
FROM category c, manufacturer m WHERE c.category_name = 'Кроссовки' AND m.manufacturer_name = 'Nord Steps';
INSERT INTO product (product_name, description, composition, price, image_file, category_id, manufacturer_id)
SELECT 'Ботинки Trail', 'Зимние ботинки с мехом', 'Кожа, мех', 8900.00, NULL, c.category_id, m.manufacturer_id
FROM category c, manufacturer m WHERE c.category_name = 'Ботинки' AND m.manufacturer_name = 'Альпина';
INSERT INTO product (product_name, description, composition, price, image_file, category_id, manufacturer_id)
SELECT 'Сандалии Beach', 'Летние сандалии', 'Резина', 1900.00, NULL, c.category_id, m.manufacturer_id
FROM category c, manufacturer m WHERE c.category_name = 'Сандалии' AND m.manufacturer_name = 'Sun Walk';
INSERT INTO product (product_name, description, composition, price, image_file, category_id, manufacturer_id)
SELECT 'Кроссовки City', 'Городские кроссовки', 'Кожа, резина', 6200.00, NULL, c.category_id, m.manufacturer_id
FROM category c, manufacturer m WHERE c.category_name = 'Кроссовки' AND m.manufacturer_name = 'Альпина';

INSERT INTO product_size (product_id, size_value, quantity)
SELECT product_id, v.size_value, v.quantity
FROM product p
JOIN (VALUES ('Кроссовки Runner', 41, 4), ('Кроссовки Runner', 42, 5), ('Кроссовки Runner', 43, 3),
             ('Ботинки Trail', 42, 1), ('Ботинки Trail', 43, 1),
             ('Сандалии Beach', 38, 0), ('Сандалии Beach', 39, 6), ('Сандалии Beach', 40, 2),
             ('Кроссовки City', 41, 10), ('Кроссовки City', 42, 8)
     ) AS v (product_name, size_value, quantity) ON v.product_name = p.product_name;

-- Заказы привязаны к текущей дате, чтобы скидка демонстрировалась в любой месяц.
INSERT INTO customer_order (order_date, customer_id)
SELECT date_trunc('month', CURRENT_DATE) - INTERVAL '10 days', user_id FROM app_user WHERE login = 'client1';
INSERT INTO customer_order (order_date, customer_id)
SELECT CURRENT_DATE, user_id FROM app_user WHERE login = 'client2';

INSERT INTO order_item (order_id, product_id, size_value, quantity)
SELECT o.order_id, p.product_id, 42, 1
FROM customer_order o, product p
WHERE o.order_id = 1 AND p.product_name = 'Кроссовки Runner';
INSERT INTO order_item (order_id, product_id, size_value, quantity)
SELECT o.order_id, p.product_id, 39, 2
FROM customer_order o, product p
WHERE o.order_id = 2 AND p.product_name = 'Сандалии Beach';
