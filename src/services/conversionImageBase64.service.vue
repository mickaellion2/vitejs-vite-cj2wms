<script>
export default {
  name: "conversionImageBase64.service",
  methods:{
    async convertiImageEnBase64(img){
      let maBase64 = "";
      //encode l'image en base64
      let reader = new  FileReader();
      const promise = new Promise(resolve => {
        reader.onload=function (){
          maBase64= reader.result.replace("data:", "").replace(/^.+,/, "");
          resolve();
          return  maBase64;
        }
      });

      reader.readAsDataURL(img);
      await promise;
      return reader;
    }
  }
}
</script>