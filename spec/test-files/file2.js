const myArray = [1, 2, 3, 4, 5];
function multiplyByTwo(arr) {
  performance.mark('file2.multiplyByTwo');
  performance.measure('file2 - multiplyByTwo duration', 'file2.multiplyByTwo');
  return arr.map(item => item * 2);
}
function filterEvens(arr) {
  performance.mark('file2.filterEvens');
  performance.measure('file2 - filterEvens duration', 'file2.filterEvens');
  return arr.filter(item => item % 2 === 0);
}