const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const pricing = require('../pricing.js');

describe('per-line quantity discounts', () => {
  it('uses the correct rates at each quantity boundary', () => {
    const expected = { 1: 0, 3: 0, 4: 0.10, 5: 0.10, 6: 0.15, 11: 0.15, 12: 0.20, 23: 0.20, 24: 0.30, 30: 0.30 };
    for (const [qty, rate] of Object.entries(expected)) {
      assert.equal(pricing.getQuantityDiscount(Number(qty)), rate);
    }
  });

  it('discounts each line by its own quantity, not the cart total', () => {
    const items = [
      { price: 5, quantity: 2 },
      { price: 2.50, quantity: 4 },
      { price: 4, quantity: 12 }
    ];
    const cart = pricing.calculateCartPricing(items, pricing.couponDiscount);

    assert.deepEqual(cart.lines.map((l) => l.discount), [0, 0.10, 0.20]);
    assert.deepEqual(cart.lines.map((l) => l.savingsCents), [0, 100, 960]);
    assert.deepEqual(cart.lines.map((l) => l.subtotalCents), [1000, 900, 3840]);
    assert.equal(cart.bulkSavingsCents, 1060);
    assert.equal(cart.couponSavingsCents, 574);
    assert.equal(cart.totalCents, 5166);
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
