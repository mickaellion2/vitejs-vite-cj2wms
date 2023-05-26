<script>
import connexionAPIService from "@/services/connexionAPI.service.vue";
import construitURLService from "@/services/construitURL.service.vue";
import configuration from "@/administration/configuration.vue";

export default {
  name: "connexionOPCO.service",
  data(){
    return {
      listeOPCO:''
    }
  },
  methods:{
    async chargeListeOPCO(){
      const URL_BDD= construitURLService.methods.construitURLConnectionBack(configuration.data().collections.OPCO, configuration.data().urlPossibles.obtenir);
      const listeOPCO= await connexionAPIService.methods.requete(URL_BDD,"");
      if(listeOPCO.code_reponse===0){
        //RETOURNE LA LISTE DES OPCO
        return listeOPCO.extra_info;
      }else{
        console.log(listeOPCO.Error_info);
      }

    },


    async chargeInfoBDDOPCO(nomOPCO){
      const URL_BDD= construitURLService.methods.construitURLConnectionBack(configuration.data().collections.OPCO, configuration.data().urlPossibles.obtenir);
      const JSON='{"'+configuration.data().infoOPCO.NOM_TYPE+'":"'+nomOPCO+'"}'
      const reponseBDD= await connexionAPIService.methods.requete(URL_BDD, JSON);
      if(reponseBDD.code_reponse !==0){
        console.log("erreur : "+reponseBDD.Error_info);
      }else{
        this.nomOPCO=reponseBDD.extra_info.nomOPCO;
        this.editeur=reponseBDD.extra_info.editeur;
        this.logiciel=reponseBDD.extra_info.logiciel;
        this.version=reponseBDD.extra_info.version;
        this.APIKEY=reponseBDD.extra_info.APIKey;
      }
    },
    async requetePOST(lien, json ){
      const URL = configuration.data().connexionAPI_OPCO+lien
      let reponse= await fetch(URL,{
        method: 'POST',
        headers:{
          'Content-Type':'application/json',
          'accept':'application/json',
          'EDITEUR':this.editeur,
          'LOGICIEL':this.logiciel,
          'VERSION':this.version,
        },
        body: JSON.stringify(json)
      });

      if (!reponse.ok){
        throw new Error(`HTTP erreur. status : ${reponse.status}`)
      }
      return reponse.json();
    },
    async requeteGET(lien ){
      //await this.chargeInfoBDD();
      const URL = configuration.data().connexionAPI_OPCO+lien
      let reponse= await fetch(URL);

      if (!reponse.ok){
        throw new Error(`HTTP erreur. status : ${reponse.status}`)
      }
      return reponse.json();
    }
  }

}
</script>