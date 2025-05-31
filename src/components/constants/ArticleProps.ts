export const CardType = {
    FeaturedCard: 'featuedCard',
    AtricleList: 'atricleList'
} as const;
  
export type CardType = typeof CardType[keyof typeof CardType];