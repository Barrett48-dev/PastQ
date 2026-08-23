# PastQ

PastQ is a browser soon to be app is a past-question revision tool for secondary-school students preparing for GCE and similar examinations. It lets a student create a study profile, choose subjects, open a past paper, complete a timed multiple-choice attempt, review the score and explanations, and practise missed questions with flashcards.

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

For a production version, replace `src/utils/auth.js` with an API-backed authentication service, move paper metadata and answer keys to a protected backend, add a real PDF asset or document service, persist attempts and mastery, and connect dashboard subject actions to `SubjectSearch` or a route-based navigation layer.
