/*window.onload = () => {
    let storage = window.localStorage;
    let greeter: IGreeter = new StorageGreeter(storage);

    greeter.Greet();

    // キャッシュのクリアボタン
    let btnCacheClear = document.getElementById('btnCacheClear');
    btnCacheClear.onclick = () => {
        storage.clear();
        alert('キャッシュをクリアしました');
    };
};*/
window.onload = () => {
    // データベースの接続を開く
    let indexedDb = window.indexedDB;
    let openReq = new Promise((resolve, reject) => {
        let req = indexedDb.open('GreeterDB', 1);
        req.onsuccess = (event) => {
            resolve(event.target.result);
        };
        req.onerror = (event) => {
            reject(`Database error : ${event.target.errorCode}`);
        };
        req.onupgradeneeded = (event) => {
            let db = event.target.result;
            db.createObjectStore('GreeterSetting');
        };
    });
    // トランザクションを開いて、IndextedDBのデータを基に挨拶する
    openReq.then(db => {
        let tran = db.transaction(['GreeterSetting'], 'readwrite');
        let objStore = tran.objectStore('GreeterSetting');
        new IndexedDBGreeter(objStore).Greet();
    });
    // トランザクションを開いて、IndextedDBのデータをすべてクリアする
    let btnCacheClear = document.getElementById('btnCacheClear');
    btnCacheClear.onclick = () => {
        openReq.then(db => {
            let tran = db.transaction(['GreeterSetting'], 'readwrite');
            let objStore = tran.objectStore('GreeterSetting');
            objStore.clear();
            alert('キャッシュをクリアしました');
        });
    };
};
class IndexedDBGreeter {
    constructor(objectStore) {
        this.metKey = 'Met';
        this.objectStore = objectStore;
    }
    GetMetAsync() {
        return new Promise((resolve, reject) => {
            let req = this.objectStore.get(this.metKey);
            req.onsuccess = (event) => {
                resolve(event.target.result);
            };
            req.onerror = (event) => {
                reject(`ErrorCode : ${event.target.errorCode}`);
            };
        });
    }
    ;
    SetMetAsync(value) {
        return new Promise((resolve, reject) => {
            let req = this.objectStore.put(value, this.metKey);
            req.onsuccess = (event) => {
                resolve(event.target.result);
            };
            req.onerror = (event) => {
                reject(`ErrorCode : ${event.target.errorCode}`);
            };
        });
    }
    Greet() {
        let p = this.GetMetAsync();
        p.then(met => {
            if (met) {
                alert(`また会いましたね (HasSeen : ${met})`);
            }
            else {
                this.SetMetAsync('1');
                alert(`始めまして!`);
            }
        });
    }
}
class StorageGreeter {
    constructor(storage) {
        this.metKey = 'Met';
        this.storage = storage;
    }
    get Met() {
        return this.storage.getItem(this.metKey);
    }
    set Met(value) {
        this.storage.setItem(this.metKey, value);
    }
    Greet() {
        if (this.Met) {
            alert(`また会いましたね (HasSeen : ${this.Met})`);
        }
        else {
            this.Met = '1';
            alert(`始めまして!`);
        }
    }
}
//# sourceMappingURL=app.js.map