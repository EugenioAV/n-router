exports.get = function (method, obj, getFormatted) {  
  let query = { sql: method, value: [] };
  const keys = Object.keys(obj);

  query = formationOfWhere(query, obj, keys, getFormatted);
  query = formationOfNullObj(query, obj['null']);

  return query;
};

function formationOfNullObj(query, nullObj) {
  if (nullObj) {
    const nullObjKey = Object.keys(nullObj);
    for (let i=0; i < nullObjKey.length; i++) {
      switch (nullObjKey[i]) {
        case 'limit' : query.sql += ' LIMIT ' + nullObj[nullObjKey[i]]; break;
        case 'offset' : query.sql += ' OFFSET ' + nullObj[nullObjKey[i]]; break;
      }
    }
  }

  return query;
}

function formationOfWhere(query, obj, keys, getFormatted) {
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
        query.sql += amp + keys[i] + sign + getFormatted(++num);
        query.value.push(getValue(value[deepKey]));
        amp = ' && ';
      }
    } else if (keys[i] != 'null'){
      query.sql += amp + keys[i] + ' = ' + getFormatted(++num);
      query.value.push(getValue(value));
    }
    amp = ' && ';
  }

  return query;
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
