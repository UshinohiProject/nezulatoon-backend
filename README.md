# nezulatoon-backend
## 概要
2022年6月に開催された[bit.Connect2021 - Hack for HomeTown -](https://protopedia.net/event/38)で発表した「商店街対抗！色塗り地図アプリ __根津latoon__ 」を構成するコード群のバックエンドを担当するリポジトリ。

### 根津latoonを構成するリポジトリ
- https://github.com/UshinohiProject/nezulatoon-backend
- https://github.com/UshinohiProject/nezulatoon-frontend
- https://github.com/UshinohiProject/nezulatoon-obniz
- https://github.com/UshinohiProject/nezulatoon-twitter

## 実行方法
### 環境設定
Google Apps Scriptでプロジェクトを新規作成する。Chromeに[Google Apps Script GitHub アシスタント](https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo)を追加し、このリポジトリを `pull` する。  
設定タブのスクリプトプロパティで以下の環境変数を設定する。
| プロパティ名 | プロパティ概要 |
|:---|:---|
|`KINTONE_ACCESS_TOKEN` |各チーム情勢レコードを保存するKintoneアカウントのアクセストークン |
|`KINTONE_APP_ID` |各チーム情勢レコードを保存するKintoneアプリのID |
|`KINTONE_SUB_DOMAIN` |各チーム情勢レコードを保存するKintoneアプリのサブドメイン |
|`KINTONE_USER_NAME` |各チーム情勢レコードを保存するKintoneアカウントのID |
|`KINTONE_USER_PASS` |各チーム情勢レコードを保存するKintoneアカウントのパスワード |
|`OBNIZ_ID` |使用するObnizのID |
|`SAVE_IMAGE_FOLDER_ID` |生成された地図画像を一時保存するGoogle DriveのID |
### GETリクエスト
フロントエンドから
```
<baseURL>?streatName=<streatName>&weaponName=<weaponName>&latitude=<latitude>&longitude=<longitude>
```
の形でGETリクエストを行う。