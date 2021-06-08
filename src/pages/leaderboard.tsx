import { GetServerSideProps } from "next";
import Head from "next/head";
import { getSession } from "next-auth/client";
import { FaArrowRight } from "react-icons/fa";

import { SideBarNav } from "../components/SideBarNav";

import { api } from "../services/api";

import styles from "../styles/pages/Leaderboard.module.css";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  challenges: number;
}

interface LeaderboardProps {
  users: User[];
}

export default function Leaderboard({ users }: LeaderboardProps) {
  console.log({ users });

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
              {users.map((user, index) => (
                <tr key={user?.id}>
                  <td>{index + 1}</td>
                  <td>{user?.name}</td>
                  <td>
                    <span>{user?.challenges}</span> completados
                  </td>
                  <td>
                    <Link href={`https://github.com/${user?.id}`}>
                      <a>
                        Ver perfil
                        <FaArrowRight size={14} color="#4953b8" />
                      </a>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  const { data } = await api.get("/users", {
    params: {
      _sort: "challenges", //ordenando pelo valor do "challenges"
      _order: "desc", // em ordem decrescente
    },
  });

  const users = data.map((user) => {
    return {
      id: user?.id,
      name: user?.name,
      challenges: user?.challenges,
    };
  });

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {
      users,
    },
  };
};
