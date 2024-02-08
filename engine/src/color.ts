export class Color {
  constructor(
    public red: number,
    public green: number,
    public blue: number,
    public alpha = 1.0
  ) {}

  static fromHex(hex: string) {
    const red = parseInt(hex.slice(1, 3), 16) / 255
    const green = parseInt(hex.slice(3, 5), 16) / 255
    const blue = parseInt(hex.slice(5, 7), 16) / 255
    return new Color(red, green, blue)
  }
}
