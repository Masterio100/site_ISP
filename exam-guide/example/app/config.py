import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

COMPANY_NAME = "Ботинок"

DB_SETTINGS = {
    "host": "localhost",
    "port": 5432,
    "dbname": "shoe_store",
    "user": "postgres",
    "password": "postgres",
}

IMAGES_DIR = os.path.join(BASE_DIR, "resources", "images")
PLACEHOLDER_PATH = os.path.join(BASE_DIR, "resources", "picture.png")
ICON_PATH = os.path.join(BASE_DIR, "resources", "icon.ico")

ROLE_CLIENT = "Клиент"
ROLE_MANAGER = "Менеджер"
ROLE_ADMIN = "Администратор"
