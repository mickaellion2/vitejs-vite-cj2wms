<template>
  <span
    
    v-for="(echeance, index) in item.echeances"
    :data-param="index"
  >
    <span v-if="!echeance.estMasque" :class="'editable echeance echeance-' + etatEcheance(echeance)"> {{ _resteAPayer(echeance) }} </span>
  </span>
</template>

<script>
const ECHEANCE_ETAT_INIT = 'initial';
const ECHEANCE_ETAT_REGLE = 'regle';
const ECHEANCE_ETAT_RETARD = 'retard';
const ECHEANCE_ETAT_ENCOURS = 'en_cours';
const ECHEANCE_DELAI_JOURS_PAIEMENT = 3;

export default {
  name: 'Echeancier',
  props: {
    item: Object,
  },
  methods: {
    _resteAPayer(echeance, nombre = false) {
      let r =
        parseFloat(echeance.montantTotal || 0) -
        parseFloat(echeance.montantRegle || 0);
      return nombre ? r : r.toFixed(2);
    },
    etatEcheance(echeance) {
      let r = this._resteAPayer(echeance),
        d = echeance.dateOuverture,
        dt = new Date(d);
      if (r == 0) {
        return ECHEANCE_ETAT_REGLE;
      }
      if (dt.getTime() > Date.now) {
        return ECHEANCE_ETAT_INIT;
      }
      if (
        dt.getTime() + ECHEANCE_DELAI_JOURS_PAIEMENT * 86400000 <
        Date.now()
      ) {
        return ECHEANCE_ETAT_RETARD;
      }
      return ECHEANCE_ETAT_ENCOURS;
    },
  },
};
</script>
