"use strict";

/* ---------- storage ---------- */

const STORAGE_KEY = "de-guide-09.02.07-v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // хранилище недоступно — страница работает без сохранения
  }
}

const state = loadState();
state.checks = state.checks || {};
state.errors = state.errors || {};

/* ---------- data ---------- */

const TASKS = [
  {
    n: 1,
    title: "Разработка базы данных средствами СУБД",
    activity: "Разработка, администрирование и защита баз данных",
    minutes: 50,
    pa: true,
    points: "15 баллов: разработка объектов БД — 12, реализация БД — 3",
    goal: "По описанию предметной области (Приложение 1) спроектировать БД в 3НФ, загрузить данные заказчика (Приложение 2, файлы «import»), получить ER-диаграмму в PDF и сохранить скрипт БД со структурой и данными.",
    steps: [
      ["Изучить Приложение 1: выписать сущности, атрибуты, связи", "Таблицы нужны только для функций системы заказа — все сущности предметной области воспроизводить не надо."],
      ["Выбрать СУБД и создать базу данных", "Единая схема имён: один стиль (snake_case) для всех таблиц и полей."],
      ["Спроектировать таблицы в 3НФ", "Роль, категория, производитель — отдельными справочниками, а не текстом в таблице. Остаток — на пару «модель + размер»."],
      ["Явно создать первичные и внешние ключи", "Задайте имена ограничений и поведение ON DELETE / ON UPDATE по смыслу предметной области."],
      ["Подготовить данные из .xlsx к импорту", "Файлы не всегда совпадают со структурой БД: приведите к структуре таблиц, уберите дубли и лишние пробелы, проверьте даты и десятичные разделители."],
      ["Загрузить данные в правильном порядке", "Сначала справочники, потом товары и остатки, пользователи, затем заказы и их состав. Заказы до товаров загрузить нельзя."],
      ["Сверить количество строк с исходными файлами", "Типичная ошибка — часть данных не загрузилась и никто не заметил."],
      ["Получить ER-диаграмму и сохранить в PDF", "Все таблицы, атрибуты, PK и FK, связи. Типы данных указывать не нужно."],
      ["Сохранить скрипт БД со структурой и данными", "Не только CREATE TABLE, но и INSERT. Проверьте, что скрипт разворачивается на пустой базе. Для 1С — файл .dt."],
      ["Загрузить результаты в репозиторий"]
    ],
    tips: [
      "Идите от схемы к данным: пока справочники не загружены, внешние ключи не дадут вставить товары — это нормально, это проверка порядка.",
      "ER-диаграмму удобнее всего строить средствами самой СУБД (ERD в DBeaver / pgAdmin) — схема точно совпадёт с базой."
    ]
  },
  {
    n: 2,
    title: "Разработка алгоритма и создание приложения",
    activity: "Разработка модулей программного обеспечения для компьютерных систем",
    minutes: 40,
    pa: true,
    points: "10 баллов: алгоритмы — 2, разработка модулей — 6, отладка — 2",
    goal: "Реализовать в коде каталог товаров с расчётом цены со скидкой, индикатором остатка и подсветкой в едином стиле по Приложению 3 (цвета, шрифты, логотип, иконка).",
    steps: [
      ["Создать проект и назвать приложение", "В наименовании приложения должно быть название компании-заказчика. Заголовок окна соответствует назначению."],
      ["Применить руководство по стилю (Приложение 3)", "Цветовая схема, шрифты, логотип из ресурсов, иконка приложения (.ico), если платформа позволяет."],
      ["Подключиться к БД и загрузить каталог моделей"],
      ["Вывести карточки по макету", "Изображение, категория, наименование, производство, состав, цена со скидкой, количество пар (суммарно по всем размерам)."],
      ["Подставлять picture.png при отсутствии изображения", "Заглушку должны получать и модели без файла, и модели с битой ссылкой."],
      ["Показывать «много», если пар больше 5; «мало», если пять или менее", "Считается сумма по всем размерам модели, порог — строго больше пяти."],
      ["Подсвечивать светло-красным модели с остатком ≤ 3", "Условие «меньше или равно трём» — на суммарное количество по всем размерам."],
      ["Рассчитать цену со скидкой 25%", "Скидка на товары, по которым не было заказов в предыдущем календарном месяце относительно даты расчёта."],
      ["Отладить модуль", "Приложение не должно аварийно завершаться: пустые таблицы, NULL в полях, нет картинки, нет связи с БД."],
      ["Оформить код", "Осмысленные имена в стиле технологии, не более одной команды в строке, комментарии только к неочевидному."],
      ["Загрузить результаты в репозиторий"]
    ],
    tips: [
      "Алгоритм «оценивается через код»: отдельный документ не нужен, но расчёт скидки и метка остатка должны быть в коде, а не «заглушкой».",
      "Дата расчёта — сегодняшняя. Вынесите границы прошлого месяца в отдельную функцию: её легко проверить на 1 января и 1 марта."
    ]
  },
  {
    n: 3,
    title: "Разработка последовательного пользовательского интерфейса. Оформление заказа",
    activity: "Сопровождение и обслуживание программного обеспечения компьютерных систем",
    minutes: 60,
    pa: false,
    points: "25 баллов: модификация компонент ПО — 22, поиск и анализ информации — 3",
    goal: "Добавить авторизацию, навигацию, обработку ошибок, поиск, сортировку, фильтрацию и оформление заказа с пересчётом остатков.",
    steps: [
      ["Авторизация только по логину из списка пользователей", "Пароль не нужен. После входа в правом верхнем углу — ФИО пользователя."],
      ["Навигация между окнами с кнопкой «Назад»", "У каждого окна — заголовок, соответствующий назначению."],
      ["Обработка исключительных ситуаций", "Окна сообщений разных типов (ошибка, предупреждение, информация) с заголовком, пиктограммой и текстом, который говорит, что случилось и как исправить."],
      ["Запретить ввод некорректных значений в текстовые поля", "С уведомлением пользователя об ошибке."],
      ["Сортировка по цене (по возрастанию и убыванию)", "Выбор — выпадающим списком."],
      ["Фильтр по категории выпадающим списком", "Все категории из БД; первый элемент — «Все категории» сбрасывает фильтр."],
      ["Поиск по наименованию и описанию товара"],
      ["Всё работает в реальном времени и совместно", "Без кнопок «найти» / «применить». Поиск + фильтр вместе; выбранная сортировка сохраняется при фильтрации и поиске."],
      ["Открывать форму товара по клику из каталога", "Поля: изображение, производство, наименование, категория, цена со скидкой, состав, описание, размерный ряд, доступные размеры. Данные — из БД."],
      ["Выбор размера и количества, добавление позиции в заказ", "Нельзя выбрать недоступный размер и количество больше остатка."],
      ["Подтвердить заказ (сохранить дату) или отказаться на любом этапе"],
      ["После оформления обновить каталог и пересчитать остатки"],
      ["Комментарии — только к неочевидным местам"],
      ["Загрузить результаты в репозиторий"]
    ],
    tips: [
      "Сначала сделайте одну функцию «получить видимый список» — она берёт все три параметра (категория, строка поиска, сортировка), и вызывайте её из любого события. Так совместная работа получится сама.",
      "Заказ оформляйте в транзакции: вставка заказа, вставка позиций и списание остатка — либо всё, либо ничего."
    ]
  },
  {
    n: 4,
    title: "Добавление в функционал Администратора и Менеджера возможности работы с заказами",
    activity: "Осуществление интеграции программных модулей",
    minutes: 60,
    pa: false,
    points: "25 баллов: интеграция модулей — 21, выбор способов решения задач — 4",
    goal: "Для ролей Менеджер и Администратор добавить список заказов, добавление и удаление, просмотр состава, а для Администратора — редактирование. Сдать всё в репозиторий.",
    steps: [
      ["Список заказов для Менеджера и Администратора", "В списке — дата заказа и ФИО клиента."],
      ["Добавление и удаление заказов", "Предусмотреть предупреждение перед необратимым удалением."],
      ["Добавление заказа через каталог", "Выбор товара с поиском по наименованию → форма товара → размер и количество пар."],
      ["Просмотр состава заказа", "Товарная позиция (наименование и производство, размер), количество, цена за единицу, итоговая сумма по заказу."],
      ["Администратор: изменить дату заказа и удалить товарные позиции", "У Менеджера этих функций быть не должно."],
      ["После любого изменения обновлять список заказов", "Суммы и доступные остатки пересчитываются. При удалении позиций или заказа остаток возвращается."],
      ["Загрузить в репозиторий исходный код структурой файлов, а не архивом"],
      ["Приложить исполняемые файлы, скрипт БД (или .dt для 1С), ER-диаграмму PDF и прочие файлы"],
      ["Создать README.md с описанием функциональности", "Без общих фраз, только реализованные возможности."]
    ],
    tips: [
      "Разграничение прав держите в одном месте (по роли пользователя после входа) и скрывайте ненужные кнопки у Менеджера, а не просто отключайте обработчик.",
      "Если формулировка кажется двусмысленной (например, «позиции»: товарные позиции или заказы), задайте эксперту вопрос по трактовке — ответ получат все."
    ]
  }
];

const TIMER_MODES = {
  pa: { label: "ПА", segments: [50, 40] },
  bu: { label: "ГИА ДЭ БУ", segments: [50, 40, 60, 60] }
};

const SCORES = {
  pa: [
    ["Разработка объектов БД по результатам анализа предметной области", 12],
    ["Реализация БД в конкретной СУБД", 3],
    ["Формирование алгоритмов разработки программных модулей", 2],
    ["Разработка программных модулей по техническому заданию", 6],
    ["Отладка программных модулей специализированными средствами", 2]
  ],
  bu: [
    ["Разработка объектов БД по результатам анализа предметной области", 12],
    ["Реализация БД в конкретной СУБД", 3],
    ["Формирование алгоритмов разработки программных модулей", 2],
    ["Разработка программных модулей по техническому заданию", 6],
    ["Отладка программных модулей специализированными средствами", 2],
    ["Модификация отдельных компонент ПО по потребностям заказчика", 22],
    ["Использование современных средств поиска, анализа и интерпретации информации", 3],
    ["Интеграция модулей в программное обеспечение", 21],
    ["Выбор способов решения задач в различных контекстах", 4]
  ]
};

const ERRORS = [
  {
    task: "Задание 1 · База данных",
    items: [
      "Выделены все сущности, нужные для работы системы",
      "Нет нарушений 3НФ (например, роль хранится не текстом в таблице пользователей)",
      "После импорта проверено количество записей — загружены все данные",
      "Порядок импорта соблюдён (заказы не загружались раньше товаров)",
      "Скрипт БД содержит не только CREATE TABLE, но и INSERT с данными",
      "На ER-диаграмме обозначены первичные и внешние ключи",
      "Данные нормализованы перед импортом, а не загружены «как есть»",
      "Единый стиль имён: snake_case и CamelCase не смешаны в одной базе"
    ]
  },
  {
    task: "Задание 2 · Алгоритмы и приложение",
    items: [
      "Алгоритмы работы системы и расчёта цены реализованы в коде, а не описаны текстом",
      "В названии приложения есть название компании-заказчика",
      "Интерфейс соответствует руководству по стилю: цвета, шрифты, логотип, иконка, заголовки окон",
      "В каталоге есть все поля: изображение, категория, наименование, цена, индикатор «много/мало»",
      "«Много/мало» считается по сумме пар всех размеров, порог — строго больше 5",
      "Подсветка светло-красным срабатывает при остатке ≤ 3 и не срабатывает иначе",
      "Имена идентификаторов отражают назначение и соответствуют стилю (CamelCase / snake_case / 1С)",
      "В одной строке кода — не более одной команды",
      "При отсутствии изображения показывается picture.png",
      "Приложение не падает при ошибках — отладка выполнена"
    ]
  },
  {
    task: "Задание 3 · Интерфейс и заказ",
    items: [
      "После входа в правом верхнем углу отображается ФИО пользователя",
      "Есть навигация между окнами и кнопка «Назад»",
      "Заголовки окон соответствуют их назначению",
      "Исключения обрабатываются — приложение не закрывается аварийно",
      "Некорректные значения блокируются, пользователь видит пояснение",
      "Поиск, фильтрация и сортировка работают совместно и в реальном времени, без кнопки",
      "Форма товара открывается по одинарному клику из списка, а не иначе",
      "При открытии формы все поля и размеры подгружены из БД и актуальны",
      "Все обязательные поля формы есть: изображение, цена со скидкой, состав, размерный ряд",
      "Нельзя выбрать недоступный размер",
      "Нельзя заказать количество больше доступного остатка",
      "После оформления заказа каталог обновляется, остатки пересчитаны",
      "Есть возможность отказаться от заказа на любом этапе",
      "Комментарии есть только там, где код неочевиден, и нет комментариев к очевидному",
      "Имена переменных отражают назначение, стиль единый"
    ]
  },
  {
    task: "Задание 4 · Заказы и сдача",
    items: [
      "Список заказов для Менеджера и Администратора выводится, видны дата и ФИО клиента",
      "Можно добавлять позиции в заказ",
      "Можно удалять позиции из заказа",
      "При добавлении заказа товары выбираются из каталога с поиском по наименованию и открывается форма товара",
      "Менеджер и Администратор видят состав заказа: товарная позиция, размер, количество, цена за единицу, итого",
      "У Администратора есть редактирование заказов: изменение даты и удаление позиций",
      "После добавления / изменения / удаления список заказов обновляется",
      "Исходный код загружен структурой файлов, а не архивом",
      "В репозитории есть скрипт БД, .dt для 1С (если нужен) и ER-диаграмма в PDF",
      "В репозитории есть README.md с описанием функциональности"
    ]
  }
];

const SUBMIT_ITEMS = [
  "Исходный код приложения — структурой с файлами, не архивом",
  "Исполняемые файлы",
  "Файл скрипта базы данных (структура и данные)",
  "Файл конфигурации с данными .dt для платформы «1С» (если решаете на 1С)",
  "ER-диаграмма в формате PDF",
  "Прочие графические и текстовые файлы",
  "README.md в корне репозитория с описанием функциональности"
];

const SNIPPETS = [
  {
    title: "Схема БД в 3НФ (PostgreSQL)",
    desc: "Типовая схема для заказа обуви. Подгоните имена и поля под Приложение 1 вашего варианта.",
    tabs: {
      "Алгоритм": [
        "Выпишите сущности: пользователь, роль, категория, производитель, товар (модель), размер/остаток, заказ, позиция заказа.",
        "Всё повторяющееся (роль, категория, производитель) вынесите в справочники и ссылайтесь по ключу.",
        "Остаток хранится на пару «модель + размер» — это таблица со составным ключом.",
        "Позиция заказа ссылается на пару «модель + размер» составным внешним ключом: так нельзя заказать несуществующий размер.",
        "Все ограничения называйте явно (pk_..., fk_...). Поведение ON DELETE выбирайте по смыслу.",
        "Справочники создавайте и грузите первыми."
      ],
      "SQL": `CREATE TABLE role (
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
);`
    }
  },
  {
    title: "Подготовка и импорт данных",
    desc: "Файлы заказчика не идеальны — сначала загрузите «сырые» данные в промежуточную таблицу, затем разложите по справочникам.",
    tabs: {
      "Алгоритм": [
        "Откройте каждый .xlsx: какие колонки, где объединённые ячейки, пробелы, дубли, русские названия вместо кодов.",
        "Сохраните листы в CSV (UTF-8) или используйте мастер импорта клиента БД.",
        "Загрузите в промежуточные таблицы staging_*, где все поля текстовые.",
        "Наполните справочники через SELECT DISTINCT с TRIM.",
        "Загрузите товары, остатки, пользователей, затем заказы и состав.",
        "Сравните COUNT(*) с числом строк в исходных файлах.",
        "Удалите staging-таблицы или оставьте в скрипте — но структура должна воспроизводиться."
      ],
      "SQL": `-- справочники из сырых данных (названия колонок — пример)
INSERT INTO category (category_name)
SELECT DISTINCT TRIM(category_name)
FROM staging_product
WHERE category_name IS NOT NULL;

INSERT INTO manufacturer (manufacturer_name)
SELECT DISTINCT TRIM(manufacturer_name)
FROM staging_product
WHERE manufacturer_name IS NOT NULL;

-- товары: подставляем ключи справочников
INSERT INTO product (product_name, description, composition, price, image_file, category_id, manufacturer_id)
SELECT TRIM(s.product_name), s.description, s.composition, REPLACE(s.price, ',', '.')::NUMERIC,
       NULLIF(TRIM(s.image_file), ''), c.category_id, m.manufacturer_id
FROM staging_product s
JOIN category c ON c.category_name = TRIM(s.category_name)
JOIN manufacturer m ON m.manufacturer_name = TRIM(s.manufacturer_name);

-- проверка количества строк
SELECT 'product' AS table_name, COUNT(*) AS row_count FROM product
UNION ALL
SELECT 'app_user', COUNT(*) FROM app_user
UNION ALL
SELECT 'customer_order', COUNT(*) FROM customer_order
UNION ALL
SELECT 'order_item', COUNT(*) FROM order_item;`
    }
  },
  {
    title: "Цена со скидкой, метка «много/мало», подсветка",
    desc: "Скидка 25% — на товары без заказов в предыдущем календарном месяце. «Много» — больше 5 пар суммарно, подсветка — не больше 3.",
    tabs: {
      "Алгоритм": [
        "Определите границы прошлого календарного месяца относительно сегодняшней даты: с 1-го числа прошлого месяца (включительно) по 1-е число текущего (не включительно).",
        "Получите множество товаров, у которых есть заказы в этих границах.",
        "Для каждой модели: если её нет в множестве — цена × 0,75, иначе цена без изменений.",
        "Просуммируйте остатки по всем размерам модели.",
        "Сумма > 5 → «много», иначе «мало». Сумма ≤ 3 → фон карточки светло-красный.",
        "Не забудьте модели без остатков (сумма 0) и без заказов."
      ],
      "SQL": `-- каталог: сумма остатков и признак скидки
SELECT p.product_id, p.product_name, c.category_name, m.manufacturer_name,
       p.composition, p.price, p.image_file,
       COALESCE(SUM(ps.quantity), 0) AS total_quantity,
       NOT EXISTS (
           SELECT 1
           FROM order_item oi
           JOIN customer_order o ON o.order_id = oi.order_id
           WHERE oi.product_id = p.product_id
             AND o.order_date >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
             AND o.order_date <  date_trunc('month', CURRENT_DATE)
       ) AS has_discount
FROM product p
JOIN category c ON c.category_id = p.category_id
JOIN manufacturer m ON m.manufacturer_id = p.manufacturer_id
LEFT JOIN product_size ps ON ps.product_id = p.product_id
GROUP BY p.product_id, c.category_name, m.manufacturer_name;`,
      "Python": `from datetime import date
from decimal import Decimal

DISCOUNT_RATE = Decimal("0.25")
MANY_PAIRS_LIMIT = 5
LOW_STOCK_LIMIT = 3
LOW_STOCK_COLOR = "#ffb3b3"
DEFAULT_COLOR = "#ffffff"


def previous_month_bounds(today):
    first_day_this_month = today.replace(day=1)
    if first_day_this_month.month == 1:
        first_day_previous = date(first_day_this_month.year - 1, 12, 1)
    else:
        first_day_previous = date(first_day_this_month.year, first_day_this_month.month - 1, 1)
    return first_day_previous, first_day_this_month


def load_ids_with_orders_last_month(cursor, today):
    start, end = previous_month_bounds(today)
    cursor.execute(
        "SELECT DISTINCT oi.product_id FROM order_item oi "
        "JOIN customer_order o ON o.order_id = oi.order_id "
        "WHERE o.order_date >= %s AND o.order_date < %s",
        (start, end),
    )
    return {row[0] for row in cursor.fetchall()}


def calc_final_price(price, had_orders_last_month):
    if had_orders_last_month:
        return price
    return (price * (1 - DISCOUNT_RATE)).quantize(Decimal("0.01"))


def stock_label(total_quantity):
    if total_quantity > MANY_PAIRS_LIMIT:
        return "много"
    return "мало"


def card_color(total_quantity):
    if total_quantity <= LOW_STOCK_LIMIT:
        return LOW_STOCK_COLOR
    return DEFAULT_COLOR`,
      "C#": `public static class CatalogRules
{
    private const decimal DiscountRate = 0.25m;
    private const int ManyPairsLimit = 5;
    private const int LowStockLimit = 3;

    public static (DateTime Start, DateTime End) PreviousMonthBounds(DateTime today)
    {
        var firstDayThisMonth = new DateTime(today.Year, today.Month, 1);
        return (firstDayThisMonth.AddMonths(-1), firstDayThisMonth);
    }

    public static decimal CalcFinalPrice(decimal price, bool hadOrdersLastMonth)
    {
        if (hadOrdersLastMonth)
        {
            return price;
        }

        return Math.Round(price * (1 - DiscountRate), 2, MidpointRounding.AwayFromZero);
    }

    public static string StockLabel(int totalQuantity)
    {
        return totalQuantity > ManyPairsLimit ? "много" : "мало";
    }

    public static bool IsLowStock(int totalQuantity)
    {
        return totalQuantity <= LowStockLimit;
    }
}`
    }
  },
  {
    title: "Поиск, фильтр и сортировка в реальном времени",
    desc: "Одна функция получает все три параметра сразу — так они работают совместно, а сортировка не сбрасывается.",
    tabs: {
      "Алгоритм": [
        "Загрузите каталог и список категорий из БД один раз; в памяти держите полный список.",
        "Заполните выпадающий список категорий: первым элементом «Все категории», затем категории из БД.",
        "Сделайте функцию «видимые товары(категория, текст, направление сортировки)».",
        "Внутри: пропустить товары чужой категории (если выбрана не «Все»); пропустить товары, где текст не встречается ни в наименовании, ни в описании (без учёта регистра); затем отсортировать по цене со скидкой.",
        "Подпишитесь на изменение текста поиска и на выбор в обоих списках — каждое событие вызывает эту функцию и перерисовывает каталог.",
        "Кнопки «Найти» быть не должно."
      ],
      "Python": `ALL_CATEGORIES = "Все категории"
SORT_ASCENDING = "Цена: по возрастанию"
SORT_DESCENDING = "Цена: по убыванию"


def get_visible_products(products, category_name, search_text, sort_mode):
    query = search_text.strip().lower()
    visible = []
    for product in products:
        if category_name != ALL_CATEGORIES and product.category != category_name:
            continue
        in_name = query in product.name.lower()
        in_description = query in (product.description or "").lower()
        if query and not (in_name or in_description):
            continue
        visible.append(product)
    visible.sort(key=lambda item: item.final_price, reverse=(sort_mode == SORT_DESCENDING))
    return visible


# tkinter: каждое изменение переменной сразу перерисовывает каталог
self.search_var = tk.StringVar()
self.category_var = tk.StringVar(value=ALL_CATEGORIES)
self.sort_var = tk.StringVar(value=SORT_ASCENDING)
for variable in (self.search_var, self.category_var, self.sort_var):
    variable.trace_add("write", self.on_filters_changed)


def on_filters_changed(self, *_):
    products = get_visible_products(
        self.all_products, self.category_var.get(), self.search_var.get(), self.sort_var.get()
    )
    self.render_catalog(products)`,
      "C#": `private const string AllCategories = "Все категории";

private IEnumerable<ProductView> GetVisibleProducts()
{
    var query = searchTextBox.Text.Trim();
    var selectedCategory = categoryComboBox.SelectedItem as string ?? AllCategories;

    var products = allProducts.Where(product =>
        (selectedCategory == AllCategories || product.Category == selectedCategory)
        && (query.Length == 0
            || product.Name.Contains(query, StringComparison.CurrentCultureIgnoreCase)
            || (product.Description ?? "").Contains(query, StringComparison.CurrentCultureIgnoreCase)));

    return sortComboBox.SelectedIndex == 1
        ? products.OrderByDescending(product => product.FinalPrice)
        : products.OrderBy(product => product.FinalPrice);
}

private void RefreshCatalog(object sender, EventArgs e)
{
    RenderCatalog(GetVisibleProducts().ToList());
}

// в конструкторе формы — один обработчик на три источника
searchTextBox.TextChanged += RefreshCatalog;
categoryComboBox.SelectedIndexChanged += RefreshCatalog;
sortComboBox.SelectedIndexChanged += RefreshCatalog;`
    }
  },
  {
    title: "Вход по логину, сообщения, права",
    desc: "Вход без пароля; ФИО справа вверху; окна сообщений с заголовком и пиктограммой.",
    tabs: {
      "Алгоритм": [
        "Поле логина: если пусто — предупреждение с подсказкой, что нужно ввести.",
        "Найти пользователя по логину в БД. Не нашли — окно «Ошибка» с текстом, что делать.",
        "Сохранить текущего пользователя (ФИО + роль) в одном объекте и передать в следующие окна.",
        "В главном окне вывести ФИО в правом верхнем углу.",
        "Роль определяет доступные кнопки: Менеджер видит заказы, Администратор — плюс редактирование.",
        "Все обращения к БД и конвертации оберните в try / except: при сбое показать понятное окно, а не упасть."
      ],
      "Python": `from tkinter import messagebox


def try_login(login_text, find_user):
    login = login_text.strip()
    if not login:
        messagebox.showwarning("Вход", "Введите логин и нажмите «Войти».")
        return None
    try:
        user = find_user(login)
    except Exception:
        messagebox.showerror("Ошибка подключения", "Не удалось связаться с базой данных. Проверьте, что СУБД запущена, и повторите вход.")
        return None
    if user is None:
        messagebox.showerror("Вход", "Пользователь с таким логином не найден. Проверьте логин из списка пользователей.")
        return None
    return user


def confirm_delete(order_id):
    return messagebox.askyesno(
        "Подтверждение удаления",
        f"Заказ № {order_id} будет удалён без возможности восстановления. Продолжить?",
        icon="warning",
    )`,
      "C#": `private void LoginButton_Click(object sender, EventArgs e)
{
    var login = loginTextBox.Text.Trim();
    if (login.Length == 0)
    {
        MessageBox.Show("Введите логин и нажмите «Войти».", "Вход",
            MessageBoxButtons.OK, MessageBoxIcon.Warning);
        return;
    }

    try
    {
        var user = userRepository.FindByLogin(login);
        if (user == null)
        {
            MessageBox.Show("Пользователь с таким логином не найден. Проверьте логин из списка пользователей.",
                "Вход", MessageBoxButtons.OK, MessageBoxIcon.Error);
            return;
        }

        CurrentSession.User = user;
        new CatalogForm().Show();
        Hide();
    }
    catch (NpgsqlException)
    {
        MessageBox.Show("Не удалось связаться с базой данных. Проверьте, что СУБД запущена, и повторите вход.",
            "Ошибка подключения", MessageBoxButtons.OK, MessageBoxIcon.Error);
    }
}

// в главной форме: ФИО справа вверху
userNameLabel.Text = CurrentSession.User.FullName;
userNameLabel.Anchor = AnchorStyles.Top | AnchorStyles.Right;`
    }
  },
  {
    title: "Оформление заказа и работа с заказами",
    desc: "Заказ — одна транзакция: вставка заказа и позиций + списание остатка. Удаление возвращает остаток.",
    tabs: {
      "Алгоритм": [
        "Корзина хранит позиции: модель, размер, количество. Количество не больше остатка выбранного размера.",
        "«Подтвердить»: открыть транзакцию → вставить заказ с датой → для каждой позиции списать остаток и вставить позицию.",
        "Если остатка не хватает (кто-то успел раньше) — откат всей транзакции и сообщение пользователю.",
        "После успеха: очистить корзину, обновить каталог и пересчитать остатки.",
        "«Отказаться»: просто очистить корзину — в БД ничего не пишется.",
        "Удаление заказа или позиции возвращает количество в остаток; изменение даты (Администратор) остатков не трогает.",
        "Итог по заказу = сумма (цена за единицу × количество) по позициям."
      ],
      "SQL": `-- состав заказа с итогом (цена за единицу считается так же, как в каталоге)
SELECT p.product_name, m.manufacturer_name, oi.size_value, oi.quantity, p.price
FROM order_item oi
JOIN product p ON p.product_id = oi.product_id
JOIN manufacturer m ON m.manufacturer_id = p.manufacturer_id
WHERE oi.order_id = 1
ORDER BY p.product_name, oi.size_value;

-- безопасное списание остатка: 0 строк = остатка не хватило
UPDATE product_size
SET quantity = quantity - 2
WHERE product_id = 1 AND size_value = 42 AND quantity >= 2;`,
      "Python": `def confirm_order(connection, customer_id, cart_items):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO customer_order (order_date, customer_id) "
                "VALUES (CURRENT_DATE, %s) RETURNING order_id",
                (customer_id,),
            )
            order_id = cursor.fetchone()[0]
            for item in cart_items:
                cursor.execute(
                    "UPDATE product_size SET quantity = quantity - %s "
                    "WHERE product_id = %s AND size_value = %s AND quantity >= %s",
                    (item.quantity, item.product_id, item.size_value, item.quantity),
                )
                if cursor.rowcount == 0:
                    raise ValueError(f"Недостаточно пар: {item.product_name}, размер {item.size_value}")
                cursor.execute(
                    "INSERT INTO order_item (order_id, product_id, size_value, quantity) "
                    "VALUES (%s, %s, %s, %s)",
                    (order_id, item.product_id, item.size_value, item.quantity),
                )
    return order_id


def delete_order(connection, order_id):
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(
                "UPDATE product_size ps SET quantity = ps.quantity + oi.quantity "
                "FROM order_item oi WHERE oi.order_id = %s "
                "AND ps.product_id = oi.product_id AND ps.size_value = oi.size_value",
                (order_id,),
            )
            cursor.execute("DELETE FROM customer_order WHERE order_id = %s", (order_id,))


def calc_order_total(order_items):
    return sum(item.unit_price * item.quantity for item in order_items)`,
      "C#": `public int ConfirmOrder(NpgsqlDataSource dataSource, int customerId, IReadOnlyList<CartItem> cartItems)
{
    using var connection = dataSource.OpenConnection();
    using var transaction = connection.BeginTransaction();

    using var insertOrder = new NpgsqlCommand(
        "INSERT INTO customer_order (order_date, customer_id) VALUES (CURRENT_DATE, @customerId) RETURNING order_id",
        connection, transaction);
    insertOrder.Parameters.AddWithValue("customerId", customerId);
    var orderId = (int)insertOrder.ExecuteScalar()!;

    foreach (var item in cartItems)
    {
        using var takeStock = new NpgsqlCommand(
            "UPDATE product_size SET quantity = quantity - @quantity " +
            "WHERE product_id = @productId AND size_value = @size AND quantity >= @quantity",
            connection, transaction);
        takeStock.Parameters.AddWithValue("quantity", item.Quantity);
        takeStock.Parameters.AddWithValue("productId", item.ProductId);
        takeStock.Parameters.AddWithValue("size", item.SizeValue);

        if (takeStock.ExecuteNonQuery() == 0)
        {
            transaction.Rollback();
            throw new InvalidOperationException($"Недостаточно пар: {item.ProductName}, размер {item.SizeValue}");
        }

        using var insertItem = new NpgsqlCommand(
            "INSERT INTO order_item (order_id, product_id, size_value, quantity) " +
            "VALUES (@orderId, @productId, @size, @quantity)",
            connection, transaction);
        insertItem.Parameters.AddWithValue("orderId", orderId);
        insertItem.Parameters.AddWithValue("productId", item.ProductId);
        insertItem.Parameters.AddWithValue("size", item.SizeValue);
        insertItem.Parameters.AddWithValue("quantity", item.Quantity);
        insertItem.ExecuteNonQuery();
    }

    transaction.Commit();
    return orderId;
}`
    }
  }
];

/* ---------- helpers ---------- */

function el(tag, props, children) {
  const node = document.createElement(tag);
  if (props) {
    Object.keys(props).forEach(function (key) {
      if (key === "class") {
        node.className = props[key];
      } else if (key === "text") {
        node.textContent = props[key];
      } else {
        node.setAttribute(key, props[key]);
      }
    });
  }
  (children || []).forEach(function (child) {
    node.append(child);
  });
  return node;
}

function formatMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours + " ч " + String(minutes).padStart(2, "0") + " мин";
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function clockText(totalSeconds) {
  const sign = totalSeconds < 0 ? "+" : "";
  const abs = Math.abs(totalSeconds);
  return sign + pad(Math.floor(abs / 3600)) + ":" + pad(Math.floor((abs % 3600) / 60)) + ":" + pad(abs % 60);
}

/* ---------- progress ---------- */

function taskProgress(task) {
  const total = task.steps.length;
  let done = 0;
  for (let i = 0; i < total; i += 1) {
    if (state.checks["t" + task.n + ":" + i]) {
      done += 1;
    }
  }
  return { done: done, total: total };
}

function updateProgress() {
  let done = 0;
  let total = 0;
  TASKS.forEach(function (task) {
    const progress = taskProgress(task);
    done += progress.done;
    total += progress.total;
    const side = document.getElementById("taskSide" + task.n);
    if (side) {
      side.querySelector(".pct").textContent = Math.round((progress.done / progress.total) * 100) + "%";
      side.querySelector(".cnt").textContent = progress.done + " из " + progress.total;
    }
  });
  SUBMIT_ITEMS.forEach(function (item, index) {
    total += 1;
    if (state.checks["s:" + index]) {
      done += 1;
    }
  });
  const percent = total ? Math.round((done / total) * 100) : 0;
  document.getElementById("totalBar").style.width = percent + "%";
  document.getElementById("totalPct").textContent = percent + "%";
  updateErrorSummary();
}

function updateErrorSummary() {
  let total = 0;
  let checked = 0;
  ERRORS.forEach(function (group, groupIndex) {
    let groupChecked = 0;
    group.items.forEach(function (item, itemIndex) {
      total += 1;
      if (state.errors[groupIndex + ":" + itemIndex]) {
        checked += 1;
        groupChecked += 1;
      }
    });
    const counter = document.getElementById("errCount" + groupIndex);
    if (counter) {
      counter.textContent = groupChecked + " из " + group.items.length;
    }
  });
  const summary = document.getElementById("errSummary");
  const left = total - checked;
  summary.replaceChildren(
    el("span", { class: "big", text: checked + " / " + total }),
    el("span", { text: left === 0 ? "Все пункты проверены — можно сдавать." : "Осталось проверить: " + left + ". Каждый непроверенный пункт — потенциально потерянные баллы." })
  );
}

function checkItem(key, labelText, hintText, store, onChange) {
  const input = el("input", { type: "checkbox" });
  input.checked = Boolean(store[key]);
  input.addEventListener("change", function () {
    if (input.checked) {
      store[key] = true;
    } else {
      delete store[key];
    }
    saveState();
    onChange();
  });
  const textNode = el("span", { text: labelText });
  if (hintText) {
    textNode.append(el("small", { text: hintText }));
  }
  return el("li", null, [el("label", null, [input, textNode])]);
}

/* ---------- render: tasks ---------- */

function renderTasks() {
  const root = document.getElementById("taskList");
  TASKS.forEach(function (task, index) {
    const summary = el("summary", null, [
      el("div", { class: "task-num", text: String(task.n) }),
      el("div", null, [
        el("div", { class: "task-title" }, [
          document.createTextNode(task.title),
          task.pa ? el("span", { class: "tag", text: "ПА" }) : document.createTextNode("")
        ]),
        el("div", { class: "task-meta", text: task.activity + " · " + task.minutes + " мин" })
      ]),
      el("div", { class: "task-side", id: "taskSide" + task.n }, [
        el("span", { class: "pct", text: "0%" }),
        el("span", { class: "cnt", text: "" })
      ])
    ]);

    const list = el("ul", { class: "checklist" });
    task.steps.forEach(function (step, stepIndex) {
      list.append(checkItem("t" + task.n + ":" + stepIndex, step[0], step[1], state.checks, updateProgress));
    });

    const body = el("div", { class: "task-body" }, [
      el("p", null, [el("b", { text: "Баллы: " }), document.createTextNode(task.points)]),
      el("p", { text: task.goal }),
      el("h4", { text: "Чек-лист" }),
      list,
      el("h4", { text: "Советы" })
    ]);
    task.tips.forEach(function (tip) {
      body.append(el("div", { class: "tip", text: tip }));
    });

    const details = el("details", { class: "task" }, [summary, body]);
    if (index === 0) {
      details.open = true;
    }
    root.append(details);
  });
}

/* ---------- render: scoring ---------- */

function renderBars(rootId, rows) {
  const root = document.getElementById(rootId);
  const maxValue = 22;
  let sum = 0;
  rows.forEach(function (row) {
    sum += row[1];
    root.append(el("div", { class: "bar-row" }, [
      el("div", { class: "bar-label" }, [el("span", { text: row[0] }), el("b", { text: row[1] + " б." })]),
      el("div", { class: "bar-track" }, [el("div", { class: "bar-fill", style: "width:" + (row[1] / maxValue) * 100 + "%" })])
    ]));
  });
  root.append(el("div", { class: "bar-total" }, [el("span", { text: "Итого" }), el("span", { text: sum + " б." })]));
}

/* ---------- render: snippets ---------- */

function renderSnippets() {
  const root = document.getElementById("snippets");
  SNIPPETS.forEach(function (snippet) {
    const tabNames = Object.keys(snippet.tabs);
    const tabBar = el("div", { class: "tabs", role: "tablist" });
    const panel = el("div");

    function show(name) {
      Array.from(tabBar.children).forEach(function (button) {
        button.classList.toggle("active", button.textContent === name);
      });
      const content = snippet.tabs[name];
      if (Array.isArray(content)) {
        const ol = el("ol");
        content.forEach(function (line) {
          ol.append(el("li", { text: line }));
        });
        panel.replaceChildren(el("div", { class: "algo" }, [ol]));
        return;
      }
      const pre = el("pre");
      pre.textContent = content;
      const copy = el("button", { class: "copy", type: "button", text: "Копировать" });
      copy.addEventListener("click", function () {
        copyText(content, copy);
      });
      panel.replaceChildren(el("div", { class: "code-block" }, [copy, pre]));
    }

    tabNames.forEach(function (name) {
      const button = el("button", { type: "button", role: "tab", text: name });
      button.addEventListener("click", function () {
        show(name);
      });
      tabBar.append(button);
    });

    root.append(el("div", { class: "snip" }, [
      el("div", { class: "snip-head" }, [el("h3", { text: snippet.title }), el("p", { text: snippet.desc })]),
      tabBar,
      panel
    ]));
    show(tabNames[0]);
  });
}

function copyText(text, button) {
  const done = function () {
    const old = button.textContent;
    button.textContent = "Скопировано";
    setTimeout(function () {
      button.textContent = old;
    }, 1400);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done, function () {});
  }
}

/* ---------- render: errors, submit ---------- */

function renderErrors() {
  const root = document.getElementById("errorList");
  ERRORS.forEach(function (group, groupIndex) {
    const list = el("ul", { class: "checklist" });
    group.items.forEach(function (item, itemIndex) {
      list.append(checkItem(groupIndex + ":" + itemIndex, item, "", state.errors, updateErrorSummary));
    });
    root.append(el("div", { class: "err-group" }, [
      el("h3", null, [el("span", { text: group.task, style: "color:var(--text);font-weight:600;font-size:16px" }), el("span", { id: "errCount" + groupIndex, text: "" })]),
      list
    ]));
  });
  document.getElementById("errReset").addEventListener("click", function () {
    state.errors = {};
    saveState();
    document.querySelectorAll("#errorList input").forEach(function (input) {
      input.checked = false;
    });
    updateErrorSummary();
  });
}

function renderSubmit() {
  const root = document.getElementById("submitList");
  SUBMIT_ITEMS.forEach(function (item, index) {
    root.append(checkItem("s:" + index, item, "", state.checks, updateProgress));
  });
}

/* ---------- timer ---------- */

const timer = {
  mode: state.timerMode || "bu",
  running: false,
  startedAt: 0,
  elapsedBefore: 0
};

if (state.timer && state.timer.mode === timer.mode) {
  timer.running = Boolean(state.timer.running);
  timer.startedAt = state.timer.startedAt || 0;
  timer.elapsedBefore = state.timer.elapsedBefore || 0;
}

function timerElapsedSeconds() {
  const extra = timer.running ? Date.now() - timer.startedAt : 0;
  return Math.floor((timer.elapsedBefore + extra) / 1000);
}

function persistTimer() {
  state.timerMode = timer.mode;
  state.timer = { mode: timer.mode, running: timer.running, startedAt: timer.startedAt, elapsedBefore: timer.elapsedBefore };
  saveState();
}

function buildTimerStatic() {
  const segments = TIMER_MODES[timer.mode].segments;
  const total = segments.reduce(function (a, b) { return a + b; }, 0);
  const timeline = document.getElementById("timeline");
  timeline.replaceChildren();
  segments.forEach(function (minutes, index) {
    const seg = el("div", { class: "seg", style: "width:" + (minutes / total) * 100 + "%", title: "Задание " + (index + 1) + " · " + minutes + " мин" }, [
      el("div", { class: "fill", id: "fill" + index })
    ]);
    timeline.append(seg);
  });

  const tbody = document.querySelector("#timerTable tbody");
  tbody.replaceChildren();
  let cumulative = 0;
  segments.forEach(function (minutes, index) {
    cumulative += minutes;
    tbody.append(el("tr", { id: "row" + index }, [
      el("td", { text: "Задание " + (index + 1) }),
      el("td", { text: TASKS[index].activity }),
      el("td", { text: minutes + " мин" }),
      el("td", { text: "к " + formatMinutes(cumulative) })
    ]));
  });

  document.getElementById("modePA").classList.toggle("active", timer.mode === "pa");
  document.getElementById("modeBU").classList.toggle("active", timer.mode === "bu");
}

function tickTimer() {
  const segments = TIMER_MODES[timer.mode].segments;
  const totalSeconds = segments.reduce(function (a, b) { return a + b; }, 0) * 60;
  const elapsed = timerElapsedSeconds();
  const remaining = totalSeconds - elapsed;

  const display = document.getElementById("timerDisplay");
  display.textContent = clockText(remaining);
  const mini = document.getElementById("miniTimer");
  mini.hidden = !(timer.running || elapsed > 0);
  mini.textContent = clockText(remaining);
  mini.classList.toggle("late", remaining < 0);

  let boundary = 0;
  let currentIndex = -1;
  segments.forEach(function (minutes, index) {
    const start = boundary;
    boundary += minutes * 60;
    const fill = document.getElementById("fill" + index);
    const part = Math.min(Math.max(elapsed - start, 0), minutes * 60);
    if (fill) {
      fill.style.width = (part / (minutes * 60)) * 100 + "%";
    }
    if (currentIndex === -1 && elapsed < boundary) {
      currentIndex = index;
    }
    const row = document.getElementById("row" + index);
    if (row) {
      row.classList.toggle("cur", currentIndex === index && (timer.running || elapsed > 0));
    }
  });

  const now = document.getElementById("timerNow");
  if (elapsed === 0 && !timer.running) {
    now.textContent = "Готовы? Задание 1 — " + segments[0] + " мин";
  } else if (currentIndex === -1) {
    now.textContent = "Время вышло — загрузите результат в репозиторий";
  } else {
    now.textContent = "Сейчас: задание " + (currentIndex + 1) + " · по плану до " + formatMinutes(segments.slice(0, currentIndex + 1).reduce(function (a, b) { return a + b; }, 0));
  }

  const alertBox = document.getElementById("timerAlert");
  let message = "";
  if (elapsed > 0 || timer.running) {
    if (remaining <= 0) {
      message = "Время экзамена закончилось.";
    } else if (remaining <= 300) {
      message = "Осталось 5 минут: загружайте результаты в репозиторий.";
    } else if (remaining <= 1800) {
      message = "Осталось 30 минут.";
    } else if (remaining <= 3600) {
      message = "Остался 1 час.";
    }
  }
  alertBox.hidden = !message;
  alertBox.textContent = message;
  document.getElementById("timerStart").textContent = timer.running ? "Пауза" : (elapsed > 0 ? "Продолжить" : "Старт");
}

function initTimer() {
  buildTimerStatic();
  tickTimer();
  setInterval(tickTimer, 500);

  document.getElementById("timerStart").addEventListener("click", function () {
    if (timer.running) {
      timer.elapsedBefore += Date.now() - timer.startedAt;
      timer.running = false;
    } else {
      timer.startedAt = Date.now();
      timer.running = true;
    }
    persistTimer();
    tickTimer();
  });

  document.getElementById("timerReset").addEventListener("click", function () {
    timer.running = false;
    timer.elapsedBefore = 0;
    timer.startedAt = 0;
    persistTimer();
    tickTimer();
  });

  function switchMode(mode) {
    if (mode === timer.mode) {
      return;
    }
    if (timerElapsedSeconds() > 0 && !window.confirm("Смена режима сбросит таймер. Продолжить?")) {
      return;
    }
    timer.mode = mode;
    timer.running = false;
    timer.elapsedBefore = 0;
    timer.startedAt = 0;
    persistTimer();
    buildTimerStatic();
    tickTimer();
  }

  document.getElementById("modePA").addEventListener("click", function () { switchMode("pa"); });
  document.getElementById("modeBU").addEventListener("click", function () { switchMode("bu"); });
}

/* ---------- misc ---------- */

function initNavHighlight() {
  const links = Array.from(document.querySelectorAll(".nav a"));
  const sections = links.map(function (link) {
    return document.querySelector(link.getAttribute("href"));
  });
  if (!("IntersectionObserver" in window)) {
    return;
  }
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        links.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  sections.forEach(function (section) {
    if (section) {
      observer.observe(section);
    }
  });
}

function initCopyButtons() {
  document.querySelectorAll("button.copy[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      copyText(document.getElementById(button.dataset.copy).textContent, button);
    });
  });
}

document.getElementById("resetAll").addEventListener("click", function () {
  if (window.confirm("Сбросить все отметки и таймер?")) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // нечего очищать
    }
    window.location.reload();
  }
});

renderBars("barsPA", SCORES.pa);
renderBars("barsBU", SCORES.bu);
renderTasks();
renderSnippets();
renderErrors();
renderSubmit();
initCopyButtons();
initTimer();
initNavHighlight();
updateProgress();
