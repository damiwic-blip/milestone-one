const express = require('express');
const app = express();
const PORT = 3000;

// Section 4 Data Layer - Mock Lead Target for Apollo Mapping
const leadTarget = {
    companyName: "Naples Enterprise Logistics",
    decisionMaker: "John Doe",
    corporateEmail: "johndoe@napleslogistics.com",
    estimatedContractValue: 2500
};

// Dynamic Financial Metrics
const SOFTWARE_COSTS = 100;         // \$100 baseline tool overhead costs

app.get('/api/pipeline', (req, res) => {
    // Calculate financial variables using the live lead target value
    const netProfitMargin = leadTarget.estimatedContractValue - SOFTWARE_COSTS;
    const profitPercentage = (netProfitMargin / leadTarget.estimatedContractValue) * 100;

    console.log(`[NETWORK TRAFFIC] Inbound request. Parsing target: ${leadTarget.companyName}`);
    res.json({
        status: "ACTIVE",
        system: "P1 CORE ENGINE",
        lead_capture: leadTarget,
        financials: {
            predicted_monthly_revenue: `$${leadTarget.estimatedContractValue}`,
            monthly_tool_overhead: `$${SOFTWARE_COSTS}`,
            net_profit_margin: `$${netProfitMargin}`,
            profit_efficiency: `${profitPercentage}%`
        }
    });
});

app.listen(PORT, () => {
    console.log("=========================================");
    console.log(`P1 ENGINE RUNNING: Listening on port ${PORT}`);
    console.log(`Access your live Apollo simulation at: http://localhost:${PORT}/api/pipeline`);
    console.log("=========================================");
});