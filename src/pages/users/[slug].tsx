import { GetStaticPaths, GetStaticProps } from "next";
import axios from "axios";

import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import { api } from "../../services/api";

import styles from "../../styles/pages/User.module.css";

export default function User({ userData, userRepositories }) {
  console.log({ userData });

  return (
    <div className={styles.userContainer}>
      <h1>User: </h1>
      <p>{userData?.name}</p>
    </div>
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
    `https://api.github.com/users/${slug}/repos`,
    {
      params: {
        _limit: 3,
        // _sort: "updated_at",
        // _order: "desc",
      },
    }
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
      "dd MMM yy",
      {
        locale: ptBR,
      }
    ),
    contactLink: userDataChallenge?.contact_link,
  };

  //criar interface para as props retornadas pelo next
  // retornar os dados dos repos formatados

  const userRepositoriesFromatted = {};

  return {
    props: {
      userData: userFormatted,
      userRepositories: userRepositoriesFromatted,
    },
    revalidate: 60 * 30, // => 30 minutos
  };
};
