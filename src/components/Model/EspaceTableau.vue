<template>
  <table @click="this.$parent.editFacturier" :id="tableId">
    <thead>
      <th v-for="entete in entetes" :class="entete.class" v-bind="entete.attrs">
        
        <!--font-awesome-icon
          class="fontIcone"
          v-if="entete.triCroissant"
          icon="fa-sort-amount-desc"
        />
        <font-awesome-icon class="fontIcone" v-else icon="fa-sort-amount-asc" /-->


        <!--div
          v-if="entete.directid"
          :id="entete.directidConteneur"
          v-html="chargeDirect(entete)"
        ></div>
        <span v-else v-html="entete.titre"></span-->

        <span v-html="entete.titre"></span>
      </th>
    </thead>
    <tbody>
      <tr
        v-for="(item, index) in itemsAffiches"
        :data-num="items.indexOf(item)"
      >
        <td
          v-for="cellule in cellules"
          :class="cellule.class"
          v-bind="cellule.attrs"
        >
          <div v-if="cellule.composant">
            <component :item="item" :is="cellule.composant"> </component>
          </div>
          <div
            v-else-if="cellule.directid"
            :id="cellule.directidConteneur"
            v-html="chargeDirect(entete)"
          ></div>
          <span v-else-if="!!afficheProp(item, cellule)">{{
            afficheProp(item, cellule)
          }}</span>
          <span v-else-if="cellule.class === 'nonEditable'">0</span>
          <font-awesome-icon
            v-else-if="cellule.icone"
            class="fontIcone"
            :icon="cellule.icone"
            @click="$emit(this.evenement)"
          />

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
import configuration from '@/administration/configuration.vue';

//TODO : EN AMONT !!!!!!!!!!!!!!
import Echeancier from '@/components/Controler/backOffice/Echeancier.vue';

var _numDirectId = 0;
var initObjetAttributs = function (obj) {
  if (obj.directid) {
    obj.directidConteneur = obj.directid + '_' + _numDirectId++;
  }
};
var nettoieObjetAttributs = function (obj) {
  let r = {};
  for (var n in obj) {
    if (typeof obj[n] == 'string') {
      r[n] = obj[n];
    }
  }
  return r;
};

export default {
  name: 'EspaceTableau',
  components: {
    Echeancier,
  },
  data() {
    return {
      items: [],
      entetes: [],
      cellules: [],
      nbItemsParPage: 10,
      pageCourante: 0,
      avantChangePage: null,
      endCallback: null,
      tableId: this.id || 'espacetableau',
    };
  },
  props: {
    id: String,
  },
  updated() {
    let tableElt = document.getElementById(this.tableId),
      nbTh = tableElt.querySelectorAll('th').length,
      end = nbTh == this.entetes.length;
    if (end && this.endCallback) {
      this.endCallback();
    }
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
    nbTotalPages() {
      return Math.ceil(this.itemsFiltres.length / this.nbItemsParPage);
    },
  },
  methods: {
    afficheProp(item, cellule) {
      let prop = cellule.prop,
        t = typeof prop,
        r = '';
      if (t == 'string') {
        r = configuration.methods.obtientValeurPropriete(prop, item);
      } else if (t == 'function') {
        r = prop(item);
      }
      return r;
    },
    init(items, avantChangePage, endCallback) {
      this.endCallback = endCallback;
      this.end = true;
      this.items = items;
      this.avantChangePage = avantChangePage;
    },
    appendColonne(objAttributs) {
      initObjetAttributs(objAttributs);
      let lignes = objAttributs.lignes;
      delete objAttributs.lignes;
      this.entetes.push(objAttributs);
      initObjetAttributs(lignes);
      this.cellules.push(lignes);
    },
    chargeDirect(entete) {
      let elt = document.getElementById(entete.directid),
        r = '';
      if (elt) {
        elt.classList.remove('hidden');
        r = elt.outerHTML;
        elt.classList.add('hidden');
      }
      return r;
    },
    changePage(next = true) {
      if (this.avantChangePage) {
        this.avantChangePage();
      }
      this.pageCourante += next ? 1 : -1;
    },
  },
};
</script>

<style>
.editable:hover,
.editable.selected {
  cursor: pointer;
  color: white;
  background-color: blue;
  transition-property:"background-color";
  transition-duration:1s;
}
.editable {
  background: inherit;
}
.editable * {
  pointer-events: none;
}
</style>

<style scoped>
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
</style>
