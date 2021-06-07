import { GetServerSideProps } from "next";
import { signIn, getSession } from "next-auth/client";
import { FaGithub, FaArrowRight } from "react-icons/fa";

import styles from "../styles/pages/Auth.module.css";

export default function Auth() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.backgroundLogo} />
      <div className={styles.informationsContainer}>
        <img src="logo-white.svg" alt="move.it" />
        <section>
          <h2>Bem-vindo</h2>
          <div>
            <FaGithub color="#dcdde0" size={40} />
            <p>Faça login com seu Github para começar</p>
          </div>
        </section>
        <button type="button" onClick={() => signIn("github")}>
          Entrar com Github
          <FaArrowRight color="#4953b8" size={20} />
        </button>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  const { res } = ctx;

  if (session) {
    res.writeHead(301, {
      location: "http://localhost:3000/",
    });
    res.end();
  }

  return {
    props: {
      sessions: session,
    },
  };
};
