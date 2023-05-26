<template>
  <!--
  Composant pour le formulaire de connexion
  <UserIdentification></UserIdentification>

<facturier></facturier>
  -->

  <modifier-profil></modifier-profil>



</template>

<script>
//import UserIdentification from "@/components/identification";
//import facturier from "@/components/Vue/facturier";
import modifierProfil from "@/components/Vue/modifierProfil";

export default {
  name: "composantEnTest",
  components:
      //{UserIdentification}
      {
        //facturier
        modifierProfil
      }
}
</script>

<style scoped>



</style>