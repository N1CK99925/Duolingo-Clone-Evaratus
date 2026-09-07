"use client";

import { AnswerResult, ExerciseDetail, LessonAnswer } from "@/lib/api";
import { FillBlank } from "./FillBlank";
import { WordMatch } from "./WordMatch";
import { MultipleChoice } from "./MultipleChoice";
import { TapWords } from "./TapWords";
import { TypeAnswer } from "./TypeAnswer";

interface ExerciseViewProps {
  exercise: ExerciseDetail;
  selected: LessonAnswer | null;
  feedback: AnswerResult | null;
  onSelect: (value: LessonAnswer) => void;
}

/** Dispatches the right exercise widget for the exercise type. */
export function ExerciseView({ exercise, selected, feedback, onSelect }: ExerciseViewProps) {
  const pick = (value: LessonAnswer) => {
    if (!feedback) onSelect(value);
  };

  if (exercise.exercise_type === "fill_blank") {
    return (
      <FillBlank
        key={exercise.id}
        exercise={exercise}
        selected={typeof selected === "number" ? selected : null}
        feedback={feedback}
        onSelect={(i) => pick(i)}
      />
    );
  }
  if (exercise.exercise_type === "word_match") {
    return (
      <WordMatch
        key={exercise.id}
        exercise={exercise}
        selected={selected}
        feedback={feedback}
        onSelect={(matches) => pick(matches)}
      />
    );
  }
  if (exercise.exercise_type === "tap_words") {
    return <TapWords key={exercise.id} exercise={exercise} feedback={feedback} onSelect={pick} />;
  }
  if (exercise.exercise_type === "type_answer") {
    return (
      <TypeAnswer key={exercise.id} exercise={exercise} feedback={feedback} onSelect={pick} />
    );
  }
  return (
    <MultipleChoice
      key={exercise.id}
      exercise={exercise}
      selected={typeof selected === "number" ? selected : null}
      feedback={feedback}
      onSelect={(i) => pick(i)}
    />
  );
}
