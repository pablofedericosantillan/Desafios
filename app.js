// const express = require('express');
// const ProductManager = require('./product-manager.js')

import express from 'express';
import ProductManager from './product-manager.js';

const productManager = new ProductManager("./products.txt"); 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//A
app.get('/api/products', async (req, res) => {
    const limit = req.query;
    const products  = await productManager.getProducts({ limit });
    res.json(products)
});

//B
app.get('/api/products/:pid', async (req, res) => {
    const product  = await productManager.getProductById(req.params.pid);
    res.json(product) 
});

const port = 8080;
const server = app.listen(port, () => {
    console.log(`server listen http://localhost:${port}`);
});

server.on('error', error => {
    console.log('error server:', error);
});

