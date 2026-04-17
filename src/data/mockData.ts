export const overviewMetrics = {
  totalReviews: 12847,
  positivePercent: 64,
  negativePercent: 22,
  neutralPercent: 14,
  spamCount: 89,
  duplicateCount: 34,
};

export const featureSentiment = [
  { feature: "Battery Life", positive: 78, negative: 15, neutral: 7 },
  { feature: "Packaging", positive: 62, negative: 25, neutral: 13 },
  { feature: "Delivery Speed", positive: 45, negative: 40, neutral: 15 },
  { feature: "Price Value", positive: 55, negative: 30, neutral: 15 },
  { feature: "Build Quality", positive: 82, negative: 10, neutral: 8 },
  { feature: "Customer Support", positive: 38, negative: 48, neutral: 14 },
  { feature: "User Interface", positive: 71, negative: 18, neutral: 11 },
  { feature: "Performance", positive: 68, negative: 22, neutral: 10 },
];

export const sentimentOverTime = [
  { month: "Jan", positive: 60, negative: 25, neutral: 15 },
  { month: "Feb", positive: 58, negative: 28, neutral: 14 },
  { month: "Mar", positive: 65, negative: 22, neutral: 13 },
  { month: "Apr", positive: 62, negative: 24, neutral: 14 },
  { month: "May", positive: 68, negative: 20, neutral: 12 },
  { month: "Jun", positive: 64, negative: 22, neutral: 14 },
  { month: "Jul", positive: 70, negative: 18, neutral: 12 },
  { month: "Aug", positive: 66, negative: 21, neutral: 13 },
  { month: "Sep", positive: 72, negative: 16, neutral: 12 },
  { month: "Oct", positive: 69, negative: 19, neutral: 12 },
  { month: "Nov", positive: 74, negative: 15, neutral: 11 },
  { month: "Dec", positive: 71, negative: 17, neutral: 12 },
];

export const mostComplainedFeatures = [
  { feature: "Customer Support", complaints: 620 },
  { feature: "Delivery Speed", complaints: 510 },
  { feature: "Price Value", complaints: 385 },
  { feature: "Packaging", complaints: 320 },
  { feature: "Battery Life", complaints: 190 },
];

export const criticalIssues = [
  { id: 1, issue: "Customer support response time exceeds 72 hours", severity: "critical", count: 342 },
  { id: 2, issue: "Product arrives damaged due to poor packaging", severity: "critical", count: 218 },
  { id: 3, issue: "Battery drains within 3 hours of normal use", severity: "high", count: 156 },
  { id: 4, issue: "Delivery delays of 10+ days reported consistently", severity: "high", count: 134 },
  { id: 5, issue: "App crashes frequently on Android devices", severity: "critical", count: 98 },
];

export const positiveHighlights = [
  { id: 1, highlight: "Premium build quality praised by 82% of reviewers", count: 1054 },
  { id: 2, highlight: "Intuitive user interface rated highly across demographics", count: 912 },
  { id: 3, highlight: "Battery life exceeds competitor benchmarks", count: 780 },
  { id: 4, highlight: "Excellent value for price point in market segment", count: 706 },
  { id: 5, highlight: "Fast performance with no noticeable lag", count: 654 },
];

export const recommendations = {
  product: [
    "Investigate battery drain issue in firmware version 3.2.1",
    "Improve Android app stability — crashes affect 7.6% of users",
    "Consider thicker protective packaging for fragile components",
    "Add power-saving mode to extend battery life by 40%",
  ],
  marketing: [
    "Highlight build quality and performance in ad campaigns",
    "Create comparison content showcasing battery life advantage",
    "Address delivery concerns proactively in purchase flow",
    "Leverage positive UI feedback in product demos",
  ],
  operations: [
    "Reduce average support response time from 72h to 24h",
    "Partner with faster shipping providers for priority orders",
    "Implement automated quality checks before packaging",
    "Set up real-time alert system for spike in negative reviews",
  ],
};

export const flaggedReviews = [
  { id: 1, text: "Buy now! Best product ever! Visit my website for deals!", type: "spam", confidence: 96 },
  { id: 2, text: "This product is terrible. Worst purchase ever. This product is terrible.", type: "duplicate", confidence: 89 },
  { id: 3, text: "I received a different product than what was shown. The color is wrong and the size doesn't match.", type: "needs_review", confidence: 72 },
  { id: 4, text: "AMAZING!!! BUY THIS NOW!!! 100% RECOMMENDED!!! CLICK HERE!!!", type: "spam", confidence: 94 },
  { id: 5, text: "Product works but I noticed a small crack on the side panel after 2 days of use.", type: "needs_review", confidence: 65 },
  { id: 6, text: "Great product great product great product love it love it", type: "duplicate", confidence: 82 },
  { id: 7, text: "The warranty claim process seems intentionally confusing and the staff was unhelpful.", type: "needs_review", confidence: 58 },
];

export const sampleReviews = [
  { id: 1, text: "Absolutely love the build quality! Feels premium and solid.", sentiment: "positive", date: "2024-12-15" },
  { id: 2, text: "Battery dies way too fast. Can barely last through a workday.", sentiment: "negative", date: "2024-12-14" },
  { id: 3, text: "Decent product for the price. Nothing extraordinary.", sentiment: "neutral", date: "2024-12-13" },
  { id: 4, text: "Customer support took 5 days to respond. Unacceptable.", sentiment: "negative", date: "2024-12-12" },
  { id: 5, text: "The user interface is so intuitive! My whole team adopted it instantly.", sentiment: "positive", date: "2024-12-11" },
];
