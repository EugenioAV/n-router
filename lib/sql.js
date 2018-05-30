exports.get = function (obj, signification, getFormatted) {  
  let sentence = { str: '', value: signification };
  const keys = Object.keys(obj);

  sentence = formationOfWhere(sentence, obj, keys, getFormatted);
  sentence = formationOfNullObj(sentence, obj['null']);

  return sentence;
};

function formationOfNullObj(sentence, nullObj) {
  if (nullObj) {
    const nullObjKey = Object.keys(nullObj);
    for (let i=0; i < nullObjKey.length; i++) {
      switch (nullObjKey[i]) {
        case 'limit' : sentence.str += ' LIMIT ' + nullObj[nullObjKey[i]]; break;
        case 'offset' : sentence.str += ' OFFSET ' + nullObj[nullObjKey[i]]; break;
      }
    }
  }

  return sentence;
}

function formationOfWhere(sentence, obj, keys, getFormatted) {
  let amp = 'WHERE ';
  let num = 0;

  for (let i=0; i < keys.length; i++) {
    const value = obj[keys[i]];
    if (typeof value === 'object' && keys[i] != 'null') {
      const deepKeys = Object.keys(obj[keys[i]]);
      for (let k=0; k < deepKeys.length; k ++) {
        let deepKey = deepKeys[k];     
        let sign = getSign(deepKey);
        if (!sign) continue;
        sentence.str += amp + keys[i] + sign + getFormatted(++num);
        sentence.value.push(getValue(value[deepKey]));
        amp = ' && ';
      }
    } else if (keys[i] != 'null'){
      sentence.str += amp + keys[i] + ' = ' + getFormatted(++num);
      sentence.value.push(getValue(value));
    }
    amp = ' && ';
  }

  return sentence;
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
