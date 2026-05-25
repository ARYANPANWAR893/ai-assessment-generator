export interface RubricItem {
  id: string;
  title: string;
  maxPoints: number;
  description: string;
}

export interface ScoreState {
  [key: string]: number | "";
}