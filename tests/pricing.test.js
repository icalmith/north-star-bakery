const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const pricing = require('../pricing.js');

describe('cart-wide quantity discounts', () => {
  it('uses the correct rates at each quantity boundary', () => {
    assert.equal(pricing.getQuantityDiscount(5), 0);
    assert.equal(pricing.getQuantityDiscount(6), pricing.halfDozenDiscount);
    assert.equal(pricing.getQuantityDiscount(11), pricing.halfDozenDiscount);
    assert.equal(pricing.getQuantityDiscount(12), pricing.dozenDiscount);
    assert.equal(pricing.getQuantityDiscount(23), pricing.dozenDiscount);
    assert.equal(pricing.getQuantityDiscount(24), pricing.largeDiscount);
  });

  it('calculates bulk prices from the configured rates', () => {
    assert.equal(pricing.bulkPrice(3.50, 6, pricing.halfDozenDiscount), 17.85);
    assert.equal(pricing.bulkPrice(3.50, 12, pricing.dozenDiscount), 33.60);
  });

  it('counts bread and pastries together and discounts every line at the cart tier', () => {
    const items = [
      { productId: 'signature-sourdough', productType: 'bread', price: 5, quantity: 2 },
      { productId: 'morning-glory-muffins', productType: 'pastry', price: 2.50, quantity: 4 }
    ];
    const cart = pricing.calculateCartPricing(items, pricing.couponDiscount);

    assert.equal(cart.totalQuantity, 6);
    assert.equal(cart.bulkSavingsCents, 300);
    assert.equal(cart.lines[0].discount, pricing.halfDozenDiscount);
    assert.equal(cart.lines[1].discount, pricing.halfDozenDiscount);
    assert.equal(cart.lines[0].subtotalCents, 850);
    assert.equal(cart.lines[1].subtotalCents, 850);
    const regularSubtotalCents = items.reduce(
      (total, item) => total + Math.round(item.price * 100) * item.quantity,
      0
    );
    const discountedSubtotalCents = regularSubtotalCents - cart.bulkSavingsCents;
    const expectedCouponSavingsCents = Math.round(discountedSubtotalCents * pricing.couponDiscount);
    assert.equal(cart.couponSavingsCents, expectedCouponSavingsCents);
    assert.equal(cart.totalCents, discountedSubtotalCents - expectedCouponSavingsCents);
  });

  it('applies the large-order tier to all lines once the cart reaches 24 items', () => {
    const cart = pricing.calculateCartPricing([
      { productType: 'bread', price: 5, quantity: 23 },
      { productType: 'pastry', price: 4, quantity: 1 }
    ]);

    assert.equal(cart.totalQuantity, 24);
    assert.equal(cart.lines[0].discount, pricing.largeDiscount);
    assert.equal(cart.lines[1].discount, pricing.largeDiscount);
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
