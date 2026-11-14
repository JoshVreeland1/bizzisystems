/* Website smoke checks run against a local Next.js production server.
   npm ci; npm install --no-save --no-package-lock playwright@1.58.2; npx playwright install chromium
   npm run build; node scripts/website-smoke.cjs
*/
const { chromium } = require("playwright");
const { spawn } = require("node:child_process");
const { mkdirSync } = require("node:fs");
const assert = require("node:assert/strict");
const base = "http://127.0.0.1:3100";
const sizes = [{ width:320,height:700 }, {width:375,height:812}, {width:768,height:1024}, {width:1440,height:900}];
const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));
async function ready(){
 for(let i=0;i<80;i++){try { const r=await fetch(base);if(r.ok)return; }catch{} await sleep(500);}
 throw new Error("Production server did not become ready");
}
async function main(){
 const server=spawn("npm",["run","start","--","-p","3100"],{env:{...process.env,PORT:"3100"},stdio:"inherit"});
 let browser;
 try {
  await ready();browser=await chromium.launch({headless:true});
  mkdirSync("artifacts/website-smoke",{recursive:true});
  for(const size of sizes){
    const page=await browser.newPage({viewport:size,deviceScaleFactor:1});
    const errs=[];page.on("pageerror",e=>errs.push(e.message));
    const r=await page.goto(base,{waitUntil:"networkidle"});
    assert.equal(r.status(),200,"Homepage must return HTTP 200");
    assert.equal(await page.locator("h1").count(),1,"Exactly one primary heading");
    assert.match(await page.locator("h1").innerText(),/Count vehicles/);
    assert.equal(await page.getByRole("link",{name:/Discuss a deployment/i}).count()>=1,true);
    const overflow=await page.evaluate(()=>({body:document.body.scrollWidth,root:document.documentElement.scrollWidth,viewport:window.innerWidth}));
    assert(overflow.body<=overflow.viewport+1 && overflow.root<=overflow.viewport+1, "Horizontal overflow at "+size.width+": "+JSON.stringify(overflow));
    const img=page.getByAltText(/Actual v0.7 CAD isometric/i);
    await img.waitFor({state:"visible"});
    await page.getByRole("button",{name:/Back cover/i}).click();
    assert.match(await page.locator("[aria-live='polite']").innerText(),/seal/i,"Memo should switch after one click");
    await page.screenshot({path:"artifacts/website-smoke/home-"+size.width+".png",fullPage:true});
    assert.deepEqual(errs,[],"No runtime errors at "+size.width);
    await page.close();
  }
  const page=await browser.newPage();
  const missing=await page.goto(base+"/definitely-not-a-page");
  assert.equal(missing.status(),404);
  assert.match(await page.locator("h1").innerText(),/That page isn't here/);
  const login=await fetch(base+"/login",{redirect:"manual"});
  assert([307,308].includes(login.status),"Login must redirect");
  assert((login.headers.get("location")||"").startsWith("https://bizzi-pilot-platform.vercel.app/login"),"Login must redirect to existing pilot authentication");
  console.log("Website smoke checks passed at all breakpoints, 404, and login redirect.");
 } finally {
  await browser?.close();server.kill("SIGTERM");
 }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
