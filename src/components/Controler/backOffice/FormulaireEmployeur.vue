<template>
  <legend>
    Formulaire Employeur (<a
      target="_blank"
      href="https://www.formulaires.service-public.fr/gf/getNotice.do?cerfaNotice=51649&cerfaFormulaire=10103"
      style="font-weight: bold"
      >Aide</a
    >)
  </legend>
  <input type="hidden" name="##base" value="cerfa.employeur" />
  <div class="detailEmployeur">
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Nom établissement</span>
      <input type="text" name="denomination" maxlength="80" />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Numéro SIRET</span>
      <input
        id="inputSiret"
        type="text"
        name="siret"
        pattern="^([0-9]{14}|[0-9]{9} [0-9]{4})$"
        @change="validationSiret()"
        placeholder="obligatoire"
        required
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Code NAF</span>
      <input type="text" name="naf" maxlength="6" />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Effectif</span>
      <input
        id="inputEffectif"
        type="number"
        min="0"
        name="nombreDeSalaries"
        required
      />
    </div>

    <div class="inputBoxFacturier">
      <span class="detailFacturier">Code IDCC</span>
      <input type="text" name="codeIdcc" maxlength="4" />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Convention collective</span>
      <input type="text" name="libelleIdcc" maxlength="500" />
    </div>

    <div class="inputBoxFacturier">
      <span class="detailFacturier">Téléphone</span>
      <input
        type="tel"
        pattern="^((\+)33|0)[1-9](\d{2}){4}$"
        name="telephone"
        placeholder="obligatoire"
        minlength="1"
        maxlength="13"
        required
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Courriel</span>
      <input
        type="email"
        name="courriel"
        placeholder="obligatoire"
        minlength="1"
        maxlength="80"
        required
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Adresse</span>
      <input
        type="text"
        name="adresse.adresse1"
        maxlength="50"
        placeholder="obligatoire"
        required
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Complément d'adresse</span>
      <input type="text" name="adresse.adresse2" maxlength="155" />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Code postal</span>
      <input
        type="text"
        name="adresse.code_postal"
        placeholder="obligatoire"
        minlength="5"
        maxlength="5"
        required
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Commune</span>
      <input
        type="text"
        name="adresse.commune"
        placeholder="obligatoire"
        minlength="1"
        maxlength="80"
        required
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Nom du contact</span>
      <input
        type="text"
        name="nom"
        minlength="1"
        maxlength="50"
        placeholder="obligatoire"
        required
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Prénom du contact</span>
      <input
        type="text"
        name="prenom"
        minlength="1"
        maxlength="50"
        placeholder="obligatoire"
        required
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Type d'employeur</span>
      <select name="typeEmployeur" @input="this.isEmployeurPublic" required>
        <optgroup label="Privé">
          <option
            value="11"
            label="Entreprise inscrite au répertoire des métiers ou au registre des entreprises pour l’Alsace-Moselle"
          ></option>
          <option
            value="12"
            label="Entreprise inscrite uniquement au registre du commerce et des sociétés"
          ></option>
          <option
            value="13"
            label="Entreprises dont les salariés relèvent de la mutualité sociale agricole"
          ></option>
          <option value="14" label="Profession libérale"></option>
          <option value="15" label="Association"></option>
          <option value="16" label="Autre employeur privé"></option>
        </optgroup>
        <optgroup label="Public">
          <option
            value="21"
            label="Service de l’Etat (administrations centrales et leurs services déconcentrés de la fonction publique d’Etat)"
          ></option>
          <option value="22" label="Commune"></option>
          <option value="23" label="Département"></option>
          <option value="24" label="Région"></option>
          <option value="25" label="Etablissement public hospitalier"></option>
          <option
            value="26"
            label="Etablissement public local d’enseignement"
          ></option>
          <option
            value="27"
            label="Etablissement public administratif de l’Etat"
          ></option>
          <option
            value="28"
            label="Etablissement public administratif local(y compris établissement public de coopération intercommunale EPCI)"
          ></option>
          <option value="29" label="Autre employeur public"></option>
        </optgroup>
      </select>
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Employeur spécifique</span>
      <select name="employeurSpecifique">
        <option value="1" label="Entreprise de travail temporaire"></option>
        <option value="2" label="Groupement d’employeurs"></option>
        <option value="3" label="Employeur saisonnier"></option>
        <option
          value="4"
          label="Apprentissage familial : l’employeur est un ascendant de l’employeur"
        ></option>
        <option value="0" label="Aucun de ces cas"></option>
      </select>
    </div>

    <div class="inputBoxFacturier">
      <div class="inputBoxFacturier">
        <span class="detailFacturier">Employeur Public</span>
        <input
          id="employeurPublic"
          @input="this.afficherSiEmployeurPublic"
          type="checkbox"
          name="employeur_public"
          required
          readonly
        />
      </div>
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Caisse de retraite complémentaire</span>
      <input
        type="text"
        name="caisseComplementaire"
        maxlength="80"
        placeholder="obligatoire"
        required
      />
    </div>
    <div v-if="afficheEmployeurPublic == true">
      <div class="inputBoxFacturier">
        <span class="detailFacturier"
          >Adhésion de l'employeur au régime spécifique d'assurance
          chômage</span
        >
        <input type="checkbox" name="regimeSpecifique" />
      </div>
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">
        Atteste de l'éligibilité du tuteur / maître d'apprentissage</span
      >
      <input type="checkbox" name="attestationEligibilite" required />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier"
        >Atteste de disposer des pièces justificatives</span
      >
      <input type="checkbox" name="attestationPieces" required />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormulaireEmployeur',
  methods: {
    afficherSiEmployeurPublic(event) {
      if (this.$data.afficheEmployeurPublic) {
        this.$data.afficheEmployeurPublic = false;
        //this.$emit('afficheMineurEmancipe', event);
      } else {
        this.$data.afficheEmployeurPublic = true;
        this.$emit('afficheEmployeurPublic', event);
      }
    },
    isEmployeurPublic() {
      let employeur = this.$data.type_employeur;
      if (employeur >= 20) {
        document.getElementById('employeurPublic').checked;
      } else {
        document.getElementById('employeurPublic').removeAttribute('checked');
      }
    },
    validationSiret() {
      let regex = /^[0-9]{14}$/;
      let argument = document.getElementById('inputSiret').value;
      if (regex.test(argument)) {
        console.log('siret validé');
      } else {
        console.log("Le format du siret n'est pas bon");
      }
    },
    validationEffectif() {
      let argument = document.getElementById('inputEffectif');
      if (argument.value >= 0) {
        console.log('Effectif validé');
      } else {
        console.log("Le format de l'effectif n'est pas bon");
      }
    },
    validationEmail() {
      let argument = document.getElementById('inputEmail').value;
      if (argument) {
        console.log('Email validé');
      } else {
        console.log("Le format de l'email n'est pas bon");
      }
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

.detailEmployeur {
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

.detailEmployeurMineur {
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

.detailEmployeurMineur .etudiantMineur div {
  margin: auto;
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

#formulaire {
  width: 90%;
}
</style>

/* A faire : -formater l'effectif -formater l'email -formater le type
d'employeur -formater l'employeur spécifique -formater le code NAF -formater le
code IDCC -formater la convention collective -formater l'employeur public
-formater l'adhésion de l'employeur au régime spécifique d'assurance chômage
-rajouter si les mentions sont obligatoires */ Suggestions : -prévoir d'utiliser
une API pour rentrer des données géographiques -prévoir d'utiliser une API pour
rentrer des données d'entreprise -faire une validation des données afin de
vérifier quelles sont bien dans le bon format */
