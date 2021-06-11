import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { GetStaticPaths, GetStaticProps } from "next";
import { useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa";

import axios from "axios";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import { SideBarNav } from "../../components/SideBarNav";
import { UserGithubInformations } from "../../components/UserInformations/UserGithubInformations";

import { api } from "../../services/api";

import styles from "../../styles/pages/User.module.css";
import { UserMoveItInformations } from "../../components/UserInformations/UserMoveItInformations";

interface UserData {
  avatarUrl: string;
  name: string;
  bio: string;
  followers: number;
  level: number;
  completedChallenges: number;
  experience: number;
  lastChallengeCompletedDate: string;
  contactLink: string;
}

interface UserRepositoryData {
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

  console.log({ repositories });

  useEffect(() => {
    if (!loading && !session) {
      router.push("/auth");
    }
  }, [loading, session]);

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
            <ul>
              <li>
                <h3>{repositories[0]?.name}</h3>
                <p>{repositories[0]?.description}</p>
                <section>
                  <div>
                    <strong>{repositories[0]?.totalStars}</strong>
                    <FaStar color="#ffd666" size={18} />
                  </div>
                  {repositories[0]?.mainLanguage && (
                    <div>
                      <div />
                      <small>{repositories[0]?.mainLanguage}</small>
                    </div>
                  )}
                </section>
                <Link href={repositories[0]?.repositoryUrl}>
                  <a>
                    <FaArrowRight color="#4953b8" size={20} />
                  </a>
                </Link>
              </li>
              <li>
                <h3>{repositories[1]?.name}</h3>
                <p>{repositories[1]?.description}</p>
                <section>
                  <div>
                    <strong>{repositories[1]?.totalStars}</strong>
                    <FaStar color="#ffd666" size={18} />
                  </div>
                  {repositories[1]?.mainLanguage && (
                    <div>
                      <div />
                      <small>{repositories[1]?.mainLanguage}</small>
                    </div>
                  )}
                </section>
                <Link href={repositories[1]?.repositoryUrl}>
                  <a>
                    <FaArrowRight color="#4953b8" size={20} />
                  </a>
                </Link>
              </li>
              <li>
                <h3>{repositories[2]?.name}</h3>
                <p>{repositories[2]?.description}</p>
                <section>
                  <div>
                    <strong>{repositories[2]?.totalStars}</strong>
                    <FaStar color="#ffd666" size={18} />
                  </div>
                  {repositories[2]?.mainLanguage && (
                    <div>
                      <div />
                      <small>{repositories[2]?.mainLanguage}</small>
                    </div>
                  )}
                </section>
                <Link href={repositories[2]?.repositoryUrl}>
                  <a>
                    <FaArrowRight color="#4953b8" size={20} />
                  </a>
                </Link>
              </li>
            </ul>
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
    avatarUrl: userDataGithub?.avatar_url,
    name: userDataGithub?.name,
    bio: userDataGithub?.bio,
    followers: userDataGithub?.followers,
    level: userDataChallenge?.level,
    completedChallenges: userDataChallenge?.completed_challenges,
    experience: userDataChallenge?.experience,
    lastChallengeCompletedDate: format(
      parseISO(userDataChallenge?.last_challenge_completed_date),
      "dd MMM yyyy",
      {
        locale: ptBR,
      }
    ),
    contactLink: userDataChallenge?.contact_link,
  };

  const someUserRepositories = userRepos.slice(0, 3); // pegando apenas 3 repos do user
  const userRepositoriesFromatted = someUserRepositories?.map((repo) => {
    // formatando os repos do user para o front
    return {
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
