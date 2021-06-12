import Link from "next/link";
import { FaArrowRight, FaStar } from "react-icons/fa";

import styles from "../../styles/components/RepositoryItem.module.css";

interface Repository {
  id: number;
  name: string;
  description: string;
  totalStars: number;
  mainLanguage?: string;
  repositoryUrl: string;
}

interface RepositoryItemProps {
  repository: Repository;
}

export function RepositoryItem({ repository }: RepositoryItemProps) {
  return (
    <li className={styles.repositoryItem}>
      <h3>{repository?.name}</h3>
      <p>{repository?.description}</p>
      <section
        className={
          !repository?.description && styles.repositoryHasntADescription
        }
      >
        <div>
          <strong>{repository?.totalStars}</strong>
          <FaStar color="#ffd666" size={18} />
        </div>
        {repository?.mainLanguage && (
          <div>
            <div />
            <small>{repository?.mainLanguage}</small>
          </div>
        )}
      </section>
      <Link href={repository?.repositoryUrl}>
        <a>
          <FaArrowRight color="#4953b8" size={20} />
        </a>
      </Link>
    </li>
  );
}
