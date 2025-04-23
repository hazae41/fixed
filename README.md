# Fixed

Fixed-point numbers in idiomatic TypeScript

```bash
npm i @hazae41/fixed
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/fixed)

## Features

### Current features
- 100% TypeScript and ESM
- No external dependencies

## Usage 

```tsx
const eth = new Fixed(123n, 0) // 123n
const wei = fixed.move(18) // 123000000000000000000n

const wei2 = wei.add(new Fixed(1n, 18)) // 123000000000000000001n

const str = wei2.toString() // "123.000000000000000001"
```