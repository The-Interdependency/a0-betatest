from __future__ import annotations

from pathlib import Path

import ucns

from interdependent_lib.gonal import faces as local_faces
from interdependent_lib.gonal import gonal as local_gonal
from interdependent_lib.gonal import lifted_path as local_lifted
from interdependent_lib.gonal import mirror as local_mirror
from interdependent_lib.gonal.registry import get_default, get_mirror
from interdependent_lib.zfae.gonal_inscription import PrivateGonal

ROOT = Path(__file__).resolve().parents[1]


def test_a0_public_arrangement_is_exact_ucns_canon():
    assert tuple(local_gonal.EXAMPLE_157) == tuple(ucns.PUBLIC_GONAL_157)
    assert tuple(get_default()) == tuple(ucns.PUBLIC_GONAL_157)
    assert local_gonal.PUBLIC_GONAL_SOURCE_REPOSITORY == "The-Interdependency/a0-betatest"
    assert local_gonal.PUBLIC_GONAL_SOURCE_COMMIT == "7af8debf6ef3905f01baff02b43d8c3bee16ccbc"
    assert local_gonal.PUBLIC_GONAL_SHA256 == ucns.PUBLIC_GONAL_SHA256


def test_a0_geometry_and_traversal_are_ucns_imports():
    assert local_faces.face is ucns.face
    assert local_faces.chirality is ucns.chirality
    assert local_faces.n_plus is ucns.n_plus
    assert local_faces.n_minus is ucns.n_minus
    assert local_mirror.mirror_of is ucns.mirror_of
    assert local_lifted.encode_text_path is ucns.encode_text_path
    assert local_lifted.decode_text_path is ucns.decode_text_path
    assert local_lifted.vertex_of_char is ucns.vertex_of_char
    assert local_lifted.char_of_vertex is ucns.char_of_vertex
    assert local_lifted.is_seam_event is ucns.is_seam_event


def test_a0_private_transform_is_ucns_canon():
    assert PrivateGonal is ucns.PrivateGonal
    private = PrivateGonal.from_seed(b"a0-ucns-public-gonol-parity")
    assert private.perm[ucns.ORIGIN] == ucns.ORIGIN
    assert set(private.perm[1:]) == set(range(1, ucns.ARITY))
    assert private.char_at(ucns.ORIGIN) == " "


def test_registry_mirror_uses_ucns_origin_fixed_mirror():
    assert get_mirror() == ucns.mirror_of(list(ucns.PUBLIC_GONAL_157))
    assert get_mirror()[ucns.ORIGIN] == " "


def test_no_second_public_gonol_implementation_remains_in_a0():
    gonal_text = (ROOT / "interdependent_lib/gonal/gonal.py").read_text(encoding="utf-8")
    faces_text = (ROOT / "interdependent_lib/gonal/faces.py").read_text(encoding="utf-8")
    mirror_text = (ROOT / "interdependent_lib/gonal/mirror.py").read_text(encoding="utf-8")
    lifted_text = (ROOT / "interdependent_lib/gonal/lifted_path.py").read_text(encoding="utf-8")
    inscription_text = (ROOT / "interdependent_lib/zfae/gonal_inscription.py").read_text(encoding="utf-8")

    assert "def build_gonal" not in gonal_text
    assert "UNPAIRED_OPS =" not in gonal_text
    assert "def face(" not in faces_text
    assert "def mirror_of(" not in mirror_text
    assert "def encode_text_path(" not in lifted_text
    assert "class PrivateGonal" not in inscription_text


def test_public_gonol_round_trip_and_twist_origin_survive_a0_imports():
    text = "aa a 0"
    path = local_lifted.encode_text_path(text)
    assert local_lifted.decode_text_path(path) == text
    assert path[1] - path[0] == ucns.ARITY
    space_index = text.index(" ")
    assert local_lifted.is_seam_event(path[space_index])
    assert local_lifted.vertex_of_char("0") != ucns.ORIGIN
