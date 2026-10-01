(function () {
  "use strict";
  const file = decodeURIComponent(location.pathname.split("/").pop());
  const title = document.title;
  const definitions = [
    { test: /\u4ea4\u4e92\u5f0f/, id: "lua-interactive", stage: 0, key: "lua-learning-progress", mode: "lua", category: "基础", showProgress: false },
    { test: /\u4ece\u7b2c\u4e00\u5f20/, id: "ygo-stage-01", stage: 1, key: "ygo-lua-foundations-v1", mode: "indexed", category: "YGO Lua", showProgress: true },
    { test: /\u7b2c\u4e8c\u9636\u6bb5/, id: "ygo-stage-02", stage: 2, key: "ygo-stage2-unified-v2", mode: "records", category: "YGO Lua", showProgress: true },
    { test: /\u7b2c\u4e09\u9636\u6bb5/, id: "ygo-stage-03", stage: 3, key: "ygo-stage3-cost-v1", mode: "records", category: "YGO Lua", showProgress: true },
    { test: /\u7b2c\u56db\u9636\u6bb5/, id: "ygo-stage-04", stage: 4, key: "ygo-learning:stage-04:v1", mode: "records", category: "YGO Lua", showProgress: true },
    { test: /\u7b2c\u4e94\u9636\u6bb5/, id: "ygo-stage-05", stage: 5, key: "ygo-learning:stage-05-beginner-v2:v1", mode: "records", category: "YGO Lua", showProgress: true },
    { test: /\u7b2c\u516d\u9636\u6bb5/, id: "ygo-stage-06", stage: 6, key: "ygo-learning:stage-06-filter-properties-v1", mode: "records", category: "YGO Lua", showProgress: true },
    { test: /\u6548\u679c\u811a\u672c\u5b9e\u9a8c\u5ba4/, id: "ygo-lab", stage: 7, key: "ygo-effect-lab-v1", mode: "lab", category: "实践", showProgress: false }
  ];
  const metadata = name => document.querySelector(`meta[name="${name}"]`)?.content;
  const customDefinition = metadata("course-id") ? { id: metadata("course-id"), stage: Number(metadata("course-stage") || 0), key: metadata("progress-key"), mode: metadata("progress-mode") || "records", category: metadata("course-category") || "课程", showProgress: metadata("show-progress") !== "false" } : null;
  const definition = customDefinition || definitions.find(item => item.test.test(title) || (item.id === "ygo-stage-01" && /\u4ece\u7b2c\u4e00\u5f20/.test(file)));
  if (!definition) return;
  function parse() { try { return JSON.parse(localStorage.getItem(definition.key) || "null"); } catch (_) { return null; } }
  function summary() {
    const data = parse() || {};
    const visibleLessonCount = document.querySelectorAll("#nav button, #lessonList button").length;
    let totalLessons = Number(data.totalLessons) || 0;
    let completed = [];
    let currentLesson = data.currentLesson ?? data.current ?? 0;
    let currentStep = 0;
    if (definition.mode === "lua") { completed = Array.isArray(data.completed) ? data.completed : []; totalLessons ||= 10; }
    else if (definition.mode === "lab") { completed = Array.isArray(data.done) ? data.done : []; totalLessons ||= 6; }
    else {
      const records = data.records || {};
      completed = Object.keys(records).filter(index => records[index]?.observed && records[index]?.quiz && records[index]?.exercise);
      if (definition.mode === "indexed") completed = completed.map(Number);
      totalLessons ||= 8;
      currentStep = records[currentLesson]?.step || 0;
    }
    if (visibleLessonCount > 0) totalLessons = visibleLessonCount;
    totalLessons = Math.max(totalLessons, completed.length);
    completed = [...new Set(completed)].slice(0, totalLessons);
    return { version: 2, courseId: definition.id, file, title, category: definition.category, showProgress: definition.showProgress, stage: definition.stage, totalLessons, completed, currentLesson, currentStep, lastVisit: Date.now() };
  }
  function sync() {
    try {
      const data = summary();
      localStorage.setItem(`progress:${definition.id}`, JSON.stringify(data));
      const registry = JSON.parse(localStorage.getItem("course-registry") || "[]");
      const entry = { id: data.courseId, file: data.file, title: data.title, category: data.category, showProgress: data.showProgress, stage: data.stage, estimatedLessons: data.totalLessons, desc: metadata("course-description") || "" };
      const index = registry.findIndex(item => item.id === entry.id);
      if (index >= 0) registry[index] = { ...registry[index], ...entry }; else registry.push(entry);
      localStorage.setItem("course-registry", JSON.stringify(registry));
    } catch (_) {}
  }
  function addHomeButton() {
    if (document.getElementById("homeLink")) return;
    const button = document.createElement("a");
    button.id = "homeLink";
    button.href = location.pathname.includes("/YGO-Lua-课程/") ? "../index.html" : "index.html";
    button.textContent = "\u8fd4\u56de\u4e3b\u9875";
    button.style.cssText = "position:fixed;top:16px;right:18px;z-index:9999;padding:8px 14px;border:1px solid #2a3c5d;border-radius:8px;background:#18263f;color:#e6eeff;text-decoration:none;font:14px/1.4 system-ui,Microsoft YaHei,sans-serif;";
    document.body.appendChild(button);
  }
  function normalizeNavigationTitles() {
    document.querySelectorAll("#nav button, #lessonList button").forEach(button => {
      const number = button.querySelector(".lesson-number, .num");
      const labels = [...button.children].filter(child => child !== number && !child.classList.contains("lesson-tick") && !child.classList.contains("tick"));
      labels.forEach(label => {
        label.textContent = label.textContent.replace(/^\s*\d+\s*[·.:、]\s*/, "");
      });
    });
  }
  addHomeButton(); sync(); setInterval(sync, 500); addEventListener("pagehide", sync);
  normalizeNavigationTitles();
  setInterval(normalizeNavigationTitles, 500);
})();
