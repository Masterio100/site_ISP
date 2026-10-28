import tkinter as tk

import config
from login_page import LoginPage


class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.geometry("1000x700")
        self.minsize(800, 500)
        try:
            self.iconbitmap(config.ICON_PATH)
        except tk.TclError:
            pass
        self.user = None
        self.cart = []
        self.history = []
        self.current = None
        self.open(LoginPage)

    def open(self, page_class, **kwargs):
        if self.current is not None:
            self.current.pack_forget()
            self.history.append(self.current)
        self.show(page_class(self, **kwargs))

    def show(self, page):
        self.current = page
        page.pack(fill="both", expand=True)
        self.title(config.COMPANY_NAME + " — " + page.title)

    def back(self):
        if not self.history:
            return
        self.current.destroy()
        previous = self.history.pop()
        self.show(previous)
        previous.refresh()

    def sign_in(self, user):
        self.user = user
        self.cart = []
        self.reset_pages()
        from catalog_page import CatalogPage

        self.open(CatalogPage)

    def sign_out(self):
        self.user = None
        self.cart = []
        self.reset_pages()
        self.open(LoginPage)

    def reset_pages(self):
        for page in self.history + ([self.current] if self.current else []):
            page.destroy()
        self.history = []
        self.current = None


if __name__ == "__main__":
    App().mainloop()
