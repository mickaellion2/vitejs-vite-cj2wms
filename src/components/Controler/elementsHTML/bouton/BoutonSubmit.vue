<template>
  <BoutonBase
    :intituleBouton="intitule"
    :evenementBouton="evenement"
    @click.prevent="onSubmit"
  ></BoutonBase>
</template>

<script>
import BoutonBase from '@/components/Controler/elementsHTML/bouton/BoutonBase.vue';
import connexionAPIService from '@/services/connexionAPI.service.vue';
import construitURLService from '@/services/construitURL.service.vue';
import configuration from '@/administration/configuration.vue';

export default {
  name: 'BoutonSubmit',
  components: {
    BoutonBase,
  },
  props: {
    intituleBouton: String,
  },
  data() {
    return {
      intitule: this.intituleBouton || '',
      param: this.nomCollection,
      evenement: 'onEspaceSubmit',
    };
  },
  methods: {
    onSubmit(e) {
      /*if (this.$parent.methods.beforeSubmit) {
        this.$parent.methods.beforeSubmit();
      }*/
      var _this = this;
      let form =
        this.$el.form ||
        document.getElementById(this.$el.getAttribute('data-formid')) ||
        e.currentTarget.closest('form');
      if (form.reportValidity()) {
        let url = form.getAttribute('data-service');
        connexionAPIService.methods.requete(url, form).then((reponse) => {
          if (reponse.code_reponse !== 0) {
            console.log('erreur code reponse');
            _this.$emit('onEspaceSubmitFail', reponse);
          } else {
            //reponse.extra_info
            _this.$emit('onEspaceSubmitSuccess', reponse);
            _this.$el.dispatchEvent(
              new CustomEvent('onEspaceSubmitSuccessB', {
                detail: { reponse: reponse },
                bubbles: true,
                composed: true,
              })
            );
          }
        });
      }
    },
  },
};
</script>
