const obj = {
  prop1: 'value1',
  prop2: 'value2'
};
function printKeys(obj) {
  performance.mark('file3_temp.printKeys');
  Object.keys(obj).forEach(key => {
    console.log(key);
  });
  performance.measure('file3_temp - printKeys duration', 'file3_temp.printKeys');
}
function printValues(obj) {
  performance.mark('file3_temp.printValues');
  Object.values(obj).forEach(value => {
    console.log(value);
  });
  performance.measure('file3_temp - printValues duration', 'file3_temp.printValues');
}