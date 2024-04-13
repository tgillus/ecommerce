export const ProductEvent = {
  CREATE_PRODUCT: 'ecommerce:product:create',
} as const;
export type ProductEvent = (typeof ProductEvent)[keyof typeof ProductEvent];
