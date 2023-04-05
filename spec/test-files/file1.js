function greet() {
  performance.mark('file1.greet');
  console.log('Hello, world!');
  performance.measure('file1 - greet duration', 'file1.greet');
}
function sum(a, b) {
  performance.mark('file1.sum');
  performance.measure('file1 - sum duration', 'file1.sum');
  return a + b;
}
class MyClass {
  constructor(name) {
    this.name = name;
  }
  sayName() {
    console.log(this.name);
  }
}