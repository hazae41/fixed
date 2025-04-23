import { ZeroHexString } from "@hazae41/hex"
import { BigInts } from "libs/bigint/index.js"

export interface ZeroHexFixedInit<D extends number = number> {
  readonly value: ZeroHexString,
  readonly decimals: D
}

export class ZeroHexFixedInit<D extends number = number> {

  constructor(
    readonly value: ZeroHexString,
    readonly decimals: D
  ) { }

}

export interface BigIntFixedInit<D extends number = number> {
  readonly value: bigint,
  readonly decimals: D
}

export class BigIntFixedInit<D extends number = number> {

  constructor(
    readonly value: bigint,
    readonly decimals: D
  ) { }

}

export namespace Fixed {

  export type From<D extends number = number> =
    | BigIntFixedInit<D>
    | ZeroHexFixedInit<D>

}

export class Fixed<D extends number = number> implements BigIntFixedInit {

  readonly tens: bigint

  constructor(
    readonly value: bigint,
    readonly decimals: D
  ) {
    this.tens = BigInts.tensOf(decimals)
  }

  static unit<D extends number = number>(decimals: D) {
    return new Fixed(BigInts.tensOf(decimals), decimals)
  }

  static from<D extends number = number>(init: Fixed.From<D>) {
    if (init instanceof Fixed)
      return init
    if (typeof init.value === "string")
      return Fixed.fromZeroHexString(init.value, init.decimals)
    return new Fixed(init.value, init.decimals)
  }

  static fromZeroHexInit<D extends number>(init: ZeroHexFixedInit<D>) {
    return Fixed.fromZeroHexString(init.value, init.decimals)
  }

  static fromBigIntInit<D extends number>(init: BigIntFixedInit<D>) {
    return new Fixed(init.value, init.decimals)
  }

  static fromZeroHexString<D extends number>(value: ZeroHexString, decimals: D) {
    return new Fixed(ZeroHexString.toBigInt(value), decimals)
  }

  static fromDecimalString<D extends number>(text: string, decimals: D) {
    const [whole = "0", decimal = "0"] = text.split(".")

    const value = BigInt(whole + decimal.padEnd(decimals, "0").slice(0, decimals))

    return new Fixed(value, decimals)
  }

  static fromString<D extends number>(text: string, decimals: D) {
    if (ZeroHexString.String.is(text))
      return Fixed.fromZeroHexString(text, decimals)
    return Fixed.fromDecimalString(text, decimals)
  }

  toZeroHexInit() {
    return new ZeroHexFixedInit(this.toZeroHexString(), this.decimals)
  }

  toBigIntInit() {
    return new BigIntFixedInit(this.value, this.decimals)
  }

  toZeroHexString() {
    return ZeroHexString.fromBigInt(this.value)
  }

  toDecimalString() {
    const raw = this.value.toString().padStart(this.decimals, "0")

    const whole = raw.slice(0, raw.length - this.decimals).replaceAll("0", " ").trimStart().replaceAll(" ", "0")
    const decimal = raw.slice(raw.length - this.decimals).replaceAll("0", " ").trimEnd().replaceAll(" ", "0")

    if (!decimal)
      return (whole || "0")

    return `${whole || "0"}.${decimal}`
  }

  toString() {
    return this.toDecimalString()
  }

  toJSON() {
    return this.toZeroHexInit()
  }

  as(decimals: number) {
    return new Fixed(this.value, decimals)
  }

  move(decimals: number) {
    if (this.decimals > decimals)
      return new Fixed(this.value / BigInts.tensOf(this.decimals - decimals), decimals)
    if (this.decimals < decimals)
      return new Fixed(this.value * BigInts.tensOf(decimals - this.decimals), decimals)
    return this
  }

  add(other: Fixed) {
    const dx = this.decimals
    const dy = other.decimals

    const dr = Math.max(dx, dy)
    const tr = BigInts.tensOf(dr)

    const tx = this.tens
    const ty = other.tens

    const vx = this.value
    const vy = other.value

    return new Fixed((vx * (tr / tx)) + (vy * (tr / ty)), dr)
  }

  sub(other: Fixed) {
    const dx = this.decimals
    const dy = other.decimals

    const dr = Math.max(dx, dy)
    const tr = BigInts.tensOf(dr)

    const tx = this.tens
    const ty = other.tens

    const vx = this.value
    const vy = other.value

    return new Fixed((vx * (tr / tx)) - (vy * (tr / ty)), dr)
  }

  mul(other: Fixed) {
    const dx = this.decimals
    const dy = other.decimals

    const dr = dx + dy

    const vx = this.value
    const vy = other.value

    return new Fixed(vx * vy, dr)
  }

  div(other: Fixed) {
    const dx = this.decimals
    const ty = other.tens

    const vx = this.value
    const vy = other.value

    return new Fixed((vx * ty) / vy, dx)
  }

  floor() {
    return new Fixed(this.value - (this.value % this.tens), this.decimals)
  }

  ceil() {
    return new Fixed(this.value + (this.tens - (this.value % this.tens)), this.decimals)
  }

  round() {
    return new Fixed(this.value + (this.tens / 2n) - ((this.value + (this.tens / 2n)) % this.tens), this.decimals)
  }

}
