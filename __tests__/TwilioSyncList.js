require('dotenv').config();
const TwilioSync = require('../assets/twilioSync.private.js');
const twilioSync = new TwilioSync(process.env.MASTER_ACCOUNT_SID, process.env.ACCOUNT_SID, process.env.AUTH_TOKEN, process.env.SYNC_SERVICE_SID, true);

describe('Listオブジェクト のテスト', () => {
    const listName = 'testList';
    const data = [
        { "1": "ABC" },
        { "2": "DEF" },
        { "1": "GHI" },
    ];

    test('Listオブジェクトの生成', async () => {
        const ttl = 180;    // 生存時間は3分
        await twilioSync.createList(listName, ttl)
            .then(result => {
                expect(result.accountSid).toBe(process.env.MASTER_ACCOUNT_SID);
            })
            .catch(err => {
                throw err;
            });
    });

    test('Listオブジェクトの検索', async () => {
        await twilioSync.searchList(listName)
            .then(listId => {
                expect(listId).not.toBe('');
            })
            .catch(err => {
                throw err;
            });
    });

    test('ListItemの追加', async () => {
        for (let item in data) {
            await twilioSync.addListItem(listName, data[item], 0)
                .then(result => {
                    expect(result.data[Object.keys(result.data)]).toBe(data[item][Object.keys(data[item])]);
                })
                .catch(err => {
                    throw err;
                });
        }
    });

    test('ListItemリストの取得', async () => {
        await twilioSync.getListItems(listName)
            .then(listItems => {
                expect(listItems.length).toBe(data.length);
            })
            .catch(err => {
                throw err;
            });
    });

    test('ListItemsリストの取得（key指定あり）', async () => {
        const key = Object.keys(data[0]).toString();   // key = "1"
        const count = data.filter(item => Object.keys(item) == key).length;
        await twilioSync.getListItems(listName, key)
            .then(listItems => {
                expect(listItems.length).toBe(count);
            })
            .catch(err => {
                throw err;
            });
    });

    test('ListItemsリストの削除', async () => {
        const key = Object.keys(data[0]).toString();   // key = "1"
        const count = data.filter(item => Object.keys(item) == key).length;
        await twilioSync.removeListItems(listName, key)
            .then(result => {
                expect(result).toBe(`${count} item(s) deleted.`);
            })
            .catch(err => {
                throw err;
            });
    });

    test('ListItemリストの取得（削除後）', async () => {
        await twilioSync.getListItems(listName)
            .then(listItems => {
                expect(listItems.length).toBeLessThan(data.length);
            })
            .catch(err => {
                throw err;
            });
    });

    /*
    test('Documentsオブジェクトの更新', async () => {
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
    */
    test('Listオブジェクトの削除', async () => {
        await twilioSync.removeList(listName)
            .then(result => {
                expect(result).toBe('deleted');
            })
            .catch(err => {
                throw err;
            });
    });

});