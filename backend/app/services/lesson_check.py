"""Exercise answer correctness checking."""

import re
from typing import Any


def _normalize(value: str) -> str:
    """Lowercase and collapse whitespace so minor typos in spacing still match."""
    return re.sub(r"\s+", " ", value.strip()).lower()


def check_answer(exercise_type: str, data: dict, user_answer: Any) -> bool:
    """Return True if user_answer is correct for the given exercise type and data."""
    str_ans = str(user_answer).strip()

    if exercise_type in ("multiple_choice", "fill_blank"):
        correct_index = data.get("correct_index", 0)
        choices = data.get("choices", [])
        if str_ans.isdigit() and int(str_ans) == correct_index:
            return True
        if choices and 0 <= correct_index < len(choices):
            if str_ans.lower() == str(choices[correct_index]).lower():
                return True
        return False

    if exercise_type == "word_match":
        if isinstance(user_answer, dict):
            expected_pairs = {p["hindi"]: p["english"] for p in data.get("pairs", [])}
            return user_answer == expected_pairs
        str_ans = str(user_answer).strip()
        return str_ans.lower() in ("all_correct", "true", "1")

    if exercise_type == "tap_words":
        correct = data.get("correct") or []
        if isinstance(correct, list):
            correct = " ".join(str(word) for word in correct)
        return _normalize(str_ans) == _normalize(str(correct))

    if exercise_type == "type_answer":
        accepted = data.get("correct") or []
        if isinstance(accepted, str):
            accepted = [accepted]
        return any(_normalize(str_ans) == _normalize(str(word)) for word in accepted)

    return True
