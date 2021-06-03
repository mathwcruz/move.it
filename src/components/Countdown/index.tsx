import { useState, useEffect, useCallback } from "react";

import styles from "../../styles/components/Countdown.module.css";

export function Countdown() {
  const [time, setTime] = useState(25 * 60); // => 25 minutos
  const [active, setActive] = useState(false);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const [minuteLeft, minuteRight] = String(minutes).padStart(2, "0").split(""); // => '1' '5'
  const [secondLeft, secondRight] = String(seconds).padStart(2, "0").split(""); // => '0' '9'

  const startCountdown = useCallback(() => {
    setActive(true);
  }, []);

  useEffect(() => {
    if (active && time > 0) {
      // se o ciclo estiver ativo e o tempo nao estiver acabado
      setTimeout(() => {
        // a cada 1 segundo, irá reduzir 1 segundo do time
        setTime(time - 1);
      }, 1000);
    }
  }, [active, time]);

  return (
    <>
      <div className={styles.countdownContainer}>
        <div>
          <span>{minuteLeft}</span>
          <span>{minuteRight}</span>
        </div>
        <span>:</span>
        <div>
          <span>{secondLeft}</span>
          <span>{secondRight}</span>
        </div>
      </div>
      <button
        type="button"
        className={styles.countdownButton}
        onClick={startCountdown}
      >
        Iniciar um ciclo
      </button>
    </>
  );
}
