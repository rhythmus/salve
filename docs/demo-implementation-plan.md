# Demo Application Implementation Plan

## Overview
This plan outlines the steps to refactor the Salve demo application. The goal is to replace the current mock implementation in `demo/index.html` with a fully functional web application powered by the real `@salve/core` engine, while preserving the polished UI and "Time Machine" functionality of the original mockup.

## Phase 1: Structure & Housekeeping
1.  **Rename Directory**: Rename the root `demo/` directory to `website/`. This folder will serve as the deployment target for GitHub Pages.
2.  **Clean State**: Clear existing contents of `packages/demo/src` to start fresh (or ensure it's clean).

## Phase 2: UI Porting
1.  **HTML Structure**: Copy the HTML skeleton from the original `demo/index.html` to `packages/demo/index.html` (Vite convention).
2.  **Styles**: Extract the embedded CSS into `packages/demo/src/style.css`.
3.  **Assets**: Ensure fonts and icons are correctly loaded (via Google Fonts or local assets).

## Phase 3: Engine Integration
1.  **Dependencies**: Ensure `packages/demo/package.json` includes:
    -   `@salve/core`
    -   `@salve/calendars-gregorian` (and others as needed)
    -   `@salve/devtools`
2.  **Entry Point**: Create `packages/demo/src/main.ts`.
3.  **Initialization**:
    -   Import and instantiate `SalveEngine`.
    -   Register necessary calendar plugins (Gregorian, Hijri, etc.).
    -   Register the "Demo Packs" (see Phase 4).

## Phase 4: Data & Logic Adaptation
1.  **Demo Packs**: Create `packages/demo/src/packs.ts`.
    -   Since full production packs for all demo regions (e.g., German Unity Day, Chinese New Year) are not yet in the monorepo, we will port the rich fixture data from the mockup into compliant `GreetingPack` objects.
    -   This ensures the demo remains impressive and functionally identical to the mockup.
2.  **Resolution Logic**:
    -   Replace the mock `chooseGreeting` function with `engine.resolve()`.
    -   Map the UI state (inputs) to the `GreetingContext` required by the engine.
    -   Map the engine's `GreetingResult` back to the UI (Greeting text, Address, Metadata).
3.  **Timeline Feature**:
    -   Re-implement the "Future Timeline" calculation by running a loop that increments the date and calls `engine.resolve()` for each day to find significant upcoming events.

## Phase 5: Build & Deployment
1.  **Vite Config**: Update `packages/demo/vite.config.ts`:
    -   Set `outDir` to `../../website`.
    -   Set `emptyOutDir` to true (be careful not to delete `.git` if it's the root, but here `website` is a subfolder, so it's fine).
    -   Configure `base` to `./` (relative paths) for GitHub Pages compatibility.
2.  **Build Script**: Add a `deploy` script to the root `package.json` that runs the demo build.

## Phase 6: Verification
1.  **Visual Regression**: Ensure the new app looks identical to the old `index.html`.
2.  **Functional Test**: Verify that changing the date, time, or locale correctly updates the greeting using the real engine logic.
