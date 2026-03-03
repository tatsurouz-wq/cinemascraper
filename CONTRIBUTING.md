# CineSync へのコントリビューション

CineSyncへの貢献をありがとうございます！🎬

## 新しい映画館チェーンの追加

最も求められているコントリビューションは、新しい映画館チェーンのスクレイパーです。

### 手順

1. `scraper/src/scrapers/` に新しいスクレイパーファイルを作成
2. `BaseScraper` を継承し、`scrape_theater()` を実装
3. `scraper/src/config.py` に劇場情報を追加
4. テストを `scraper/tests/` に追加
5. PRを作成

### スクレイパーの実装テンプレート

```python
from src.scrapers.base import BaseScraper
from src.models import Schedule, Theater

class NewChainScraper(BaseScraper):
    async def scrape_theater(self, theater: Theater, target_date: date) -> Schedule:
        # 1. URLを構築
        # 2. ページを取得
        # 3. DOMを解析
        # 4. Scheduleオブジェクトを返す
        ...
```

### 重要なルール

- **リクエスト間隔**: 最低2秒空ける
- **robots.txt**: 必ず確認
- **テスト**: フィクスチャHTML（モック）を使用したテストを必須とする
- **エラーハンドリング**: サイト構造変更に備えた防御的なパーサーを書く

## バグ報告

[Issues](../../issues) で報告してください。以下の情報を含めてください：

- 再現手順
- 期待される動作
- 実際の動作
- 環境（OS、Python/Node.jsバージョン）

## 開発環境

```bash
# Python
cd scraper && uv sync --group dev

# Node.js
cd web && pnpm install
```

## コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/) に従ってください：

- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメント
- `chore:` メンテナンス
