import { Logger } from '@lib/clientLogger.js'
// import { openDB, deleteDB, wrap, unwrap } from 'idb'
import { openDB, deleteDB } from 'idb/with-async-ittr'
// import * as idb from 'idb'

const dbName = 'upcoming'
const dbVersion = 12
const stores = {
    movies: [
        'release_date',
        'limited_release_date',
        'theatrical_release_date',
        'digital_release_date',
        'ignore',
        'watchlist'
        // ['limited_release_date', 'theatrical_release_date'], 
        // ['limited_release_date', 'theatrical_release_date', 'ignore'], 
    ]
}
let dbPromise = null

try {
    dbPromise = openDB(dbName, dbVersion, {
        upgrade(dbPromise, oldVersion, newVersion, transaction, event) {
            Logger.log(`upgrade db ${oldVersion}:${newVersion}`)
            for (let [storeName, indexes] of Object.entries(stores)) {
                // for (var i in Object.keys(stores)) {
                let store;
                if (!dbPromise.objectStoreNames.contains(storeName)) {
                    store = dbPromise.createObjectStore(storeName, {
                        keyPath: 'id',
                        autoIncrement: false,
                    });
                } else {
                    store = transaction.objectStore(storeName)
                }
                for (var idxName of indexes) {
                    if (store.indexNames.contains(idxName)) {
                        Logger.log(`Index ${idxName} already exists`)
                    } else {
                        Logger.log(`Create index ${idxName}`)
                        // store.get
                        // store.createIndex(idxName, idxName, {unique: false, multiEntry: false});
                        store.createIndex(idxName, idxName);    
                        // let entries = store.getAll()
                    }
                }
            }
        },
        blocked(currentVersion, blockedVersion, event) {
            Logger.log(`Blocked ${currentVersion}:${blockedVersion}`)
            Logger.log(event)
        },
        blocking(currentVersion, blockedVersion, event) {
            Logger.log(`Blocked ${currentVersion}:${blockedVersion}`)
            Logger.log(event)
        },
        terminated() {
            Logger.log('DB Terminated')
        }
    });
} catch (error) {
    Logger.log(error)
}


class ServiceDatabase {

    async reset() {
        if (dbPromise) {
            dbPromise.then(db => {
                db.close()
                dbPromise = null
            })
            await deleteDB('upcoming', {
                blocked(currentVersion, event) {
                    Logger.log('blocked')
                    Logger.log(currentVersion)
                    Logger.log(event)
                }
            })
        }
    }

    get(tablespace, key) {
        return dbPromise.then(db => {
            return db.transaction(tablespace).objectStore(tablespace).get(key);
        }).catch(error => {
            // Do something?
        });
    }

    getAll(tablespace, indexName, index = []) {
        return dbPromise.then(db => {
            return db.transaction(tablespace).objectStore(tablespace).index(indexName).getAll(index);
        }).catch(error => {
            Logger.log(error)
        });
    }

    getAllMovies(lower, upper) {
        return dbPromise.then(db => {
            let promises = []
            let keyRange = IDBKeyRange.bound(lower, upper)
            // Logger.log(db.transaction('movies').objectStore('movies').index('limited_release_date'))
            // Logger.log(db.transaction('movies').objectStore('movies').index('limited_release_date').getAllKeys('2023-06-15'))
            // promises.push(db.transaction('movies').objectStore('movies').index('limited_release_date').getAllKeys())
            let store = db.transaction('movies').objectStore('movies')
            // Logger.log(store)
            let index1 = store.index('theatrical_release_date')
            promises.push(index1.getAllKeys(keyRange))
            let index2 = store.index('limited_release_date')
            promises.push(index2.getAllKeys(keyRange))
            // Logger.log(promises)
            return Promise.all(promises).catch(e => {
                Logger.log(e)
            }
            )
        }).catch(error => {
            Logger.log(error)
        });
    }

    getMovie(key) {
        return dbPromise.then(db => {
            // let promises = []
            // Logger.log(keys)
            return db.transaction('movies').objectStore('movies').get(key)
            // promises.push(db.transaction('movies').objectStore('movies').index('theatrical_release_date').getAllKeys(keyRange))
            // return Promise.all(promises).catch(e => {
            //     Logger.log(e)
            //   }
            // )
        }).catch(error => {
            Logger.log(error)
        });
    }

    getMovieWatchlist() {
        return dbPromise.then(db => {
            let promises = []
            let store = db.transaction('movies').objectStore('movies')
            let index1 = store.index('watchlist')
            return index1.getAllKeys()
            // return Promise.all(promises).catch(e => {
            //     Logger.log(e)
            // })
        }).catch(error => {
            Logger.log(error)
        });        
    }

    getMovies(keys) {
        return dbPromise.then(db => {
            let promises = []
            // Logger.log(keys)
            keys.map((k) => {
                // Logger.log(k)
                // Logger.log(promises)
                promises.push(db.transaction('movies').objectStore('movies').get(k))
            }, promises)
            // promises.push(db.transaction('movies').objectStore('movies').index('theatrical_release_date').getAllKeys(keyRange))
            return Promise.all(promises).catch(e => {
                Logger.log(e)
            }
            )
        }).catch(error => {
            Logger.log(error)
        });
    }

    put(tablespace, object, key = null) {
        // Logger.log(tablespace)
        // Logger.log(object)
        // Logger.log(key)
        return dbPromise.then(db => {
            if (key) {
                return db.transaction(tablespace, 'readwrite').objectStore(tablespace).put(object, key);
            }
            return db.transaction(tablespace, 'readwrite').objectStore(tablespace).put(object);
        }).catch(error => {
            Logger.log(error)
        });
    }

    delete(tablespace, key) {
        return dbPromise.then(db => {
            return db.transaction(tablespace, 'readwrite').objectStore(tablespace).delete(key);
        }).catch(error => {
            // Do something?
        });
    }

    deleteAll(tablespace) {
        return dbPromise.then(db => {
            return db.transaction(tablespace, 'readwrite').objectStore(tablespace).clear();
        }).catch(error => {
            // Do something?
        });
    }

}

export const DatabaseService = new ServiceDatabase()