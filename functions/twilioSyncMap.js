exports.handler = async function (context, event, callback) {
  // AssetsからTwilioSyncライブラリの読み込み
  const assets = Runtime.getAssets();
  const TwilioSync = require(assets['/twilioSync.js'].path);
  const twilioSync = new TwilioSync(context.MASTER_ACCOUNT_SID, context.ACCOUNT_SID, context.AUTH_TOKEN, context.SYNC_SERVICE_SID, true);

  // Twilio Syncから、'test'マップを検索する
  const MAP_NAME = 'test';
  const data = [  // マップオブジェクトに記録するデータをKey/Value（JSON形式）で指定
    {'john': {gender: 'male', age: 20}},
    {'mark': {gender: 'male', age: 30}},
  ];
  await twilioSync.getMap(MAP_NAME)
    .then(map => {
      // マップが見つかった場合の処理
      console.log('Map found.');
      return;
    })
    .catch(async err => {
      console.log('Map not found.');
      // マップが見つからないので新規に作成
      const ttl = 0;    // マップの生存時間（秒） 0は無期限
      return await twilioSync.createMap(MAP_NAME, ttl);
    })
    .then(async () => {
      // マップにアイテムを追加（1番目のデータ）
      const ttl = 0;    // マップの生存時間（秒） 0は無期限
      return await twilioSync.setMapItem(MAP_NAME, Object.keys(data[0]), data[0][Object.keys(data[0])], ttl);
    })
    .then(async () => {
      // マップにアイテムを追加（2番めのデータ）
      const ttl = 0;    // マップの生存時間（秒） 0は無期限
      return await twilioSync.setMapItem(MAP_NAME, Object.keys(data[1]), data[1][Object.keys(data[1])], ttl);
    })
    .then(async () => {
      // すべてのマップアイテムを取得
      return await twilioSync.getMapItems(MAP_NAME);
    })
    .then(async (mapItems) => {
      console.dir(mapItems[1].data); // {gender: 'male', age: 30} が戻るはず
      // 特定のマップアイテムを取得
      return await twilioSync.getMapItem(MAP_NAME, 'john');
    })
    .then(async (mapItem) => {
      console.dir(mapItem.data); // {gender: 'male', age: 20} が戻るはず
      // マップの削除
      return await twilioSync.removeMap(MAP_NAME);
    })
    .then(() => {
      callback(null, 'OK');
    })
    .catch(err => {
      console.dir(err);
      callback(err);
    });

};