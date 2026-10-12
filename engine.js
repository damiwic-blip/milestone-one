const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

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

    // Demonstration estimates, not verified financial savings
    const estimatedRevenue = shippingVolume * 10;
    const estimatedCosts = operationalOverhead;
    const marginGap = Math.max(0, targetMargin / 100 -
        (estimatedRevenue - estimatedCosts) / estimatedRevenue);

    const identifiedLeaks = Math.round(estimatedRevenue * marginGap);
    const revenueProtected = identifiedLeaks;

    res.json({
        revenueProtected,
        identifiedLeaks
    });
});
// Cloud server core engine listener
app.listen(PORT, () => {
    console.log(`Engine cockpit live and streaming on port ${PORT}`);
});