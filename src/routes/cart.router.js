import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const manager = new CartManager("cart.json", "products.json");

router.post("/", async (req, res) => {
    // Generar un cid único para el carrito
    const newcid = manager.getNextCartcid();

    // Obtener los productos del cuerpo de la solicitud
    const products = req.body.products || [];

    // Crear el nuevo carrito
    const newCarrito = {
        cid: newcid,
        products: products
    };

    // Guardar el nuevo carrito en el archivo JSON utilizando CartManager
    manager.saveNewCartToDisk(newCarrito);

    // Devolver el nuevo carrito creado
    res.status(201).json(newCarrito);
});


router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    const result = manager.addProductToCart(parseInt(cid), parseInt(pid));

    if (!result.success) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({ message: result.message });
});
router.get("/:cid", (req, res) => {
    const { cid } = req.params;

    // Obtener el carrito correspondiente al CID proporcionado
    const cart = manager.getCartByCid(parseInt(cid));

    if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Obtener los detalles de los productos pertenecientes a este carrito
    const productsInCart = manager.getProductsByCartId(parseInt(cid));

    res.status(200).json({ cart, products: productsInCart });
});

export default router;
