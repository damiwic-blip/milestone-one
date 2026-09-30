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

// Cloud server core engine listener
app.listen(PORT, () => {
    console.log(`Engine cockpit live and streaming on port ${PORT}`);
});