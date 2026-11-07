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
      if (a === "voiceOn") await page.tap("#tabSet");
      await page.tap("#" + a);
      assert(await page.getAttribute("#" + a, "aria-pressed") === "true", a + " was not selected");
      await page.tap("#" + b);
      assert(await page.getAttribute("#" + b, "aria-pressed") === "true", b + " was not selected");
    }
    assert(await page.inputValue("#margin") === "0", "the margin field is empty");
  });

  await test("a template can be applied and undone", async () => {
    const page = await open();
    await page.click("#tabPass");
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
    await page.click("#tabSet");
    await page.click('[data-lang="en"]');
    const text = await page.evaluate(() => ["passes", "plan", "exlib", "settings"].map((id) => {
      const s = document.getElementById(id); s.hidden = false; s.querySelectorAll("details:not(.item)").forEach((d) => (d.open = true)); return s.innerText; }).join("\n"));
    const left = text.split("\n").filter((l) => /[åäöÅÄÖ]/.test(l) && !/Knäböj|Höft|Bröst|Övre|Bål|Fjärilen|Kobran|Barnets|Framsida|Baksida|Vader|Sidosträck|Arm över|Djup|Katt|Triceps|Nedåtgående|Duvan/.test(l));
    assert(!left.length, "Swedish text left in English mode: " + left.slice(0, 5).join(" | "));
  });

  await test("a backup can be exported and read back into an empty app", async () => {
    const page = await open({ st: 5, names: [["Knäböj"], ["Egen övning X"]] });
    await page.fill("#passName", "Testpass");
    await page.click("#passSave");
    await page.waitForFunction(() => /Sparade/.test(document.getElementById("passMsg").textContent));
    await page.click("#tabEx");
    await page.fill("#exSearch", "Egen övning X");
    await page.click("#exAdd");
    await page.fill("#exItems details[open] textarea", "Håll ryggen rak.");
    await page.click("#tabSet");
    await page.click("#voiceOn");
    await page.click("#tabPass");
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#expBtn")]);
    const file = await dl.path();
    const backup = JSON.parse(fs.readFileSync(file, "utf8"));
    assert(backup.format === "crosscage-klocka" && backup.passes.length === 1 && backup.exercises.length === 1, "backup content: " + JSON.stringify(backup).slice(0, 200));
    const fresh = await open();
    await fresh.click("#tabPass");
    await fresh.setInputFiles("#impFile", file);
    await fresh.waitForFunction(() => /Klart/.test(document.getElementById("bkMsg").textContent));
    assert((await fresh.textContent("#passList")).includes("Testpass"), "the workout did not come back");
    assert(await fresh.inputValue("#st") === "5", "the plan did not come back");
    assert(await fresh.evaluate(() => JSON.parse(localStorage.getItem("ccage")).voice) === true, "the settings did not come back");
    await fresh.click("#tabEx");
    await fresh.fill("#exSearch", "Egen övning X");
    assert((await fresh.$$("#exItems details")).length === 1, "the own exercise did not come back");
    await fresh.click("#exItems summary");
    assert(await fresh.inputValue("#exItems details[open] textarea") === "Håll ryggen rak.", "the description did not come back");
    assert(!page.errors.length && !fresh.errors.length, page.errors.concat(fresh.errors).join("; "));
  });

  await test("a file that is not a backup is refused", async () => {
    const page = await open({ st: 3 });
    await page.click("#tabPass");
    await page.setInputFiles("#impFile", { name: "x.json", mimeType: "application/json", buffer: Buffer.from('{"hello":1}') });
    await page.waitForFunction(() => document.getElementById("bkMsg").textContent.length > 0);
    assert(/inte en säkerhetskopia/.test(await page.textContent("#bkMsg")), "no refusal message");
    assert(await page.inputValue("#st") === "3", "the plan was changed");
  });

  await test("loading a workout keeps this phone's sound settings", async () => {
    const page = await open({ vol: 30, voice: true });
    await page.evaluate(() => localStorage.setItem("ccage_passes", JSON.stringify([{ id: "p1", name: "Gammalt", updated: 1, cfg: JSON.stringify({ st: 4, vol: 90, voice: false }) }])));
    await page.reload();
    await page.click("#tabPass");
    await page.click("#passList .item button:nth-child(2)");
    assert(await page.inputValue("#st") === "4", "the workout was not loaded");
    const c = await page.evaluate(() => JSON.parse(localStorage.getItem("ccage")));
    assert(c.vol === 30 && c.voice === true, "sound settings changed: vol " + c.vol + ", voice " + c.voice);
  });

  await test("an exercise description shows on the timer during the demo", async () => {
    const page = await open({ st: 1, ex: 1, names: [["Knäböj"]], instr: 20 });
    await page.evaluate(() => localStorage.setItem("ccage_exlib", JSON.stringify([{ id: "b:Knäböj", desc: "Fötterna axelbrett.", updated: 1 }])));
    await page.reload();
    await page.click("#tabRun");
    for (let i = 0; i < 10 && (await page.textContent("#rPhase")) !== "Genomgång"; i++) await page.click("#bNext");
    assert(await page.isVisible("#rDesc") && (await page.textContent("#rDesc")) === "Fötterna axelbrett.", "no description in the demo");
  });

  await test("an imported file cannot push settings outside their range", async () => {
    const page = await open({ st: 3 });
    await page.click("#tabPass");
    const bad = { format: "crosscage-klocka", version: 1, passes: [], exercises: [], plan: { st: 1e7, rd: -5, ex: 99, total: 1e9, rounds: [{ work: 1e6 }], roundSets: [999] }, settings: { vol: 5000 } };
    await page.setInputFiles("#impFile", { name: "b.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(bad)) });
    await page.waitForFunction(() => /Klart/.test(document.getElementById("bkMsg").textContent));
    const c = await page.evaluate(() => JSON.parse(localStorage.getItem("ccage")));
    assert(c.st === 20 && c.rd === 1 && c.ex === 4 && c.total === 180 && c.vol === 100, "values not limited: " + JSON.stringify({ st: c.st, rd: c.rd, ex: c.ex, total: c.total, vol: c.vol }));
    assert(!page.errors.length, page.errors.join("; "));
  });

  await test("undo after an import brings back the workouts, exercises and plan from before", async () => {
    const page = await open({ st: 3 });
    await page.evaluate(() => {
      localStorage.setItem("ccage_passes", JSON.stringify([{ id: "p1", name: "Mitt pass", updated: 1, cfg: JSON.stringify({ st: 2 }) }]));
      localStorage.setItem("ccage_exlib", JSON.stringify([{ id: "u1", name: "Min övning", group: "", desc: "gammal", updated: 1 }]));
    });
    await page.reload();
    await page.click("#tabPass");
    const file = { format: "crosscage-klocka", version: 1, lang: "en",
      passes: [{ name: "Mitt pass", updated: 99, cfg: { st: 9 } }, { name: "Nytt pass", updated: 5, cfg: { st: 7 } }],
      exercises: [{ id: "u1", name: "Min övning", group: "", desc: "ny", updated: 99 }], plan: { st: 12 }, settings: {} };
    await page.setInputFiles("#impFile", { name: "b.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(file)) });
    await page.waitForFunction(() => /Done|Klart/.test(document.getElementById("bkMsg").textContent));
    await page.click("#toastUndo");
    await page.waitForFunction(() => /ångrades|undone/.test(document.getElementById("bkMsg").textContent));
    const s = await page.evaluate(() => ({ passes: JSON.parse(localStorage.getItem("ccage_passes")), lib: JSON.parse(localStorage.getItem("ccage_exlib")), st: JSON.parse(localStorage.getItem("ccage")).st, lang: localStorage.getItem("ccage_lang") }));
    assert(s.passes.length === 1 && JSON.parse(s.passes[0].cfg).st === 2, "workouts not restored: " + JSON.stringify(s.passes));
    assert(s.lib[0].desc === "gammal", "exercises not restored");
    assert(s.st === 3 && s.lang === "sv", "plan or language not restored: st " + s.st + ", lang " + s.lang);
  });

  await test("a deleted own exercise stays deleted when an older copy is imported", async () => {
    const page = await open();
    await page.evaluate(() => localStorage.setItem("ccage_exlib", JSON.stringify([{ id: "u1", name: "Gammal övning", group: "", desc: "", deleted: true, updated: 50 }])));
    await page.reload();
    await page.click("#tabPass");
    const file = { format: "crosscage-klocka", version: 1, passes: [], exercises: [{ id: "u1", name: "Gammal övning", group: "", desc: "", updated: 10 }], plan: {}, settings: {} };
    await page.setInputFiles("#impFile", { name: "b.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(file)) });
    await page.waitForFunction(() => /Klart/.test(document.getElementById("bkMsg").textContent));
    await page.click("#tabEx");
    await page.fill("#exSearch", "Gammal övning");
    assert((await page.$$("#exItems details")).length === 0, "the deleted exercise came back");
  });

  await test("Settings shows the same version as the service worker, and the backup carries it", async () => {
    const v = /const VERSION = "crosscage-v(\d+)"/.exec(fs.readFileSync(path.join(ROOT, "sw.js"), "utf8"))[1];
    const page = await open();
    await page.click("#tabSet");
    assert((await page.textContent("#appVer")) === "Version " + v, "shows " + (await page.textContent("#appVer")) + ", expected Version " + v);
    await page.click("#tabPass");
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#expBtn")]);
    assert(JSON.parse(fs.readFileSync(await dl.path(), "utf8")).appVersion === v, "the backup has no app version");
  });

  await test("a save bar appears at the bottom after a change, and saving hides it", async () => {
    const page = await open(null, devices["iPhone 13"]);
    assert(await page.isHidden("#saveBar"), "the save bar shows before any change");
    await page.tap('[data-step="st:1"]');
    assert(await page.isVisible("#saveBar"), "no save bar after a change");
    const box = await page.locator("#saveBar").boundingBox();
    const vh = page.viewportSize().height;
    assert(box.y + box.height <= vh && box.y > vh / 2, "the save bar is not at the bottom of the screen");
    await page.tap("#saveBarBtn");
    assert(await page.evaluate(() => document.activeElement.id) === "passName", "without a name, Save should go to the name field");
    await page.fill("#passName", "Nytt pass");
    await page.tap("#saveBarBtn");
    await page.waitForFunction(() => /Sparade/.test(document.getElementById("passMsg").textContent));
    assert(await page.isHidden("#saveBar"), "the save bar stays after saving");
    await page.tap('[data-step="rd:1"]');
    assert(/Nytt pass/.test(await page.textContent("#saveBarMsg")), "the save bar does not name the workout");
    await page.tap("#tabRun");
    assert(await page.isHidden("#saveBar"), "the save bar shows outside Plan");
  });

  await browser.close();
  server.close();
  const failed = results.filter((r) => r[0] === "FAIL").length;
  console.log("\n" + (results.length - failed) + " passed, " + failed + " failed");
  process.exit(failed ? 1 : 0);
})();
