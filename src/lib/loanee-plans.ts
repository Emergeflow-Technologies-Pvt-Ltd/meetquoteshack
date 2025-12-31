// src/lib/loanee-plans.ts
export const LOANEE_PLANS = {
  BASIC: {
    label: "Basic",
    priceLabel: "$0 / month",
  },

  LOANEE_STAY_SMART: {
    label: "Smart",
    prices: {
      MONTHLY: "$2.99 / month",
      YEARLY: "$29.99 / year",
    },
  },
} as const;
