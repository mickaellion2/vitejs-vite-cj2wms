var eventListenerOK = false,
  TREATMENT_SORT = 'espacesorttable',
  TREATMENT_FILTER = 'espacefiltertable',
  treatments = [TREATMENT_SORT, TREATMENT_FILTER],
  SORT_FUNCTIONS = {};

var onTableAction = function (e) {
  var t = e.target,
    _this = this;
  treatments.forEach(function (treatment) {
    var thcell, thline, tbody, rows;
    switch (treatment) {
      case TREATMENT_SORT:
        if (
          e.type == 'click' &&
          t &&
          t.classList &&
          t.classList.contains(TREATMENT_SORT) &&
          (thcell = t.parentNode) &&
          (thline = thcell.parentNode)
        ) {
          var indexCol = Array.prototype.indexOf.call(thline.children, thcell),
            sorttablebody;
          if (
            (sorttablebody = thline.parentNode) &&
            (sorttablebody = sorttablebody.parentNode) &&
            (sorttablebody = sorttablebody.querySelector('tbody:last-child'))
          ) {
            sortTableByCol(
              sorttablebody,
              indexCol,
              SORT_FUNCTIONS[sorttablebody.parentNode.id][indexCol]
            );
          }
        }
        break;
      case TREATMENT_FILTER:
        if (e.type == 'change') {
          if (
            t &&
            t.classList &&
            t.classList.contains(TREATMENT_FILTER) &&
            (tbody = t.closest('table').querySelector('tbody:last-child'))
          ) {
            _this.addCurrentFilter(t);
            changefiltercolselect.call(_this, t);
          }
        }
        break;
      default:
      //TO DO : pour traitments externes.
    }
  });
};
var addTableUtilsEventListener = function (_this) {
  if (!eventListenerOK) {
    document.addEventListener('click', onTableAction.bind(_this), true);
    document.addEventListener('change', onTableAction.bind(_this), true);
    eventListenerOK = true;
  }
};
var sortTableByCol = function (tbody, indexCol, _sortfn, nochangedir) {
  var rows,
    cellth,
    dir,
    changedir = nochangedir ? -1 : 1,
    sortAttr,
    sortfn = function (a, b) {
      return +(a > b) || +(a === b) - 1;
    };
  if (typeof _sortfn == 'function') {
    sortfn = _sortfn;
  } else if (typeof _sortfn == 'string') {
    sortAttr = _sortfn.split('_').shift();
  }
  if (indexCol < 0) {
    return;
  }
  if (!this.currentSorts[tbody]) {
    this.currentSorts[tbody] = {};
  }
  dir = this.currentSorts[tbody][indexCol] =
    this.currentSorts[tbody][indexCol] != -1 ? -1 * changedir : changedir;
  if (
    (cellth = tbody.parentNode.tHead) &&
    (cellth = cellth.getElementsByTagName('TH')[indexCol])
  ) {
    cellth.classList.toggle('topdir', dir == -1);
    cellth.classList.toggle('bottomdir', dir == 1);
  }
  rows = Array.prototype.reduce.call(
    tbody.rows,
    function (p, c) {
      var tdElt = c.getElementsByTagName('TD')[indexCol],
        sa = tdElt.getAttribute('data-' + sortAttr);
      if (!sa) {
        sa = Array.prototype.reduce.call(
          tdElt.querySelectorAll('.multipleelt'),
          function (_p, _c) {
            var __p = (_c.innerHTML || '').toLowerCase().trim();
            return __p > _p ? __p : _p;
          },
          ''
        );
      }
      p.push({
        v: tdElt ? (sa ? sa : tdElt.innerHTML.toLowerCase()) : '',
        h: c.outerHTML,
      });
      return p;
    },
    []
  );
  rows.sort(function (a, b) {
    return dir * sortfn(a.v.trim(), b.v.trim());
  });
  tbody.innerHTML = rows.reduce(function (p, c) {
    p += c.h;
    return p;
  }, '');
};
var obtientValeur = function (fnFormat, item) {
  let v = '';
  if (typeof fnFormat == 'string') {
    v = configuration.methods.obtientValeurPropriete(fnFormat, item);
  } else if (fnFormat) {
    v = fnFormat(item);
  }
  return v;
};

var changefiltercolselect = function (selElt) {
  var isMultiple = selElt.classList.contains('multiple'),
    //prop = selElt.getAttribute('data-prop'),
    v = selElt.value,
    numCol = parseInt(selElt.id.substr(selElt.id.indexOf('_') + 4));
  this.items.forEach((item) => {
    let conditionVisible, hidden, echeanceElts;
    if (isMultiple) {
      conditionVisible = !!item['.multipleelt.status-' + v];
    } else {
      let fnFormat = this.formatagesColCourants[numCol],
        valeurItem = obtientValeur(fnFormat, item);
      conditionVisible = valeurItem == v;
    }
    conditionVisible = v === '' || conditionVisible;
    if (conditionVisible) {
      delete item['hidden-' + numCol];
    } else {
      item['hidden-' + numCol] = true;
    }
    hidden =
      !conditionVisible ||
      Object.keys(item).some((k) => {
        return k.substr(0, 7) == 'hidden-';
      });
    if (!hidden) {
      delete item['hidden'];
    } else {
      item['hidden'] = true;
    }
    if (!hidden && false) {
      if (isMultiple) {
        echeanceElts = td.querySelectorAll('.multipleelt');
        Array.prototype.forEach.call(echeanceElts, function (eelt) {
          var hidden = !eelt.classList.contains('status-' + v) && v !== '';
          //eelt.classList.toggle('hidden', hidden);
          if (!hidden) {
            //refreshSomme(eelt.firstChild.nodeValue);
          }
        });
      } else {
        echeanceElts = td.parentNode.querySelectorAll('td .multipleelt');
        Array.prototype.forEach.call(echeanceElts, function (eelt) {
          var hidden = eelt.classList.contains('hidden');
          if (!hidden) {
            //refreshSomme(eelt.firstChild.nodeValue);
          }
        });
      }
    }
  });
};

import configuration from '@/administration/configuration.vue';

export default class TableUtils {
  currentFilters = {};
  currentSorts = {};
  items = [];
  tableElt = null;
  numcolsExcluded = [];
  multipleObj = [];
  formatagesColCourants = [];

  constructor() {
    addTableUtilsEventListener(this);
  }

  addTreatment(treatment) {
    //TO DO : externes .... ?
    if (treatments.indexOf(treatment) === -1) {
      treatments.push(treatment);
    }
    return treatments.length;
  }

  initFilter(tableId, numcolsExcluded = [], multipleObj = false, items = null) {
    this.items = items;
    this.tableElt = document.getElementById(tableId);
    this.numcolsExcluded = numcolsExcluded ;
    this.multipleObj = multipleObj;

    this.addTreatment(TREATMENT_FILTER);
  }

  filterTable() {
    var tbodyElt = this.tableElt.querySelector('tbody:last-child'),
      allcols = this.tableElt.querySelectorAll('th'),
      selElt,
      _this = this;
    Array.prototype.forEach.call(allcols, function (col, i) {
      if (~_this.numcolsExcluded.indexOf(i + 1)) {
        return;
      }
      if (!(selElt = col.querySelector('.' + TREATMENT_FILTER))) {
        selElt = document.createElement('select');
        selElt.className = TREATMENT_FILTER;
        selElt.id = _this.tableElt.id + '_fts' + i;
        col.appendChild(selElt);
      }
      //selElt.setAttribute('data-prop', (prop = col.getAttribute('data-prop')));
      selElt.innerHTML = '';
      var num = 1 + i,
        multiple = _this.multipleObj.length ? _this.multipleObj[num] : null, //col.classList.contains('multiplefiltercol'),
        values,
        valueElts = tbodyElt.querySelectorAll('tr td:nth-child(' + num + ')');
      if (multiple) {
        values = Object.keys(multiple); //multiple.values || [0,1,2,3];
        selElt.classList.add('multiple');
      } else {
        if (_this.items) {
          var fnFormat = _this.formatagesColCourants[i]; // || (function(e){return e;
          values = _this.items.reduce((a, c) => {
            let v = obtientValeur(fnFormat, c);
            if (a.indexOf(v) == -1) {
              a.push(v);
            }
            return a;
          }, []);
        }
        values.sort(function (_a, _b) {
          var a = typeof _a == 'string' ? _a.toLowerCase() : _a,
            b = typeof _b == 'string' ? _b.toLowerCase() : _b;
          return +(a > b) || +(a === b) - 1;
        });
      }
      values.unshift('');
      values.forEach(function (v) {
        var optElt = document.createElement('option'),
          v0 = v;
        optElt.value = v;
        if (multiple && v !== '') {
          v0 = multiple[v];
          optElt.className = 'status-' + v;
        }
        optElt.innerHTML = v0;
        selElt.appendChild(optElt);
      });
    });
  }
  formateEnteteFiltre(formats) {
    this.formatagesColCourants = formats || [];
  }

  formate(tableau) {
    this.formatagesColCourants = tableau.cellules.map((cell) => {
      return cell.prop;
    });
    this.numcolsExcluded = tableau.entetes.reduce((a,entete,i) => {
      if(entete.nonfiltre) {
        a.push(i+1);
      }
      return a;
    },[]);
  }

  doTableCurrentFilters() {
    var selElt;
    for (var selEltId in this.currentFilters) {
      selElt = document.getElementById(selEltId);
      if (selElt) {
        selElt.value = this.currentFilters[selEltId];
        onTableAction.call(this, { target: selElt, type: 'change' });
        //changefiltercolselect(selElt, o.rows );
      }
    }
  }

  resetCurrentFilters() {
    this.currentFilters = {};
  }

  addCurrentFilter(selElt) {
    this.currentFilters[selElt.id] = selElt.value;
  }

  addSortFunctions(tableId, sortfunctions) {
    if (!SORT_FUNCTIONS[tableId]) {
      SORT_FUNCTIONS[tableId] = [];
    }
    if (!sortfunctions) {
      return;
    }
    sortfunctions.forEach(function (f, i) {
      if (f) {
        SORT_FUNCTIONS[tableId][i] = f;
      }
    });
    return SORT_FUNCTIONS[tableId].length;
  }

  sortTable(
    tableId,
    numcolsExcluded,
    numColSortedByDefault,
    sortfunctions,
    nochangedir
  ) {
    var indexColSortedByDefault,
      indexesToSort,
      tableElt = document.getElementById(tableId),
      tbodyElt = tableElt.querySelector('tbody:last-child'),
      allcols = tableElt.querySelectorAll('thead tr th');
    if (!numColSortedByDefault || typeof numColSortedByDefault == 'number') {
      indexColSortedByDefault =
        numColSortedByDefault === null || numColSortedByDefault === undefined
          ? 0
          : numColSortedByDefault - 1;
      indexesToSort = [indexColSortedByDefault + 1];
    } else {
      indexesToSort = numColSortedByDefault;
    }

    this.addTreatment(TREATMENT_SORT);
    this.addSortFunctions(tableId, sortfunctions);
    Array.prototype.forEach.call(allcols, function (c, i) {
      var fc;
      if (!numcolsExcluded || numcolsExcluded.indexOf(i + 1) === -1) {
        if (!c.querySelector('.' + TREATMENT_SORT)) {
          if (
            (fc = c.firstChild) &&
            fc.nodeType == Node.TEXT_NODE &&
            fc.nodeValue
          ) {
            c.innerHTML = c.innerHTML.replace(
              fc.nodeValue,
              '<span class="' + TREATMENT_SORT + '">' + fc.nodeValue + '</span>'
            );
          }
        }
      }
    });
    indexesToSort.forEach(function (i) {
      sortTableByCol(
        tbodyElt,
        i - 1,
        SORT_FUNCTIONS[tableId][i - 1],
        nochangedir
      );
    });
  }

  sortTableByCol(tbodyElt, indexCol, sortfn, forcesamedir) {
    let osort;
    if (
      forcesamedir &&
      (osort = this.currentSorts[tbodyElt]) &&
      osort[indexCol]
    ) {
      osort[indexCol] = -osort[indexCol];
    }
    sortTableByCol(tbodyElt, indexCol, sortfn);
  }
}
