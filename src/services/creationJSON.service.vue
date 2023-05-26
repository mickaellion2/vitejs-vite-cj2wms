<script>
export default {
  name: 'creationJSON.service',
  methods: {
    construitJSON(objet) {
      /*
      let json='{';
      let compteur=0;
      let derniereCase=0;

      for (const element in object) {
        if (object[element] !== '') {
          derniereCase++;
        }
      }

      for (const element in object){
        if(object[element]!==''){
          if(compteur===0 || compteur===derniereCase){
            console.log(object[element]);
            if(typeof (object[element])==="boolean"){
              json+='"'+element+'":'+object[element];
            }else{
              json+='"'+element+'":'+'"'+object[element]+'"';
            }
          }else{
            console.log(object[element]);
            if(typeof (object[element])==="boolean"){
              json+=',"'+element+'":'+object[element];
            }else{
              json+=',"'+element+'":'+'"'+object[element]+'"';
            }
          }
          compteur++
        }
      }
      json+='}';
      return json;*/
      return JSON.stringify(objet);
    },
  },
};
</script>
