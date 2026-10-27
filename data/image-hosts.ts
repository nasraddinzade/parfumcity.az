/**
 * External hosts allowed for next/image. Add the host of any absolute photo URL
 * you put into data/product-images.json. Kept separate from data/images.ts
 * because next.config.ts imports it and cannot load JSON modules.
 */
export const imageHosts: readonly string[] = [];
