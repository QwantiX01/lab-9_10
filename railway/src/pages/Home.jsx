import { trains } from "../data/trains";
import TrainList from "../components/TrainList";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.badge}>Укрзалізниця</span>
          <h1 className={styles.title}>
            Залізничні <br />
            <span className={styles.accent}>квитки онлайн</span>
          </h1>
          <p className={styles.subtitle}>
            Знайдіть потрібний рейс та забронюйте місце за хвилину
          </p>
        </div>
      </header>

      <main className={styles.main}>
        <TrainList trains={trains} />
      </main>
    </div>
  );
}
