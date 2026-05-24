const STORAGE_KEY = "prompt-parts-v1";

const categoryLabels = {
  flow: "進行制御",
  quality: "品質担保",
  format: "出力形式",
  coding: "開発",
  business: "事業評価",
  sns: "SNS",
};

const starterParts = [
  {
    id: "ask-missing-info",
    category: "flow",
    title: "情報不足なら質問",
    body: "情報が足りない場合は、推測で進めずに先に必要な質問をしてください。",
  },
  {
    id: "planning-first",
    category: "flow",
    title: "まずプランニング",
    body: "いきなり実行せず、まず目的、前提、作業手順、確認方法を短くプランニングしてください。",
  },
  {
    id: "critical-review",
    category: "quality",
    title: "否定的にもレビュー",
    body: "肯定的な見方だけでなく、失敗しそうな点、弱い前提、競合、運用負荷も含めて批判的にレビューしてください。",
  },
  {
    id: "quality-gate",
    category: "quality",
    title: "品質ゲート",
    body: "回答前に、具体性、実行可能性、重複の少なさ、ユーザーの目的との一致を自己チェックしてください。",
  },
  {
    id: "markdown-output",
    category: "format",
    title: "Markdownで出力",
    body: "読みやすいMarkdownで出力してください。見出しは必要な場合だけ使い、箇条書きは簡潔にしてください。",
  },
  {
    id: "copy-ready",
    category: "format",
    title: "コピペしやすく",
    body: "そのままコピーして使える形で出力してください。余計な前置きや説明は入れないでください。",
  },
  {
    id: "codebase-first",
    category: "coding",
    title: "コードを先に読む",
    body: "コード変更の前に、関連ファイルと既存パターンを確認し、影響範囲を把握してから実装してください。",
  },
  {
    id: "verify-after-change",
    category: "coding",
    title: "変更後に検証",
    body: "実装後は、可能な範囲でテスト、lint、動作確認を行い、実行した確認内容と結果を報告してください。",
  },
  {
    id: "business-durability",
    category: "business",
    title: "持続性を見る",
    body: "短期的な便利さだけでなく、継続利用される理由、模倣されやすさ、競合、運用コストも評価してください。",
  },
  {
    id: "sns-angle",
    category: "sns",
    title: "SNS向け角度",
    body: "SNSで伝わるように、誰のどんな困りごとに刺さるのか、1行目の引き、投稿の切り口を複数出してください。",
  },
];

let state = loadState();
let activeCategory = "all";
let selectedIds = [];

const partsList = document.querySelector("#partsList");
const selectedList = document.querySelector("#selectedList");
const outputText = document.querySelector("#outputText");
const memoInput = document.querySelector("#memoInput");
const searchInput = document.querySelector("#searchInput");
const copyStatus = document.querySelector("#copyStatus");

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return { parts: starterParts };

  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed.parts)) return parsed;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  return { parts: starterParts };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderParts() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = state.parts.filter((part) => {
    const matchesCategory = activeCategory === "all" || part.category === activeCategory;
    const haystack = `${part.title} ${part.body} ${categoryLabels[part.category]}`.toLowerCase();
    return matchesCategory && haystack.includes(query);
  });

  partsList.innerHTML = "";

  if (filtered.length === 0) {
    partsList.innerHTML = '<p class="part-body">該当するパーツがありません。</p>';
    return;
  }

  for (const part of filtered) {
    const card = document.createElement("article");
    card.className = "part-card";
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="part-title">
        <span>${escapeHtml(part.title)}</span>
        <span class="tag">${categoryLabels[part.category]}</span>
      </div>
      <p class="part-body">${escapeHtml(part.body)}</p>
      <button class="add-part" type="button">追加</button>
    `;
    card.addEventListener("click", () => addSelected(part.id));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter") addSelected(part.id);
    });
    partsList.append(card);
  }
}

function renderSelected() {
  selectedList.innerHTML = "";

  if (selectedIds.length === 0) {
    selectedList.innerHTML = '<p class="part-body">追加したパーツがここに並びます。</p>';
  }

  selectedIds.forEach((id, index) => {
    const part = state.parts.find((item) => item.id === id);
    if (!part) return;

    const item = document.createElement("article");
    item.className = "selected-item";
    item.innerHTML = `
      <div class="part-title">
        <span>${escapeHtml(part.title)}</span>
        <span class="tag">${categoryLabels[part.category]}</span>
      </div>
      <p class="selected-body">${escapeHtml(part.body)}</p>
      <div class="selected-actions">
        <button class="ghost" type="button" data-action="up" title="左へ">←</button>
        <button class="ghost" type="button" data-action="down" title="右へ">→</button>
        <button class="ghost delete" type="button" data-action="delete" title="削除">×</button>
      </div>
    `;

    item.querySelector('[data-action="up"]').addEventListener("click", () => moveSelected(index, -1));
    item.querySelector('[data-action="down"]').addEventListener("click", () => moveSelected(index, 1));
    item.querySelector('[data-action="delete"]').addEventListener("click", () => removeSelected(index));
    selectedList.append(item);
  });

}

function rebuildOutputFromSelected() {
  const body = selectedIds
    .map((id) => state.parts.find((part) => part.id === id)?.body)
    .filter(Boolean)
    .join("\n\n");
  outputText.value = body;
}

function addSelected(id) {
  const part = state.parts.find((item) => item.id === id);
  if (!part) return;
  selectedIds.push(id);
  renderSelected();
  appendToOutput(part.body);
  outputText.focus();
}

function appendToOutput(text) {
  outputText.value = [outputText.value.trim(), text].filter(Boolean).join("\n\n");
}

function moveSelected(index, direction) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= selectedIds.length) return;
  const [item] = selectedIds.splice(index, 1);
  selectedIds.splice(nextIndex, 0, item);
  renderSelected();
  rebuildOutputFromSelected();
}

function removeSelected(index) {
  selectedIds.splice(index, 1);
  renderSelected();
  rebuildOutputFromSelected();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.querySelectorAll(".category").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".category.active")?.classList.remove("active");
    button.classList.add("active");
    activeCategory = button.dataset.category;
    renderParts();
  });
});

searchInput.addEventListener("input", renderParts);
outputText.addEventListener("input", () => {
  copyStatus.textContent = "";
});

document.querySelector("#clearButton").addEventListener("click", () => {
  selectedIds = [];
  memoInput.value = "";
  outputText.value = "";
  selectedList.innerHTML = '<p class="part-body">追加したパーツがここに並びます。</p>';
  copyStatus.textContent = "";
});

document.querySelector("#memoAddButton").addEventListener("click", addMemo);
memoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addMemo();
  }
});

function addMemo() {
  const memo = memoInput.value.trim();
  if (!memo) return;
  outputText.value = [outputText.value.trim(), memo].filter(Boolean).join("\n\n");
  memoInput.value = "";
  outputText.focus();
}

document.querySelector("#copyButton").addEventListener("click", async () => {
  if (!outputText.value.trim()) return;

  await navigator.clipboard.writeText(outputText.value);
  copyStatus.textContent = "コピーしました";
  setTimeout(() => {
    copyStatus.textContent = "";
  }, 1800);
});

document.querySelector("#partForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.querySelector("#titleInput").value.trim();
  const category = document.querySelector("#categoryInput").value;
  const body = document.querySelector("#bodyInput").value.trim();
  if (!title || !body) return;

  const newPart = {
    id: crypto.randomUUID(),
    category,
    title,
    body,
  };
  state.parts.unshift(newPart);
  saveState();
  event.currentTarget.reset();
  renderParts();
  addSelected(newPart.id);
});

document.querySelector("#exportButton").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "prompt-parts.json";
  anchor.click();
  URL.revokeObjectURL(url);
});

document.querySelector("#importInput").addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;

  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed.parts)) return;

  state = parsed;
  selectedIds = [];
  saveState();
  renderParts();
  renderSelected();
  event.target.value = "";
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}

renderParts();
renderSelected();
