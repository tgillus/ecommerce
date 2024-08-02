export const ProductEvent = {
  CREATE_PRODUCT: 'ecommerce:product:create',
  READ_PRODUCT: 'ecommerce:product:read',
} as const;
export type ProductEvent = (typeof ProductEvent)[keyof typeof ProductEvent];
