# CLAUDE.md — 无名杀开发

## 项目规范

详见 [CONTRIBUTING.md](CONTRIBUTING.md)，以下仅补充 CONTRIBUTING.md 未覆盖的内容。

## AI 工作约定

### 核心约束

- 始终使用 pnpm ，不要使用 npm 或 npx 。
- 保持 tab 缩进，不要替换为空格。

### 验证方式

- 项目没有自动化测试。改动完成后**提示用户手动运行 `pnpm dev`** 在浏览器中验证。
- 提交前可通过 `pnpm exec eslint <changed-file>` 检查修改的文件。
