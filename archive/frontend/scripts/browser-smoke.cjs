const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const {chromium} = require('playwright');
// Usage after npm run build: npm run test:browser (requires Playwright Chromium).
// The mock API isolates UI layout/navigation; native auth has separate HTTP/React tests.
const root = path.resolve(__dirname, '../build');
// Preload only build assets. HTTP input selects bytes, never a filesystem path.
const assets = new Map();
function collectAssets(directory, prefix = '') {
  for (const entry of fs.readdirSync(directory, {withFileTypes:true})) {
    const file = path.join(directory, entry.name);
    const url = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) collectAssets(file, url);
    else if (entry.isFile()) assets.set(url, {
      body: fs.readFileSync(file),
      type: entry.name.endsWith('.js') ? 'application/javascript' : entry.name.endsWith('.css') ? 'text/css' : 'text/html',
    });
  }
}
collectAssets(root);
const server = http.createServer((req,res) => {
  const asset = assets.get(req.url.split('?')[0]) || assets.get('/index.html');
  res.setHeader('Content-Type', asset.type);
  res.end(asset.body);
});
(async () => {
 await new Promise(r => server.listen(0,'127.0.0.1',r));
 const browser = await chromium.launch({headless:true});
 try {
 const page = await browser.newPage({viewport:{width:1024,height:600}});
 const errors=[]; page.on('pageerror', e=>errors.push(e.message));
 await page.route('**/api/**', async route=> {
   const pathname = new URL(route.request().url()).pathname;
   const bodies = {'/api/auth/me':{user:{id:'test',username:'test'}},'/api/instances':{agents:[]},'/api/usage':{records:[],aggregate:{}},'/api/overrides':{overrides:[]}};
   await route.fulfill({json:bodies[pathname]||{}});
 });
 await page.goto(`http://127.0.0.1:${server.address().port}/workspace`);
 await page.getByTestId('page-workspace').waitFor();
 await page.locator('summary').click();
 assert.equal(await page.locator('a[href="/agents"]').count(),1);
 await page.locator('summary').click();
 await page.locator('.a0-readout-add').click();
 const metrics = await page.locator('.a0-readout-rack').evaluate(el=>({client:el.clientHeight,scroll:el.scrollHeight,overflow:getComputedStyle(el).overflowY}));
 assert(metrics.scroll > metrics.client && metrics.overflow === 'auto',JSON.stringify(metrics));
 await page.locator('.a0-readout-rack').evaluate(el=>el.scrollTop=el.scrollHeight);
 await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
 const detail=await page.locator('.a0-readout-detail').boundingBox();
 assert(detail.y <600 && detail.y+detail.height<=601, JSON.stringify(detail));
 await page.setViewportSize({width:360,height:780});
 const widths=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
 assert(widths.scroll<=widths.width,JSON.stringify(widths));

 const login = await browser.newPage({viewport:{width:360,height:780}});
 await login.route('**/api/**', async route => {
   const pathname = new URL(route.request().url()).pathname;
   if (pathname === '/api/auth/me') return route.fulfill({status:401,json:{detail:'not authenticated'}});
   await route.fulfill({json:{}});
 });
 await login.goto(`http://127.0.0.1:${server.address().port}/login`);
 await login.getByTestId('page-login').waitFor();
 assert.equal(await login.getByTestId('backend-origin-panel').count(), 0, 'web cookie login must not offer arbitrary backend selection');
 await login.close();

 assert.deepEqual(errors,[]);
 console.log('PASS: layout/navigation; web login hides native backend selector; no browser exceptions.');
 } finally { await browser.close(); server.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
