# jpcorrect-frontend

This repository contains the front-end for the jpcorrect system, a Japanese language correction platform.

Tech stack: React + TypeScript + Vite + Bun.

## Getting Started

### Prerequisites

- Bun (v1.2+ recommended)

### Installation

```bash
git clone https://github.com/sessatakuma/jpcorrect-frontend.git
cd jpcorrect-frontend
bun install
```

### Run

```bash
bun run dev
```

### Build

```bash
bun run build
```

## Deployment

On every push to `main`, GitHub Actions automatically builds the app and publishes the `dist` output to the `gh-pages` branch using `.github/workflows/deploy-gh-pages.yml`.

### Type Check

```bash
bun run typecheck
```
