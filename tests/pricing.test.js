const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const pricing = require('../pricing.js');

function pastry(productId, price, quantity, size = 'single') {
  return { productId, productType: 'pastry', size, price, quantity };
}

describe('per-line quantity discounts', () => {
  it('uses the correct rates at each quantity boundary', () => {
    assert.equal(pricing.getQuantityDiscount(3), 0);
    assert.equal(pricing.getQuantityDiscount(4), pricing.smallBulkDiscount);
    assert.equal(pricing.getQuantityDiscount(5), pricing.smallBulkDiscount);
    assert.equal(pricing.getQuantityDiscount(6), pricing.halfDozenDiscount);
    assert.equal(pricing.getQuantityDiscount(11), pricing.halfDozenDiscount);
    assert.equal(pricing.getQuantityDiscount(12), pricing.dozenDiscount);
    assert.equal(pricing.getQuantityDiscount(23), pricing.dozenDiscount);
    assert.equal(pricing.getQuantityDiscount(24), pricing.largeDiscount);
    assert.equal(pricing.largeDiscount, 0.25);
  });

  it('calculates bundle prices from the same discount rates', () => {
    assert.equal(pricing.bulkPrice(3.50, 6, pricing.halfDozenDiscount), 17.85);
    assert.equal(pricing.bulkPrice(3.50, 12, pricing.dozenDiscount), 33.60);
  });

  it('does not combine quantities across different products', () => {
    const cart = pricing.calculateCartPricing([
      pastry('butter-croissants', 3.50, 3),
      pastry('morning-glory-muffins', 2.50, 3)
    ]);
    assert.deepEqual(cart.lines.map((line) => line.discount), [0, 0]);
    assert.equal(cart.bulkSavingsCents, 0);

    const mixed = pricing.calculateCartPricing([
      pastry('butter-croissants', 3.50, 6),
      pastry('morning-glory-muffins', 2.50, 1)
    ]);
    assert.deepEqual(mixed.lines.map((line) => line.discount), [0.15, 0]);
  });

  it('applies each line its own tier', () => {
    const cart = pricing.calculateCartPricing([
      pastry('butter-croissants', 3.50, 12),
      pastry('morning-glory-muffins', 2.50, 4)
    ]);
    assert.deepEqual(cart.lines.map((line) => line.discount), [0.20, 0.10]);
    assert.equal(cart.bulkSavingsCents, 840 + 100);
  });

  it('applies WELCOME10 to the order total after line discounts', () => {
    const items = [
      pastry('butter-croissants', 3.50, 12),
      pastry('morning-glory-muffins', 2.50, 4)
    ];
    const cart = pricing.calculateCartPricing(items, pricing.couponDiscount);
    const discountedSubtotalCents = 4200 + 1000 - cart.bulkSavingsCents;
    const couponCents = Math.round(discountedSubtotalCents * 0.10);

    assert.equal(cart.couponSavingsCents, couponCents);
    assert.equal(cart.totalCents, discountedSubtotalCents - couponCents);
  });
});

describe('coupon code validation', () => {
  it('accepts the coupon without regard to case or surrounding whitespace', () => {
    assert.deepEqual(pricing.validateCouponCode(' welcome10 '), {
      valid: true,
      code: 'WELCOME10',
      message: 'WELCOME10 applied: 10% off your order.'
    });
  });

  it('rejects unknown codes and preserves an already-applied coupon', () => {
    assert.equal(pricing.validateCouponCode('').valid, false);
    assert.equal(pricing.validateCouponCode('NOTREAL').valid, false);
    const result = pricing.validateCouponCode('NOTREAL', 'WELCOME10');
    assert.equal(result.valid, false);
    assert.equal(result.code, 'WELCOME10');
    assert.match(result.message, /existing WELCOME10 coupon remains applied/);
  });
});
