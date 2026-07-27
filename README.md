# 関東大興運輸株式会社 コーポレートサイト（試作）

貨物運送・精密機器輸送会社のコーポレートサイト。**現在は社内試作フェーズ**で、社名・代表者・電話・FAX・メール・事業内容・保有車両・対応エリア・代表挨拶は実データを反映済み。所在地・設立・資本金・従業員数・許可/登録番号など未確定の項目は `<!-- TODO:実データ -->` でマーク済み。

フレームワーク・ビルドツールなし。素のHTML/CSS/JSのみで、`index.html` を直接開くか、簡易サーバーで確認できます。

## ローカルでの確認方法

```bash
python -m http.server
```

ブラウザで `http://localhost:8000` を開く（終了は `Ctrl+C`）。

`index.html` を直接ダブルクリックして開く方法（`file://...`）でも大枠は確認できますが、GitHub Pagesは実際にはHTTP配信のため、動画の自動再生やフェッチ処理などfile://だと本番と挙動が異なることがあります。確認は上記のサーバー経由を推奨します。

## ディレクトリ構成

```
.
├── index.html              1ページ完結のサイト本体
├── robots.txt              全ページ noindex（試作フェーズ用）
├── assets/
│   ├── css/                reset → tokens → layout → components → animation の順で読み込み
│   ├── js/                 main.js（ナビ） / scroll-reveal.js（出現・カウントアップ） / hero-motion.js（動画・地層演出）
│   ├── img/                画像プレースホルダ
│   └── video/              ヒーロー動画の配置場所（現状は未配置）
├── tools/                  画像最適化・リンクチェック等のローカル専用Pythonスクリプト（未実装・空）
├── api/                    将来の問い合わせ・見積りAPI用スタブ（未実装・空）
└── .github/workflows/deploy.yml   main pushでGitHub Pagesへ自動デプロイ
```

## GitHub Pagesへの公開手順

1. GitHubにリポジトリを作成し、このディレクトリの中身をpush
2. リポジトリの Settings → Pages → Build and deployment の Source を **GitHub Actions** に設定
3. `main` ブランチにpushすると `.github/workflows/deploy.yml` が自動実行され公開される
4. 試作段階では `robots.txt` と `index.html` の `<meta name="robots" content="noindex,nofollow">` により検索エンジンには載らない設定のままにする

## 本番公開前（実データ差し替え）チェックリスト

反映済み：社名・代表者・電話・FAX・メール・事業内容（5本柱）・保有車両・対応エリア（神奈川県）・代表挨拶。

未確定で `index.html` 内に `<!-- TODO:実データ -->` が残っている項目：

- [ ] 「仕事の流れ」セクション（相談〜報告の4ステップは未確認の仮内容。実際の業務フローを社長に確認して差し替える）
- [ ] 会社概要テーブルの所在地・設立・資本金・従業員数
- [ ] 許可・登録番号（一般貨物自動車運送事業／利用運送事業／産業廃棄物収集運搬業）
- [ ] フッターの住所
- [ ] お問い合わせの受付（営業）時間
- [ ] ロゴ画像・OGP画像・favicon・正式なURL（現状は未設定）
- [ ] ヒーロー動画（`assets/video/` に実写を配置し `index.html` の `<source src>` を差し替え。動画が無い間はCSSのみの地層フォールバックが自動表示される）
- [ ] `robots.txt` と `<meta name="robots">` の `noindex,nofollow` を外す（検索に載せてよいタイミングで）
- [ ] 問い合わせフォームの実装（`index.html` お問い合わせセクション内のコメント、および `api/README.md` を参照）

## 今後の実装（未着手）

- `tools/optimize_images.py`／`tools/check_links.py`：ローカル専用のPythonユーティリティ
- `api/app.py`：問い合わせ受付・概算見積りAPI（GitHub Pagesでは動作しないため、公開時は別ホストへのデプロイが必要。詳細は `api/README.md` を参照）

現時点ではどちらも空ファイルのままにしてあり、実装するタスク設定ができた段階で着手する。
