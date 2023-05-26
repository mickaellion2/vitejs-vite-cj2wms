<template>
  <section class="modifierLeProfil">
    <h2>Modifier profil</h2>
    <div>
      <span>Nom</span>
      <input v-model="nom" type="text" >
    </div>
    <div>
      <span>Prenom</span>
      <input v-model="prenom" type="text" >
    </div>
    <div>
      <button @click="recupereFichier">Changer son image de profil</button>
      <input
          type="file"
          style="display: none"
          ref="fileInput"
          accept="image/*"
          @change="onFilePicked"/>
      <p v-if="this.erreur !==''">{{this.erreur}}</p>
      <img v-if="this.nomFichier !==''" :src="this.avatar">
    </div>
    <div>
      <button @click="modifieUtilisateur"><span>Modifier son compte</span></button>
    </div>
    <bouton-flashy></bouton-flashy>
  </section>

</template>

<script>
import conversionImageBase64 from "@/services/conversionImageBase64.service.vue";
import creationJSONService from "@/services/creationJSON.service.vue";
import connexionAPIService from "@/services/connexionAPI.service.vue";
import construitURLService from "@/services/construitURL.service.vue";
import configuration from "@/administration/configuration.vue";

export default {
  name: "modifierProfil",
  data(){
    return{
      nom:'',
      prenom:'',
      mail:'',
      avatar:'',
      image:'',
      nomFichier:'',
      erreur:''
    }
  },
  methods:{
    recupereFichier () {
      this.$refs.fileInput.click()
    },
    async onFilePicked (event) {
      const files = event.target.files
      if(!files[0].type.includes("image")){
        this.erreur="format de fichier non supporté";
      }else{
        this.erreur="";
        this.nomFichier= files[0].name
        console.log(files[0])
        let base64= await conversionImageBase64.methods.convertiImageEnBase64(files[0])
        this.avatar=base64.result;
        console.log(this.avatar);
      }
    },
    async modifieUtilisateur(){
      let json=creationJSONService.methods.construitJSON(this.$data);
      const URL= construitURLService.methods.construitURLConnectionBack(configuration.data().collections.utilisateur, configuration.data().urlPossibles.modifier)
      const reponse= await connexionAPIService.methods.requete(URL,json );
      console.log(reponse);


    }

    //1. On recupere le mail de la personne dans les cookies du serveur
    //2. On lance une requete à la base
    //3. On remplit tous les champs avec les infos déja remplies
    //4. Si l'avatar change, on lance le service de conversion et on affiche son résultat dans l'encart

    //5. on recupere toutes les infos et on utilise le service de création de JSON
    //6. on envoie le tout à la base avec l'url "/modifie"
    //7. On récupere le code erreur et on affiche le résultat à l'utilisateur
  },created() {
    this.nom=localStorage.getItem("nom");
    this.prenom=localStorage.getItem("prenom");
    this.mail=localStorage.getItem("mail");
  }
}

</script>

<style scoped>
section{
    display: flex;
    flex-direction: column;
    background-color: var(--color-dark);
    margin: auto;
    margin-top: 15%;
    margin-bottom: 15%;
    padding: 10%;
    border-radius: 6px 0 6px 0;
    width : 50%;
    height : 50%;
    box-shadow: 5px 5px 5px 3px var(--color-dark);
    border: solid white 1px;
    color : white;
}
input{
    margin-top:1%;
    margin-bottom:1%;
}
div{

    
}
h2{
    text-align: center; 
margin-bottom: 10%;
}
</style>