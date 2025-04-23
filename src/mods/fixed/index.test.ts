import { Fixed } from "./index.js"

const a = new Fixed(123456n, 0)

console.log(a.as(2).toString())