import { useBooking } from "../context/BookingContext";
import { getBookedSeats } from "../services/BookingService";
import styles from "./SeatMap.module.css";

/**
 * Генерує масив рядів сидінь для вагона.
 * Розкладка: 2 місця зліва | прохід | 2 місця справа.
 * Для Плацкарту — додаткові бічні місця після основних рядів.
 */
function buildRows(wagon) {
  const seats = Array.from({ length: wagon.totalSeats }, (_, i) => i + 1);
  const isPlatzkart = wagon.type === "Плацкарт";
  const isLux = wagon.type === "Люкс";

  if (isLux) {
    // 2 місця на ряд (1 зліва + 1 справа)
    const rows = [];
    for (let i = 0; i < seats.length; i += 2) {
      rows.push([seats[i], null, seats[i + 1] ?? null]);
    }
    return rows;
  }

  if (isPlatzkart) {
    // 36 основних (4 на ряд) + 18 бічних (2 на ряд)
    const main = seats.slice(0, 36);
    const side = seats.slice(36);
    const rows = [];
    for (let i = 0; i < main.length; i += 4) {
      rows.push([main[i], main[i + 1], main[i + 2], main[i + 3]]);
    }
    rows.push("side-separator");
    for (let i = 0; i < side.length; i += 2) {
      rows.push([side[i], null, side[i + 1] ?? null]);
    }
    return rows;
  }

  // Стандарт: 4 на ряд (2+2)
  const rows = [];
  for (let i = 0; i < seats.length; i += 4) {
    rows.push([
      seats[i],
      seats[i + 1] ?? null,
      seats[i + 2] ?? null,
      seats[i + 3] ?? null,
    ]);
  }
  return rows;
}

export default function SeatMap({ wagon, trainId }) {
  const { selectedSeats, toggleSeat } = useBooking();

  const savedBooked = getBookedSeats(trainId, wagon.id);
  const allBooked = new Set([...wagon.bookedSeats, ...savedBooked]);

  const rows = buildRows(wagon);
  const isPlatzkart = wagon.type === "Плацкарт";
  const isLux = wagon.type === "Люкс";
  const narrow = isLux;

  function seatStatus(num) {
    if (num === null) return "empty";
    if (allBooked.has(num)) return "booked";
    if (selectedSeats.includes(num)) return "selected";
    return "free";
  }

  function handleClick(num) {
    const status = seatStatus(num);
    if (status === "booked" || num === null) return;
    toggleSeat(num);
  }

  const legend = [
    { key: "free", label: "Вільне" },
    { key: "selected", label: "Обране" },
    { key: "booked", label: "Зайняте" },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Вагон №{wagon.number} — {wagon.type}
        </h2>
        {selectedSeats.length > 0 && (
          <span className={styles.chosen}>
            Обрано: {selectedSeats.sort((a, b) => a - b).join(", ")}
          </span>
        )}
      </div>

      <div className={`${styles.car} ${narrow ? styles.narrow : ""}`}>
        <div className={styles.cabHead}>🚂</div>

        <div className={styles.grid}>
          {rows.map((row, ri) => {
            if (row === "side-separator") {
              return (
                <div key="side-sep" className={styles.separator}>
                  бічні місця
                </div>
              );
            }

            const [a, b, c, d] = row;

            if (narrow || isLux) {
              return (
                <div key={ri} className={styles.row}>
                  <Seat num={a} status={seatStatus(a)} onClick={handleClick} />
                  <div className={styles.aisle} />
                  <Seat num={c} status={seatStatus(c)} onClick={handleClick} />
                </div>
              );
            }

            if (isPlatzkart && c !== undefined && d === undefined) {
              // бічне місце (2 місця на ряд)
              return (
                <div key={ri} className={styles.row}>
                  <Seat num={a} status={seatStatus(a)} onClick={handleClick} />
                  <div className={styles.aisle} />
                  <Seat num={b} status={seatStatus(b)} onClick={handleClick} />
                </div>
              );
            }

            return (
              <div key={ri} className={styles.row}>
                <Seat num={a} status={seatStatus(a)} onClick={handleClick} />
                <Seat num={b} status={seatStatus(b)} onClick={handleClick} />
                <div className={styles.aisle} />
                <Seat num={c} status={seatStatus(c)} onClick={handleClick} />
                <Seat num={d} status={seatStatus(d)} onClick={handleClick} />
              </div>
            );
          })}
        </div>

        <div className={styles.cabTail}>🚃</div>
      </div>

      <div className={styles.legend}>
        {legend.map(({ key, label }) => (
          <div key={key} className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles[key]}`} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Seat({ num, status, onClick }) {
  if (num === null) return <div className={styles.seatPlaceholder} />;
  return (
    <button
      className={`${styles.seat} ${styles[status]}`}
      onClick={() => onClick(num)}
      disabled={status === "booked"}
      title={`Місце ${num}`}
    >
      {num}
    </button>
  );
}
