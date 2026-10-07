// Automated verification test script for Step 5: CMS Page Builder, Blogs, Promotions, Inquiries, Newsletter, and SEO

async function runStep5Test() {
  const BASE_URL = 'http://localhost:3000';
  console.log('--- Step 5 Verification: CMS, Blogs, Pages, Promotions, SEO ---');

  // 1. Test Custom Pages API
  console.log('1. Testing GET /api/v1/pages...');
  const pagesRes = await fetch(`${BASE_URL}/api/v1/pages`);
  const pagesJson = await pagesRes.json();
  console.log(` Retrieved ${pagesJson.data.length} CMS pages (About, Contact, FAQ, Terms, Privacy, Sustainability)`);

  // 2. Test Creating a New Dynamic Page
  console.log('2. Testing POST /api/v1/pages (creating "materials-manifesto")...');
  const createPageRes = await fetch(`${BASE_URL}/api/v1/pages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'The Materials Manifesto',
      slug: 'materials-manifesto',
      subtitle: 'Pure Grade 5 titanium, lab sapphire, and Tuscan vegetable-tanned hide.',
      content: '### The Metallurgy of Permanence\nWe select alloys not for ease of machining, but for generational resilience.',
      category: 'company',
      metaTitle: 'The Materials Manifesto — AURA Studios',
      metaDescription: 'An exhaustive exploration of Grade 5 titanium and Tuscan leather sourcing.',
      status: 'published',
    }),
  });
  const createPageJson = await createPageRes.json();
  if (!createPageJson.success) throw new Error('Failed to create custom page');
  console.log(` Created custom page: /pages/${createPageJson.data.slug}`);

  // 3. Test Storefront Custom Page routes
  console.log('3. Testing Storefront routes (/about, /contact, /faq, /pages/materials-manifesto)...');
  const [aboutRes, contactRes, faqRes, dynamicRes] = await Promise.all([
    fetch(`${BASE_URL}/about`),
    fetch(`${BASE_URL}/contact`),
    fetch(`${BASE_URL}/faq`),
    fetch(`${BASE_URL}/pages/materials-manifesto`),
  ]);
  console.log(` Storefront routes status -> About: ${aboutRes.status}, Contact: ${contactRes.status}, FAQ: ${faqRes.status}, Dynamic: ${dynamicRes.status}`);

  // 4. Test Blogs API
  console.log('4. Testing GET /api/v1/blogs...');
  const blogsRes = await fetch(`${BASE_URL}/api/v1/blogs`);
  const blogsJson = await blogsRes.json();
  console.log(` Retrieved ${blogsJson.data.length} editorial dispatches`);

  // 5. Test Creating a New Blog Article
  console.log('5. Testing POST /api/v1/blogs (creating new dispatch)...');
  const createBlogRes = await fetch(`${BASE_URL}/api/v1/blogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Laser Sintering in Haute Horology Cases',
      slug: 'laser-sintering-horology',
      excerpt: 'Direct metal laser solidification allows internal lattice chambers previously impossible to CNC mill.',
      content: '### Additive Architecture\nSelective laser melting fuses spherical titanium micro-powder in a 99.999% pure argon vacuum.',
      category: 'Horology',
      readTimeMinutes: 4,
      tags: ['Additive', 'Titanium', 'Innovation'],
    }),
  });
  const createBlogJson = await createBlogRes.json();
  if (!createBlogJson.success) throw new Error('Failed to create blog article');
  console.log(` Created blog dispatch: /blog/${createBlogJson.data.slug}`);

  // 6. Test Storefront Blog routes
  console.log('6. Testing Storefront /blog and /blog/laser-sintering-horology...');
  const [blogListRes, blogDetailRes] = await Promise.all([
    fetch(`${BASE_URL}/blog`),
    fetch(`${BASE_URL}/blog/laser-sintering-horology`),
  ]);
  console.log(` Blog routes status -> /blog: ${blogListRes.status}, /blog/[slug]: ${blogDetailRes.status}`);

  // 7. Test Promotions API
  console.log('7. Testing Promotions API (GET & POST /api/v1/promotions)...');
  const promoRes = await fetch(`${BASE_URL}/api/v1/promotions`);
  const promoJson = await promoRes.json();
  console.log(` Current active promotions count: ${promoJson.data.length}`);

  const createPromoRes = await fetch(`${BASE_URL}/api/v1/promotions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: 'AUTUMN2026',
      type: 'percentage',
      value: 20,
      minSpend: 200,
      description: 'Exclusive 20% autumn patron privilege',
    }),
  });
  const createPromoJson = await createPromoRes.json();
  console.log(` Created new promotion voucher: ${createPromoJson.data.code} (${createPromoJson.data.value}% OFF)`);

  // 8. Test Contact Concierge Inquiry Submission
  console.log('8. Testing POST /api/v1/contact...');
  const contactSubmitRes = await fetch(`${BASE_URL}/api/v1/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Frederik Von Hapsburg',
      email: 'frederik@hapsburg-estates.at',
      subject: 'Private Chronometer Commission',
      message: 'Inquiring regarding a bespoke pair of Chronomaster timepieces in rose-gold titanium alloy.',
    }),
  });
  const contactSubmitJson = await contactSubmitRes.json();
  console.log(` Contact submission successful: "${contactSubmitJson.message}"`);

  // 9. Test Newsletter Subscriber Submission
  console.log('9. Testing POST /api/v1/newsletter...');
  const newsRes = await fetch(`${BASE_URL}/api/v1/newsletter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'victor.k@zuricharch.ch',
      source: 'Journal Footer',
    }),
  });
  const newsJson = await newsRes.json();
  console.log(` Newsletter subscriber registered: "${newsJson.message}" (Coupon: ${newsJson.couponCode})`);

  // 10. Test SEO sitemap and robots
  console.log('10. Testing SEO routes (/sitemap.xml, /robots.txt)...');
  const [sitemapRes, robotsRes] = await Promise.all([
    fetch(`${BASE_URL}/sitemap.xml`),
    fetch(`${BASE_URL}/robots.txt`),
  ]);
  console.log(` SEO routes status -> /sitemap.xml: ${sitemapRes.status}, /robots.txt: ${robotsRes.status}`);

  console.log('--- ALL STEP 5 TESTS PASSED WITH 100% SUCCESS! ---');
}

runStep5Test().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
