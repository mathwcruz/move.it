import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import axios from "axios";

import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import { SideBarNav } from "../../components/SideBarNav";

import { api } from "../../services/api";

import styles from "../../styles/pages/User.module.css";

interface UserData {
  avatarUrl: string;
  name: string;
  bio: string;
  company: string;
  followers: number;
  level: number;
  completedChallenges: number;
  experience: number;
  lastChallengeCompletedDate: string;
  contactLink: string;
}

interface UserRepositoriesData {}

interface UserProps {
  userData: UserData;
  userRepositories: UserRepositoriesData;
}

export default function User({
  userData: user,
  userRepositories: repositories,
}: UserProps) {
  console.log({ repositories, user });

  return (
    <>
      <Head>
        <title>{user?.name} | move.it</title>
      </Head>
      <div className={styles.sideBarNavContainer}>
        <SideBarNav />
        <div className={styles.userContainer}>
          <h1>User: </h1>
          <p>{user?.name}</p>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const { data: userDataChallenge } = await api.get(`/users/${slug}`);
  const { data: userDataGithub } = await axios.get(
    `https://api.github.com/users/${slug}`
  );
  const { data: userRepos } = await axios.get(
    `https://api.github.com/users/${slug}/repos`
  );

  const userFormatted = {
    avatarUrl: userDataGithub?.avatar_url,
    name: userDataGithub?.name,
    bio: userDataGithub?.bio,
    company: userDataGithub?.company,
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

  const someUserRepositories = userRepos.slice(0, 3);
  const userRepositoriesFromatted = someUserRepositories.map((repo) => {
    return {
      name: repo?.name,
      description: repo?.description,
      mainLanguage: repo?.language,
      totalStars: repo?.stargazers_count,
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
