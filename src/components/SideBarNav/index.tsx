import { signOut } from "next-auth/client";
import { FaHome, FaAward, FaPowerOff } from "react-icons/fa";

import { ActiveLink } from "../ActiveLink";

import styles from "../../styles/components/SideBarNav.module.css";

export function SideBarNav() {
  return (
    <aside className={styles.sideBarNav}>
      <img src="icons/logo.svg" alt="move.it" />
      <section>
        <ActiveLink activeClassName={styles.active} href="/">
          <a>
            <FaHome color="#666666" size={30} />
          </a>
        </ActiveLink>
        <ActiveLink activeClassName={styles.active} href="/leaderboard">
          <a>
            <FaAward style={{ marginTop: "2rem" }} color="#666666" size={30} />
          </a>
        </ActiveLink>
      </section>
      <button type="button" onClick={() => signOut()}>
        <FaPowerOff color="#e83f5b" size={20} />
      </button>
    </aside>
  );
}
