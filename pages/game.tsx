import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "../components/Button";
import styles from "./_index.module.css";

export default function IndexPage() {
  return (
    <div className={styles.container}>
      <Helmet>
        <title>घर के अंदर | Ghar Ke Andar</title>
      </Helmet>
      <div className={styles.content}>
        <h1 className={styles.title}>घर के अंदर</h1>
        <h2 className={styles.subtitle}>Family Dialogues</h2>
        <div className={styles.introBlock}>
          <p className={styles.poeticText}>
            Ek 17-saal ki ladki. Ek ghar.<br />
            Bohot saari baatein jo kehni hain...<br />
            par kaise?
          </p>
        </div>
        <div className={styles.actionBlock}>
          <Button asChild size="lg" className={styles.startButton}>
            <Link to="/game">Shuru Karein &rarr;</Link>
          </Button>
        </div>
      </div>
      <div className={styles.footer}>
        An interactive story about family, feelings, and finding your voice
      </div>
    </div>
  );
}
