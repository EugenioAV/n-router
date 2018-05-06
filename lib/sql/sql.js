exports.get = function (sql, obj, db, db_method) {  
  let query = {
    str: sql,
    value: []
  };

  const keys = Object.keys(obj);
  if (keys == 0) return query;
  const getFormatted = (db == 'mysql') ? getFormatMySQL : getFormatPostres;

  if (db_method == 'procedure' || db_method == 'function') return getStoredData(query, keys, obj, getFormatted);

 
  let amp = 'WHERE ';
  for (let i=0; i < keys.length; i++) {
    const value = obj[keys[i]];
    if (typeof value === 'object' && keys[i] != 'null') {
      const deepKeys = Object.keys(obj[keys[i]]);
      for (let k=0; k < deepKeys.length; k ++) {
        let sign = '';
        let deepKey = deepKeys[k];
        switch (deepKey) {
        case 'eq' : sign = ' = '; break;
        case 'ne' : sign = ' != '; break;
        case 'gt' : sign = ' > '; break;
        case 'lt' : sign = ' < '; break;
        case 'gte' : sign = ' >= '; break;
        case 'lte' : sign = ' <= '; break;
        default: continue;
        }
        query.str += amp + keys[i] + sign + getFormatted(i);
        query.value.push(getValue(value[deepKey]));
        amp = ' && ';
      }
    } else if (keys[i] != 'null'){
      query.str += amp + keys[i] + ' = ' + getFormatted(i);
      query.value.push(getValue(value));
    }
    amp = ' && ';
  }

  const nullObj = obj['null'];
  if (nullObj) {
    const nullObjKey = Object.keys(nullObj);
    for (let i=0; i < nullObjKey.length; i++) {
      switch (nullObjKey[i]) {
      case 'limit' : query.str += ' LIMIT ' + nullObj[nullObjKey[i]]; break;
      case 'offset' : query.str += ' OFFSET ' + nullObj[nullObjKey[i]]; break;
      }
    }
  }  

  return query;
};

function getStoredData(query, keys, obj, getFormatted) {
  let str = '(';

  for (let i = 0; i < keys.length - 1 ; i++) {
    str += getFormatted(i) + ', ';
    query.value.push(getValue(obj[keys[i]]));
  }

  str += getFormatted(keys.length - 1) + ')';
  query.value.push(getValue(obj[keys[keys.length - 1]]));
  query.str = query.str.replace('()', str);

  return query;
}

function getFormatPostres(num) {
  return '$' + (++num);
}

function getFormatMySQL() {
  return '?';
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function getValue(value) {
  const signification = (isNumeric(value)) ? Number.parseInt(value) : value;
  return signification;
} 