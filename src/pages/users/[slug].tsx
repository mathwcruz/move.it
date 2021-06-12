import Head from "next/head";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";

import axios from "axios";

import { RepositoriesList } from "../../components/UserRepositories/RepositoriesList";
import { SideBarNav } from "../../components/SideBarNav";
import { UserGithubInformations } from "../../components/UserInformations/UserGithubInformations";
import { UserMoveItInformations } from "../../components/UserInformations/UserMoveItInformations";

import { api } from "../../services/api";
import { dateFormatter } from "../../utils/dateFormatter";

import styles from "../../styles/pages/User.module.css";

interface UserData {
  name: string;
  avatarUrl: string;
  bio: string;
  followers: number;
  level: number;
  completedChallenges: number;
  experience: number;
  lastChallengeCompletedDate: string;
  contactLink: string;
}

interface UserRepositoryData {
  id: number;
  name: string;
  description: string;
  mainLanguage: string;
  totalStars: number;
  repositoryUrl: string;
}

interface UserProps {
  userData: UserData;
  userRepositories: UserRepositoryData[];
}

export default function User({
  userData: user,
  userRepositories: repositories,
}: UserProps) {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push("/auth");
    }
  }, [loading, session]);

  // console.log({ repositories });

  return (
    <>
      <Head>
        <title>{user?.name || "Usuário"} | move.it</title>
      </Head>
      <div className={styles.sideBarNavContainer}>
        <SideBarNav />
        <Link href="/leaderboard">
          <a className={styles.backButton}>
            <FaArrowLeft size={20} color="#4953b8" />
          </a>
        </Link>
        <main className={styles.userContainer}>
          <section className={styles.userInformations}>
            <UserMoveItInformations user={user} />
            <UserGithubInformations user={user} />
          </section>
          <section className={styles.userRepositories}>
            <RepositoriesList repositories={repositories} />
          </section>
        </main>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get("/users", {
    // pegando os 3 usuários com mais desafios completados
    params: {
      _limit: 3,
      _sort: "completed_challenges",
      _order: "desc",
    },
  });

  const paths = data?.map((user) => {
    // esses id's serão gerados de forma estática na hora do build do next
    return {
      params: {
        slug: user?.id,
      },
    };
  });

  return {
    paths,
    fallback: "blocking", // os id's que nao estiverem no "paths" irão ser gerados de maneira estática apenas quando forem acessados
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params; // pegando o id do user para fazer as requisições necesárias e mostrar os dados deste usuário

  const { data: userDataChallenge } = await api.get(`/users/${slug}`);
  const { data: userDataGithub } = await axios.get(
    `https://api.github.com/users/${slug}`
  );
  const { data: userRepos } = await axios.get(
    `https://api.github.com/users/${slug}/repos`
  );

  const userFormatted = {
    // formatando os dados do user para o front
    name: userDataGithub?.name,
    avatarUrl: userDataGithub?.avatar_url,
    bio: userDataGithub?.bio,
    followers: userDataGithub?.followers,
    level: userDataChallenge?.level,
    completedChallenges: userDataChallenge?.completed_challenges,
    experience: userDataChallenge?.experience,
    lastChallengeCompletedDate: dateFormatter(
      userDataChallenge?.last_challenge_completed_date,
      "dd MMM yyyy"
    ),
    contactLink: userDataChallenge?.contact_link,
  };

  const someUserRepositories = userRepos.slice(0, 3); // pegando apenas 3 repos do user
  const userRepositoriesFromatted = someUserRepositories?.map((repo) => {
    // formatando os repos do user para o front
    return {
      id: repo?.id,
      name: repo?.name,
      description: repo?.description,
      mainLanguage: repo?.language,
      totalStars: repo?.stargazers_count,
      repositoryUrl: repo?.html_url,
    };
  });

  return {
    props: {
      userData: userFormatted,
      userRepositories: userRepositoriesFromatted,
    },
    revalidate: 60 * 20, // => 20 minutos
  };
};
