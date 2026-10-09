const assert = require('node:assert/strict');
const pricing = require('../pricing.js');

function pastry(productId, price, quantity, size = 'single') {
  return { productId, productType: 'pastry', size, price, quantity };
}

assert.equal(pricing.getPastryDiscount(5), 0);
assert.equal(pricing.getPastryDiscount(6), 0.15);
assert.equal(pricing.getPastryDiscount(11), 0.15);
assert.equal(pricing.getPastryDiscount(12), 0.20);
assert.equal(pricing.bulkPrice(3.50, 6, pricing.halfDozenDiscount), 17.85);
assert.equal(pricing.bulkPrice(3.50, 12, pricing.dozenDiscount), 33.60);

const sixMixedPastries = pricing.calculateCartPricing([
  pastry('butter-croissants', 3.50, 2),
  pastry('morning-glory-muffins', 2.50, 4),
  { productId: 'signature-sourdough', productType: 'bread', size: 'single', price: 5, quantity: 12 },
  pastry('danish-variety-pack', 22.95, 1, 'half-dozen')
], 0.10);

assert.equal(sixMixedPastries.pastryQuantity, 6);
assert.equal(sixMixedPastries.bulkSavingsCents, 255);
assert.equal(sixMixedPastries.lines[2].discount, 0);
assert.equal(sixMixedPastries.lines[3].discount, 0);
assert.equal(sixMixedPastries.couponSavingsCents, 974);
assert.equal(sixMixedPastries.totalCents, 8_766);

const dozenMixedPastries = pricing.calculateCartPricing([
  pastry('butter-croissants', 3.50, 8),
  pastry('morning-glory-muffins', 2.50, 4),
  pastry('pain-au-chocolat', 4.00, 1)
]);

assert.equal(dozenMixedPastries.pastryQuantity, 13);
assert.equal(dozenMixedPastries.bulkSavingsCents, 840);
assert.equal(dozenMixedPastries.totalCents, 3_360);

const legacyPastry = pricing.calculateCartPricing([
  { productId: 'pain-au-chocolat', size: 'single', price: 4, quantity: 12 }
]);
assert.equal(legacyPastry.bulkSavingsCents, 960);

console.log('Pricing tests passed.');
