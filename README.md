# recent-tab-switcher

現在のタブから、直前に開いていたタブへショートカットキーで移動するChrome・Safari拡張機能

コードはCodexを使用して作成

## Chrome版

### インストール

1. Chromeで `chrome://extensions` を開く
2. 右上の「デベロッパーモード」を有効にする
3. 「パッケージ化されていない拡張機能を読み込む」を押す
4. `chrome` フォルダを選ぶ
5. ショートカットキーの設定画面が開く
6. `recent-tab-switcher` のキーを確認または変更する
7. 設定したキーでタブを切り替えられるようになる

### ショートカットキー

- macOSでは `Command+Shift+K`
- Windows / Linuxでは `Ctrl+Shift+K`
- `chrome://extensions/shortcuts` で変更可能

## Safari版

### インストール

1. Xcodeで `safari/recent-tab-switcher/recent-tab-switcher.xcodeproj` を開く
2. プロジェクトのSigning & Capabilitiesで開発チームを選ぶ
3. 実行先に「My Mac」を選び、実行する
4. 起動したアプリで案内を確認する
5. Safariの「設定」から「機能拡張」を開く
6. `recent-tab-switcher Extension` を有効にする
7. `Command+Shift+K` で直前のタブへ移動できるようになる

## 使い方

- ショートカットキーを押すと、直前に開いていたタブへ移動する
- 続けて同じキーを押すと、移動前のタブへ戻る
