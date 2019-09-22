window.onload = function () {
    var storage = window.localStorage;
    var greeter = new StorageGreeter(storage);
    greeter.Greet();
    // キャッシュのクリアボタン
    var btnCacheClear = document.getElementById('btnCacheClear');
    btnCacheClear.onclick = function () {
        storage.clear();
        alert('キャッシュをクリアしました');
    };
};
var StorageGreeter = /** @class */ (function () {
    function StorageGreeter(storage) {
        this.metKey = 'Met';
        this.storage = storage;
    }
    Object.defineProperty(StorageGreeter.prototype, "Met", {
        get: function () {
            return this.storage.getItem(this.metKey);
        },
        set: function (value) {
            this.storage.setItem(this.metKey, value);
        },
        enumerable: true,
        configurable: true
    });
    StorageGreeter.prototype.Greet = function () {
        if (this.Met) {
            alert("\u307E\u305F\u4F1A\u3044\u307E\u3057\u305F\u306D (HasSeen : " + this.Met + ")");
        }
        else {
            this.Met = '1';
            alert("\u59CB\u3081\u307E\u3057\u3066!");
        }
    };
    return StorageGreeter;
}());
//# sourceMappingURL=app.js.map