exports.get = function (sql, obj, db) {  
  let query = {
    str: sql,
    value: []
  };

  const keys = Object.keys(obj);
  if (keys == 0) return query;

  const getFormatted = (db == 'mysql') ? getFormatMySQL : getFormatPostres;
  var amp = 'WHERE ';
  for (var i=0; i < keys.length; i++) {
    const value = obj[keys[i]];
    if (typeof value === 'object' && keys[i] != 'null') {
      const deepKeys = Object.keys(obj[keys[i]]);
      for (var k=0; k < deepKeys.length; k ++) {
        var sign = '';
        var deepKey = deepKeys[k];
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
    for (i=0; i < nullObjKey.length; i++) {
      switch (nullObjKey[i]) {
      case 'limit' : query.str += ' LIMIT ' + nullObj[nullObjKey[i]]; break;
      case 'offset' : query.str += ' OFFSET ' + nullObj[nullObjKey[i]]; break;
      }
    }
  }  

  return query;
};

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