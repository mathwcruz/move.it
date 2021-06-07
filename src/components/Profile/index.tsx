import { useSession } from "next-auth/client";

import { useChallenge } from "../../contexts/ChallengesContext";

import styles from "../../styles/components/Profile.module.css";

export function Profile() {
  const { level } = useChallenge();
  const [session] = useSession();

  return (
    <div className={styles.profileContainer}>
      <img src={session?.user?.image} alt={session?.user?.name} />
      <div>
        <strong>{session?.user?.name}</strong>
        <p>
          <img src="icons/level.svg" alt="Level" />
          Level {level}
        </p>
      </div>
    </div>
  );
}
