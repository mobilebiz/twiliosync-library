/**
 * TwilioSyncをクラス化
 */
const twilio = require('twilio');
let showLog;

module.exports = class TwilioSync {
    // コンストラクタ
    constructor(masterAccountSid, accountSid, authToken, syncServiceSid, debugMode = false) {
        this.twilioClient = new twilio(accountSid, authToken, {accountSid: masterAccountSid});
        this.syncServiceSid = syncServiceSid;
        showLog = debugMode;
    }

    /************************************************
     * Documentオブジェクト
     ***********************************************/
    /**
     * SyncDocumentの取得
     * @param {String} docName
     * @returns document
     */
    getDocument(docName) {
        log(`getDocument(${docName}) called.`);
        return new Promise(async (resolve, reject) => {
            // Documentsを検索
            await this.searchDocument(docName)
            .then(async documentId => {
                if (documentId !== '') {
                    return await this.twilioClient.sync.services(this.syncServiceSid).documents(documentId).fetch();
                } else {
                    // Documentsが見つからなかった
                    throw new Error(`${docName} not found.`);
                }
            })
            .then(document => {
                resolve(document);
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

    /**
     * SyncDocumentの生成
     * @param {String} docName
     * @param {JSON} data
     * @param {Number} ttl
     * @returns document
     */
    createDocument(docName, data, ttl = 0) {
        log(`createDocument(${docName}, ${data}, ${ttl}) called.`);
        return new Promise(async (resolve, reject) => {
            const doc = {
                uniqueName: docName,
                data: data,
                ttl: ttl   // 1Hour
            };
            await this.twilioClient.sync.services(this.syncServiceSid).documents.create(doc)
            .then(document => {
                resolve(document);
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

    /**
     * SyncDocumentの削除（docName）
     * @param {String} docName
     * @returns DocumentObject（JSON）
     */
    removeDocument(docName) {
        log(`removeDocument(${docName}) called.`);
        return new Promise(async (resolve, reject) => {
            // Documentsを検索
            await this.searchDocument(docName)
            .then(async documentId => {
                if (documentId !== '') {
                    return await this.removeDocumentById(documentId);
                } else {
                    // Documentsが見つからなかった
                    throw new Error(`${docName} not found.`);
                }
            })
            .then(() => {
                resolve('deleted');
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

    /**
     * SyncDocumentの削除（ID）
     * @param {String} documentId
     * @returns 'deleted'
     */
    removeDocumentById(documentId) {
        log(`removeDocumentById(${documentId}) called.`);
        return new Promise(async (resolve, reject) => {
            await this.twilioClient.sync.services(this.syncServiceSid).documents(documentId).remove()
            .then(() => {
                resolve('deleted');
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

    /**
     * SyncDocumentIDの検索
     * @param {String} docName
     * @returns documentId
     */
    searchDocument(docName) {
        log(`searchDocument(${docName}) called.`);
        return new Promise(async (resolve, reject) => {
            await this.twilioClient.sync.services(this.syncServiceSid).documents.list()
            .then(documents => {
                let documentId = '';
                for (let document of documents) {
                    if (document.uniqueName === docName) documentId = document.sid;
                }
                resolve(documentId);
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

    /**
     * SyncDocumentの更新（docName）
     * @param {String} docName
     * @param {JSON} data
     * @param {Number} ttl
     * @returns document
     */
    updateDocument(docName, data, ttl = 0) {
        log(`updateDocument(${docName}, ${data}, ${ttl}) called.`);
        return new Promise(async (resolve, reject) => {
            // Documentsを検索
            await this.searchDocument(docName)
            .then(async documentId => {
                const element = {
                    data: data,
                    ttl: ttl
                };
                return await this.twilioClient.sync.services(this.syncServiceSid).documents(documentId).update(element)
            })
            .then(document => {
                resolve(document);
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

    /************************************************
     * Listオブジェクト
     ***********************************************/
    /**
     * SyncListの生成
     * @param {String} listName
     * @param {Number} ttl
     * @returns list
     */
    createList(listName, ttl = 0) {
        log(`createList(${listName}, ${ttl}) called.`);
        return new Promise(async (resolve, reject) => {
            const list = {
                uniqueName: listName,
                ttl: ttl
            };
            await this.twilioClient.sync.services(this.syncServiceSid).syncLists.create(list)
            .then(list => {
                resolve(list);
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

    /**
     * SyncListの取得（listName）
     * @param {String} listName
     * @returns List
     */
    getList(listName) {
        log(`getList(${listName}) called.`);
        return new Promise(async (resolve, reject) => {
            // Listを検索
            await this.searchList(listName)
            .then(async listId => {
                if (listId !== '') {
                    return await this.twilioClient.sync.services(this.syncServiceSid).syncLists(listId).fetch();
                } else {
                    // Listが見つからなかった
                    throw new Error(`${listName} not found.`);
                }
            })
            .then(list => {
                resolve(list);
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

    /**
     * SyncListIDの検索
     * @param {String} listName
     * @returns listId
     */
    searchList(listName) {
        log(`searchList(${listName}) called.`);
        return new Promise(async (resolve, reject) => {
            await this.twilioClient.sync.services(this.syncServiceSid).syncLists.list()
            .then(lists => {
                let listId = '';
                for (let list of lists) {
                    if (list.uniqueName === listName) listId = list.sid;
                }
                resolve(listId);
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

    /**
     * SyncListの削除（listName）
     * @param {String} listName
     * @returns 'deleted'
     */
    removeList(listName) {
        log(`removeList(${listName}) called.`);
        return new Promise(async (resolve, reject) => {
            // Listを検索
            await this.searchList(listName)
            .then(async listId => {
                if (listId !== '') {
                    return await this.removeListById(listId);
                } else {
                    // Listが見つからなかった
                    throw new Error(`${listName} not found.`);
                }
            })
            .then(() => {
                resolve('deleted');
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

    /**
     * SyncListの削除（ID）
     * @param {String} listId
     * @returns list
     */
    removeListById(listId) {
        log(`removeListById(${listId}) called.`);
        return new Promise(async (resolve, reject) => {
            await this.twilioClient.sync.services(this.syncServiceSid).syncLists(listId).remove()
            .then(() => {
                resolve('deleted');
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

    /**
     * SyncListItemの追加
     * @param {String} listName
     * @param {JSON} data
     * @param {Number} ttl
     * @returns listItem
     */
    addListItem(listName, data, ttl = 0) {
        log(`addListItem(${listName}, ${data}, ${ttl}) called.`);
        return new Promise(async (resolve, reject) => {
            // Listを検索
            await this.searchList(listName)
            .then(async listId => {
                if (listId !== '') {
                    // ListItemを追加
                    return await this.twilioClient.sync.services(this.syncServiceSid).syncLists(listId).syncListItems.create({
                        data: data,
                        ttl: ttl,
                    });
                } else {
                    // Listが見つからなかった
                    throw new Error(`${listName} not found.`);
                }
            })
            .then(listItem => {
                resolve(listItem);
            })
            .catch(err => {
                reject(err);
            });
        });
    };

    /**
     * SyncListItemsの取得（listName）
     * key指定があれば、そのkeyに一致したリストを返す
     * key指定がなければ、すべてのListItemsを返す
     * @param {String} listName
     * @param {String} key (option)
     * @returns ListItems
     */
    getListItems(listName, key = null) {
        log(`getListItems(${listName}, ${key}) called.`);
        return new Promise(async (resolve, reject) => {
            // Listを検索
            await this.searchList(listName)
            .then(async listId => {
                if (listId !== '') {
                    return await this.twilioClient.sync.services(this.syncServiceSid).syncLists(listId).syncListItems.list();
                } else {
                    // Listが見つからなかった
                    throw new Error(`${listName} not found.`);
                }
            })
            .then(listItems => {
                if (key === null) {
                    // keyの指定がなかったので、そのままリストを返す
                    resolve(listItems);
                } else {
                    // keyに一致するリストだけを返す
                    resolve(listItems.filter(item => Object.keys(item.data) == key));
                }
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

    /**
     * SyncListItemの削除（listName）
     * @param {String} listName
     * @param {String} key
     * @returns 'N item(s) deleted.'
     */
    removeListItems(listName, key) {
        log(`removeListItems(${listName}, ${key}) called.`);
        return new Promise(async (resolve, reject) => {
            // Listを検索
            await this.searchList(listName)
            .then(async listId => {
                if (listId !== '') {
                    let listItems = await this.twilioClient.sync.services(this.syncServiceSid).syncLists(listId).syncListItems.list();
                    return {listId, listItems};
                } else {
                    // Listが見つからなかった
                    throw new Error(`${listName} not found.`);
                }
            })
            // .then(results => {
            .then(({listId, listItems}) => {
                // keyに一致するリストのIndexを取得
                let idx = [];
                listItems.forEach(item => {
                    if (Object.keys(item.data) == key) idx.push(item.index);
                });
                return {listId, idx};
            })
            .then(async ({listId, idx}) => {
                // idxに含まれるItemを削除する
                let count = 0;
                for(let i in idx) {
                    await this.twilioClient.sync.services(this.syncServiceSid).syncLists(listId).syncListItems(i).remove();
                    count++;
                };
                resolve(`${count} item(s) deleted.`);
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

    /************************************************
     * Mapオブジェクト
     ***********************************************/
    /**
     * SyncMapの生成
     * @param {String} mapName
     * @param {Number} ttl
     * @returns map
     */
    createMap(mapName, ttl = 0) {
        log(`createMap(${mapName}, ${ttl}) called.`);
        return new Promise(async (resolve, reject) => {
            const map = {
                uniqueName: mapName,
                ttl: ttl
            };
            await this.twilioClient.sync.services(this.syncServiceSid).syncMaps.create(map)
            .then(map => {
                resolve(map);
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

    /**
     * SyncMapの取得（mapName）
     * @param {String} mapName
     * @returns map
     */
    getMap(mapName) {
        log(`getMap(${mapName}) called.`);
        return new Promise(async (resolve, reject) => {
            // Mapを検索
            await this.searchMap(mapName)
            .then(async mapId => {
                if (mapId !== '') {
                    return await this.twilioClient.sync.services(this.syncServiceSid).syncMaps(mapId).fetch();
                } else {
                    // Mapが見つからなかった
                    throw new Error(`${mapName} not found.`);
                }
            })
            .then(map => {
                resolve(map);
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

    /**
     * SyncMapIDの検索
     * @param {String} mapName
     * @returns mapId
     */
    searchMap(mapName) {
        log(`searchMap(${mapName}) called.`);
        return new Promise(async (resolve, reject) => {
            await this.twilioClient.sync.services(this.syncServiceSid).syncMaps.list()
            .then(maps => {
                let mapId = '';
                for (let map of maps) {
                    if (map.uniqueName === mapName) mapId = map.sid;
                }
                resolve(mapId);
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

    /**
     * SyncMapの削除（mapName）
     * @param {String} mapName
     * @returns 'deleted'
     */
    removeMap(mapName) {
        log(`removeMap(${mapName}) called.`);
        return new Promise(async (resolve, reject) => {
            // Mapを検索
            await this.searchMap(mapName)
            .then(async mapId => {
                if (mapId !== '') {
                    return await this.removeMapById(mapId);
                } else {
                    // Mapが見つからなかった
                    throw new Error(`${mapName} not found.`);
                }
            })
            .then(() => {
                resolve('deleted');
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

    /**
     * SyncMapの削除（ID）
     * @param {String} mapId
     * @returns map
     */
    removeMapById(mapId) {
        log(`removeMapById(${mapId}) called.`);
        return new Promise(async (resolve, reject) => {
            await this.twilioClient.sync.services(this.syncServiceSid).syncMaps(mapId).remove()
            .then(() => {
                resolve('deleted');
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

    /**
     * SyncMapItemの追加・更新
     * keyがすでにあれば、dataで更新
     * keyがなければ、dataを追加
     * @param {String} mapName
     * @param {String} key
     * @param {JSON} data
     * @param {Number} ttl (option)
     * @returns mapItem
     */
    setMapItem(mapName, key, data, ttl = 0) {
        log(`setMapItem(${mapName}, ${key}, ${data}, ${ttl}) called.`);
        return new Promise(async (resolve, reject) => {
            // Mapを検索
            await this.searchMap(mapName)
            .then(async mapId => {
                if (mapId !== '') {
                    // keyがすでに登録されているかを確認
                    let mapItem = await this.getMapItem(mapName, key);
                    return {mapId, mapItem};
                } else {
                    // Mapが見つからなかった
                    throw new Error(`${mapName} not found.`);
                }
            })
            .then(async ({mapId, mapItem}) => {
                console.log(`mapItem: ${mapItem}`);
                if (mapItem) {
                    // すでにMapがあるので更新
                    return await this.twilioClient.sync.services(this.syncServiceSid).syncMaps(mapId).syncMapItems(key).update({
                        data: data,
                        ttl: ttl
                    });
                } else {
                    // MapItemがないので新規作成
                    return await this.twilioClient.sync.services(this.syncServiceSid).syncMaps(mapId).syncMapItems.create({
                        key: key,
                        data: data,
                        ttl: ttl
                    });
                }
            })
            .then(mapItem => {
                resolve(mapItem);
            })
            .catch(err => {
                reject(err);
            });
        });
    };

    /**
     * SyncMapItemの取得（mapName）
     * すべてのアイテムを取得
     * @param {String} mapName
     * @returns mapItems
     */
    getMapItems(mapName) {
        log(`getMapItems(${mapName}) called.`);
        return new Promise(async (resolve, reject) => {
            // Mapを検索
            await this.searchMap(mapName)
            .then(async mapId => {
                if (mapId !== '') {
                    return await this.twilioClient.sync.services(this.syncServiceSid).syncMaps(mapId).syncMapItems.list();
                } else {
                    // Mapが見つからなかった
                    throw new Error(`${mapName} not found.`);
                }
            })
            .then(mapItems => {
                resolve(mapItems);
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

    /**
     * SyncMapItemの取得（mapName）
     * keyが一致するアイテムのみを取得
     * @param {String} mapName
     * @param {String} key
     * @returns mapItem
     */
    getMapItem(mapName, key) {
        log(`getMapItem(${mapName}, ${key}) called.`);
        return new Promise(async (resolve, reject) => {
            // Mapを検索
            await this.searchMap(mapName)
            .then(async mapId => {
                if (mapId !== '') {
                    return await this.twilioClient.sync.services(this.syncServiceSid).syncMaps(mapId).syncMapItems(key).fetch();
                } else {
                    // Mapが見つからなかった
                    throw new Error(`${mapName} not found.`);
                }
            })
            .then(mapItem => {
                // console.dir(mapItem);
                resolve(mapItem);
            })
            .catch(err => {
                resolve(null);  // MapItemがない場合はnullを返す
            });            
        });
    };

    /**
     * SyncMapItemの削除（mapName）
     * @param {String} mapName
     * @param {String} key
     * @returns 'deleted.'
     */
    removeMapItem(mapName, key) {
        log(`removeMapItem(${mapName}, ${key}) called.`);
        return new Promise(async (resolve, reject) => {
            // MapItemを検索
            await this.getMapItem(mapName, key)
            .then(async mapItem => {
                if (mapItem) {
                    // MapItemを削除
                    return await this.twilioClient.sync.services(this.syncServiceSid).syncMaps(mapItem.mapSid).syncMapItems(key).remove();
                } else {
                    // MapItemが見つからなかった
                    throw new Error(`MapItem(${key}) not found.`);
                }
            })
            .then(results => {
                resolve(`deleted.`);
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

}

/**
 * ログの表示
 * @param {String} message 
 */
const log = (message) => {
    if (showLog) console.log(message);
};