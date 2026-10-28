import tkinter as tk
from tkinter import messagebox, ttk

import database
import rules
import style
from widgets import BasePage, load_image


class ProductPage(BasePage):
    title = "Карточка товара"

    def __init__(self, app, product_id):
        super().__init__(app)
        self.product_id = product_id
        try:
            self.product = database.load_catalog(product_id)[0]
            self.sizes = database.load_sizes(product_id)
        except Exception:
            messagebox.showerror("Ошибка загрузки", "Не удалось загрузить данные товара. Вернитесь назад и повторите попытку.")
            self.product = None
            return
        self.build_details()
        self.build_order_form()

    def build_details(self):
        product = self.product
        left = tk.Frame(self.body, background=style.BACKGROUND)
        left.pack(side="left", anchor="n", padx=20, pady=20)
        picture = load_image(product["image_file"], 260)
        image_label = tk.Label(left, image=picture, background=style.BACKGROUND)
        image_label.image = picture
        image_label.pack()
        info = tk.Frame(self.body, background=style.BACKGROUND)
        info.pack(side="left", anchor="n", pady=20, fill="x", expand=True)
        rows = [
            ("Наименование", product["product_name"]),
            ("Категория", product["category_name"]),
            ("Производитель", product["manufacturer_name"]),
            ("Цена со скидкой", str(product["final_price"]) + " ₽"),
            ("Состав", product["composition"] or "—"),
            ("Описание", product["description"] or "—"),
            ("Размерный ряд", ", ".join(str(size["size_value"]) for size in self.sizes)),
            ("Доступные размеры", ", ".join(str(s["size_value"]) for s in self.sizes if s["quantity"] > 0) or "нет в наличии"),
        ]
        for caption, value in rows:
            line = tk.Frame(info, background=style.BACKGROUND)
            line.pack(anchor="w", pady=2)
            tk.Label(line, text=caption + ":", font=style.FONT_BOLD, background=style.BACKGROUND).pack(side="left")
            tk.Label(line, text=value, font=style.FONT_NORMAL, background=style.BACKGROUND, wraplength=420, justify="left").pack(side="left", padx=6)
        self.info = info

    def build_order_form(self):
        available = [size for size in self.sizes if size["quantity"] > 0]
        form = tk.Frame(self.info, background=style.BACKGROUND)
        form.pack(anchor="w", pady=20)
        self.size_var = tk.StringVar()
        self.quantity_var = tk.StringVar(value="1")
        tk.Label(form, text="Размер", background=style.BACKGROUND, font=style.FONT_NORMAL).grid(row=0, column=0, padx=4)
        size_box = ttk.Combobox(
            form, textvariable=self.size_var, state="readonly", width=8,
            values=[str(size["size_value"]) for size in available],
        )
        size_box.grid(row=0, column=1, padx=4)
        tk.Label(form, text="Количество пар", background=style.BACKGROUND, font=style.FONT_NORMAL).grid(row=0, column=2, padx=4)
        ttk.Entry(form, textvariable=self.quantity_var, width=6).grid(row=0, column=3, padx=4)
        add_button = ttk.Button(form, text="Добавить в заказ", command=self.add_to_cart)
        add_button.grid(row=0, column=4, padx=12)
        if not available:
            add_button.state(["disabled"])

    def find_stock(self, size_text):
        for size in self.sizes:
            if str(size["size_value"]) == size_text:
                return size["quantity"]
        return 0

    def add_to_cart(self):
        size_text = self.size_var.get()
        if not size_text:
            messagebox.showwarning("Размер не выбран", "Выберите размер из списка доступных размеров.")
            return
        quantity_text = self.quantity_var.get().strip()
        if not quantity_text.isdigit() or int(quantity_text) < 1:
            messagebox.showerror("Неверное количество", "Введите количество пар целым числом, не меньше 1.")
            return
        quantity = int(quantity_text)
        in_cart = sum(
            item["quantity"]
            for item in self.app.cart
            if item["product_id"] == self.product_id and str(item["size_value"]) == size_text
        )
        stock = self.find_stock(size_text)
        if quantity + in_cart > stock:
            messagebox.showerror(
                "Недостаточно товара",
                "В наличии " + str(stock) + " пар размера " + size_text + " (в корзине уже " + str(in_cart) + "). Уменьшите количество.",
            )
            return
        self.app.cart.append(
            {
                "product_id": self.product_id,
                "product_name": self.product["product_name"],
                "size_value": next(s["size_value"] for s in self.sizes if str(s["size_value"]) == size_text),
                "quantity": quantity,
                "unit_price": self.product["final_price"],
            }
        )
        messagebox.showinfo("Добавлено", "Позиция добавлена в заказ. Откройте корзину в каталоге, чтобы подтвердить заказ.")
        self.app.back()
