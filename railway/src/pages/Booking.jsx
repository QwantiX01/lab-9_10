import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { trains } from "../data/trains";
import { useBooking } from "../context/BookingContext";
import { saveBooking } from "../services/BookingService";
import WagonSelector from "../components/WagonSelector";
import SeatMap from "../components/SeatMap";
import BookingForm from "../components/BookingForm";
import styles from "./Booking.module.css";

export default function Booking() {
  const { trainId } = useParams();
  const navigate = useNavigate();
  const { selectedWagonId, selectedSeats, clearSelection } = useBooking();

  const train = trains.find((t) => t.id === trainId);

  if (!train) {
    return (
      <div className={styles.notFound}>
        <p>Рейс не знайдено.</p>
        <button className={styles.backBtn} onClick={() => navigate("/")}>
          ← Назад
        </button>
      </div>
    );
  }

  const selectedWagon = train.wagons.find((w) => w.id === selectedWagonId);

  function formatTime(iso) {
    return new Date(iso).toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function handleBooking(person) {
    saveBooking({
      trainId: train.id,
      wagonId: selectedWagonId,
      seats: selectedSeats,
      person,
    });

    toast.success(
      `✅ Заброньовано місця ${selectedSeats.sort((a, b) => a - b).join(", ")} у вагоні №${selectedWagon.number}`,
      { autoClose: 5000 },
    );

    clearSelection();
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          className={styles.back}
          onClick={() => {
            clearSelection();
            navigate("/");
          }}
        >
          ← Назад
        </button>
        <div className={styles.trainInfo}>
          <span className={styles.trainNum}>№ {train.number}</span>
          <span className={styles.route}>
            {train.from} → {train.to}
          </span>
          <span className={styles.time}>
            {formatTime(train.departure)} · {train.duration}
          </span>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <WagonSelector wagons={train.wagons} />
        </section>

        {selectedWagon && (
          <>
            <section className={styles.section}>
              <SeatMap wagon={selectedWagon} trainId={train.id} />
            </section>

            <section className={styles.section}>
              <BookingForm
                selectedSeats={selectedSeats}
                onSubmit={handleBooking}
              />
            </section>
          </>
        )}

        {!selectedWagon && (
          <p className={styles.prompt}>
            Оберіть вагон щоб побачити схему місць
          </p>
        )}
      </main>
    </div>
  );
}
