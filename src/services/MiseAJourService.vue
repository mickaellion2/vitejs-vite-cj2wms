<template>
  <div id="etatmiseajour" :class="'maj-etat-' + etat">
    <div class="etat_0" v-if="etat == 0">
      <h1>
        Bienvenue sur le facturier de l'ANAFE. Synchronisation avec les OPCOS en
        cours...
      </h1>
    </div>
    <span class="etat_1" v-if="etat == 1"
      >Mise à jour effectuée {{ progression }}</span
    >
    <span class="etat_2" v-if="etat == 2">Echec de la mise à jour</span>
  </div>
</template>

<script>
import construitURLService from '@/services/construitURL.service.vue';
import configuration from '@/administration/configuration.vue';
import connexionAPIService from '@/services/connexionAPI.service.vue';
import LocalBddService from '@/services/LocalBddService.vue';

export default {
  name: 'MiseAJourService',
  props: {},
  data() {
    return {
      etat: 0,
      collections: [],
      nbTotalCollections: 0,
      progression: '',
      infosDistantes: '',
      //derniereMAJ:0
    };
  },
  mounted: function () {
    this.$nextTick(function () {
      this.collections = Object.values(configuration.data().collectionsAMAJ);
      this.nbTotalCollections = this.collections.length;
      //TODO : cote back
      //if(this.derniereMAJ > Date.now() - ...  )
      //this.derniereMAJ = Date.now();
      this.miseAJour();
    });
  },
  methods: {
    async miseAJour() {
      let nomCollection = this.collections.shift();
      if (nomCollection) {
        await this.miseAJourCollection(nomCollection);
        this.miseAJour();
      } else {
        this.etat = 1;
      }
    },
    getMessageFromDistInfo(dist) {
      var aInfog = [];
      if (dist && dist.extra_info) {
        for (var nomOpco in dist.extra_info) {
          let infos = dist.extra_info[nomOpco],
            asInfo = [];
          if (!Array.isArray(infos)) {
            infos = [infos];
          }
          for (let info of infos) {
            let ainfo = [],
              sinfo;
            if (!info) {
              ainfo.push('null');
            } else if (info.erreur) {
              ainfo.push(info.erreur);
            } else {
              if (info.nbinsertions != 0) {
                ainfo.push(info.nbinsertions + 'i');
              }
              if (info.nbmodifications) {
                ainfo.push(info.nbmodifications + 'm');
              }
            }
            sinfo = info ? info.collection || '' : '';
            sinfo += '(' + (ainfo.length ? ainfo.join(',') : 'ok') + ')';

            asInfo.push(sinfo);
          }
          let sinfo = nomOpco + ':' + asInfo.join('.');
          aInfog.push(sinfo);
        }
      }
      return aInfog.length ? '-Distant:' + aInfog.join(' / ') : '';
    },
    async miseAJourCollection(nomCollection) {
      let URL = construitURLService.methods.construitURLConnectionBack(
        nomCollection,
        configuration.data().urlPossibles.obtenir
      );
      let reponseBDD = await connexionAPIService.methods.requete(URL, null);
      console.log(reponseBDD);
      if (reponseBDD.code_reponse !== 0) {
        console.log(nomCollection);
        //revient à la Vue de connexion
        alert(
          'erreur get ' +
            nomCollection +
            ' : ' +
            reponseBDD.Error_info +
            "\nRetour à l'écran de connexion"
        );
        this.$router.push({ name: 'connexion' });
      } else {
        let liste = reponseBDD.extra_info;
        LocalBddService.methods.miseAJour(nomCollection, liste);
        this.$emit('ongetliste', nomCollection, liste);
        let msgdist = this.getMessageFromDistInfo(reponseBDD.dist_info);

        this.progression =
          this.nbTotalCollections -
          this.collections.length +
          '/' +
          this.nbTotalCollections +
          msgdist;
      }
    },
    getInfosDistantes(infos) {
      this.infosDistantes = infos;
    },
  },
};
</script>
<style scoped>
.etat_0 {
  padding: 20px;
  text-align: center;
}
.etat_1 {
  background: yellowgreen;
}
.etat_2 {
  background: red;
}
.maj-etat-0 {
  height: 100%;
  top: 0;
  left: 165px;
  z-index: 100;
}
</style>

