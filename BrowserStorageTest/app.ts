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
    req.onsuccess = (event: any) => {
        let db: IDBDatabase = event.target.result;

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

    req.onerror = (event: any) => {
        console.error(event.target.error);
    };

    req.onupgradeneeded = (event: any) => {
        let db: IDBDatabase = event.target.result;
        db.createObjectStore('GreeterSetting');
    };
};

interface IGreeter {
    /**
     * あいさつする
     */
    Greet(): void;
}

class IndexedDBGreeter implements IGreeter {
    private objectStore: IDBObjectStore;
    private metKey = 'Met';

    constructor(objectStore: IDBObjectStore) {
        this.objectStore = objectStore;
    }

    public GetMetAsync(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let req = this.objectStore.get(this.metKey);
            req.onsuccess = (event: any) => {
                resolve(event.target.result);
            };

            req.onerror = (event: any) => {
                reject(event.target.error);
            };
        });
    };

    public SetMetAsync(value: string): Promise<IDBValidKey> {
        return new Promise((resolve, reject) => {
            let req = this.objectStore.put(value, this.metKey);
            req.onsuccess = (event: any) => {
                resolve(event.target.result);
            };

            req.onerror = (event: any) => {
                reject(event.target.error);
            };
        });
    }

    public Greet(): void {
        let p = this.GetMetAsync();
        p.then(met => {
            if (met) {
                alert(`また会いましたね (HasSeen : ${met})`);
            } else {
                this.SetMetAsync('1');
                alert(`始めまして!`);
            }
        });
    }
}

class StorageGreeter implements IGreeter {
    private storage: Storage;
    private metKey = 'Met';

    constructor(storage: Storage) {
        this.storage = storage;
    }

    public get Met(): string {
        return this.storage.getItem(this.metKey);
    }

    public set Met(value: string) {
        this.storage.setItem(this.metKey, value);
    }

    public Greet(): void {
        if (this.Met) {
            alert(`また会いましたね (HasSeen : ${this.Met})`);
        } else {
            this.Met = '1';
            alert(`始めまして!`);
        }
    }
}