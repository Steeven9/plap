export interface Size {
  tshirt: string;
  storyPoints: number;
}

export const sizes: Size[] = [
  { tshirt: "XS", storyPoints: 1 },
  { tshirt: "S", storyPoints: 2 },
  { tshirt: "M", storyPoints: 3 },
  { tshirt: "L", storyPoints: 5 },
  { tshirt: "XL", storyPoints: 8 },
  { tshirt: "XXL", storyPoints: 13 },
  { tshirt: "💣", storyPoints: 99 },
  { tshirt: "☕", storyPoints: 0 },
  { tshirt: "None", storyPoints: 0 },
];
