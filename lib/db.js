import { Logger } from '@lib/clientLogger.js'
// import { openDB, deleteDB, wrap, unwrap } from 'idb'
import { openDB, deleteDB } from 'idb/with-async-ittr'
// import * as idb from 'idb'

const dbName = 'upcoming'
const dbVersion = 1
const stores = {
    movies: [
        'release_date', 
        'limited_release_date', 
        'theatrical_release_date', 
        'digital_release_date', 
        // ['limited_release_date', 'theatrical_release_date'], 
        // ['limited_release_date', 'theatrical_release_date', 'ignore'], 
    ]
}
let dbPromise = null

try {
    dbPromise = openDB(dbName, dbVersion, {
        upgrade(db) {
            Logger.log('upgrade db')
            for (let [storeName, indexes] of Object.entries(stores)) {
            // for (var i in Object.keys(stores)) {
                // Logger.log(storeName)
                // Logger.log(indexes)
                if (db.objectStoreNames.contains(storeName)) {
                    continue;
                }
                const store = db.createObjectStore(storeName, {
                    keyPath: 'id',
                    autoIncrement: false,
                });
                for (var idxName of indexes) {
                    // store.createIndex(idxName, idxName, {unique: false, multiEntry: false});
                    store.createIndex(idxName, idxName);
                }
            }
        },
    });
} catch(error) {
    Logger.log(error)
}

  
  class DBService {

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
  
export const Service = new DBService()

// class DB {
//     dbName = 'upcoming'
//     dbVersion = 1
//     stores = {
//         movies: ['releaseDate']
//     }
//     db

//     constructor() {
//         this.database = this.dbName
//         this.createObjectStore()
        
//     }

//     async createObjectStore() {
//         try {
//             const storeNames = [
//                 'movies'
//             ]
//             this.db = await openDB(this.dbName, this.dbVersion, {
//                 upgrade(db) {
//                     for (var storeName in storeNames) {
//                         if (db.objectStoreNames.contains(storeName)) {
//                             continue;
//                         }
//                         const store = db.createObjectStore(storeName, {
//                             // The 'id' property of the object will be the key.
//                             keyPath: 'id',
//                             // If it isn't explicitly set, create a value by auto incrementing.
//                             autoIncrement: true,
//                         });
//                         // Create an index on the 'date' property of the objects.
//                         for (var idxName in this.stores[storeName]) {
//                             store.createIndex(idxName, idxName);
//                         }
//                     }
//                 },
//             });
//         } catch (error) {
//             Logger.log('false')
//             Logger.log(error)
//             return false;
//         }
//         Logger.log(this.db)
//     }

//     async getValue(tableName, id) {
//         const tx = this.db.transaction(tableName, 'readonly');
//         const store = tx.objectStore(tableName);
//         const result = await store.get(id);
//         Logger.log('Get Data ', JSON.stringify(result));
//         return result;
//     }

//     async getAllValue(tableName) {
//         const tx = this.db.transaction(tableName, 'readonly');
//         const store = tx.objectStore(tableName);
//         const result = await store.getAll();
//         Logger.log('Get All Data', JSON.stringify(result));
//         return result;
//     }

//     async putMovie (value) {
//         // Logger.log(value)
//         value['type'] = 'movie'
//         // Logger.log(value)
//         this.putValue('movies', value)
//     }

//     async putValue(tableName, value) {
//         // Logger.log(this.db)
//         const tx = this.db.transaction(tableName, 'readwrite');
//         const store = tx.objectStore(tableName);
//         const result = await store.put(value);
//         Logger.log('Put Data ', JSON.stringify(result));
//         return result;
//     }

//     async putBulkValue(tableName, values) {
//         const tx = this.db.transaction(tableName, 'readwrite');
//         const store = tx.objectStore(tableName);
//         for (const value of values) {
//             const result = await store.put(value);
//             Logger.log('Put Bulk Data ', JSON.stringify(result));
//         }
//         return this.getAllValue(tableName);
//     }

//     async deleteValue(tableName, id) {
//         const tx = this.db.transaction(tableName, 'readwrite');
//         const store = tx.objectStore(tableName);
//         const result = await store.get(id);
//         if (!result) {
//             Logger.log('Id not found', id);
//             return result;
//         }
//         await store.delete(id);
//         Logger.log('Deleted Data', id);
//         return id;
//     }
// }

// export default DB;

// for (var storeName in Object.keys(stores)) {
//     await db.createIndex({
//         index: {
//         fields: ['foo']
//         }
//     })
// }

// const db = openDB(dbName, dbVersion, {
//     upgrade(db) {
//         // Create a store of objects
//         for (var storeName in Object.keys(stores)) {
//             const store = db.createObjectStore(storeName, {
//                 // The 'id' property of the object will be the key.
//                 keyPath: 'id',
//                 // If it isn't explicitly set, create a value by auto incrementing.
//                 autoIncrement: true,
//             });
//             // Create an index on the 'date' property of the objects.
//             for (var idxName in stores[storeName]) {
//                 store.createIndex(idxName, idxName);    
//             }
//         }
//     },
// });

// export async function keys() {
//     return (await db).getAllKeys(dbName);
// }

// async function demo() {

    // Add an article:
    // await db.add('articles', {
    //     title: 'Article 1',
    //     date: new Date('2019-01-01'),
    //     body: '…',
    // });

    // Add multiple articles in one transaction:
    // {
    //     const tx = db.transaction('articles', 'readwrite');
    //     await Promise.all([
    //         tx.store.add({
    //             title: 'Article 2',
    //             date: new Date('2019-01-01'),
    //             body: '…',
    //         }),
    //         tx.store.add({
    //             title: 'Article 3',
    //             date: new Date('2019-01-02'),
    //             body: '…',
    //         }),
    //         tx.done,
    //     ]);
    // }

    // Get all the articles in date order:
    // Logger.log(await db.getAllFromIndex('articles', 'date'));

    // Add 'And, happy new year!' to all articles on 2019-01-01:
    // {
    //     const tx = db.transaction('articles', 'readwrite');
    //     const index = tx.store.index('date');

    //     for await (const cursor of index.iterate(new Date('2019-01-01'))) {
    //         const article = { ...cursor.value };
    //         article.body += ' And, happy new year!';
    //         cursor.update(article);
    //     }

    //     await tx.done;
    // }
// }