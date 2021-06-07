import { SideBarNav } from "../components/SideBarNav";

import styles from "../styles/pages/Leaderboard.module.css";

export default function Leaderboard() {
  return (
    <div className={styles.sideBarNavContainer}>
      <SideBarNav />
      <div className={styles.leaderboardContainer}>
        <h1>teste</h1>
      </div>
    </div>
  );
}
