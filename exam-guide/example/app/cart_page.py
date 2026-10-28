import tkinter as tk
from tkinter import messagebox, ttk

import config
import database
import rules
import style
from widgets import BasePage


class CartPage(BasePage):
    title = "Оформление заказа"

    def __init__(self, app):
        super().__init__(app)
        self.customers = []
        self.build_table()
        self.build_footer()
        self.fill_table()

    def build_table(self):
        columns = ("name", "size", "quantity", "price", "sum")
        self.table = ttk.Treeview(self.body, columns=columns, show="headings", selectmode="browse")
        for key, caption, width in (
            ("name", "Товар", 320), ("size", "Размер", 80), ("quantity", "Кол-во", 80),
            ("price", "Цена за пару", 120), ("sum", "Сумма", 120),
        ):
            self.table.heading(key, text=caption)
            self.table.column(key, width=width, anchor="w")
        self.table.pack(fill="both", expand=True, padx=12, pady=12)

    def build_footer(self):
        footer = tk.Frame(self.body, background=style.BACKGROUND)
        footer.pack(fill="x", padx=12, pady=8)
        self.total_label = tk.Label(footer, font=style.FONT_BOLD, background=style.BACKGROUND)
        self.total_label.pack(side="left")
        self.customer_var = tk.StringVar()
        if self.app.user["role_name"] != config.ROLE_CLIENT:
            self.customers = database.load_customers()
            names = [customer["full_name"] for customer in self.customers]
            tk.Label(footer, text="Клиент:", background=style.BACKGROUND, font=style.FONT_NORMAL).pack(side="left", padx=(24, 4))
            ttk.Combobox(footer, textvariable=self.customer_var, values=names, state="readonly", width=30).pack(side="left")
        ttk.Button(footer, text="Отказаться от заказа", command=self.cancel_order).pack(side="right", padx=4)
        ttk.Button(footer, text="Подтвердить заказ", command=self.confirm_order).pack(side="right", padx=4)
        ttk.Button(footer, text="Убрать позицию", command=self.remove_selected).pack(side="right", padx=4)

    def fill_table(self):
        self.table.delete(*self.table.get_children())
        for index, item in enumerate(self.app.cart):
            line_sum = item["unit_price"] * item["quantity"]
            self.table.insert(
                "", "end", iid=str(index),
                values=(item["product_name"], item["size_value"], item["quantity"], item["unit_price"], line_sum),
            )
        total = rules.calc_order_total(self.app.cart)
        self.total_label.configure(text="Итого: " + str(total) + " ₽")

    def remove_selected(self):
        selected = self.table.selection()
        if not selected:
            messagebox.showwarning("Позиция не выбрана", "Выберите в таблице позицию, которую нужно убрать.")
            return
        del self.app.cart[int(selected[0])]
        self.fill_table()

    def cancel_order(self):
        if self.app.cart and not messagebox.askyesno("Отказ от заказа", "Все позиции будут убраны из заказа. Продолжить?", icon="warning"):
            return
        self.app.cart.clear()
        self.app.back()

    def pick_customer_id(self):
        if self.app.user["role_name"] == config.ROLE_CLIENT:
            return self.app.user["user_id"]
        for customer in self.customers:
            if customer["full_name"] == self.customer_var.get():
                return customer["user_id"]
        return None

    def confirm_order(self):
        if not self.app.cart:
            messagebox.showwarning("Пустой заказ", "В заказе нет позиций. Вернитесь в каталог и добавьте товар.")
            return
        customer_id = self.pick_customer_id()
        if customer_id is None:
            messagebox.showwarning("Клиент не выбран", "Выберите клиента, на которого оформляется заказ.")
            return
        try:
            order_id = database.create_order(customer_id, self.app.cart)
        except ValueError as error:
            messagebox.showerror("Заказ не оформлен", str(error) + ". Уменьшите количество или уберите позицию.")
            return
        except Exception:
            messagebox.showerror("Ошибка", "Не удалось сохранить заказ. Проверьте подключение к базе данных и повторите попытку.")
            return
        self.app.cart.clear()
        messagebox.showinfo("Заказ оформлен", "Заказ № " + str(order_id) + " оформлен.")
        self.app.back()
