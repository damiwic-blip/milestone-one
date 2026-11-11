require('dotenv').config();

const express = require('express');

const stripe = process.env.STRIPE_SECRET_KEY
  ? require('stripe')(process.env.STRIPE_SECRET_KEY)
  : null;

const app = express();
const PORT = process.env.PORT || 3000;

const DEFAULT_BASE_URL =
  process.env.BASE_URL ||
  `http://localhost:${PORT}`;

app.use(express.json());
app.use(express.static('public'));

// Demonstration data only.
// This is not connected to a real customer.
const leadTarget = {
  companyName: 'Demonstration Logistics Company',
  decisionMaker: 'Demo Contact',
  estimatedContractValue: 2500
};

const SOFTWARE_COSTS = 100;

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Velynxo Fleet',
    stripeConfigured: Boolean(stripe),
    version: '1.0.0'
  });
});

// Demonstration pipeline endpoint
app.get('/api/pipeline', (req, res) => {
  const grossRevenue =
    leadTarget.estimatedContractValue;

  const netProfit =
    grossRevenue - SOFTWARE_COSTS;

  const profitMarginPercentage =
    ((netProfit / grossRevenue) * 100).toFixed(2);

  res.json({
    success: true,
    meta: {
      client: leadTarget.companyName,
      contact: leadTarget.decisionMaker,
      contractValue: grossRevenue,
      softwareCosts: SOFTWARE_COSTS,
      netProfit,
      margin: `${profitMarginPercentage}%`
    }
  });
});

// Fleet leakage calculation endpoint
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

  const hasInvalidValue = values.some(
    value =>
      typeof value !== 'number' ||
      !Number.isFinite(value) ||
      value < 0
  );

  if (
    hasInvalidValue ||
    fleetSize <= 0 ||
    shippingVolume <= 0 ||
    targetMargin > 100
  ) {
    return res.status(400).json({
      error: 'Please enter valid fleet and financial values.'
    });
  }

  /*
    Demonstration assumptions:

    - shippingVolume represents total monthly loads
      handled by the entire fleet.
    - Each monthly load is temporarily estimated
      at $10 of revenue.
    - operationalOverhead represents total monthly
      operational overhead.
    - The output is annualized by multiplying the
      monthly estimate by 12.

    These assumptions must be validated with real
    logistics customer data before being presented
    as a verified financial result.
  */

  const estimatedMonthlyRevenue =
    shippingVolume * 10;

  const estimatedMonthlyCosts =
    operationalOverhead;

  const currentMargin =
    (
      estimatedMonthlyRevenue -
      estimatedMonthlyCosts
    ) / estimatedMonthlyRevenue;

  const marginGap = Math.max(
    0,
    targetMargin / 100 - currentMargin
  );

  const monthlyIdentifiedLeaks = Math.round(
    estimatedMonthlyRevenue * marginGap
  );

  const identifiedLeaks =
    monthlyIdentifiedLeaks * 12;

  /*
    Illustrative recovery assumption only.

    This does not guarantee that Velynxo will recover
    80% of the estimated leakage. It must be validated
    with actual customer data.
  */

  const recoveryRate = 0.80;

  const recoverableOpportunity = Math.round(
    identifiedLeaks * recoveryRate
  );

  // Kept for compatibility with the existing frontend/API.
  const revenueProtected =
    recoverableOpportunity;

  return res.json({
    success: true,
    identifiedLeaks,
    recoverableOpportunity,
    revenueProtected,
    recoveryRate
  });
});

// Stripe Checkout endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        error: 'Stripe is not configured on this server.'
      });
    }

    const baseUrl =
      process.env.BASE_URL ||
      req.headers.origin ||
      DEFAULT_BASE_URL;

    const session =
      await stripe.checkout.sessions.create({
        line_items: [
          {
            price: 'price_1UQub7BVCm6gn2Xpjn2ldvD0',
            quantity: 1
          }
        ],
        mode: 'subscription',
        success_url:
          `${baseUrl}/?payment=success`,
        cancel_url:
          `${baseUrl}/?payment=cancelled`
      });

    return res.json({
      url: session.url
    });
  } catch (error) {
    console.error(
      'Stripe Error:',
      error.message
    );

    return res.status(500).json({
      error: 'Unable to create checkout session.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(
    `Velynxo Fleet server is running on port ${PORT}`
  );
});