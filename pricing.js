window.NorthStarBakeryPricing = Object.freeze((() => {
  const halfDozenQuantity = 6;
  const halfDozenDiscount = 0.15;
  const dozenQuantity = 12;
  const dozenDiscount = 0.20;
  const pastryProductIds = new Set([
    'butter-croissants',
    'danish-variety-pack',
    'morning-glory-muffins',
    'pain-au-chocolat'
  ]);

  return {
    halfDozenQuantity,
    halfDozenDiscount,
    dozenQuantity,
    dozenDiscount,
    bulkPrice(single, count, discount) {
      return Math.round(single * count * (1 - discount) * 100) / 100;
    },
    getPastryDiscount(quantity) {
      if (quantity >= dozenQuantity) return dozenDiscount;
      if (quantity >= halfDozenQuantity) return halfDozenDiscount;
      return 0;
    },
    isPastryProduct(productId) {
      return pastryProductIds.has(productId);
    }
  };
})());
