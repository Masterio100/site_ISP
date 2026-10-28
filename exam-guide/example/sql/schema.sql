CREATE TABLE role (
    role_id    INTEGER GENERATED ALWAYS AS IDENTITY,
    role_name  VARCHAR(50) NOT NULL,
    CONSTRAINT pk_role PRIMARY KEY (role_id),
    CONSTRAINT uq_role_name UNIQUE (role_name)
);

CREATE TABLE app_user (
    user_id     INTEGER GENERATED ALWAYS AS IDENTITY,
    login       VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100) NOT NULL,
    first_name  VARCHAR(100) NOT NULL,
    patronymic  VARCHAR(100),
    role_id     INTEGER NOT NULL,
    CONSTRAINT pk_app_user PRIMARY KEY (user_id),
    CONSTRAINT uq_app_user_login UNIQUE (login),
    CONSTRAINT fk_app_user_role FOREIGN KEY (role_id)
        REFERENCES role (role_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE category (
    category_id    INTEGER GENERATED ALWAYS AS IDENTITY,
    category_name  VARCHAR(100) NOT NULL,
    CONSTRAINT pk_category PRIMARY KEY (category_id),
    CONSTRAINT uq_category_name UNIQUE (category_name)
);

CREATE TABLE manufacturer (
    manufacturer_id    INTEGER GENERATED ALWAYS AS IDENTITY,
    manufacturer_name  VARCHAR(150) NOT NULL,
    CONSTRAINT pk_manufacturer PRIMARY KEY (manufacturer_id),
    CONSTRAINT uq_manufacturer_name UNIQUE (manufacturer_name)
);

CREATE TABLE product (
    product_id       INTEGER GENERATED ALWAYS AS IDENTITY,
    product_name     VARCHAR(200) NOT NULL,
    description      TEXT,
    composition      VARCHAR(300),
    price            NUMERIC(10, 2) NOT NULL,
    image_file       VARCHAR(200),
    category_id      INTEGER NOT NULL,
    manufacturer_id  INTEGER NOT NULL,
    CONSTRAINT pk_product PRIMARY KEY (product_id),
    CONSTRAINT ck_product_price CHECK (price >= 0),
    CONSTRAINT fk_product_category FOREIGN KEY (category_id)
        REFERENCES category (category_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_product_manufacturer FOREIGN KEY (manufacturer_id)
        REFERENCES manufacturer (manufacturer_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE product_size (
    product_id  INTEGER NOT NULL,
    size_value  NUMERIC(4, 1) NOT NULL,
    quantity    INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT pk_product_size PRIMARY KEY (product_id, size_value),
    CONSTRAINT ck_product_size_quantity CHECK (quantity >= 0),
    CONSTRAINT fk_product_size_product FOREIGN KEY (product_id)
        REFERENCES product (product_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE customer_order (
    order_id     INTEGER GENERATED ALWAYS AS IDENTITY,
    order_date   DATE NOT NULL DEFAULT CURRENT_DATE,
    customer_id  INTEGER NOT NULL,
    CONSTRAINT pk_customer_order PRIMARY KEY (order_id),
    CONSTRAINT fk_customer_order_user FOREIGN KEY (customer_id)
        REFERENCES app_user (user_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE order_item (
    order_id    INTEGER NOT NULL,
    product_id  INTEGER NOT NULL,
    size_value  NUMERIC(4, 1) NOT NULL,
    quantity    INTEGER NOT NULL,
    CONSTRAINT pk_order_item PRIMARY KEY (order_id, product_id, size_value),
    CONSTRAINT ck_order_item_quantity CHECK (quantity > 0),
    CONSTRAINT fk_order_item_order FOREIGN KEY (order_id)
        REFERENCES customer_order (order_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_order_item_product_size FOREIGN KEY (product_id, size_value)
        REFERENCES product_size (product_id, size_value) ON UPDATE CASCADE ON DELETE RESTRICT
);
