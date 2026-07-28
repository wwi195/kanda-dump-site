# ヘッダーロゴ画像化 設計書

## 背景・目的

これまで`index.html`のヘッダーはテキストのみのロゴ（「関東大興運輸」＋「TRANSPORT & LOGISTICS」）で、`<!-- TODO:実データ：ロゴ画像に差し替え -->` というコメントが残っていた。

クライアントから会社のロゴ画像（`logo.jpg`、プロジェクトルートに配置済み、1536×1024px、JPEG）が提供された。この画像を使ってヘッダーのロゴを画像入りにする。

## 提供された画像の内容と制約

- 画像は「上部：青系グラデーションのK字マーク」「下部：社名フルテキスト（関東大興運輸株式会社）」が縦に1枚にまとまったもの
- 背景は白（透明部分なし、JPEG形式）
- マーク領域：おおよそ縦180〜658px、横436〜1154px（縦478px×横718px）
- 社名テキスト領域：縦714px以降（マークとの間に約55pxの余白）

**分かっている制約：**
- サイトのヘッダーは常に暗い背景（透明時はヒーロー写真の上、スクロール後は`rgba(20, 32, 42, 0.92)`の紺色）の上に乗るため、白背景の画像をそのまま使うと白い四角が目立つ
- ヘッダーの高さは小さい（`.section { scroll-margin-top: 88px; }` から見て概ね88px程度）ため、画像全体（マーク＋社名文字）を縮小すると社名の文字が潰れて読めなくなる
- サイト全体のデザインは角丸をほとんど使わない「角のあるシャープな工業的トーン」（`assets/css/tokens.css`に`--radius-none: 0`はあるが角丸トークンは存在しない）

## 決定事項

1. **ヘッダーにはマーク部分だけを切り出して使う。** 社名は今まで通りテキスト（`site-logo__main`／`site-logo__sub`）のまま残す。画像内の社名文字は使わない。
2. **マーク画像は白背景のまま、白い角ばった（角丸なし）四角プレートに乗せて表示する。** 背景の透明化（白抜き加工）は行わない。
3. **元のロゴ画像（マーク＋社名のフル版）は保管しておく。** 将来favicon・OGP画像・footerなどに使う可能性があるため、ソース素材として`assets/img/logo/logo-full.jpg`に置く。今回のヘッダー実装では使わない。

## 画像の仕様

- 元画像：`logo.jpg`（プロジェクトルート、1536×1024、JPEG）→ `assets/img/logo/logo-full.jpg` に移動（リサイズ・加工なし、原本として保管）
- ヘッダー用マーク画像：`logo-full.jpg`から `(左396, 上140, 右1194, 下698)` の範囲（798×558px）を切り出し、`assets/img/logo/logo-mark.jpg` として保存
  - 切り出し後、幅600px程度にリサイズ（ヘッダー表示サイズが小さいため、Retina考慮でも600px幅あれば十分。高さは比率維持）
  - JPEG quality=90程度で保存（ロゴなので写真より高めの品質を維持）
- alt属性：「関東大興運輸株式会社 ロゴマーク」

## マークアップ変更（index.html）

変更前：
```html
<a href="#top" class="site-logo">
  <!-- TODO:実データ：ロゴ画像に差し替え -->
  <span class="site-logo__main">関東大興運輸</span>
  <span class="site-logo__sub">TRANSPORT &amp; LOGISTICS</span>
</a>
```

変更後：
```html
<a href="#top" class="site-logo">
  <img class="site-logo__badge" src="assets/img/logo/logo-mark.jpg" alt="関東大興運輸株式会社 ロゴマーク">
  <span class="site-logo__text">
    <span class="site-logo__main">関東大興運輸</span>
    <span class="site-logo__sub">TRANSPORT &amp; LOGISTICS</span>
  </span>
</a>
```

## CSS変更（assets/css/components.css）

現状：
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

変更後：
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

`.site-logo__main`／`.site-logo__sub`のスタイルは変更なし（縦積みの入れ物が`.site-logo`から`.site-logo__text`に移るだけ）。

## スコープ外（今回やらないこと）

- favicon・OGP画像への適用（README.mdの別TODO項目のまま、着手しない）
- ロゴの白背景を透明化する加工
- footerや他ページへのロゴ画像の追加

## テスト・確認方法

自動テストは無い静的サイトのため、`python -m http.server`でローカル起動し、目視で確認する：

- ヘッダーに白いプレート＋マークが表示され、社名テキストと並んで読みやすいこと
- ヒーロー写真の上（スクロール前・透明背景）とスクロール後（紺色背景）の両方で、白プレートが浮いて見えず自然に馴染むこと
- モバイル幅でもロゴ・社名テキストが横に収まり、ヘッダーの高さが崩れないこと
- ブラウザのコンソールに画像読み込みエラー（404等）が出ていないこと
