#!/usr/bin/env bash
# 在本地明确执行此脚本后，创建公开仓库并推送。不会动原来的 INTJ 仓库。
set -euo pipefail
cd "$(dirname "$0")"
REPO="AIPMAndy/infj-career-growth-guide"
command -v git >/dev/null || { echo "请先安装 git"; exit 1; }
command -v gh >/dev/null || { echo "请先安装 GitHub CLI (gh)"; exit 1; }
gh auth status || { echo "请先执行 gh auth login"; exit 1; }
if gh repo view "$REPO" >/dev/null 2>&1; then
  echo "仓库 $REPO 已存在。为避免覆盖，这个首次发布脚本不会再次运行。"
  exit 1
fi
if [[ -e .git ]]; then
  echo "此目录已有 .git。请先检查仓库归属，避免误推送。"
  exit 1
fi

git init -b main
git add .
git commit -m "feat: launch INFJ career book-film guide with 41 works"
gh repo create "$REPO" --public --source=. --remote=origin --push
printf '\n已创建仓库：https://github.com/%s\n' "$REPO"
printf '现在打开 https://github.com/%s/settings/pages，选择 Deploy from a branch -> main / (root)，保存。\n' "$REPO"
printf 'Pages 生效后的地址：https://aipmandy.github.io/infj-career-growth-guide/\n'
