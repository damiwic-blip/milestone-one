require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Serve static visual assets from the 'public' folder
app.use(express.static('public'));
app.use(express.json());

// Section 4 Data Layer - Mock Lead Target
const leadTarget = {
    companyName: "Naples Enterprise Logistics",
    decisionMaker: "John Doe",
    corporateEmail: "johndoe@napleslogistics.com",
    estimatedContractValue: 2500
};

// Dynamic Financial Metrics Baseline
const SOFTWARE_COSTS = 100;

// API Endpoint to stream calculation data to your visual interface
app.get('/api/pipeline', (req, res) => {
    const grossRevenue = leadTarget.estimatedContractValue;
    const netProfit = grossRevenue - SOFTWARE_COSTS;
    const profitMarginPercentage = ((netProfit / grossRevenue) * 100).toFixed(2);

    res.json({
        success: true,
        meta: {
            client: leadTarget.companyName,
            contact: leadTarget.decisionMaker,
            email: leadTarget.corporateEmail
        },
        financials: {
            gross: grossRevenue,
            costs: SOFTWARE_COSTS,
            net: netProfit,
            margin: `${profitMarginPercentage}%`
        }
    });
});

// Original Core Pipeline Calculation Route with your exact math logic
app.post('/api/calculate', (req, res) => {
    const {
        fleetSize,
        shippingVolume,
        targetMargin,
        operationalOverhead
    } = req.body;

    const values = [
        fleetSize,
        shippingVolume,
        targetMargin,
        operationalOverhead
    ];

    if (values.some(v => typeof v !== 'number' || !Number.isFinite(v) || v < 0) ||
        fleetSize <= 0 || shippingVolume <= 0 ||
        targetMargin > 100) {
        return res.status(400).json({
            error: 'Please enter valid fleet and financial values.'
        });
    }

    // Your precise demonstration estimate formulas
    const estimatedRevenue = shippingVolume * 10;
    const estimatedCosts = operationalOverhead;
    const marginGap = Math.max(0, targetMargin / 100 -
        (estimatedRevenue - estimatedCosts) / estimatedRevenue);

    const identifiedLeaks = Math.round(estimatedRevenue * marginGap);
    const revenueProtected = identifiedLeaks;

    res.json({
        success: true,
        revenueProtected,
        identifiedLeaks
    });
});

// Stripe Checkout API endpoint - Cleaned up and perfectly closed brackets
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({

            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Velynxo Fleet Premium Optimization',
                        description: 'Unlock full operational analytics and leak protection tools',
                    },
                    unit_amount: 4900, // \$49.00 charge in cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.headers.origin}/?payment=success`,
            cancel_url: `${req.headers.origin}/`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Cloud server core engine listener
app.listen(PORT, () => {
    console.log(`Engine cockpit live and streaming on port ${PORT}`);
});