import os
import io
import json
import sqlite3
import contextlib
import requests as http_requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, AIMessage

app = Flask(__name__)
CORS(app)

OPENROUTER_KEY = os.environ.get("OPENROUTER_API_KEY", "")
PORT = int(os.environ.get("PORT", 5000))

STUDIO_DATA = {
    "name": "SYNTHRIX Studio",
    "mission": "Indie game development — innovative, immersive experiences",
    "techStack": {
        "web": "Next.js 15, TypeScript, Tailwind CSS, Vercel",
        "gameEngines": ["Godot 4", "Unity", "Unreal Engine 5"],
        "ai": "Python Flask + LangChain + OpenRouter (multi-model)",
    },
    "games": [
        {"title": "Escape the Bridge", "genre": "Puzzle/Adventure", "engine": "Godot 4",        "status": "Live"           },
        {"title": "BOOM",              "genre": "Action",           "engine": "Unity",           "status": "Live"           },
        {"title": "Overdrive",         "genre": "Racing",           "engine": "Unreal Engine 5", "status": "Live"           },
        {"title": "SynthPad 2",        "genre": "Music/Rhythm",     "engine": "Godot 4",         "status": "In Development" },
    ],
    "team": ["ORACLE","SCOUT","SAGE","FORGE","JUDGE","HERALD","THINKER",
             "SWIFT","WEAVER","NEXUS","ARCHITECT","DEVOPS","PIXEL","CIPHER","LORE"],
    "internalPanel": "/internal — SYSTEM and CONTROLLER access levels",
}

# ── Conversation Memory (SQLite) ────────────────────────────────────────────

class ConversationDB:
    def __init__(self, db_path: str = "conversations.db"):
        self.db_path = db_path
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS messages (
                    id         INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT    NOT NULL,
                    role       TEXT    NOT NULL,
                    content    TEXT    NOT NULL,
                    ts         DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)

    def get_history(self, session_id: str, limit: int = 20):
        with sqlite3.connect(self.db_path) as conn:
            rows = conn.execute(
                "SELECT role, content FROM messages WHERE session_id=? ORDER BY ts DESC LIMIT ?",
                (session_id, limit),
            ).fetchall()
        return [{"role": r, "content": c} for r, c in reversed(rows)]

    def save(self, session_id: str, role: str, content: str):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT INTO messages (session_id, role, content) VALUES (?,?,?)",
                (session_id, role, content),
            )

    def clear(self, session_id: str):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("DELETE FROM messages WHERE session_id=?", (session_id,))


db = ConversationDB()


# ── Tools ───────────────────────────────────────────────────────────────────

@tool
def web_search(query: str) -> str:
    """Search the web for real-time information, documentation, news, or research.
    Returns top results with titles, URLs, and summaries."""
    try:
        from duckduckgo_search import DDGS
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=5))
        if not results:
            return "No results found for that query."
        return "\n\n".join(
            f"TITLE: {r['title']}\nURL:   {r['href']}\nSUMMARY: {r['body']}"
            for r in results
        )
    except Exception as exc:
        return f"Search error: {exc}"


@tool
def run_code(code: str) -> str:
    """Execute Python code in a safe sandbox and return stdout output.
    Use for calculations, algorithms, data processing, or logic demos.
    No file I/O, network, or OS access — pure Python only."""
    blocked = [
        "import os", "import sys", "import subprocess", "import socket",
        "import requests", "import urllib", "import http", "import shutil",
        "__import__", "open(", "eval(", "exec(", "compile(", "breakpoint(",
    ]
    for pat in blocked:
        if pat in code:
            return f"SANDBOX BLOCKED: '{pat}' is not permitted."

    safe_builtins = {
        "print": print, "len": len, "range": range, "str": str, "int": int,
        "float": float, "list": list, "dict": dict, "set": set, "tuple": tuple,
        "bool": bool, "abs": abs, "max": max, "min": min, "sum": sum,
        "round": round, "sorted": sorted, "reversed": reversed,
        "enumerate": enumerate, "zip": zip, "map": map, "filter": filter,
        "isinstance": isinstance, "type": type, "repr": repr, "format": format,
        "chr": chr, "ord": ord, "hex": hex, "bin": bin, "oct": oct,
        "True": True, "False": False, "None": None,
        "ValueError": ValueError, "TypeError": TypeError,
        "KeyError": KeyError, "IndexError": IndexError, "Exception": Exception,
    }
    output = io.StringIO()
    try:
        with contextlib.redirect_stdout(output):
            exec(code, {"__builtins__": safe_builtins})  # noqa: S102
        result = output.getvalue().strip()
        return result if result else "(executed successfully — no output)"
    except Exception as exc:
        return f"RUNTIME ERROR — {type(exc).__name__}: {exc}"


@tool
def get_studio_context(query: str = "") -> str:
    """Get full SYNTHRIX Studio context: games catalog, tech stack, team, and project status.
    Always call this before answering studio-specific questions."""
    return json.dumps(STUDIO_DATA, indent=2)


@tool
def create_artifact(filename: str, content: str, language: str, summary: str) -> str:
    """Create a complete, production-ready file artifact — code, CSS, JSON, Markdown, HTML, etc.
    ALWAYS use this when asked to CREATE, WRITE, BUILD, MAKE, or GENERATE any file or component.
    Pass the FULL content, not a description. Include the exact output in your final response.

    Args:
        filename: Filename with extension, e.g. GameCard.tsx, hero.css, schema.json
        content:  Full, complete, ready-to-use file content
        language: typescript | css | json | html | markdown | python | bash | sql
        summary:  One sentence describing what this file does
    """
    bar = "─" * 56
    return f"\n╔ ARTIFACT — {filename}\n{bar}\n{content}\n{bar}\n✓ {summary}\n"


TOOLS = [web_search, run_code, get_studio_context, create_artifact]

# ── LangChain Agent ─────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are an elite AI specialist for SYNTHRIX Studio — an indie game development studio.

TOOLS AT YOUR DISPOSAL:
• web_search      — search the web for real-time info, docs, or research
• run_code        — execute Python and return actual output (math, algorithms, demos)
• get_studio_context — fetch live studio data (games, team, tech stack)
• create_artifact — produce complete files: components, CSS, JSON, docs, scripts

DIRECTIVE RULES:
• Asked to CREATE / WRITE / BUILD / MAKE / GENERATE anything → call create_artifact immediately with the FULL, production-ready content. Never describe what to make — make it. After the tool call, reproduce the artifact content verbatim in your response.
• Need current info → call web_search first
• Need studio data → call get_studio_context first
• Math, logic, or algorithm demo → call run_code
• Be direct and authoritative. No hedging. No "you could" or "you might".
• Format output for a plain-text monospace terminal."""


def _build_executor() -> AgentExecutor:
    llm = ChatOpenAI(
        model="deepseek/deepseek-v4-flash:free",
        api_key=OPENROUTER_KEY,
        base_url="https://openrouter.ai/api/v1",
        default_headers={
            "HTTP-Referer": "https://synthrix-website.vercel.app",
            "X-Title": "SYNTHRIX Mission Control",
        },
        temperature=0.72,
        max_tokens=1400,
    )
    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("placeholder", "{chat_history}"),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}"),
    ])
    agent = create_tool_calling_agent(llm, TOOLS, prompt)
    return AgentExecutor(
        agent=agent,
        tools=TOOLS,
        verbose=False,
        max_iterations=6,
        handle_parsing_errors=True,
    )


_executor: AgentExecutor | None = None


def get_executor() -> AgentExecutor:
    global _executor
    if _executor is None:
        _executor = _build_executor()
    return _executor


def _direct_llm_call(prompt: str, history: list[dict]) -> str:
    """Fallback: direct OpenRouter call without LangChain, mirrors Node.js route."""
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for m in history[-6:]:
        messages.append({"role": m["role"], "content": m["content"]})
    messages.append({"role": "user", "content": prompt})

    models = [
        "deepseek/deepseek-v4-flash:free",
        "google/gemma-4-31b-it:free",
        "nvidia/nemotron-3-super-120b-a12b:free",
    ]
    for model in models:
        try:
            res = http_requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_KEY}",
                    "HTTP-Referer": "https://synthrix-website.vercel.app",
                    "X-Title": "SYNTHRIX Mission Control",
                },
                json={"model": model, "messages": messages, "max_tokens": 800, "temperature": 0.72},
                timeout=25,
            )
            data = res.json()
            content = data["choices"][0]["message"]["content"]
            if content:
                return content
        except Exception:
            continue
    return "All models unavailable. Please try again."


# ── Flask Routes ─────────────────────────────────────────────────────────────

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "SYNTHRIX Python AI Backend",
        "tools": [t.name for t in TOOLS],
        "memory": "SQLite",
        "agent": "LangChain tool-calling",
    })


@app.route("/api/ai-team", methods=["POST", "OPTIONS"])
def ai_team():
    if request.method == "OPTIONS":
        return "", 204

    if not OPENROUTER_KEY:
        return jsonify({"error": "OPENROUTER_API_KEY not configured on Python backend"}), 500

    data = request.get_json(force=True) or {}
    prompt      = (data.get("prompt") or "").strip()
    session_id  = data.get("session_id", "default")
    req_history = data.get("history", [])  # passed from Next.js

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    # Build LangChain chat history from DB (long-term) merged with request history
    db_history   = db.get_history(session_id, limit=20)
    combined     = {f"{m['role']}:{m['content']}": m for m in (db_history + req_history)}
    merged       = list(combined.values())[-12:]

    lc_history = []
    for msg in merged:
        if msg["role"] == "user":
            lc_history.append(HumanMessage(content=msg["content"]))
        elif msg["role"] == "assistant":
            lc_history.append(AIMessage(content=msg["content"]))

    try:
        result = get_executor().invoke({
            "input": prompt,
            "chat_history": lc_history,
        })
        answer = result.get("output") or "No response."
    except Exception as exc:
        answer = _direct_llm_call(prompt, merged)

    db.save(session_id, "user",      prompt)
    db.save(session_id, "assistant", answer)

    return jsonify({
        "result":      answer,
        "team":        [{"name": "SYNTHRIX AGENT", "role": "LangChain Multi-Tool Agent"}],
        "synthesizer": "LANGCHAIN",
        "taskType":    "agent",
        "model":       "deepseek/deepseek-v4-flash:free",
        "backend":     "python",
    })


@app.route("/api/memory/clear", methods=["POST"])
def clear_memory():
    data       = request.get_json(force=True) or {}
    session_id = data.get("session_id", "default")
    db.clear(session_id)
    return jsonify({"status": "cleared", "session_id": session_id})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=False)
