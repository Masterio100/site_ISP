"""Собирает beginner.html: подставляет содержимое файлов примера вместо {{file:путь}}.

Запуск из папки exam-guide:  python _build/build_beginner.py
"""
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "_build" / "beginner.template.html"
OUTPUT = ROOT / "beginner.html"


def read_example(match):
    relative_path = match.group(1)
    content = (ROOT / relative_path).read_text(encoding="utf-8")
    return html.escape(content.rstrip("\n"), quote=False)


def main():
    template = TEMPLATE.read_text(encoding="utf-8")
    result = re.sub(r"\{\{file:([^}]+)\}\}", read_example, template)
    OUTPUT.write_text(result, encoding="utf-8")
    print("written", OUTPUT, len(result))


if __name__ == "__main__":
    main()
