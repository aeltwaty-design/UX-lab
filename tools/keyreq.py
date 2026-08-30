"""Every transfers.* key the built screen can ask for at runtime, including the
   ones assembled from a prefix plus a variable — the kind a plain grep misses
   and the user finds as English sitting in an Arabic page."""
import io, re, json, sys

raw = io.open("preview/app.html", encoding="utf-8").read()

# The inlined I18N dictionary is the ANSWER, not the question. Scanning it made
# every key it happened to contain look like one the screen had asked for, so a
# key deleted from the copy file was reported missing rather than surplus.
_a = raw.index("const I18N = {")
_b = raw.index("\n\nlet LANG = ", _a)
s = raw[:_a] + raw[_b:]
keys = set()

# literal keys
for m in re.finditer(r'["\'](transfers\.[A-Za-z0-9._]+)["\']', s):
    keys.add(m.group(1))
for m in re.finditer(r'data-i18n[a-z-]*="(transfers\.[A-Za-z0-9._]+)"', s):
    keys.add(m.group(1))

# keys built from a prefix + a value: "transfers.status." + st
STATUSES = ["uploaded","processing","ready","completed","rejected"]   # no failed: rejection is the only way out
SOURCES  = ["loyalty","invoice","file","referral","b2b"]
BCOLS    = ["file","uploadedBy","records","points","value","source","status","uploaded","actions"]
ICOLS    = ["recipient","reference","sentBy","points","value","source","date"]
ISSUES   = ["BadPhone","MissingPoints","BadPoints","Unknown"]
FILTERS  = ["All","Valid","Invalid","Duplicate"]

for st in STATUSES:
    keys.add("transfers.status." + st)
    keys.add("transfers.status." + st + "Desc")
for sc in SOURCES:
    keys.add("transfers.source." + sc)
for c in set(BCOLS + ICOLS):
    keys.add("transfers.columns." + c)
for i in ISSUES:
    keys.add("transfers.viewer.issue" + i)
for f in FILTERS:
    keys.add("transfers.viewer.filter" + f)
for i in range(1, 6):
    keys.add("transfers.reject.preset%d" % i)
for i in range(1, 5):
    keys.add("transfers.upload.rule%d" % i)
for k in ["charged","transferred","available"]:
    keys.add("transfers.summary." + k)
    keys.add("transfers.summary." + k + "Hint")

# drop the ones that were only ever prefixes
keys = {k for k in keys if not k.endswith(".")}
keys.discard("transfers.status.")
keys.discard("transfers.columns.")
keys.discard("transfers.source.")
keys.discard("transfers.summary.")
keys.discard("transfers.viewer.issue")
keys.discard("transfers.viewer.filter")
keys.discard("transfers.reject.preset")
keys.discard("transfers.upload.rule")

req = sorted(keys)
if len(sys.argv) > 1 and sys.argv[1] == "--check":
    d = json.load(io.open("src/i18n/transfers.json", encoding="utf-8"))
    for lang in ("en", "ar"):
        missing = [k for k in req if k not in d.get(lang, {})]
        print("%s: %d/%d present" % (lang, len(req) - len(missing), len(req)))
        if missing: print("  MISSING:", "\n   ".join(missing))
    extra = sorted(set(d["en"]) - set(req))
    if extra: print("in the file but never asked for (%d):" % len(extra), ", ".join(extra[:12]), "…" if len(extra)>12 else "")
    print("en/ar key mismatch:", sorted(set(d["en"]) ^ set(d["ar"])) or "none")
else:
    print("\n".join(req)); print("\n== %d keys ==" % len(req))
