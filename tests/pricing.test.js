const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const pricing = require('../pricing.js');

describe('per-line quantity discounts', () => {
  it('uses the correct rates at each quantity boundary', () => {
    assert.equal(pricing.getQuantityDiscount(3), 0);
    assert.equal(pricing.getQuantityDiscount(4), 0.10);
    assert.equal(pricing.getQuantityDiscount(5), 0.10);
    assert.equal(pricing.getQuantityDiscount(6), pricing.halfDozenDiscount);
    assert.equal(pricing.getQuantityDiscount(11), pricing.halfDozenDiscount);
    assert.equal(pricing.getQuantityDiscount(12), pricing.dozenDiscount);
    assert.equal(pricing.getQuantityDiscount(23), pricing.dozenDiscount);
    assert.equal(pricing.getQuantityDiscount(24), pricing.largeDiscount);
    assert.equal(pricing.largeDiscount, 0.30);
  });

  it('calculates bulk prices from the configured rates', () => {
    assert.equal(pricing.bulkPrice(3.50, 6, pricing.halfDozenDiscount), 17.85);
    assert.equal(pricing.bulkPrice(3.50, 12, pricing.dozenDiscount), 33.60);
  });

  it('discounts each line using only its own quantity and preserves the coupon', () => {
    const items = [
      { productId: 'signature-sourdough', productType: 'bread', price: 5, quantity: 2 },
      { productId: 'morning-glory-muffins', productType: 'pastry', price: 2.50, quantity: 4 }
    ];
    const cart = pricing.calculateCartPricing(items, pricing.couponDiscount);

    assert.equal(cart.totalQuantity, 6);
    assert.equal(cart.bulkSavingsCents, 100);
    assert.equal(cart.lines[0].discount, 0);
    assert.equal(cart.lines[0].savingsCents, 0);
    assert.equal(cart.lines[0].subtotalCents, 1000);
    assert.equal(cart.lines[1].discount, 0.10);
    assert.equal(cart.lines[1].savingsCents, 100);
    assert.equal(cart.lines[1].subtotalCents, 900);
    const regularSubtotalCents = items.reduce(
      (total, item) => total + Math.round(item.price * 100) * item.quantity,
      0
    );
    const discountedSubtotalCents = regularSubtotalCents - cart.bulkSavingsCents;
    const expectedCouponSavingsCents = Math.round(discountedSubtotalCents * pricing.couponDiscount);
    assert.equal(cart.couponSavingsCents, expectedCouponSavingsCents);
    assert.equal(cart.totalCents, discountedSubtotalCents - expectedCouponSavingsCents);
  });

  it('does not let one qualifying line discount another line', () => {
    const cart = pricing.calculateCartPricing([
      { productType: 'bread', price: 5, quantity: 23 },
      { productType: 'pastry', price: 4, quantity: 1 }
    ]);

    assert.equal(cart.totalQuantity, 24);
    assert.equal(cart.lines[0].discount, pricing.dozenDiscount);
    assert.equal(cart.lines[0].savingsCents, 2300);
    assert.equal(cart.lines[0].subtotalCents, 9200);
    assert.equal(cart.lines[1].discount, 0);
    assert.equal(cart.lines[1].savingsCents, 0);
    assert.equal(cart.lines[1].subtotalCents, 400);

    const largeLine = pricing.calculateCartPricing([
      { productType: 'pastry', price: 4, quantity: 24 }
    ]).lines[0];
    assert.equal(largeLine.discount, 0.30);
    assert.equal(largeLine.savingsCents, 2880);
    assert.equal(largeLine.subtotalCents, 6720);
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
