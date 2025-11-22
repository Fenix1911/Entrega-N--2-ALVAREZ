import { Router } from "express";
import CartManager from "../dao/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
    const cart = await cartManager.createCart();
    res.json({ status: "success", cart });
});

router.get("/:cid", async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json({ products: cart.products });
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json({ status: "updated", cart });
});

export default router;