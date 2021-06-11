import styles from "../../styles/components/UserMoveItInformations.module.css";

interface User {
  avatarUrl: string;
  name: string;
  level: number;
  completedChallenges: number;
  experience: number;
  lastChallengeCompletedDate: string;
}

interface UserMoveItInformationsProps {
  user: User;
}

export function UserMoveItInformations({ user }: UserMoveItInformationsProps) {
  return (
    <div className={styles.userMoveitInformations}>
      <section>
        <img src={user?.avatarUrl} alt={user?.name} />
        <div>
          <h2>{user?.name}</h2>
          <p>
            <img src="/icons/level.svg" alt="Level" />
            Level <strong>{user?.level}</strong>
          </p>
          <p>
            <strong>{user?.completedChallenges}</strong> desafios completados
          </p>
          <h3>
            <small>{user?.experience}</small> xp
          </h3>
          <h4>
            Última atividade em{" "}
            <strong>{user?.lastChallengeCompletedDate}</strong>
          </h4>
        </div>
      </section>
    </div>
  );
}
