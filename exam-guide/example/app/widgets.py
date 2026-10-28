import math
import os
import tkinter as tk
from tkinter import ttk

import config
import style

_image_cache = {}


def load_image(file_name, max_size):
    path = os.path.join(config.IMAGES_DIR, file_name) if file_name else ""
    if not os.path.isfile(path):
        path = config.PLACEHOLDER_PATH
    key = (path, max_size)
    if key not in _image_cache:
        try:
            image = tk.PhotoImage(file=path)
        except tk.TclError:
            image = tk.PhotoImage(file=config.PLACEHOLDER_PATH)
        factor = max(1, math.ceil(max(image.width(), image.height()) / max_size))
        _image_cache[key] = image.subsample(factor)
    return _image_cache[key]


class ScrollFrame(ttk.Frame):
    """Прокручиваемая область: складывайте виджеты в self.inner."""

    def __init__(self, parent):
        super().__init__(parent)
        self.canvas = tk.Canvas(self, highlightthickness=0, background=style.BACKGROUND)
        scrollbar = ttk.Scrollbar(self, orient="vertical", command=self.canvas.yview)
        self.inner = tk.Frame(self.canvas, background=style.BACKGROUND)
        self.window_id = self.canvas.create_window((0, 0), window=self.inner, anchor="nw")
        self.canvas.configure(yscrollcommand=scrollbar.set)
        self.canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        self.inner.bind("<Configure>", self.update_scroll_region)
        self.canvas.bind("<Configure>", self.fit_width)
        self.canvas.bind("<Enter>", self.enable_wheel)
        self.canvas.bind("<Leave>", self.disable_wheel)

    def update_scroll_region(self, event):
        self.canvas.configure(scrollregion=self.canvas.bbox("all"))

    def fit_width(self, event):
        self.canvas.itemconfigure(self.window_id, width=event.width)

    def enable_wheel(self, event):
        self.canvas.bind_all("<MouseWheel>", self.on_wheel)

    def disable_wheel(self, event):
        self.canvas.unbind_all("<MouseWheel>")

    def on_wheel(self, event):
        self.canvas.yview_scroll(int(-event.delta / 120), "units")

    def clear(self):
        for child in self.inner.winfo_children():
            child.destroy()


class BasePage(ttk.Frame):
    """Общая шапка: кнопка «Назад», заголовок страницы, ФИО пользователя справа."""

    title = ""
    back_text = "← Назад"

    def __init__(self, app):
        super().__init__(app)
        self.app = app
        header = tk.Frame(self, background=style.ACCENT)
        header.pack(fill="x")
        if app.history or self.always_show_back():
            ttk.Button(header, text=self.back_text, command=self.go_back).pack(side="left", padx=8, pady=8)
        tk.Label(header, text=self.title, font=style.FONT_TITLE, background=style.ACCENT).pack(
            side="left", padx=8
        )
        if app.user:
            tk.Label(header, text=app.user["full_name"], font=style.FONT_BOLD, background=style.ACCENT).pack(
                side="right", padx=12
            )
        self.body = tk.Frame(self, background=style.BACKGROUND)
        self.body.pack(fill="both", expand=True)

    def always_show_back(self):
        return False

    def go_back(self):
        self.app.back()

    def refresh(self):
        """Вызывается, когда пользователь вернулся на страницу кнопкой «Назад»."""
