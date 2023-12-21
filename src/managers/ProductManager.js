

import mongoose from 'mongoose';
 
import { Product } from '../dao/models/product.model.js';


class ProductManager {
    constructor() {
        
    }

    async addProduct(producto) {
        try {
            const newProduct = new Product(producto);
            await newProduct.save();
            console.log('Producto agregado exitosamente.');
            return newProduct;
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            return null;
        }
    }

    async updateProduct(pid, updatedProduct) {
        try {
            const product = await Product.findByIdAndUpdate(pid, updatedProduct, { new: true });
            if (!product) {
                console.log('El producto no existe.');
                return null;
            }
            console.log('Producto actualizado exitosamente.');
            return product;
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            return null;
        }
    }

    async deleteProduct(_id) {
        try {
            const product = await Product.findByIdAndDelete(_id);
            if (!product) {
                console.log('El producto no existe.');
                return null;
            }
            console.log('Producto eliminado exitosamente.');
            return product;
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            return null;
        }
    }

    async getProducts() {
        try {
            const products = await Product.find();
            return products;
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            return [];
        }
    }

    async getProductBypid(pid) {
        try {
            const product = await Product.findById(pid);
            return product || null;
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
            return null;
        }
    }
}

// Exportar la clase ProductManager
export default ProductManager;