<script>
const SERVEUR = {
  PROTOCOLE_SERVEUR: 'https://',
  IP_SERVEUR: 'api.anafe.fr',
  PORT_SERVEUR: '80',
};
const NOM_ENTREPRISE = 'ANAFE';

const API_OPCO = {
  PROTOCOLE_SERVEUR: 'https://',
  ADRESSE_SERVEUR: 'apiopco.opcoserveur.fr/ApiEchangeCFA/',
  VERSION: 'v1',
  NOM_TYPE: 'nomOPCO',
  lienGET: {
    dossiers: 'dossiers',
    etats: 'dossiers/etats',
    liste: 'dossiers/liste',
    status: 'status',
  },
  lienPOST: {
    documents: 'documents',
    dossiers: 'dossiers',
    factures: 'factures',
  },
};

const AJAX = {
  ADRESSE_SERVEUR: SERVEUR.PROTOCOLE_SERVEUR + SERVEUR.IP_SERVEUR + '/',
  ADRESSE_API_OPCO:
    API_OPCO.PROTOCOLE_SERVEUR +
    API_OPCO.ADRESSE_SERVEUR +
    API_OPCO.VERSION +
    '/',
};

const LIEN = {
  ajouter: 'ajout',
  modifier: 'modifie',
  supprimer: 'supprime',
  obtenir: 'get',
  connexion: 'connexion',
  deconnexion: 'deconnexion',
};

const COLLECTIONS = {
  utilisateur: 'utilisateur',
  opco: 'opco',
  apprenti: 'apprenti',
  dossier: 'dossier',
};
const NOM_BDDLoc = 'BddLocale_' + NOM_ENTREPRISE;
const VERSION_BDDLoc = '1.0';

export default {
  name: 'configuration_front',
  data() {
    return {
      serveur: AJAX.ADRESSE_SERVEUR,
      urlPossibles: LIEN,
      collections: COLLECTIONS,
      collectionsAMAJ: ['config','opco', 'dossier'],
      connexionAPI_OPCO: AJAX.ADRESSE_API_OPCO,
      infoOPCO: API_OPCO,
      nomBddLoc: NOM_BDDLoc,
      versionBddLoc: VERSION_BDDLoc,
      format_euro: FORMAT_EURO,
    };
  },
  methods: {
    obtientValeurPropriete(nomProp, obj, base = '') {
      let v, props;
      props = ((base ? base + '.' : '') + nomProp).split('.');
      v =
        props.reduce(function (a, c) {
          return a ? a[c] || '' : '';
        }, obj) || '';
      return v;
    },
  },
};
const FORMAT_EURO = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
});
</script>
