exports.handler = async function(context, event, callback) {
  // AssetsからTwilioSyncライブラリの読み込み
  const assets = Runtime.getAssets();
  const TwilioSync = require(assets['/twilioSync.js'].path);  
  const twilioSync = new TwilioSync(context.MASTER_ACCOUNT_SID, context.ACCOUNT_SID, context.AUTH_TOKEN, context.SYNC_SERVICE_SID);

  // Twilio Syncから、'test'ドキュメントを検索する
  const DOC_NAME = 'test';
  await twilioSync.getDocument(DOC_NAME)
  .then(document => {
    // ドキュメントが見つかった場合の処理
    console.log('Document found.');
    console.dir(document);
    return;
  })
  .catch(async err => {
    // ドキュメントが見つからないので新規に作成
    const data = {};  // ドキュメントオブジェクトに記録するデータをJSON形式で指定
    const ttl = 0;    // ドキュメントの生存時間（秒） 0は無期限
    await twilioSync.createDocument(DOC_NAME, data, ttl)
    .then(() => {
      return;
    })
  })
  .then(() async => {
    // ドキュメントの更新
    const data = {};  // ドキュメントオブジェクトに記録するデータをJSON形式で指定
    const ttl = 0;    // ドキュメントの生存時間（秒） 0は無期限
    return await twilioSync.updateDocument(DOC_NAME, data, ttl);
  })
  .then(async () => {
    // ドキュメントの削除
    return await twilioSync.removeDocument(DOC_NAME);
  })
  .then(() => {
    callback(null, 'OK');
  })
  .catch(err => {
    console.dir(err);
    callback(err);
  });

};