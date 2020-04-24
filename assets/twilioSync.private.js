/**
 * TwilioSyncをクラス化
 */
const twilio = require('twilio');

module.exports = class TwilioSync {
    // コンストラクタ
    constructor(masterAccountSid, accountSid, authToken, syncServiceSid) {
        this.twilioClient = new twilio(accountSid, authToken, {accountSid: masterAccountSid});
        this.syncServiceSid = syncServiceSid;
    }

    /**
     * Syncドキュメントの取得
     * @param {String} docName
     * @returns document
     */
    getDocument(docName) {
        console.log('getDocument called.');
        return new Promise(async (resolve, reject) => {
            // ドキュメントを検索
            await this.searchDocument(docName)
            .then(async documentId => {
                return await this.twilioClient.sync.services(this.syncServiceSid).documents(documentId).fetch()
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
     * Syncドキュメントの生成
     * @param {String} docName
     * @param {JSON} data
     * @param {Number} ttl
     * @returns document
     */
    createDocument(docName, data, ttl = 0) {
        console.log('createDocument called.');
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
     * Syncドキュメントの削除（docName）
     * @param {String} docName
     * @returns DocumentObject（JSON）
     */
    removeDocument(docName) {
        console.log('removeDocument called.');
        return new Promise(async (resolve, reject) => {
            // ドキュメントを検索
            await this.searchDocument(docName)
            .then(async documentId => {
                return await this.removeDocumentId(documentId);
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
     * Syncドキュメントの削除（ID）
     * @param {String} documentId
     * @returns DocumentObject（JSON）
     */
    removeDocumentId(documentId) {
        console.log('removeDocumentId called.');
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
     * SyncドキュメントIDの検索
     * @param {String} docName
     * @returns documentId
     */
    searchDocument(docName) {
        console.log('searchDocument called.');
        return new Promise(async (resolve, reject) => {
            await this.twilioClient.sync.services(this.syncServiceSid).documents.list()
            .then(documents => {
                let documentId = '';
                documents.forEach(document => {
                    if (document.uniqueName === docName) documentId = document.sid;
                })
                resolve(documentId);
            })
            .catch(err => {
                reject(err);
            });            
        });
    };

    /**
     * Syncドキュメントの更新（docName）
     * @param {String} docName
     * @param {JSON} data
     * @param {Number} ttl
     * @returns document
     */
    updateDocument(docName, data, ttl = 0) {
        console.log('updateDocument called.');
        return new Promise(async (resolve, reject) => {
            // ドキュメントを検索
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

}

