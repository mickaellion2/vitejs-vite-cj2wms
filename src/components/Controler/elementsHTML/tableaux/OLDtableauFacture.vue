<template>
  <Formulaire
    :nomComposant="etatFormulaire"
    v-if="!!etatFormulaire"
  >
  </Formulaire>
  <table id="tablefacturier" @click="editFacturier">
    <thead id="theadTableauFacturier">
      <tr>
        <th>Suppr</th>
        <th>Fichiers</th>
        <th class="numero">
          <form id="formcreadossier" @click="creerDossier">
            <input type="hidden" name="datemaj" value="" />
            <input type="hidden" name="cerfa.etat" value="0" />
            <div class="boutonCreationDossier">
              <span class="iconeAjout"
                ><font-awesome-icon icon="fa-person-circle-plus"
              /></span>
              <span>Nouveau dossier</span>
            </div>
          </form>
        </th>
        <th data-form="FormulaireApprenti"><span>Apprenti</span></th>
        <th data-prop="cerfa.formation.intituleQualification">
          <span>Formation</span>
        </th>
        <th data-prop="cerfa.employeur.denomination"><span>Employeur</span></th>
        <th data-prop="cerfa.maitre1.nom"><span>Ma&icirc;tre(s)</span></th>
        <th data-prop="cerfa.contrat.dateDebutContrat"><span>Contrat</span></th>
        <th data-prop="opco"><span>OPCO</span></th>
        <th>Reste</th>
        <th>Factures</th>
        <th data-prop="cerfa.etat"><span>&Eacute;tat</span></th>
      </tr>
    </thead>

    <tbody id="lignesDuFacturier">
      <tr
        v-for="(item, index) in itemsAffiches"
        :data-num="items.indexOf(item)"
      >
        <td class="editable" style="text-align: center" data-prop="corbeille">
          <span>
            <font-awesome-icon
              class="fontIcone"
              icon="fa-solid fa-trash"
              @click="$emit(this.evenement)"
            />
          </span>
        </td>
        <td class="editable" data-prop="fichiers">
          <font-awesome-icon class="fontIcone" icon="fa-file-circle-plus" />
        </td>
        <td class="numero">
          {{ numeroAffiche(item) }}
        </td>
        <td class="editable" data-prop="cerfa.apprenti">
          <span v-if="item.cerfa.apprenti">{{ nomAffiche(item) }} </span>
          <font-awesome-icon
            v-else
            @click="$emit(this.evenement)"
            class="fontIcone"
            icon="fa-file-circle-plus"
          />
        </td>
        <td class="editable" data-prop="cerfa.formation">
          <span v-if="item.cerfa.formation"
            >{{ item.cerfa.formation.intituleQualification }}
          </span>
          <font-awesome-icon
            v-else
            @click="$emit(this.evenement)"
            class="fontIcone"
            icon="fa-file-circle-plus"
          />
        </td>
        <td class="editable" data-prop="cerfa.employeur">
          <span v-if="item.cerfa.employeur">{{
            item.cerfa.employeur.denomination
          }}</span>
          <font-awesome-icon
            v-else
            @click="$emit(this.evenement)"
            class="fontIcone"
            icon="fa-file-circle-plus"
          />
        </td>
        <td class="editable" data-prop="cerfa.maitre1">
          <span v-if="item.cerfa.maitre1">{{ item.cerfa.maitre1.nom }}</span>
          <font-awesome-icon
            v-else
            @click="$emit(this.evenement)"
            class="fontIcone"
            icon="fa-file-circle-plus"
          />
        </td>
        <td class="editable" data-prop="cerfa.contrat">
          <span v-if="item.cerfa.contrat">{{ formateDate(item) }}</span>
          <font-awesome-icon
            v-else
            @click="$emit(this.evenement)"
            class="fontIcone"
            icon="fa-file-circle-plus"
          />
        </td>
        <td class="editable" data-prop="opco">
          <span v-if="item.opco">{{ item.opco }}</span>
          <font-awesome-icon
            v-else
            @click="$emit(this.evenement)"
            class="fontIcone"
            icon="fa-file-circle-plus"
          />
        </td>
        <td>{{ resteAPayer(item.echeances) }}</td>
        <td>
          <span
            :class="'echeance echeance-' + etatEcheance(echeance)"
            v-for="echeance in item.echeances"
            >{{ resteAPayer(echeance) }}</span
          >
        </td>
        <td class="editable" data-prop="cerfa.etat">
          <span v-if="item.cerfa.etat">
            <span v-if="item.cerfa.etat == 0">Initial</span>
            <span v-else> {{ item.cerfa.etat }}</span></span
          >
          <font-awesome-icon
            v-else
            @click="$emit(this.evenement)"
            class="fontIcone"
            icon="fa-file-circle-plus"
          />
        </td>
      </tr>
    </tbody>
  </table>
  <MiseAJourService @ongetliste="miseAJour"></MiseAJourService>
  <div class="navtable">
    <button
      class="changepage"
      :disabled="this.pageCourante === 0"
      @click="changePage(false)"
    >
      &larr;
    </button>
    <span> {{ pageCourante + 1 }} / {{ nbTotalPages }}</span>
    <button
      class="changepage"
      :disabled="this.pageCourante + 1 >= nbTotalPages"
      @click="changePage"
    >
      &rarr;
    </button>
  </div>
</template>

<script>
import MiseAJourService from '@/services/MiseAJourService.vue';
import BoutonBase from '@/components/Controler/elementsHTML/bouton/BoutonBase.vue';
import elementContratTableauFacturier from '@/components/Controler/backOffice/elementContratTableauFacturier.vue';
import Formulaire from '@/components/Controler/backOffice/Formulaire.vue';
import construitURLService from '@/services/construitURL.service.vue';
import configuration from '@/administration/configuration.vue';
import connexionAPIService from '@/services/connexionAPI.service.vue';

import TableUtils from '@/components/Model/TableUtils.js';

const ECHEANCE_ETAT_INIT = 'initial';
const ECHEANCE_ETAT_REGLE = 'regle';
const ECHEANCE_ETAT_RETARD = 'retard';
const ECHEANCE_ETAT_ENCOURS = 'en_cours';
const ECHEANCE_DELAI_JOURS_PAIEMENT = 3;

export default {
  name: 'tableauFactureNonSoldees',
  components: {
    BoutonBase,
    Formulaire,
    elementContratTableauFacturier,
    MiseAJourService,
  },
  props: {
    montantWidget: Object,
  },
  data() {
    return {
      typeBtnAfficherFormulaire: 'ouvrirformulaire',
      etatFormulaire: '',
      items: [],
      nomCollectionPrincipale: 'dossier',
      opcos: [],
      apprentis: [],
      employeurs: [],
      dossiers: [],
      nbItemsParPage: 10,
      pageCourante: 0,
      itemEdite: null,
      idCourant: 0,
      indexCourant: 0,
      tdCourant: null,
      infoDistante: '',
    };
  },
  mounted() {
    this.$el.parentNode.addEventListener(
      'onEspaceSubmitSuccessB',
      this.onFormulaireOK.bind(this)
    );
  },
  updated() {
    let tu = new TableUtils();
    tu.formateEnteteFiltre([
      0,
      0,
      0,
      this.nomAffiche,
      0,
      0,
      0,
      this.formateDate,
    ]);
    tu.filterTable('tablefacturier', [1, 2, 3, 10, 11], false, this.items);
  },
  computed: {
    itemsFiltres() {
      let its = this.items.filter(function (item) {
        return !item.hidden;
      });
      return its;
    },
    itemsAffiches() {
      return this.itemsFiltres.slice(
        this.pageCourante * this.nbItemsParPage,
        this.pageCourante * this.nbItemsParPage + this.nbItemsParPage
      );
    },
    /*listeFormations() {
      let l = this.apprentis.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      l.sort((a, b) => {
        let _a = a.toLowerCase(),
            _b = b.toLowerCase();
        return +(_a > _b) || +(_a == _b) - 1;
      });
      return l;
    },
    listeApprentis() {
      let l = this.apprentis.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      l.sort((a, b) => {
        let _a = a.toLowerCase(),
          _b = b.toLowerCase();
        return +(_a > _b) || +(_a == _b) - 1;
      });
      return l;
    },*/
    nbTotalPages() {
      return Math.ceil(this.itemsFiltres.length / this.nbItemsParPage);
    },
  },
  methods: {
    nomAffiche(item) {
      let n = item.cerfa.apprenti
        ? item.cerfa.apprenti.nom + ' ' + item.cerfa.apprenti.prenom
        : '';
      return n;
    },
    numeroAffiche(item) {
      if (item.cerfa) {
        let n = item.cerfa.numeroExterne || item.cerfa.numeroInterne;
        if (!n) {
          let dt = parseInt(item.datemaj || 0);
          n =
            dt > Date.now() - 30000
              ? 'NOUVEAU'
              : dt
              ? new Date(dt).toLocaleDateString()
              : 'En erreur';
        }
        return n;
      }
      return '-';
    },
    onFormulaireOK(e) {
      let i = this.indexCourant,
        it = e.detail.reponse.extra_info;
      if (i > -1) {
        if (it.cerfa) {
          this.items[i] = it;
          if (it.corbeille) {
            this.items.splice(i, 1);
          }
        } else {
        }
        //this.infoDistante = e.detail.reponse.dist_info;
      }
      this.resetSelection();
    },
    resetSelection() {
      this.itemEdite = null;
      this.idCourant = 0;
      this.indexCourant = -1;
      if (this.tdCourant) {
        this.tdCourant.classList.remove('selected');
      }
      this.tdCourant = null;
      this.changeEtatFormulaire('');
    },
    initFormulaire(formComponent = null, formid = '', _obj = null) {
      let obj = _obj || this.items[this.indexCourant] || {},
        form =
          formComponent && formComponent.$el.nodeName == 'FORM'
            ? formComponent.$el
            : formid
            ? document.getElementById(formid)
            : this.$el.parentNode.querySelector('form'),
        _id_ = this.idCourant,
        base = form.elements['##base'].value;
      if (formComponent) {
        formComponent.item = this.items[this.indexCourant];
      }
      form.elements['##id'].value = _id_;
      if (obj) {
        for (let inputElt of form.elements) {
          if (inputElt.type == 'hidden') {
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
    editFacturier(e) {
      let t = e.target;
      if (t.classList && t.classList.contains('editable')) {
        let numItem = parseInt(t.parentNode.getAttribute('data-num')),
          numCol = 1 + Array.prototype.indexOf.call(t.parentNode.children, t),
          nomForm = t
            .closest('table')
            .querySelector('th:nth-child(' + numCol + ')')
            .getAttribute('data-form'),
          item = this.items[numItem],
          nouveauTd = t != this.tdCourant;
        if (item) {
          this.resetSelection();
          if (nouveauTd) {
            this.idCourant =
              typeof item._id == 'string'
                ? item._id
                : "ObjectId('" + item._id.$oid + "')"; //!!!!!!
            this.indexCourant = numItem;
            if (this.tdCourant) {
              this.tdCourant.classList.remove('selected');
            }
            this.tdCourant = t;
            this.tdCourant.classList.add('selected');

            this.changeEtatFormulaire(nomForm, true);
          }
        }
      }
    },
    changePage(next = true) {
      this.resetSelection();
      this.pageCourante += next ? 1 : -1;
    },
    creerDossier(e) {
      let form = e.currentTarget,
        url = construitURLService.methods.construitURLConnectionBack(
          'dossier',
          configuration.data().urlPossibles.ajouter
        );
      var _this = this;
      connexionAPIService.methods.requete(url, form).then((reponse) => {
        if (reponse.code_reponse !== 0) {
          alert("Pb d'insertion de dossier" + reponse.Error_info);
        } else {
          _this.resetSelection();
          _this.items.unshift(reponse.extra_info);
        }
      });
    },
    etatEcheance(echeance) {
      let r = this.resteAPayer(echeance),
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
    resteAPayer(echeances, nombre = false) {
      if (!echeances) {
        return 0;
      }
      if (!Array.isArray(echeances)) {
        echeances = [echeances];
      }
      let r = echeances.reduce(function (a, c) {
        return (
          a + parseFloat(c.montantTotal || 0) - parseFloat(c.montantRegle || 0)
        );
      }, 0);
      return nombre ? r : r.toFixed(2);
    },
    formateDate(item) {
      if (item.cerfa.contrat) {
        let fd = new Date(item.cerfa.contrat.dateDebutContrat || 0);
        return fd.toLocaleDateString();
      }
      return '';
    },
    miseAJour(nomCollection, liste) {
      if (nomCollection != this.nomCollectionPrincipale) {
        this[nomCollection + 's'] = liste;
      } else {
        liste = liste.filter((d) => {
          return d.cerfa && !d.corbeille;
        });
        liste.forEach((d) => {
          if (d.echeances) {
            if (!Array.isArray(d.echeances)) {
              d.echeances = Object.values(d.echeances);
            }
            d.echeances.sort((a, b) => {
              return;
              +(a.dateOuverture > b.dateOuverture) ||
                +(a.dateOuverture == b.dateOuverture) - 1;
            });
          }
        });
        liste.sort((a, b) => {
          let _a =
              a.datemaj == 'NOUVEAU'
                ? Number.POSITIVE_INFINITY
                : a.datemaj || 0,
            _b =
              b.datemaj == 'NOUVEAU'
                ? Number.POSITIVE_INFINITY
                : b.datemaj || 0;
          return +(_a < _b) || +(_a == _b) - 1;
        });
        this.items = liste;
        /*this.apprentis = liste.reduce((a, c) => {
          if (c.cerfa.apprenti) {
            a.push(c.cerfa.apprenti.nom + ' ' + c.cerfa.apprenti.prenom);
          }
          return a;
        }, []);*/
        var _this = this;
        let total = this.items.reduce((a, c) => {
          let s = _this.resteAPayer(c.echeances, true);
          return a + s;
        }, 0);
        this.montantWidget.maj(total);
      }
    },
    changeEtatFormulaire(etat, change2 = false) {
      if (this.etatFormulaire == etat) {
        this.etatFormulaire = '';
        if (change2) {
          var _this = this;
          setTimeout(() => {
            _this.etatFormulaire = etat;
          }, 100);
        }
      } else {
        this.etatFormulaire = etat;
      }
    },
    resetFormulaire(NomFormulaire) {
      let formulaire = document.getElementById('lesFormulairesAjoutFacturier');
      let barreRechercheFacturier = document.getElementById('filtresFacturier');
      formulaire.classList.add('fermetureFormulaireFacturier');
      barreRechercheFacturier.style.height = '4rem';
      this.$data['nomBouton' + NomFormulaire] = 'ajouter';
      this['form' + nomFormulaire] = false;
    },
    apprentiMineurEmancipe() {
      let barreRechercheFacturier = document.getElementById('filtresFacturier');
      barreRechercheFacturier.style.height = '28rem';
    },
    apprentiMineurNonEmancipe() {
      let barreRechercheFacturier = document.getElementById('filtresFacturier');
      barreRechercheFacturier.style.height = '35rem';
    },
    apprentiMajeur() {
      let barreRechercheFacturier = document.getElementById('filtresFacturier');
      barreRechercheFacturier.style.height = '26rem';
    },
    ajouterUneSection() {
      console.log('ajoute une section');
    },
    remetEtatInitial() {
      console.log('remet en place');
      this.resetFormulaireApprenti();
    },
    async insereObjetDansBdd(nomCollection, json) {
      let URL = construitURLService.methods.construitURLConnectionBack(
        nomCollection,
        configuration.data().urlPossibles.ajouter
      );
      await connexionAPIService.methods
        .requete(URL, json)
        .then((reponseBDD) => {
          if (reponseBDD.code_reponse !== 0) {
            alert('erreur insereObjetDansBdd : ' + reponseBDD.Error_info);
          } else {
            json._id = reponseBDD.extra_info;
            this.$emit('insertionObjetOk', nomCollection, json);
            console.log(
              'Objet ajouté en base de données, collection : ' +
                nomCollection +
                ', _id:' +
                json._id
            );
          }
        });
    },
    async effacerFormulaire() {
      for (let valeur of document.getElementsByClassName('detailOpco')[0]
        .children) {
        valeur.lastChild.value = '';
      }
    },
    transmettreOPCO() {},
    mettreDossierCorbeille() {},
  },
};
</script>

<style>
button.boutonBaseAnnuler {
  border: none;
  color: white;
  position: absolute;
  left: 4px;
  top: 5px;
  padding: 4px;
  background: #ffaece;
  border-radius: 8px;
}
button.boutonBaseAnnuler:hover {
  zoom: 1.1;
}
form.formulaireAjoutFacturier {
  border: dashed #ffaece 5px;
  border-radius: 20px;
}
form.formulaireAjoutFacturier .BoutonBaseRecherche {
  position: relative;
}
#tablefacturier th select {
  max-width: 150px;
}
</style>

<style scoped>
.premiereCaseTableauRecherche {
  max-width: 120px;
}
#titreTableauFacturerNonSolde {
  display: flex;
  background: var(--mauve-clair);
  height: 28px;
  box-shadow: 0px 5px 5px -3px;
}

.titreTableau h4 {
  font-weight: 300;
  font-size: 1rem;
  color: white;
  text-align: center;
}

#numeroTitreFacturier {
  width: 3%;
  min-width: 30px;
  background: var(--color-dark);
  margin-right: 1px;
  border-radius: 0 0 6px 0;
}

#tablefacturier thead {
  background: #c0c9d8;
}
#tablefacturier th {
  vertical-align: middle;
  text-align: center;
}
#tablefacturier th span {
  display: block;
}
#tablefacturier th.numero,
#tablefacturier td.numero {
  max-width: 110px;
  width: 110px;
}

#titreTableauDerniereCase {
  width: 15%;
  min-width: 130px;
  background: var(--color-dark);
  background: var(--color-dark);
  height: 28px;
}

#tbodyfiltresFacturier tr {
  background: #c0c9d8;
}
#tablefacturier thead tr th,
#tbodyfiltresFacturier tr td {
  text-align: center;
}
#tbodyfiltresFacturier .fontIcone {
  margin: 3px;
}
.enteteRecherche {
  height: 3.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

select {
  width: 100%;
}
.formulaireAjoutFacturier {
  position: relative;
}
#lesFormulairesAjoutFacturier {
  display: none;
  position: absolute;
  top: 9.5rem;
  margin-top: 4em;
  width: 100%;
  height: 13rem;
  animation: fadein 3s;
}

.OuvertureFormulaireFacturier {
  -webkit-transition: 2s;
  -moz-transition: 2s;
  -ms-transition: 2s;
  -o-transition: 2s;
  transition: 2s;
  margin-left: 0%;
  opacity: 1;
}

.fermetureFormulaireFacturier {
  -webkit-transition: 2s;
  -moz-transition: 2s;
  -ms-transition: 2s;
  -o-transition: 2s;
  transition: 2s;
  margin-left: 100%;
  opacity: 0;
}
@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.boutonCreationDossier {
  margin: 3px;
  padding: 0.3rem;
  text-align: center;
  border-style: dashed;
  color: #ffaece;
  border-color: #ffaece;
  text-transform: capitalize;
  border-radius: 10px;
  transition-duration: 1s;
  background: white;
  line-height: 16px;
  text-align: center;
}

.iconeAjout {
  font-size: 120%;
}

.boutonCreationDossier span {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  display: inline-block;
}

.boutonCreationDossier:hover {
  font-size: 120%;
  cursor: pointer;
}

#lignesDuFacturier {
  /*
  La seule barre de defilement du facturier
   */
  background: var(--mauve-clair);
  flex-grow: 3;
  margin: 0rem 0.5rem 0.5rem 0.3rem;
  margin-bottom: 2.4rem;
  border-radius: 7px;
  box-shadow: 0px 5px 5px -3px;
}
#lignesDuFacturier tr:nth-child(odd) {
  background: white;
}
#tablefacturier tr > *:nth-child(3),
#tablefacturier tr > *:nth-child(4),
#tablefacturier tr > *:nth-child(5),
#tablefacturier tr > *:nth-child(6),
#tablefacturier tr > *:nth-child(7) {
  max-width: 150px;
}
.detailApprenti select {
  width: 50%;
}
#etatmiseajour {
  position: absolute;
  bottom: 3px;
  right: 3px;
  background: #80d0f0;
  color: blue;
  padding: 2px;
  font-size: 10px;
  font-weight: bold;
  display: block;
}
.echeance {
  display: inline-block;
  padding: 1px 4px;
  border-radius: 6px;
  background: white;
  font-size: 11px;
}
.echeance-retard {
  background: red;
  color: white;
}
.echeance-regle {
  background: greenyellow;
  color: green;
}
.echeance-en_cours {
  background: #eaeaff;
  color: black;
}
.navtable {
  position: absolute;
  bottom: 5px;
  width: 100%;
  text-align: center;
}
.navtable span {
  background: white;
}
.navtable button.changepage {
  display: inline-block;
  width: 40px;
  margin: 5px;
}
.editable:hover,
.editable.selected {
  cursor: pointer;
  color: white;
  background: blue;
}
.editable {
  background: inherit;
}
.editable * {
  pointer-events: none;
}
.hidden {
  display: none !important;
  opacity: 0 !important;
}

#lignesDuFacturier td {
  text-align: center;
}
.espacefiltertable {
  max-width: 180px;
}
</style>
