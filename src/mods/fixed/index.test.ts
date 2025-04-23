import { ZeroHexString } from "@hazae41/hex"
import { assert, test } from "@hazae41/phobos"
import { Fixed } from "./index.js"

test("fixed", async () => {
  // console.log(new Fixed(BigInt("000123000000000000000000"), 18).toString())

  assert(Fixed.fromDecimalString("0.1").move(2).value === 10n)
  assert(Fixed.fromDecimalString(".1").move(2).value === 10n)
  assert(Fixed.fromDecimalString(".").move(2).value === 0n)
  assert(Fixed.fromDecimalString("0").move(2).value === 0n)

  assert(Fixed.fromDecimalString("0.1").move(2).toString() === "0.1")
  assert(Fixed.fromDecimalString(".1").move(2).toString() === "0.1")

  assert(Fixed.fromDecimalString("1").move(2).toString() === "1")
  assert(Fixed.fromDecimalString("1.0").move(2).toString() === "1")
  assert(Fixed.fromDecimalString("1.00").move(2).toString() === "1")

  assert(Fixed.fromDecimalString("123.456").move(18).round().toString() === "123")
  assert(Fixed.fromDecimalString("123.456").move(18).floor().toString() === "123")
  assert(Fixed.fromDecimalString("123.456").move(18).ceil().toString() === "124")

  assert(Fixed.fromDecimalString("123.654").move(18).round().toString() === "124")
  assert(Fixed.fromDecimalString("123.654").move(18).floor().toString() === "123")
  assert(Fixed.fromDecimalString("123.654").move(18).ceil().toString() === "124")

  assert(Fixed.fromZeroHexString("0x123" as ZeroHexString).as(18).value === 0x123n)
})