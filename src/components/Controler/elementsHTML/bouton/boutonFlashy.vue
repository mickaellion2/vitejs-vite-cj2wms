<template>
  <section class="boutonFlashy">
    <button v-on:click="connexion"><span>{{ intituleBouton }}</span></button>
  </section>

</template>

<script>
import connexionAPIService from "@/services/connexionAPI.service.vue";
import construitURLService from "@/services/construitURL.service.vue";
import configuration from "@/administration/configuration.vue";

export default {
  name: "boutonFlashy",
  props:{
    intituleBouton:String,
    email:String,
    password:String
  },
  methods : {
    async connexion(){
      let mail= this.email;
      const password= this.password;
      const URL= construitURLService.methods.construitURLConnectionBack("", configuration.data().urlPossibles.connexion);
      console.log(URL);
      const json = {mail:mail,password:password};

      let reponse = await connexionAPIService.methods.requete(URL, json);
      console.log(reponse.code_reponse);
      if(reponse.code_reponse!==0){
        //Il faut renvoyer la reponse erreur au composant parent
        console.log("erreur mot de passe");

      }else{
        //Connexion etablie
        localStorage.setItem("nom", reponse.extra_info.nom);
        localStorage.setItem("prenom", reponse.extra_info.prenom);
        localStorage.setItem("avatar", reponse.extra_info.avatar);
        localStorage.setItem("mail", reponse.extra_info.mail);
        this.$router.push({name:'facturierPlusModerne'});
      }

    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?familly=Poppins:100,200,300,400,500,600,700,800,900');

.boutonFlashy{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.boutonFlashy button{
  position: relative;
  width: 160px;
  height: 60px;
  display: inline-block;
  margin: 20px;
  border-style: none;
}

.boutonFlashy button:before,
.boutonFlashy button:after{
  content : '';
  position: absolute;
  inset: 0;
  background: red;
  transition: 0.5s;
}

.boutonFlashy button:nth-child(1):before,
.boutonFlashy button:nth-child(1):after{
  background: linear-gradient(45deg,white, white,#DC143C );
}

.boutonFlashy button:hover:before{
  inset: -3px;
}

.boutonFlashy button:hover:after{
  inset: -3px;
  filter: blur(10px);
}
 
.boutonFlashy button span{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: inline-block;
  /*
  changer de la couleur du fond
  et la couleur de la police
   */
  background: white;
  color: black;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  text-transform: uppercase;
  letter-spacing: 2px;
}

</style>