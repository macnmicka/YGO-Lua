# YGO Lua 学习系列 - 代码规范

## 一、文件命名与结构

### 1.1 文件命名
```
YGO-Lua-{阶段描述}.html
示例：YGO-Lua-第一阶段从第一张卡开始.html
特殊：Lua-交互式学习平台.html
```

### 1.2 HTML 结构顺序
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{课程标题}</title>
  <style>/* CSS 样式 */</style>
</head>
<body>
  <!-- HTML 结构 -->
  <script>/* JavaScript 代码 */</script>
</body>
</html>
```

---

## 二、CSS 规范

### 2.1 颜色变量
必须使用 CSS 变量统一管理颜色：
```css
:root {
  --bg: #0B0E14;           /* 深色背景 */
  --panel-bg: #1A1F29;     /* 面板背景 */
  --text: #E6EDF3;         /* 主文本颜色 */
  --muted: #8B949E;        /* 次要文本 */
  --border: #30363D;       /* 边框颜色 */
  --accent: #3B82F6;       /* 强调色（蓝色）*/
  --success: #10B981;      /* 成功状态（绿色）*/
  --warning: #F59E0B;      /* 警告状态（橙色）*/
  --error: #EF4444;        /* 错误状态（红色）*/
}
```

### 2.2 布局规范
- **容器宽度**：最大宽度 `1200px`，居中显示
- **内边距**：统一使用 `1.5rem` 或 `2rem`
- **间距**：元素间距使用 `1rem`、`1.5rem`、`2rem` 等倍数
- **圆角**：卡片使用 `8px`，按钮使用 `6px`

### 2.3 字体规范
```css
body {
  font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
  font-size: 16px;
  line-height: 1.6;
}

h1 { font-size: 2rem; font-weight: 700; }
h2 { font-size: 1.5rem; font-weight: 600; }
h3 { font-size: 1.25rem; font-weight: 600; }
code { font-family: "Consolas", "Courier New", monospace; }
```

### 2.4 交互元素样式
```css
button {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  border: none;
  background: var(--accent);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## 三、JavaScript 规范

### 3.1 代码组织结构
```javascript
// 1. 常量定义
const STAGE = {
  id: "stage-01",
  name: "第一阶段",
  startNumber: 1
};
const KEY = "ygo-lua-foundations-v1";

// 2. 数据定义
const lessons = [...];

// 3. 状态管理
const state = { currentLessonId: null, record: {} };

// 4. 页面进度同步适配器（必须）
// </body> 前加载 progress-sync.js

// 5. 工具函数
function $(id) { return document.getElementById(id); }
function esc2(str) { return str.replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

// 6. 核心功能函数
function loadProgress() { /* ... */ }
function saveProgress() { /* ... */ }
function renderNavigation() { /* ... */ }
function openLesson(id) { /* ... */ }

// 7. 初始化
loadProgress();
renderNavigation();
openLesson(state.currentLessonId || lessons[0].id);
```

### 3.2 主页进度同步（强制要求）
课程页必须保留原有的详细记录键和数据结构，不得为了主页统计而替换原记录。
课程页在 `</body>` 前加载共享适配器：
```html
<script src="progress-sync.js"></script>
```

适配器将课程记录转换为主页摘要，写入 `progress:{courseId}`。摘要至少包含：
`version`、`courseId`、`file`、`title`、`category`、`showProgress`、`stage`、`totalLessons`、`completed`、`currentLesson`、`currentStep`、`lastVisit`。

`completed` 必须是可序列化的数组，不能直接写入 `Set`、DOM 节点、编辑器对象或草稿全文。`totalLessons` 应优先使用页面实际导航课节数，不能使用可能过期的固定估算值。

新课程可以通过 meta 元数据自动注册到主页：
```html
<meta name="course-id" content="ygo-stage-07">
<meta name="course-stage" content="7">
<meta name="progress-key" content="ygo-stage7-v1">
<meta name="course-category" content="YGO Lua">
<meta name="course-description" content="课程简介">
<meta name="show-progress" content="true">
<script src="progress-sync.js"></script>
```
首次访问课程页后，适配器会写入 `course-registry`，主页下次打开时自动显示该课程。静态 HTML 页面无法扫描从未访问过的同目录文件，因此新课程仍必须加载适配器并提供元数据。

### 3.3 课程编号与标题
导航组件负责显示课程序号，课程数据中的 `title` 只保存课程名称，不要重复写全局序号。
```javascript
// 正确
{ title: "复习 Group" }

// 不推荐：导航已经显示 70 时会重复显示编号
{ title: "70 · 复习 Group" }
```
同步适配器会兼容清理旧页面导航标题中的数字前缀，但新课程必须遵守该约定。

### 3.4 课程 ID 对照表
| 课程文件 | courseId |
|---------|----------|
| YGO-Lua-从第一张卡开始.html | `stage-01` |
| YGO-Lua-第二阶段发动与处理.html | `stage-02` |
| YGO-Lua-第三阶段代价与发动.html | `stage-03` |
| YGO-Lua-第四阶段区域与筛选.html | `stage-04` |
| YGO-Lua-第五阶段取对象与处理.html | `stage-05` |
| YGO-Lua-第六阶段属性筛选.html | `stage-06` |
| Lua-交互式学习平台.html | `lua-interactive` |
| YGO-效果脚本实验室.html | `ygo-lab` |

### 3.5 localStorage 键名规范
- **课程自身进度**：由课程现有实现决定，例如 `ygo-stage2-unified-v2`、`ygo-learning:stage-04:v1`。
- **主页摘要**：`progress:{courseId}`，例如 `progress:ygo-stage-04`。
- **课程注册表**：`course-registry`，值为课程摘要元数据数组。
- 禁止把所有课程详细记录混写到一个全局键中。

### 3.6 清空与重置
主页重置课程时，必须同时删除 `progress:{courseId}` 和该课程私有记录键。新增课程时应把私有键加入主页的清理映射。

### 3.7 命名规范
- **变量**：驼峰命名 `currentLessonId`
- **常量**：全大写 `const KEY = "..."`
- **函数**：动词开头 `renderNavigation()`, `openLesson()`
- **布尔值**：is/has 前缀 `isComplete`, `hasQuiz`

### 3.8 错误处理
```javascript
try {
  localStorage.setItem(KEY, JSON.stringify(state));
} catch (error) {
  console.warn("保存失败：", error);
  // 提供用户友好的错误提示
}
```

---

## 四、数据结构规范

### 4.1 课程数据结构
```javascript
const lessons = [
  {
    id: "lesson-01",                    // 唯一标识
    title: "课程标题",                   // 显示名称
    theory: "理论讲解内容...",           // 理论部分（HTML）
    observe: [                           // 观察步骤（可选）
      { lua: "代码", note: "说明" }
    ],
    quiz: {                              // 理解题（可选）
      question: "题目",
      options: ["A", "B", "C", "D"],
      correct: 1,
      explanation: "解析"
    },
    exercise: {                          // 练习（可选）
      challenge: "任务描述",
      starter: "初始代码",
      solution: "参考答案",
      hint: "提示"
    }
  }
];
```

### 4.2 状态数据结构
```javascript
const state = {
  currentLessonId: "lesson-01",     // 当前课程 ID
  record: {                          // 完成记录
    "lesson-01": {
      observed: true,                // 是否看完观察步骤
      quiz: false,                   // 是否答对理解题
      exercise: false                // 是否完成练习
    }
  }
};
```

---

## 五、UI 组件规范

### 5.1 导航栏结构
```html
<nav id="nav" aria-label="课程导航">
  <button class="active" aria-current="step">
    <span class="num">1</span>
    <span>课程标题</span>
    <span class="tick">✓</span>
  </button>
</nav>
```

### 5.2 进度条
```html
<div class="progress-container">
  <div class="progress-bar">
    <div id="progressBar" style="width: 60%;"></div>
  </div>
  <div id="progressText">6 / 10</div>
</div>
```

### 5.3 清单样式
```html
<div id="checklist">
  <div class="goodText">✓ 看完全部观察步骤</div>
  <div class="muted">○ 答对理解题</div>
  <div class="muted">○ 完成本课小练习</div>
</div>
```

---

## 六、无障碍规范

### 6.1 语义化 HTML
```html
<main role="main">
  <nav aria-label="课程导航">
  <section aria-labelledby="theory-title">
    <h2 id="theory-title">理论讲解</h2>
  </section>
</main>
```

### 6.2 键盘导航
```javascript
button.setAttribute("aria-current", "step");
button.setAttribute("aria-label", `第${index + 1}课：${lesson.title}`);
```

---

## 七、性能规范

### 7.1 避免频繁操作 DOM
```javascript
// ❌ 不好：每次循环都操作 DOM
lessons.forEach(lesson => {
  nav.appendChild(createButton(lesson));
});

// ✅ 好：先清空再批量添加
nav.replaceChildren();
lessons.forEach(lesson => {
  nav.appendChild(createButton(lesson));
});
```

### 7.2 防抖与节流
```javascript
let saveTimer;
function debouncedSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(save, 300);
}
```

---

## 八、注释规范

### 8.1 模块注释
```javascript
// ===== 主页摘要同步（由共享适配器完成） =====
// progress-sync.js

// ===== 核心渲染函数 =====
function renderNavigation() { /* ... */ }
```

### 8.2 复杂逻辑注释
```javascript
// 检查是否首次完成该课程，用于显示庆祝动画
const firstCompletion = !state.record[id]?.exercise;
```

### 8.3 避免无意义注释
```javascript
// ❌ 不要写这种注释
const name = "张三"; // 定义姓名变量

// ✅ 只注释非显而易见的逻辑
const name = session.user?.displayName || "访客"; // 未登录用户显示"访客"
```

---

## 九、版本控制规范

### 9.1 localStorage 版本管理
```javascript
const KEY = "ygo-lua-foundations-v1"; // 课程私有记录键

// 迁移旧数据
function migrate() {
  const oldData = localStorage.getItem("ygo:stage-01:v1");
  if (oldData) {
    // 转换数据结构
    localStorage.setItem(KEY, transformData(oldData));
    localStorage.removeItem("ygo:stage-01:v1");
  }
}
```

---

## 十、测试检查清单

### 10.1 功能测试
- [ ] 课程切换正常
- [ ] 进度保存/读取正常
- [ ] progress:{courseId} 摘要正确记录完成状态
- [ ] 导出/导入功能正常
- [ ] 清空进度后可恢复

### 10.2 兼容性测试
- [ ] Chrome/Edge 最新版
- [ ] Firefox 最新版
- [ ] Safari（如果目标用户有 Mac）
- [ ] 移动端浏览器

### 10.3 边界测试
- [ ] localStorage 被禁用时显示错误提示
- [ ] 数据格式损坏时不崩溃
- [ ] 空状态下的初始化

---

## 十一、发布前检查

### 11.1 代码检查
```bash
# 检查所有课程页面是否加载同步适配器
grep -l "progress-sync.js" *.html

# 检查主页摘要键和课程注册表
localStorage.getItem("progress:ygo-stage-01")
localStorage.getItem("course-registry")
```

### 11.2 文件大小
- 单个 HTML 文件应小于 500KB
- 如果超过，考虑拆分 CSS/JS 到外部文件

### 11.3 最终检查清单
- [ ] 所有课程文件已加载 progress-sync.js
- [ ] courseId 唯一且符合对照表
- [ ] CSS 变量使用一致
- [ ] localStorage 键名符合规范
- [ ] 主页重置会删除课程私有记录和摘要
- [ ] 无 console.log 调试代码
- [ ] 错误处理完整
- [ ] 无障碍属性完整

---

## 十二、常见问题

### Q1: 为什么要用统一的进度追踪？
**A:** 为了让主页汇总不同课程，课程保留自己的详细记录，同时通过统一摘要格式发布可统计数据。

### Q2: 旧的 localStorage 数据会丢失吗？
**A:** 不会。同步适配器只读取课程私有记录并额外生成主页摘要，不替换课程原有数据。

### Q3: 如何调试主页摘要？
```javascript
// 在浏览器控制台运行：
console.log(JSON.parse(localStorage.getItem("progress:ygo-stage-01")));
```

### Q4: 如果需要重置某个课程的进度？
```javascript
// 清除主页摘要和课程私有记录
localStorage.removeItem("progress:ygo-stage-01");
localStorage.removeItem("ygo-lua-foundations-v1");
```

---

## 附录：快速检查脚本

### A1. 验证课程摘要
```javascript
// 在浏览器控制台粘贴运行
const progress = JSON.parse(
  localStorage.getItem("progress:ygo-stage-01") || "null"
);
console.table({
  课程: progress.courseId,
  总课数: progress.totalLessons,
  已完成: progress.completed.length,
  当前位置: progress.currentLesson,
  完成率: `${Math.round(progress.completed.length / progress.totalLessons * 100)}%`
});
```

### A2. 导出所有进度数据
```javascript
const allData = {
  registry: JSON.parse(localStorage.getItem("course-registry") || "[]"),
  courses: {}
};

["ygo-stage-01", "ygo-stage-02", "ygo-stage-03", "ygo-stage-04", "ygo-stage-05", "ygo-stage-06"].forEach(id => {
  allData.courses[id] = JSON.parse(localStorage.getItem(`progress:${id}`) || "null");
});

console.log(JSON.stringify(allData, null, 2));
```

---

**版本**：v1.1  
**最后更新**：2026-09-29  
**维护者**：YGO Lua 学习系列开发团队
