<script>
import configuration from "@/administration/configuration.vue";

export default {
  name: "construitURL.service",
  methods:{
    construitURLConnectionBack(collection, lien){
      if (collection===""){
        return configuration.data().serveur+lien;
      }else{
        return configuration.data().serveur+collection+"/"+lien;
      }
    }
  }
}
</script>