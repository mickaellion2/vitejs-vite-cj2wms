<template>
  <div class="analyse">
    <fenetre-montant
      class="fenetreMontant"
      v-bind:montant="this.montantWidget.total"
    ></fenetre-montant>
    <fenetre-montant
      class="fenetreMontant masque"
      v-bind:montant="this.montantWidget.nMoins1"
    ></fenetre-montant>
    <fenetre-montant
      class="fenetreMontant masque"
      v-bind:montant="this.montantWidget.n"
    ></fenetre-montant>
    <fenetre-montant
      class="fenetreMontant masque"
      v-bind:montant="this.montantWidget.nMoins1"
    ></fenetre-montant>
    <fenetre-montant
      class="fenetreMontant masque"
      v-bind:montant="this.montantWidget.n"
    ></fenetre-montant>
  </div>
  <div id="legende">Placeholder : Legende des couleurs du facturier</div>
  <TableauFacture :montantWidget="montantWidget"></TableauFacture>
</template>

<script>
import fenetreMontant from '@/components/Controler/elementsHTML/widget/fenetreMontant.vue';
import TableauFacture from '@/components/Controler/elementsHTML/tableaux/TableauFacture.vue';

export default {
  name: 'corpsFacturier',
  components: {
    fenetreMontant,
    TableauFacture
  },
  props: {
    montantWidget: Object,
  },
};
</script>

<style scoped>
.analyse {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 2rem;
  background: var(--mauve-clair);
  padding: 0.6rem 1rem;
}
#legende {
  text-align: center;
  background: var(--mauve-clair);
  padding: 0.6rem 1rem;
}

.fenetreMontant {
  box-shadow: 0px 5px 5px -5px;
}
.hidden {
  display: none !important;
}
.masque {
  visibility: hidden !important;
}
</style>
