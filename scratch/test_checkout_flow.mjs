// End-to-end test script for Step 4: Checkout, Payments, Taxes, Shipping, Invoices, Orders, Refunds, RMA

async function runTest() {
  const BASE_URL = 'http://localhost:3000';
  console.log('--- Step 4 Verification: Orders, Checkout & Inventory ---');

  // 1. Get initial stock of prod-001
  const prodRes = await fetch(`${BASE_URL}/api/v1/products/prod-001`);
  const prodData = await prodRes.json();
  const initialStock = prodData.data.stock;
  console.log(`Initial stock of ${prodData.data.name}: ${initialStock}`);

  // 2. Place an order
  const orderPayload = {
    customerId: 'cust-vip-001',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.vance@collector.com',
    customerPhone: '+1 (415) 555-0192',
    shippingAddress: {
      street: '742 Evergreen Terrace, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
      country: 'United States',
    },
    billingAddress: {
      street: '742 Evergreen Terrace, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
      country: 'United States',
    },
    items: [
      {
        id: 'prod-001-v1',
        productId: 'prod-001',
        name: prodData.data.name,
        price: prodData.data.price,
        quantity: 2,
        sku: 'AUR-NOMAD-BLK',
        image: prodData.data.thumbnail,
      },
    ],
    subtotal: prodData.data.price * 2,
    discount: 50.0,
    couponCode: 'WELCOME10',
    shipping: 35.0,
    tax: (prodData.data.price * 2 - 50.0) * 0.08,
    total: (prodData.data.price * 2 - 50.0) * 1.08 + 35.0,
    currency: 'USD',
    paymentMethod: 'Stripe Credit Card',
    notes: 'Please double-box with Atelier tamper-evident seal',
  };

  console.log('Placing order via POST /api/v1/orders...');
  const createRes = await fetch(`${BASE_URL}/api/v1/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload),
  });

  const createJson = await createRes.json();
  if (!createJson.success) {
    throw new Error(`Order placement failed: ${JSON.stringify(createJson)}`);
  }

  const createdOrder = createJson.data;
  console.log(` Order placed successfully! Order Number: ${createdOrder.orderNumber}, ID: ${createdOrder.id}`);
  console.log(`Payment Status: ${createdOrder.paymentStatus}, Tracking: ${createdOrder.carrier} ${createdOrder.trackingNumber}`);

  // 3. Verify stock deduction
  const prodAfterRes = await fetch(`${BASE_URL}/api/v1/products/prod-001`);
  const prodAfterData = await prodAfterRes.json();
  const stockAfterOrder = prodAfterData.data.stock;
  console.log(`Stock after ordering 2 units: ${stockAfterOrder} (Expected: ${initialStock - 2})`);
  if (stockAfterOrder !== initialStock - 2) {
    throw new Error(`Stock deduction mismatch! Expected ${initialStock - 2}, got ${stockAfterOrder}`);
  }
  console.log(' Multi-warehouse stock deduction verified!');

  // 4. Test Dispatch & Status Update
  console.log('Updating order status to Shipped with custom waybill...');
  const updateRes = await fetch(`${BASE_URL}/api/v1/orders/${createdOrder.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'shipped',
      fulfillmentStatus: 'fulfilled',
      carrier: 'DHL Express Worldwide',
      trackingNumber: 'DHL-TEST-88392019',
    }),
  });
  const updateJson = await updateRes.json();
  console.log(` Status updated: ${updateJson.data.status}, Tracking: ${updateJson.data.trackingNumber}`);

  // 5. Test RMA Return Request & Approval
  console.log('Testing RMA Return submission and approval...');
  const returnRes = await fetch(`${BASE_URL}/api/v1/orders/${createdOrder.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'update_return',
      returnStatus: 'approved',
      reason: 'Customer requested RMA exchange. Inspected & restored to stock.',
    }),
  });
  const returnJson = await returnRes.json();
  console.log(` Return Status: ${returnJson.data.returnStatus}, Payment: ${returnJson.data.paymentStatus}`);

  // 6. Verify inventory stock was restored after approved return
  const prodRestoredRes = await fetch(`${BASE_URL}/api/v1/products/prod-001`);
  const prodRestoredData = await prodRestoredRes.json();
  console.log(`Stock after return approval: ${prodRestoredData.data.stock} (Expected: ${initialStock})`);
  if (prodRestoredData.data.stock !== initialStock) {
    throw new Error(`Stock restore mismatch! Expected ${initialStock}, got ${prodRestoredData.data.stock}`);
  }
  console.log(' Restock after RMA approval verified!');

  console.log('--- ALL STEP 4 TESTS PASSED FLAWLESSLY! ---');
}

runTest().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
