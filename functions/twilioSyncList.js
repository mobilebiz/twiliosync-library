exports.handler = async function (context, event, callback) {
  // AssetsからTwilioSyncライブラリの読み込み
  const assets = Runtime.getAssets();
  const TwilioSync = require(assets['/twilioSync.js'].path);
  const twilioSync = new TwilioSync(context.MASTER_ACCOUNT_SID, context.ACCOUNT_SID, context.AUTH_TOKEN, context.SYNC_SERVICE_SID, true);

  // Twilio Syncから、'test'リストを検索する
  const LIST_NAME = 'test';
  const data = [  // リストオブジェクトに記録するデータをKey/Value（JSON形式）で指定
    {'foo': 'bar'},
    {'hoge': 'fuga'},
  ];
  await twilioSync.getList(LIST_NAME)
    .then(list => {
      // リストが見つかった場合の処理
      console.log('List found.');
      return;
    })
    .catch(async err => {
      console.log('List not found.');
      // リストが見つからないので新規に作成
      const ttl = 0;    // リストの生存時間（秒） 0は無期限
      return await twilioSync.createList(LIST_NAME, ttl);
    })
    .then(async () => {
      // リストにアイテムを追加（1番目のデータ）
      const ttl = 0;    // リストの生存時間（秒） 0は無期限
      return await twilioSync.addListItem(LIST_NAME, data[0], ttl);
    })
    .then(async () => {
      // リストにアイテムを追加（2番めのデータ）
      const ttl = 0;    // リストの生存時間（秒） 0は無期限
      return await twilioSync.addListItem(LIST_NAME, data[1], ttl);
    })
    .then(async () => {
      // すべてのリストアイテムを取得
      return await twilioSync.getListItems(LIST_NAME);
    })
    .then(async (listItems) => {
      console.dir(listItems[1].data); // {'hoge': 'fuga'} が戻るはず
      // 特定のリストアイテムを取得
      return await twilioSync.getListItems(LIST_NAME, 'foo');
    })
    .then(async (listItem) => {
      console.dir(listItem[0].data); // {'foo': 'bar'} が戻るはず
      // リストの削除
      return await twilioSync.removeList(LIST_NAME);
    })
    .then(() => {
      callback(null, 'OK');
    })
    .catch(err => {
      console.dir(err);
      callback(err);
    });

};