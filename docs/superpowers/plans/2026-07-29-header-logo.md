# ヘッダーロゴ画像化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ヘッダーのテキストのみのロゴに、クライアント提供のロゴマーク画像（白背景・角なし四角プレート入り）を追加する。

**Architecture:** プロジェクトルートに置かれた`logo.jpg`（マーク＋社名のフル画像）を`assets/img/logo/logo-full.jpg`に保管し、そこからマーク部分だけを切り出した`assets/img/logo/logo-mark.jpg`を作る。`index.html`の`.site-logo`内に`<img class="site-logo__badge">`を追加し、既存のテキスト2行を`.site-logo__text`でラップする。CSSは`.site-logo`を縦積みから横並びに変え、`.site-logo__badge`（白背景・角丸なし）を新設する。

**Tech Stack:** 素のHTML/CSS/JS（ビルドツールなし）。画像加工はPython Pillow (`from PIL import Image`) を使用。自動テストは無いプロジェクトのため、検証はgrepとローカルサーバーでの目視確認で行う。

**設計書:** `docs/superpowers/specs/2026-07-29-header-logo-design.md`

---

### Task 1: ロゴ画像を配置する（フル版の保管＋マーク切り出し）

**Files:**
- Create: `assets/img/logo/logo-full.jpg`
- Create: `assets/img/logo/logo-mark.jpg`
- Delete: `logo.jpg`（プロジェクトルート、クライアントが置いた元ファイル）

前提: プロジェクトルート（`C:\Users\ab_99\kanda-dump-site`直下）に`logo.jpg`（1536×1024、JPEG）が既に存在する。

- [ ] **Step 1: ディレクトリを作成する**

Run: `mkdir -p assets/img/logo`

- [ ] **Step 2: フル版をassets/img/logo/に移動する**

Run: `mv logo.jpg assets/img/logo/logo-full.jpg`

- [ ] **Step 3: マーク部分を切り出してリサイズし、logo-mark.jpgとして保存する**

Run:
```bash
python -c "
from PIL import Image
im = Image.open('assets/img/logo/logo-full.jpg')
crop = im.crop((396, 140, 1194, 698))
w, h = crop.size
new_w = 600
new_h = round(h * new_w / w)
crop = crop.resize((new_w, new_h), Image.LANCZOS)
crop.save('assets/img/logo/logo-mark.jpg', 'JPEG', quality=90, optimize=True)
print(crop.size)
"
```

Expected出力: `(600, 420)`

- [ ] **Step 4: 結果を確認する**

Run: `ls -la assets/img/logo/ && ls logo.jpg 2>&1`

Expected: `assets/img/logo/logo-full.jpg`と`assets/img/logo/logo-mark.jpg`の両方が存在する。`ls logo.jpg`はエラー（`No such file or directory`）になる（ルートから移動済みのため）。

- [ ] **Step 5: Commit**

```bash
git add assets/img/logo/logo-full.jpg assets/img/logo/logo-mark.jpg
git commit -m "Add company logo assets (full lockup + cropped header mark)"
```

Note: `logo.jpg`はルートで元々git管理外（untracked）のファイルなので、`git add`の対象には含めない。`git status`で確認し、ルートに`logo.jpg`が残っていないことを確認すること。

---

### Task 2: index.htmlのヘッダーマークアップに画像バッジを追加する

**Files:**
- Modify: `index.html:27-31`

- [ ] **Step 1: 置き換える**

置き換え前（`index.html:27-31`）:
```html
    <a href="#top" class="site-logo">
      <!-- TODO:実データ：ロゴ画像に差し替え -->
      <span class="site-logo__main">関東大興運輸</span>
      <span class="site-logo__sub">TRANSPORT &amp; LOGISTICS</span>
    </a>
```

置き換え後:
```html
    <a href="#top" class="site-logo">
      <img class="site-logo__badge" src="assets/img/logo/logo-mark.jpg" alt="関東大興運輸株式会社 ロゴマーク">
      <span class="site-logo__text">
        <span class="site-logo__main">関東大興運輸</span>
        <span class="site-logo__sub">TRANSPORT &amp; LOGISTICS</span>
      </span>
    </a>
```

- [ ] **Step 2: 確認する**

Run: `grep -n "site-logo\|TODO:実データ：ロゴ画像" index.html`

Expected出力（該当行のみ、行番号は前後する可能性あり）:
```
    <a href="#top" class="site-logo">
      <img class="site-logo__badge" src="assets/img/logo/logo-mark.jpg" alt="関東大興運輸株式会社 ロゴマーク">
      <span class="site-logo__text">
        <span class="site-logo__main">関東大興運輸</span>
```
（`TODO:実データ：ロゴ画像`の行はもう存在しないこと）

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Add logo image badge to header, keep text logo alongside it"
```

---

### Task 3: CSSで.site-logoを横並びレイアウトにし、.site-logo__badgeを追加する

**Files:**
- Modify: `assets/css/components.css:27-46`

- [ ] **Step 1: 置き換える**

置き換え前（`assets/css/components.css:27-46`）:
```css
.site-logo {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.site-logo__main {
  font-family: var(--font-heading);
  font-weight: var(--fw-heading);
  font-size: 1.25rem;
  letter-spacing: 0.02em;
}

.site-logo__sub {
  font-family: var(--font-label);
  font-size: 0.65rem;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--color-accent);
}
```

置き換え後:
```css
.site-logo {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-2);
}

.site-logo__badge {
  display: block;
  height: 36px;
  width: auto;
  background-color: #ffffff;
  border-radius: var(--radius-none);
  padding: var(--space-1);
  object-fit: contain;
}

.site-logo__text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.site-logo__main {
  font-family: var(--font-heading);
  font-weight: var(--fw-heading);
  font-size: 1.25rem;
  letter-spacing: 0.02em;
}

.site-logo__sub {
  font-family: var(--font-label);
  font-size: 0.65rem;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--color-accent);
}
```

- [ ] **Step 2: 確認する**

Run: `grep -n "site-logo__badge\|site-logo__text\|flex-direction: row" assets/css/components.css`

Expected: `.site-logo__badge`と`.site-logo__text`の定義行、および`.site-logo`が`flex-direction: row`になっている行が出力される。

- [ ] **Step 3: Commit**

```bash
git add assets/css/components.css
git commit -m "Add .site-logo__badge styles and switch .site-logo to row layout"
```

---

### Task 4: ローカルで目視確認する

**Files:** なし（確認のみ）

- [ ] **Step 1: ローカルサーバーを起動する**

Run: `python -m http.server 8000`（バックグラウンド実行）

- [ ] **Step 2: バッジ画像が配信できることを確認する**

Run: `curl -s -o /dev/null -w "%{http_code} %{content_type}\n" http://localhost:8000/assets/img/logo/logo-mark.jpg`

Expected: `200 image/jpeg`

- [ ] **Step 3: index.htmlにbadgeのimgタグが含まれることを確認する**

Run: `curl -s http://localhost:8000/ | grep "site-logo__badge"`

Expected: `<img class="site-logo__badge" src="assets/img/logo/logo-mark.jpg" ...>` を含む行が出力される。

- [ ] **Step 4: ブラウザで目視確認する**

`http://localhost:8000` を開き、以下を確認する:
- ヘッダーに白い四角プレート＋ロゴマークが表示され、右に社名テキスト（関東大興運輸／TRANSPORT & LOGISTICS）が並んでいる
- ページ最上部（ヒーロー写真の上、ヘッダー背景が透明な状態）でも、スクロール後（ヘッダー背景が紺色になった状態）でも、白プレートが不自然に浮かず馴染んでいる
- モバイル幅（375px程度）でもロゴ・社名・ハンバーガーメニューが崩れず収まっている
- デベロッパーツールのコンソールに画像読み込みエラー（404など）が出ていない

- [ ] **Step 5: サーバーを停止する**

Run: バックグラウンドプロセスをkillする
