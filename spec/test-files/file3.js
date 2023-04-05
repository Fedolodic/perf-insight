const obj = {
  prop1: 'value1',
  prop2: 'value2'
};
function printKeys(obj) {
  performance.mark('file3.printKeys');
  Object.keys(obj).forEach(key => {
    console.log(key);
  });
  performance.measure('file3 - printKeys duration', 'file3.printKeys');
}
function printValues(obj) {
  performance.mark('file3.printValues');
  Object.values(obj).forEach(value => {
    console.log(value);
  });
  performance.measure('file3 - printValues duration', 'file3.printValues');
}