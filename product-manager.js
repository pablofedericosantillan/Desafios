// const fs = require("fs");
import fs from 'fs';

// ProductManager definition
export default class ProductManager {
  path;

  constructor(route) {
    this.path = route;
  }

  async getProducts({ limit }) {
    const products = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
    
    if (limit) products.slice(0, limit);
    return products;
  }

  async getProductById(id) {
    const allProducts = await this.getProducts();
    const product = allProducts.find((p) => p.id === id);
    
    if (!product) {
        console.error("Product not found");
        return;
    }
    return product;
  }

  async addProduct({
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
  }) {

    const allProducts = await this.getProducts();
    const productAlreadyExists = allProducts.find((p) => p.code === code);

    if (productAlreadyExists) {
        console.error("Product already exist");
        return;
    }

    allProducts.push({
    id: allProducts.length>0 ? (allProducts[allProducts.length - 1].id+1) : 0,
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    });
    
    await fs.promises.writeFile(this.path, JSON.stringify(allProducts));

    return "Product successfully added";
  }

  async updateProduct(
    productId,
    {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    }
  ) {
    const allProducts = await this.getProducts();
    const indexProduct = allProducts.findIndex((p) => p.id === productId)

    if (indexProduct<0) {
      console.error("Product not found");
      return;
    }

    allProducts[indexProduct] = {
    id: allProducts[indexProduct].id,
    title: title ?? allProducts[indexProduct].title,
    description: description ?? allProducts[indexProduct].description,
    price: price ?? allProducts[indexProduct].price,
    thumbnail: thumbnail ?? allProducts[indexProduct].thumbnail,
    code: code ?? allProducts[indexProduct].code,
    stock: stock ?? allProducts[indexProduct].stock,
    };
    
    await fs.promises.writeFile(this.path, JSON.stringify(allProducts));

    return "Product successfully updated";
  }

  async deleteProduct(productId) {
    const allProducts = await this.getProducts();
    const indexProduct = allProducts.findIndex((p) => p.id === productId)

    if (indexProduct<0) {
      console.error("Product not found");
      return;
    }
    const productsUpdated = allProducts.splice(indexProduct-1, 1);


    await fs.promises.writeFile(this.path, JSON.stringify(productsUpdated));

    return "Product successfully deleted";
  }
}

