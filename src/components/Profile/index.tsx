import { useChallenge } from "../../contexts/ChallengesContext";

import styles from "../../styles/components/Profile.module.css";

export function Profile() {
  const { level } = useChallenge();

  return (
    <div className={styles.profileContainer}>
      <img src="https://github.com/mathwcruz.png" alt="Matheus da Cruz" />
      <div>
        <strong>Matheus da Cruz</strong>
        <p>
          <img src="icons/level.svg" alt="Level" />
          Level {level}
        </p>
      </div>
    </div>
  );
}
