#set page(paper: "a4", margin: 2cm)
#set text(
  font: "Iosevka Charon",
  size: 14pt,
)
#set par(justify: true, leading: 1.1em)
#set heading(numbering: "1.")

#show heading.where(level: 1): set text(size: 16pt, weight: "bold")
#show heading.where(level: 1): set block(above: 2.5em, below: 1.5em)
#show heading.where(level: 2): set text(size: 14pt, weight: "bold")
#show heading.where(level: 2): set block(above: 2.5em, below: 1.5em)

#show raw: set text(font: "Adwaita Mono", size: 9pt)
#show raw.where(block: true): block => rect(
  width: 100%,
  fill: luma(245),
  inset: 12pt,
  radius: 2pt,
  stroke: 1pt + luma(200),
  block,
)

#align(center)[
  #text(weight: "bold", size: 14pt)[МІНІСТЕРСТВО ОСВІТИ І НАУКИ УКРАЇНИ] \
  #text(size: 14pt)[Львівський національний університет імені Івана Франка] \
  #text(size: 14pt)[Факультету електроніки та комп'ютерних технологій] \

  #v(6cm)

  #text(weight: "bold", size: 18pt)[ЗВІТ] \
  з лабораторної роботи №9 \

  #v(0.5cm)
  *Курс:* Веб програмування на стороні клієнту \
  *Тема:* Список потягів та рейсів. Модель системи продажу залізничних квитків
]

#v(3cm)

#align(right)[
  #box(width: 10cm, align(right)[
    *Виконав:* \
    Студент 2 курсу, \
    групи ФЕІ-27с - Біжик Ю. В. \
    \
    *Перевірив:* \
    Асистент \
    Жишкович А.В.
  ])
]

#align(center + bottom)[
  Львів – 2026
]

#pagebreak()

= Тема роботи
Список потягів та рейсів. Реалізація першої частини моделі системи продажу залізничних квитків (аналог Укрзалізниці) на React.

= Мета роботи
Створити React-застосунок для відображення списку залізничних рейсів із функцією пошуку та фільтрації, закріпити навички роботи з компонентами, props, useState, react-router-dom та CSS Modules.

= Завдання
Реалізувати React-застосунок із наступним функціоналом:

- відображення списку потягів у вигляді карток з інформацією про номер, маршрут, час відправлення/прибуття та тривалість поїздки;
- пошук і фільтрація рейсів за містом відправлення, прибуття, номером потяга або типом;
- навігація до сторінки бронювання при натисканні кнопки «Обрати місця»;
- адаптивний інтерфейс з використанням CSS Modules.

Застосунок має складатися з компонентів `TrainCard` та `TrainList`, сторінки `Home`, мок-даних у `trains.js` та налаштованого роутингу через `react-router-dom`.

#pagebreak()

= Хід роботи

== Структура проєкту та налаштування

Проєкт створено за допомогою Vite з шаблоном React. Для стилізації використано CSS Modules. Маршрутизація реалізована через `react-router-dom` v6. Встановлені залежності: `react-router-dom`.

Структура файлів проєкту:

```
src/
├── components/
│   ├── TrainCard.jsx
│   ├── TrainCard.module.css
│   ├── TrainList.jsx
│   └── TrainList.module.css
├── data/
│   └── trains.js
├── pages/
│   ├── Home.jsx
│   └── Home.module.css
├── App.jsx
├── main.jsx
└── index.css
```

Репозиторій проєкту: #link("https://github.com/QwantiX01/lab-9_10.git")[github.com/QwantiX01/lab-9\_10]

== Мок-дані потягів

Дані про рейси зберігаються у файлі `src/data/trains.js` у вигляді масиву об'єктів. Кожен об'єкт містить поля `id`, `number`, `from`, `to`, `departure`, `arrival`, `duration`, `type` та масив `wagons`. Масив `wagons` використовуватиметься у лабораторній роботі №10.

```js
export const trains = [
  {
    id: "1",
    number: "748К",
    from: "Київ",
    to: "Львів",
    departure: "2025-06-01T06:30:00",
    arrival: "2025-06-01T12:00:00",
    duration: "5г 30хв",
    type: "Інтерсіті+",
    wagons: [
      { id: "w1", number: 1, type: "Комфорт",
        totalSeats: 40, bookedSeats: [3, 7, 12, 19, 22] },
      ...
    ],
  },
  ...
]
```

== Компонент TrainCard

Компонент `TrainCard` отримує об'єкт потяга через props і відображає картку рейсу. Час відправлення та прибуття форматується через `Date.toLocaleTimeString` з локаллю `uk-UA`. При натисканні кнопки «Обрати місця» викликається `useNavigate` з `react-router-dom` для переходу на маршрут `/booking/:trainId`.

```tsx
import { useNavigate } from "react-router-dom";
import styles from "./TrainCard.module.css";

export default function TrainCard({ train }) {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.number}>№ {train.number}</span>
        <span className={styles.type}>{train.type}</span>
      </div>
      <div className={styles.route}>
        {/* час, місто відправлення, лінія маршруту, місто прибуття */}
      </div>
      <div className={styles.footer}>
        <div className={styles.wagons}>
          {train.wagons.map((w) => (
            <span key={w.id} className={styles.wagonBadge}>{w.type}</span>
          ))}
        </div>
        <button
          className={styles.btn}
          onClick={() => navigate(`/booking/${train.id}`)}
        >
          Обрати місця
        </button>
      </div>
    </div>
  );
}
```

== Компонент TrainList та пошук

Компонент `TrainList` реалізує поле пошуку та відображає відфільтрований список карток. Стан рядка пошуку зберігається через `useState`. Фільтрація виконується методом `.filter()` і перевіряє входження запиту у поля `from`, `to`, `number` та `type` без урахування регістру. Якщо результатів немає — відображається повідомлення з текстом запиту.

```tsx
export default function TrainList({ trains }) {
  const [query, setQuery] = useState("");

  const filtered = trains.filter((t) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      t.from.toLowerCase().includes(q) ||
      t.to.toLowerCase().includes(q) ||
      t.number.toLowerCase().includes(q) ||
      t.type.toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBar}>
        <input
          className={styles.input}
          type="text"
          placeholder="Місто, номер потяга або тип..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className={styles.list}>
        {filtered.map((train) => (
          <TrainCard key={train.id} train={train} />
        ))}
      </div>
    </div>
  );
}
```

== Сторінка Home та маршрутизація

Сторінка `Home` імпортує мок-дані та передає їх у компонент `TrainList`. `App.jsx` налаштовує роутинг через `BrowserRouter` та `Routes`. Маршрут `/booking/:trainId` залишено у вигляді коментаря — буде реалізований у лабораторній роботі №10.

```tsx
// App.jsx
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
```

= Висновок
У ході виконання лабораторної роботи створено React-застосунок для відображення списку залізничних рейсів. Реалізовано компоненти `TrainCard` і `TrainList`, мок-дані у `trains.js`, пошук за кількома полями через `.filter()`, маршрутизацію через `react-router-dom` та стилізацію через CSS Modules. Набуто практичні навички компонентного підходу, роботи з `useState`, передачі даних через props і навігації між сторінками в React.
