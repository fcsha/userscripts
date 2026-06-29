# userscripts

基于 Rolldown 打包的用户脚本项目。

## 项目结构

```
src/
├── shared/          # 共享模块（被各脚本引用）
├── github/          # GitHub 相关脚本
│   └── hello.js     # 带 // ==UserScript== 头 = 入口
└── ...
```

- `src/` 下任何带 `// ==UserScript==` 头的 `.js` 文件自动识别为入口
- 其他 `.js` 文件为普通模块，被 import 引用
- 用 `@shared/xxx` 别名引用共享模块，不用数 `../`

## 开发环境

依赖 [mise](https://mise.jdx.dev/) 管理 Node.js 和 pnpm 版本：

```bash
mise install
pnpm install
```

## 命令

```bash
pnpm dev      # watch 模式，自动重新打包
pnpm build    # 打包到 dist/
pnpm fmt      # oxfmt 格式化
```

## 添加新脚本

1. 在 `src/` 下新建 `.js` 文件，顶部写 `// ==UserScript==` 元数据块
2. `import { xxx } from '@shared/xxx'` 引用共享模块
3. `pnpm build`，输出到 `dist/` 对应路径

## 工具链

| 工具                                             | 用途     |
| ------------------------------------------------ | -------- |
| [Rolldown](https://rolldown.rs/)                 | 打包     |
| [oxfmt](https://github.com/nicolo-ribaudo/oxfmt) | 格式化   |
| [mise](https://mise.jdx.dev/)                    | 版本管理 |
