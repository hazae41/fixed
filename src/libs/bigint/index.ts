
export namespace BigInts {

  export function tensOf(value: number) {
    return 10n ** BigInt(value)
  }

}