const NorthStarBakeryPricing = (() => {
  const halfDozenQuantity = 6;
  const halfDozenDiscount = 0.15;
  const dozenQuantity = 12;
  const dozenDiscount = 0.20;
  const couponCode = 'WELCOME10';
  const couponDiscount = 0.10;
  const pastryProductIds = new Set([
    'butter-croissants',
    'danish-variety-pack',
    'morning-glory-muffins',
    'pain-au-chocolat'
  ]);

  function getPastryDiscount(quantity) {
    if (quantity >= dozenQuantity) return dozenDiscount;
    if (quantity >= halfDozenQuantity) return halfDozenDiscount;
    return 0;
  }

  function isDiscountablePastry(item) {
    const isPastry = item.productType
      ? item.productType === 'pastry'
      : pastryProductIds.has(item.productId);
    return isPastry && item.size === 'single';
  }

  function calculateCartPricing(items, couponDiscount = 0) {
    const pastryQuantity = items.reduce((total, item) =>
      total + (isDiscountablePastry(item) ? item.quantity : 0), 0);
    const pastryDiscount = getPastryDiscount(pastryQuantity);
    const lines = items.map((item) => {
      const regularSubtotalCents = Math.round(item.price * 100) * item.quantity;
      const discount = isDiscountablePastry(item) ? pastryDiscount : 0;
      const savingsCents = Math.round(regularSubtotalCents * discount);

      return {
        discount,
        savingsCents,
        subtotalCents: regularSubtotalCents - savingsCents
      };
    });
    const subtotalCents = lines.reduce((total, line) => total + line.subtotalCents, 0);
    const bulkSavingsCents = lines.reduce((total, line) => total + line.savingsCents, 0);
    const couponSavingsCents = Math.round(subtotalCents * couponDiscount);

    return {
      lines,
      pastryQuantity,
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
    halfDozenQuantity,
    halfDozenDiscount,
    dozenQuantity,
    dozenDiscount,
    couponCode,
    couponDiscount,
    bulkPrice(single, count, discount) {
      return Math.round(single * count * (1 - discount) * 100) / 100;
    },
    getPastryDiscount,
    validateCouponCode,
    isDiscountablePastry,
    calculateCartPricing
  });
})();

if (typeof window !== 'undefined') {
  window.NorthStarBakeryPricing = NorthStarBakeryPricing;
}

if (typeof module === 'object' && module.exports) {
  module.exports = NorthStarBakeryPricing;
}
