<template>
  <legend>
    Formulaire Contrat (<a
      target="_blank"
      href="https://www.formulaires.service-public.fr/gf/getNotice.do?cerfaNotice=51649&cerfaFormulaire=10103"
      style="font-weight: bold"
      >Aide</a
    >)
  </legend>
  <input type="hidden" name="##base" value="cerfa.contrat" />
  <div class="detailContrat">
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Mode contractuel</span>
      <select name="modeContractuel" required>
        <option value="1" label="à durée limitée"></option>
        <option value="2" label="dans le cadre d’un CDI"></option>
        <option value="3" label="entreprise de travail temporaire"></option>
        <option
          value="4"
          label="activités saisonnières à deux employeurs"
        ></option>
      </select>
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Type de contrat</span>
      <select name="typeContratApp" @change="this.SiContratPrecedent" required>
        <optgroup label="Contrat initial">
          <option
            value="11"
            label="Premier contrat d’apprentissage de l’apprenti"
          ></option>
        </optgroup>
        <optgroup label="Succession de contrats">
          <option
            value="21"
            label="Nouveau contrat avec un apprenti qui a terminé son précédent contrat auprès d’un même employeur"
          ></option>
          <option
            value="22"
            label="Nouveau contrat avec un apprenti qui a terminé son précédent contrat auprès d’un autre employeur"
          ></option>
          <option
            value="23"
            label="Nouveau contrat avec un apprenti dont le précédent contrat auprès d’un autre employeur a été rompu"
          ></option>
        </optgroup>
        <optgroup label="Avenant : modification des conditions du contrat">
          <option
            value="31"
            label="Modification de la situation juridique de l’employeur"
          ></option>
          <option
            value="32"
            label="Changement d’employeur dans le cadre d’un contrat saisonnier"
          ></option>
          <option
            value="33"
            label="Prolongation du contrat suite à un échec à l’examen de l’apprenti"
          ></option>
          <option
            value="34"
            label="Prolongation du contrat suite à la reconnaissance de l’apprenti comme travailleur handicap"
          ></option>
          <option
            value="35"
            label="Modification du diplôme préparé par l’apprenti"
          ></option>
          <option
            value="36"
            label="Autres changements : changement de maître d’apprentissage, de durée de travail hebdomadaire, réduction de durée, etc"
          ></option>
          <option
            value="37"
            label="Modification du lieu d’exécution du contrat"
          ></option>
        </optgroup>
      </select>
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Type de dérogation</span>

      <select name="typeDerogation">
        <option
          value="11"
          label="Age de l’apprenti inférieur à 16 ans"
        ></option>
        <option
          value="12"
          label="Age supérieur à 29 ans : cas spécifiques prévus dans le code du travail"
        ></option>
        <option
          value="21"
          label="Réduction de la durée du contrat ou de la période d’apprentissage"
        ></option>
        <option
          value="22"
          label="Allongement de la durée du contrat ou de la période d’apprentissage"
        ></option>
        <option value="50" label="Cumul de dérogations"></option>
        <option value="60" label="Autre dérogation"></option>
      </select>
    </div>
    <div class="inputBoxFacturier">
      <div v-if="afficheContratPrecedent == true">
        <span class="detailFacturier">Numéro de contrat préc.</span>
        <input
          id="numero_contrat_precedent"
          type="text"
          name="numeroContratPrecedent"
          required
        />
      </div>
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Date de conclusion</span>
      <input
        id="dateNaissanceContrat"
        type="date"
        name="dateConclusion"
        @change="this.verificationDates"
        required
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Date de début d’exécution</span>
      <input
        id="dateNaissanceContrat"
        type="date"
        name="dateDebutContrat"
        @change="this.verificationDates"
        required
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Date de fin de contrat</span>
      <input
        id="dateNaissanceContrat"
        type="date"
        name="dateFinContrat"
        @change="this.verificationDates"
        required
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Durée hebdo. de travail (h)</span>
      <input
        id="dateNaissanceContrat"
        type="text"
        name="dureeTravailHebdoHeures"
        required
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Durée hebdo. de travail (min)</span>
      <input
        id="dateNaissanceContrat"
        type="text"
        name="dureeTravailHebdoMinutes"
        
      />
    </div>

    <div class="inputBoxFacturier" style="display: flex; flex-direction: row">
      <span class="detailFacturier">Travail sur machines dangereuses</span>
      <input type="checkbox" name="travailRisque" />
    </div>

    <div class="inputBoxFacturier">
      <span class="detailFacturier">Salaire brut à l'embauche</span>
      <input
        id="dateNaissanceContrat"
        type="text"
        name="salaireEmbauche"
        required
      />
    </div>

    <div v-if="afficheFormulaireAvenant == true" class="etudiantAvenant">
      <div class="inputBoxFacturier">
        <span class="detailFacturier">Date d'effet de l'avenant</span>
        <input
          type="date"
          value="dateEffetAvenant"
          @change="this.SiContratAvenant"
        />
      </div>
    </div>

    <div class="inputBoxFacturier">
      <span class="detailFacturier"></span>
    </div>

    <div class="inputBoxFacturier">
      <span class="detailFacturier"></span>
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier"></span>
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier"></span>
    </div>

    <div class="inputBoxFacturier">
      <span class="detailFacturier">Date de début année 1</span>
      <input
        id="dateNaissanceContrat"
        type="date"
        name="remunerationsAnnuelles[0].dateDebut"
        @input="this.SiContratAvenant"
        required
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Date de fin année 1</span>
      <input
        id="dateNaissanceContrat"
        type="date"
        name="remunerationsAnnuelles[0].dateFin"
        @input="this.SiContratAvenant"
        required
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Pourcentage année 1</span>
      <input
        type="number"
        name="remunerationsAnnuelles[0].taux"
        min="0"
        max=" 100"
        step="1"
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Type de salaire</span>
      <select name="remunerationsAnnuelles[0].typeSalaire">
        <option
          value="SMIC"
          label="SMIC : salaire minimum de croissance"
        ></option>
        <option
          value="SMC"
          label="SMC : salaire minimum conventionnel"
        ></option>
      </select>
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Ordre des rémunérations ann.</span>
      <input
        type="text"
        name="remunerationsAnnuelles[0].ordre"
        placeholder="1.1 ou 1.2 ou 2.1, etc"
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Date de début année 2</span>
      <input
        id="dateNaissanceContrat"
        type="date"
        name="remunerationsAnnuelles[1].dateDebut"
        @input="this.SiContratAvenant"
        
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Date de fin année 2</span>
      <input
        id="dateNaissanceContrat"
        type="date"
        name="remunerationsAnnuelles[1].dateFin"
        @input="this.SiContratAvenant"
        
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Pourcentage année 2</span>
      <input
        type="number"
        name="remunerationsAnnuelles[1].taux"
        min="0"
        max=" 100"
        step="1"
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Type de salaire</span>
      <select name="remunerationsAnnuelles[1].typeSalaire">
        <option
          value="SMIC"
          label="SMIC : salaire minimum de croissance"
        ></option>
        <option
          value="SMC"
          label="SMC : salaire minimum conventionnel"
        ></option>
      </select>
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Ordre des rémunérations ann.</span>
      <input
        type="text"
        name="remunerationsAnnuelles[1].ordre"
        placeholder="1.1 ou 1.2 ou 2.1, etc"
      />
    </div>

    <div class="inputBoxFacturier">
      <span class="detailFacturier">Date de début année 3</span>
      <input
        id="dateNaissanceContrat"
        type="date"
        name="remunerationsAnnuelles[2].dateDebut"
        @input="this.SiContratAvenant"
        
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Date de fin année 3</span>
      <input
        id="dateNaissanceContrat"
        type="date"
        name="remunerationsAnnuelles[2].dateFin"
        @input="this.SiContratAvenant"
        
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Pourcentage année 3</span>
      <input
        type="number"
        name="remunerationsAnnuelles[2].taux"
        min="0"
        max=" 100"
        step="1"
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Type de salaire</span>
      <select name="remunerationsAnnuelles[2].typeSalaire">
        <option
          value="SMIC"
          label="SMIC : salaire minimum de croissance"
        ></option>
        <option
          value="SMC"
          label="SMC : salaire minimum conventionnel"
        ></option>
      </select>
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Ordre des rémunérations ann.</span>
      <input
        type="text"
        name="remunerationsAnnuelles[2].ordre"
        placeholder="1.1 ou 1.2 ou 2.1, etc"
      />
    </div>

    <div class="inputBoxFacturier">
      <span class="detailFacturier">Date de début année 4</span>
      <input
        id="dateNaissanceContrat"
        type="date"
        name="remunerationsAnnuelles[3].dateDebut"
        @input="this.SiContratAvenant"
        
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Date de fin année 4</span>
      <input
        id="dateNaissanceContrat"
        type="date"
        name="remunerationsAnnuelles[3].dateFin"
        @input="this.SiContratAvenant"
        
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Pourcentage année 4</span>
      <input
        type="number"
        name="remunerationsAnnuelles[3].taux"
        min="0"
        max=" 100"
        step="1"
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Type de salaire</span>
      <select name="remunerationsAnnuelles[3].typeSalaire">
        <option
          value="SMIC"
          label="SMIC : salaire minimum de croissance"
        ></option>
        <option
          value="SMC"
          label="SMC : salaire minimum conventionnel"
        ></option>
      </select>
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Ordre des rémunérations ann.</span>
      <input
        type="text"
        name="remunerationsAnnuelles[3].ordre"
        placeholder="1.1 ou 1.2 ou 2.1, etc"
      />
    </div>

    <div class="inputBoxFacturier">
      <span class="detailFacturier">Date de début année 5</span>
      <input
        id="dateNaissanceContrat"
        type="date"
        name="remunerationsAnnuelles[4].dateDebut"
        @input="this.SiContratAvenant"
        
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Date de fin année 5</span>
      <input
        id="dateNaissanceContrat"
        type="date"
        name="remunerationsAnnuelles[4].dateFin"
        @input="this.SiContratAvenant"
        
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Pourcentage année 5</span>
      <input
        type="number"
        name="remunerationsAnnuelles[4].taux"
        min="0"
        max=" 100"
        step="1"
      />
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Type de salaire</span>
      <select name="remunerationsAnnuelles[4].typeSalaire">
        <option
          value="SMIC"
          label="SMIC : salaire minimum de croissance"
        ></option>
        <option
          value="SMC"
          label="SMC : salaire minimum conventionnel"
        ></option>
      </select>
    </div>
    <div class="inputBoxFacturier">
      <span class="detailFacturier">Ordre des rémunérations ann.</span>
      <input
        type="text"
        name="remunerationsAnnuelles[4].ordre"
        placeholder="1.1 ou 1.2 ou 2.1, etc"
      />
    </div>
  </div>
  <div class="detailContratAvenant"></div>
</template>

<script>
export default {
  name: 'formulaireContrat',
  data() {
    return {
      afficheFormulaireAvenant: false,
      afficheContratPrecedent: true,
      afficheErreurs: false,
      messageErreur: '',
      remunerationsAnnuelles: [
        {
          dateDebut: '',
          dateFin: '',
          taux: 0,
          typeSalaire: '',
          ordre: '',
        },
        {
          dateDebut: '',
          dateFin: '',
          taux: 0,
          typeSalaire: '',
          ordre: '',
        },
        {
          dateDebut: '',
          dateFin: '',
          taux: 0,
          typeSalaire: '',
          ordre: '',
        },
        {
          dateDebut: '',
          dateFin: '',
          taux: 0,
          typeSalaire: '',
          ordre: '',
        },
        {
          dateDebut: '',
          dateFin: '',
          taux: 0,
          typeSalaire: '',
          ordre: '',
        },
      ],
    };
  },
  methods: {
    verificationDates() {
      //Condition de validation de la donnée (cf. https://www.cfadock.fr/portail_developpeur#/tabs/null)
      const dateValiditeCFA = new Date('2020-01-01').toString();
      //on recupere la date du jour
      const dateDuJour = Date.now();
      let dateSignatureContrat = this.$data.date_conclusion;
      let dateDebutContrat = this.$data.date_debut_execution_contrat;
      let dateFinContrat = this.$data.date_fin_contrat;

      /*console.log("Date de signature du contrat : " +dateSignatureContrat);
            console.log("Date de début du contrat : " + dateDebutContrat);
            console.log("Date de fin du contrat : " + dateFinContrat);*/
      let messageErreur = ''; //Le rapport d'erreur est contruit ici
      let booleenErreur = false; //Si il y a une erreur, le booleen passera à true
      if (dateSignatureContrat > dateDuJour && dateSignatureContrat != '') {
        booleenErreur = true;
        messageErreur +=
          'La date de signature du contrat est supérieure à la date du jour !! (è.é)\n\n';
      }

      if (
        dateSignatureContrat > dateDebutContrat &&
        dateSignatureContrat != '' &&
        dateDebutContrat != ''
      ) {
        booleenErreur = true;
        messageErreur +=
          'La date de signature du contrat est supérieure à la date de début du contrat !! (è.é)\n\n';
      }

      if (
        dateSignatureContrat < dateValiditeCFA &&
        dateSignatureContrat != ''
      ) {
        booleenErreur = true;
        messageErreur +=
          'La date de conclusion est antérieure au 1er janvier 2020 !! (è.é)\n\n';
      }

      if (
        dateFinContrat <= dateDebutContrat &&
        dateFinContrat != '' &&
        dateDebutContrat != ''
      ) {
        booleenErreur = true;
        messageErreur +=
          'La date de fin du contrat est antérieure à celle du début !! (è.é)\n\n';
      }

      if (booleenErreur) {
        //traitement en cas d'erreur
        this.$data.afficheErreurs = true;
        this.$data.messageErreur = messageErreur;
      }
    },
    SiContratPrecedent(event) {
      console.log(
        'Date de conclusion du contrat : ' + this.$data.type_de_contrat
      );
      if (this.$data.type_de_contrat == 11) {
        this.$data.afficheContratPrecedent = false;
      } else {
        this.$data.afficheContratPrecedent = true;
      }
      this.$emit('afficheContratPrecedent', event);
    },
    SiContratAvenant(event) {
      console.log(
        'Date de conclusion du contrat : ' + this.$data.type_de_contrat
      );
      let type_contrat = this.$data.type_de_contrat;
      if (
        type_contrat == 11 ||
        type_contrat == 21 ||
        type_contrat == 22 ||
        type_contrat == 23
      ) {
        this.$data.afficheFormulaireAvenant = false;
      } else {
        this.$data.afficheFormulaireAvenant = true;
      }
      this.$emit('afficheFormulaireAvenant', event);
    },
    async effacerFormulaire() {
      for (let valeur of document.getElementsByClassName('detailContrat')[0]
        .children) {
        /*console.log(valeur.lastChild.value);*/
        valeur.lastChild.value = '';
      }
    },
    dateSuperieurA(a, b) {
      let res;
      if (a != undefined) {
        if (typeof this.$data.remunerationsAnnuelles != undefined) {
          return a > this.$data.remunerationsAnnuelles[b - 1].dateFin;
        } else {
          return false;
        }
      } else {
        return false;
      }

      return a > this.$data.remunerationsAnnuelles[b - 1].dateFin;
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

.detailContrat {
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
  display: grid;
  grid-template-columns: repeat(5, 19%);
  grid-gap: 0.2rem 0.5rem;
}

.etudiantAvenant {
}

.etudiantAvenant:last-child {
  max-width: content-box;
  border-radius: 5px;
  padding: 10px;
  background: white;
  display: flex;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0.2rem 0.5rem;
}

.detailContratAvenant .etudiantAvenant div {
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
  flex-basis: 17%;
  margin-right: 1%;
  margin-top: 1px;
  margin-bottom: 1px;
  margin-left: 1%;
  align-items: stretch;
  justify-content: center;
}

/*.detailContrat div:last-child{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    }*/

select {
  width: 50%;
}

.erreur {
  color: red;
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
