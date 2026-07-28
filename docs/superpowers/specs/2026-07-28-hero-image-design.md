# ヒーロー画像化 設計書

## 背景・目的

現在のトップページ（`index.html`）のヒーローセクションは、`<video>`（プレースホルダーで実体なし）と、動画が使えない場合のCSSのみの「地層」アニメーション（`.hero__strata`）で構成されている。

配送業のコーポレートサイトとして一般的な、トラックや高速道路の写真をヒーロー背景に据えたい。今回は実写がまだ無いため、無料ストック写真を仮画像として使い、実写が届き次第差し替える（他のTODO項目と同じ運用）。

将来的には複数枚の写真を切り替えるスライドショー（プランC）にしたい意向があるが、今回のスコープには含めない。

## スコープ

**含む**
- ヒーローセクションの背景を、動画＋CSS地層演出から1枚の背景写真に置き換える
- 仮画像としてPexelsの無料ストック写真を1枚配置する
- 不要になった動画関連のマークアップ・CSS・JSを削除する
- READMEの記述を実態に合わせて更新する

**含まない（将来対応）**
- 複数写真のスライドショー実装（プランC）。今回はマークアップを無理に拡張用構造にはしない
- 実写への差し替え作業そのもの（会社側から実写が届いた後の対応）

## 画像の仕様

- 出典：Pexels「Silver Semi-Truck」
  `https://images.pexels.com/photos/28264496/pexels-photo-28264496.jpeg`
  ライセンス：Pexelsライセンス（商用利用可・改変可・クレジット表記不要）
- 配置先：`assets/img/hero/hero-highway.jpg`
  - ダウンロード後、ヒーロー背景として使うサイズ（横1920px程度）にリサイズ・JPEG圧縮してから配置する
- `index.html`内に `<!-- TODO:実データ：自社の実写トラック／高速道路の写真に差し替え -->` を付与する
- `alt`属性は仮画像である旨がわかる説明文（例：「高速道路を走るトラック（イメージ）」）にする

## マークアップ変更（index.html）

現状の `hero__media` 内：

```html
<div class="hero__media" data-hero-media>
  <video class="hero__video" data-hero-video muted loop playsinline autoplay>
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

変更後：

```html
<div class="hero__media" data-hero-media>
  <!-- TODO:実データ：自社の実写トラック／高速道路の写真に差し替え -->
  <img class="hero__image" src="assets/img/hero/hero-highway.jpg" alt="高速道路を走るトラック（イメージ）">
  <div class="hero__scrim" aria-hidden="true"></div>
</div>
```

`data-hero-media` / `data-hero-video` は動画制御JS専用の属性なので、`data-hero-video`ごと削除する（`data-hero-media`は将来の拡張フックとして残す）。

## CSS変更

- `assets/css/layout.css`：`.hero__video`ルールを`.hero__image`に置き換え（`position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:2`はそのまま流用）。`.hero__strata` / `.hero__stratum`ルールを削除。
- `assets/css/components.css`：`.hero__video { opacity: 0; }`（JSでの遅延表示用フェード）を削除。`.hero__stratum:nth-child(n)`の配色ルールを削除。`.hero__scrim`のグラデーションはそのまま維持。
- `assets/css/animation.css`：`.hero__video` / `.hero__video.is-active` のトランジション、`.hero__stratum`のアニメーション定義、レスポンシブ内の`.hero__stratum`調整を削除。

## JS変更

- `assets/js/hero-motion.js` を削除する（`[data-hero-video]`が無くなるため、`querySelector`が常にnullを返し中身が完全に無意味になる）
- `index.html`の`<script src="assets/js/hero-motion.js" defer></script>`を削除する

## README.md更新

- ディレクトリ構成の説明：「hero-motion.js（動画・地層演出）」の記述を削除し、`assets/img/`の説明に「ヒーロー背景写真」を追記
- 本番公開前チェックリスト：「ヒーロー動画」の項目を「ヒーロー背景写真（仮画像→実写差し替え）」に書き換え
- 「今後の実装」セクションに、将来のプランC（複数写真のスライドショー化）を1行追記する

## テスト・確認方法

フレームワークもビルドもない静的サイトのため、自動テストは無い。`python -m http.server` でローカル起動し、目視で以下を確認する：

- ヒーロー背景に写真が表示され、`.hero__scrim`のグラデーションでテキストが読みやすいこと
- モバイル幅（スマホサイズ）でも画像が崩れず`object-fit: cover`で表示されること
- コンソールエラーが出ていないこと（`hero-motion.js`削除後の参照切れがないか）
