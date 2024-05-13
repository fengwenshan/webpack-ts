const sum = (a: number, b: number) => {
  return a + b
}

class Person {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

const p = new Person('Tom', 18)
console.log(p.name)

console.log(sum(1, 2))

const p1 = new Promise(resolve => {
  resolve(1)
})

p1.then(res => {
  console.log(res)
}).then(err => {
  console.log(err)
})

console.log(process.env.NODE_ENV, '123')
console.log(dayjs().format('YYYY-MM-DD'))

const pro = new Promise(resolve => {
  resolve(1)
})

pro.then(res => {
  console.log(res)
})
