import * as fs from "fs";

class CartManager {
    constructor(filePathCarts, filePathProducts) {
        this.cartsPath = filePathCarts;
        this.productsPath = filePathProducts;
        this.loadCartsFromDisk();
        this.loadProductsFromDisk();
    }
    loadCartsFromDisk() {
        try {
            const data = fs.readFileSync(this.cartsPath, "utf8");
            this.carts = JSON.parse(data);
        } catch (error) {
            this.carts = [];
        }
    }
    // Cargar carritos desde el archivo al inicializar la instancia
    loadProductsFromDisk() {
        try {
            const productsData = fs.readFileSync(this.productsPath, "utf8");
            this.productsList = JSON.parse(productsData);
        } catch (error) {
            this.productsList = [];
        }
    }
    getProductsByCartId(cid) {
        const cart = this.carts.find(cart => cart.cid === cid);

        if (!cart) {
            return []; // Si el carrito no se encuentra, devuelve una lista vacía de productos
        }

        const products = cart.products.map(pid => {
            const product = this.productsList.find(p => p.pid === pid);
            return { ...product, quantity: 1 }; // Asume que la cantidad es 1 por producto en este caso
        });

        return products;
    }
    // Guardar un nuevo carrito en el archivo sin sobrescribir
    saveNewCartToDisk(newCarrito) {
        this.carts.push(newCarrito); // Agregar el nuevo carrito a la lista existente
        fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2), "utf8");
    }
    saveCartsToDisk() {
        try {
            fs.writeFileSync(
                this.cartsPath,
                JSON.stringify(this.carts, null, 2),
                "utf8"
            );
        } catch (error) {
            console.error("Error al guardar carritos en el disco:", error);
        }
    }
    getCartByCid(cid) {
        return this.carts.find((cart) => cart.cid === cid);
    }

    getNextCartcid() {
        if (this.carts.length === 0) {
            return 1;
        } else {
            const maxcid = Math.max(...this.carts.map((cart) => cart.cid));
            return maxcid + 1;
        }
    }
    addProductToCart(cid, pid) {
        const cart = this.getCartByCid(cid);

        if (!cart) {
            return { success: false, message: "Carrito no encontrado" };
        }

        // Verificar si el producto existe en productos.json
        const productExists = this.checkProductExists(pid);

        if (!productExists) {
            return { success: false, message: `El producto ${pid} no existe` };
        }

        const existingProduct = cart.products.find(
            (product) => product.pid === pid
        );

        if (existingProduct) {
            existingProduct.quantity += 1; // Incrementa la cantidad del producto existente
            this.saveCartsToDisk(); // Guardar cambios en el carrito
            return {
                success: true,
                message: `Cantidad del producto ${pid} en el carrito ${cid} incrementada a ${existingProduct.quantity}`,
            };
        }

        cart.products.push({ pid, quantity: 1 }); // Agrega el producto con cantidad inicial de 1
        this.saveCartsToDisk(); // Guardar cambios en el carrito
        return {
            success: true,
            message: `Producto ${pid} agregado al carrito ${cid} exitosamente`,
        };
    }

    checkProductExists(pid) {
        const product = this.productsList.find((product) => product.pid === pid);
        return !!product; // Devuelve true si el producto existe, de lo contrario, false
    }
}

export default CartManager;
