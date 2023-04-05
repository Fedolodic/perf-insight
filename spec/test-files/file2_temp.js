const myArray = [1, 2, 3, 4, 5];
function multiplyByTwo(arr) {
  performance.mark('file2_temp.multiplyByTwo');
  performance.measure('file2_temp - multiplyByTwo duration', 'file2_temp.multiplyByTwo');
  return arr.map(item => item * 2);
}
function filterEvens(arr) {
  performance.mark('file2_temp.filterEvens');
  performance.measure('file2_temp - filterEvens duration', 'file2_temp.filterEvens');
  return arr.filter(item => item % 2 === 0);
}