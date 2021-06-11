import { FaLinkedin } from "react-icons/fa";

import styles from "../../styles/components/UserGithubInformations.module.css";

interface User {
  name: string;
  bio?: string;
  followers: number;
  contactLink: string;
}

interface UserGithubInformationsProps {
  user: User;
}

export function UserGithubInformations({ user }: UserGithubInformationsProps) {
  return (
    <div className={styles.userGithubInformations}>
      <section>
        {user?.bio && (
          <article>
            <h3>Biografia de {user?.name}:</h3>
            <p>{user?.bio}</p>
          </article>
        )}
        <div>
          {user?.followers && (
            <strong>
              <small>{user?.followers}</small> seguidores
            </strong>
          )}
          <section>
            <FaLinkedin size={25} color="#4953b8" />
            <a
              href={user?.contactLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Contate
            </a>
            {user?.name}
          </section>
        </div>
      </section>
    </div>
  );
}
