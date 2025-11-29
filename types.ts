export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  gradePoint: number; // 0-10 scale
}

export interface GradeOption {
  label: string;
  value: number;
  color: string;
}

export interface SimulationState {
  currentCgpa: number;
  previousTotalCredits: number;
}