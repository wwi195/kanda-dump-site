# ヒーロー画像化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** トップページのヒーローセクションを、動画プレースホルダー＋CSS地層演出から、1枚の背景写真（仮のトラック写真）に置き換える。

**Architecture:** `index.html`の`hero__media`内から`<video>`と`.hero__strata`関連要素を削除し、代わりに`<img class="hero__image">`を1枚だけ配置する。対応するCSS（layout.css / components.css / animation.css）から動画・地層関連のルールを削除し、`.hero__image`用のルールに置き換える。動画制御専用だった`hero-motion.js`は不要になるため削除する。

**Tech Stack:** 素のHTML/CSS/JS（ビルドツール・フレームワークなし）。自動テストは存在しないプロジェクトのため、各タスクの検証はgrepによる存在確認とローカルサーバーでの目視確認で行う。

**設計書:** `docs/superpowers/specs/2026-07-28-hero-image-design.md`

---

### Task 1: ヒーロー背景写真（仮画像）を配置する

**Files:**
- Create: `assets/img/hero/hero-highway.jpg`

- [ ] **Step 1: ディレクトリを作成する**

Run: `mkdir -p assets/img/hero`

- [ ] **Step 2: Pexelsの無料ストック写真をダウンロードする**

Run:
```bash
curl -sL -o assets/img/hero/_source-download.jpeg "https://images.pexels.com/photos/28264496/pexels-photo-28264496.jpeg"
```

Expected: コマンドがエラーなく終了し、`assets/img/hero/_source-download.jpeg` が作成される（数百KB〜1MB程度）。

- [ ] **Step 3: 1920px幅にリサイズしてJPEG圧縮し、配置する**

Run:
```bash
python -c "
from PIL import Image
im = Image.open('assets/img/hero/_source-download.jpeg')
w, h = im.size
new_w = 1920
new_h = round(h * new_w / w)
im = im.resize((new_w, new_h), Image.LANCZOS)
im.save('assets/img/hero/hero-highway.jpg', 'JPEG', quality=82, optimize=True)
print(im.size)
"
```

Expected出力: `(1920, 1440)` （元画像が4032x3024の4:3比率のため）

- [ ] **Step 4: ダウンロード用の一時ファイルを削除し、最終ファイルのサイズを確認する**

Run:
```bash
rm assets/img/hero/_source-download.jpeg
ls -la assets/img/hero/hero-highway.jpg
```

Expected: `_source-download.jpeg` が消えている。`hero-highway.jpg` のファイルサイズが 500KB 未満程度であること（大きすぎる場合はStep 3のqualityを下げて再実行する）。

- [ ] **Step 5: Commit**

```bash
git add assets/img/hero/hero-highway.jpg
git commit -m "Add placeholder hero background photo"
```

---

### Task 2: index.htmlのヒーローマークアップを画像に置き換える

**Files:**
- Modify: `index.html:57-70`
- Modify: `index.html:251`（`hero-motion.js`の読み込み行）

- [ ] **Step 1: hero__media内のvideo/strataをimgに置き換える**

置き換え前（`index.html:57-70`）:
```html
  <section class="hero" id="top">
    <div class="hero__media" data-hero-media>
      <video class="hero__video" data-hero-video muted loop playsinline autoplay>
        <!-- TODO:実写映像。準備でき次第 assets/video/ に配置してsrcを設定する -->
        <source src="assets/video/hero-placeholder.mp4" type="video/mp4">
      </video>
      <div class="hero__strata" aria-hidden="true">
        <span class="hero__stratum" style="--i:0"></span>
        <span class="hero__stratum" style="--i:1"></span>
        <span class="hero__stratum" style="--i:2"></span>
        <span class="hero__stratum" style="--i:3"></span>
      </div>
      <div class="hero__scrim" aria-hidden="true"></div>
    </div>
```

置き換え後:
```html
  <section class="hero" id="top">
    <div class="hero__media" data-hero-media>
      <!-- TODO:実データ：自社の実写トラック／高速道路の写真に差し替え -->
      <img class="hero__image" src="assets/img/hero/hero-highway.jpg" alt="高速道路を走るトラック（イメージ）">
      <div class="hero__scrim" aria-hidden="true"></div>
    </div>
```

- [ ] **Step 2: hero-motion.jsの読み込み行を削除する**

削除する行（`index.html:251`）:
```html
<script src="assets/js/hero-motion.js" defer></script>
```

- [ ] **Step 3: 削除したクラスが残っていないことを確認する**

Run: `grep -n "hero__video\|hero__strata\|hero__stratum\|hero-motion" index.html`

Expected: 何も出力されない（マッチなし）。

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Replace hero video/strata markup with a static background image"
```

---

### Task 3: 不要になったhero-motion.jsを削除する

**Files:**
- Delete: `assets/js/hero-motion.js`

- [ ] **Step 1: ファイルを削除する**

Run: `git rm assets/js/hero-motion.js`

- [ ] **Step 2: 他のファイルから参照されていないことを確認する**

Run: `grep -rn "hero-motion" --include=*.html --include=*.js .`

Expected: 何も出力されない（マッチなし）。

- [ ] **Step 3: Commit**

```bash
git commit -m "Remove hero-motion.js (video control script no longer needed)"
```

---

### Task 4: layout.cssから動画・地層ルールを削除し、.hero__imageを追加する

**Files:**
- Modify: `assets/css/layout.css:97-118`

- [ ] **Step 1: 置き換える**

置き換え前（`assets/css/layout.css:97-118`）:
```css
.hero__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 2;
}

.hero__strata {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  z-index: var(--z-strata);
}

.hero__stratum {
  flex: 1 1 0;
  width: 100%;
  transform-origin: left;
}
```

置き換え後:
```css
.hero__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 2;
}
```

- [ ] **Step 2: 確認する**

Run: `grep -n "hero__video\|hero__strata\|hero__stratum\|hero__image" assets/css/layout.css`

Expected: `.hero__image` の行だけが出力される。

- [ ] **Step 3: Commit**

```bash
git add assets/css/layout.css
git commit -m "Replace hero video/strata layout rules with .hero__image"
```

---

### Task 5: components.cssから動画・地層の配色ルールを削除する

**Files:**
- Modify: `assets/css/components.css:155-174`

- [ ] **Step 1: 削除する**

削除前（`assets/css/components.css:155-178`）:
```css
/* ==== Hero ==== */
.hero__video {
  opacity: 0;
}

.hero__stratum:nth-child(1) {
  background-color: var(--color-steel-100);
}

.hero__stratum:nth-child(2) {
  background-color: var(--color-steel-300);
}

.hero__stratum:nth-child(3) {
  background-color: var(--color-steel-500);
}

.hero__stratum:nth-child(4) {
  background-color: var(--color-steel-700);
}

.hero__scrim {
  background: linear-gradient(180deg, rgba(20, 32, 42, 0.35) 0%, rgba(20, 32, 42, 0.88) 100%);
}
```

削除後:
```css
/* ==== Hero ==== */
.hero__scrim {
  background: linear-gradient(180deg, rgba(20, 32, 42, 0.35) 0%, rgba(20, 32, 42, 0.88) 100%);
}
```

- [ ] **Step 2: 確認する**

Run: `grep -n "hero__video\|hero__stratum" assets/css/components.css`

Expected: 何も出力されない（マッチなし）。

- [ ] **Step 3: Commit**

```bash
git add assets/css/components.css
git commit -m "Remove hero video/strata color rules from components.css"
```

---

### Task 6: animation.cssから動画クロスフェード・地層アニメーションを削除する

**Files:**
- Modify: `assets/css/animation.css:37-56`
- Modify: `assets/css/animation.css:85-87`（reduced-motion内）

- [ ] **Step 1: メインのアニメーション定義を削除する**

削除前（`assets/css/animation.css:37-56`、前後の空行含む）:
```css
/* ==== Hero: video crossfade ==== */
.hero__video {
  transition: opacity var(--duration-slow) var(--ease-out);
}

.hero__video.is-active {
  opacity: 1;
}

/* ==== Hero: 地層が左から積み上がるフォールバック演出（CSSのみで完結） ==== */
@keyframes strata-grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.hero__stratum {
  transform: scaleX(0);
  animation: strata-grow var(--duration-slow) var(--ease-out) forwards;
  animation-delay: calc(var(--i, 0) * 150ms + 150ms);
}

/* ==== Scroll reveal ==== */
```

削除後（このブロックを丸ごと削除し、直前の`.card`ブロックの次に`/* ==== Scroll reveal ==== */`が続く形にする）:
```css
/* ==== Scroll reveal ==== */
```

- [ ] **Step 2: reduced-motion内の地層ルールを削除する**

削除前（`@media (prefers-reduced-motion: reduce)`ブロック内）:
```css
  [data-reveal] {
    opacity: 1;
    transform: none;
  }

  .hero__stratum {
    transform: scaleX(1);
  }
}
```

削除後:
```css
  [data-reveal] {
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 3: 確認する**

Run: `grep -n "hero__video\|hero__stratum\|strata-grow" assets/css/animation.css`

Expected: 何も出力されない（マッチなし）。

- [ ] **Step 4: Commit**

```bash
git add assets/css/animation.css
git commit -m "Remove hero video/strata animations"
```

---

### Task 7: README.mdを実態に合わせて更新する

**Files:**
- Modify: `README.md`

- [ ] **Step 1: ディレクトリ構成の説明を更新する**

置き換え前:
```
│   ├── js/                 main.js（ナビ） / scroll-reveal.js（出現・カウントアップ） / hero-motion.js（動画・地層演出）
│   ├── img/                画像プレースホルダ
│   └── video/              ヒーロー動画の配置場所（現状は未配置）
```

置き換え後:
```
│   ├── js/                 main.js（ナビ） / scroll-reveal.js（出現・カウントアップ）
│   ├── img/                画像プレースホルダ（hero/ にヒーロー背景写真）
│   └── video/              （現在未使用。将来的に動画演出を追加する場合はここに配置）
```

- [ ] **Step 2: 本番公開前チェックリストの項目を更新する**

置き換え前:
```
- [ ] ヒーロー動画（`assets/video/` に実写を配置し `index.html` の `<source src>` を差し替え。動画が無い間はCSSのみの地層フォールバックが自動表示される）
```

置き換え後:
```
- [ ] ヒーロー背景写真（現在は無料ストック写真の仮画像。`assets/img/hero/hero-highway.jpg` を自社の実写トラック／高速道路の写真に差し替える）
```

- [ ] **Step 3: 「今後の実装」セクションにプランCを追記する**

置き換え前:
```
## 今後の実装（未着手）

- `tools/optimize_images.py`／`tools/check_links.py`：ローカル専用のPythonユーティリティ
- `api/app.py`：問い合わせ受付・概算見積りAPI（GitHub Pagesでは動作しないため、公開時は別ホストへのデプロイが必要。詳細は `api/README.md` を参照）

現時点ではどちらも空ファイルのままにしてあり、実装するタスク設定ができた段階で着手する。
```

置き換え後:
```
## 今後の実装（未着手）

- `tools/optimize_images.py`／`tools/check_links.py`：ローカル専用のPythonユーティリティ
- `api/app.py`：問い合わせ受付・概算見積りAPI（GitHub Pagesでは動作しないため、公開時は別ホストへのデプロイが必要。詳細は `api/README.md` を参照）
- ヒーロー背景の複数写真スライドショー化（プランC）：トラック・高速道路・積み込み風景などを数秒ごとに切り替える。実装時は`hero-motion.js`相当のJSを新規に書き起こす想定（別途ブレストしてから着手する）

`tools/`・`api/`は現時点ではどちらも空ファイルのままにしてあり、実装するタスク設定ができた段階で着手する。
```

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "Update README to reflect hero image replacing hero video"
```

---

### Task 8: ローカルで目視確認する

**Files:** なし（確認のみ）

- [ ] **Step 1: ローカルサーバーを起動する**

Run: `python -m http.server 8000`（バックグラウンド実行、または別ターミナル）

- [ ] **Step 2: トップページを取得しhero__imageが含まれることを確認する**

Run: `curl -s http://localhost:8000/ | grep "hero__image"`

Expected: `<img class="hero__image" src="assets/img/hero/hero-highway.jpg" ...>` を含む行が出力される。

- [ ] **Step 3: 画像ファイル自体が配信できることを確認する**

Run: `curl -s -o /dev/null -w "%{http_code} %{content_type}\n" http://localhost:8000/assets/img/hero/hero-highway.jpg`

Expected: `200 image/jpeg`

- [ ] **Step 4: ブラウザで目視確認する**

`http://localhost:8000` を開き、以下を確認する:
- ヒーロー背景にトラック写真が表示されている
- `.hero__scrim`のグラデーションでテキスト（見出し・ボタン）が問題なく読める
- ブラウザのデベロッパーツールのコンソールにエラーが出ていない（`hero-motion.js`の404など）
- スマホ幅（375px程度）に狭めても画像が崩れず`object-fit: cover`で表示される

- [ ] **Step 5: サーバーを停止する**

Run: `Ctrl+C`（フォアグラウンド実行の場合）、またはバックグラウンドプロセスをkillする
