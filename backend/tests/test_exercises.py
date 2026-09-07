"""Unit tests for text-based exercise checking (tap_words, type_answer)."""

from app.services.lesson_check import check_answer


def test_tap_words_requires_the_correct_word_order():
    data = {"correct": ["I", "eat", "rice"]}
    assert check_answer("tap_words", data, "I eat rice")
    assert not check_answer("tap_words", data, "rice I eat")


def test_tap_words_accepts_english_punctuation_case():
    data = {"correct": ["Hello", "I", "am", "happy"]}
    assert check_answer("tap_words", data, "hello I AM happy")
    assert not check_answer("tap_words", data, "")


def test_type_answer_matches_any_accepted_answer():
    data = {"correct": ["bread", "flatbread", "flat bread"]}
    assert check_answer("type_answer", data, "  Bread ")
    assert check_answer("type_answer", data, "flat bread")
    assert not check_answer("type_answer", data, "chapati")