<template>
  <nav-bar-facturier v-bind:utilisateur="utilisateur"></nav-bar-facturier>
  <section class="affichagePrincipal">
    <header>
      <bandeau-haut-facturier></bandeau-haut-facturier>
    </header>
    <main>
      <corps-facturier v-bind:montantWidget="widget"></corps-facturier>
    </main>
  </section>
</template>

<script>
import configuration from '@/administration/configuration.vue';
import photoProfilDefaut from '@/assets/vue.svg';
import NavBarFacturier from '@/components/Controler/backOffice/navBarFacturier.vue';
import bandeauHautFacturier from '@/components/Controler/backOffice/bandeauHautFacturier.vue';
import corpsFacturier from '@/components/Controler/backOffice/corpsFacturier.vue';

export default {
  name: 'Facturier',
  components: {
    NavBarFacturier,
    bandeauHautFacturier,
    corpsFacturier,
  },
  data() {
    return {
      utilisateur: {
        photoProfil: '',
        nomUtilisateur: '',
      },
      widget: {
        //A creer les données quand on aura les data de la BDD
        total: {
          intitule: 'total',
          montant: 700,
          montantTotal: 25000,
          filtre:{
            dateDebut: '',
            dateFin: ''
          }
        },
        nMoins1: {
          intitule: '2021-2022',
          montant: 250,
          //montantTotal:this.data().widget.total.montant
          montantTotal: 700,
          filtre:{
            dateDebut: '',
            dateFin: ''
          }
        },
        n: {
          intitule: '2022-2023',
          montant: 450,
          //montantTotal:this.data().widget.total.montant
          montantTotal: 700,
          filtre:{
            dateDebut: '',
            dateFin: ''
          }
        },
        maj: function (t, debut, fin) {
          this.total.montant = configuration.data().format_euro.format(t);
        },
      },
    };
  },
  beforeMount() {
    if (localStorage.getItem('avatar') === '') {
      //this.utilisateur.photoProfil = photoProfilDefaut;
    } else {
      this.utilisateur.photoProfil = localStorage.getItem('avatar');
    }

    if (
      localStorage.getItem('nom') !== '' &&
      localStorage.getItem('prenom') !== ''
    ) {
      this.utilisateur.nom = localStorage.getItem('nom').toUpperCase();
      this.utilisateur.prenom = localStorage.getItem('prenom');
    } else {
      this.utilisateur.nomUtilisateur = localStorage.getItem('mail');
    }
  },
};
</script>

<style scoped>
main {
  margin-left: 165px;
  width: calc(100% - 165px);
  margin-top: 2em;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.affichagePrincipal {
  /*
  Ici se trouve la gestion de l'affichage de la fenetre principale à droite du facturier
   */
  height: 100vh;
  position: fixed;
  width: 100%;
}
</style>
