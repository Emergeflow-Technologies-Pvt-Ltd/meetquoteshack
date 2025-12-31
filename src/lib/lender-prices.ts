// src/lib/lender-prices.ts
export const LENDER_PRICES = {
  simple: {
    monthly: {
      label: "$25 / month",
      stripePriceId: process.env.STRIPE_PRICE_LENDER_SIMPLE_MONTHLY!,
    },
    yearly: {
      label: "$210 / year",
      original: "$300",
      stripePriceId: process.env.STRIPE_PRICE_LENDER_SIMPLE_YEARLY!,
    },
    twoYear: {
      label: "$300 / 2 years",
      original: "$600",
      stripePriceId: process.env.STRIPE_PRICE_LENDER_SIMPLE_2YEAR!,
    },
  },

  standard: {
    monthly: {
      label: "$49 / month",
      stripePriceId: process.env.STRIPE_PRICE_LENDER_STANDARD_MONTHLY!,
    },
    yearly: {
      label: "$411 / year",
      original: "$588",
      stripePriceId: process.env.STRIPE_PRICE_LENDER_STANDARD_YEARLY!,
    },
    twoYear: {
      label: "$588 / 2 years",
      original: "$1176",
      stripePriceId: process.env.STRIPE_PRICE_LENDER_SIMPLE_2YEAR!,
    },
  },
} as const;
