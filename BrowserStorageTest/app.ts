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
    let indexedDb = window.indexedDB;
    let openReq = new Promise<IDBDatabase>((resolve, reject) => {
        let req = indexedDb.open('GreeterDB', 1);
        req.onsuccess = (event: any) => {
            resolve(event.target.result);
        };

        req.onerror = (event: any) => {
            reject(`Database error : ${event.target.errorCode}`);
        };

        req.onupgradeneeded = (event: any) => {
            let db: IDBDatabase = event.target.result;
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