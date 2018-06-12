exports.get = function (method, obj, getFormatted) {  
  let sql = { query: method, value: [] };
  const keys = Object.keys(obj);

  sql = formationOfWhere(sql, obj, keys, getFormatted);
  sql = formationOfNullObj(sql, obj['null']);

  return sql;
};

function formationOfNullObj(sql, nullObj) {
  if (nullObj) {
    const nullObjKey = Object.keys(nullObj);
    for (let i=0; i < nullObjKey.length; i++) {
      switch (nullObjKey[i]) {
        case 'limit' : sql.query += ' LIMIT ' + nullObj[nullObjKey[i]]; break;
        case 'offset' : sql.query += ' OFFSET ' + nullObj[nullObjKey[i]]; break;
      }
    }
  }

  return sql;
}

function formationOfWhere(sql, obj, keys, getFormatted) {
  let amp = ' WHERE ';
  let num = 0;

  for (let i=0; i < keys.length; i++) {
    const value = obj[keys[i]];
    if (typeof value === 'object' && keys[i] != 'null') {
      const deepKeys = Object.keys(obj[keys[i]]);
      for (let k=0; k < deepKeys.length; k ++) {
        let deepKey = deepKeys[k];     
        let sign = getSign(deepKey);
        if (!sign) continue;
        sql.query += amp + keys[i] + sign + getFormatted(++num);
        sql.value.push(getValue(value[deepKey]));
        amp = ' && ';
      }
    } else if (keys[i] != 'null'){
      sql.query += amp + keys[i] + ' = ' + getFormatted(++num);
      sql.value.push(getValue(value));
    }
    amp = ' && ';
  }

  return sql;
}


function getSign(option) {
  let sign;

  switch (option) {
    case 'eq' : sign = ' = '; break;
    case 'ne' : sign = ' != '; break;
    case 'gt' : sign = ' > '; break;
    case 'lt' : sign = ' < '; break;
    case 'gte' : sign = ' >= '; break;
    case 'lte' : sign = ' <= '; break;
  }

  return sign;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function getValue(value) {
  const signification = (isNumeric(value)) ? Number.parseInt(value) : value;
  return signification;
} 
