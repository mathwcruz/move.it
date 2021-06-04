import { useState, useEffect, useCallback } from "react";

import { useChallenge } from "../../contexts/ChallengesContext";

import styles from "../../styles/components/Countdown.module.css";

let countdownTimeout: NodeJS.Timeout;

export function Countdown() {
  const { startNewChallenge } = useChallenge();

  const [time, setTime] = useState(0.05 * 60); // => 25 minutos
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const [minuteLeft, minuteRight] = String(minutes).padStart(2, "0").split(""); // => '1' '5'
  const [secondLeft, secondRight] = String(seconds).padStart(2, "0").split(""); // => '0' '9'

  const startCountdown = useCallback(() => {
    setIsActive(true);
  }, []);

  const resetCountdown = useCallback(() => {
    clearTimeout(countdownTimeout);

    setIsActive(false);
    setTime(0.05 * 60);
  }, []);

  useEffect(() => {
    if (isActive && time > 0) {
      // se o ciclo estiver ativo e o tempo nao estiver acabado
      countdownTimeout = setTimeout(() => {
        // a cada 1 segundo, irá reduzir 1 segundo do time
        setTime(time - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      setHasFinished(true);
      setIsActive(false);

      startNewChallenge();
    }
  }, [isActive, time]);

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

      {hasFinished ? (
        <button disabled className={styles.countdownButton}>
          Ciclo encerrado
        </button>
      ) : (
        <>
          {!isActive ? (
            <button
              type="button"
              className={styles.countdownButton}
              onClick={startCountdown}
            >
              Iniciar um ciclo
            </button>
          ) : (
            <button
              type="button"
              className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
              onClick={resetCountdown}
            >
              Abandonar ciclo
            </button>
          )}
        </>
      )}
    </>
  );
}
