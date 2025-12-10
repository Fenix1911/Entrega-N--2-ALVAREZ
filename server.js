import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';


import productsRouter from './routes/products_routes.js';
import cartsRouter from './routes/carts_routes.js';
import ProductManager from './dao/ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express()
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


const productManager = new ProductManager(path.join(__dirname, 'data', 'products.json'));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


app.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});


app.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});

const httpServer = app.listen(8080, () => {
    console.log("Servidor escuchando en puerto 8080");
});


const io = new Server(httpServer);

app.set('io', io);

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');
    socket.emit('initialProducts', await productManager.getProducts());
});
