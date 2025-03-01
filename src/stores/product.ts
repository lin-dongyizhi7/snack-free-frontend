import { defineStore } from "pinia";
import { product_list } from "../views/mall/products";

export const useProductsStore = defineStore("products", {
  state: () => ({
    products: product_list,
  }),
  actions: {
    setProducts(products: any) {
      this.products = products;
    },
    addProduct(product: any) {
      this.products.unshift(product);
    },
    removeProduct(product: any) {
      const index = this.products.findIndex((p) => p.id === product.id);
      if (index !== -1) {
        this.products.splice(index, 1);
      }
    },
    removeProducts(productsToRemove: any[]) {
      this.products = this.products.filter(
        (product) =>
          !productsToRemove.some((toRemove) => toRemove.id === product.id)
      );
    },
  },
});
