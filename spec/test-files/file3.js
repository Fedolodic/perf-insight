const obj = {
  prop1: 'value1',
  prop2: 'value2'
};
function printKeys(obj) {
  Object.keys(obj).forEach(key => {
    console.log(key);
  });
}
function printValues(obj) {
  Object.values(obj).forEach(value => {
    console.log(value);
  });
}