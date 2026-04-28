import { useState } from "react";
import TrainCard from "./TrainCard";
import styles from "./TrainList.module.css";

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
        <span className={styles.searchIcon}>⌕</span>
        <input
          className={styles.input}
          type="text"
          placeholder="Місто, номер потяга або тип..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className={styles.clear} onClick={() => setQuery("")}>
            ✕
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🚂</span>
          <p>Рейсів не знайдено за запитом «{query}»</p>
        </div>
      ) : (
        <>
          <p className={styles.count}>
            Знайдено рейсів: <strong>{filtered.length}</strong>
          </p>
          <div className={styles.list}>
            {filtered.map((train) => (
              <TrainCard key={train.id} train={train} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
