"""Every transfers.* and transactions.* key the built screens can ask for at
   runtime, including the ones assembled from a prefix plus a variable — the
   kind a plain grep misses and the user finds as English in an Arabic page."""
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
PREFIX = r'(?:transfers|transactions|charge|exports|login|otp)'
for m in re.finditer(r'["\'](' + PREFIX + r'\.[A-Za-z0-9._]+)["\']', s):
    keys.add(m.group(1))
for m in re.finditer(r'data-i18n[a-z-]*="(' + PREFIX + r'\.[A-Za-z0-9._]+)"', s):
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

# --- transactions: the same prefix-plus-variable problem -------------------
XTYPES = ["file","loyalty","invoice","referral","b2b","welcome"]
XCOLS  = ["user","reference","direction","points","value","type",
          "registration","originId","comment","date"]
for k in XTYPES: keys.add("transactions.type." + k)
for k in XCOLS:  keys.add("transactions.columns." + k)
for d in ["in","out"]:
    keys.add("transactions.direction." + d)
    keys.add("transactions.direction." + d + "Desc")
for i in range(1, 6):
    keys.add("transactions.sampleNote%d" % i)

# --- charge history --------------------------------------------------------
CCOLS = ["reference","amount","points","addedBy","notes","purchaseOrder",
         "invoice","createdAt","endedAt","status"]
for k in CCOLS: keys.add("charge.columns." + k)
for k in ["active","expiring","expired"]:
    keys.add("charge.status." + k)
    keys.add("charge.status." + k + "Desc")
for k in ["noNotes","noPurchaseOrder","noInvoice"]:
    keys.add("charge.panel." + k)
for i in range(1, 4):
    keys.add("charge.chargeNote%d" % i)

# --- exports ---------------------------------------------------------------
ECOLS = ["index","name","exportedTo","requestedAt","processedAt","requestedBy","actions"]
for k in ECOLS: keys.add("exports.columns." + k)
for k in ["users","followers","transactions","transfers","charges"]:
    keys.add("exports.target." + k)

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
keys.discard("transactions.type.")
keys.discard("transactions.columns.")
keys.discard("transactions.direction.")
keys.discard("transactions.sampleNote")
keys.discard("charge.columns.")
keys.discard("charge.status.")
keys.discard("charge.panel.")
keys.discard("exports.columns.")
keys.discard("exports.target.")

req = sorted(keys)
if len(sys.argv) > 1 and sys.argv[1] == "--check":
    d = {"en": {}, "ar": {}}
    for f in ("transfers.json", "transactions.json", "chargehistory.json", "exports.json",
              "login.json"):
        try:
            x = json.load(io.open("src/i18n/" + f, encoding="utf-8"))
        except FileNotFoundError:
            continue
        for lang in ("en", "ar"):
            d[lang].update(x.get(lang, {}))
    for lang in ("en", "ar"):
        missing = [k for k in req if k not in d.get(lang, {})]
        print("%s: %d/%d present" % (lang, len(req) - len(missing), len(req)))
        if missing: print("  MISSING:", "\n   ".join(missing))
    extra = sorted(set(d["en"]) - set(req))
    if extra: print("in the file but never asked for (%d):" % len(extra), ", ".join(extra[:12]), "…" if len(extra)>12 else "")
    print("en/ar key mismatch:", sorted(set(d["en"]) ^ set(d["ar"])) or "none")
else:
    print("\n".join(req)); print("\n== %d keys ==" % len(req))
