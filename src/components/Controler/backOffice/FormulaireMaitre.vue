<template>
  <legend>
    Maitre 1 (<a
      target="_blank"
      href="https://www.formulaires.service-public.fr/gf/getNotice.do?cerfaNotice=51649&cerfaFormulaire=10103"
      style="font-weight: bold"
      >Aide</a
    >)
  </legend>
  <input type="hidden" name="##base" value="cerfa" />
  <div class="detailApprenti">
    <div class="_inputBoxFacturier">
      <span class="detailFacturier">Nom de naissance</span>
      <input
        type="text"
        placeholder="obligatoire"
        minlength="1"
        maxlength="80"
        name="maitre1.nom"
        required
      />
    </div>
    <div class="_inputBoxFacturier">
      <span class="detailFacturier">Prénom</span>
      <input
        type="text"
        name="maitre1.prenom"
        placeholder="obligatoire"
        minlength="1"
        maxlength="80"
        required
      />
    </div>
    <div class="_inputBoxFacturier">
      <span class="detailFacturier">Date de naissance</span>
      <input
        type="date"
        name="maitre1.dateNaissance"
        @input="this.SiApprentiMineur"
        required
      />
    </div>
  </div>

  <legend>Maitre 2</legend>
  <div class="detailApprenti">
    <div class="_inputBoxFacturier">
      <span class="detailFacturier">Nom de naissance</span>
      <input
        type="text"
        placeholder="Nom"
        minlength="0"
        maxlength="80"
        name="maitre2.nom"
      />
    </div>
    <div class="_inputBoxFacturier">
      <span class="detailFacturier">Prénom</span>
      <input
        type="text"
        name="maitre2.prenom"
        placeholder="Prénom"
        minlength="0"
        maxlength="80"
      />
    </div>
    <div class="_inputBoxFacturier">
      <span class="detailFacturier">Date de naissance</span>
      <input
        type="date"
        name="maitre2.dateNaissance"
        @input="this.SiApprentiMineur"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormulaireMaitre',
  data() {
    return {
      afficheMaitrePublic: false,
    };
  },
  methods: {
    SiMaitrePublic(event) {
      if (this.$data.afficheMaitrePublic) {
        this.$data.afficheMaitrePublic = false;
        //this.$emit('afficheMineurEmancipe', event);
      } else {
        this.$data.afficheMaitrePublic = true;
        this.$emit('afficheMaitrePublic', event);
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

.detailMaitre {
  width: 90%;
  max-width: content-box;
  border-radius: 5px;
  padding: 10px;
  background: white;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 0.2rem 0.5rem;
  box-shadow: 0px 5px 5px -5px;
}

.detailMaitreMineur {
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

.detailMaitreMineur .etudiantMineur div {
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
}

/*.detailMaitre div:last-child{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}*/
</style>

/* Suggestions : -prévoir d'utiliser une API pour rentrer des données
géographiques -prévoir d'utiliser une API pour rentrer des données d'entreprise
-faire une validation des données afin de vérifier quelles sont bien dans le bon
format */
