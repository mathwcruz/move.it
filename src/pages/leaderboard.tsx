import { GetServerSideProps } from "next";
import Head from "next/head";
import { getSession } from "next-auth/client";
import { FaArrowRight } from "react-icons/fa";

import { SideBarNav } from "../components/SideBarNav";

import styles from "../styles/pages/Leaderboard.module.css";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  challenges: number;
}

interface LeaderboardProps {
  user: User;
}

export default function Leaderboard({}: LeaderboardProps) {
  return (
    <>
      <Head>
        <title>Leaderboard | move.it</title>
      </Head>
      <div className={styles.sideBarNavContainer}>
        <SideBarNav />
        <div className={styles.leaderboardContainer}>
          <h2>Leaderboard</h2>
          <table>
            <thead>
              <tr>
                <th>Posição</th>
                <th>Usuário</th>
                <th>Desafios</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Matheus da Cruz</td>
                <td>
                  <span>130</span> completados
                </td>
                <td>
                  <Link href="/">
                    <a>
                      Ver perfil
                      <FaArrowRight size={14} color="#4953b8" />
                    </a>
                  </Link>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jonatan Aguiar</td>
                <td>
                  <span>114</span> completados
                </td>
                <td>
                  <Link href="/">
                    <a>
                      Ver perfil
                      <FaArrowRight size={14} color="#4953b8" />
                    </a>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
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
