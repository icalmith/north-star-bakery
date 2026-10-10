const NorthStarBakeryPricing = (() => {
  const tiers = Object.freeze([
    { quantity: 24, discount: 0.30 },
    { quantity: 12, discount: 0.20 },
    { quantity: 6, discount: 0.15 },
    { quantity: 4, discount: 0.10 }
  ]);
  const couponCode = 'WELCOME10';
  const couponDiscount = 0.10;

  function getQuantityDiscount(quantity) {
    const tier = tiers.find((t) => quantity >= t.quantity);
    return tier ? tier.discount : 0;
  }

  function calculateCartPricing(items, couponRate = 0) {
    const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
    const lines = items.map((item) => {
      const regularSubtotalCents = Math.round(item.price * 100) * item.quantity;
      const quantityDiscount = getQuantityDiscount(item.quantity);
      const savingsCents = Math.round(regularSubtotalCents * quantityDiscount);

      return {
        discount: quantityDiscount,
        savingsCents,
        subtotalCents: regularSubtotalCents - savingsCents
      };
    });
    const subtotalCents = lines.reduce((total, line) => total + line.subtotalCents, 0);
    const bulkSavingsCents = lines.reduce((total, line) => total + line.savingsCents, 0);
    const couponSavingsCents = Math.round(subtotalCents * couponRate);

    return {
      lines,
      totalQuantity,
      bulkSavingsCents,
      couponSavingsCents,
      totalCents: subtotalCents - couponSavingsCents
    };
  }

  function validateCouponCode(enteredCode, appliedCoupon = '') {
    if (String(enteredCode).trim().toUpperCase() === couponCode) {
      return {
        valid: true,
        code: couponCode,
        message: `${couponCode} applied: ${Math.round(couponDiscount * 100)}% off your order.`
      };
    }

    return {
      valid: false,
      code: appliedCoupon,
      message: appliedCoupon
        ? `Invalid code. Your existing ${appliedCoupon} coupon remains applied.`
        : 'That coupon code is not valid. Please check the code and try again.'
    };
  }

  return Object.freeze({
    tiers,
    couponCode,
    couponDiscount,
    bulkPrice(single, count, discount) {
      return Math.round(single * count * (1 - discount) * 100) / 100;
    },
    getQuantityDiscount,
    validateCouponCode,
    calculateCartPricing
  });
})();

if (typeof window !== 'undefined') {
  window.NorthStarBakeryPricing = NorthStarBakeryPricing;
}

if (typeof module === 'object' && module.exports) {
  module.exports = NorthStarBakeryPricing;
}
