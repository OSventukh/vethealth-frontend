export function replacePropertyName(
  obj: { [key: string]: any } | [],
  oldName: string,
  newName: string
) {
  let newObj: { [key: string]: any } = Array.isArray(obj) ? [] : {};
  if (Array.isArray(obj)) {
    obj.forEach(function (item, index) {
      newObj[index] = replacePropertyName(item, oldName, newName);
    });
  } else if (typeof obj === 'object') {
    Object.keys(obj).forEach(function (key) {
      let newKey = key === oldName ? newName : key;
      let value = obj[key];
      if (key === oldName && typeof value === 'number') {
        obj[key] = value + 'px';
      }
      newObj[newKey] = replacePropertyName(obj[key], oldName, newName);
    });
  } else {
    newObj = obj;
  }

  return newObj;
}