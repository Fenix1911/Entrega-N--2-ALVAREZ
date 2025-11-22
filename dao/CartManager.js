import fs from "fs";
import path from "path";

export default class CartManager {
    constructor(){
        this.path = path.join("src","data","carts.json");
    }
    async getCarts(){
        if(!fs.existsSync(this.path)){
            await fs.promises.writeFile(this.path, JSON.stringify([], null, 2));
        }
        const carts = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(carts);
    }

    async createCart(){
        const carts = await this.getCarts();
        const newId = carts.length ? carts[carts.length - 1].id + 1 : 1;

        const newCart = {
            id: newId,
            products: []
        };

        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }
    async getCartById(id){
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === id);
    }
    async addProductToCart(cartId, productId){
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        if(cartIndex === -1) return null;
    
        const product = carts[cartIndex].products.find(p => p.productId === productId);
        if(product){
            product.quantity += 1;
        } else {
            carts[cartIndex].products.push({ productId, quantity: 1 });
        }
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return carts[cartIndex];
    }
}

