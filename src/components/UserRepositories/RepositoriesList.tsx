import { RepositoryItem } from "./RepositoryItem";

import styles from "../../styles/components/RepositoriesList.module.css";

interface Repository {
  name: string;
  description: string;
  totalStars: number;
  mainLanguage: string;
  repositoryUrl: string;
}

interface RepositoriesListProps {
  repositories: Repository[];
}

export function RepositoriesList({ repositories }: RepositoriesListProps) {
  return (
    <ul className={styles.repositoriesList}>
      {repositories?.map((repo) => (
        <RepositoryItem key={repo?.repositoryUrl} repository={repo} />
      ))}
    </ul>
  );
}
