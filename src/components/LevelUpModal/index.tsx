import { useChallenge } from "../../contexts/ChallengesContext";

import styles from "../../styles/components/LevelUpModal.module.css";

export function LevelUpModal() {
  const { level, closeLevelUpModal } = useChallenge();

  return (
    <div className={styles.levelUpModalOverlay}>
      <div className={styles.levelUpModalContainer}>
        <img src="logo-full.svg" alt="move.it" />
        <header>{level}</header>

        <strong>Parabéns</strong>
        <p>Você alcançou um novo level.</p>

        <button onClick={closeLevelUpModal} type="button">
          <img src="icons/close.svg" alt="Fechar modal" />
        </button>
      </div>
    </div>
  );
}
