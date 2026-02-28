学習塾シフト管理アプリ（Juku Shift App）

学習塾でのアルバイト経験をもとに、
シフト管理と月給計算を効率化するための業務向けWebアプリを個人開発しました。

アプリ概要

月〜金 / 1日1〜4限（1コマ60分）のシフト管理
同じ日・同じ時限の重複シフトを禁止
月ごとの勤務コマ数を集計し、月給を自動計算
個人利用を想定し、ログイン機能は省略
主な機能

シフト管理

日付・時限を指定してシフトを登録
シフト一覧をテーブル形式で表示
シフトの削除
重複シフト検知

同一日・同一時限の登録を不可に設定
DBの UNIQUE 制約 + APIの 409 Conflict による二重防止
給与計算

月単位で総コマ数を集計
月給 = 総コマ数 × 1250円
計算ロジックはバックエンドで集約
工夫したポイント

フロントエンド / バックエンド分離
REST API 設計
重複登録の防止をアプリ側だけでなくDB制約でも担保
集計ロジックをAPI側に寄せ、UIをシンプルに
実装理由・制約条件を README に明文化
技術スタック

フロントエンド

React
Vite
JavaScript (ES6+)
Fetch API
バックエンド

Node.js
Express
SQLite（better-sqlite3）
ディレクトリ構成 juku-shift-app/ ├─ frontend/ │ ├─ src/ │ │ ├─ main.jsx │ │ ├─ App.jsx │ │ ├─ api.js │ │ ├─ styles.css │ │ └─ components/ │ │ ├─ ShiftForm.jsx │ │ ├─ ShiftTable.jsx │ │ └─ PayrollPanel.jsx │ ├─ index.html │ ├─ vite.config.js │ └─ package.json │ └─ backend/ ├─ server.js ├─ db.js ├─ schema.sql ├─ app.db └─ package.json

今後の改善予定

曜日・時限を固定テーブルとして管理 CSVエクスポート（給与明細） 教科・学年などの属性追加 承認フロー（提出 → 確定）

制作背景

実際のアルバイトで「シフト管理が紙・LINEベースで煩雑」「月給計算が手作業」 という課題を感じたことから制作しました。 単なるCRUDに留まらず、実務で必要な制約・集計・エラーハンドリングを意識して設計しています。
