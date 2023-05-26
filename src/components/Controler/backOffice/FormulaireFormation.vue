<template>
  <legend>
    Formulaire Formation (<a
      target="_blank"
      href="https://www.formulaires.service-public.fr/gf/getNotice.do?cerfaNotice=51649&cerfaFormulaire=10103"
      style="font-weight: bold"
      >Aide</a
    >)
  </legend>
  <input type="hidden" name="##base" value="cerfa.formation" />
  <div class="detailFormation">
    <div class="inputBoxFacturier">
      <span class="detailFacturier">RNCP</span>
      <input
        type="text"
        placeholder="obligatoire"
        maxlength="9"
        name="rncp"
        required
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Code du dipl&ocirc;me visé</span>
      <input type="text" name="codeDiplome" maxlength="8" />
    </div>

    <div class="inputBoxFacturier">
      <span class="detailFacturier">Dipl&ocirc;mes de Formation</span>
      <select name="typeDiplome">
        <optgroup label="Dipl&ocirc;me ou titre de niveau bac +5 et plus">
          <option value="80" label="Doctorat"></option>
          <option value="71" label="Master professionnel/DESS"></option>
          <option value="72" label="Master recherche/DEA"></option>
          <option value="73" label="Master indifférencié"></option>
          <option
            value="74"
            label="Dipl&ocirc;me d'ingénieur, dipl&ocirc;me d'école de commerce"
          ></option>
          <option
            value="79"
            label="Autre dipl&ocirc;me ou titre de niveau bac+5 ou plus"
          ></option>
        </optgroup>
        <optgroup label="Dipl&ocirc;me ou titre de niveau bac +3 et 4 ">
          <option value="61" label="1ère année de Master"></option>
          <option value="62" label="Licence professionnelle"></option>
          <option value="63" label="Licence générale"></option>
          <option
            value="69"
            label="Autre dipl&ocirc;me ou titre de niveau bac +3 ou 4"
          ></option>
        </optgroup>
        <optgroup label="Dipl&ocirc;me ou titre de niveau bac +2">
          <option value="54" label="Brevet de Technicien Supérieur"></option>
          <option
            value="55"
            label="Dipl&ocirc;me Universitaire de technologie"
          ></option>
          <option
            value="58"
            label="Autre dipl&ocirc;me ou titre de niveau bac+2"
          ></option>
        </optgroup>
        <optgroup label="Dipl&ocirc;me ou titre de niveau bac">
          <option value="41" label="Baccalauréat professionnel"></option>
          <option value="42" label="Baccalauréat général"></option>
          <option value="43" label="Baccalauréat technologique"></option>
          <option
            value="49"
            label="Autre dipl&ocirc;me ou titre de niveau bac"
          ></option>
        </optgroup>
        <optgroup label="Dipl&ocirc;me ou titre de niveau CAP/BEP">
          <option value="33" label="CAP"></option>
          <option value="34" label="BEP"></option>
          <option value="35" label="Mention complémentaire"></option>
          <option
            value="38"
            label="Autre dipl&ocirc;me ou titre de niveau CAP/BEP"
          ></option>
        </optgroup>
        <optgroup label="Aucun dipl&ocirc;me ni titre">
          <option value="25" label="Dipl&ocirc;me national du Brevet"></option>
          <option value="26" label="Certificat de formation générale"></option>
          <option
            value="13"
            label="Aucun dipl&ocirc;me ni titre professionnel"
          ></option>
        </optgroup>
      </select>
    </div>

    <div class="inputBoxFacturier">
      <span class="detailFacturier">Intitulé précis du dipl&ocirc;me</span>
      <input
        type="text"
        name="intituleQualification"
        minlength="1"
        maxlength="255"
        placeholder="obligatoire"
        required
      />
    </div>

    <div class="inputBoxFacturier">
      <span class="detailFacturier">Date début formation</span>
      <input type="date" name="dateDebutFormation" required />
    </div>

    <div class="inputBoxFacturier">
      <span class="detailFacturier">Date fin formation</span>
      <input type="date" name="dateDebutFormation" required />
    </div>
  </div>
</template>

<script>
import configuration from '@/administration/configuration.vue';

export default {
  name: 'FormulaireFormation',
  props: {},
  data() {
    return {
      listeDepartements: [],
      afficheFormulaireMineur: false,
      afficheMineurNonEmancipe: true,
      afficheErreurs: true,
      messageErreur: '',
      listeGeographie: [],
      tableauRecherche: [],
    };
  },
  methods: {
    SiFormationMineur(event) {
      console.log(event);
      //on recupere la date du jour
      const dateDuJour = Date.now();
      //On recuperer la saisie de l'agent et on soustrait 18 ans
      let dateDeNaissance = document.getElementById(
        'dateNaissanceFormation'
      ).value;
      this.$data.dateNaissance = dateDeNaissance;
      dateDeNaissance = dateDeNaissance.split('-');
      dateDeNaissance = new Date(
        dateDeNaissance[0],
        dateDeNaissance[1] - 1,
        dateDeNaissance[2]
      );
      dateDeNaissance = dateDeNaissance.getTime();
      const dixHuitAnsEnMillisecondes = 567648000000;
      if (dateDuJour - dateDeNaissance < dixHuitAnsEnMillisecondes) {
        //On affiche la partie pour les mineurs du formulaire
        this.$data.afficheFormulaireMineur = true;
        //On passe l'information au composant parent
        this.$emit('afficheMineurNonEmancipe', event);
      } else {
        this.$data.afficheFormulaireMineur = false;
        this.$emit('afficheMajeur', event);
      }
    },
    SiMineurEmancipe(event) {
      if (this.$data.afficheMineurNonEmancipe) {
        this.$data.afficheMineurNonEmancipe = false;
        this.$emit('afficheMineurEmancipe', event);
      } else {
        this.$data.afficheMineurNonEmancipe = true;
        this.$emit('afficheMineurNonEmancipe', event);
      }
    },
    async getListeDepartements() {
      var _this = this;
      return fetch('https://geo.api.gouv.fr/departements')
        .then((response) => response.json())
        .then((data) => {
          _this.listeDepartements = data;
          return data;
        });
    },
    getListeCommunesNaissance() {
      let v;
      if ((v = document.querySelector('#departementsNaissanceListe').value)) {
        d = fetch('https://geo.api.gouv.fr/departements/' + v + '/communes')
          .then((response) => response.json())
          .then((data) => data.forEach((element) => {}));
      }
    },
    rechercheCommunes() {
      return true;
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

.detailFormation {
  width: 100%;
  max-width: content-box;
  border-radius: 5px;
  padding: 10px;
  background: white;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  /*grid-template-columns: repeat(5, 1fr);
        grid-gap: 0.2rem 0.5rem;*/
  box-shadow: 0px 5px 5px -5px;
  justify-content: flex-start;
  align-items: flex-start;
}

.etudiantMineur:last-child {
  max-width: content-box;
  border-radius: 5px;
  padding: 10px;
  background: white;
  display: flex;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0.2rem 0.5rem;
}

.detailFormationMineur .etudiantMineur div {
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
  width: inherit;
  flex-basis: 20%;
  margin-right: 1%;
  margin-top: 1px;
  margin-bottom: 1px;
  margin-left: 1%;
  align-items: flex-start;
  justify-content: center;
}

select {
  width: inherit;
}

option {
  data-width: 100%;
}

.formulaire {
  width: 90%;
}
</style>
