require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');

const app = express();

// Serve all your frontend files from the public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API route to create a payment link when a buyer is ready to pay
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Velynxo Fleet Premium Optimization',
            description: 'Unlock full operational analytics and leak protection tools',
          },
          unit_amount: 4900, // This is \$49.00 in cents. Change this value to whatever price you want!
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/?payment=success`,
      cancel_url: `${req.headers.origin}/`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));