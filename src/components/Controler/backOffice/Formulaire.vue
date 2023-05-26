<template>
  <div style="z-index: 10; position: relative">
    <BoutonBase
      class="boutonBaseAnnuler"
      intituleBouton="annuler"
      @click="this.$parent.resetSelection()"
    ></BoutonBase>
  </div>
  <form :data-service="action" class="formulaireAjoutFacturier">
    <input type="hidden" name="##id" value="" />

    <fieldset>
      <keep-alive>
        <component
          :is="nomComposant"
          :conteneurFormulaire="conteneurFormulaire"
          :item="item"
          :param="param"
          :configs="configs"
        ></component>
      </keep-alive>
    </fieldset>

    <div>
      <BoutonSubmit class="BoutonBaseRecherche"></BoutonSubmit>
      <div v-if="afficheErreurs" class="erreur">
        <p>{{ messageErreur }}</p>
      </div>
    </div>
  </form>
</template>

<script>
import BoutonBase from '@/components/Controler/elementsHTML/bouton/BoutonBase.vue';
import BoutonSubmit from '@/components/Controler/elementsHTML/bouton/BoutonSubmit.vue';
import construitURLService from '@/services/construitURL.service.vue';
import configuration from '@/administration/configuration.vue';

import FormulaireApprenti from '@/components/Controler/backOffice/FormulaireApprenti.vue';
import FormulaireOpco from '@/components/Controler/backOffice/FormulaireOpco.vue';
import FormulaireEmployeur from '@/components/Controler/backOffice/FormulaireEmployeur.vue';
import FormulaireMaitre from '@/components/Controler/backOffice/FormulaireMaitre.vue';
import FormulaireContrat from '@/components/Controler/backOffice/FormulaireContrat.vue';
import FormulaireFormation from '@/components/Controler/backOffice/FormulaireFormation.vue';
import FormulaireEtat from '@/components/Controler/backOffice/FormulaireEtat.vue';
import FormulaireFichiers from '@/components/Controler/backOffice/FormulaireFichiers.vue';
import FormulaireFacture from '@/components/Controler/backOffice/FormulaireFacture.vue';
import FormulaireCorbeille from '@/components/Controler/backOffice/FormulaireCorbeille.vue';
import FormulaireProfil from '@/components/Controler/backOffice/FormulaireProfil.vue';

export default {
  name: 'Formulaire',
  components: {
    BoutonBase,
    BoutonSubmit,
    FormulaireEmployeur,
    FormulaireMaitre,
    FormulaireContrat,
    FormulaireOpco,
    FormulaireApprenti,
    FormulaireCorbeille,
    FormulaireFormation,
    FormulaireFacture,
    FormulaireEtat,
    FormulaireFichiers,
    FormulaireProfil,
  },

  props: {
    nomComposant: String,
    conteneurFormulaire: Object,
    item: Object,
    param: String,
    table: String,
    configs: Array,
  },
  data() {
    return {
      nomTable: this.table || 'dossier',
      action: construitURLService.methods.construitURLConnectionBack(
        this.nomTable,
        configuration.data().urlPossibles.modifier
      ),
      erreur: '',
    };
  },
  mounted() {
    /*this.$el.parentNode.addEventListener(
      'onEspaceSubmitSuccessB',
      this.onSubmit.bind(this)
    );
    this.$nextTick(() => {
      this.init();
    });*/
  },
  methods: {
    init() {
      let obj = this.item || {},
        form = this.$el.parentNode.querySelector('form'),
        _id_ = this.item._id,
        base = form.elements['##base'].value;
      form.elements['##id'].value = typeof _id_ == 'string' ? _id_ : _id_.$oid;
      if (obj) {
        for (let inputElt of form.elements) {
          if (inputElt.type == 'hidden' || inputElt.value != '') {
            continue;
          }
          let prop = inputElt.name;
          if (prop) {
            let v = configuration.methods.obtientValeurPropriete(
              prop,
              obj,
              base
            );
            if (inputElt.type == 'checkbox') {
              inputElt.checked = v == 1 || v == 'true';
            } else {
              inputElt.value = v;
            }
          }
        }
      }
    },
  },
};
</script>
<style>
form input,
form select {
  max-width: 200px;
}
</style>

<style scoped></style>
