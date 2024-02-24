export enum PrimaryColor {
  Light = '#FFFAF3',
  Dark = '#050000',
}

export function opositeColor(color: PrimaryColor | string): PrimaryColor {
  return color === PrimaryColor.Light ? PrimaryColor.Dark : PrimaryColor.Light;
}

export enum SecondaryColor {
  Yellow = '#FFD44A',
  Blue = '#2974ED',
  Orange = '#FF6348',
  Rose = '#FFB5F9',
  Green = '#00A698',
}
