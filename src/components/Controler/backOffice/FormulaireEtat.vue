<template>
  <legend>Etat du dossier</legend>
  <input type="hidden" name="##base" value="cerfa" />
  <input type="hidden" name="#opco" :value="item.opco" />
  <div class="detailApprenti">
    <div class="_inputBoxFacturier">
      <span class="detailFacturier"> </span>
      <select name="etat" required @change="setEtat">
        <option value="0">Choisir</option>
        <option value="0">INITIAL (0)</option>
        <option value="TRANSMIS">TRANSMIS</option>
        <option value="EN_COURS_INSTRUCTION">INSTRUCTION EN COURS</option>
        <option value="ENGAGE">ENGAG&Eacute;</option>
        <option value="ANNULE">ANNUL&Eacute;</option>
        <option value="REFUSE">REFUS&Eacute;</option>
        <option value="RUPTURE">RUPTURE</option>
        <option value="SOLDE">SOLD&Eacute;</option>
      </select>
    </div>
    <div class="_inputBoxFacturier" v-if="etat == 'TRANSMIS'">
      <span class="detailFacturier"
        >En cochant cette case, vous confirmez que vous voulez transmettre le
        dossier sélectionné à l'OPCO concerné.</span
      >
      <input name="changeetat" type="checkbox" class="nontransmis" required />
      <input
        name="##commande"
        type="hidden"
        value="dossier.cerfa.etat"
        required
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormulaireEtat',
  data() {
    return {
      etat: '',

    };
  },
  methods: {
    setEtat(e) {
      this.etat = e.target.value;
    },
  },
  props: {
    item: Object
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
.erreur {
  margin: 5px;
  padding: 3px;
  display: block;
  background: red;
  color: white;
}

/*section{
  display: flex;
  padding: 10px;
}*/
</style>
