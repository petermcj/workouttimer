// Browser tests for the timer. Run with: npm test
// Starts a small static server for the repository and drives the app in headless Chromium.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium, devices } = require("playwright");

const ROOT = path.join(__dirname, "..");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".webmanifest": "application/manifest+json", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain" };

function serve() {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

const results = [];
async function test(name, fn) {
  try { await fn(); results.push(["ok", name]); console.log("ok   " + name); }
  catch (e) { results.push(["FAIL", name]); console.log("FAIL " + name + "\n     " + String(e && e.message || e).split("\n").join("\n     ")); }
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }
const mmss = (s) => { const [m, x] = s.split(":").map(Number); return m * 60 + x; };
const minsec = (s) => { const m = /(\d+) min/.exec(s), x = /(\d+) s/.exec(s); return (m ? +m[1] * 60 : 0) + (x ? +x[1] : 0); };

(async () => {
  const server = await serve();
  const URL0 = "http://127.0.0.1:" + server.address().port + "/";
  const browser = await chromium.launch();

  // Opens the app with the given saved settings, in Swedish, with speech replaced by a recorder.
  async function open(settings, opts) {
    const ctx = await browser.newContext(Object.assign({ serviceWorkers: "block" }, opts || {}));
    const page = await ctx.newPage();
    page.errors = [];
    page.on("pageerror", (e) => page.errors.push(e.message));
    page.on("console", (m) => { if (m.type() === "error") page.errors.push(m.text()); });
    await page.addInitScript((s) => {
      window.__said = [];
      Object.defineProperty(window, "speechSynthesis", { configurable: true, value: { speak: (u) => window.__said.push(u.text), cancel: () => {}, getVoices: () => [] } });
      window.SpeechSynthesisUtterance = function (t) { this.text = t; };
      if (!sessionStorage.getItem("seeded")) {
        sessionStorage.setItem("seeded", "1");
        localStorage.clear();
        localStorage.setItem("ccage_lang", "sv");
        if (s) localStorage.setItem("ccage", JSON.stringify(s));
      }
    }, settings || null);
    await page.goto(URL0);
    return page;
  }

  await test("the page and its script ask for the same version as the service worker", async () => {
    const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
    const v = /const VERSION = "([^"]+)"/.exec(sw)[1];
    assert(html.includes('src="app.js?v=' + v + '"'), "index.html must load app.js?v=" + v);
  });

  await test("every file the service worker stores exists", async () => {
    const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
    const list = sw.slice(sw.indexOf("const SHELL"), sw.indexOf("];")).match(/"\.\/[^"]*"/g).map((x) => x.slice(3, -1)).filter(Boolean);
    list.forEach((f) => assert(fs.existsSync(path.join(ROOT, f)), "missing " + f));
  });

  await test("the planned total equals what the timer runs, in 24 combinations", async () => {
    const page = await open();
    for (const mid of ["off", "round", "st"]) for (const oneRest of [false, true]) for (const order of ["block", "alt"]) for (const mode of ["auto", "manual"]) {
      const c = { mid, oneRest, order, mode, midEvery: 3, midTime: 40, stretch: 5, st: 7, ex: 2, sets: 2, rd: 3, perRound: mode === "auto", setsEach: order === "alt", roundSets: [2, 3, 1], stretchList: ["A", "B", "C"] };
      await page.evaluate((c) => localStorage.setItem("ccage", JSON.stringify(c)), c);
      await page.reload();
      const r = await page.evaluate(() => ({ tot: oTotal.textContent, left: mLeft.textContent }));
      assert(mmss(r.left) - 10 === minsec(r.tot), JSON.stringify(c) + ": plan " + r.tot + ", timer " + r.left + " (incl. 10 s get ready)");
    }
    assert(!page.errors.length, page.errors.join("; "));
  });

  await test("buttons in the plan respond to taps on a phone", async () => {
    const page = await open(null, devices["iPhone 13"]);
    await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
    for (const [a, b] of [["mgOver", "mgBuffer"], ["evenOff", "evenOn"], ["holdOff", "holdOn"], ["midSt", "midOff"], ["nsLetter", "nsName"], ["voiceOn", "voiceOff"]]) {
      await page.tap("#" + a);
      assert(await page.getAttribute("#" + a, "aria-pressed") === "true", a + " was not selected");
      await page.tap("#" + b);
      assert(await page.getAttribute("#" + b, "aria-pressed") === "true", b + " was not selected");
    }
    assert(await page.inputValue("#margin") === "0", "the margin field is empty");
  });

  await test("a template can be applied and undone", async () => {
    const page = await open();
    await page.click("#tplChips button:nth-child(2)");
    assert((await page.textContent("#sum_mid")).includes("30 s"), "the template did not turn on the interval exercise");
    await page.click("#toastUndo");
    assert(await page.textContent("#sum_mid") === "Ingen", "undo did not restore the plan");
  });

  await test("clearing names can be undone", async () => {
    const page = await open({ names: [["Knäböj", "Rodd"]] });
    await page.evaluate(() => (document.querySelector("details:not(.fold)").open = true));
    await page.click("#exClear");
    assert(await page.inputValue("#ex0_0") === "", "names were not cleared");
    await page.click("#toastUndo");
    assert(await page.inputValue("#ex0_0") === "Knäböj", "undo did not bring the names back");
  });

  await test("the voice reads the phases in order, and demos keep real names with Exercise A, B", async () => {
    const page = await open({ voice: true, nameStyle: "letter", stretch: 2, stretchList: ["Kobran", "Barnets position"], mid: "round", midList: ["Burpees"], st: 2, ex: 2, sets: 1, rd: 2, names: [["Knäböj", "Rodd"], ["Planka", "Hopprep"]] });
    await page.click("#tabRun");
    await page.click("#bMain"); await page.click("#bMain");
    for (let i = 0; i < 60 && (await page.textContent("#rPhase")) !== "Klart"; i++) { await page.click("#bNext"); await page.waitForTimeout(450); }
    const said = (await page.evaluate(() => window.__said)).filter((x) => x.trim());
    for (const want of ["Uppvärmning", "Genomgång. Knäböj", "Övning A", "Byt övning. Övning B", "Till mellanövningen. Burpees", "Mellanövning. Burpees", "Varvvila", "Stretch. Kobran", "Barnets position", "Passet är klart. Bra jobbat!"])
      assert(said.includes(want), "did not say \"" + want + "\". Said: " + said.join(" | "));
    assert(!page.errors.length, page.errors.join("; "));
  });

  await test("keeping the end time absorbs a pause", async () => {
    const page = await open({ total: 45 });
    await page.clock.install();
    await page.reload();
    await page.click("#tabRun");
    await page.click("#bMain"); await page.clock.runFor(30000);
    await page.click("#bMain"); await page.clock.runFor(180000);
    await page.click("#bMain");
    const t0 = await page.evaluate(() => Date.now());
    for (let i = 0; i < 4000 && (await page.textContent("#bMain")) !== "Start"; i++) await page.clock.runFor(1000);
    const total = (await page.evaluate(() => Date.now()) - t0) / 1000 + 30 + 180;
    assert(total <= 45 * 60 + 10 + 2, "the workout took " + Math.round(total) + " s, more than 45 min");
  });

  await test("all new text is translated to English", async () => {
    const page = await open({ stretch: 3, mid: "st", voice: true });
    await page.click('[data-lang="en"]');
    await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
    const text = await page.evaluate(() => document.getElementById("plan").innerText);
    const left = text.split("\n").filter((l) => /[åäöÅÄÖ]/.test(l) && !/Knäböj|Höft|Bröst|Övre|Bål|Fjärilen|Kobran|Barnets|Framsida|Baksida|Vader|Sidosträck|Arm över|Djup|Katt|Triceps|Nedåtgående|Duvan/.test(l));
    assert(!left.length, "Swedish text left in English mode: " + left.slice(0, 5).join(" | "));
  });

  await browser.close();
  server.close();
  const failed = results.filter((r) => r[0] === "FAIL").length;
  console.log("\n" + (results.length - failed) + " passed, " + failed + " failed");
  process.exit(failed ? 1 : 0);
})();
