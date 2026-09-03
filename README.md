# PastQ

PastQ is a browser soon to be app is a past-question revision tool for secondary-school students preparing for GCE and similar examinations. It lets a student create a study profile, choose subjects, open a past paper, complete a timed multiple-choice attempt, review the score and explanations, and practice missed questions with flashcards.

This repository is the frontend prototype. It is intentionally self-contained so the complete flow can be demonstrated without a backend.

## Exact Purpose

The project provides a focused practice loop:

1. Capture a student's academic track, subjects, goal and preferred session length.
2. Show papers associated with the student's selected subjects.
3. Display a paper beside an interactive answer sheet.
4. Count down during the attempt and submit automatically when time expires.
5. Grade the answers and show the correct answer plus an explanation for each question.
6. Turn missed questions into a flip-card review session.

## How It Works

`src/main.jsx` mounts the React application and loads the global stylesheet. `src/App.jsx` owns the top-level view state:

- `auth`: the login screen in `src/Auth.jsx`.
- `onboarding`: the seven-step registration flow in `src/components/OnboardingWizard.jsx`.
- `dashboard`: the profile and enrolled-subject overview in `src/Dashboard.jsx`.

The auth helpers in `src/utils/auth.js` store registered profiles in `localStorage`. The active session is stored in `sessionStorage` by default or `localStorage` when Remember Me is selected. On startup, `App` checks both stores and restores the user when a session exists. Logging out removes the session from both stores.

The study workflow is implemented in `src/SubjectSearch.jsx`. It filters the local paper list by subject and title, opens the selected paper in an iframe, records one answer per question, maintains the timer, calculates the percentage, and exposes missed questions to the flashcard overlay. `src/FlashcardDeck.jsx` contains the reusable standalone flashcard implementation; `SubjectSearch` also includes a local copy for its modal flow.

## Project Structure

```text
src/
  App.jsx                 Application state and view routing
  Auth.jsx                Login form
  Dashboard.jsx           Profile summary and subject list
  ExamRunner.jsx          Standalone timed sample exam
  FlashcardDeck.jsx       Standalone missed-question review deck
  SubjectSearch.jsx       Paper search, PDF viewer, grading and review flow
  components/             Reusable controls and onboarding UI
  utils/auth.js           Browser-storage account and session helpers
  index.css               Tailwind import and global design tokens
```

## Code Reading Guide

The application starts in `src/main.jsx`, where the global stylesheet is loaded and React mounts `App` in strict mode. `src/App.jsx` creates the router and owns cross-screen concerns: theme persistence, the active profile, login/onboarding visibility, and conversion of dashboard action IDs into routes. A successful login or registration returns a profile to `handleAuthSuccess`, which stores it under `pastq_user` and closes the authentication UI.

The dashboard is a callback-driven view. `src/Dashboard.jsx` derives a greeting and resume card from `userData`, maps quick actions into route requests, and maps practical subjects into lab requests. The destination components under `src/components/` are self-contained prototypes: `StudyPlan` mutates an in-memory task list, `SmartAI` appends simulated delayed messages, `MyProgress` displays fixed metrics, and `SavedQuestions`/`Achievements` show placeholder or static records.

The exam path has two implementations. `src/components/PracticeExam.jsx` is the current route-level mock list, while `src/ExamRunner.jsx` is a standalone timed question runner. `src/SubjectSearch.jsx` is the richer catalogue workflow: it filters hard-coded paper records, opens the PDF iframe, stores answer letters by question ID, grades on submit or timeout, and derives incorrect records for its private flashcard modal. `src/FlashcardDeck.jsx` exposes the same review interaction as a reusable standalone component.

Reusable controls (`Button`, `ChipTag`, `InputField`, `SelectionCard`, `ThemeCard`, and `WizardHeader`) keep common visual and interaction patterns in small prop-driven components. `src/PracticalLab.jsx` uses the same route for two experiments: a JavaScript editor with captured console output and a projectile-motion calculator whose SVG trajectory is derived from velocity, angle, and gravity. `src/index.css` explains the global design tokens and Tailwind import; `src/App.css` is reserved for future selectors.

## Run Locally

Requirements: Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Other useful commands are:

```bash
npm run build    # Create a production build in dist/
npm run lint     # Run ESLint
npm run preview  # Serve the production build locally
```

## Important Prototype Limitations

- Accounts and passwords are stored in browser storage as plain JSON. This is suitable only for a local prototype, not real authentication.
- The paper catalogue and answer keys are hard-coded demo records in `SubjectSearch.jsx`.
- The PDF URLs point to a public PDF.js sample document and are not PastQ paper assets.
- The dashboard subject cards are presentational and do not currently open `SubjectSearch`.
- Progress, scores and flashcard mastery are not persisted between sessions.
- `ExamRunner.jsx` is a separate sample runner and is not currently wired into the main dashboard flow.

## Extending the Project

For a production version, replace `src/utils/auth.js` with Firebase Authentication, move paper metadata and answer keys to protected Firestore data, store PDFs in Cloud Storage, persist attempts and mastery, and connect dashboard actions to Firebase-backed services.

## Firebase Backend Build Guide

Firebase can provide PastQ's first production backend without a separate server to maintain. Use Firebase Authentication for identity, Cloud Firestore for application data, Cloud Storage for papers, and Cloud Functions for trusted grading and scheduled work.

### Step 1: Create and configure the Firebase project

1. Create a project in the [Firebase Console](https://console.firebase.google.com/) and enable Analytics only if it is required by the product's privacy policy.
2. Register a Web app and copy its configuration into local environment variables such as `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, and `VITE_FIREBASE_APP_ID`.
3. Install the client SDK with `npm install firebase` and create a single `src/lib/firebase.js` module for initialization. Never put Admin SDK credentials in the browser.

### Step 2: Add authentication

1. Enable Email/Password and any planned providers under **Authentication > Sign-in method**.
2. Replace the local-storage functions in `src/utils/auth.js` with Firebase Auth calls such as `createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `onAuthStateChanged`, and `signOut`.
3. After registration, create `users/{uid}` and `profiles/{uid}` documents in Firestore. Use the Firebase `uid` as the ownership key; do not use email as a document ID.
4. Keep only non-sensitive preferences in browser storage. Firebase Auth manages credentials and session state.

### Step 3: Model Firestore data

Create collections for `users`, `profiles`, `subjects`, `papers`, `questions`, `attempts`, `attemptAnswers`, `savedQuestions`, `reviewCards`, `studyPlans`, `studyTasks`, `achievements`, and `aiConversations`. Include `createdAt` and `updatedAt` timestamps, stable IDs, and a `contentVersion` or `gradingVersion` for published exam content.

Keep answer keys and unpublished content out of client-readable documents. A question document sent to an active exam should contain options but not `isCorrect`; Cloud Functions should grade the submitted attempt.

### Step 4: Secure the data

1. Write Firestore and Storage Security Rules that require `request.auth != null` and verify `request.auth.uid` for every student-owned document.
2. Allow students to read only published papers and questions, and allow writes only to their own profiles, attempts, answers, saved questions, and review cards.
3. Keep answer keys, moderation fields, and role changes restricted to Admin SDK code or custom claims assigned by a trusted admin process.
4. Add App Check, email verification, rate limits, and emulator-based rule tests before opening the app to real users.

### Step 5: Store and serve papers

Upload PDFs to a private Cloud Storage path such as `papers/{paperId}/document.pdf`. Store only the Storage path and metadata in Firestore. A callable or HTTPS Cloud Function should verify access and return a short-lived signed URL; never expose answer-key files or broad storage credentials.

### Step 6: Build trusted backend functions

Use Cloud Functions for Firebase for operations that must not trust the browser:

- create and expire exam attempts using server timestamps;
- save answers and enforce attempt ownership;
- submit and grade attempts idempotently against a versioned answer key;
- generate dashboard/progress summaries;
- update achievements and spaced-repetition review dates; and
- process AI requests without exposing provider API keys.

Use scheduled Functions for cleanup and reminders. Keep function inputs validated and return consistent error codes for the frontend.

### Step 7: Connect the React frontend

Create a small Firebase data layer under `src/lib/` or `src/services/`. Replace hard-coded paper and drill arrays with Firestore queries, subscribe to auth state at the application boundary, and call Functions for grading, signed URLs, progress aggregation, and AI. Add loading, empty, permission, offline, and retry states to each Firebase-backed screen.

### Step 8: Test and deploy

Run the Firebase Local Emulator Suite for Auth, Firestore, Storage, and Functions. Test registration, unauthorized reads, paper publication, autosaved answers, expired attempts, duplicate submission, and admin-only writes. Deploy with `firebase deploy`, build the frontend with `npm run build`, and configure Hosting rewrites and environment-specific projects for development, staging, and production.

## File-by-File Maintenance Guide

This section is the detailed map for modifying the current repository. Make changes in the file that owns the behavior, then run `npm run lint` and `npm run build`. The application is intentionally prototype-sized, so many data sets live beside the component that renders them. When a data set becomes shared or remote, extract it into a service/module rather than duplicating it across screens.

### Root Files

- `.gitignore` keeps logs, editor state, dependency folders, build output, and local environment files out of Git. Modify it only when introducing a new generated or machine-specific artifact; never use it to hide source files that should be reviewed.
- `package.json` defines the project identity, dependency versions, and the `dev`, `build`, `lint`, and `preview` commands. Add a runtime library under `dependencies`, a build/lint tool under `devDependencies`, and a repeatable command under `scripts`; run `npm install` so `package-lock.json` changes with it.
- `package-lock.json` locks the exact dependency tree selected by npm. Do not hand-edit it. Change `package.json`, then run `npm install` from the project root and commit the resulting lockfile update.
- `index.html` is Vite's single HTML shell. Change the document title, favicon, language, metadata, or root element here. Keep `<div id="root">` and the module script intact unless changing the React bootstrap architecture.
- `vite.config.js` wires React's Vite transform and Tailwind's Vite plugin. Add aliases, proxy rules, build options, or additional plugins in the exported `plugins`/config object; changes here affect development and production builds.
- `eslint.config.js` is the flat ESLint configuration. Change ignored paths, browser globals, or project-wide lint rules here. Prefer fixing source code over disabling a rule; a rule exception should be narrowly scoped to a file pattern.
- `README.md` is the source of truth for setup, architecture, limitations, and this maintenance map. Update it when a route, storage contract, dependency, or workflow changes.

### Application Entry And Shell

- `src/main.jsx` is the browser entry point. It imports global CSS and mounts `<App />` into `#root` under `StrictMode`. Change this file when adding providers, global error boundaries, or a different root setup; do not put page-specific state here.
- `src/App.jsx` owns the top-level session/theme state and the app's view switching. It also contains several route-level prototype screens and the navigation callbacks passed to child views. Modify the `view`/navigation logic when adding a dashboard destination; modify the local page function and its data when changing that page's UI. For a production router, this is the main extraction point.
- `src/Auth.jsx` is the full-screen returning-user login form. Its local state owns email, password visibility, loading, validation feedback, and Remember Me UI; `loginUser` owns credential lookup, while `onLoginSuccess` hands the profile back to `App`. Change form fields and validation inside `handleLogin` and the form markup; change authentication behavior in `src/utils/auth.js`.
- `src/Dashboard.jsx` renders the authenticated home screen. `quickActions` is the exact list of dashboard destinations, the level buttons pass navigation payloads, and `PracticalLabs` renders the lab entry point. Add or rename dashboard actions in `quickActions` and update the parent navigation handler in `App.jsx` for new IDs.
- `src/ExamRunner.jsx` is a standalone timed multiple-choice runner. Its question array is the place to change demo questions, answer indexes, and explanations; its timer effect controls countdown/auto-submit; its results branch controls review. It is not currently connected to the main dashboard, so wire it from `App.jsx` before treating it as the primary exam path.
- `src/FlashcardDeck.jsx` is the reusable standalone missed-question review experience. Change the question shape, card face content, or mastery actions here when the deck contract changes. The richer `SubjectSearch` flow has a local deck implementation; update both or extract a shared deck if their behavior must stay identical.
- `src/PracticalLab.jsx` is the legacy tracked path for the practical-lab prototype and is currently deleted in the worktree. The active implementation is `src/components/PracticalLabs.jsx`; restore or remove references to this old file only as part of an intentional migration, not as a parallel implementation.
- `src/SubjectSearch.jsx` is the legacy tracked path for the paper catalogue and is currently deleted in the worktree. The active implementation is `src/components/SubjectSearch.jsx`; keep imports aligned with the active path and remove stale references when completing the rename.

### Reusable Components

- `src/components/AuthModal.jsx` is the modal login/signup shell used by the newer auth flow. Change open/close behavior, modal layout, and mode-specific presentation here; keep credential persistence in `src/utils/auth.js` and pass results through the callbacks.
- `src/components/AskAIPage.jsx` is the Smart AI conversation screen. Its local message state and simulated response delay define the prototype interaction. Replace the delayed mock with an API client here, then add loading, error, cancellation, and authentication handling at this boundary.
- `src/components/Button.jsx` is the shared prop-driven button primitive. Add a visual variant in `variants`, or adjust common sizing in `baseStyles`; callers should provide content and `className` overrides rather than duplicating button geometry.
- `src/components/ChipTag.jsx` renders a selectable tag with an optional active accent. Change selection visuals or supported `variant` values here; the parent remains responsible for the selected value and click behavior.
- `src/components/InputField.jsx` is a controlled labeled input with optional leading icon and password visibility toggle. Change accessibility, input attributes, or password behavior here; change validation and stored values in the owning form.
- `src/components/LoginModal.jsx` is the modal-specific login form. Its fields, error state, and login callback are local to the modal; update the form markup here and the storage contract in `auth.js`.
- `src/components/MyProgress.jsx` displays the current fixed progress metrics and a back action. Replace the hard-coded metrics or connect an API in this component; pass real attempt data as props once progress is persisted.
- `src/components/OnboardingWizard.jsx` owns the seven-step profile setup, step validation, subject/goal selection, and registration submission. Change step order/content in the step definitions and corresponding render branches; change profile persistence through `registerUser`, not by writing storage in the wizard.
- `src/components/PastQuestionsPage.jsx` lists paper years and provides the current download/view action. Change the year range, paper metadata, or PDF action in this file. Replace the alert with a real download/view service here when backend paper URLs exist.
- `src/components/PracticalLabs.jsx` is the active practical-lab navigation/experiment component. Change lab choices, editor behavior, console capture, or projectile calculation in its local state and handlers. `Dashboard.jsx` owns where the component is placed.
- `src/components/PracticeExam.jsx` is the current route-level mock exam list. Change the displayed exam records and start controls here; keep actual timed answering in `ExamRunner.jsx` or a dedicated runner component.
- `src/components/PracticeExamPage.jsx` is the newer practice-exam page wrapper. Modify its page-level layout and handoff to the runner here; do not duplicate question grading logic if the runner owns it.
- `src/components/SavedQuestions.jsx` renders saved-paper placeholder records. Replace its static records with a saved-items prop or service, and keep save/remove mutations in the owning data layer once persistence is added.
- `src/components/SelectionCard.jsx` is a selectable card used by onboarding choices. Change its selected/unselected visuals and icon/title layout here; selection state and the selected value belong to `OnboardingWizard`.
- `src/components/SmartAI.jsx` is the dashboard-level Smart AI entry/placeholder view. Change its presentation or handoff to `AskAIPage.jsx` here; put message generation in the AI page/service rather than this launcher.
- `src/components/StudyPlan.jsx` shows and mutates the prototype in-memory study task list. Change default tasks and completion behavior here; move the list to persisted/API-backed state when it must survive reloads.
- `src/components/SubjectSearch.jsx` is the active catalogue, paper viewer, answer-sheet, timer, grading, and missed-question review flow. Change `papers` for demo catalogue records, answer keys for grading, filter logic for search behavior, and the submit/timer handlers for exam rules. This is the main integration point for real paper/document APIs.
- `src/components/ThemeCard.jsx` renders a selectable theme/subject-style card. Change its icon, label, or selected appearance here; keep the selected theme value and persistence in the parent wizard.
- `src/components/WizardHeader.jsx` renders onboarding progress and navigation context. Change step labels, progress display, or close/back controls here; step transitions remain in `OnboardingWizard`.

### Styles And Assets

- `src/index.css` imports Tailwind and defines global color tokens plus the body fallback. Change design tokens, global typography, reset rules, or app-wide base behavior here. Most component styling is Tailwind utility classes in JSX, so use this file for rules shared by many screens.
- `src/App.css` is intentionally empty/reserved because current views use Tailwind utilities. Add selectors here only for behavior that is awkward or impossible to express with utilities; avoid creating a second competing design system.
- `public/favicon.svg` is the browser tab icon. Replace the SVG or its colors/viewBox here when branding changes; keep the `index.html` reference synchronized.
- `public/icons.svg` is the shared SVG symbol sprite. Add or edit `<symbol>` entries here when an icon must be available as a sprite; update the consuming `<use>` reference in the component that renders it.
- `src/assets/hero.png` is a raster asset available to the bundle. Replace it when the product needs a new hero image, and update the importing component if its dimensions or crop assumptions change.
- `src/assets/react.svg` and `src/assets/vite.svg` are starter/template assets. They are not part of the PastQ workflow; remove them when no longer referenced, or replace them only if a visible screen still uses them.

### Browser Storage Contract

- `src/utils/auth.js` is the single storage helper for demo accounts and the active user. `USERS_KEY` controls the registered-account list and `CURRENT_USER_KEY` controls the current session. Modify `getUsers`/`registerUser` for account schema changes, `loginUser` for credential rules, and `setCurrentUser`/`getCurrentUser`/`logoutUser` for session lifetime. The current code stores passwords as plain JSON and always uses `localStorage`; do not present this as production authentication. Any change to profile fields must be reflected in onboarding, login, `App.jsx`, and this README.

### What Not To Edit

- `dist/` is generated by `npm run build`; edit source files and rebuild instead.
- `node_modules/` is installed dependency code; change versions through `package.json` and npm.
- Binary assets such as `hero.png` cannot carry useful inline comments; document their purpose and replacement point in this README.
