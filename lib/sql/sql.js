exports.get = function (sql, obj) {
  const keys = Object.keys(obj);
  if (keys == 0) return sql;
  var amp = ' WHERE ';
  for (var i=0; i < keys.length; i++) {
    const value = obj[keys[i]];
    if (typeof value === 'object' && keys[i] != 'null') {
      const deepKeys = Object.keys(obj[keys[i]]);
      for (var k=0; k < deepKeys.length; k ++) {
        var sign = '';
        var deepKey = deepKeys[k];
        switch (deepKey) {
        case 'eq' : sign = '='; break;
        case 'ne' : sign = '!='; break;
        case 'gt' : sign = '>'; break;
        case 'lt' : sign = '<'; break;
        case 'gte' : sign = '>='; break;
        case 'lte' : sign = '<='; break;
        default: continue;
        }
        sql += amp + keys[i] + sign + value[deepKey];
        amp = ' && ';
      }
    } else if (keys[i] != 'null'){
      sql += amp + keys[i] + '=' + value;
    }
    amp = ' && ';
  }

  const nullObj = obj['null'];
  if (nullObj) {
    const nullObjKey = Object.keys(nullObj);
    for (i=0; i < nullObjKey.length; i++) {
      switch (nullObjKey[i]) {
      case 'limit' : sql += ' LIMIT ' + nullObj[nullObjKey[i]]; break;
      case 'offset' : sql += ' OFFSET ' + nullObj[nullObjKey[i]]; break;
      }
    }
  }  

  return sql;
};
