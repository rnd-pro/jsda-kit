export const READY_EVENT_NAME = 'idb-store-ready';

const DEFAULT_DB_NAME = `symbiote-db`;
const UPD_EVENT_PREFIX = `symbiote-idb-update_`;

export class DbInstance {

  /** @type {Object<String, () => void>} */
  #subscriptionsMap = {};

  /** @type {(e: StorageEvent) => void} */
  #updateHandler;

  /** @type {(e: CustomEvent) => void} */
  #localUpdateHandler;

  /** @type {Boolean} */
  #ready = false;

  /**
   * @template {Event} T
   * @param {T} [event]
   */
  #notifyWhenReady(event = null) {
    window.dispatchEvent(
      new CustomEvent(READY_EVENT_NAME, {
        detail: {
          dbName: this.name,
          storeName: this.storeName,
          event,
        },
      })
    );
  }

  // #getReadyState() {
  //   return new Promise((resolve, reject) => {
  //     if (this.#ready) {
  //       resolve(this.#ready);
  //     } else {
  //       let onReadyState = (e) => {
  //         this.#ready = true;
  //         window.removeEventListener(READY_EVENT_NAME, onReadyState);
  //         resolve(this.#ready);
  //       };
  //       window.addEventListener(READY_EVENT_NAME, onReadyState);
  //     }
  //   });
  // }

  /**
   * @returns {String}
   */
  get #updEventName() {
    return UPD_EVENT_PREFIX + this.name;
  }

  /**
   * @param {String} key
   */
  #getUpdateEvent(key) {
    return new CustomEvent(this.#updEventName, {
      detail: {
        key: this.name,
        newValue: key,
      },
    });
  }

  /**
   * @param {String} key
   */
  #notifySubscribers(key) {
    window.localStorage.removeItem(this.name);
    window.localStorage.setItem(this.name, key);
    window.dispatchEvent(this.#getUpdateEvent(key));
  }

  /** @type {Object<String, Number>} */
  static versionMap = {};

  /** @type {Number} */
  get version() {
    return DbInstance.versionMap[this.name];
  }

  /**
   * @param {String} dbName
   * @param {String} storeName
   */
  constructor(dbName, storeName) {
    /** @type {String} */
    this.name = dbName;

    if (!DbInstance.versionMap[this.name]) {
      DbInstance.versionMap[this.name] = 1;
    } else {
      DbInstance.versionMap[this.name]++;
    }
    
    /** @type {String} */
    this.storeName = storeName;
    // /** @type {IDBOpenDBRequest} */
    // this.request = window.indexedDB.open(this.name, this.version);
    // this.request.onupgradeneeded = (e) => {
    //   /** @type {IDBDatabase} */
    //   this.db = e.target['result'];
    //   // this.#checkStoreName(this.db);
    //   if (!this.db.objectStoreNames.contains(storeName)) {
    //     this.objStore = this.db.createObjectStore(storeName, {
    //       keyPath: '_key',
    //     });
    //     this.objStore.transaction.oncomplete = (e) => {
    //       this.#notifyWhenReady(e);
    //     };
    //   }
    // };
    // this.request.onblocked = (e) => {
    //   console.log(e);
    // };
    // this.request.onsuccess = (/** @type {StorageEvent} */ e) => {
    //   // @ts-ignore
    //   this.db = e.target.result;
    //   // this.#checkStoreName(this.db);
    //   this.#notifyWhenReady(e);
    // };
    // this.request.onerror = (e) => {
    //   console.error(e);
    // };
  
    this.#updateHandler = (/** @type {StorageEvent} */ e) => {
      if (e.key === this.name && this.#subscriptionsMap[e.newValue]) {
        /** @type {Set<Function>} */
        let set = this.#subscriptionsMap[e.newValue];
        set.forEach(async (callback) => {
          callback(await this.read(e.newValue));
        });
      }
    };

    this.#localUpdateHandler = (e) => {
      this.#updateHandler(e.detail);
    };

    window.addEventListener('storage', this.#updateHandler);
    window.addEventListener(this.#updEventName, this.#localUpdateHandler);
  }

  closeDb() {
    if (this._db) {
      this._db?.close();
      this._db = null;
    }
  }

  /** @returns {Promise<IDBDatabase>}  */
  getDb() {
    this.closeDb();
    return new Promise((resolve, reject) => {
      let connection = window.indexedDB.open(this.name, this.version);
      connection.onupgradeneeded = (e) => {
        /** @type {IDBDatabase} */
        this._db = e.target['result'];

        if (!this._db.objectStoreNames.contains(this.storeName)) {
          this.objStore = this._db.createObjectStore(this.storeName, {
            keyPath: '_key',
          });
        }

        console.log(this.objStore);

        this.objStore.transaction.oncomplete = (e) => {
          this.#notifyWhenReady(e);
          resolve(this._db);
        };
      };

      connection.onblocked = async (e) => {
        console.log(e);
        console.log(this.storeName);
        console.log('BLOCKED');
        resolve(await this.getDb());
      };

      connection.onsuccess = (/** @type {StorageEvent} */ e) => {
        // @ts-ignore
        this._db = e.target.result;
        resolve(this._db);
        this.#notifyWhenReady(e);
      };

      connection.onerror = (e) => {
        console.error(e);
        reject(null);
      };

    });
  }

  /** @param {String} key */
  async read(key) {
    let db = await this.getDb();
    let tx = db.transaction(this.storeName, 'readwrite');
    let request = tx.objectStore(this.storeName).get(key);
    return new Promise((resolve, reject) => {
      request.onsuccess = (e) => {
        // @ts-ignore
        if (e.target.result?._value) {
          // @ts-ignore
          resolve(e.target.result._value);
        } else {
          resolve(null);
          // console.warn(`IDB: cannot read "${key}"`);
        }
      };
      request.onerror = (e) => {
        reject(e);
      };
    });
  }

  /**
   * @param {String} key
   * @param {any} value
   * @param {Boolean} [silent]
   */
  async write(key, value, silent = false) {
    let db = await this.getDb();
    let data = {
      _key: key,
      _value: value,
    };
    let tx = db.transaction(this.storeName, 'readwrite');
    let request = tx.objectStore(this.storeName).put(data);
    return new Promise((resolve, reject) => {
      request.onsuccess = (e) => {
        if (!silent) {
          this.#notifySubscribers(key);
        }
        // @ts-ignore
        resolve(e.target.result);
      };
      request.onerror = (e) => {
        reject(e);
      };
    });
  }

  /**
   * @param {String} key
   * @param {Boolean} [silent]
   */
  async delete(key, silent = false) {
    let db = await this.getDb();
    let tx = db.transaction(this.storeName, 'readwrite');
    let request = tx.objectStore(this.storeName).delete(key);
    return new Promise((resolve, reject) => {
      request.onsuccess = (e) => {
        if (!silent) {
          this.#notifySubscribers(key);
        }
        resolve(e);
      };
      request.onerror = (e) => {
        reject(e);
      };
    });
  }

  async getAll() {
    let db = await this.getDb();
    let tx = db.transaction(this.storeName, 'readwrite');
    let request = tx.objectStore(this.storeName).getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = (e) => {
        // @ts-ignore
        let all = e.target.result;
        resolve(
          all.map((obj) => {
            return obj._value;
          })
        );
      };
      request.onerror = (e) => {
        reject(e);
      };
    });
  }

  /**
   * @param {String} key
   * @param {(val: any) => void} callback
   */
  subscribe(key, callback) {
    if (!this.#subscriptionsMap[key]) {
      this.#subscriptionsMap[key] = new Set();
    }
    /** @type {Set} */
    let set = this.#subscriptionsMap[key];
    set.add(callback);
    return {
      remove: () => {
        set.delete(callback);
        if (!set.size) {
          delete this.#subscriptionsMap[key];
        }
      },
    };
  }

  stop() {
    window.removeEventListener('storage', this.#updateHandler);
    this.#subscriptionsMap = null;
    IDB.clear(this.name);
  }
}

export class IDB {
  /** @returns {String} */
  static get readyEventName() {
    return READY_EVENT_NAME;
  }

  /**
   * @param {String} dbName
   * @param {String} [storeName]
   * @returns {DbInstance}
   */
  static open(dbName = DEFAULT_DB_NAME, storeName = 'store') {
    let key = dbName + '/' + storeName;
    if (!this.#reg[key]) {
      this.#reg[key] = new DbInstance(dbName, storeName);
    }
    return this.#reg[key];
  }

  static #reg = Object.create(null);

  /** @param {String} dbName */
  static clear(dbName) {
    window.indexedDB.deleteDatabase(dbName);
    for (let key in this.#reg) {
      if (key.split('/')[0] === dbName) {
        delete this.#reg[key];
      }
    }
  }
}
