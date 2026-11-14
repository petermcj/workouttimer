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
    if (opts.before) await opts.before(ctx);
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
    for (const [a, b, stepId] of [["mgOver", "mgBuffer", "stepTime"], ["evenOff", "evenOn", "stepTime"], ["midSt", "midOff", "stepEx"], ["nsLetter", "nsName", "stepEx"], ["voiceOn", "voiceOff", null]]) {
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

  await test("after a pause, Optimise makes the workout end in time", async () => {
    const page = await open({ total: 45 });
    await page.clock.install();
    await page.reload();
    await page.click("#tabRun");
    await page.click("#bMain"); await page.clock.runFor(30000);
    await page.click("#bMain"); await page.clock.runFor(180000);
    await page.click("#bOpt");
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
    const v = /const VERSION = "workouttimer-v(\d+)"/.exec(fs.readFileSync(path.join(ROOT, "sw.js"), "utf8"))[1];
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

  await test("installed on iPhone, the frame ends with the window and is never stretched past it, where nothing is drawn", async () => {
    const at = async (height, standalone) => {
      const dev = Object.assign({}, devices["iPhone 13"], { viewport: { width: 390, height }, screen: { width: 390, height: 844 } });
      const page = await open({}, { device: dev });
      if (standalone) { await page.evaluate(() => Object.defineProperty(navigator, "standalone", { value: true })); await page.evaluate(() => window.dispatchEvent(new Event("resize"))); await page.waitForTimeout(150); }
      return page.evaluate(() => Math.round(document.querySelector(".nav").getBoundingClientRect().bottom));
    };
    assert(await at(797, true) === 797, "the menu was pushed below the window");
    assert(await at(797, false) === 797, "in the browser the menu must stay above the toolbar");
    // the gap itself is fixed by an opaque status bar, which iOS reads when the app is added to the Home Screen
    const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    assert(/name="apple-mobile-web-app-status-bar-style" content="black"/.test(html), "a see-through status bar leaves an empty strip under the menu on iOS 26");
  });

  await test("without an open workout, the heading keeps clear of the status bar", async () => {
    const page = await open(null);
    assert(await page.isHidden("#curBar"), "a workout banner showed without an open workout");
    const pad = await page.evaluate(() => getComputedStyle(document.getElementById("scroller")).paddingTop);
    assert(pad === "12px", "unexpected top padding without safe areas: " + pad);
  });

  await test("a combined demo lists the exercises at every station", async () => {
    const page = await open({ st: 3, ex: 2, warm: 0, instrMode: "block", instrUnit: "total", instrTot: 3, names: [["Knäböj", "Armhävning"], ["Rodd", ""], ["Utfall", "Plankan"]] });
    await page.click("#tabRun");
    for (let i = 0; i < 3 && !/Genomgång/i.test(await page.textContent("#rPhase")); i++) await page.click("#bNext");
    assert(/Genomgång/i.test(await page.textContent("#rPhase")), "the demo was not reached: " + await page.textContent("#rPhase"));
    const d = await page.textContent("#rDesc");
    assert(d === "1. A Knäböj · B Armhävning\n2. A Rodd · B –\n3. A Utfall · B Plankan", "the list of exercises: " + JSON.stringify(d));
    assert(await page.isVisible("#rDesc"), "the list is not shown");
  });

  await test("in focus mode the timer keeps clear of the status bar", async () => {
    const page = await open({});
    await page.click("#tabRun");
    await page.evaluate(() => document.body.classList.add("focus"));
    const rule = await page.evaluate(() => [...document.styleSheets].flatMap((s) => [...s.cssRules]).some((r) => r.selectorText && r.selectorText.includes("body.focus .scroll") && /safe-area-inset-top/.test(r.style.paddingTop)));
    assert(rule, "focus mode does not keep the page clear of the status bar");
  });

  await test("the time left in the workout keeps running during a pause, and says how far behind the plan is", async () => {
    const page = await open({ total: 45 });
    await page.clock.install();
    await page.reload();
    await page.click("#tabRun");
    assert(await page.isHidden("#passLeft"), "time left showed before the start");
    await page.click("#bMain"); await page.clock.runFor(30000);
    assert(/^44:[34]\d$/.test(await page.textContent("#plTime")), "time left after 30 s: " + await page.textContent("#plTime"));
    assert(/i tid/.test(await page.textContent("#plState")) && await page.isHidden("#bOpt"), "on time at the start: " + await page.textContent("#plState"));
    await page.click("#bMain"); await page.clock.runFor(120000);
    assert(/^42:[34]\d$/.test(await page.textContent("#plTime")), "the time left stopped during the pause: " + await page.textContent("#plTime"));
    const st = await page.textContent("#plState");
    assert(/Planen ligger 2:0\d efter/.test(st) && await page.isVisible("#bOpt"), "the pause was not shown as behind: " + st);
    assert(await page.evaluate(() => document.getElementById("passLeft").classList.contains("late")), "behind is not marked");
  });

  await test("Optimise shortens work, rest, switches and stretching but not the warm-up or demos, and can be undone", async () => {
    const page = await open({ total: 45, stretch: 3 });
    await page.clock.install();
    await page.reload();
    await page.click("#tabRun");
    await page.click("#bMain"); await page.clock.runFor(5000);
    await page.click("#bMain"); await page.clock.runFor(240000);
    await page.click("#bOpt");
    assert(/kortades \d+ %/.test(await page.textContent("#toastMsg")), "no message: " + await page.textContent("#toastMsg"));
    assert(/i tid/.test(await page.textContent("#plState")), "still not on time: " + await page.textContent("#plState"));
    await page.click("#bNext");
    assert(await page.textContent("#rPhase") === "Uppvärmning" && await page.textContent("#rClock") === "10:00", "the warm-up was changed: " + await page.textContent("#rClock"));
    await page.click("#toastUndo");
    // (stepping to the warm-up skipped the last 5 s of the get-ready countdown)
    assert(/Planen ligger 3:5\d efter/.test(await page.textContent("#plState")), "undo did not bring the plan back: " + await page.textContent("#plState"));
  });

  await test("Optimise never goes below 10 s of work and 5 s of rest, and says when it cannot catch up", async () => {
    const page = await open({ total: 20, warm: 0, instr: 0, ready: 0, stretch: 0, st: 4, ex: 1, sets: 2, rd: 2 });
    await page.clock.install();
    await page.reload();
    await page.click("#tabRun");
    await page.click("#bMain"); await page.clock.runFor(2000);
    await page.click("#bMain"); await page.clock.runFor(18 * 60000);
    await page.click("#bOpt");
    assert(/ändå .* sent/.test(await page.textContent("#toastMsg")), "it did not say the workout ends late: " + await page.textContent("#toastMsg"));
    // run through and check every interval
    await page.click("#bMain");
    const seen = [];
    for (let i = 0; i < 400 && (await page.textContent("#bMain")) !== "Start"; i++) {
      const ph = await page.textContent("#rPhase"), c = await page.textContent("#rClock");
      if (!seen.length || seen[seen.length - 1][0] !== ph + i) seen.push([ph, c]);
      await page.click("#bNext");
    }
    const work = seen.filter(([p]) => p === "Arbete").map(([, c]) => mmss(c)), rest = seen.filter(([p]) => p === "Vila" || p === "Byt station").map(([, c]) => mmss(c));
    assert(work.length && Math.min(...work) >= 10, "work below 10 s: " + work.join(","));
    assert(rest.every((x) => x >= 5), "rest below 5 s: " + rest.join(","));
  });

  await test("Optimise lengthens the rest of the workout when there is time to spare, at most by half", async () => {
    const page = await open({ total: 30, warm: 0, instr: 0, ready: 0, stretch: 0, st: 4, ex: 1, sets: 1, rd: 2 });
    await page.clock.install();
    await page.reload();
    await page.click("#tabRun");
    await page.click("#bMain");
    for (let i = 0; i < 6; i++) await page.click("#bNext");
    assert(/över i slutet/.test(await page.textContent("#plState")), "skipping ahead did not leave time to spare: " + await page.textContent("#plState"));
    await page.click("#bOpt");
    assert(/förlängdes \d+ %/.test(await page.textContent("#toastMsg")), "nothing was lengthened: " + await page.textContent("#toastMsg"));
    const pct = +/(\d+) %/.exec(await page.textContent("#toastMsg"))[1];
    assert(pct > 0 && pct <= 50, "lengthened by " + pct + " %");
  });

  await test("for own training there are no demos, no instructor texts and a simpler timer", async () => {
    const page = await open({ total: 45, instrMode: "block", instrUnit: "per", instr: 30, st: 3, ex: 2, names: [["Knäböj", "Armhävning"]] });
    const total = async () => page.evaluate(() => document.getElementById("oTotal").textContent);
    const coachTotal = await total();
    await page.click("#tabSet"); await page.click("#roleSelf");
    assert(await page.evaluate(() => JSON.parse(localStorage.getItem("ccage")).role) === "self", "the choice was not saved");
    await page.click("#tabRun");
    assert(await page.isHidden(".adj"), "the ±30 s buttons are shown");
    for (let i = 0; i < 4; i++) { assert(!/Genomgång/.test(await page.textContent("#rPhase")), "a demo is in the timer"); await page.click("#bNext"); }
    await page.click("#tabPass"); await page.click("#passList .item button:nth-child(2)"); await page.click("#stepTime");
    assert(await page.isHidden("#instrBox"), "the demo settings are shown");
    await page.click("#tabEx"); await page.fill("#exSearch", "kettlebell swing");
    await page.click("#exItems summary");
    const txt = await page.textContent("#exItems details[open]");
    assert(/Utförande/.test(txt) && !/Titta särskilt på/.test(txt), "instructor texts are shown: " + txt.slice(0, 160));
    await page.click("#tabSet"); await page.click("#roleCoach");
    assert(await page.isVisible("#roleHint"), "no hint");
    assert(await total() === coachTotal, "the plan did not come back for an instructor");
  });

  await test("changing a setting during the workout does not move its end", async () => {
    const page = await open({ total: 45, mode: "manual" });
    await page.clock.install();
    await page.reload();
    await page.click("#tabRun");
    await page.click("#bMain"); await page.clock.runFor(20000); await page.click("#bMain");
    const before = [await page.textContent("#plEnd"), await page.textContent("#plState")];
    await page.click("#tabSet"); await page.click("#roleSelf"); await page.click("#tabRun");
    const after = [await page.textContent("#plEnd"), await page.textContent("#plState")];
    assert(before[0] === after[0] && before[1] === after[1], "the end moved: " + before.join(" / ") + " -> " + after.join(" / "));
  });

  // A stand-in for Spotify's API: answers what the app asks for and records what it is told to do.
  async function spotify(settings, player) {
    const calls = [];
    // The stand-in is in place before the page first loads, so nothing ever reaches the real Spotify (which would
    // answer that the login is invalid and log the app out).
    const before = async (ctx) => { await ctx.route("https://accounts.spotify.com/**", (rt) => rt.abort("internetdisconnected")); await ctx.route("https://api.spotify.com/**", (rt) => {
      const rq = rt.request(), u = new URL(rq.url()), p = u.pathname.replace("/v1", "");
      if (player.down) return rt.abort("internetdisconnected");
      const refused = () => rt.fulfill({ status: 403, json: { error: { status: 403, message: "Player command failed: Restriction violated", reason: "UNKNOWN" } } });
      if (rq.method() !== "GET") { calls.push(rq.method() + " " + p + u.search); if (player.real && /pause/.test(p) && !player.is_playing) return refused(); if (player.real && /play$/.test(p) && player.is_playing) return refused(); if (player.fail) return rt.fulfill({ status: player.fail, json: { error: { message: "nope", reason: player.reason || "UNKNOWN" } } }); if (/pause/.test(p)) player.is_playing = false; if (/play$/.test(p)) player.is_playing = true; return rt.fulfill({ status: 204, body: "" }); }
      if (p === "/me/player/currently-playing") return player.silent === "all" ? rt.fulfill({ status: 204, body: "" }) : rt.fulfill({ json: { is_playing: player.is_playing, item: { name: "Låt", artists: [{ name: "Artist" }] } } });
      if (p === "/me/player/devices") return rt.fulfill({ json: { devices: player.device ? [Object.assign({ is_active: !player.idle }, player.device)] : [] } });
      if (p === "/me/player") return player.device && !player.silent ? rt.fulfill({ json: { is_playing: player.is_playing, item: { name: "Låt", artists: [{ name: "Artist" }] }, device: player.device } }) : rt.fulfill({ status: 204, body: "" });
      if (p === "/me") return rt.fulfill({ json: { display_name: "P" } });
      rt.fulfill({ json: { items: [], devices: [] } });
    }); };
    const page = await open(settings || {}, { raw: { ccage_sp: { access: "a", clientId: "c", refresh: "r", exp: 9e15 } }, before });
    await page.click("#tabRun");
    await page.waitForFunction(() => document.getElementById("npTitle").textContent !== "Spotify");
    return { page, calls };
  }

  await test("the music has a clear pause button and a volume slider on the timer", async () => {
    const player = { is_playing: true, device: { volume_percent: 65, supports_volume: true } };
    const { page, calls } = await spotify({}, player);
    assert(await page.isVisible("#mPlay .ia") && await page.isHidden("#mPlay .ip"), "no pause symbol while the music plays");
    assert(await page.getAttribute("#mPlay", "aria-label") === "Pausa musiken", "the button is not named pause");
    assert(await page.isVisible("#mVol") && await page.inputValue("#mVol") === "65" && await page.textContent("#mVolOut") === "65 %", "the volume is not shown: " + await page.textContent("#mVolOut"));
    await page.click("#mPlay");
    await page.waitForFunction(() => !document.getElementById("mPlay").classList.contains("playing"));
    assert(calls.some((c) => c.startsWith("PUT /me/player/pause")), "pause was not sent: " + calls.join(", "));
    assert(await page.isVisible("#mPlay .ip") && await page.getAttribute("#mPlay", "aria-label") === "Spela musiken", "the button did not switch to play");
    await page.fill("#mVol", "40"); await page.dispatchEvent("#mVol", "change");
    await page.waitForFunction(() => document.getElementById("mVolOut").textContent === "40 %");
    for (let i = 0; i < 20 && !calls.some((c) => c.includes("volume_percent=40")); i++) await page.waitForTimeout(50);
    assert(calls.some((c) => c.includes("volume_percent=40")), "the volume was not sent: " + calls.join(", "));
  });

  await test("with lower volume during rest, the slider sets the level for the running kind of interval", async () => {
    const { page } = await spotify({ spDuck: true, spWorkVol: 80, spRestVol: 40 }, { is_playing: true, device: { volume_percent: 80, supports_volume: true } });
    await page.fill("#mVol", "60"); await page.dispatchEvent("#mVol", "change");
    // the level is saved once Spotify has accepted it
    await page.waitForFunction(() => JSON.parse(localStorage.getItem("ccage")).spWorkVol === 60, null, { timeout: 3000 }).catch(() => {});
    const c = await page.evaluate(() => JSON.parse(localStorage.getItem("ccage")));
    assert(c.spWorkVol === 60 && c.spRestVol === 40, "the levels: " + c.spWorkVol + " / " + c.spRestVol);
  });

  await test("a volume change that Spotify refuses is not saved, and says why", async () => {
    const player = { is_playing: true, device: { id: "d1", volume_percent: 80, supports_volume: true } };
    const { page } = await spotify({ spDuck: true, spWorkVol: 80, spRestVol: 40 }, player);
    player.fail = 404;
    await page.fill("#mVol", "30");
    await page.waitForFunction(() => !document.getElementById("mMsg").hidden);
    assert(/Ingen Spotify-enhet/.test(await page.textContent("#mMsg")), "the error: " + await page.textContent("#mMsg"));
    assert((await page.evaluate(() => JSON.parse(localStorage.getItem("ccage")))).spWorkVol === 80, "a refused level was saved");
  });

  await test("an arms workout gets upper-body stretches, not only legs", async () => {
    const page = await open({ st: 3, ex: 1, stretch: 5, names: [["Bicepscurl"], ["Hammercurl"], ["Tricepspress"]] });
    await page.click("#tabPass"); await page.click("#passList .item button:nth-child(2)"); await page.click("#stepEx");
    await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
    await page.click("#stretchSuggest");
    const list = (await page.inputValue("#stretchList")).split("\n");
    const upper = list.filter((s) => /Triceps|axel|Bröst|rygg|Sidosträck/i.test(s)).length;
    assert(upper >= 4, "stretches for an arms workout: " + list.join(" | "));
  });

  await test("when Spotify cannot set the volume on the device, the timer says so, and errors show by the buttons", async () => {
    const player = { is_playing: true, device: { volume_percent: 100, supports_volume: false } };
    const { page } = await spotify({}, player);
    assert(await page.isHidden("#mVolRow"), "a volume slider for a device that cannot set the volume");
    assert(!/telefonens knappar/.test(await page.textContent("#musicBar")), "the timer explains the volume, which is not needed there");
    player.fail = 403; player.reason = "PREMIUM_REQUIRED";
    await page.click("#mPlay");
    await page.waitForFunction(() => !document.getElementById("mMsg").hidden);
    assert(/Premium/.test(await page.textContent("#mMsg")), "the error is not shown on the timer: " + await page.textContent("#mMsg"));
  });

  await test("exercises are grouped by body part, each with an icon, and old groups are carried over", async () => {
    const page = await open({ st: 2, ex: 2, names: [["Knäböj", "Min rodd"], ["Bicepscurl", "Något eget"]] },
      { raw: { ccage_exlib: [{ id: "u1", name: "Min rodd", group: "pull", desc: "", updated: 1 }, { id: "u2", name: "Min press", group: "push", desc: "", updated: 1 }] } });
    await page.click("#tabEx");
    const chips = await page.$$eval("#exGroups button", (b) => b.map((x) => x.textContent));
    assert(["Ben", "Rygg", "Bröst", "Axlar", "Armar", "Bål", "Kondition", "Helkropp"].every((g) => chips.includes(g)) && !chips.includes("Drag") && !chips.includes("Press"), "the groups: " + chips.join(", "));
    const rows = await page.$$eval("#exItems details", (ds) => ds.map((d) => ({ n: d.querySelector(".nm").textContent, g: d.querySelector(".gi").dataset.g, svg: !!d.querySelector(".gi svg"), tags: [...d.querySelectorAll(".tag")].map((x) => x.textContent) })));
    assert(rows.length >= 50 && rows.every((r) => r.svg), "rows without an icon");
    const by = (n) => rows.find((r) => r.n === n);
    assert(by("Min rodd").g === "back" && by("Min rodd").tags.includes("Rygg") && by("Min press").g === "chest", "old groups were not carried over: " + JSON.stringify([by("Min rodd"), by("Min press")]));
    assert(by("Armhävningar").g === "chest" && by("Axelpress").g === "shoulders" && by("Tricepspress").g === "arms" && by("Burpees").g === "full" && by("Rygglyft").g === "back", "unexpected groups");
    const empty = ["legs", "back", "chest", "shoulders", "arms", "core", "cardio", "full"].filter((g) => rows.filter((r) => r.g === g).length < 3);
    assert(!empty.length, "groups with fewer than three exercises: " + empty.join(", "));
    // the station cards and the picker show the icons too
    await page.click("#tabPass"); await page.click("#passList .item button:nth-child(2)"); await page.click("#stepEx");
    const cards = await page.$$eval("#stCards .slot .gi", (g) => g.map((x) => x.dataset.g));
    assert(cards.join(",") === "legs,back,arms,", "icons on the station cards: " + cards.join(","));
    await page.click("#stCards .slot .nmb");
    assert(await page.locator("#pickList .pick .gi svg").count() >= 48, "no icons in the picker");
    assert(!page.errors.length, page.errors.join("; "));
  });

  await test("without internet the music buttons are dimmed with a line about it, the timer runs, and the music starts when the connection is back", async () => {
    const player = { is_playing: false, device: { id: "d1", volume_percent: 70, supports_volume: true } };
    const { page, calls } = await spotify({ spStart: true }, player);
    assert(!await page.evaluate(() => document.getElementById("musicBar").classList.contains("off")) && await page.isVisible("#mVol"), "the buttons should be on with internet");
    player.down = true; await page.context().setOffline(true);
    await page.click("#bMain");
    await page.waitForFunction(() => !document.getElementById("mMsg").hidden);
    assert(/Når inte Spotify/.test(await page.textContent("#mMsg")), "the line: " + await page.textContent("#mMsg"));
    assert(await page.evaluate(() => document.getElementById("musicBar").classList.contains("off")) && await page.isHidden("#mVolRow"), "the buttons are not dimmed");
    assert(await page.isEnabled("#mPlay"), "the button must stay usable, as a way to try again");
    assert(await page.textContent("#bMain") === "Paus", "the timer did not start");
    assert(!calls.length, "something reached Spotify without internet: " + calls.join(", "));
    await page.click("#tabSet"); await page.click('button[data-lang="en"]'); await page.click("#tabRun");
    assert(/Cannot reach Spotify/.test(await page.textContent("#mMsg")), "the line did not follow the language: " + await page.textContent("#mMsg"));
    player.down = false; await page.context().setOffline(false);
    await page.waitForFunction(() => !document.getElementById("musicBar").classList.contains("off"), null, { timeout: 15000 });
    for (let i = 0; i < 40 && !calls.some((c) => c.startsWith("PUT /me/player/play")); i++) await page.waitForTimeout(50);
    assert(calls.some((c) => c.startsWith("PUT /me/player/play")), "the music that should have started was not started: " + calls.join(", "));
    assert(await page.isHidden("#mMsg"), "the line stayed");
  });

  await test("a request that does not get through dims the buttons even when the phone says it is online, and any answer brings them back", async () => {
    const player = { is_playing: true, device: { id: "d1", volume_percent: 70, supports_volume: true } };
    const { page } = await spotify({}, player);
    let down = true;
    await page.context().route("https://api.spotify.com/**", (rt) => (down ? rt.abort("internetdisconnected") : rt.fallback()));
    await page.click("#mPlay");
    await page.waitForFunction(() => document.getElementById("musicBar").classList.contains("off"));
    assert(/Når inte Spotify/.test(await page.textContent("#mMsg")), "the line: " + await page.textContent("#mMsg"));
    await page.click("#mNext");
    await page.waitForTimeout(300);
    assert(/Når inte Spotify/.test(await page.textContent("#mMsg")) && await page.isVisible("#mMsg"), "the line went away after a tap while still out of reach");
    down = false; player.fail = 403; player.reason = "PREMIUM_REQUIRED";
    await page.click("#mPlay");
    await page.waitForFunction(() => !document.getElementById("musicBar").classList.contains("off"));
    await page.waitForFunction(() => /Premium/.test(document.getElementById("mMsg").textContent));
  });

  await test("when Spotify's player answer is empty although music plays, the song, pause and volume still work", async () => {
    const player = { real: true, silent: true, is_playing: true, device: { id: "d1", volume_percent: 55, supports_volume: true } };
    const { page, calls } = await spotify({}, player);
    assert(await page.textContent("#npTitle") === "Låt", "the song is not shown: " + await page.textContent("#npTitle"));
    assert(await page.isVisible("#mPlay .ia"), "no pause symbol although the music plays");
    assert(await page.isVisible("#mVol") && await page.inputValue("#mVol") === "55", "no volume from the list of devices");
    await page.click("#mPlay");
    await page.waitForFunction(() => !document.getElementById("mPlay").classList.contains("playing"));
    assert(player.is_playing === false && await page.isHidden("#mMsg"), "pause did not work: " + calls.join(", ") + " / " + await page.textContent("#mMsg"));
    await page.click("#mPlay");
    await page.waitForFunction(() => document.getElementById("mPlay").classList.contains("playing"));
    assert(player.is_playing === true && await page.isHidden("#mMsg"), "play did not work");
  });

  await test("when Spotify says nothing about what plays, the button tries the other command instead of showing an error", async () => {
    const player = { real: true, silent: "all", is_playing: true, device: { id: "d1", volume_percent: 55, supports_volume: true } };
    const { page, calls } = await spotify({}, player);
    assert(await page.textContent("#npTitle") === "Inget spelas", "the title: " + await page.textContent("#npTitle"));
    await page.click("#mPlay");
    for (let i = 0; i < 40 && player.is_playing; i++) await page.waitForTimeout(50);
    assert(player.is_playing === false, "the music was not paused: " + calls.join(", "));
    assert(await page.isHidden("#mMsg"), "an error showed: " + await page.textContent("#mMsg"));
    assert(await page.isVisible("#mPlay .ip"), "the button does not show play after pausing");
  });

  await test("a refused pause is never turned into play, and an idle device gets no volume slider", async () => {
    const player = { silent: true, idle: true, is_playing: true, device: { id: "d1", volume_percent: 55, supports_volume: true } };
    const { page, calls } = await spotify({}, player);
    assert(await page.isHidden("#mVolRow"), "a volume slider for a device that is not playing");
    player.fail = 403;
    await page.click("#mPlay");
    await page.waitForFunction(() => !document.getElementById("mMsg").hidden);
    assert(/nekade kommandot/.test(await page.textContent("#mMsg")), "the text: " + await page.textContent("#mMsg"));
    assert(!calls.some((c) => /\/player\/play(\?|$)/.test(c)), "play was sent after a refused pause: " + calls.join(", "));
  });

  await test("a workout start that cannot continue the music says so when Spotify reports it as paused", async () => {
    const player = { is_playing: false, fail: 403, device: { id: "d1", volume_percent: 55, supports_volume: true } };
    const { page } = await spotify({ spStart: true }, player);
    await page.click("#bMain");
    await page.waitForFunction(() => !document.getElementById("mMsg").hidden);
    assert(/nekade kommandot/.test(await page.textContent("#mMsg")), "the text: " + await page.textContent("#mMsg"));
  });

  await test("an account that is not registered with the app gets the text about Premium and User Management", async () => {
    const player = { is_playing: false, device: { id: "d1", volume_percent: 55, supports_volume: true } };
    const { page } = await spotify({}, player);
    await page.context().route("https://api.spotify.com/v1/me/player/play**", (rt) => rt.fulfill({ status: 403, body: "User not registered in the Developer Dashboard" }));
    await page.click("#mPlay");
    await page.waitForFunction(() => !document.getElementById("mMsg").hidden);
    assert(/Premium/.test(await page.textContent("#mMsg")), "the text: " + await page.textContent("#mMsg"));
  });

  await test("starting the workout while the music already plays is not an error, and a refused command is not blamed on Premium", async () => {
    const player = { real: true, is_playing: true, device: { id: "d1", volume_percent: 55, supports_volume: true } };
    const { page } = await spotify({ spStart: true }, player);
    await page.click("#bMain");
    await page.waitForTimeout(600);
    assert(await page.isHidden("#mMsg"), "an error showed at start: " + await page.textContent("#mMsg"));
    player.real = false; player.fail = 403;
    await page.click("#mNext");
    await page.waitForFunction(() => !document.getElementById("mMsg").hidden);
    assert(/nekade kommandot/.test(await page.textContent("#mMsg")) && !/Premium/.test(await page.textContent("#mMsg")), "the text: " + await page.textContent("#mMsg"));
  });

  await test("the service worker stores only the app's own files, never answers from Spotify", async () => {
    // Load sw.js with a stand-in for the browser, and see which requests it answers itself.
    const src = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
    const handlers = {}, stored = [];
    const self = { addEventListener: (ev, fn) => (handlers[ev] = fn), skipWaiting() {}, clients: { claim() {} } };
    const caches = { open: async () => ({ put: (k, res) => stored.push(String((k && k.url) || k) + " " + (res && res.url)), addAll: async () => {} }), match: async () => undefined, keys: async () => [] };
    const fetchStub = async (rq) => ({ ok: true, url: String(rq.url || rq), clone() { return this; } });
    new Function("self", "caches", "fetch", "location", src)(self, caches, fetchStub, new URL("https://petermcj.github.io/workouttimer/"));
    const ask = async (url) => { let answer = null; handlers.fetch({ request: { method: "GET", url, mode: "cors" }, respondWith: (p) => (answer = p) }); if (answer) { await answer; await new Promise((r) => setTimeout(r, 0)); } return !!answer; };
    assert(!(await ask("https://api.spotify.com/v1/me/player")), "the service worker answers Spotify requests, so an old answer can be shown");
    assert(!(await ask("https://accounts.spotify.com/api/token")), "the service worker answers Spotify sign-in requests");
    assert(await ask("https://petermcj.github.io/workouttimer/fonts/fonts.css"), "the app's own files are no longer handled");
    assert(stored.length === 1 && /fonts\.css/.test(stored[0]), "what was stored: " + stored.join(", "));
  });

  await test("after a long pause Spotify's device is woken by handing the music to it, instead of an error", async () => {
    const player = { is_playing: false, device: { id: "d1", volume_percent: 55, supports_volume: true } };
    const { page, calls } = await spotify({}, player);
    // Spotify has forgotten the device: commands get "no active device" until the music is handed over
    let asleep = true;
    await page.context().route("https://api.spotify.com/v1/me/player/play**", (rt) => asleep ? rt.fulfill({ status: 404, json: { error: { status: 404, message: "Player command failed: No active device found", reason: "NO_ACTIVE_DEVICE" } } }) : rt.fallback());
    await page.context().route("https://api.spotify.com/v1/me/player", (rt) => { if (rt.request().method() === "PUT") { calls.push("PUT /me/player " + rt.request().postData()); asleep = false; player.is_playing = JSON.parse(rt.request().postData()).play; return rt.fulfill({ status: 204, body: "" }); } return rt.fallback(); });
    await page.click("#mPlay");
    for (let i = 0; i < 40 && !player.is_playing; i++) await page.waitForTimeout(50);
    assert(calls.some((c) => /PUT \/me\/player \{"device_ids":\["d1"\],"play":true\}/.test(c)), "the music was not handed to the device: " + calls.join(", "));
    assert(player.is_playing && await page.isHidden("#mMsg"), "the music did not start, or an error showed: " + await page.textContent("#mMsg"));
  });

  await test("Spotify saying it is busy (too many requests) is retried once instead of shown as an error", async () => {
    const player = { is_playing: true, device: { id: "d1", volume_percent: 55, supports_volume: true } };
    const { page, calls } = await spotify({}, player);
    let busy = 1;
    await page.context().route("https://api.spotify.com/v1/me/player/next**", (rt) => busy-- > 0 ? rt.fulfill({ status: 429, headers: { "Retry-After": "1" }, body: "" }) : rt.fallback());
    await page.click("#mNext");
    for (let i = 0; i < 60 && !calls.some((c) => c.startsWith("POST /me/player/next")); i++) await page.waitForTimeout(50);
    assert(calls.some((c) => c.startsWith("POST /me/player/next")), "the command was not tried again");
    assert(await page.isHidden("#mMsg"), "an error showed: " + await page.textContent("#mMsg"));
  });

  await test("the timer box has a sound button that shows and switches the sound", async () => {
    const page = await open({});
    await page.click("#tabRun");
    assert(await page.isVisible("#fSnd") && await page.getAttribute("#fSnd", "data-s") === "on", "no sound button showing on");
    await page.click("#fSnd");
    assert(await page.getAttribute("#fSnd", "data-s") === "off" && await page.textContent("#bSound") === "Ljud: av", "the button did not turn the sound off");
    assert((await page.evaluate(() => JSON.parse(localStorage.getItem("ccage")))).sound === false, "not saved");
    await page.click("#bSound");
    assert(await page.getAttribute("#fSnd", "data-s") === "on", "the sound button does not follow the other switch");
    // iPhone stops the sound: the button turns red, and a tap wakes it
    await page.click("#bMain");
    await page.evaluate(() => { const real = Object.getOwnPropertyDescriptor(BaseAudioContext.prototype, "state"); window.__st = real; Object.defineProperty(BaseAudioContext.prototype, "state", { configurable: true, get() { return "interrupted"; } }); });
    await page.waitForTimeout(1300);
    assert(await page.getAttribute("#fSnd", "data-s") === "warn", "a stopped sound is not shown: " + await page.getAttribute("#fSnd", "data-s"));
    await page.click("#fSnd");
    assert((await page.evaluate(() => JSON.parse(localStorage.getItem("ccage")))).sound !== false, "a tap on the red button turned the sound off");
    await page.evaluate(() => Object.defineProperty(BaseAudioContext.prototype, "state", window.__st));
    await page.waitForTimeout(500);
    assert(await page.getAttribute("#fSnd", "data-s") === "on", "the sound did not come back");
  });

  await test("a started workout can be started over, with a question while it runs", async () => {
    const page = await open({ total: 45 });
    await page.click("#tabRun");
    assert(await page.isHidden("#bReset"), "start over before anything has started");
    await page.click("#bMain"); await page.click("#bNext"); await page.click("#bNext");
    assert(await page.isVisible("#bReset"), "no start over button");
    page.once("dialog", (d) => d.dismiss());
    await page.click("#bReset");
    assert(await page.textContent("#bMain") === "Paus", "a no to the question still started over");
    page.once("dialog", (d) => d.accept());
    await page.click("#bReset");
    assert(await page.textContent("#bMain") === "Start" && await page.isHidden("#bReset") && await page.isHidden("#passLeft"), "the workout did not start over");
    assert(/Gör dig redo|Redo/i.test(await page.textContent("#rPhase")), "not back at the start: " + await page.textContent("#rPhase"));
  });

  await test("a device chosen under Settings is never swapped for another one, and a command is not sent twice", async () => {
    const player = { is_playing: false, device: { id: "other", volume_percent: 55, supports_volume: true } };
    const { page, calls } = await spotify({}, player);
    await page.evaluate(() => { const s = JSON.parse(localStorage.getItem("ccage_sp")); s.device = "speaker"; localStorage.setItem("ccage_sp", JSON.stringify(s)); });
    await page.reload(); await page.click("#tabRun");
    await page.context().route("https://api.spotify.com/v1/me/player/play**", (rt) => rt.fulfill({ status: 404, json: { error: { status: 404, message: "No active device found", reason: "NO_ACTIVE_DEVICE" } } }));
    await page.click("#mPlay");
    await page.waitForFunction(() => !document.getElementById("mMsg").hidden);
    assert(!calls.some((c) => /^PUT \/me\/player /.test(c)), "the music was moved to another device: " + calls.join(", "));
    assert(/Ingen Spotify-enhet/.test(await page.textContent("#mMsg")), "the text: " + await page.textContent("#mMsg"));
    let n = 0;
    await page.context().route("https://api.spotify.com/v1/me/player/next**", (rt) => { n++; rt.fulfill({ status: 502, body: "" }); });
    await page.click("#mNext");
    await page.waitForTimeout(1500);
    assert(n === 1, "next was sent " + n + " times after an unavailable answer");
  });

  await test("the timer box shows instructor or own training in its left corner, and a tap switches", async () => {
    const page = await open({ total: 45 });
    await page.click("#tabRun");
    assert(await page.isVisible("#fRole") && await page.getAttribute("#fRole", "data-r") === "coach", "no instructor icon");
    assert(await page.isVisible(".adj"), "the ±30 s buttons should show for an instructor");
    await page.click("#fRole");
    assert(await page.getAttribute("#fRole", "data-r") === "self" && await page.isHidden(".adj"), "the tap did not switch to own training");
    assert((await page.evaluate(() => JSON.parse(localStorage.getItem("ccage")))).role === "self", "not saved");
    assert(/Egen träning/.test(await page.textContent("#rFlash")), "no message: " + await page.textContent("#rFlash"));
    await page.click("#tabSet");
    assert(await page.getAttribute("#roleSelf", "aria-pressed") === "true", "Settings does not follow");
    await page.click("#roleCoach"); await page.click("#tabRun");
    assert(await page.getAttribute("#fRole", "data-r") === "coach", "the icon does not follow Settings");
    const box = await page.evaluate(() => { const f = document.getElementById("face").getBoundingClientRect(), r = document.getElementById("fRole").getBoundingClientRect(), s = document.getElementById("fSnd").getBoundingClientRect(); return { left: r.left - f.left < 20, right: f.right - s.right < 20 }; });
    assert(box.left && box.right, "the buttons are not in the corners: " + JSON.stringify(box));
    // during a workout with demos left it says when they change, and the workout's end does not move
    await page.click("#bMain"); await page.click("#bMain");
    const end = await page.textContent("#plEnd"), st = await page.textContent("#plState");
    await page.click("#fRole");
    assert(/nästa start/.test(await page.textContent("#rFlash")), "no note about the next start: " + await page.textContent("#rFlash"));
    assert(await page.textContent("#plEnd") === end && await page.textContent("#plState") === st, "the switch moved the end: " + st + " -> " + await page.textContent("#plState"));
    // a pending Undo is kept
    await page.evaluate(() => document.getElementById("toastUndo").click());
    await page.click("#tabPass"); await page.click("#passList .item button:nth-child(4)");
    await page.waitForFunction(() => !document.getElementById("toast").hidden && /Tog bort/.test(document.getElementById("toastMsg").textContent));
    await page.click("#tabRun"); await page.click("#fRole");
    assert(/Tog bort/.test(await page.textContent("#toastMsg")) && await page.isVisible("#toastUndo"), "the switch took the place of the Undo");
  });

  await test("after the app has been in the background the sound button turns red, and a tap gives fresh sound", async () => {
    const page = await open({ total: 45 });
    await page.addInitScript(() => { const A = window.AudioContext; window.__made = 0; window.AudioContext = function (...a) { window.__made++; return new A(...a); }; window.AudioContext.prototype = A.prototype; });
    await page.reload();
    await page.click("#tabRun"); await page.click("#bMain");
    const before = await page.evaluate(() => window.__made);
    const away = (h) => page.evaluate((h) => { Object.defineProperty(document, "hidden", { configurable: true, get: () => h }); Object.defineProperty(document, "visibilityState", { configurable: true, get: () => (h ? "hidden" : "visible") }); document.dispatchEvent(new Event("visibilitychange")); }, h);
    await away(true); await away(false);
    await page.waitForTimeout(300);
    assert(await page.getAttribute("#fSnd", "data-s") === "warn", "the button does not show that the sound must be woken: " + await page.getAttribute("#fSnd", "data-s"));
    await page.click("#rClock");
    await page.waitForTimeout(300);
    assert(await page.evaluate(() => window.__made) === before + 1, "not exactly one fresh audio on the tap: " + (await page.evaluate(() => window.__made) - before));
    assert(await page.getAttribute("#fSnd", "data-s") === "on", "the button is still red after the tap");
    // the same from the keyboard on the red button: it wakes the sound and does not turn it off
    await away(true); await away(false);
    await page.focus("#fSnd"); await page.keyboard.press("Enter");
    assert(await page.getAttribute("#fSnd", "data-s") === "on" && (await page.evaluate(() => JSON.parse(localStorage.getItem("ccage")))).sound !== false, "Enter on the red button turned the sound off");
    // with the sound off, leaving the app does not mark the audio; on again makes fresh audio
    await page.waitForTimeout(450);
    const n = await page.evaluate(() => window.__made);
    await page.click("#fSnd"); await away(true); await away(false);
    assert(await page.getAttribute("#fSnd", "data-s") === "off", "the sound button changed while the sound was off");
    await page.waitForTimeout(450);
    await page.click("#fSnd");
    assert(await page.evaluate(() => window.__made) > n && await page.getAttribute("#fSnd", "data-s") === "on", "off and on did not give fresh audio");
  });

  await test("during the workout the instructor can show any station's instructions, starting at the timer's station", async () => {
    const page = await open({ total: 45, st: 3, ex: 2, names: [["Knäböj", "Armhävningar"], ["Kettlebell swing", ""], ["Planka", "Egen grej"]] });
    await page.click("#tabRun");
    assert(await page.isVisible("#bInstr"), "no instructions button for the instructor");
    // let the timer reach station 2
    await page.click("#bMain");
    for (let i = 0; i < 80 && !/Station 2\//.test(await page.textContent("#rWhere")); i++) await page.click("#bNext");
    await page.click("#bInstr");
    assert(await page.isVisible("#instrSheet") && await page.textContent("#isPos") === "Station 2 av 3", "it did not open at the timer's station: " + await page.textContent("#isPos"));
    let body = await page.textContent("#isBody");
    assert(/Kettlebell swing/.test(body) && /Utförande/.test(body) && /Titta särskilt på/.test(body) && /Kraften kommer från höften/.test(body), "the instructions are not shown: " + body.slice(0, 160));
    assert(/Ingen övning vald/.test(body), "the empty B slot is not shown");
    assert(await page.textContent("#bMain") === "Paus", "the timer stopped");
    await page.click("#isNext");
    body = await page.textContent("#isBody");
    assert(await page.textContent("#isPos") === "Station 3 av 3" && /Planka/.test(body) && /Ingen instruktion/.test(body), "station 3: " + body.slice(0, 160));
    assert(await page.isDisabled("#isNext"), "next after the last station");
    await page.click("#isChips button:nth-child(1)");
    assert(/Knäböj/.test(await page.textContent("#isBody")) && /Armhävningar/.test(await page.textContent("#isBody")), "the chip did not show station 1");
    assert(await page.evaluate(() => document.querySelector("#isChips button:nth-child(2)").classList.contains("now")), "the timer's station is not marked");
    // the mark follows the timer while the sheet is open; during a switch it is the station people walk to
    for (let i = 0; i < 80 && !/Byt station/i.test(await page.textContent("#rPhase")); i++) await page.evaluate(() => document.getElementById("bNext").click());
    await page.waitForTimeout(250);
    assert(await page.evaluate(() => document.querySelector("#isChips button:nth-child(3)").classList.contains("now")), "during the switch the mark is not on the next station");
    await page.keyboard.press("Escape");
    assert(await page.isHidden("#instrSheet"), "Escape did not close");
    await page.click("#bInstr");
    assert(await page.textContent("#isPos") === "Station 3 av 3", "during the switch it did not open at the next station: " + await page.textContent("#isPos"));
    await page.keyboard.press("Escape");
    // own training has no such button
    await page.click("#fRole");
    assert(await page.isHidden("#bInstr"), "the button shows for own training");
    assert(!page.errors.length, page.errors.join("; "));
  });

  await browser.close();
  server.close();
  const failed = results.filter((r) => r[0] === "FAIL").length;
  console.log("\n" + (results.length - failed) + " passed, " + failed + " failed");
  process.exit(failed ? 1 : 0);
})();
