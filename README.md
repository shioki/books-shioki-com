# 公開サイト（books.shioki.com）のソース

このフォルダは **公開用リポジトリ books-shioki-com にデプロイするコンテンツの正本**です。

- **編集**: ここ（Private リポジトリ内）のファイルだけを編集する
- **公開**: `scripts/deploy_books_site.py` を実行すると、内容が Public の books-shioki-com にコピーされ、git push まで実行される

含めるファイルの目安:
- `index.html` … トップページ（DADS デザイン適用済み）。**SNS シェア用の OGP / Twitter メタは `<head>` に固定記述**
- `_layouts/default.html` … 書評ページ・キャラクター紹介ページの共通レイアウト（**OGP・canonical・Twitter Card** を Liquid で出力。`page.*` 未指定時は `_config.yml` の `default_og_image` 等にフォールバック）
- `assets/css/dads.css` … 共通の DADS スタイル
- `_config.yml` … reviews/ と okiwa-profile.md に共通レイアウトを適用。**`url` / `description` / `default_og_image`** はシェアプレビュー用
- `images/og-default.png` … トップ・キャラ・画像未備の書評などで使う **1200×630** のフォールバック画像（差し替え可）
- 必要に応じて `CNAME` などもここに置き、デプロイ対象にできる

書評本文側の `title` / `description` / `og_image` / `canonical_url` / `og_locale` などは **`scripts/publish_to_books_site.py` が Front Matter を生成**（既存公開分は `scripts/backfill_review_og_meta.py`）。手順は [docs/setup/03-publish-to-books-shioki-com.md](../docs/setup/03-publish-to-books-shioki-com.md) を参照。
