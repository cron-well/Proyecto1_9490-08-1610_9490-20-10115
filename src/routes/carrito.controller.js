const express = require('express');
const Cart = require('../models/Cart');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/api/carrito/add', verifyToken, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id });
        }
        
        const { productId, quantity } = req.body;
        const itemIndex = cart.items.findIndex(p => p.product.toString() === productId.toString());
        
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity: quantity });
        }
        
        await cart.save();
        
        res.json({ message: "Producto añadido al carrito", cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/api/carrito', verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post('/api/carrito/remove', verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        
        const { productId } = req.body;
        cart.items = cart.items.filter(item => item.product.toString() !== productId.toString());
        
        await cart.save();
        
        res.json({ message: "Producto eliminado del carrito", cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});