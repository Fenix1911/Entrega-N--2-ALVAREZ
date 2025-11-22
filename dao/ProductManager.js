const fs = require ('fs');

class ProductManager {
    constructor (path) {
        this.path = path;
    }
    
    async readFile() {
        try {
            if (fs.existsSync(this.path)) {
                const products = await fs.readFile(this.path, 'utf-8');
                return JSON.parse(products);
            }
            return [];
        }   catch (error) {
            throw new Error(error);
        }
    }    

    async writeFile(products) {
        try {
            await fs.writeFile(this.path, JSON.stringify (products, null, 2));
        } 
        catch (error) {
            throw new Error(error);
        }
    }

    async getProducts() {
        return await this.readFile();
    }
    async getProductById(id) {
        const products = await this.readFile();
        return products.find (product => product.id === id);
    }

    async addProduct(product) {
        const products = await this.readFile();
        const id = products.length ? products[products.length - 1].id + 1 : 1;
        const newProduct = { id, ...product };
        products.push(newProduct);
        await this.writeFile (products);
        return newProduct;
    }

    async updateProduct(id, update) {
        const products = await this.readFile();
        const index = products.findIndex (product => product.id === id);
        if (index === -1) return null;
        update.id = products[index].id,
        products[index] = { ...products[index], ...update };
        await this.writeFile (products);
        return products[index];
    }
    async deleteProduct(id) {
        const products = await this.readFile();
        const filteredProducts = products.filter (product => product.id !== id);
        if (products.length === filteredProducts.length) return false;
        await this.writeFile (filteredProducts);
        return filteredProducts;
    }
}
module.exports = ProductManager;