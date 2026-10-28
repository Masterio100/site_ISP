import tkinter as tk
from tkinter import messagebox, ttk

import config
import database
import style
from widgets import BasePage, load_image


class LoginPage(BasePage):
    title = "Вход в систему"

    def __init__(self, app):
        super().__init__(app)
        box = tk.Frame(self.body, background=style.BACKGROUND)
        box.place(relx=0.5, rely=0.4, anchor="center")
        self.logo = load_image(None, 120)
        tk.Label(box, image=self.logo, background=style.BACKGROUND).pack(pady=8)
        tk.Label(box, text=config.COMPANY_NAME, font=style.FONT_TITLE, background=style.BACKGROUND).pack()
        tk.Label(box, text="Логин", font=style.FONT_NORMAL, background=style.BACKGROUND).pack(pady=(16, 2))
        self.login_var = tk.StringVar()
        entry = ttk.Entry(box, textvariable=self.login_var, width=30)
        entry.pack()
        entry.focus_set()
        entry.bind("<Return>", lambda event: self.try_login())
        ttk.Button(box, text="Войти", command=self.try_login).pack(pady=12)

    def try_login(self):
        login = self.login_var.get().strip()
        if not login:
            messagebox.showwarning("Вход", "Введите логин и нажмите «Войти».")
            return
        try:
            user = database.find_user_by_login(login)
        except Exception:
            messagebox.showerror(
                "Ошибка подключения",
                "Не удалось связаться с базой данных. Проверьте, что СУБД запущена, и повторите вход.",
            )
            return
        if user is None:
            messagebox.showerror(
                "Вход", "Пользователь с логином «" + login + "» не найден. Проверьте логин по списку пользователей."
            )
            return
        self.app.sign_in(user)
