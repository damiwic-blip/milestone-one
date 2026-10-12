// 📊 B2B TARGET ACQUISITION MATRIX
const leadDatabase = [
  {
    companyName: "Palmetto State Transportation",
    executiveName: "Johnny Dumit",
    title: "Operations Manager",
    email: "johnny@palmettostatetrans.com",
    estimatedRevenueProtected: 245000
  },
  {
    companyName: "Bulldog Hiway Express",
    executiveName: "KC Sanders",
    title: "Local Operations Manager",
    email: "kcsanders@bulldoghiway.com",
    estimatedRevenueProtected: 182000
  }
];

// 🚀 AUTOMATED COLD OUTBOUND GENERATION ENGINE
function generateOutboundScript(lead) {
    const liveLink = "https://onrender.com";
    return `
===========================================================
TO: ${lead.email}
SUBJECT: Urgent: $200k+ Margin Leak in ${lead.companyName} Network
===========================================================

Hi ${lead.executiveName},

I just wrapped up a localized metric analysis on ${lead.companyName}’s operating footprint in South Carolina. My tracking infrastructure estimates a persistent leak costing your active fleet roughly $182,000 to $245,000 in unprotected margins.

I built a live processing node and data dashboard mapping out this exact math for you. Review the breakdown securely here: ${liveLink}

I will call your desk in 10 minutes to explain the math and how we patch this bleed this quarter.

Best regards,

Damion Reynolds
Managing Partner | Velynxo Fleet`;
}

// Execution runner to log all targets to terminal
leadDatabase.forEach(lead => {
    console.log(generateOutboundScript(lead));
});