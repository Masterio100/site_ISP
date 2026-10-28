import tkinter as tk
from tkinter import messagebox, ttk

import config
import database
import rules
import style
from product_page import ProductPage
from widgets import BasePage, ScrollFrame, load_image


class CatalogPage(BasePage):
    title = "Каталог обуви"
    back_text = "Выйти"

    def __init__(self, app):
        super().__init__(app)
        self.products = []
        self.build_toolbar()
        self.list_area = ScrollFrame(self.body)
        self.list_area.pack(fill="both", expand=True)
        self.refresh()

    def always_show_back(self):
        return True

    def go_back(self):
        self.app.sign_out()

    def build_toolbar(self):
        bar = tk.Frame(self.body, background=style.SECONDARY)
        bar.pack(fill="x")
        self.search_var = tk.StringVar()
        self.category_var = tk.StringVar(value=rules.ALL_CATEGORIES)
        self.sort_var = tk.StringVar(value=rules.SORT_ASCENDING)
        ttk.Entry(bar, textvariable=self.search_var, width=28).pack(side="left", padx=8, pady=8)
        self.category_box = ttk.Combobox(bar, textvariable=self.category_var, state="readonly", width=20)
        self.category_box.pack(side="left", padx=4)
        sort_box = ttk.Combobox(
            bar,
            textvariable=self.sort_var,
            state="readonly",
            width=22,
            values=[rules.SORT_ASCENDING, rules.SORT_DESCENDING],
        )
        sort_box.pack(side="left", padx=4)
        for variable in (self.search_var, self.category_var, self.sort_var):
            variable.trace_add("write", self.render)
        self.cart_button = ttk.Button(bar, text="Корзина (0)", command=self.open_cart)
        self.cart_button.pack(side="right", padx=8)
        if self.app.user["role_name"] in (config.ROLE_MANAGER, config.ROLE_ADMIN):
            ttk.Button(bar, text="Заказы", command=self.open_orders).pack(side="right", padx=4)

    def refresh(self):
        try:
            self.products = database.load_catalog()
            categories = database.load_categories()
        except Exception:
            messagebox.showerror(
                "Ошибка загрузки",
                "Не удалось загрузить каталог из базы данных. Проверьте подключение и повторите попытку.",
            )
            return
        self.category_box.configure(values=[rules.ALL_CATEGORIES] + categories)
        self.cart_button.configure(text="Корзина (" + str(len(self.app.cart)) + ")")
        self.render()

    def render(self, *_):
        visible = rules.filter_and_sort(
            self.products, self.category_var.get(), self.search_var.get(), self.sort_var.get()
        )
        self.list_area.clear()
        if not visible:
            tk.Label(
                self.list_area.inner,
                text="Ничего не найдено. Измените строку поиска или выберите «Все категории».",
                font=style.FONT_NORMAL,
                background=style.BACKGROUND,
            ).pack(pady=24)
        for product in visible:
            self.build_card(product)

    def build_card(self, product):
        color = style.LOW_STOCK_BACKGROUND if rules.is_low_stock(product["total_quantity"]) else style.BACKGROUND
        card = tk.Frame(self.list_area.inner, background=color, highlightbackground="#999999", highlightthickness=1)
        card.pack(fill="x", padx=12, pady=5)
        picture = load_image(product["image_file"], 100)
        image_label = tk.Label(card, image=picture, background=color)
        image_label.image = picture
        image_label.pack(side="left", padx=8, pady=8)
        text = tk.Frame(card, background=color)
        text.pack(side="left", fill="both", expand=True)
        tk.Label(
            text,
            text=product["category_name"] + " | " + product["product_name"],
            font=style.FONT_BOLD,
            background=color,
        ).pack(anchor="w")
        tk.Label(text, text="Производитель: " + product["manufacturer_name"], background=color, font=style.FONT_NORMAL).pack(anchor="w")
        tk.Label(text, text="Состав: " + (product["composition"] or "—"), background=color, font=style.FONT_NORMAL).pack(anchor="w")
        price_line = tk.Frame(text, background=color)
        price_line.pack(anchor="w")
        if product["has_discount"]:
            tk.Label(price_line, text=str(product["price"]) + " ₽", font=style.FONT_OLD_PRICE, background=color, foreground="#cc0000").pack(side="left")
        tk.Label(price_line, text=str(product["final_price"]) + " ₽", font=style.FONT_BOLD, background=color).pack(side="left", padx=6)
        tk.Label(
            card,
            text="Количество: " + rules.stock_label(product["total_quantity"]),
            font=style.FONT_BOLD,
            background=color,
        ).pack(side="right", padx=16)
        self.bind_click(card, product["product_id"])

    def bind_click(self, widget, product_id):
        widget.bind("<Button-1>", lambda event: self.open_product(product_id))
        for child in widget.winfo_children():
            self.bind_click(child, product_id)

    def open_product(self, product_id):
        self.app.open(ProductPage, product_id=product_id)

    def open_cart(self):
        from cart_page import CartPage

        self.app.open(CartPage)

    def open_orders(self):
        from orders_page import OrdersPage

        self.app.open(OrdersPage)
