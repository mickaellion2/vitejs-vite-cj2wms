<template>
  <Formulaire
    :nomComposant="etatFormulaire"
    :item="itemCourant"
    :param="paramCourant"
    :configs="configs"
    :conteneurFormulaire="this"
    v-if="!!etatFormulaire"
  >
  </Formulaire>

  <div class="erreur" v-if="!!erreur">
    <strong>Retour OPCO :</strong> {{ erreur }}
  </div>

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

  <EspaceTableau ref="tableauPrincipal" :id="'tablefacturier'"> </EspaceTableau>

  <MiseAJourService @ongetliste="miseAJour"></MiseAJourService>
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
import EspaceTableau from '@/components/Model/EspaceTableau.vue';

export default {
  name: 'TableauFacture',
  components: {
    BoutonBase,
    Formulaire,
    elementContratTableauFacturier,
    MiseAJourService,
    EspaceTableau,
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
      configs: [],
      apprentis: [],
      employeurs: [],
      dossiers: [],
      itemCourant: null,
      idCourant: 0,
      indexCourant: 0,
      tdCourant: null,
      infoDistante: '',
      paramCourant: '',
      erreur: '',
    };
  },
  mounted() {
    this.$el.parentNode.addEventListener(
      'onEspaceSubmitSuccessB',
      this.onFormulaireOK.bind(this)
    );
  },
  methods: {
    initTableau() {
      if (this.items.length) {
        let tableau = this.$refs.tableauPrincipal;
        tableau.appendColonne({
          titre: 'Suppr',
          nonfiltre: true,
          attrs: { 'data-form': 'FormulaireCorbeille' },
          lignes: {
            class: 'editable',
            prop: 'corbeille',
            icone: 'fa-solid fa-trash',
          },
        });
        tableau.appendColonne({
          titre: 'Fichiers',
          nonfiltre: true,
          attrs: { 'data-form': 'FormulaireFichiers' },
          lignes: {
            class: 'editable',
            prop: '#fichier',
          },
        });
        tableau.appendColonne({
          titre: 'N°',
          nonfiltre: true,
          attrs: { class: 'caseTableauNumero' },
          directid: 'formcreadossier',
          lignes: {
            prop: this.numeroAffiche,
            attrs: { class: 'caseTableauNumero' },
          },
        });
        tableau.appendColonne({
          titre: 'Apprenti',
          attrs: { 'data-form': 'FormulaireApprenti' },
          lignes: {
            class: 'editable',
            prop: this.nomAffiche,
          },
        }); //item.cerfa.formation.intituleQualification
        tableau.appendColonne({
          titre: 'Formation',
          attrs: { 'data-form': 'FormulaireFormation' },
          lignes: {
            class: 'editable',
            prop: 'cerfa.formation.intituleQualification',
          },
        });
        tableau.appendColonne({
          titre: 'Employeur',
          attrs: { 'data-form': 'FormulaireEmployeur' },
          lignes: {
            class: 'editable',
            prop: 'cerfa.employeur.denomination',
          },
        });
        tableau.appendColonne({
          titre: 'Ma&icirc;tre(s)',
          attrs: { 'data-form': 'FormulaireMaitre' },
          lignes: {
            class: 'editable',
            prop: 'cerfa.maitre1.nom',
          },
        });
        tableau.appendColonne({
          titre: 'Contrat',
          attrs: { 'data-form': 'FormulaireContrat' },
          lignes: {
            class: 'editable',
            prop: this.formateDate,
          },
        });
        tableau.appendColonne({
          titre: 'Opco',
          attrs: { 'data-form': 'FormulaireOpco' },
          lignes: {
            class: 'editable',
            prop: 'opco',
          },
        });
        tableau.appendColonne({
          titre: 'Reste',
          nonfiltre: true,
          attrs: {},
          lignes: {
            class: 'nonEditable',
            prop: this.resteAPayer,
          },
        });
        tableau.appendColonne({
          titre: 'Factures',
          nonfiltre: true,
          attrs: { 'data-form': 'FormulaireFacture' },
          lignes: {
            composant: 'Echeancier',
          },
        });
        tableau.appendColonne({
          titre: 'Etat',
          attrs: { 'data-form': 'FormulaireEtat' },
          lignes: {
            class: 'editable',
            prop: 'cerfa.etat',
          },
        });
        let tu = new TableUtils();
        tu.initFilter('tablefacturier', null, false, this.items);
        tu.formate(tableau);
        tableau.init(this.items, this.resetSelection, tu.filterTable.bind(tu));
      }
    },
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
    resetSelection() {
      this.erreur = '';
      this.idCourant = 0;
      this.indexCourant = -1;
      if (this.tdCourant) {
        this.tdCourant.classList.remove('selected');
      }
      this.tdCourant = null;
      this.changeEtatFormulaire('');
    },
    getErreur(e) {
      let erreur = '',
        infoDistante = e.detail.reponse.dist_info;
      if (infoDistante) {
        infoDistante = infoDistante.extra_info;
      }
      if (infoDistante && e.detail.reponse.extra_info) {
        let i = this.itemCourant;
        infoDistante = infoDistante[i.opco];
      }
      if (infoDistante) {
        erreur = infoDistante.erreur;
      }
      return erreur;
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
      this.erreur = this.getErreur(e);
      if (!this.erreur) {
        this.resetSelection();
      }
    },
    editFacturier(e) {
      let t = e.target;
      if (t.classList && t.classList.contains('editable')) {
        let trElt = t.closest('tr'),
          tdElt = t.closest('td'),
          numItem = parseInt(trElt.getAttribute('data-num')),
          numCol = 1 + Array.prototype.indexOf.call(trElt.children, tdElt),
          table = t.closest('table'),
          th = table.querySelector('th:nth-child(' + numCol + ')'),
          nomForm = th.getAttribute('data-form'),
          item = this.items[numItem],
          nouveauTd = t != this.tdCourant,
          param = t.getAttribute('data-param');
        this.paramCourant = param;
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
            this.itemCourant = this.items[this.indexCourant];
            this.changeEtatFormulaire(nomForm, true);
          }
        }
      }
    },
    creerDossier(e) {
      console.log('Créationdossier');
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
    _resteAPayer(echeance, nombre = false) {
      let r =
        parseFloat(echeance.montantTotal || 0) -
        parseFloat(echeance.montantRegle || 0);
      return nombre ? r : r.toFixed(2);
    },
    resteAPayer(item, nombre = false) {
      let echeances = item ? item.echeances : null;

      if (!echeances) {
        return 0;
      }
      var _this = this;
      let r = echeances.reduce(function (a, c) {
        console.log(_this.montantWidget.total.filtre, c.dateOuverture.substring(0, 10));
        c.statutFiltre
        return (a + _this._resteAPayer(c, true))*_this.booleenFiltre("2022-08-30","2023-08-31",c);
        //return a + _this._resteAPayer(c, true)*_this.booleenFiltre(_this.montantWidget.total.filtre.dateDebut,_this.montantWidget.total.filtre.dateFin,c.dateOuverture);

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
          //if(){}
          let s = _this.resteAPayer(c, true);
          //console.log("A :"+ a);
          //console.log( c);
          //console.log("S :"+ s);

          return a + s;
        }, 0);

        this.montantWidget.maj(total);
        this.initTableau();
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
    booleenFiltre(dateA, dateB, c) {
      let dateCheck = c.dateOuverture;
      console.log(dateA, dateB, dateCheck.substring(0, 10));
      if (
        ((dateB == '' || dateB == null || dateB == undefined) &&
          (dateA == '' || dateA == null || dateA == undefined)) ||
        (dateCheck.substring(0, 10) <= dateB &&
          dateCheck.substring(0, 10) >= dateA)
      ) {
        c.estMasque = false;
        return true;
      } else {
        c.estMasque = true;
        return false;
      }
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
.caseTableauNumero {
  max-width: 120px;
  width: 120px;
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

#lignesDuFacturier td {
  text-align: center;
}
.espacefiltertable {
  max-width: 180px;
}
.erreur {
  margin: 5px;
  padding: 3px;
  display: block;
  background: red;
  color: white;
  text-align: left;
}
</style>
