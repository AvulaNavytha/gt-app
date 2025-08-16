export const calculateTaxes = (subtotal: number) => {
    const sgst = subtotal * 0.025; // 2.5%
    const cgst = subtotal * 0.025; // 2.5%
    const handlingCharges = subtotal * 0.060; // 6%
    const total = subtotal + sgst + cgst + handlingCharges;
    
    return {
      subtotal,
      sgst,
      cgst,
      handlingCharges,
      total
    };
  };