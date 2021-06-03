import Head from "next/head";

import { Countdown } from "../components/Countdown";
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from "../components/Profile";
import { CompletedChallenges } from "../components/CompletedChallenges";

import styles from "../styles/pages/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Início | move.it</title>
      </Head>
      <ExperienceBar />
      <section>
        <div className={styles.leftContainer}>
          <Profile />
          <CompletedChallenges />
          <Countdown />
        </div>
        <div className={styles.rightContainer}></div>
      </section>
    </div>
  );
}
