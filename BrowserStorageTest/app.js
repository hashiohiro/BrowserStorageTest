/* LocalStorageを使う方法 */
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
/* IndexedDBを使う方法 */
window.onload = () => {
    // データベースの接続を開く
    let dbFactory = window.indexedDB;
    let req = dbFactory.open('GreeterDB', 1);
    req.onsuccess = (event) => {
        let db = event.target.result;
        let greetFn = () => {
            // GreeterSettingというデータベースに対して、読み書き可能なトランザクションを開始する
            let tran = db.transaction(['GreeterSetting'], 'readwrite');
            // オブジェクトストア(RDBMSでいう、テーブル相当。ただしデータは表構造ではなくオブジェクト構造。)
            let objStore = tran.objectStore('GreeterSetting');
            // オブジェクトストアのデータを基に、挨拶する
            new IndexedDBGreeter(objStore).Greet();
        };
        let cacheClearFn = () => {
            // 上で用意したトランザクションはスコープ外で消えてしまうので、ボタン押下したときは都度トランザクションを開始する
            let tran = db.transaction(['GreeterSetting'], 'readwrite');
            let objStore = tran.objectStore('GreeterSetting');
            // オブジェクトストアの中身をすべてクリアする
            objStore.clear();
            alert('キャッシュをクリアしました');
        };
        // ページの読み込みができたら、あいさつする
        greetFn();
        // キャッシュクリアボタンを押下したときは、キャッシュクリアする
        let btnCacheClear = document.getElementById('btnCacheClear');
        btnCacheClear.onclick = cacheClearFn;
    };
    req.onerror = (event) => {
        console.error(event.target.error);
    };
    req.onupgradeneeded = (event) => {
        let db = event.target.result;
        db.createObjectStore('GreeterSetting');
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
                reject(event.target.error);
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
                reject(event.target.error);
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