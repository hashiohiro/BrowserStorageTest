window.onload = () => {
    let storage = window.localStorage;
    let greeter: IGreeter = new StorageGreeter(storage);

    greeter.Greet();

    // キャッシュのクリアボタン
    let btnCacheClear = document.getElementById('btnCacheClear');
    btnCacheClear.onclick = () => {
        storage.clear();
        alert('キャッシュをクリアしました');
    }
};

interface IGreeter {
    /**
     * 一度会ったことがあるかどうかを表すフラグ
     */
    Met: string;

    /**
     * あいさつする
     */
    Greet(): void;
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