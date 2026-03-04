# Changelog

All notable changes to this project are to be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) for its output schema (see `VERSIONING.md`).

## [Unreleased]

### Added
- Comprehensive README documentation including features, use cases, and usage guide.
- LICENSE file (MIT License).
- CITATION.cff file for software citation support.
- GitHub Sponsors configuration (`.github/FUNDING.yml`).
- Dedication section in README for Pieter's birthday.
- Demo implementation plan for the showcase application (`docs/demo-implementation-plan.md`).
- Vite-powered demo package (`@salve/demo`) using the real Salve engine and calendar plugins.
- Single-file static website build (`website/index.html`) that embeds all CSS and JavaScript.

### Changed
- Refactored the demo application from a standalone HTML mockup to a proper Vite app using `@salve/core`,
  `@salve/devtools`, and calendar plugins for real greeting resolution.
- Updated deployment flow so that building the demo produces a self-contained HTML file suitable for `file://`
  usage and GitHub Pages hosting.

## [0.0.1] - 2026-03-04
