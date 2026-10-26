# === CHECKS ===
# id: check_source_gonol_lifted_round_trip
#   proves: source_gonol_lifted_round_trip
#   call: self::test_round_trip_cases
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# === END CHECKS ===
"""Tests for the exact A0 source-gonol lifted traversal."""
from __future__ import annotations

import pytest

from interdependent_lib.gonal.lifted_path import (
    ARITY,
    ORIGIN,
    CarrierCharError,
    char_of_vertex,
    decode_text_path,
    encode_text_path,
    is_origin_event,
    path_vertices,
    vertex_of_char,
)

CASES = ["aa", "aaa", "a a", "  ", "0", "10 01"]


@pytest.mark.parametrize("text", CASES)
def test_round_trip_cases(text):
    path = encode_text_path(text)
    assert decode_text_path(path) == text
    assert all(path[i] < path[i + 1] for i in range(len(path) - 1))


def test_repeat_costs_full_source_revolution():
    path = encode_text_path("aaa")
    assert path[1] - path[0] == ARITY
    assert path[2] - path[1] == ARITY


def test_space_is_origin_event():
    assert vertex_of_char(" ") == ORIGIN == 0
    path = encode_text_path(" ")
    assert is_origin_event(path[0])
    assert decode_text_path(path) == " "
    assert decode_text_path(encode_text_path("  ")) == "  "


def test_digit_zero_is_ordinary_glyph():
    assert vertex_of_char("0") != ORIGIN
    assert char_of_vertex(vertex_of_char("0")) == "0"


def test_path_vertices_and_origin_helpers():
    path = encode_text_path("a a")
    vertices = path_vertices(path)
    assert vertices[1] == ORIGIN
    assert is_origin_event(path[1])
    assert not is_origin_event(path[0])


def test_off_carrier_char_refused():
    with pytest.raises(CarrierCharError):
        vertex_of_char("☃")
    with pytest.raises(CarrierCharError):
        encode_text_path("hi ☃")
