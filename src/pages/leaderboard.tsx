import { GetServerSideProps } from "next";
import Link from "next/link";
import Head from "next/head";
import { getSession } from "next-auth/client";
import { FaArrowRight } from "react-icons/fa";

import { SideBarNav } from "../components/SideBarNav";

import { api } from "../services/api";

import styles from "../styles/pages/Leaderboard.module.css";

interface User {
  id: string;
  name: string;
  completedChallenges: number;
}

interface LeaderboardProps {
  users: User[];
}

// VER SE TEM COMO COLOCAR UM SPIN ENQUANTO OS DADOS NÃO CARREGAM

export default function Leaderboard({ users }: LeaderboardProps) {
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
              {users?.map((user, index) => (
                <tr key={user?.id}>
                  <td>{`${index + 1}º`}</td>
                  <td>{user?.name}</td>
                  <td>
                    <span>{user?.completedChallenges}</span> completados
                  </td>
                  <td>
                    <Link href={`/users/${user?.id}`}>
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
  const session = await getSession({ req }); // pegando os dados da sessão do user
  const { data } = await api.get("/users", {
    // pegando os usuários e ordenando pelo total de desafios completados
    params: {
      _sort: "completed_challenges",
      _order: "desc",
    },
  });

  const users = data?.map((user) => {
    // formatando os dados do user para o front
    return {
      id: user?.id,
      name: user?.name,
      completedChallenges: user?.completed_challenges,
    };
  });

  if (!session) {
    // caso o user nao esteja autenticado, redireciona ele para a tela de autenticação
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
