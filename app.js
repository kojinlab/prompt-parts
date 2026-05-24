const STORAGE_KEY = "prompt-parts-v1";

const categoryLabels = {
  clarification: "確認質問",
  flow: "進行制御",
  quality: "品質担保",
  format: "出力形式",
  coding: "開発",
  business: "事業評価",
  sns: "SNS",
  research: "調査",
  image: "画像生成",
  safety: "制約",
};

const starterParts = [
  {
    id: "ask-missing-info",
    category: "clarification",
    title: "情報不足なら質問",
    body: "情報が足りない場合は、推測で進めずに先に必要な質問をしてください。",
  },
  {
    id: "max-three-questions",
    category: "clarification",
    title: "質問は最大3つ",
    body: "回答前に確認が必要な場合は、重要度の高い質問だけを最大3つに絞ってください。",
  },
  {
    id: "restated-goal",
    category: "clarification",
    title: "目的を言い換える",
    body: "私の最終目的を一文で整理し、認識がズレていそうな点があれば先に確認してください。",
  },
  {
    id: "missing-decision-info",
    category: "clarification",
    title: "判断材料の不足",
    body: "判断に必要だが未提供の情報を「不足情報」として分け、なくても進められる部分と分けてください。",
  },
  {
    id: "planning-first",
    category: "flow",
    title: "まずプランニング",
    body: "いきなり実行せず、まず目的、前提、作業手順、確認方法を短くプランニングしてください。",
  },
  {
    id: "goal-first",
    category: "flow",
    title: "目的から確認",
    body: "まず、この依頼の最終目的と成功条件を確認したうえで、必要な作業に分解してください。",
  },
  {
    id: "assumptions-visible",
    category: "flow",
    title: "前提を明示",
    body: "判断に使っている前提、未確定情報、推測している部分を分けて明示してください。",
  },
  {
    id: "options-compare",
    category: "flow",
    title: "選択肢を比較",
    body: "いきなり1案に絞らず、主要な選択肢を2〜3個出し、メリット、デメリット、向いている条件を比較してください。",
  },
  {
    id: "ask-before-risky",
    category: "flow",
    title: "リスク前に確認",
    body: "取り返しがつきにくい変更、公開、削除、送信、課金、法務・医療・金融に関わる判断は、実行前に確認してください。",
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
    id: "score-rubric",
    category: "quality",
    title: "採点基準で評価",
    body: "出力を、具体性、実行可能性、独自性、リスク、読みやすさの5項目で簡潔に自己評価し、弱い項目を改善してください。",
  },
  {
    id: "red-team",
    category: "quality",
    title: "レッドチーム視点",
    body: "この案を失敗させるならどこが弱点になるか、反対意見、悪用、誤解、運用破綻の観点から検討してください。",
  },
  {
    id: "no-generic",
    category: "quality",
    title: "一般論禁止",
    body: "どのテーマにも当てはまる一般論ではなく、この依頼固有の事情、制約、利用場面に結びつけて回答してください。",
  },
  {
    id: "revise-not-polish",
    category: "quality",
    title: "弱ければ差し戻し",
    body: "品質が足りない場合は、無理に完成扱いせず、どこが弱いかを示して修正版を出してください。",
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
    id: "table-output",
    category: "format",
    title: "比較表で出す",
    body: "比較や判断が必要な箇所は、項目、判断、理由、次のアクションが分かる表で出力してください。",
  },
  {
    id: "body-only",
    category: "format",
    title: "本文だけ出す",
    body: "ラベル、前置き、解説、候補名を付けず、ユーザーがそのままコピーできる本文だけを出してください。",
  },
  {
    id: "short-executive",
    category: "format",
    title: "最初に結論",
    body: "最初に結論を1〜3行で出し、その後に理由、具体策、注意点の順で整理してください。",
  },
  {
    id: "json-output",
    category: "format",
    title: "JSONで出す",
    body: "後工程で処理しやすいように、指定されたキーだけを使った有効なJSONで出力してください。説明文はJSONの外に出さないでください。",
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
    id: "small-diff",
    category: "coding",
    title: "差分を小さく",
    body: "既存設計に合わせ、目的に必要な最小差分で実装してください。無関係なリファクタや見た目の変更は避けてください。",
  },
  {
    id: "test-risk",
    category: "coding",
    title: "リスクに応じて検証",
    body: "変更のリスクに応じて、テスト、lint、手動確認、エッジケース確認のどれを実行すべきか判断し、結果を報告してください。",
  },
  {
    id: "protect-user-changes",
    category: "coding",
    title: "既存変更を守る",
    body: "ユーザーや他の作業者の未コミット変更を勝手に戻さず、必要なら差分を確認してから作業してください。",
  },
  {
    id: "explain-files",
    category: "coding",
    title: "変更ファイルを説明",
    body: "最後に、変更したファイル、変更理由、確認した動作を簡潔にまとめてください。",
  },
  {
    id: "business-durability",
    category: "business",
    title: "持続性を見る",
    body: "短期的な便利さだけでなく、継続利用される理由、模倣されやすさ、競合、運用コストも評価してください。",
  },
  {
    id: "market-alternatives",
    category: "business",
    title: "代替手段を見る",
    body: "この案の競合だけでなく、ユーザーが今すでに使っている代替手段、無料で済ませる方法、乗り換え障壁を見てください。",
  },
  {
    id: "distribution-first",
    category: "business",
    title: "配布導線から考える",
    body: "機能案だけでなく、誰がどこで見つけ、なぜ試し、何をSNSで共有したくなるかまで考えてください。",
  },
  {
    id: "mvp-scope",
    category: "business",
    title: "MVPに削る",
    body: "最短で公開できるMVPに絞り、今やらないこと、後回しにすること、最初に検証する仮説を明示してください。",
  },
  {
    id: "failure-modes",
    category: "business",
    title: "失敗パターン",
    body: "この企画が失敗するとしたら、集客、継続利用、品質、運用、法務、競合のどこで詰まるかを具体的に挙げてください。",
  },
  {
    id: "sns-angle",
    category: "sns",
    title: "SNS向け角度",
    body: "SNSで伝わるように、誰のどんな困りごとに刺さるのか、1行目の引き、投稿の切り口を複数出してください。",
  },
  {
    id: "hook-variants",
    category: "sns",
    title: "フックを分ける",
    body: "同じ言い換えではなく、問題提起、意外性、実例、反論、失敗談、比較の別角度でフック案を出してください。",
  },
  {
    id: "non-template-copy",
    category: "sns",
    title: "テンプレ臭を消す",
    body: "よくあるAI投稿の型に寄せず、具体的な場面、違和感、判断基準が伝わる言い回しにしてください。",
  },
  {
    id: "shareable-demo",
    category: "sns",
    title: "共有される見せ方",
    body: "SNSで紹介する前提で、スクショ映えする使い方、1行説明、投稿文、試したくなる導線をセットで提案してください。",
  },
  {
    id: "research-primary",
    category: "research",
    title: "一次情報優先",
    body: "可能な限り公式ドキュメント、論文、一次情報、実際の価格・仕様を確認し、情報源と確認日を明示してください。",
  },
  {
    id: "research-uncertainty",
    category: "research",
    title: "不確実性を分ける",
    body: "確認済みの事実、推測、古い可能性がある情報、追加確認が必要な点を分けて整理してください。",
  },
  {
    id: "research-competitors",
    category: "research",
    title: "競合を実名で見る",
    body: "抽象的な競合分析ではなく、実在する競合・代替サービスを挙げ、価格、機能、弱点、差別化余地を比較してください。",
  },
  {
    id: "research-citations",
    category: "research",
    title: "根拠リンク付き",
    body: "重要な主張には根拠リンクを添え、リンクがない推測は推測として扱ってください。",
  },
  {
    id: "image-structure",
    category: "image",
    title: "画像プロンプト構造化",
    body: "画像生成用に、被写体、用途、構図、画角、背景、光、質感、色、避けたい要素を分けてプロンプト化してください。",
  },
  {
    id: "image-first-glance",
    category: "image",
    title: "一目で伝わる",
    body: "パッと見で主題が分かる構図にしてください。抽象的すぎる背景や雰囲気だけの絵にせず、対象物を明確に見せてください。",
  },
  {
    id: "image-variations",
    category: "image",
    title: "別方向の3案",
    body: "同じ雰囲気の微差ではなく、構図、色、視点、情報量が明確に違う画像プロンプトを3案出してください。",
  },
  {
    id: "image-no-logo",
    category: "image",
    title: "ロゴなし",
    body: "実在企業、サービス、ツールのロゴや商標を入れず、汎用的なビジュアルとして成立させてください。",
  },
  {
    id: "image-social-card",
    category: "image",
    title: "SNSカード向け",
    body: "SNSのサムネイルで見ても意味が伝わるよう、主題を大きく、余白を整理し、文字を載せる余地を残した構図にしてください。",
  },
  {
    id: "safety-boundaries",
    category: "safety",
    title: "境界条件",
    body: "できること、できないこと、確認が必要なこと、ユーザー判断に委ねるべきことを明確に分けてください。",
  },
  {
    id: "safety-privacy",
    category: "safety",
    title: "個人情報に注意",
    body: "個人情報、秘密情報、認証情報、社外秘情報を含めない前提で進め、必要なら伏せ字やダミーデータに置き換えてください。",
  },
  {
    id: "safety-legal",
    category: "safety",
    title: "法務リスク確認",
    body: "法務、著作権、商標、規約、医療、金融に関わる可能性がある場合は、一般情報と専門家確認が必要な領域を分けてください。",
  },
  {
    id: "safety-no-fabrication",
    category: "safety",
    title: "捏造禁止",
    body: "分からない事実、数字、引用、出典、実績を作らないでください。不明な場合は不明と書き、確認方法を提案してください。",
  },
];

const starterBundles = [
  {
    id: "bundle-plan",
    title: "まず計画して進める",
    description: "質問、前提、手順、確認まで入る作業開始セット",
    parts: ["ask-missing-info", "planning-first", "assumptions-visible", "short-executive"],
  },
  {
    id: "bundle-review",
    title: "厳しめレビュー",
    description: "弱点、失敗パターン、採点基準まで見る",
    parts: ["critical-review", "red-team", "failure-modes", "score-rubric"],
  },
  {
    id: "bundle-coding",
    title: "コード変更依頼",
    description: "既存確認、最小差分、検証、報告のセット",
    parts: ["codebase-first", "small-diff", "protect-user-changes", "test-risk", "explain-files"],
  },
  {
    id: "bundle-business",
    title: "事業アイデア評価",
    description: "代替手段、持続性、MVP、配布導線を見る",
    parts: ["market-alternatives", "business-durability", "mvp-scope", "distribution-first"],
  },
  {
    id: "bundle-sns",
    title: "SNS投稿作成",
    description: "角度違い、テンプレ臭除去、コピーしやすさ",
    parts: ["sns-angle", "hook-variants", "non-template-copy", "body-only"],
  },
  {
    id: "bundle-research",
    title: "根拠ありリサーチ",
    description: "一次情報、競合、根拠リンク、不確実性整理",
    parts: ["research-primary", "research-competitors", "research-citations", "research-uncertainty"],
  },
  {
    id: "bundle-image",
    title: "画像生成ブリーフ",
    description: "被写体、構図、光、SNS映えまで指定",
    parts: ["image-structure", "image-first-glance", "image-social-card", "image-no-logo"],
  },
];

let state = loadState();
let activeCategory = "all";
let selectedIds = [];

const partsList = document.querySelector("#partsList");
const bundleList = document.querySelector("#bundleList");
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
    if (Array.isArray(parsed.parts)) {
      const savedIds = new Set(parsed.parts.map((part) => part.id));
      const missingStarterParts = starterParts.filter((part) => !savedIds.has(part.id));
      return { ...parsed, parts: [...missingStarterParts, ...parsed.parts] };
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  return { parts: starterParts };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderBundles() {
  bundleList.innerHTML = "";

  for (const bundle of starterBundles) {
    const card = document.createElement("button");
    card.className = "bundle-card";
    card.type = "button";
    card.innerHTML = `
      <strong>${escapeHtml(bundle.title)}</strong>
      <span>${escapeHtml(bundle.description)}</span>
    `;
    card.addEventListener("click", () => addBundle(bundle.parts));
    bundleList.append(card);
  }
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
    card.dataset.category = part.category;
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

function addBundle(partIds) {
  const parts = partIds.map((id) => state.parts.find((item) => item.id === id)).filter(Boolean);
  if (parts.length === 0) return;
  selectedIds.push(...parts.map((part) => part.id));
  renderSelected();
  appendToOutput(parts.map((part) => part.body).join("\n\n"));
  outputText.focus();
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

renderBundles();
renderParts();
renderSelected();
