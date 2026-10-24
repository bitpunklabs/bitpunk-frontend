"""Deliver the approved GitHub SVG privately, plus a reduced-motion first frame."""

import hashlib
import json
from pathlib import Path
import sys
import xml.etree.ElementTree as ET


if len(sys.argv) != 2:
    raise SystemExit("Usage: python3 tools/sync-github-profile.py /path/to/bitpunk-branding")

project = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1]) / "channels/github/profile/assets/header.svg"
original = source.read_bytes()
svg = ET.fromstring(original)
viewbox = [float(value) for value in svg.attrib["viewBox"].split()]
width, height = int(viewbox[2]), int(viewbox[3])
if width <= 0 or height <= 0:
    raise ValueError("The SVG needs a valid viewBox")

# Preserve the original animation byte-for-byte; keep only its first frame
# in the independent static delivery rather than shipping hidden extra frames.
frames = [element for element in svg.iter() if "frame" in element.attrib.get("class", "").split()]
if not any(element.attrib.get("id") == "frame-0" for element in frames):
    raise ValueError("The approved SVG needs a frame-0 static fallback")
for parent in svg.iter():
    for child in list(parent):
        if child in frames and child.attrib.get("id") != "frame-0":
            parent.remove(child)
namespace = "http://www.w3.org/2000/svg"
ET.register_namespace("", namespace)
override = ET.SubElement(svg, "{" + namespace + "}style")
override.text = ".frame{animation:none!important;visibility:hidden!important}#frame-0{visibility:visible!important}"
static = ET.tostring(svg, encoding="utf-8")

digest = hashlib.sha256(original).hexdigest()
animated_path = f"/art/channels/github-profile-{digest[:12]}.svg"
static_path = f"/art/channels/github-profile-{digest[:12]}-static.svg"
pack_path = project / "public/art/site-assets.json"
pack = json.loads(pack_path.read_text())
previous = pack["channels"]["github"]
replaced = {previous["src"], previous["staticSrc"], animated_path, static_path}
files = []
for path, data in [(animated_path, original), (static_path, static)]:
    target = project / "public" / path.lstrip("/")
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    files.append({"path": path, "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()})
pack["channels"]["github"] = {"src": animated_path, "width": width, "height": height, "staticSrc": static_path}
pack["files"] = [item for item in pack["files"] if item["path"] not in replaced] + files
pack_path.write_text(json.dumps(pack, indent=2) + "\n")

private = project / ".private"
private.mkdir(exist_ok=True)
(private / "github-profile-delivery.json").write_text(json.dumps({"sourceSha256": digest, "files": files, "originalPreserved": True, "staticFrames": 1}, indent=2) + "\n")
print(f"Delivered GitHub header at {width}x{height}; animated {len(original)} bytes, static {len(static)} bytes.")
