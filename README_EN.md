# YGO Lua Learning Platform

[中文 README](README.md)

A local, browser-based course collection for learning Yu-Gi-Oh! card effect scripting with Lua. The project uses plain HTML, CSS, and JavaScript. It has no build step and no third-party dependencies.

## Contents

| File | Purpose |
| --- | --- |
| `index.html` | Home page, course cards, overall progress, and course ordering |
| `Lua-交互式学习平台.html` | Interactive Lua fundamentals course |
| `YGO-Lua-从第一张卡开始.html` | Stage 1: card scripting fundamentals |
| `YGO-Lua-第二阶段发动与处理.html` | Stage 2: activation and resolution |
| `YGO-Lua-第三阶段代价与发动.html` | Stage 3: costs and activation |
| `YGO-Lua-第四阶段区域与筛选.html` | Stage 4: locations and filters |
| `YGO-Lua-第五阶段取对象与处理.html` | Stage 5: targeting and resolution |
| `YGO-Lua-第六阶段属性筛选.html` | Stage 6: property filters |
| `YGO-Lua-第七阶段卡组检索.html` | Stage 7: deck searching |
| `YGO-效果脚本实验室.html` | Effect scripting lab and experiments |
| `progress-sync.js` | Publishes course progress summaries to the home page |
| `YGO-Lua-课程代码规范.md` | Page structure, progress data, and coding conventions |
| `网页结构.txt` | Project structure notes |

## Usage

1. Open `index.html` in a modern browser.
2. Choose a course and complete its observation steps, quizzes, and exercises.
3. Course progress is saved locally. Course cards can be dragged to customize their order.
4. Use **Export Progress** to create a backup. Use **Import Progress** to restore it later.

For local development, an optional static server can be started with:

```powershell
python -m http.server 8000
```

Open `http://localhost:8000/` in a browser. A server is not required for basic offline use.

## Course Ordering

The custom order is stored in the browser under `localStorage` key `ygo-learning:course-order:v1`. The **Restore Course Order** button removes only the custom order and does not delete learning progress.

## Progress Data

Each course keeps its detailed records locally. `progress-sync.js` publishes a compact summary under `progress:{courseId}` for the home page. Course-specific records remain under each course's own storage key. Nothing is uploaded to a server automatically.

## Development Notes

- Keep course metadata and the `progress-sync.js` reference when editing a course page.
- Every new course should define a unique `course-id`, stage number, progress key, and description.
- Course data titles should contain the course name only; navigation supplies the lesson number.
- Keep files encoded as UTF-8.
- After changes, open the home page and affected courses in a browser and check navigation, progress, exercises, and import/export behavior.

See `YGO-Lua-课程代码规范.md` for the full conventions.

## License and Notes

This project is intended for personal learning and teaching support. The script examples explain YGO Lua structure and APIs. Exercise checks validate text structure and are not a substitute for testing in an actual duel engine.
