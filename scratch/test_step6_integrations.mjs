// Comprehensive verification script for Step 6: Tracking, Analytics, Feeds, GDPR, and Concierge
const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Starting Step 6 Verification Suite...\n');
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}: ${err.message}`);
    }
  }

  // Test 1: System Health Check
  await test('System Health Check (/api/health)', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    if (json.status !== 'healthy') throw new Error(`Unexpected status: ${json.status}`);
    if (!json.checks || !json.checks.database) throw new Error('Database check missing');
  });

  // Test 2: Google Shopping XML Feed
  await test('Google Shopping Feed (/api/v1/feeds/google-shopping)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/feeds/google-shopping`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('xml')) throw new Error(`Expected XML content type, got ${contentType}`);
    const xml = await res.text();
    if (!xml.includes('<rss') || !xml.includes('<channel>') || !xml.includes('<g:id>')) {
      throw new Error('Google Shopping XML structure missing expected tags');
    }
  });

  // Test 3: Meta Catalog CSV Feed
  await test('Meta Facebook Catalog Feed (/api/v1/feeds/facebook-catalog)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/feeds/facebook-catalog`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('csv')) throw new Error(`Expected CSV content type, got ${contentType}`);
    const csv = await res.text();
    if (!csv.includes('id,title,description,availability,condition,price,link,image_link,brand')) {
      throw new Error('Meta Catalog CSV missing standard required header schema');
    }
  });

  // Test 4: Meta Conversions API (CAPI) Endpoint
  await test('Meta Conversions API server endpoint (POST /api/v1/tracking/capi)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/tracking/capi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'ViewContent',
        eventId: `test_${Date.now()}`,
        data: {
          contentId: 'prod-001',
          contentName: 'Test Product',
          value: 1200,
          currency: 'USD',
        },
        clientUserAgent: 'NodeTest/1.0',
        pageUrl: 'http://localhost:3000/product/beryllium-master-headphone',
      }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    if (!json.success) throw new Error('CAPI endpoint returned success: false');
    if (!json.deduplicationKey) throw new Error('Deduplication key missing from CAPI response');
  });

  // Test 5: GDPR Data Export Endpoint
  await test('GDPR Data Export (POST /api/v1/customers/export)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/customers/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'marcus.vance@collector.com' }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    if (!json.success || !json.dossier) throw new Error('Customer dossier missing in export');
    if (!json.dossier.exportMetadata?.legalFramework) throw new Error('Legal framework metadata missing');
  });

  // Test 6: GDPR Erasure Protection & Confirmation Validation
  await test('GDPR Erasure Confirmation Safety Check (POST /api/v1/customers/delete)', async () => {
    // Missing confirmation token should fail safely
    const failRes = await fetch(`${BASE_URL}/api/v1/customers/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', confirmation: 'WRONG_CODE' }),
    });
    if (failRes.status !== 400) throw new Error(`Expected 400 status for wrong confirmation, got ${failRes.status}`);

    // Valid confirmation should succeed
    const passRes = await fetch(`${BASE_URL}/api/v1/customers/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test.erasure@collector.com', confirmation: 'ERASE_MY_DATA' }),
    });
    if (!passRes.ok) throw new Error(`Status ${passRes.status}`);
    const passJson = await passRes.json();
    if (!passJson.success) throw new Error('Erasure did not report success');
  });

  // Test 7: PWA Web App Manifest
  await test('PWA Web App Manifest (/manifest.webmanifest)', async () => {
    const res = await fetch(`${BASE_URL}/manifest.webmanifest`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    if (!json.name?.includes('AURA Studios') || json.display !== 'standalone') {
      throw new Error(`Manifest configuration mismatch: ${JSON.stringify(json)}`);
    }
  });

  // Test 8: Admin Reports & BI Page Route
  await test('Admin Reports & BI Page (/admin/reports)', async () => {
    const res = await fetch(`${BASE_URL}/admin/reports`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const html = await res.text();
    if (!html.includes('Financial &amp; Business Intelligence Radar') && !html.includes('Financial & Business Intelligence Radar')) {
      throw new Error('Reports page title missing from response');
    }
  });

  // Test 9: Customer Account Profile with GDPR Controls
  await test('Patron Account Profile (/account)', async () => {
    const res = await fetch(`${BASE_URL}/account`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
  });

  // Test 10: Storefront with Concierge Chat mounted
  await test('Storefront with Concierge Chat mounted (/)', async () => {
    const res = await fetch(`${BASE_URL}/`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const html = await res.text();
    if (!html.includes('Atelier Concierge')) {
      throw new Error('Concierge Chat component not found in storefront root layout');
    }
  });

  console.log(`\n========================================`);
  console.log(`Verification Summary: ${passed} / ${total} tests passed.`);
  console.log(`========================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
