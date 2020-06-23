require('dotenv').config();
const TwilioSync = require('../assets/twilioSync.private.js');
const twilioSync = new TwilioSync(process.env.MASTER_ACCOUNT_SID, process.env.ACCOUNT_SID, process.env.AUTH_TOKEN, process.env.SYNC_SERVICE_SID, true);

describe('Documentオブジェクト のテスト', () => {
    const docName = 'testDocument';
    test('Documentオブジェクトの生成', async () => {
        const data = { test: "hoge" };
        const ttl = 180;    // 生存時間は3分
        await twilioSync.createDocument(docName, data, ttl)
            .then(result => {
                expect(result.accountSid).toBe(process.env.MASTER_ACCOUNT_SID);
            })
            .catch(err => {
                throw err;
            });
    });

    test('Documentオブジェクトの検索', async () => {
        await twilioSync.searchDocument(docName)
            .then(documentId => {
                expect(documentId).not.toBe('');
            })
            .catch(err => {
                throw err;
            });
    });

    test('Documentオブジェクトの取得', async () => {
        await twilioSync.getDocument(docName)
            .then(document => {
                expect(document.data.test).toBe('hoge');
            })
            .catch(err => {
                throw err;
            });
    });

    test('Documentオブジェクトの更新', async () => {
        const data = { test: "fuga" };
        const ttl = 180;    // 生存時間は3分
        await twilioSync.updateDocument(docName, data, ttl)
            .then(document => {
                expect(document.data.test).toBe('fuga');
            })
            .catch(err => {
                throw err;
            });
    });

    test('Documentオブジェクトの削除', async () => {
        await twilioSync.removeDocument(docName)
            .then(result => {
                expect(result).toBe('deleted');
            })
            .catch(err => {
                throw err;
            });
    });
});