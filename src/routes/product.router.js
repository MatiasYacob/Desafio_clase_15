
//Imports
import { Router } from "express";
import ProductManager from '../managers/ProductManager.js';


//Constantes Globales
const manager = new ProductManager('products.json');
const router = Router();


//Muestra todo los Productos en el Json de Productos GET
router.get('/', (req, res) => {
    const { limit } = req.query;
    let productsToSend = manager.getProducts();
    console.log("aca estoy");
    if (limit) {
        const parsedLimit = parseInt(limit);
        if (!isNaN(parsedLimit)) {
            productsToSend = productsToSend.slice(0, parsedLimit);
        }
    }

    res.json(productsToSend);
});

//Muestra un producto por pid GET
router.get('/:pid', (req, res) => {
    const productpid = parseInt(req.params.pid);
    const product = manager.getProductBypid(productpid);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

//Agrega un producto nuevo POST
router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
    }

    const newProduct = {
        title,
        description,
        code,
        price: Number(price),
        status: true,
        stock: Number(stock),
        category,
        thumbnails: thumbnails ? Array.isArray(thumbnails) ? thumbnails : [thumbnails] : [],
        pid: manager.getNextProductpid() // Obtener el próximo pid
    };

    manager.addProduct(newProduct);

    res.status(201).json(newProduct);
});


//Actualizar un producto PUT

router.put("/:pid", (req, res) => {

    const pid = parseInt(req.params.pid);


    const updatedProduct = req.body;

    // Actualizar el producto
    const product = manager.updateProduct(pid, updatedProduct);
    if (!product) {
        res.status(404).json({ error: "Producto no encontrado" });
        return;
    }

    // Devolver el producto actualizado
    res.json(product);
});


// Definir la ruta para borrar el producto DELETE
router.delete("/:pid", (req, res) => {
    // Obtener el ID del producto
    const pid = parseInt(req.params.pid);

    // Eliminar el producto
    const product = manager.deleteProduct(pid);
    if (!product) {
        res.status(404).json({ error: "Producto no encontrado" });
        return;
    }

    // Devolver un mensaje 
    res.json({ message: "Producto eliminado" });
});




export default router;