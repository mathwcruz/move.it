import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import challenges from "../../challenges.json";

interface ChallengesContextData {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
  experienceToNextLevel: number;
  activeChallenge: {
    type: "body" | "eye";
    description: string;
    amount: number;
  };
  levelUp: () => void;
  startNewChallenge: () => void;
  resetChallenge: () => void;
}

interface ChallengesProviderProps {
  children: ReactNode;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children }: ChallengesProviderProps) {
  const [level, setLevel] = useState(1);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState(null);

  const experienceToNextLevel = useMemo(() => {
    return Math.pow((level + 1) * 4, 2);
  }, []);

  const levelUp = useCallback(() => {
    setLevel(level + 1);
  }, []);

  const randomChallengeIndex = useMemo(() => {
    return Math.floor(Math.random() * challenges.length);
  }, []);

  const challenge = useMemo(() => {
    return challenges[randomChallengeIndex]; // desafio aleatório
  }, [randomChallengeIndex]);

  const startNewChallenge = useCallback(() => {
    setActiveChallenge(challenge);
  }, []);

  const resetChallenge = useCallback(() => {
    setActiveChallenge(null);
  }, []);

  return (
    <ChallengesContext.Provider
      value={{
        level,
        currentExperience,
        challengesCompleted,
        experienceToNextLevel,
        activeChallenge,
        levelUp,
        startNewChallenge,
        resetChallenge,
      }}
    >
      {children}
    </ChallengesContext.Provider>
  );
}

export const useChallenge = () => {
  return useContext(ChallengesContext);
};
