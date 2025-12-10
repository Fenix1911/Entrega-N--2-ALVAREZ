import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const productManager = new ProductManager(
    path.join(__dirname, '..', 'data', 'products.json')
);

router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
})

router.get('/:pid', async (req, res) => {
    const product = await productManager.getProductById(parseInt(req.params.pid));
    if (!product) return res.status(404).json({ error: "El producto no fue encontrado" });
    res.json(product);
});

router.post('/', async (req, res) => {
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

    const io = req.app.get('io');
    io.emit('updatedProducts', await productManager.getProducts()); 

    res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    if (!updatedProduct) return res.status(404).json({ error: "El producto no fue encontrado" });
    res.json(updatedProduct);
});

router.delete('/:pid', async (req, res) => {
    const result = await productManager.deleteProduct(req.params.pid);
    if (!result) return res.status(404).json({ error: "El producto no fue encontrado" });

    const io = req.app.get('io');
    io.emit('updatedProducts', await productManager.getProducts());

    res.json({ message: "Producto eliminado exitosamente", products: result });
});

export default router;