function genObject(){
    return {
        name:'tom',
        age:28
    }
}

genObject.method01 = () =>{
    console.log('method01')
}

const obj = genObject()

console.log(obj)

genObject.method01()

console.log(genObject.constructor.name);
