# twilioSyncLibrary for TwilioCLI

Twilio CLI Serverless で Twilio Sync を簡単に扱うためのライブラリです。
Assets 内のプライベートファイルとして利用します。

## Features

現在のバージョンでは、Twilio Sync のドキュメントオブジェクトにのみ対応しています。

## Requirement

* twilio 3.42.2
* dotenv 8.2.0 （テストで利用）

## Installation

まずは、Twilio CLIを使って、Twilio Sync サービスを作成します。

```sh
twilio api:sync:v1:services:create --friendly-name [サービス名]

SID                                 Unique Name  Friendly Name
ISe530cd01d9fa91a6b6e21d8e1b18e4ad  null         サービス名
```

作成した際に表示される SID　（ISから始まる文字列）を控えておきましょう。

つぎに、 Serverless プロジェクトを作成してください。

```sh
twilio serverless:init --template blank
（以下略）
```

次に、本プロジェクト内にある`.env.sample`を参考に、ご自分の作業ディレクトリにある`.env`の内容をご自分の環境に合わせて変更します。

変数名|説明
:--|:--
ACCOUNT_SID|Twilio CLIで生成された値（SKから始まる文字列）
AUTH_TOKEN|Twilio CLIで生成された値
MASTER_ACCOUNT_SID|TwilioのAccountSid（ACから始まる文字列）※新設
SYNC_SERVICE_SID|先程作成した Twilio Sync の SID（ISから始まる文字列）※新設

次に、Twilioパッケージをインストールします。

```sh
npm install twilio
```

最後に、本プロジェクト assets フォルダ内にある`twilioSync.private.js`をご自分の Twilio CLI Serverless 作業ディレクトリ内の assets にコピーしてください。

## Usage

使い方のサンプルは、本プロジェクトの functions フォルダ内にある `twilioSync.js` 御覧ください。

## Note

たとえば、電話番号をドキュメント名として作成し、電話番号に付随する情報をデータとして格納していくことで、簡易的な電話帳として使うなどの応用が可能かとおもいます。

## Author

* 高橋克己
* グローバル・インターネット・ジャパン株式会社
* katsumi@gij.com

## License

"TwilioSyncLibrary for Twilio CLI" is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).