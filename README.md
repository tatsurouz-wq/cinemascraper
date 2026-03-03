# 🎬 CineSync（シネシンク）

**映画館の壁を越え、観たい映画と2人の時間を最速でマッチングする。**

関東圏特化型のオープンソース・映画スケジュール統合プラットフォーム。

## 🎯 何ができる？

- **エリア横断比較**: 異なるエリアの映画スケジュールを横並びで比較
- **デートプラン提案型タイムライン**: 上映終了時刻を明記し、映画後の予定に最適な回を発見
- **ワンタップ共有**: 選択したスケジュールをLINEで簡単共有

## 🏗 技術スタック

| 領域 | 技術 |
|------|------|
| フロントエンド | Next.js + React + Tailwind CSS |
| スクレイパー | Python 3.12 + Playwright |
| パッケージ管理 | pnpm (FE) / uv (BE) |
| ホスティング | GitHub Pages |
| CI/CD | GitHub Actions |

## 🚀 ローカル開発

### 前提条件

- Node.js 20+
- Python 3.12+
- [pnpm](https://pnpm.io/)
- [uv](https://docs.astral.sh/uv/)

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/YOUR_USERNAME/cinesync.git
cd cinesync

# スクレイパー
cd scraper
uv sync --group dev
uv run playwright install chromium

# フロントエンド
cd ../web
pnpm install
```

### 開発

```bash
# スクレイパー実行（今日から3日分）
cd scraper
uv run python -m src.main 3

# データをフロントに配置
mkdir -p ../web/public/data/schedules
cp -r ../data/schedules/* ../web/public/data/schedules/

# フロントエンド開発サーバー
cd ../web
pnpm dev
```

### テスト

```bash
cd scraper
uv run pytest tests/ -v
```

## 📁 プロジェクト構成

```
cinesync/
├── scraper/          # Python スクレイパー
│   ├── src/
│   │   ├── scrapers/ # チェーン別スクレイパー
│   │   ├── models.py # Pydantic データモデル
│   │   └── main.py   # エントリーポイント
│   └── tests/
├── web/              # Next.js フロントエンド
│   └── src/
│       ├── app/       # ページ
│       ├── components/ # UIコンポーネント
│       ├── hooks/      # カスタムフック
│       └── lib/        # 型定義・ユーティリティ
├── data/schedules/   # スクレイパー出力JSON
└── .github/workflows/ # CI/CD
```

## 🎬 対応シネコン

### Phase 1（現在）
- ✅ 109シネマズ（川崎、二子玉川、港北）

### 今後の予定
- 🔲 TOHOシネマズ
- 🔲 イオンシネマ

## 🤝 コントリビューション

新しい映画館チェーンのスクレイパー追加を歓迎します！
詳しくは [CONTRIBUTING.md](CONTRIBUTING.md) をご覧ください。

## ⚖️ 注意事項

- 本プロジェクトは各映画館のWebサイトからスケジュール情報を取得しています
- スクレイピングは `robots.txt` を尊重し、適切な間隔（2秒以上）で行います
- データの正確性は保証されません。正式な情報は各映画館の公式サイトをご確認ください

## 📄 ライセンス

[MIT License](LICENSE)
