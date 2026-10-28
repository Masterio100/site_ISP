import tkinter as tk
from datetime import datetime
from tkinter import messagebox, ttk

import config
import database
import rules
import style
from widgets import BasePage

DATE_FORMAT = "%d.%m.%Y"


class OrdersPage(BasePage):
    title = "Заказы"

    def __init__(self, app):
        super().__init__(app)
        self.build_buttons()
        self.table = ttk.Treeview(self.body, columns=("date", "customer"), show="headings", selectmode="browse")
        self.table.heading("date", text="Дата заказа")
        self.table.heading("customer", text="ФИО клиента")
        self.table.column("date", width=140)
        self.table.column("customer", width=420)
        self.table.pack(fill="both", expand=True, padx=12, pady=12)
        self.table.bind("<Double-1>", lambda event: self.open_details())
        self.refresh()

    def build_buttons(self):
        bar = tk.Frame(self.body, background=style.SECONDARY)
        bar.pack(fill="x")
        ttk.Button(bar, text="Добавить заказ", command=self.add_order).pack(side="left", padx=8, pady=8)
        ttk.Button(bar, text="Состав заказа", command=self.open_details).pack(side="left", padx=4)
        ttk.Button(bar, text="Удалить заказ", command=self.delete_selected).pack(side="left", padx=4)

    def refresh(self):
        self.table.delete(*self.table.get_children())
        try:
            orders = database.load_orders()
        except Exception:
            messagebox.showerror("Ошибка загрузки", "Не удалось загрузить список заказов. Проверьте подключение к базе данных.")
            return
        for order in orders:
            self.table.insert(
                "", "end", iid=str(order["order_id"]),
                values=(order["order_date"].strftime(DATE_FORMAT), order["customer_name"]),
            )

    def selected_order_id(self):
        selected = self.table.selection()
        if not selected:
            messagebox.showwarning("Заказ не выбран", "Выберите заказ в таблице.")
            return None
        return int(selected[0])

    def add_order(self):
        from catalog_page import CatalogPage

        messagebox.showinfo(
            "Новый заказ",
            "Найдите товары в каталоге, добавьте их в заказ, затем откройте «Корзину» и выберите клиента.",
        )
        self.app.open(CatalogPage)

    def open_details(self):
        order_id = self.selected_order_id()
        if order_id is not None:
            self.app.open(OrderDetailsPage, order_id=order_id)

    def delete_selected(self):
        order_id = self.selected_order_id()
        if order_id is None:
            return
        if not messagebox.askyesno(
            "Удаление заказа",
            "Заказ № " + str(order_id) + " будет удалён, а товары вернутся на склад. Это действие нельзя отменить. Продолжить?",
            icon="warning",
        ):
            return
        database.delete_order(order_id)
        self.refresh()


class OrderDetailsPage(BasePage):
    title = "Состав заказа"

    def __init__(self, app, order_id):
        super().__init__(app)
        self.order_id = order_id
        self.is_admin = app.user["role_name"] == config.ROLE_ADMIN
        columns = ("name", "maker", "size", "quantity", "price", "sum")
        self.table = ttk.Treeview(self.body, columns=columns, show="headings", selectmode="browse")
        for key, caption, width in (
            ("name", "Товар", 240), ("maker", "Производитель", 160), ("size", "Размер", 70),
            ("quantity", "Кол-во", 70), ("price", "Цена за пару", 110), ("sum", "Сумма", 110),
        ):
            self.table.heading(key, text=caption)
            self.table.column(key, width=width)
        self.table.pack(fill="both", expand=True, padx=12, pady=12)
        footer = tk.Frame(self.body, background=style.BACKGROUND)
        footer.pack(fill="x", padx=12, pady=8)
        self.total_label = tk.Label(footer, font=style.FONT_BOLD, background=style.BACKGROUND)
        self.total_label.pack(side="left")
        if self.is_admin:
            self.build_admin_controls(footer)
        self.refresh()

    def build_admin_controls(self, footer):
        self.date_var = tk.StringVar()
        ttk.Button(footer, text="Удалить позицию", command=self.delete_item).pack(side="right", padx=4)
        ttk.Button(footer, text="Сохранить дату", command=self.save_date).pack(side="right", padx=4)
        ttk.Entry(footer, textvariable=self.date_var, width=14).pack(side="right")
        tk.Label(footer, text="Дата (ДД.ММ.ГГГГ):", background=style.BACKGROUND, font=style.FONT_NORMAL).pack(side="right", padx=4)

    def refresh(self):
        self.table.delete(*self.table.get_children())
        items = database.load_order_items(self.order_id)
        for item in items:
            row_id = str(item["product_id"]) + "|" + str(item["size_value"])
            self.table.insert(
                "", "end", iid=row_id,
                values=(
                    item["product_name"], item["manufacturer_name"], item["size_value"], item["quantity"],
                    item["unit_price"], item["unit_price"] * item["quantity"],
                ),
            )
        self.total_label.configure(text="Итого по заказу: " + str(rules.calc_order_total(items)) + " ₽")
        if self.is_admin:
            order = next((o for o in database.load_orders() if o["order_id"] == self.order_id), None)
            if order:
                self.date_var.set(order["order_date"].strftime(DATE_FORMAT))

    def save_date(self):
        try:
            new_date = datetime.strptime(self.date_var.get().strip(), DATE_FORMAT).date()
        except ValueError:
            messagebox.showerror("Неверная дата", "Введите дату в формате ДД.ММ.ГГГГ, например 15.03.2026.")
            return
        database.change_order_date(self.order_id, new_date)
        messagebox.showinfo("Сохранено", "Дата заказа изменена.")

    def delete_item(self):
        selected = self.table.selection()
        if not selected:
            messagebox.showwarning("Позиция не выбрана", "Выберите позицию в таблице.")
            return
        if not messagebox.askyesno("Удаление позиции", "Позиция будет удалена из заказа, товар вернётся на склад. Продолжить?", icon="warning"):
            return
        product_id, size_value = selected[0].split("|")
        database.delete_order_item(self.order_id, int(product_id), size_value)
        self.refresh()
