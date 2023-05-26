<template>
  <div v-if="evenement=='onEspaceSubmit'" @click="$emit(this.evenement)">
    <input
        v-if="intitule"  
        type="submit"
        :value="intitule"
    />
    <font-awesome-icon v-if="!intitule"
      class="fontIcone boutoncharge"
      icon="fa-upload"
    />
  </div>
  <button v-else-if="intitule" @click="$emit(this.evenement)">
    <font-awesome-icon
      v-if="type == 'ouvrirformulaire'"
      class="fontIcone"
      icon="fa-file-circle-plus"
    />
    <span>{{ intitule }}</span>
  </button>
  <font-awesome-icon
    v-else-if="(type == 'ouvrirformulaire') && nonEtatBouton"
    @click="$emit(this.evenement)"
    class="fontIcone"
    icon="fa-file-circle-plus"
  />
  <font-awesome-icon
    v-else
    @click="$emit(this.evenement)"
    class="fontIcone iconeOn"
    icon="fa-file-circle-minus"
  />
</template>

<script>
export default {
  name: 'BoutonBase',
  props: {
    intituleBouton: String,
    evenementBouton: String,
    type: String,
    etatBouton:Boolean
  },
  computed: {
    nonEtatBouton:function() {
      return !this.etatBouton;
    }    
  },
  data() {
    return {
      btnClass: this.btnClass || 'boutonFlashy',
      intitule: this.intituleBouton || '',
      evenement: this.evenementBouton || 'boutonClique'
    };
  },
};
</script>

<style scoped>
.fontIcone {
  font-size: 200%;
  color: #176c84;
}
.fontIcone.iconeOn {
  color:#e96c8e;
}
.fontIcone.boutoncharge {
  font-size:70px;
  position: absolute;
  right:5px;
  bottom:5px;
  color:#ffaece;
}
.fontIcone.boutoncharge:hover {
  cursor: pointer;
  color:greenyellow;
}
.boutonFlashy {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 6px 0 6px 0;
}

.boutonFlashy button {
  position: relative;
  width: auto;
  height: 30px;
  display: inline-block;
  margin-top: 6px;
  border-style: none;
  border-radius: 6px 0 6px 0;
}

.boutonFlashy button:before,
.boutonFlashy button:after {
  content: '';
  position: absolute;
  inset: 0;
  background: red;
  transition: 0.5s;
}

.boutonFlashy button:nth-child(1):before,
.boutonFlashy button:nth-child(1):after {
  background: linear-gradient(
    45deg,
    var(--mauve-clair),
    var(--mauve-clair),
    #dc143c
  );
}

.boutonFlashy button:hover:before {
  inset: -3px;
}

.boutonFlashy button:hover:after {
  inset: -3px;
  filter: blur(2px);
}

.boutonFlashy button span {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: inline-block;
  /*
  changer de la couleur du fond
  et la couleur de la police
   */
  background: var(--color-dark);
  color: white;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 80%;
  text-transform: uppercase;
  border-radius: 6px 0 6px 0;
}
</style>
