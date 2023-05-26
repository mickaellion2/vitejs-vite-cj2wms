<template>
  <legend>Envoi de facture</legend>
  <input type="hidden" name="##commande" value="facture" />
  <input type="hidden" name="##base" :value="baseFacture()" />
  <input type="hidden" name="#opco" :value="item.opco" />
  <div class="detailFacture">
    <div>
      <div>
        <span class="detailFacturier"> </span>
        <input type="file" name="#datafichier" required />
      </div>
      <div>
        Montant total :
        <input
          class="disabled"
          type="text"
          name="montantTotal"
          :value="montantTotal()"
        />
      </div>
      <div>
        Date :
        <input
          class="disabled"
          type="text"
          name="dateEmission"
          :value="aujourdhui()"
        />
      </div>
      <div>IBAN : <input required type="text" name="ibanEmetteur" :value="config.iban_default || ''" /></div>
      <div>
        SIRET : <input type="text" name="siretEmetteur" :value="siret()" />
      </div>
      <div>
        N° facture (automatique si vide) : <input type="text" name="numero" />
      </div>
      <div>
        Certif r&eacute;alisation :
        <input type="checkbox" name="estCertificatRealisation" />
      </div>

      <!--PLACEHOLDER : Ajouter le PDF Certification Réalisation si la checkbox est cochée-->


      <div>
        Ech&eacute;ances(s) concern&eacute;e(s) :
        <ol class="conteneurEcheances">
          <li v-for="(echeance, i) in echeances()">
            Ech&eacute;ance {{ i + 1 }}:
            <input
              class="disabled"
              type="text"
              :name="'lignes.' + i + '.montant'"
              :value="_resteAPayer(echeance)"
            />
            <select :name="'lignes.' + i + '.natureLigne'" value="PEDAGOGIE">
              <option value="0">Choisir</option>
              <option value="PEDAGOGIE">PEDAGOGIE</option>
              <option value="PEDAGOGIE">PREMIEREQUIPEMENT</option>
            </select>
            quantit&eacute; :
            <input
              type="number"
              :name="'lignes.' + i + '.quantite'"
              value="1.0"
              class="disabled"
            />
            <input
              type="hidden"
              :name="'lignes.' + i + '.numeroEcheance'"
              :value="echeance.numero"
            />
            <input
              type="hidden"
              :name="'lignes.' + i + '.codificationEcheance'"
              :value="echeance.codification"
            />
            <input
              type="hidden"
              :name="'lignes.' + i + '.numeroDeca'"
              :value="item.cerfa.numeroDeca"
            />
            <input
              type="hidden"
              :name="'lignes.' + i + '.numeroDossier'"
              :value="item.cerfa.numeroExterne"
            />
          </li>
        </ol>
      </div>
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
  name: 'FormulaireFacture',
  computed: {
    config() {
      let c = {};
      this.configs.forEach((_c)=> {
        c[_c.nom] = _c.valeur;
      }, c);
      return c;
    }
  },
  props: {
    item: Object,
    param: String,
    configs:Array
  },
  data() {
    return {
      typeFichier: '',
      ouvertureSelectionFichier: false,
      factures: [],
      nomFichier: ''
    };
  },
  mounted() {},
  methods: {
    baseFacture() {
      let num = 0;
      if (this.item.PPPfactures) {
        r = this.item.PPPfactures.length;
      }
      return 'PPPfactures.' + num + '.facture';
    },
    echeances() {
      let indices = (this.param || '').split(','),
        echeances = this.item.echeances,
        r;
      r = indices.map((i) => {
        return echeances[i];
      });
      return r;
    },
    siret() {
      let echeances = this.echeances(),
        r;
      r = echeances[0].siretCfa;
      return r;
    },
    aujourdhui() {
      let r = new Date().toISOString();
      return r;
    },
    montantTotal() {
      let echeances = this.echeances();
      var _this = this;
      let r = echeances.reduce(function (a, c) {
        return a + _this._resteAPayer(c, true);
      }, 0);
      return r.toFixed(2);
    },
    _resteAPayer(echeance, nombre = false) {
      let r =
        parseFloat(echeance.montantTotal || 0) -
        parseFloat(echeance.montantRegle || 0);
      return nombre ? r : r.toFixed(2);
    },
  },
};
</script>

<style scoped></style>
