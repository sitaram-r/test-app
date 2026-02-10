# A11yInspect CI/CD Setup Guide (Development Phase)

This guide walks you through setting up the A11yInspect accessibility checker in a GitHub Actions CI/CD pipeline for **https://github.com/sitaram-r/test-app**.

Since A11yInspect is not yet published on the VS Code Marketplace or npm, the workflow clones the extension repo and builds the CLI from source.

---

## Prerequisites

- A GitHub account with access to both repos:
  - **test-app** (`sitaram-r/test-app`) — the React + Vite app to be checked
  - **vscode-scally** (`barrierbreak/vscode-scally`) — the A11yInspect source code
- The `vscode-scally` repo must be **public**, or you need to set up a Personal Access Token (PAT) for private repo access (see [Step 3b](#step-3b-if-vscode-scally-is-a-private-repo))

---

## Step 1: Create the Workflow Directory

In your local clone of **test-app**, create the GitHub Actions workflow directory:

```bash
cd /path/to/test-app
mkdir -p .github/workflows
```

---

## Step 2: Add the Workflow File

Create the file `.github/workflows/a11y-check.yml` with the following content:

```yaml
name: Accessibility Check

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read
  security-events: write
  pull-requests: write
  issues: write

jobs:
  a11y-static:
    name: Static Accessibility Analysis
    runs-on: ubuntu-latest
    steps:
      - name: Checkout test-app
        uses: actions/checkout@v4

      - name: Checkout A11yInspect
        uses: actions/checkout@v4
        with:
          repository: barrierbreak/vscode-scally
          path: .a11yinspect
          ref: main

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Build A11yInspect CLI
        run: |
          cd .a11yinspect
          npm install
          npm run compile

      - name: Run A11yInspect (SARIF)
        run: |
          node .a11yinspect/out/cli/index.js \
            --format=sarif \
            --output=a11y-report.sarif \
            --severity=notice \
            --fail-on=error \
            --github \
            --github-annotations \
            "src/**/*.{html,jsx,js}"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Run A11yInspect (JSON)
        if: always()
        run: |
          node .a11yinspect/out/cli/index.js \
            --format=json \
            --output=a11y-report.json \
            --severity=notice \
            --fail-on=none \
            "src/**/*.{html,jsx,js}"

      - name: Run A11yInspect (HTML)
        if: always()
        run: |
          node .a11yinspect/out/cli/index.js \
            --format=html \
            --output=a11y-report.html \
            --severity=notice \
            --fail-on=none \
            "src/**/*.{html,jsx,js}"

      - name: Upload SARIF to GitHub Security
        if: always()
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: a11y-report.sarif

      - name: Upload Report Artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: a11y-reports
          path: |
            a11y-report.sarif
            a11y-report.json
            a11y-report.html
          retention-days: 30
```

---

## Step 3: Configure Repository Permissions

### Step 3a: Enable Workflow Permissions

1. Go to **https://github.com/sitaram-r/test-app**
2. Navigate to **Settings** → **Actions** → **General**
3. Scroll to **Workflow permissions**
4. Select **Read and write permissions**
5. Check **Allow GitHub Actions to create and approve pull requests**
6. Click **Save**

This allows the `GITHUB_TOKEN` to create issues and add PR annotations.

### Step 3b: If vscode-scally Is a Private Repo

If `barrierbreak/vscode-scally` is **private**, the workflow cannot check it out with the default `GITHUB_TOKEN`. You need a Personal Access Token:

1. Go to **https://github.com/settings/tokens** → **Generate new token (classic)**
2. Select scopes: `repo` (full control of private repositories)
3. Generate and copy the token
4. In test-app, go to **Settings** → **Secrets and variables** → **Actions**
5. Click **New repository secret**
6. Name: `A11YINSPECT_PAT`, Value: paste the token
7. Update the checkout step in the workflow:

```yaml
      - name: Checkout A11yInspect
        uses: actions/checkout@v4
        with:
          repository: barrierbreak/vscode-scally
          path: .a11yinspect
          ref: main
          token: ${{ secrets.A11YINSPECT_PAT }}
```

If vscode-scally is **public**, skip this step — no extra token is needed.

---

## Step 4: Push the Workflow

```bash
cd /path/to/test-app
git add .github/workflows/a11y-check.yml
git commit -m "Add A11yInspect accessibility check workflow"
git push origin main
```

---

## Step 5: Verify the Workflow Runs

1. Go to **https://github.com/sitaram-r/test-app/actions**
2. You should see the **"Accessibility Check"** workflow running
3. Click on the run to see the details

### What to Expect

The workflow runs through these stages:

| Stage | What Happens |
|-------|-------------|
| Checkout test-app | Clones your React app |
| Checkout A11yInspect | Clones the vscode-scally repo into `.a11yinspect/` |
| Setup Node.js | Installs Node.js v20 |
| Build A11yInspect CLI | Runs `npm install` + `npm run compile` to build the CLI from source |
| Run A11yInspect (SARIF) | Scans `src/**/*.{html,jsx,js}` — fails the workflow if errors are found, creates GitHub issues |
| Run A11yInspect (JSON) | Same scan, outputs machine-readable JSON (always runs) |
| Run A11yInspect (HTML) | Same scan, outputs shareable HTML report (always runs) |
| Upload SARIF | Sends results to GitHub Security → Code Scanning tab |
| Upload Artifacts | Saves all 3 report files as downloadable artifacts (kept 30 days) |

---

## Step 6: View Results

### GitHub Issues

- When accessibility errors are found, the workflow creates issues automatically in your repo
- Go to **https://github.com/sitaram-r/test-app/issues** to see them

### PR Annotations

- When running on a pull request, inline annotations appear on the PR's **Files changed** tab
- Errors, warnings, and notices are highlighted directly on the relevant lines

### SARIF / Code Scanning

1. Go to **https://github.com/sitaram-r/test-app/security/code-scanning**
2. View all accessibility findings with severity, file location, and rule details

### Download Reports

1. Go to the workflow run in **Actions**
2. Scroll to the **Artifacts** section at the bottom
3. Download **a11y-reports** — contains:
   - `a11y-report.sarif` — for GitHub Security integration
   - `a11y-report.json` — for custom processing or dashboards
   - `a11y-report.html` — standalone report you can open in a browser and share

---

## Step 7: Test with a Pull Request

To see PR annotations in action:

```bash
cd /path/to/test-app
git checkout -b test-a11y
# Make a change to any file in src/
git add .
git commit -m "Test accessibility check"
git push origin test-a11y
```

Then open a pull request from `test-a11y` → `main` on GitHub. The workflow will run and annotate the PR.

---

## Customization

### Change Which Files Are Scanned

Edit the glob pattern in each `Run A11yInspect` step:

```bash
# Scan only JSX files
"src/**/*.jsx"

# Scan HTML and JSX
"src/**/*.{html,jsx}"

# Scan everything including nested components
"src/**/*.{html,jsx,js,tsx,ts}"
```

### Change When the Workflow Fails

Edit `--fail-on` in the SARIF step:

| Value | Behavior |
|-------|----------|
| `error` | Fail only on critical accessibility violations (default) |
| `warning` | Fail on warnings and errors |
| `notice` | Fail on any issue including best practices |
| `none` | Never fail — report only |

### Ignore Specific Rules

Add `--ignore` to the CLI command:

```bash
node .a11yinspect/out/cli/index.js \
  --ignore=BB11013,BB11045 \
  --format=sarif \
  ...
```

### Pin to a Specific Version

Change the `ref` in the checkout step to a specific commit or tag:

```yaml
      - name: Checkout A11yInspect
        uses: actions/checkout@v4
        with:
          repository: barrierbreak/vscode-scally
          path: .a11yinspect
          ref: 8d6cdfe  # specific commit hash
```

---

## Migrating to Production

Once A11yInspect is published to npm and the GitHub Action is released, replace the build-from-source steps with the simpler action syntax:

```yaml
      # Remove these steps:
      #   - Checkout A11yInspect
      #   - Build A11yInspect CLI

      # Replace CLI commands with:
      - name: Run A11yInspect
        uses: barrierbreak/a11yinspect@v1
        with:
          files: 'src/**/*.{html,jsx,js}'
          format: 'sarif'
          output: 'a11y-report.sarif'
          severity: 'notice'
          fail-on: 'error'
          github-annotations: 'true'
          create-issue: 'true'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
