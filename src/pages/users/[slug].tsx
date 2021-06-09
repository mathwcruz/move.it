import Head from "next/head";
import { getSession } from "next-auth/client";
import { GetServerSideProps, GetStaticPaths } from "next";
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

interface UserRepositoryData {
  name: string;
  description: string;
  mainLanguage: string;
  totalStars: number;
}

interface UserProps {
  userData: UserData;
  userRepositories: UserRepositoryData[];
}

export default function User({
  userData: user,
  userRepositories: repositories,
}: UserProps) {
  return (
    <>
      <Head>
        <title>{user?.name || "Usuário"} | move.it</title>
      </Head>
      <div className={styles.sideBarNavContainer}>
        <SideBarNav />
        <div className={styles.userContainer}>
          <h1>User: </h1>
          <p>{user?.bio}</p>
        </div>
      </div>
    </>
  );
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   const { data } = await api.get("/users", {
//     params: {
//       _limit: 3,
//       _sort: "completed_challenges",
//       _order: "desc",
//     },
//   });

//   const paths = data.map((user) => {
//     return {
//       params: {
//         slug: user?.id,
//       },
//     };
//   });

//   return {
//     paths,
//     fallback: "blocking",
//   };
// };

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });
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
      userData: userFormatted,
      userRepositories: userRepositoriesFromatted,
    },
  };
};
