# GitHub Pages 部署

网站由 Astro 构建为静态文件，GitHub Actions 负责将 `dist/` 部署到 GitHub Pages。本地修改和构建不会直接把网站公开。

## 第一次发布

1. 在 GitHub 创建一个仓库。若希望默认地址为 `https://用户名.github.io/`，仓库名使用 `用户名.github.io`；若使用 `academic-homepage` 等其他名称，地址通常为 `https://用户名.github.io/academic-homepage/`。
2. GitHub Free 的 Pages 使用公开仓库。上传前检查将要提交的文件：草稿、原始学术资料、文档、备份、个人资料以及 Git 历史同样会公开，网页中不显示不等于仓库中不可见。
3. 将本地项目上传到该仓库的 `main` 分支。不要上传 `node_modules/`、`dist/` 或 Astro 本地缓存；项目忽略规则已包含这些目录。
4. 在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。
5. 打开 **Actions** 检查 Pages 工作流。首次启用后可从工作流页面手动运行，或推送一次更新触发构建。
6. 工作流成功后，在 **Settings → Pages** 打开显示的站点地址，并检查中文、英文、论文、动态、图片和互动演示。

如工作流提示需要批准 Pages 环境部署，在仓库中完成该环境的审批。项目本身无需付费服务器或数据库。

## 站点地址与路径

默认配置根据 GitHub 仓库环境推导地址。需要覆盖时，在 **Settings → Secrets and variables → Actions → Variables** 添加仓库变量：

| 变量 | 用途 | 示例 |
| --- | --- | --- |
| `SITE_URL` | 网站所在域名，含 `https://` | `https://username.github.io` |
| `BASE_PATH` | 网站所在子路径，根站点用 `/` | `/academic-homepage` 或 `/` |

将示例中的 `username` 替换成自己的账号。这两个变量是公开站点配置，不是密码。

常见组合：

| 部署方式 | `SITE_URL` | `BASE_PATH` |
| --- | --- | --- |
| `username.github.io` 用户主页仓库 | `https://username.github.io` | `/` |
| `academic-homepage` 项目仓库 | `https://username.github.io` | `/academic-homepage` |
| 自有域名 | `https://你的域名` | `/` |

配置改变后重新运行工作流。站内地址和媒体路径应通过统一路径处理适配子目录；不要在正文中手工加入当前仓库名。

## 后续更新

1. 修改 `src/content/` 中的 Markdown；帖子的图片和视频放在对应的 `src/content/posts/<slug>/` 文件夹里。
2. 用 GitHub Desktop 写一句说明，点 **Commit to main**，再点 **Push origin**（步骤见[内容维护指南](内容维护指南.md)“发布到 GitHub”）。
3. GitHub Actions 自动构建、检查并重新发布；有错误时不会发布，原网站保持不变。

会用命令行时，可以在推送前运行 `npm run verify` 检查、`npm run preview` 预览。

工作流失败时，先查看 **Actions** 中失败步骤的日志。发布失败不会等于本地文件丢失；修正构建或链接问题后再次推送即可。

## 自有域名（以后再设置即可）

GitHub 提供的免费地址可长期使用。若注册自有域名：

1. 按 [GitHub 官方域名说明](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) 配置域名解析与 Pages 的 Custom domain。
2. 设置 `SITE_URL` 为自有域名的 HTTPS 地址、`BASE_PATH` 为 `/`，并重新部署。
3. 在证书就绪后检查 **Enforce HTTPS** 设置。

域名注册与续费通常另付费，GitHub Pages 的托管不因此收费。

国内访问 `github.io` 有时较慢或不稳定。如果国内访客是重点，以后可以考虑自有域名配合国内访问更稳定的托管，需要时让 Claude 评估方案。

## 媒体与互动演示

- 图片与轻量浏览器演示随站点部署。
- 短视频可放在站点内，长视频建议使用外部视频平台链接或嵌入。
- 互动网页可以运行 JavaScript、绘图、切换工况或播放预先计算的数据。
- GitHub Pages 不运行 Python / MATLAB / OpenFOAM 后端；在线求解需要另接服务，或先计算再展示。

[GitHub Pages 限制](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) 包括已发布站点最大 1 GB、每月流量软限制 100 GB。普通 Git 仓库会阻止超过 100 MiB 的文件，Git LFS 也不用于 GitHub Pages。避免将原始高码率录像或大规模计算数据塞入主页仓库。

回到 [README](../README.md) · [内容维护指南](内容维护指南.md)
