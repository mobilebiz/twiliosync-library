# TwilioSyncLibrary for TwilioCLI

Twilio CLI Serverless で Twilio Sync を簡単に扱うためのライブラリです。
Assets 内のプライベートファイルとして利用します。

- [Twilio Sync](https://jp.twilio.com/sync)
- 複数のデバイス間で情報を同期させるためのサービス
- WebSocketやSocket.ioのようなリアルタイム通信プラットフォーム
- Syncは、受け取ったデータをTwilio上に保存してから配信する
- Sync上のデータは、TTLオプションにより生存時間を設定できる
- Document / List / Map / Message Stream の4種類のデータを扱うことが可能（本ライブラリではMessage Streamには非対応）

オブジェクトタイプ

- Documentオブジェクト  
単一のJSON形式オブジェクト  
オブジェクト名は最大320文字  
1データのサイズは最大16KB  
単純な値のPUB/SUBに向いている  
履歴を取るような使い方には向いていない  
利用例：コールセンターでオペレータの稼働確認など
- Listオブジェクト  
格納順が保証されたJSONリスト  
オブジェクト名は最大320文字  
1データのサイズは最大16KB  
最大格納レコード数は1,000,000  
時系列で確認したい履歴を取るような使い方に向いている  
利用例：ログの保存など
- Mapオブジェクト  
格納順が保証されないKey/Value形式のJSONデータ  
オブジェクト名は最大320文字  
1データのサイズは最大16KB  
最大格納レコード数は1,000,000  
Keyで検索して、内容を記録するような使い方に向いている  
利用例：オペレータの内線番号やスキルなどの登録など

その他の制限事項については、[こちら](https://www.twilio.com/docs/sync/limits)をご確認ください。

## Features

Twilio Functions から簡単にTwilio Sync のオブジェクトを生成したり、データを書き込んだり、更新・削除が可能です。これにより、Twilio内部でデータベースのような機能を実現することができます。  
なお、本ライブラリでは、Message Streamオブジェクトについて対応していません。

## Requirement

- twilio 3.42.2
- dotenv 8.2.0 （テストで利用）

## Installation

適当な作業ディレクトリにライブラリをCloneします。

```sh
% git clone https://github.com/mobilebiz/twiliosync-library.git
（省略）
Unpacking objects: 100% (35/35), done.
% cd twiliosync-library
% tree
.
├── README.md
├── __tests__
│   ├── TwilioSyncDoc.js
│   ├── TwilioSyncList.js
│   └── TwilioSyncMap.js
├── assets
│   └── twilioSync.private.js
├── functions
│   ├── twilioSyncDoc.js
│   ├── twilioSyncList.js
│   └── twilioSyncMap.js
├── package-lock.json
└── package.json

3 directories, 10 files
```

次に、別の作業ディレクトリに移動してから、Twilio CLIを使って、Twilio Sync サービスを作成します。

```sh
% twilio api:sync:v1:services:create --friendly-name [サービス名]

SID                                 Unique Name  Friendly Name
ISe530cd01d9fa91a6b6e21d8e1b18e4ad  null         サービス名
```

作成した際に表示される SID　（ISから始まる文字列）を控えておきましょう。

つぎに、 Serverless プロジェクトを作成してください。

```sh
% twilio serverless:init --template blank [プロジェクト名]
（以下略）
% cd [プロジェクト名]
```

次に、本プロジェクト内にある`.env.sample`を参考に、ご自分の作業ディレクトリにある`.env`の内容をご自分の環境に合わせて変更します（ACCOUNT_SIDとAUTH_TOKENは自動で設定されています）。

変数名|説明
:--|:--
ACCOUNT_SID|Twilio CLIで生成された値（SKから始まる文字列）
AUTH_TOKEN|Twilio CLIで生成された値
MASTER_ACCOUNT_SID|TwilioのAccountSid（ACから始まる文字列）←新設
SYNC_SERVICE_SID|先程作成した Twilio Sync の SID（ISから始まる文字列）←新設

次に、NPMパッケージをインストールします。

```sh
% npm install
```

最後に、本プロジェクト assets フォルダ内にある`twilioSync.private.js`をご自分の Twilio CLI Serverless 作業ディレクトリ内の assets にコピーしてください。

## Usage

### Documentオブジェクト

- createDocument(docName, data, ttl)：Documentオブジェクトの生成
- getDocument(docName)：Documentオブジェクトの取得
- removeDocument(docName)：Documentオブジェクトの削除
- removeDocumentById(documentId)：Documentオブジェクトの削除（ID）
- searchDocument(docName)：Documentオブジェクトの検索
- updateDocument(docName, data, ttl)：Documentオブジェクトの更新

### Listオブジェクト

- createList(listName, ttl)：Listオブジェクトの生成
- getList(listName)：Listオブジェクトの取得
- searchList(listName)：Listオブジェクトの検索
- removeList(listName)：Listオブジェクトの削除
- removeListById(listId)：Listオブジェクトの削除（ID）
- addListItem(listName, data, ttl)：Listアイテムの追加
- getListItem(listName, key)：Listアイテムの取得（keyを指定しないと全アイテム）
- removeListItem(listName, key)：Listアイテムの削除

### Mapオブジェクト

- createMap(mapName, ttl)：Mapオブジェクトの生成
- getMap(mapName)：Mapオブジェクトの取得
- searchMap(mapName)：Mapオブジェクトの検索
- removeMap(mapName)：Mapオブジェクトの削除
- removeMapById(mapId)：Mapオブジェクトの削除（ID）
- setMapItem(mapName, key, data, ttl)：Mapアイテムの更新（なければ追加）
- getMapItems(mapName)：すべてのMapアイテムを取得
- getMapItem(mapName, key)：keyが一致するMapアイテムの取得
- removeMapItem(mapName, key)：Mapアイテムの削除

使い方のサンプルは、本プロジェクトの functions フォルダ内にある `twilioSyncDoc.js` `twilioSyncList.js` `twilioSyncMap.js` をご覧ください。

## Note

たとえば、電話番号をドキュメント名として作成し、電話番号に付随する情報をデータとして格納していくことで、簡易的な電話帳として使うなどの応用が可能かとおもいます。

※現在のバージョンでは、排他制御は考慮していません。

## Author

- 高橋克己
- グローバル・インターネット・ジャパン株式会社
- 株式会社KDDIウェブコミュニケーションズ
- katsumi@gij.com / katsumi.takahashi@kddi-web.com

## License

"TwilioSyncLibrary for Twilio CLI" is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).