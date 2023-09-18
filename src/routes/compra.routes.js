const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/api/purchase', verifyToken, async (req, res) => {
    try {
        const user = req.user;
        const cart = await Cart.findOne({ user: user._id }).populate('items.product');

        if (!cart) {
            return res.status(400).json({ error: 'No hay productos en el carrito.' });
        }

        const totalAmount = cart.totalAmount * 100; // Convertir a centavos para Stripe

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount,
            currency: 'usd',  // Cambia esto según tu moneda
            description: `Compra de ${user.email}`,
            payment_method: req.body.paymentMethodId,
            confirm: true
        });

        if (paymentIntent.status === 'succeeded') {
            const order = new Order({
                user: user._id,
                items: cart.items,
                totalAmount: totalAmount / 100
            });

            await order.save();
            await cart.remove();  // Vacía el carrito después de procesar la compra

            return res.json({ message: 'Compra realizada con éxito', order });
        }

        res.status(400).json({ error: 'Error al procesar el pago' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
