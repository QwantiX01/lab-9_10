import { useBooking } from "../context/BookingContext";
import styles from "./WagonSelector.module.css";

export default function WagonSelector({ wagons }) {
  const { selectedWagonId, selectWagon } = useBooking();

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.label}>Оберіть вагон</h2>
      <div className={styles.list}>
        {wagons.map((wagon) => (
          <button
            key={wagon.id}
            className={`${styles.btn} ${
              selectedWagonId === wagon.id ? styles.active : ""
            }`}
            onClick={() => selectWagon(wagon.id)}
          >
            <span className={styles.num}>№{wagon.number}</span>
            <span className={styles.type}>{wagon.type}</span>
            <span className={styles.seats}>
              {wagon.totalSeats - wagon.bookedSeats.length} вільних
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
