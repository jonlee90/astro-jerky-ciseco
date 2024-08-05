// Define the BundlePack interface
export interface BundlePack {
  id: number;
  title: string;
  description: string;
  bigQuantity: number;
  smallQuantity: number;
  price: string;
  msrp: string;
}

// Export the BundlePacks array
export const BundlePacks: BundlePack[] = [
  {
    id: 1,
    title: 'GIFT PACK',
    description: '2 Big & 1 Small Bags',
    bigQuantity: 2,
    smallQuantity: 1,
    price: '28',
    msrp: '31.97'
  },
  {
    id: 2,
    title: 'ROAD TRIP PACK',
    description: '3 Big & 2 Small Bags',
    bigQuantity: 3,
    smallQuantity: 2,
    price: '46',
    msrp: '51.95'
  },
  {
    id: 3,
    title: 'CAMPING PACK',
    description: '5 Big & 3 Small Bags',
    bigQuantity: 5,
    smallQuantity: 3,
    price: '75',
    msrp: '83.92'
  },
  {
    id: 4,
    title: 'SMALL VARIETY PACK',
    description: '11 Small Bags',
    bigQuantity: 0,
    smallQuantity: 11,
    price: '77',
    msrp: '87.89'
  },
  {
    id: 5,
    title: 'BIG VARIETY PACK',
    description: '11 Big Bags',
    bigQuantity: 11,
    smallQuantity: 0,
    price: '119',
    msrp: '131.89'
  },
  {
    id: 6,
    title: "ASTRO'S MUNCHIES PACK",
    description: '11 Big & 11 Small Bags',
    bigQuantity: 11,
    smallQuantity: 11,
    price: '175',
    msrp: '219.78'
  }
];
