<template>
  <section class="bandeauHaut">
    <div class="contenuBandeauHaut">
      <BoutonDeconnexion> </BoutonDeconnexion>
    </div>
  </section>
</template>

<script>
import BoutonDeconnexion from '@/components/Controler/connexion/BoutonDeconnexion.vue';

export default {
  name: 'bandeauHautFacturier',
  components: {
    BoutonDeconnexion
  },
};
</script>

<style scoped>
.bandeauHaut {
  position: fixed;
  right: 0;
  top: 0;
  left: 165px;
  z-index: 100;
  height: 33px;
  box-shadow: 0px 8px 5px -7px;
  
}

.contenuBandeauHaut {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
}

.lienDeconnexion {
  text-decoration: none;
  color: var(--color-dark);
}

.deconnexion {
  margin-right: 1em;
  margin-top: 5px;
}

.lienDeconnexion:hover {
  text-decoration: none;
  color: red;
  cursor: pointer;
}

.texteDeconnexion {
  margin-left: 0.5em;
}
</style>
