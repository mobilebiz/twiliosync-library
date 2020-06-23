require('dotenv').config();
const TwilioSync = require('../assets/twilioSync.private.js');
const twilioSync = new TwilioSync(process.env.MASTER_ACCOUNT_SID, process.env.ACCOUNT_SID, process.env.AUTH_TOKEN, process.env.SYNC_SERVICE_SID, true);

describe('Mapオブジェクト のテスト', () => {
    const mapName = 'testMap';
    const values = [
        { key: "foo", data: {name: "foo john", age: 18}},
        { key: "bar", data: {name: "bar mark", age: 20}},
    ];

    test('Mapオブジェクトの生成', async () => {
        const ttl = 180;    // 生存時間は3分
        await twilioSync.createMap(mapName, ttl)
            .then(result => {
                expect(result.accountSid).toBe(process.env.MASTER_ACCOUNT_SID);
            })
            .catch(err => {
                throw err;
            });
    });

    test('Mapオブジェクトの検索', async () => {
        await twilioSync.searchMap(mapName)
            .then(mapId => {
                expect(mapId).not.toBe('');
            })
            .catch(err => {
                throw err;
            });
    });

    test('MapItemの追加', async () => {
        for (let item in values) {
            await twilioSync.setMapItem(mapName, values[item].key, values[item].data, 0)
                .then(result => {
                    expect(result.key).toBe(values[item].key);
                })
                .catch(err => {
                    throw err;
                });
        }
    });

    test('MapItemの取得', async () => {
        await twilioSync.getMapItem(mapName, values[0].key)
            .then(mapItem => {
                expect(mapItem.data).toEqual(values[0].data);
            })
            .catch(err => {
                throw err;
            });
    });

    test('MapItemの更新', async () => {
        const updateData = {name: 'Foo Bar', age: 30};
        await twilioSync.setMapItem(mapName, values[0].key, updateData, 0)
            .then(result => {
                expect(result.data).toEqual(updateData);
            })
            .catch(err => {
                throw err;
            });
    });

    test('MapItemリストの取得', async () => {
        await twilioSync.getMapItems(mapName)
            .then(mapItems => {
                expect(mapItems.length).toBe(values.length);
            })
            .catch(err => {
                throw err;
            });
    });

    test('MapItemの削除', async () => {
        await twilioSync.removeMapItem(mapName, values[0].key)
            .then(result => {
                expect(result).toBe(`deleted.`);
            })
            .catch(err => {
                throw err;
            });
    });

    test('MapItemリストの取得（削除後）', async () => {
        await twilioSync.getMapItems(mapName)
            .then(mapItems => {
                expect(mapItems.length).toBeLessThan(values.length);
            })
            .catch(err => {
                throw err;
            });
    });

    test('Mapオブジェクトの削除', async () => {
        await twilioSync.removeMap(mapName)
            .then(result => {
                expect(result).toBe('deleted');
            })
            .catch(err => {
                throw err;
            });
    });

});