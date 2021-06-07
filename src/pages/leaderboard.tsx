import { GetServerSideProps } from "next";
import Head from "next/head";
import { getSession } from "next-auth/client";

import { SideBarNav } from "../components/SideBarNav";

import styles from "../styles/pages/Leaderboard.module.css";

export default function Leaderboard() {
  return (
    <>
      <Head>
        <title>Leaderboard | move.it</title>
      </Head>
      <div className={styles.sideBarNavContainer}>
        <SideBarNav />
        <div className={styles.leaderboardContainer}>
          <h1>teste</h1>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
