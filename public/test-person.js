const Person = require('./person')

const p1 = new Person ('bill',20)
const p2 = new Person ('min',25)

console.log(p1)
console.log('' + p1)
console.log(JSON.stringify(p2,null,4))