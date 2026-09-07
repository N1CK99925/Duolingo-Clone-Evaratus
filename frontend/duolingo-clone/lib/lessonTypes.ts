/** Lesson-player types (VS2/VS3): exercise data shapes, lesson detail, and results. */

/** Shape of the seeded multiple_choice exercise_data JSON. */
export interface MultipleChoiceData {
  type?: "multiple_choice";
  prompt: string;
  choices: string[];
  correct_index: number;
  explanation?: string;
}

/** Shape of the fill_blank exercise_data JSON (VS3). */
export interface FillBlankData {
  type: "fill_blank";
  sentence: string;
  prompt: string;
  choices: string[];
  correct_index: number;
  explanation?: string;
}

/** A single pair in a word_match exercise (VS3). */
export interface WordPair {
  hindi: string;
  english: string;
}

/** Shape of the word_match exercise_data JSON (VS3). */
export interface WordMatchData {
  type: "word_match";
  prompt: string;
  pairs: WordPair[];
}

/** Shape of the tap_words (translate / tap-the-words) exercise_data JSON. */
export interface TapWordsData {
  type: "tap_words";
  prompt: string;
  sentence: string;
  correct: string[];
  explanation?: string;
}

/** Shape of the type_answer exercise_data JSON. */
export interface TypeAnswerData {
  type: "type_answer";
  prompt: string;
  correct: string[];
  explanation?: string;
}

export type ExerciseData =
  | (MultipleChoiceData | FillBlankData | WordMatchData | TapWordsData | TypeAnswerData)
  & Record<string, unknown>;

/** Anything a learner can submit as an answer. */
export type LessonAnswer = number | string | Record<string, string>;

export interface ExerciseDetail {
  id: number;
  lesson_id: number;
  exercise_type: "multiple_choice" | "fill_blank" | "word_match" | string;
  sort_order: number;
  exercise_data: string;
}

export interface LessonDetail {
  id: number;
  skill_id: number;
  title: string;
  sort_order: number;
  xp_reward: number;
  skill_title: string;
  exercises: ExerciseDetail[];
}

export interface AnswerResult {
  is_correct: boolean;
  correct_answer: string | number;
  explanation: string | null;
  current_hearts: number;
  max_hearts: number;
  is_out_of_hearts: boolean;
}

export interface LessonCompleteResult {
  xp_awarded: number;
  total_xp: number;
  current_streak: number;
  current_hearts: number;
  max_hearts: number;
  skill_completed: boolean;
}