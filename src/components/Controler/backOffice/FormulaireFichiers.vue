<template>
  <legend>Envoi de documents</legend>
  <input type="hidden" name="##commande" value="facture" />
  <input type="hidden" name="##base" value="" />
  <input type="hidden" name="#nomfichiercible" :value="nomFichier" required />
  <div class="detailFichier">
    <div class="_inputBoxFacturier">
      <span class="detailFacturier">Choisir un type de document : </span>
      <select @change="setType" class="nontransmis" name="typefichier" required>
        <option value="0">Choisir</option>
        <option value="cerfa">Cerfa</option>
        <option value="certif">Certificat de r&eacute;alistion</option>
        <option value="facture">Facture</option>
      </select>
    </div>
    <div>
      <ul v-if="typeFichier == 'facture'" class="factures">
        <li
          v-for="facture in facturesAffichees"
          :data-id="facture.id"
          @click="setFacture"
        >
          <span>{{ facture.montant }}</span>
          <span> {{ facture.date }}</span>
        </li>
      </ul>
    </div>
    <div class="_inputBoxFacturier" v-if="ouvertureSelectionFichier">
      <span class="detailFacturier"> </span>
      <input type="file" name="#datafichier" required />
    </div>
  </div>
</template>

<script>
import configuration from '@/administration/configuration.vue';

export default {
  name: 'FormulaireFichiers',
  computed: {
    facturesAffichees() {
      return this.factures;
    },
  },
  props:{
    item:Object
  },
  data() {
    return {
      typeFichier: '',
      ouvertureSelectionFichier: false,
      factures: [],
      nomFichier: '',
    };
  },
  methods: {
    setFacture(e) {
      this.nomFichier = e.currentTarget.getAttribute('data-id');
      this.ouvertureSelectionFichier = true;
    },
    setType(e) {
      let t =  e.currentTarget.value;
      if(t == 'facture') {
        this.initFactures();
      }
      this.typeFichier = t;
      this.ouvertureSelectionFichier = (t == 'cerfa');
    },
    initFactures() {
      let r = [];
      if (!this.item.echeances) {
        return r;
      }
      var numero = this.item.cerfa.numeroExterne;
      r = this.item.echeances.map((c, i) => {
        let m =
            parseFloat(c.montantTotal || 0) - parseFloat(c.montantRegle || 0),
          d = c.dateOuverture,
          ech;
        ech = {
          montant: configuration.data().format_euro.format(m),
          date: new Date(d).toLocaleDateString(),
          id: numero + '_' + i,
        };
        return ech;
      });
      this.factures = r;
    },
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

.detailMaitre {
  width: 90%;
  max-width: content-box;
  border-radius: 5px;
  padding: 10px;
  background: white;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 0.2rem 0.5rem;
  box-shadow: 0px 5px 5px -5px;
}

.detailMaitreMineur {
  width: 90%;
  max-width: content-box;
  border-radius: 5px;
  padding: 10px;
  background: white;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 0.2rem 0.5rem;
  box-shadow: 0px 5px 5px -5px;
}

.etudiantMineur {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.detailMaitreMineur .etudiantMineur div {
  margin: auto;
}

.ligneHorizontaleFormulaire {
  margin: 1em;
  height: 3px;
  background: linear-gradient(#e66465, #9198e5);
  width: 95%;
}

.titreFormulaireFacturier {
  text-align: center;
}

.inputBoxFacturier {
  display: flex;
  flex-direction: column;
  margin-right: auto;
}
ul.factures li {
  display: inline-block;
  background: #95d2f3;
  padding: 3px 6px;
  margin: 3px 5px;
  border-radius: 5px;
}
ul.factures li:hover {
  cursor: pointer;
  background: white;
  color: black;
}
ul.factures li > * {
  display: block;
  font-size: 11px;
}
</style>
