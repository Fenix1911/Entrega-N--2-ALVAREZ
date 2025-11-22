import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get('/api/products', (req, res) => {
  const products = productManager.getProducts();
  res.json(products);
})

router.get('/api/products/:pid', async (req, res) => {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ error: "El producto no fue encontrado" });
    res.json(product);
});

router.post('/api/products', async (req, res) => {
    const newProduct = await productManager.addProduct({ 
        title: req.body.title,
        description: req.body.description,
        code: req.body.code,
        price: req.body.price,
        status: req.body.status ?? true,
        stock: req.body.stock,
        category: req.body.category,
        thumbnails: req.body.thumbnails || []
     });
    res.status(201).json(newProduct);
});

router.put('/api/products/:pid', async (req, res) => {
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    if (!updatedProduct) return res.status(404).json({ error: "El producto no fue encontrado" });
    res.json(updatedProduct);
});

router.delete('/api/products/:pid', async (req, res) => {
    const result = await productManager.deleteProduct(req.params.pid);
    if (!result) return res.status(404).json({ error: "El producto no fue encontrado" });
    res.json({ message: "Producto eliminado exitosamente", products: result });
});

export default router;