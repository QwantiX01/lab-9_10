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

#show raw: set text(font: "Adwaita Mono", size: 11pt)
#show raw.where(block: true): block => rect(
  width: 100%,
  fill: luma(245),
  inset: 12pt,
  radius: 4pt,
  stroke: 1pt + luma(200),
  block,
)

#align(center)[
  #text(weight: "bold", size: 14pt)[МІНІСТЕРСТВО ОСВІТИ І НАУКИ УКРАЇНИ] \
  #text(size: 14pt)[Львівський національний університет імені Івана Франка] \
  #text(size: 14pt)[Факультету електроніки та комп'ютерних технологій] \

  #v(6cm)

  #text(weight: "bold", size: 18pt)[ЗВІТ] \
  з лабораторної роботи №10 \

  #v(0.5cm)
  *Курс:* Веб програмування на стороні клієнту \
  *Тема:* Бронювання місць у вагоні. Система продажу залізничних квитків
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
Бронювання місць у вагоні. Розширення React-застосунку системи продажу залізничних квитків (Укрзалізниця).

= Мета роботи
Розширити застосунок із лабораторної роботи №9 функціоналом інтерактивного вибору вагона і місць, реалізувати форму бронювання з валідацією, глобальне управління станом через React Context та збереження бронювань у `localStorage`.

= Завдання
Розширити React-застосунок системи продажу залізничних квитків наступним функціоналом:
- вибір вагона зі списку доступних у рейсі;
- інтерактивна схема місць вагона з візуальною індикацією стану (вільне, обране, зайняте);
- вибір кількох місць одночасно;
- форма бронювання з полями «Ім'я та прізвище», «Телефон», «Email» та валідацією;
- збереження бронювань у `localStorage` і відновлення зайнятих місць між сесіями;
- повідомлення про успішне бронювання через `react-toastify`.

Глобальний стан (обраний вагон, обрані місця) зберігати через React Context API. Навігація між сторінками — через `react-router-dom` v6.

#pagebreak()
= Хід роботи

== Розширення структури проєкту

До проєкту з лабораторної роботи №9 додано нові директорії та файли. У `src/context/` розміщено `BookingContext.jsx` — провайдер глобального стану. У `src/services/` розміщено `BookingService.js` — модуль роботи з `localStorage`. До `src/components/` додано три нових компоненти: `WagonSelector`, `SeatMap` та `BookingForm`. У `src/pages/` додано сторінку `Booking.jsx`. Файл `App.jsx` оновлено: додано новий маршрут `/booking/:trainId`, підключено `BookingProvider` та `ToastContainer`.

== BookingContext та BookingService

`BookingContext` реалізує глобальне сховище стану для поточного сеансу бронювання. Контекст зберігає ідентифікатор обраного вагона та масив обраних номерів місць. Функція `selectWagon` змінює активний вагон і скидає масив місць, щоб уникнути невалідних даних при переключенні. Функція `toggleSeat` додає або видаляє місце з масиву. Хук `useBooking` виконує доступ до контексту та перевіряє наявність провайдера у дереві компонентів.

```tsx
export function BookingProvider({ children }) {
  const [selectedWagonId, setSelectedWagonId] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])

  function selectWagon(wagonId) {
    setSelectedWagonId(wagonId)
    setSelectedSeats([])
  }

  function toggleSeat(seatNum) {
    setSelectedSeats(prev =>
      prev.includes(seatNum)
        ? prev.filter(s => s !== seatNum)
        : [...prev, seatNum]
    )
  }

  function clearSelection() {...}

  return (
    <BookingContext.Provider value={{ selectedWagonId, selectedSeats,
      selectWagon, toggleSeat, clearSelection }}>
      {children}
    </BookingContext.Provider>
  )
}
```

`BookingService` — модуль без стану, який інкапсулює роботу з `localStorage`. Функція `saveBooking` додає новий запис бронювання з унікальним `id` (генерується через `crypto.randomUUID()`), ідентифікаторами рейсу і вагона, масивом місць, персональними даними та міткою часу. Функція `getBookedSeats` повертає об'єднаний масив зайнятих місць для конкретного вагона, зчитуючи всі збережені бронювання з `localStorage`.

== Компоненти WagonSelector та SeatMap

`WagonSelector` отримує масив вагонів рейсу та відображає їх у вигляді кнопок-карток. Кожна картка показує номер вагона, тип та кількість вільних місць. Активний вагон виділяється акцентним кольором. При натисканні викликається `selectWagon` з контексту.

`SeatMap` — ключовий компонент, що будує візуальну схему місць. Функція `buildRows` розбиває місця вагона на ряди залежно від типу: для більшості вагонів використовується стандартне розташування 2+2 (два місця зліва, прохід, два справа); для «Люкс» — по одному місцю з кожного боку; для «Плацкарту» — 36 основних місць (4 у ряді) та 18 бічних (2 у ряді) з роздільником. Стан кожного місця визначається функцією `seatStatus`: місце є зайнятим, якщо його номер присутній у `bookedSeats` вагона або серед збережених бронювань з `localStorage`; обраним — якщо присутній у `selectedSeats` контексту; інакше — вільним.

```tsx
function buildRows(wagon) {
  const seats = Array.from({ length: wagon.totalSeats }, (_, i) => i + 1)
  const isPlatzkart = wagon.type === "Плацкарт"

  if (isPlatzkart) {
    const main = seats.slice(0, 36)
    const side = seats.slice(36)
    const rows = []
    for (let i = 0; i < main.length; i += 4) {
      rows.push([main[i], main[i+1], main[i+2], main[i+3]])
    }
    rows.push("side-separator")
    for (let i = 0; i < side.length; i += 2) {
      rows.push([side[i], null, side[i+1] ?? null])
    }
    return rows
  }
  // стандарт: 4 у ряді (2+2)
  const rows = []
  for (let i = 0; i < seats.length; i += 4) {
    rows.push([seats[i], seats[i+1] ?? null, seats[i+2] ?? null, seats[i+3] ?? null])
  }
  return rows
}
```

== Компонент BookingForm та валідація

`BookingForm` відображає форму з трьома полями: «Ім'я та прізвище», «Телефон», «Email». Валідація виконується при відправці форми та при виході з поля (`onBlur`). Ім'я перевіряється на мінімальну довжину (2 символи), телефон — регулярним виразом для українських номерів, email — стандартним виразом на наявність символу `@` та домену. Помилки відображаються під відповідними полями. Кнопка «Забронювати» заблокована, якщо не обрано жодного місця.

```tsx
const PHONE_RE = /^(\+?38)?0\d{9}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate({ name, phone, email }) {
  const errors = {}
  if (!name.trim() || name.trim().length < 2)
    errors.name = "Введіть ім'я (мін. 2 символи)"
  if (!PHONE_RE.test(phone.replace(/[\s\-()]/g, "")))
    errors.phone = "Невірний формат телефону (напр. 0671234567)"
  if (!EMAIL_RE.test(email.trim()))
    errors.email = "Невірний формат email"
  return errors
}
```

== Сторінка Booking та маршрутизація

Сторінка `Booking` доступна за маршрутом `/booking/:trainId`. Вона отримує `trainId` через хук `useParams` та знаходить відповідний рейс у масиві `trains`. Якщо рейс не знайдено, відображається повідомлення про помилку з кнопкою повернення. Сторінка послідовно рендерить `WagonSelector`, а після вибору вагона — `SeatMap` та `BookingForm`. При успішній відправці форми викликається `saveBooking` з `BookingService`, після чого відображається toast-повідомлення через `react-toastify` і стан вибору скидається через `clearSelection`. У `App.jsx` `BookingProvider` огортає весь застосунок, щоб контекст був доступний на обох сторінках.

```tsx
function handleBooking(person) {
  saveBooking({
    trainId: train.id,
    wagonId: selectedWagonId,
    seats: selectedSeats,
    person,
  })

  toast.success(
    `✅ Заброньовано місця ${selectedSeats.sort((a, b) => a - b).join(", ")}
     у вагоні №${selectedWagon.number}`,
    { autoClose: 5000 }
  )

  clearSelection()
}
```

== Результат роботи застосунку

Застосунок коректно відображає схему місць обраного вагона з трьома станами: вільне (зелений), обране (синій), зайняте (червоний). Після бронювання зайняті місця зберігаються у `localStorage` та коректно відновлюються при наступному відкритті сторінки бронювання. Форма валідує дані в реальному часі. Після успішного бронювання відображається toast-повідомлення із переліком заброньованих місць.

= Висновок
У ході виконання лабораторної роботи застосунок із лабораторної роботи №9 розширено повноцінним модулем бронювання місць. Реалізовано глобальне управління станом через React Context API з дотриманням принципу єдиного джерела правди. Опрацьовано роботу з `localStorage` для збереження даних між сесіями. Набуто практичні навички проєктування інтерактивних UI-компонентів, реалізації клієнтської валідації форм та організації багатосторінкової навігації у React-застосунку.
