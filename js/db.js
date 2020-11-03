const dbPromised = idb.open("team-fav", 1, function(upgradeDB){
    const articlesObjectStore = upgradeDB.createObjectStore("clubs", {
        keyPath: "id"
    });
    articlesObjectStore.createIndex("name", "name", { unique : false});
});

const addFav = club => {

    dbPromised
        .then((db) => {
            var tx = db.transaction("clubs", "readwrite");
            var store = tx.objectStore("clubs");
            store.add(club);
            return tx.complete;
        })
        .then(() => showNotification("success","add favorite teams"));
    //console.log(club);
}

const getAll = () => {
    return new Promise((resolve, reject) => {
        dbPromised
          .then((db) => {
            var tx = db.transaction("clubs", "readonly");
            var store = tx.objectStore("clubs");
            return store.getAll();
          })
          .then(function(articles) {
            resolve(articles);
          });
      });
}

const deleteFav = id => {
    return new Promise((resolve, reject) => {
        dbPromised
        .then((db) => {
            var tx = db.transaction("clubs", "readwrite");
            var store = tx.objectStore("clubs");
            store.delete(id);
            return tx.complete
        })
        .then(() => {
            const getAll_ = getAll();
            resolve(getAll_);
            showNotification("success","delete favorite teams");
        });
    //console.log(id)
    });
    
}