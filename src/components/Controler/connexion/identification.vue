<template>
  <form id="formid" :data-service="action">
    <section class="boite">
      <section class="formulaire">
        <h1>Connexion</h1>
        <section class="entreeUtilisateur">
          <input type="email" name="mail" id="email" required="required" />
          <span>e-mail</span>
          <i></i>
        </section>
        <section class="entreeUtilisateur">
          <input
            type="password"
            name="password"
            id="password"
            required="required"
          />
          <span>mot de passe</span>
          <i></i>
        </section>
      </section>
      <BoutonSubmit
        :intituleBouton="'soumettre'"
        @on-espace-submit-fail="fail"
        @on-espace-submit-success="ok"
      >
      </BoutonSubmit>
    </section>
  </form>
</template>

<script>
import BoutonSubmit from '@/components/Controler/elementsHTML/bouton/BoutonSubmit.vue';
import creationJSONService from '@/services/creationJSON.service.vue';
import configuration from '@/administration/configuration.vue';
import construitURLService from '@/services/construitURL.service.vue';
import connexionAPIService from '@/services/connexionAPI.service.vue';

export default {
  name: 'UserIdentification',
  components: { BoutonSubmit },
  created() {
    //L'utilisatuer revient apres avoir ferme la page
    if(localStorage.getItem('nom')) {
      let url = construitURLService.methods.construitURLConnectionBack(
        'utilisateur',
        configuration.data().urlPossibles.obtenir), item;
      item = JSON.parse(localStorage.getItem('itemUtilisateur')) ;
      var _this = this;
      connexionAPIService.methods.requete(url, item).then(reponse=>{
        if (reponse.code_reponse === 0) {
            _this.affichePageAccueil();
        }
      });
    }
  },
  data() {
    return {
      action: construitURLService.methods.construitURLConnectionBack(
        '',
        configuration.data().urlPossibles.connexion
      ),
    };
  },
  methods: {
    ok(reponse) {
      localStorage.setItem('itemUtilisateur', JSON.stringify(reponse.extra_info));
      localStorage.setItem('token', reponse.extra_info.token);
      localStorage.setItem('nom', reponse.extra_info.nom);
      localStorage.setItem('prenom', reponse.extra_info.prenom);
      localStorage.setItem('avatar', reponse.extra_info.avatar);
      localStorage.setItem('mail', reponse.extra_info.mail);
      this.affichePageAccueil();
    },
    affichePageAccueil() {
      this.$router.push({ name: 'facturier' });
    },
    fail(r) {
      alert(r.Error_info);
    },
  },
};
</script>

<style scoped>
.boite {
  position: relative;
  width: 400px;
  max-width: 400px;

  height: 420px;
  border-radius: 15px;
  overflow: hidden;
  background: black;
  margin-left: auto;
  margin-right: auto;
}

.boite::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 400px;
  max-width: 400px;
  height: 420px;
  background: linear-gradient(90deg, white, black, white);
  transform-origin: bottom right;
  animation: animate 3s linear infinite;
}

@keyframes animate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.formulaire {
  position: absolute;
  inset: 2px;
  background: white;
  border-radius: 10px;
  z-index: auto;
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
}

.formulaire h1 {
  font-weight: 1000;
  text-align: center;
  letter-spacing: 0.4em;
  font-size: 180%;
  text-transform: uppercase;
}

.entreeUtilisateur {
  position: relative;
  width: 300px;
  margin-top: 35px;
}

.entreeUtilisateur input {
  position: relative;
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1em;
  letter-spacing: 0.05em;
}

.entreeUtilisateur span {
  position: absolute;
  left: 0;
  top: -40px;
  padding: 20px 10px 10px;
  pointer-events: none;
  letter-spacing: 0.05em;
}

.entreeUtilisateur input:valid ~ span,
.entreeUtilisateur input:focus ~ span {
  color: lightslategrey;
}

.entreeUtilisateur i {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, black, lightslategrey, white);
  border-radius: 4px;
}

.boutonFlashy {
  position: absolute;
  bottom: 10px;
  border: none;
  outline: none;
  width: 100%;
}
</style>

<style>
input[type='submit'] {
  position: absolute;
  bottom: 100px;
  border: 0;
  letter-spacing: 5px;
  font-size: 150%;
  text-transform: uppercase;
  text-align: center;
  left: 100px;
}
</style>
