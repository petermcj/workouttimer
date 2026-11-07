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

  // Opens the app in Swedish with speech replaced by a recorder. With settings, they become the open workout
  // "Test" (as a returning user would have); opts.raw seeds localStorage keys as they are instead.
  async function open(settings, opts) {
    opts = opts || {};
    const ctx = await browser.newContext(Object.assign({ serviceWorkers: "block" }, opts.device || {}));
    const page = await ctx.newPage();
    page.errors = [];
    page.on("pageerror", (e) => page.errors.push(e.message));
    page.on("console", (m) => { if (m.type() === "error") page.errors.push(m.text()); });
    await page.addInitScript(([s, raw]) => {
      window.__said = [];
      Object.defineProperty(window, "speechSynthesis", { configurable: true, value: { speak: (u) => window.__said.push(u.text), cancel: () => {}, getVoices: () => [] } });
      window.SpeechSynthesisUtterance = function (t) { this.text = t; };
      if (!sessionStorage.getItem("seeded")) {
        sessionStorage.setItem("seeded", "1");
        localStorage.clear();
        localStorage.setItem("ccage_lang", "sv");
        if (s) {
          localStorage.setItem("ccage", JSON.stringify(s));
          localStorage.setItem("ccage_passes", JSON.stringify([{ id: "t1", name: "Test", desc: "", updated: 1, lastRun: 0, cfg: JSON.stringify(s) }]));
          localStorage.setItem("ccage_cur", JSON.stringify("t1"));
        }
        if (raw) Object.entries(raw).forEach(([k, v]) => localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v)));
      }
    }, [settings || null, opts.raw || null]);
    await page.goto(URL0);
    await page.waitForTimeout(150);
    return page;
  }
  const passesIn = (page) => page.evaluate(() => JSON.parse(localStorage.getItem("ccage_passes") || "[]"));

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
    const page = await open({});
    for (const mid of ["off", "round", "st"]) for (const oneRest of [false, true]) for (const order of ["block", "alt"]) for (const mode of ["auto", "manual"]) {
      const c = { mid, oneRest, order, mode, midEvery: 3, midTime: 40, stretch: 5, st: 7, ex: 2, sets: 2, rd: 3, perRound: mode === "auto", setsEach: order === "alt", roundSets: [2, 3, 1], stretchList: ["A", "B", "C"] };
      await page.evaluate((c) => localStorage.setItem("ccage", JSON.stringify(c)), c);
      await page.reload();
      const r = await page.evaluate(() => ({ tot: oTotal.textContent, left: mLeft.textContent }));
      assert(mmss(r.left) - 10 === minsec(r.tot), JSON.stringify(c) + ": plan " + r.tot + ", timer " + r.left + " (incl. 10 s get ready)");
    }
    assert(!page.errors.length, page.errors.join("; "));
  });

  await test("a first start shows the workout list, and New workout leads through the steps", async () => {
    const page = await open(null, { device: { device: null } });
    assert(await page.isVisible("#passes") && await page.isHidden("#plan"), "a first start should show the workout list");
    await page.click("#passNew");
    await page.fill("#newName", "Måndag ben");
    await page.fill("#newDesc", "Kettlebells");
    await page.click("#newCreate");
    await page.waitForFunction(() => !document.getElementById("plan").hidden);
    assert(await page.textContent("#edTitle") === "Måndag ben", "the new workout is not open");
    assert(await page.getAttribute("#stepEx", "aria-selected") === "true", "a new workout should open at Exercises");
    assert((await page.$$(".scard")).length === 1, "a new workout starts with one empty station");
    await page.click("#goBtn");
    assert(await page.isVisible("#paneTime"), "Next should go to Times");
    await page.click("#goBtn");
    assert(await page.isVisible("#run"), "Next should go to the timer");
    const p = (await passesIn(page))[0];
    assert(p.name === "Måndag ben" && p.desc === "Kettlebells", "the workout was not stored with name and description");
  });

  await test("stations come from the exercises you add, with A and B on the same card", async () => {
    const page = await open({ st: 1, ex: 1, names: [] });
    await page.click("#stepEx");
    const pick = async (q) => { await page.fill("#pickSearch", q); await page.click("#pickList .pick"); };
    await page.click("#stAdd"); await pick("knäböj");
    await page.click("#stAdd"); await pick("armhäv");
    await page.click("#stAdd"); await pick("Min egen övning");
    await page.click(".scard:nth-child(1) .addex"); await pick("rodd med");
    const cards = await page.$$eval(".scard", (cs) => cs.map((c) => [...c.querySelectorAll(".nmb")].map((b) => b.textContent).join("+")));
    assert(JSON.stringify(cards) === JSON.stringify(["Knäböj+Rodd med hantel", "Armhävningar+Välj övning", "Min egen övning+Välj övning"]), "cards: " + JSON.stringify(cards));
    assert(await page.inputValue("#st") === "3" && await page.inputValue("#ex") === "2", "stations and slots do not follow the cards");
    assert(await page.evaluate(() => JSON.parse(localStorage.getItem("ccage_exlib")).some((x) => x.name === "Min egen övning")), "a typed exercise should be added to Exercises");
    // move station 3 to the top and remove station 2
    await page.click(".scard:nth-child(3) .hd button:nth-of-type(1)");
    await page.click(".scard:nth-child(2) .hd button:nth-of-type(1)");
    assert((await page.$$eval(".scard .nmb", (b) => b[0].textContent)) === "Min egen övning", "moving up did not work");
    await page.click(".scard:nth-child(2) .hd button:nth-of-type(3)");
    assert((await page.$$(".scard")).length === 2, "removing a station did not work");
    await page.click("#toastUndo");
    assert((await page.$$(".scard")).length === 3, "undo did not bring the station back");
    // clearing B everywhere drops the B slot
    await page.click(".scard:nth-child(3) .slot:nth-child(3) .x").catch(() => {});
    const bTexts = await page.$$eval(".scard", (cs) => cs.map((c) => c.querySelectorAll(".slot").length));
    assert(bTexts.every((n) => n === 1 || n === 2), "slots: " + bTexts);
  });

  await test("changes are saved to the workout automatically", async () => {
    const page = await open({ st: 2, names: [["Knäböj"], ["Utfall"]], total: 45 });
    await page.click("#stepTime");
    await page.click('[data-step="total:1"]');
    assert(/Sparar/.test(await page.textContent("#saveState")), "no saving state");
    await page.waitForFunction(() => document.getElementById("saveState").textContent === "Sparat");
    const p = (await passesIn(page)).find((x) => x.id === "t1");
    assert(JSON.parse(p.cfg).total === 46, "the change did not reach the saved workout");
    await page.click("#stepPass");
    await page.fill("#passName", "Nytt namn");
    await page.waitForFunction(() => document.getElementById("saveState").textContent === "Sparat");
    assert((await passesIn(page)).find((x) => x.id === "t1").name === "Nytt namn", "the name was not saved");
    // a run does not change the saved workout, but marks when it was run
    await page.click("#tabRun"); await page.click("#bMain"); await page.click("#bPlus"); await page.click("#bMain");
    await page.waitForTimeout(1300);
    const after = (await passesIn(page)).find((x) => x.id === "t1");
    assert(JSON.parse(after.cfg).total === 46 && after.lastRun > 0, "a run changed the workout or was not recorded");
  });

  await test("buttons in the plan respond to taps on a phone", async () => {
    const page = await open({}, { device: devices["iPhone 13"] });
    await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
    for (const [a, b, stepId] of [["mgOver", "mgBuffer", "stepTime"], ["evenOff", "evenOn", "stepTime"], ["holdOff", "holdOn", "stepTime"], ["midSt", "midOff", "stepEx"], ["nsLetter", "nsName", "stepEx"], ["voiceOn", "voiceOff", null]]) {
      if (stepId) { await page.tap("#tabPass"); await page.tap("#passList .item button:nth-child(2)"); await page.tap("#" + stepId); await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true))); }
      else await page.tap("#tabSet");
      await page.tap("#" + a);
      assert(await page.getAttribute("#" + a, "aria-pressed") === "true", a + " was not selected");
      await page.tap("#" + b);
      assert(await page.getAttribute("#" + b, "aria-pressed") === "true", b + " was not selected");
    }
    assert(await page.inputValue("#margin") === "0", "the margin field is empty");
  });

  await test("a new workout can start from a built-in template", async () => {
    const page = await open({});
    await page.click("#tabPass");
    await page.click("#passNew");
    await page.click("#newFrom .opt:nth-child(3)");
    await page.click("#newCreate");
    await page.waitForFunction(() => !document.getElementById("plan").hidden);
    assert((await page.textContent("#sum_mid")).includes("30 s"), "the template did not turn on the interval exercise");
    assert((await passesIn(page)).length === 2, "the template should give a new workout");
  });

  await test("clearing the exercises can be undone", async () => {
    const page = await open({ st: 1, ex: 2, names: [["Knäböj", "Rodd"]] });
    await page.click("#stepEx");
    await page.click("#exClear");
    assert(await page.textContent(".scard .nmb") === "Välj övning", "exercises were not cleared");
    await page.click("#toastUndo");
    assert(await page.textContent(".scard .nmb") === "Knäböj", "undo did not bring the exercises back");
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
      const s = document.getElementById(id); s.hidden = false; s.querySelectorAll(".pane").forEach((p) => (p.hidden = false));
      s.querySelectorAll("details:not(.item)").forEach((d) => (d.open = true)); return s.innerText; }).join("\n"));
    const left = text.split("\n").filter((l) => /[åäöÅÄÖ]/.test(l) && !/Knäböj|Höft|Bröst|Övre|Bål|Fjärilen|Kobran|Barnets|Framsida|Baksida|Vader|Sidosträck|Arm över|Djup|Katt|Triceps|Nedåtgående|Duvan/.test(l));
    assert(!left.length, "Swedish text left in English mode: " + left.slice(0, 5).join(" | "));
  });

  await test("a backup can be exported and read back into an empty app", async () => {
    const page = await open({ st: 5, names: [["Knäböj"], ["Egen övning X"]] });
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
    await fresh.click("#passNew").catch(() => {});
    await fresh.click("#newCancel").catch(() => {});
    await fresh.setInputFiles("#impFile", file);
    await fresh.waitForFunction(() => /Klart/.test(document.getElementById("bkMsg").textContent));
    assert((await fresh.textContent("#passList")).includes("Test"), "the workout did not come back");
    assert(await fresh.inputValue("#st") === "5", "the workout that was open did not open again");
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

  await test("opening a workout keeps this phone's sound settings", async () => {
    const page = await open(null, { raw: { ccage: { vol: 30, voice: true }, ccage_cur: '"p1"',
      ccage_passes: [{ id: "p1", name: "Ett", updated: 2, cfg: JSON.stringify({ st: 2 }) }, { id: "p2", name: "Gammalt", updated: 1, cfg: JSON.stringify({ st: 4, vol: 90, voice: false }) }] } });
    await page.click("#tabPass");
    const items = await page.$$("#passList .item");
    for (const it of items) if ((await it.innerText()).includes("Gammalt")) { await (await it.$("button:nth-child(2)")).click(); break; }
    assert(await page.inputValue("#st") === "4", "the workout was not opened");
    const c = await page.evaluate(() => JSON.parse(localStorage.getItem("ccage")));
    assert(c.vol === 30 && c.voice === true, "sound settings changed: vol " + c.vol + ", voice " + c.voice);
  });

  await test("an exercise description shows on the timer during the demo", async () => {
    const page = await open({ st: 1, ex: 1, names: [["Knäböj"]], instr: 20 });
    await page.evaluate(() => localStorage.setItem("ccage_exlib", JSON.stringify([{ id: "b:Knäböj", desc: "Fötterna axelbrett.", updated: 1 }])));
    await page.reload();
    await page.click("#tabRun");
    for (let i = 0; i < 10 && (await page.textContent("#rPhase")) !== "Genomgång"; i++) await page.click("#bNext");
    const d = await page.textContent("#rDesc");
    assert(await page.isVisible("#rDesc") && /^Fötterna axelbrett, tårna lätt utåt/.test(d) && /\nTitta på: Knäna följer tårna/.test(d) && d.endsWith("\nFötterna axelbrett."), "the demo should show how to do it, what to watch and then your comment: " + d);
    for (let i = 0; i < 10 && (await page.textContent("#rPhase")) !== "Arbete"; i++) await page.click("#bNext");
    assert((await page.textContent("#rDesc")) === "Fötterna axelbrett.", "during work your own comment should show");
  });

  await test("an imported workout cannot push settings outside their range", async () => {
    const page = await open({ st: 3 });
    await page.click("#tabPass");
    const bad = { format: "crosscage-klocka", version: 1, passes: [{ name: "Trasigt", updated: 9, cfg: { st: 1e7, rd: -5, ex: 99, total: 1e9, rounds: [{ work: 1e6 }], roundSets: [999] } }], exercises: [], settings: { vol: 5000 } };
    await page.setInputFiles("#impFile", { name: "b.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(bad)) });
    await page.waitForFunction(() => /Klart/.test(document.getElementById("bkMsg").textContent));
    const items = await page.$$("#passList .item");
    for (const it of items) if ((await it.innerText()).includes("Trasigt")) { await (await it.$("button:nth-child(2)")).click(); break; }
    const c = await page.evaluate(() => JSON.parse(localStorage.getItem("ccage")));
    assert(c.st === 20 && c.rd === 1 && c.ex === 4 && c.total === 180 && c.vol === 100, "values not limited: " + JSON.stringify({ st: c.st, rd: c.rd, ex: c.ex, total: c.total, vol: c.vol }));
    assert(!page.errors.length, page.errors.join("; "));
  });

  await test("undo after an import brings back the workouts and exercises from before", async () => {
    const page = await open(null, { raw: { ccage: { st: 2 }, ccage_cur: '"p1"',
      ccage_passes: [{ id: "p1", name: "Mitt pass", updated: 1, cfg: JSON.stringify({ st: 2 }) }],
      ccage_exlib: [{ id: "u1", name: "Min övning", group: "", desc: "gammal", updated: 1 }] } });
    await page.click("#tabPass");
    const file = { format: "crosscage-klocka", version: 1, lang: "en",
      passes: [{ name: "Mitt pass", updated: 99, cfg: { st: 9 } }, { name: "Nytt pass", updated: 5, cfg: { st: 7 } }],
      exercises: [{ id: "u1", name: "Min övning", group: "", desc: "ny", updated: 99 }], settings: {} };
    await page.setInputFiles("#impFile", { name: "b.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(file)) });
    await page.waitForFunction(() => /Done|Klart/.test(document.getElementById("bkMsg").textContent));
    await page.click("#toastUndo");
    await page.waitForFunction(() => /ångrades|undone/.test(document.getElementById("bkMsg").textContent));
    const s = await page.evaluate(() => ({ passes: JSON.parse(localStorage.getItem("ccage_passes")), lib: JSON.parse(localStorage.getItem("ccage_exlib")), lang: localStorage.getItem("ccage_lang") }));
    assert(s.passes.length === 1 && JSON.parse(s.passes[0].cfg).st === 2, "workouts not restored: " + JSON.stringify(s.passes.map((p) => [p.name, p.cfg])));
    assert(s.lib[0].desc === "gammal", "exercises not restored");
    assert(s.lang === "sv", "language not restored: " + s.lang);
  });

  await test("a deleted own exercise stays deleted when an older copy is imported", async () => {
    const page = await open({}, { raw: { ccage_exlib: [{ id: "u1", name: "Gammal övning", group: "", desc: "", deleted: true, updated: 50 }] } });
    await page.click("#tabPass");
    const file = { format: "crosscage-klocka", version: 1, passes: [], exercises: [{ id: "u1", name: "Gammal övning", group: "", desc: "", updated: 10 }], settings: {} };
    await page.setInputFiles("#impFile", { name: "b.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(file)) });
    await page.waitForFunction(() => /Klart/.test(document.getElementById("bkMsg").textContent));
    await page.click("#tabEx");
    await page.fill("#exSearch", "Gammal övning");
    assert((await page.$$("#exItems details")).length === 0, "the deleted exercise came back");
  });

  await test("Settings shows the same version as the service worker, and the backup carries it", async () => {
    const v = /const VERSION = "crosscage-v(\d+)"/.exec(fs.readFileSync(path.join(ROOT, "sw.js"), "utf8"))[1];
    const page = await open({});
    await page.click("#tabSet");
    assert((await page.textContent("#appVer")) === "Version " + v, "shows " + (await page.textContent("#appVer")) + ", expected Version " + v);
    await page.click("#tabPass");
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#expBtn")]);
    assert(JSON.parse(fs.readFileSync(await dl.path(), "utf8")).appVersion === v, "the backup has no app version");
  });

  await test("a new workout uses the defaults from Settings, but not their exercises", async () => {
    const page = await open({ st: 5, rd: 3, warm: 7, stretch: 4, names: [["Knäböj"]], vol: 40 });
    await page.click("#tabSet");
    await page.click("#defSave");
    assert(/Dina standardvärden/.test(await page.textContent("#defSum")), "the summary does not show your defaults");
    await page.click("#tabPass");
    await page.click("#passNew");
    assert(/Mina standardvärden/.test(await page.textContent("#newFrom .opt:nth-child(1)")), "the dialog does not offer your defaults");
    await page.click("#newCreate");
    await page.waitForFunction(() => !document.getElementById("plan").hidden);
    const c = await page.evaluate(() => JSON.parse(localStorage.getItem("ccage")));
    assert(c.rd === 3 && c.warm === 7 && c.stretch === 4 && c.st === 1, "new workout does not use the defaults: " + JSON.stringify({ st: c.st, rd: c.rd, warm: c.warm, stretch: c.stretch }));
    assert(!c.names.length && c.vol === 40, "names should be empty and phone settings kept");
    await page.click("#tabSet");
    await page.click("#defReset");
    assert(/Appens standard/.test(await page.textContent("#defSum")), "reset did not take");
  });

  await test("the defaults travel with the backup", async () => {
    const page = await open({ st: 6, rd: 4 });
    await page.click("#tabSet");
    await page.click("#defSave");
    await page.click("#tabPass");
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#expBtn")]);
    const file = await dl.path();
    const fresh = await open();
    await fresh.setInputFiles("#impFile", file);
    await fresh.waitForFunction(() => /Klart/.test(document.getElementById("bkMsg").textContent));
    assert(await fresh.evaluate(() => JSON.parse(localStorage.getItem("ccage_defaults")).rd) === 4, "defaults not imported");
  });

  await test("a plan from the previous version becomes a workout, so nothing is lost", async () => {
    const page = await open(null, { raw: { ccage: { st: 6, names: [["Utfall"]] }, ccage_saved: { name: "Torsdag", data: "x" },
      ccage_passes: [{ id: "p1", name: "Torsdag", updated: 1, cfg: JSON.stringify({ st: 4 }) }] } });
    await page.waitForTimeout(300);
    const ps = await passesIn(page);
    assert(ps.length === 2 && ps.some((p) => p.name === "Torsdag (ändrad)" && JSON.parse(p.cfg).st === 6), "migration: " + JSON.stringify(ps.map((p) => p.name)));
    assert(await page.evaluate(() => JSON.parse(localStorage.getItem("ccage_cur"))) !== "p1", "the changed plan should be the open workout");
  });

  await test("the menu and the workout banner stay in place while the content scrolls", async () => {
    const page = await open({ st: 8, names: [["Knäböj"], ["Utfall"], ["Planka"], ["Burpees"], ["Hopprep"], ["Dips"], ["Chins"], ["Situps"]] }, { device: devices["iPhone SE"] });
    await page.click("#stepTime");
    const before = await page.evaluate(() => [document.querySelector(".nav").getBoundingClientRect().top, document.getElementById("curBar").getBoundingClientRect().top]);
    await page.evaluate(() => document.getElementById("scroller").scrollTo(0, 99999));
    const after = await page.evaluate(() => ({ pos: [document.querySelector(".nav").getBoundingClientRect().top, document.getElementById("curBar").getBoundingClientRect().top],
      scrolled: document.getElementById("scroller").scrollTop, page: document.documentElement.scrollHeight, vh: innerHeight, wide: document.documentElement.scrollWidth > innerWidth }));
    assert(after.scrolled > 0, "the content did not scroll");
    assert(after.pos[0] === before[0] && after.pos[1] === before[1], "the menu or banner moved: " + JSON.stringify([before, after.pos]));
    assert(after.page <= after.vh && !after.wide, "the page itself scrolls; only the middle should");
    assert((await page.textContent("#edTitle")) === "Test" && (await page.textContent("#goBtn")) === "▶ Kör passet", "banner or Run button text is wrong");
    await page.click("#curRun");
    assert(await page.isVisible("#run"), "Run in the banner should open the timer");
  });

  await test("starting the app does not overwrite the open workout's name, description or last run", async () => {
    const c = { st: 2 };
    const page = await open(null, { raw: { ccage: c, ccage_cur: '"p1"', ccage_migrated: "true",
      ccage_passes: [{ id: "p1", name: "Ben", desc: "Kettlebells", updated: 5, lastRun: 7, cfg: JSON.stringify(c) }] } });
    await page.waitForTimeout(1500);
    const p = (await passesIn(page))[0];
    assert(p.name === "Ben" && p.desc === "Kettlebells" && p.lastRun === 7 && p.updated === 5, "the workout was rewritten: " + JSON.stringify(p));
  });

  await test("the stored workout wins over an old copy on this phone, unless this phone has unsaved edits", async () => {
    const stale = await open(null, { raw: { ccage: { st: 3 }, ccage_cur: '"p1"', ccage_migrated: "true",
      ccage_passes: [{ id: "p1", name: "Ben", updated: 9, cfg: JSON.stringify({ st: 5 }) }] } });
    await stale.waitForTimeout(1300);
    assert(await stale.inputValue("#st") === "5" && JSON.parse((await passesIn(stale))[0].cfg).st === 5, "an old local copy replaced the stored workout");
    const dirty = await open(null, { raw: { ccage: { st: 3 }, ccage_cur: '"p1"', ccage_migrated: "true", ccage_dirty: '"p1"',
      ccage_passes: [{ id: "p1", name: "Ben", updated: 9, cfg: JSON.stringify({ st: 5 }) }] } });
    await dirty.waitForFunction(() => document.getElementById("saveState").textContent === "Sparat");
    assert(await dirty.inputValue("#st") === "3" && JSON.parse((await passesIn(dirty))[0].cfg).st === 3, "unsaved edits on this phone were lost");
  });

  await test("switching workouts right after an edit saves the edit to the right workout", async () => {
    const page = await open(null, { raw: { ccage: { total: 45 }, ccage_cur: '"x"', ccage_migrated: "true",
      ccage_passes: [{ id: "x", name: "X", updated: 2, cfg: JSON.stringify({ total: 45 }) }, { id: "y", name: "Y", updated: 1, cfg: JSON.stringify({ total: 30 }) }] } });
    await page.click("#stepTime");
    await page.click('[data-step="total:1"]');
    await page.click("#tabPass");
    const items = await page.$$("#passList .item");
    for (const it of items) if ((await it.innerText()).startsWith("Y")) { await (await it.$("button:nth-child(2)")).click(); break; }
    await page.waitForTimeout(1300);
    const ps = await passesIn(page), X = ps.find((p) => p.id === "x"), Y = ps.find((p) => p.id === "y");
    assert(JSON.parse(X.cfg).total === 46 && X.name === "X", "the edit did not reach X: " + X.cfg.slice(0, 80));
    assert(JSON.parse(Y.cfg).total === 30 && Y.name === "Y", "Y was changed");
    assert(await page.textContent("#edTitle") === "Y" && await page.inputValue("#total") === "30", "Y is not open");
    // reopening X shows the edit
    await page.click("#tabPass");
    for (const it of await page.$$("#passList .item")) if ((await it.innerText()).startsWith("X")) { await (await it.$("button:nth-child(2)")).click(); break; }
    assert(await page.inputValue("#total") === "46", "reopening X lost the edit");
  });

  await test("reloading after deleting the open workout does not create an untitled workout", async () => {
    const page = await open(null, { raw: { ccage: { st: 4 }, ccage_cur: "null", ccage_migrated: "true",
      ccage_passes: [{ id: "a", name: "A", updated: 1, cfg: JSON.stringify({ st: 2 }) }] } });
    await page.reload(); await page.waitForTimeout(400);
    const ps = await passesIn(page);
    assert(ps.length === 1, "extra workouts were created: " + ps.map((p) => p.name).join(", "));
  });

  await test("importing a newer copy of the open workout shows it, and later edits keep it", async () => {
    const page = await open({ st: 4 });
    await page.click("#tabPass");
    const file = { format: "crosscage-klocka", version: 1, passes: [{ name: "Test", updated: 99, cfg: { st: 8, total: 50 } }], exercises: [], settings: {} };
    await page.setInputFiles("#impFile", { name: "b.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(file)) });
    await page.waitForFunction(() => /Klart/.test(document.getElementById("bkMsg").textContent));
    assert(await page.inputValue("#st") === "8", "the open workout still shows the old version");
    await page.click("#tabPass"); await page.click("#passList .item button:nth-child(2)"); await page.click("#stepTime");
    await page.click('[data-step="total:1"]');
    await page.waitForFunction(() => document.getElementById("saveState").textContent === "Sparat");
    const c = JSON.parse((await passesIn(page))[0].cfg);
    assert(c.st === 8 && c.total === 51, "the edit saved the old version over the import: " + JSON.stringify({ st: c.st, total: c.total }));
  });

  await test("choosing an exercise keeps the workout's B slots, and Enter adds a typed exercise", async () => {
    const page = await open({ st: 2, ex: 2, names: [] });
    await page.click("#stepEx");
    await page.click(".scard:nth-child(1) .nmb");
    await page.fill("#pickSearch", "knäböj"); await page.click("#pickList .pick");
    assert(await page.inputValue("#ex") === "2", "choosing an exercise dropped the B slots");
    await page.click(".scard:nth-child(2) .nmb");
    await page.fill("#pickSearch", "Rodd");
    await page.press("#pickSearch", "Enter");
    assert(await page.textContent(".scard:nth-child(2) .nmb") === "Rodd", "Enter picked a partial match instead of the typed exercise");
  });

  await test("every built-in exercise and stretch has instructions, in Swedish and English", async () => {
    const src = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
    const grab = (name) => { const s = src.indexOf("const " + name + "="); assert(s >= 0, name + " missing"); let i = src.indexOf("=", s) + 1, depth = 0, e = i;
      for (; e < src.length; e++) { const ch = src[e]; if (ch === "[" || ch === "{") depth++; else if (ch === "]" || ch === "}") { depth--; if (!depth) break; } } return eval("(" + src.slice(i, e + 1) + ")"); };
    const BANK = grab("BANK"), STRETCH = grab("STRETCH"), INFO = grab("INFO"), STRETCH_INFO = grab("STRETCH_INFO");
    const noInfo = BANK.filter((b) => !(INFO[b[0]] && INFO[b[0]].length === 4 && INFO[b[0]].every((x) => typeof x === "string" && x.length > 20))).map((b) => b[0]);
    const noStretch = STRETCH.filter((s) => !(STRETCH_INFO[s[0]] && STRETCH_INFO[s[0]].length === 2 && STRETCH_INFO[s[0]].every((x) => typeof x === "string" && x.length > 20))).map((s) => s[0]);
    const unknown = Object.keys(INFO).filter((k) => !BANK.some((b) => b[0] === k)).concat(Object.keys(STRETCH_INFO).filter((k) => !STRETCH.some((s) => s[0] === k)));
    assert(!noInfo.length && !noStretch.length && !unknown.length, "missing: " + noInfo.concat(noStretch).join(", ") + (unknown.length ? "; no such exercise: " + unknown.join(", ") : ""));
    const page = await open({});
    const r = await page.evaluate(() => {
      const fails = [];
      for (const lang of ["sv", "en"]) {
        document.querySelector('[data-lang="' + lang + '"]').click();
        const all = [...document.querySelectorAll("#exItems details")];
        if (all.length < 46) fails.push(lang + ": only " + all.length + " exercises listed");
      }
      document.querySelector('[data-lang="sv"]').click();
      return fails;
    });
    assert(!r.length, r.join("; "));
    await page.click("#tabEx");
    await page.fill("#exSearch", "kettlebell swing");
    await page.click("#exItems summary");
    const txt = await page.textContent("#exItems details[open]");
    assert(/Utförande/.test(txt) && /Titta särskilt på/.test(txt) && /Kraften kommer från höften/.test(txt), "the instructions are not shown: " + txt.slice(0, 200));
    await page.click("#tabSet"); await page.click('[data-lang="en"]'); await page.click("#tabEx");
    await page.fill("#exSearch", "kettlebell swing");
    await page.evaluate(() => (document.querySelector("#exItems details").open = true));
    assert(/Power comes from the hips/.test(await page.textContent("#exItems details[open]")), "no English instructions");
  });

  await test("own comments on a built-in exercise and own exercises with instructions are saved", async () => {
    const page = await open({ st: 1, ex: 1, names: [["Sandsäck"]], instr: 20 });
    await page.click("#tabEx");
    await page.fill("#exSearch", "Planka");
    await page.click("#exItems summary");
    await page.fill("#exItems details[open] textarea", "Vi kör på knä första veckan.");
    await page.fill("#exSearch", "Sandsäck");
    await page.click("#exAdd");
    const areas = await page.$$("#exItems details[open] textarea");
    assert(areas.length === 2, "an own exercise should have How and Watch fields");
    await areas[0].fill("Lyft säcken till axeln.");
    await areas[1].fill("Rak rygg i lyftet.");
    const lib = await page.evaluate(() => JSON.parse(localStorage.getItem("ccage_exlib")));
    assert(lib.some((x) => x.id === "b:Planka" && x.desc === "Vi kör på knä första veckan."), "the comment on Planka was not saved");
    assert(lib.some((x) => x.name === "Sandsäck" && x.how === "Lyft säcken till axeln." && x.look === "Rak rygg i lyftet."), "the own exercise was not saved");
    await page.click("#tabRun");
    for (let i = 0; i < 10 && (await page.textContent("#rPhase")) !== "Genomgång"; i++) await page.click("#bNext");
    const d = await page.textContent("#rDesc");
    assert(/Lyft säcken till axeln/.test(d) && /Titta på: Rak rygg i lyftet/.test(d), "the own exercise's instructions are not on the timer: " + d);
  });

  await test("the menu comes back to the bottom of the screen if the page gets shifted, as iOS does after the keyboard or a file picker", async () => {
    const page = await open({}, { device: devices["iPhone 13"] });
    await page.click("#tabPass");
    // let the document scroll the way iOS shifts it, then shift it
    // read the shift in the same step: the app's own scroll handler puts the page back right after
    const shifted = await page.evaluate(() => { document.documentElement.style.overflow = "visible"; document.body.style.overflow = "visible"; document.body.style.height = "3000px"; window.scrollTo(0, 300); return window.scrollY; });
    assert(shifted > 0, "could not simulate the shift");
    await page.evaluate(() => document.dispatchEvent(new FocusEvent("focusout")));
    await page.waitForTimeout(200);
    const r = await page.evaluate(() => ({ y: window.scrollY, bottom: Math.round(document.querySelector(".nav").getBoundingClientRect().bottom), vh: innerHeight }));
    assert(r.y === 0 && r.bottom === r.vh, "the page stayed shifted: " + JSON.stringify(r));
  });

  await test("starting with the timer on the lock screen says that other music is paused, and one tap turns it off", async () => {
    const page = await open({ lock: true });
    await page.click("#tabRun");
    await page.click("#bMain");
    assert(await page.isVisible("#toast") && /pausas musik i andra appar/.test(await page.textContent("#toastMsg")), "no note about music being paused");
    assert(await page.textContent("#toastUndo") === "Stäng av", "the button should turn the lock screen off");
    await page.click("#toastUndo");
    assert(await page.evaluate(() => JSON.parse(localStorage.getItem("ccage")).lock) === false, "the lock screen was not turned off");
    await page.click("#bMain"); await page.click("#bMain");
    assert(await page.isHidden("#toast"), "the note should not come back");
    // without the lock screen there is no note
    const quiet = await open({ lock: false });
    await quiet.click("#tabRun"); await quiet.click("#bMain");
    assert(await quiet.isHidden("#toast"), "a note showed without the lock screen");
    // the next undo bar says Undo again, and the label follows the language
    await page.click("#tabPass"); await page.click("#passList .item button:nth-child(4)");
    await page.waitForFunction(() => !document.getElementById("toast").hidden && /Tog bort/.test(document.getElementById("toastMsg").textContent));
    assert(await page.textContent("#toastUndo") === "Ångra", "the button text stayed from the lock note: " + await page.textContent("#toastUndo"));
    await page.click("#tabSet"); await page.click('[data-lang="en"]');
    assert(await page.textContent("#toastUndo") === "Undo", "the button label did not follow the language");
    // "always audible" pauses music too, so turning the lock screen off from the note also leaves it
    const loud = await open({ lock: true, mix: "playback" });
    await loud.click("#tabRun"); await loud.click("#bMain"); await loud.click("#toastUndo");
    const c = await loud.evaluate(() => JSON.parse(localStorage.getItem("ccage")));
    assert(c.lock === false && c.mix === "ambient", "still set to pause music: " + JSON.stringify({ lock: c.lock, mix: c.mix }));
  });

  await browser.close();
  server.close();
  const failed = results.filter((r) => r[0] === "FAIL").length;
  console.log("\n" + (results.length - failed) + " passed, " + failed + " failed");
  process.exit(failed ? 1 : 0);
})();
