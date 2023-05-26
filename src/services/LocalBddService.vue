<template></template>

<script>
import configuration from '@/administration/configuration.vue';

export default {
  name: 'LocalBddService',
  methods: {
    async getDb() {
      return new Promise((resolve, reject) => {
        let nomBddLoc = configuration.data().nomBddLoc,
          versionBddLoc = configuration.data().versionBddLoc;
        let request = window.indexedDB.open(nomBddLoc, versionBddLoc);

        request.onerror = (e) => {
          console.log('Erreur ouverture dbloc', e);
          reject('Erreur');
        };
        request.onsuccess = (e) => {
          resolve(e.target.result);
        };

        /*request.onupgradeneeded = e => {
            console.log('onupgradeneeded');
            let db = e.target.result;
            let objectStore = db.createObjectStore("cats", { autoIncrement: true, keyPath:'id' });
          };*/
      });
    },
    async miseAJour(nomCollection, liste) {
      //TODO
    },
  },
};
</script>
