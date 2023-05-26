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
            (tbody = t.parentNode) &&
            (tbody = tbody.parentNode) &&
            (tbody = tbody.parentNode) &&
            (tbody = tbody.parentNode) &&
            (tbody = tbody.querySelector('tbody:last-child'))
          ) {
            rows = tbody.querySelectorAll('tr');
            _this.addCurrentFilter(t);
            tbody.parentNode.classList.remove('staticalternaterows');
            tbody.parentNode.classList.add('dynamicalternaterows');
            changefiltercolselect(t, rows);
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
var changefiltercolselect = function (selElt, rows) {
  var th = selElt.parentNode,
    evenrow = true,
    isMultiple = selElt.classList.contains('multiple'),
    indexCol = Array.prototype.indexOf.call(th.parentNode.children, th),
    v = selElt.value;
  //refreshSomme(null);
  Array.prototype.forEach.call(rows, function (r) {
    var cond,
      td = r.getElementsByTagName('TD')[indexCol],
      hidden,
      echeanceElts; //TODO : COLSPAN !!!!!!!!!!!
    if (isMultiple) {
      cond = !td || td.querySelector('.multipleelt.status-' + v);
    } else {
      let innerText = td.innerText;
      cond = !td || innerText == v;
    }
    cond = v === '' || cond;
    r.classList.toggle('hidden-' + indexCol, !cond);
    hidden = !cond || ~r.className.indexOf('hidden-');
    r.classList.toggle('hidden', hidden);
    if (!hidden) {
      evenrow = !evenrow;
    }
    r.classList.toggle('evenrow', evenrow);
    //..................
    if (!hidden && td) {
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

export default class TableUtils {
  currentFilters = {};
  currentSorts = {};

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

  //<select data-actsortTableByColion='changefiltercolselect' class='filtertableselect'></select>
  //{4:['Non envoye','...']}
  filterTable(tableId, numcolsExcluded, multipleObj) {
    //var ftSelects = document.querySelectorAll('.filtertableselect');

    var tableElt = document.getElementById(tableId),
      tbodyElt = tableElt.querySelector('tbody:last-child'),
      allcols = tableElt.querySelectorAll('thead tr th'),
      selElt;
    tableElt.classList.add('staticalternaterows');
    this.addTreatment(TREATMENT_FILTER);
    Array.prototype.forEach.call(allcols, function (col, i) {
      if (numcolsExcluded && ~numcolsExcluded.indexOf(i + 1)) {
        return;
      }
      if (!(selElt = col.querySelector('.' + TREATMENT_FILTER))) {
        selElt = document.createElement('select');
        selElt.className = TREATMENT_FILTER;
        selElt.id = tableId + '_fts' + i;
        col.appendChild(selElt);
      }
      selElt.innerHTML = '';
      var num = 1 + i,
        multiple = multipleObj ? multipleObj[num] : null, //col.classList.contains('multiplefiltercol'),
        values,
        valueElts = tbodyElt.querySelectorAll('tr td:nth-child(' + num + ')');
      if (multiple) {
        values = Object.keys(multiple); //multiple.values || [0,1,2,3];
        selElt.classList.add('multiple');
      } else {
        values = Array.prototype.reduce.call(
          valueElts,
          function (p, c) {
            if (p.indexOf(c.textContent) === -1) {
              p.push((c.textContent || '').trim());
            }
            return p;
          },
          []
        );
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
}
