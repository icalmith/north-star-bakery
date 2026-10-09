const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const pricing = require('../pricing.js');

function pastry(productId, price, quantity, size = 'single') {
  return { productId, productType: 'pastry', size, price, quantity };
}

describe('pastry quantity discounts', () => {
  it('uses the correct rates at each quantity boundary', () => {
    assert.equal(pricing.getPastryDiscount(5), 0);
    assert.equal(pricing.getPastryDiscount(6), pricing.halfDozenDiscount);
    assert.equal(pricing.getPastryDiscount(11), pricing.halfDozenDiscount);
    assert.equal(pricing.getPastryDiscount(12), pricing.dozenDiscount);
  });

  it('calculates bundle prices from the same discount rates', () => {
    assert.equal(pricing.bulkPrice(3.50, 6, pricing.halfDozenDiscount), 17.85);
    assert.equal(pricing.bulkPrice(3.50, 12, pricing.dozenDiscount), 33.60);
  });

  it('counts single pastries across varieties while excluding bread and priced bundles', () => {
    const items = [
      pastry('butter-croissants', 3.50, 2),
      pastry('morning-glory-muffins', 2.50, 4),
      { productId: 'signature-sourdough', productType: 'bread', size: 'single', price: 5, quantity: 12 },
      pastry('danish-variety-pack', 22.95, 1, 'half-dozen')
    ];
    const cart = pricing.calculateCartPricing(items, pricing.couponDiscount);

    assert.equal(cart.pastryQuantity, 6);
    assert.equal(cart.bulkSavingsCents, 255);
    assert.equal(cart.lines[2].discount, 0);
    assert.equal(cart.lines[3].discount, 0);
    const regularSubtotalCents = items.reduce(
      (total, item) => total + Math.round(item.price * 100) * item.quantity,
      0
    );
    const discountedSubtotalCents = regularSubtotalCents - cart.bulkSavingsCents;
    const expectedCouponSavingsCents = Math.round(discountedSubtotalCents * pricing.couponDiscount);
    assert.equal(cart.couponSavingsCents, expectedCouponSavingsCents);
    assert.equal(cart.totalCents, discountedSubtotalCents - expectedCouponSavingsCents);
  });

  it('counts individual Danish pastries but excludes their pre-priced half-dozen bundle', () => {
    const individualOrder = pricing.calculateCartPricing([
      pastry('danish-variety-pack', 4.50, 6)
    ]);
    const bundleOrder = pricing.calculateCartPricing([
      pastry('danish-variety-pack', 22.95, 1, 'half-dozen')
    ]);

    assert.equal(individualOrder.pastryQuantity, 6);
    assert.equal(individualOrder.bulkSavingsCents, 405);
    assert.equal(bundleOrder.pastryQuantity, 0);
    assert.equal(bundleOrder.bulkSavingsCents, 0);
  });

  it('applies the dozen rate to mixed pastry quantities and legacy cart items', () => {
    const mixedCart = pricing.calculateCartPricing([
      pastry('butter-croissants', 3.50, 8),
      pastry('morning-glory-muffins', 2.50, 4),
      pastry('pain-au-chocolat', 4.00, 1)
    ]);
    const legacyCart = pricing.calculateCartPricing([
      { productId: 'pain-au-chocolat', size: 'single', price: 4.00, quantity: 12 }
    ]);

    assert.equal(mixedCart.pastryQuantity, 13);
    assert.equal(mixedCart.bulkSavingsCents, 840);
    assert.equal(mixedCart.totalCents, 3_360);
    assert.equal(legacyCart.bulkSavingsCents, 960);
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
    assert.equal(pricing.validateCouponCode('NOTREAL').valid, false);
    const result = pricing.validateCouponCode('NOTREAL', 'WELCOME10');
    assert.equal(result.valid, false);
    assert.equal(result.code, 'WELCOME10');
    assert.match(result.message, /existing WELCOME10 coupon remains applied/);
  });
});
