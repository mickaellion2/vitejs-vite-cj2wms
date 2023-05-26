<template>
  <legend>S&eacute;lection OPCO</legend>
  <input type="hidden" name="##base" value="" />
  <div class="detailApprenti">
    <div class="_inputBoxFacturier">
      <span class="detailFacturier"> </span>
      <select name="opco" required>
        <option value="0">Choisir</option>
        <option v-for="o in listeOpcos" :value="o.nom">{{ o.nom }}</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormulaireOpco',
  data() {
    return {
      listeOpcos: this.$parent.opcos,
    };
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

/*section{
  display: flex;
  padding: 10px;
}*/
</style>
