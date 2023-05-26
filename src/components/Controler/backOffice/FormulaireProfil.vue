<template>
  <legend>Mon profil</legend>
  <input type="hidden" name="##base" value="" /> 
  <div class="detailProfil">
    <div class="">
      <div>
        <span>Nom</span>
        <input name="nom" type="text" >
      </div>
      <div>
        <span>Prenom</span>
        <input name="prenom" type="text" >
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
    </div>
   
  </div>
</template>

<script>
export default {
  name: 'FormulaireProfil',
  data() {
    return {
    };
  },
  methods: {
  },
  props: {
    item: Object
  },
};
</script>

<style scoped>

</style>
