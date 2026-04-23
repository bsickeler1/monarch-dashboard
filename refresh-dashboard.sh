#!/bin/bash
set -euo pipefail

DASHBOARD_DIR="/Users/brantley/Desktop/dev/claudetraining/monarch-dashboard"
SKILLS_ROOT="/Users/brantley/Desktop/dev/claudetraining"
CLAUDE="/Users/brantley/.npm-global/bin/claude"
RAILWAY="/opt/homebrew/bin/railway"
LOG_DIR="$DASHBOARD_DIR/logs"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

mkdir -p "$LOG_DIR"
exec >> "$LOG_DIR/refresh.log" 2>&1

echo ""
echo "========================================"
echo "[$TIMESTAMP] Starting dashboard refresh"
echo "========================================"

# Run from skills root so Claude can find .claude/skills/
cd "$SKILLS_ROOT"

echo "[1/4] Running /monarch-deal-analysis..."
"$CLAUDE" --enable-auto-mode -p \
  "Run /monarch-deal-analysis and save the output as monarch-dashboard/monarch-deal-analysis.json — overwrite whatever is already there with fresh data."

echo "[2/4] Committing updated JSON..."
cd "$DASHBOARD_DIR"
git add monarch-deal-analysis.json

if git diff --cached --quiet; then
  echo "  No changes to commit — JSON unchanged."
else
  git commit -m "chore: refresh deal analysis $(date '+%Y-%m-%d')"
  echo "  Committed."
fi

echo "[3/4] Pushing to GitHub..."
git push
echo "  Pushed."

echo "[4/4] Deploying to Railway..."
"$RAILWAY" up --service 7ca7fdab-d6c3-4ffb-8883-478c8a16c57b --detach
echo "  Deploy triggered."

echo "[$TIMESTAMP] Done."
