"""Usage: python frontend/scripts/verify-apk.py dist/a0-mobile-release-unsigned.apk.
Check bundled assets, fixed local origin, native OAuth plugins, and no keystore.
Android's aapt supplies the binary-manifest validation in android-apk.yml.
"""
import json
import sys
import zipfile

with zipfile.ZipFile(sys.argv[1]) as apk:
    names = apk.namelist()
    assert "assets/public/index.html" in names, "UI not bundled"
    config = json.loads(apk.read("assets/capacitor.config.json"))
    assert config["appId"] == "org.interdependentway.a0"
    assert config["server"]["androidScheme"] == "https"
    assert config["server"]["hostname"] == "localhost"
    assert "url" not in config["server"], "must bundle UI, not load a remote site"
    plugins = apk.read("assets/capacitor.plugins.json").decode()
    assert "AppPlugin" in plugins and "BrowserPlugin" in plugins
    assert not any(n.lower().endswith((".jks", ".keystore", ".pem", ".key")) for n in names)
    assert not any(n.startswith("META-INF/") and n.endswith((".RSA", ".DSA", ".EC")) for n in names), "expected unsigned APK"
    assert any(n.startswith("assets/public/static/js/main.") and n.endswith(".js") for n in names)
print("Bundled A0 APK contract verified")
