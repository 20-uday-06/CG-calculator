import { Course, GradeOption } from './types';

export const GRADE_OPTIONS: GradeOption[] = [
  { label: 'O (Outstanding)', value: 10, color: 'text-emerald-400' },
  { label: 'A+ (Excellent)', value: 9, color: 'text-teal-400' },
  { label: 'A (Very Good)', value: 8, color: 'text-cyan-400' },
  { label: 'B+ (Good)', value: 7, color: 'text-blue-400' },
  { label: 'B (Above Avg)', value: 6, color: 'text-indigo-400' },
  { label: 'C (Average)', value: 5, color: 'text-violet-400' },
  { label: 'P (Pass)', value: 4, color: 'text-fuchsia-400' },
  { label: 'F (Fail)', value: 0, color: 'text-rose-500' },
  { label: 'Ab (Absent)', value: 0, color: 'text-red-500' },
];

// Data extracted specifically from the user's uploaded image
export const INITIAL_COURSES: Course[] = [
  { id: '1', code: 'CET-101', name: 'CAD in Structural Analysis', credits: 2, gradePoint: 10 },
  { id: '2', code: 'HSS-306', name: 'Introduction to Cyberpsychology', credits: 3, gradePoint: 9 },
  { id: '3', code: 'CEC-399', name: 'Community Outreach', credits: 2, gradePoint: 10 },
  { id: '4', code: 'CEC-351', name: 'Fundamentals of AI/ML', credits: 2, gradePoint: 8 },
  { id: '5', code: 'CEC-301', name: 'Soil Mechanics', credits: 3, gradePoint: 7 },
  { id: '6', code: 'CEC-303', name: 'Waste Water Engineering', credits: 3, gradePoint: 8 },
  { id: '7', code: 'CEC-305', name: 'Design of Steel Elements', credits: 3, gradePoint: 9 },
  { id: '8', code: 'CEC-307', name: 'Highway and Traffic Engineering', credits: 3, gradePoint: 8 },
];

export const INITIAL_HISTORY = {
  currentCgpa: 8.5, // Placeholder, user will likely edit this based on prompt
  previousTotalCredits: 89,
};