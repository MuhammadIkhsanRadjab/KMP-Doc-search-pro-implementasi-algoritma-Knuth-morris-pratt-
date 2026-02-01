import os
import time
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

DATA_FOLDER = "data_dokumen"
UPLOAD_FOLDER = "uploads"

# Pastikan folder tersedia
for folder in [DATA_FOLDER, UPLOAD_FOLDER]:
    if not os.path.exists(folder):
        os.makedirs(folder)

# =========================
# ALGORITMA KMP
# =========================
def build_lps(pattern):
    m = len(pattern)
    lps = [0] * m
    len_prefix = 0
    i = 1
    while i < m:
        if pattern[i] == pattern[len_prefix]:
            len_prefix += 1
            lps[i] = len_prefix
            i += 1
        elif len_prefix != 0:
            len_prefix = lps[len_prefix - 1]
        else:
            lps[i] = 0
            i += 1
    return lps

def kmp_search(text, pattern):
    n, m = len(text), len(pattern)
    if m == 0: return []
    lps = build_lps(pattern)
    res, i, j = [], 0, 0
    while i < n:
        if text[i] == pattern[j]:
            i += 1; j += 1
            if j == m:
                res.append(i - m)
                j = lps[j - 1]
        elif j != 0:
            j = lps[j - 1]
        else:
            i += 1
    return res

# =========================
# UTILS
# =========================
def highlight_keyword(snippet, keyword):
    if not keyword: return snippet
    import re
    # Case-insensitive highlight menggunakan regex
    pattern = re.compile(re.escape(keyword), re.IGNORECASE)
    return pattern.sub(lambda m: f"<mark>{m.group()}</mark>", snippet)

# =========================
# ROUTES
# =========================
@app.route("/", methods=["GET"])
def index():
    total_docs = len([f for f in os.listdir(DATA_FOLDER) if f.endswith('.txt')])
    return render_template("index.html", mode="folder", total_docs_all=total_docs)

@app.route("/search", methods=["POST"])
def search():
    start_time = time.time()
    mode = request.form.get("mode", "folder")
    keyword = request.form.get("keyword", "").strip()
    
    results = []
    
    if mode == "folder":
        for fn in os.listdir(DATA_FOLDER):
            if fn.endswith(".txt"):
                with open(os.path.join(DATA_FOLDER, fn), "r", encoding="utf-8") as f:
                    content = f.read()
                    pos = kmp_search(content.lower(), keyword.lower())
                    if pos:
                        # Ambil snippet
                        start_snip = max(0, pos[0] - 50)
                        end_snip = min(len(content), pos[0] + 150)
                        snippet = content[start_snip:end_snip]
                        results.append({
                            "file": fn,
                            "count": len(pos),
                            "snippet": highlight_keyword(snippet, keyword)
                        })
    
    # Sortir berdasarkan jumlah terbanyak
    results = sorted(results, key=lambda x: x['count'], reverse=True)
    top_results = results[:2]
    sisa_results = results[2:]
    
    exec_time = round((time.time() - start_time) * 1000, 3)
    total_all = len([f for f in os.listdir(DATA_FOLDER) if f.endswith('.txt')])

    return render_template("index.html", mode=mode, keyword=keyword, 
                           results=top_results, sisa_results=sisa_results, 
                           time_search=exec_time, total_docs_all=total_all)

@app.route("/upload-search", methods=["POST"])
def upload_search():
    keyword = request.form.get("keyword", "").strip()
    file = request.files.get("file")
    upload_filename, upload_count, upload_snippet = None, 0, ""

    if file and keyword:
        upload_filename = file.filename
        path = os.path.join(UPLOAD_FOLDER, upload_filename)
        file.save(path)
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            pos = kmp_search(content.lower(), keyword.lower())
            if pos:
                upload_count = len(pos)
                snippet = content[max(0, pos[0]-50):pos[0]+150]
                upload_snippet = highlight_keyword(snippet, keyword)

    return render_template("index.html", mode="upload", keyword=keyword, 
                           upload_filename=upload_filename, upload_count=upload_count, 
                           upload_snippet=upload_snippet)

@app.route("/get-file/<filename>")
def get_file(filename):
    for folder in [DATA_FOLDER, UPLOAD_FOLDER]:
        path = os.path.join(folder, filename)
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return jsonify({"content": f.read()})
    return jsonify({"error": "File tidak ditemukan"}), 404

if __name__ == "__main__":
    app.run(debug=True)