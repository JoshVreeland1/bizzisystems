/* Website smoke checks run against a local Next.js production server.
   npm ci; npm install --no-save --no-package-lock playwright@1.58.2; npx playwright install chromium
   npm run build; node scripts/website-smoke.cjs
*/
const { chromium } = require("playwright");
const { spawn } = require("node:child_process");
const { mkdirSync } = require("node:fs");
const assert = require("node:assert/strict");
const base = "http://127.0.0.1:3100";
const sizes = [
  { width: 320, height: 700 },
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function ready() {
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch(base);
      if (r.ok) return;
    } catch {}
    await sleep(500);
  }
  throw new Error("Production server did not become ready");
}
async function main() {
  const server = spawn("npm", ["run", "start", "--", "-p", "3100"], {
    env: { ...process.env, PORT: "3100" },
    stdio: "inherit",
  });
  let browser;
  try {
    await ready();
    browser = await chromium.launch({
      headless: true,
      args: [
        "--use-gl=angle",
        "--use-angle=swiftshader",
        "--enable-unsafe-swiftshader",
      ],
    });
    mkdirSync("artifacts/website-smoke", { recursive: true });
    for (const size of sizes) {
      const page = await browser.newPage({
        viewport: size,
        deviceScaleFactor: 1,
      });
      const errs = [];
      page.on("pageerror", (e) => errs.push(e.message));
      const r = await page.goto(base, { waitUntil: "networkidle" });
      assert.equal(r.status(), 200, "Homepage must return HTTP 200");
      assert.equal(
        await page.locator("h1").count(),
        1,
        "Exactly one primary heading",
      );
      assert.match(
        await page.locator("h1").innerText(),
        /Measure occupancy at the stall or bay/,
      );
      assert.equal(
        (await page
          .getByRole("link", { name: /Discuss a deployment/i })
          .count()) >= 1,
        true,
      );
      const overflow = await page.evaluate(() => ({
        body: document.body.scrollWidth,
        root: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
      }));
      assert(
        overflow.body <= overflow.viewport + 1 &&
          overflow.root <= overflow.viewport + 1,
        "Horizontal overflow at " +
          size.width +
          ": " +
          JSON.stringify(overflow),
      );
      const img = page.getByAltText(/Actual v0.7 CAD isometric/i);
      await img.waitFor({ state: "visible" });
      await page.getByRole("button", { name: /Back cover/i }).click();
      assert.match(
        await page.locator("[aria-live='polite']").innerText(),
        /rear cover/i,
        "Memo should switch after one click",
      );
      assert(
        !/98%|10 units|Prototype testing|Count vehicles\./.test(
          await page.locator("main").innerText(),
        ),
        "Internal gate metrics and rejected copy must be absent",
      );
      const hero = page.locator("section").first();
      const ratio = await hero.evaluate((el) => {
        const [a, b] = el.children;
        return (
          a.getBoundingClientRect().width / b.getBoundingClientRect().width
        );
      });
      if (size.width === 1440)
        assert(Math.abs(ratio - 1.5) < 0.02, "Hero must be 60/40");
      const cta = page
        .getByRole("link", { name: /Discuss a deployment/i })
        .nth(1);
      await cta.hover();
      assert.notEqual(
        await cta.evaluate((el) => getComputedStyle(el).boxShadow),
        "none",
      );
      await page.screenshot({
        path: "artifacts/website-smoke/home-" + size.width + ".png",
        fullPage: true,
      });
      if(size.width===1440){await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:"artifacts/website-smoke/hero-1440.png"});}
    assert.deepEqual(errs, [], "No runtime errors at " + size.width);
      await page.close();
    }
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Open 3D view/i }).click();
    await page.locator("canvas").waitFor();
    await page
      .getByText("Loading the hardware view…", { exact: true })
      .waitFor({ state: "hidden", timeout: 30000 });
    assert.equal(
      await page.getByText("The 3D view could not load.").count(),
      0,
    );
    await page
      .locator("#hardware")
      .screenshot({ path: "artifacts/website-smoke/hardware-assembled.png" });
    await page.getByRole("button", { name: /Explode view/i }).click();
    await page.getByRole("button", { name: /Back cover/i }).click();
    await page
      .locator("#hardware")
      .screenshot({ path: "artifacts/website-smoke/hardware-exploded.png" });
    assert.equal(
      await page
        .getByRole("button", { name: /Reassemble/i })
        .getAttribute("aria-pressed"),
      "true",
    );
    await page.getByRole("button", { name: /Reassemble/i }).click();
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(
      await page
        .locator(".b-btn-primary")
        .first()
        .evaluate((el) => getComputedStyle(el).transitionDuration),
      "0s",
    );
    for (const path of ["/contact", "/waitlist"]) {
      await page.setViewportSize({ width: 320, height: 812 });
      const response = await page.goto(base + path);
      assert.equal(response.status(), 200);
      await page.getByLabel("Name", { exact: true }).fill("Website review");
      await page
        .getByLabel("Email", { exact: true })
        .fill("review@example.com");
      await page.getByLabel("City", { exact: true }).fill("Austin");
      await page
        .getByRole("button", { name: /Request.*(call|updates)/i })
        .click();
      assert.match(
        await page.getByRole("status").innerText(),
        /email draft was requested/,
      );
      assert.equal(
        await page.getByLabel("Name", { exact: true }).inputValue(),
        "Website review",
      );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        path + " overflow",
      );
      await page.screenshot({
        path: "artifacts/website-smoke/" + path.slice(1) + "-320.png",
        fullPage: true,
      });
    }
    await page.goto(base);
    await page.keyboard.press("Tab");
    assert.match(await page.locator(":focus").innerText(), /Skip to content/);
    await page.keyboard.press("Enter");
    assert.equal(
      await page.evaluate(() => document.activeElement.id),
      "main-content",
    );
    const missing = await page.goto(base + "/definitely-not-a-page");
    assert.equal(missing.status(), 404);
    assert.match(await page.locator("h1").innerText(), /That page isn't here/);
    const login = await fetch(base + "/login", { redirect: "manual" });
    const expectedLogin="https://bizzi-pilot-platform.vercel.app/login";
    if([307,308].includes(login.status)){
      assert.equal(login.headers.get("location"),expectedLogin);
    }else{
      assert.equal(login.status,200);
      assert.match(await login.text(),/<meta id="__next-page-redirect" http-equiv="refresh" content="1;url=https:\/\/bizzi-pilot-platform\.vercel\.app\/login"/);
    }
    // Intercept only the external destination: verify routing without opening real authentication.
    await page.route(expectedLogin,route=>route.fulfill({status:200,body:"Pilot login destination verified"}));
    await page.goto(base+"/login");
    await page.waitForURL(expectedLogin);
    console.log(
      "Website smoke checks passed at all breakpoints, 404, and login redirect.",
    );
  } finally {
    await browser?.close();
    server.kill("SIGTERM");
  }
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
