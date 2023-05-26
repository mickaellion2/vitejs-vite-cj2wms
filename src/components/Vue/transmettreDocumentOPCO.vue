<template>
  <nav-bar-facturier v-bind:utilisateur="utilisateur" ></nav-bar-facturier>
  <section class="affichagePrincipal">
    <header>
      <bandeau-haut-facturier></bandeau-haut-facturier>
    </header>
    <main>
        <section id="selectionOPCO">
          <h3>Selectionnez l'OPCO correspondant</h3>
          <select @change="this.affecteUnOPCO($event.target.value)" >
            <option v-for="opco in listeOPCO" v-bind:key="opco.value" v-bind:value="opco.value">
              {{ opco.nomOPCO }}
            </option>
          </select>
        </section>

    </main>
  </section>
</template>

<script>
import navBarFacturier from "@/components/Controler/backOffice/navBarFacturier.vue";
import bandeauHautFacturier from "@/components/Controler/backOffice/bandeauHautFacturier.vue";
import App from "@/App.vue"; 
const photoProfilDefaut = App.data().pab + "/defautProfil.jpg";
import connexionOPCOService from "@/services/connexionOPCO.service.vue";
//import configuration from "@/administration/configuration.vue";

export default {
  name: "transmettreDocumentOPCO",
  components:{
    navBarFacturier,
    bandeauHautFacturier
  },
  data(){
    return{
      utilisateur:{
        photoProfil:'',
        nomUtilisateur:''
      },
      listeOPCO:[],
      informationsOPCO:{
        nomOPCO:'',
        editeur:'',
        logiciel:'',
        version:'',
        APIKEY:'',
      }
    }
  },
  methods:{
    creeListeOPCO(listeOPCO){
      this.listeOPCO=listeOPCO;
    },
    affecteUnOPCO(opco){
      for (let i=0; i<this.listeOPCO.length; i++){
        if(opco ===this.listeOPCO[i].nomOPCO){
          this.informationsOPCO.nomOPCO=this.listeOPCO[i].nomOPCO;
          this.informationsOPCO.editeur=this.listeOPCO[i].editeur;
          this.informationsOPCO.logiciel=this.listeOPCO[i].logiciel;
          this.informationsOPCO.version=this.listeOPCO[i].version;
          this.informationsOPCO.APIKEY=this.listeOPCO[i].APIKEY;
        }
      }
    }
  },
  async beforeMount(){
    if(localStorage.getItem("avatar")===""){
      this.utilisateur.photoProfil=photoProfilDefaut;
    }else{
      this.utilisateur.photoProfil=localStorage.getItem("avatar");
    }

    if (localStorage.getItem("nom")!=="" && localStorage.getItem("prenom") !==""){
      this.utilisateur.nomUtilisateur=localStorage.getItem("prenom")+" "+localStorage.getItem("nom");
    }else{
      this.utilisateur.nomUtilisateur=localStorage.getItem("mail");
    }

    //Recuperer les informations de l API OPCO
    await connexionOPCOService.methods.chargeListeOPCO().then((listeOPCO) => this.creeListeOPCO(listeOPCO));
  }
}
</script>

<style scoped>

main{
  margin-left: 165px;
  width: calc(100% - 165px);
}

header{
  position: fixed;
  right: 0;
  top: 0;
  left: 165px;
  z-index: 100;
  height: 60px;
}

</style>