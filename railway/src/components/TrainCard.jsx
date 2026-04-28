import { useNavigate } from "react-router-dom";
import styles from "./TrainCard.module.css";

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "short",
  });
}

export default function TrainCard({ train }) {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.number}>№ {train.number}</span>
        <span className={styles.type}>{train.type}</span>
      </div>

      <div className={styles.route}>
        <div className={styles.station}>
          <span className={styles.time}>{formatTime(train.departure)}</span>
          <span className={styles.city}>{train.from}</span>
          <span className={styles.date}>{formatDate(train.departure)}</span>
        </div>

        <div className={styles.line}>
          <span className={styles.duration}>{train.duration}</span>
          <div className={styles.track}>
            <div className={styles.dot} />
            <div className={styles.dash} />
            <div className={styles.arrow}>›</div>
          </div>
        </div>

        <div className={`${styles.station} ${styles.stationRight}`}>
          <span className={styles.time}>{formatTime(train.arrival)}</span>
          <span className={styles.city}>{train.to}</span>
          <span className={styles.date}>{formatDate(train.arrival)}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.wagons}>
          {train.wagons.map((w) => (
            <span key={w.id} className={styles.wagonBadge}>
              {w.type}
            </span>
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
