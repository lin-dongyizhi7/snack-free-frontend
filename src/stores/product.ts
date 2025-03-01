import { defineStore } from "pinia";
import type { ProductData } from "../api/products";

export const useProductsStore = defineStore("products", {
  state: () => ({
    products: [] as ProductData[],
  }),
  actions: {
    setProducts(products: ProductData[]) {
      this.products = products;
    },
    addProduct(product: ProductData) {
      this.products.unshift(product);
    },
    removeProduct(product: ProductData) {
      const index = this.products.findIndex((p) => p.id === product.id);
      if (index !== -1) {
        this.products.splice(index, 1);
      }
    },
    removeProducts(productsToRemove: ProductData[]) {
      this.products = this.products.filter(
        (product) =>
          !productsToRemove.some((toRemove) => toRemove.id === product.id)
      );
    },
  },
});
