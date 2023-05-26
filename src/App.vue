<template>
  <router-view> </router-view>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      //protected assets url base (utile pour les ressources sur stackblitz)
      //TODO : tenir compte de la prod !
      pab: 'https://factures.anafe.fr/protectedassets',
    };
  },
};
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.css';
@import '@/style.css';

:root {
  --main-color: #223aad;
  --color-dark: #34425a;
  --text-grey: #b0b0b0;
  --rose-pastel: #fee4e3;
  --mauve-clair: #dad8dc;
  --bs-body-font-size: 14px;
}

* {
  margin: 0;
  padding: 0;
  text-decoration: none;
  list-style-type: none;
  box-sizing: border-box;
}
</style>
