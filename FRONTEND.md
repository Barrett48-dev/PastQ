# PastQ Frontend and Backend Implementation Guide

## 1. Purpose

PastQ is a React-based revision platform for secondary-school students preparing for GCE and similar examinations. The frontend is designed around a short, repeatable study loop:

1. Create a student profile.
2. Select an academic level and subjects.
3. Find a past paper or practice question.
4. Read the paper and submit answers in a timed session.
5. Receive a score, corrections, and explanations.
6. Review missed questions with flashcards.
7. Return to the dashboard to track progress and plan the next session.

This document explains how the current frontend is assembled, what each part owns, and how to evolve the prototype into a production system with a backend.

## 2. Current Technology Stack

- **React 19**: component model and local UI state.
- **Vite**: development server and production bundler.
- **React Router DOM**: available for route-based navigation as the app grows.
- **Tailwind CSS 4**: utility-first styling through the Vite plugin.
- **Lucide React**: interface icons.
- **react-pdf**: available for PDF rendering where the viewer is moved from an iframe to an in-app document viewer.
- **Browser storage**: temporary persistence for prototype accounts and the current user.

Useful commands:

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

The application expects Node.js 18 or newer.

## 3. Frontend Architecture From the Bottom Up

### 3.1 Browser and HTML shell

`index.html` is the only HTML document. It provides the browser metadata, favicon, and `<div id="root">`, which is the mount point for React. Vite serves this shell during development and produces the optimized asset bundle for production.

### 3.2 React entry point

`src/main.jsx` is the application bootstrap. It:

- imports the global stylesheet;
- mounts the React tree into `#root`;
- enables `StrictMode` during development; and
- renders the top-level `App` component.

Providers such as an API client, query cache, error boundary, analytics, or router can be added around `App` here when the production architecture needs them.

### 3.3 Global styling layer

`src/index.css` imports Tailwind and defines the core visual tokens:

- dark application canvas;
- dark surface and input colors;
- blue primary action color;
- gold accent color;
- border and secondary-text colors; and
- the body font, background, text color, and minimum viewport height.

Most styling is intentionally colocated with JSX through Tailwind classes. `src/App.css` is an escape hatch for selectors that are difficult to express with utilities. It should not become a second, competing design system.

A future design-system pass should extract shared tokens, typography, focus states, spacing, and responsive rules into named primitives rather than repeating arbitrary values throughout screens.

### 3.4 Application shell and navigation

`src/App.jsx` is the current application shell. It owns cross-screen concerns:

- the active user;
- login and registration visibility;
- theme state and theme persistence;
- the current top-level view;
- navigation callbacks from the dashboard; and
- logout behavior.

The current prototype uses view state and conditional rendering rather than a complete URL-driven route tree. This is adequate for a demonstration, but production navigation should move to explicit routes such as:

```text
/login
/onboarding
/dashboard
/papers
/papers/:paperId
/exams/:attemptId
/progress
/study-plan
/saved
/achievements
/ai-tutor
```

URL routes provide refresh support, browser history, deep links, protected-route handling, and shareable locations. Navigation payloads such as the selected level or subject should become route parameters or query parameters.

### 3.5 Authentication and onboarding

`src/Auth.jsx` and `src/components/LoginModal.jsx` render login experiences. They own form fields, password visibility, loading presentation, validation feedback, and the callback that reports a successful login to the shell.

`src/components/OnboardingWizard.jsx` is a seven-step controlled form. It collects:

- name and nickname;
- email and password;
- school;
- department or academic track;
- specialty or class level;
- selected subjects;
- study goal; and
- preferred session duration.

The wizard keeps the draft in component state, validates the current step before advancing, and calls `registerUser` on the final step.

`src/utils/auth.js` is the prototype authentication adapter. It stores user records and the active user in `localStorage`. This is intentionally not production authentication: passwords are stored as plain JSON and the browser is trusted to perform credential checks.

### 3.6 Dashboard composition

`src/Dashboard.jsx` is the authenticated home screen. `src/App.jsx` now also owns the authenticated navigation bar and inline pages for past papers, topic drills, analytics, saved questions, and practical labs.

The dashboard currently exposes these product areas:

- Past Questions;
- Smart AI;
- Practice Exam;
- My Progress;
- Saved Papers;
- Study Plan; and
- Achievements.

The dashboard is mostly a presentation layer. In a backend-backed application it should receive a dashboard summary rather than calculate progress from hard-coded values.

### 3.7 Content catalogue and paper workflow

`src/components/SubjectSearch.jsx` is the main paper catalogue prototype. It currently:

- filters a local paper array by level, subject, and title;
- displays paper metadata and duration;
- exposes a Start Exam action;
- uses public demo PDF data; and
- provides the integration point for a real document and question service.

The paper catalogue should eventually fetch paginated records from the backend. The client should receive metadata and a short-lived document URL, not answer keys or unrestricted private storage credentials.

`src/components/PastQuestionsPage.jsx` is a simpler year-based paper list and currently uses a placeholder download action. It can either be removed in favor of `SubjectSearch` or become a dedicated archive view backed by the same paper service.

### 3.8 Exam and assessment experiences

`src/ExamRunner.jsx` is a standalone timed multiple-choice runner. Its responsibilities are:

- rendering one question at a time;
- recording selected answers;
- counting down the duration;
- submitting when the timer expires;
- calculating a demo result; and
- showing corrections and explanations.

`src/components/PracticeExam.jsx` is a route-level mock exam list, while `src/components/PracticeExamPage.jsx` is a newer page wrapper. These should converge on one exam contract so question presentation and grading are not implemented in multiple places.

For a production exam, the frontend should treat the backend as authoritative for attempt identity, question order, duration, submission state, and grading. The browser timer remains useful for the user experience, but the server must reject late or duplicate submissions.

### 3.9 Review and flashcards

`src/FlashcardDeck.jsx` is the reusable standalone flashcard experience. It supports reviewing missed questions and recording a mastery action.

The paper workflow also contains a local missed-question review implementation. This duplication should be removed by extracting a shared deck component and a shared question shape. A future review endpoint can return due cards, mastery history, and the next review date.

### 3.10 Learning support pages

The components under `src/components/` represent focused product areas:

- `StudyPlan.jsx`: currently mutates an in-memory task list.
- `SmartAI.jsx` and `AskAIPage.jsx`: provide the dashboard entry point and conversation screen; replies are simulated in the prototype.
- `MyProgress.jsx`: displays fixed metrics until attempt data is persisted.
- `SavedQuestions.jsx`: currently renders an empty state because there is no save/remove storage contract.
- `Achievements`: currently uses static badge records.
- `PracticalLabs.jsx`: provides practical learning experiments such as code execution presentation and projectile-motion calculation.
- `SelectionCard.jsx`, `ThemeCard.jsx`, `ChipTag.jsx`, `Button.jsx`, `InputField.jsx`, and `WizardHeader.jsx`: reusable presentational controls used by forms and selection flows.

These components should remain thin UI layers. Remote data loading, mutation, caching, retry behavior, and error normalization belong in service or data hooks rather than being copied into every page.

## 4. State and Data Ownership

The frontend currently has three kinds of state:

### Local component state

Used for temporary interaction state such as:

- selected onboarding step;
- search query;
- selected answer;
- timer display;
- open modal;
- flashcard position; and
- AI conversation messages.

This state should stay local when it has no value outside the current screen.

### Application state

Owned by `App.jsx` and shared through callbacks:

- authenticated profile;
- active view;
- theme preference; and
- logout/navigation events.

As the number of screens increases, replace conditional view state with route state and use a server-state library or a small API data layer for remote records.

### Prototype persistence

`localStorage` currently contains demo users and the current user. Study plans, scores, saved questions, and mastery are not reliably persisted. A production frontend should treat API responses as the source of truth and use browser storage only for non-sensitive preferences such as theme or an anonymous draft.

## 5. Recommended Production Frontend Shape

A maintainable next step would be:

```text
src/
  app/
    App.jsx
    routes.jsx
    providers.jsx
  components/
    ui/
    forms/
    feedback/
  features/
    auth/
    dashboard/
    papers/
    exams/
    flashcards/
    progress/
    study-plan/
    ai-tutor/
    practical-labs/
  lib/
    apiClient.js
    authClient.js
    queryClient.js
    validation.js
  types/
  index.css
  main.jsx
```

Each feature should own its API calls, response mapping, loading state, empty state, and error state. Shared UI components should remain domain-neutral.

## 6. Firebase Backend Build Plan

Firebase is the planned backend for PastQ. Use Firebase Authentication for identity, Cloud Firestore for profiles and learning data, Cloud Storage for private PDFs, Cloud Functions for trusted operations, and the Local Emulator Suite for testing. This removes the need for a separate API server during the first production release while keeping security-sensitive work server-side.

### Step 1: Create the Firebase projects

1. Create separate development, staging, and production projects in the [Firebase Console](https://console.firebase.google.com/).
2. Register the web app in each project and add the `VITE_FIREBASE_*` configuration values to environment-specific files that are excluded from Git.
3. Install the SDK with `npm install firebase`, initialize it once in `src/lib/firebase.js`, and keep Admin SDK credentials exclusively in Cloud Functions.

### Step 2: Implement identity and profiles

1. Enable Email/Password and any approved sign-in providers in Firebase Authentication.
2. Replace `src/utils/auth.js` with an Auth adapter using `createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `onAuthStateChanged`, and `signOut`.
3. Create `users/{uid}` and `profiles/{uid}` documents after registration. Use Firebase `uid` ownership checks instead of email-based IDs.
4. Subscribe to auth state at the `App.jsx` boundary and render protected screens only after the initial auth state is known.

### Step 3: Design the Firestore data model

Create collections for `users`, `profiles`, `subjects`, `papers`, `questions`, `attempts`, `attemptAnswers`, `savedQuestions`, `reviewCards`, `studyPlans`, `studyTasks`, `achievements`, and `aiConversations`. Add server timestamps, stable document IDs, indexes for level/subject/year filters, and a `gradingVersion` on published papers.

Keep `isCorrect`, unpublished content, moderation fields, and answer keys in admin-only documents. The browser may receive options and explanations only at the point allowed by the exam or review workflow.

### Step 4: Protect Firestore and Storage

1. Require authentication in Firestore and Storage Rules, then verify `request.auth.uid` for every student-owned path.
2. Allow students to read only published content and write only their own profiles, attempts, answers, saved questions, and review cards.
3. Restrict answer keys, role changes, and publication state to Admin SDK code or trusted custom claims.
4. Store papers under private paths such as `papers/{paperId}/document.pdf`; return short-lived signed URLs from a callable or HTTPS Function.
5. Enable App Check, email verification, rate limits, and automated rule tests.

### Step 5: Add trusted Cloud Functions

Use Cloud Functions for Firebase for `createAttempt`, `saveAnswer`, `submitAttempt`, `getProgressSummary`, `reviewCard`, and AI gateway operations. Functions must validate input, verify ownership, use server timestamps, reject expired attempts, grade idempotently against a versioned key, and never expose provider secrets. Scheduled Functions can handle reminders, cleanup, and achievement recalculation.

### Step 6: Connect the feature screens

Create a small data layer under `src/lib/` or `src/services/`. Replace local paper and drill arrays in the current screens with Firestore queries, call Functions for grading and progress summaries, and keep loading, empty, permission, offline, and retry states in each page. The frontend timer is visual only; the server remains authoritative for expiry and submission.

### Step 7: Run locally and deploy

Install the Firebase CLI, initialize Auth, Firestore, Storage, Functions, and Hosting, then run the Local Emulator Suite during development. Test unauthorized reads, profile ownership, published-paper visibility, answer autosave, expired attempts, duplicate submissions, and admin-only writes. Deploy with `firebase deploy`, build with `npm run build`, and use separate Firebase projects for each environment.

The backend should still be divided into clear modules even though Firebase hosts them:

The backend should be divided into modules:

1. **Identity**: registration, login, logout, email verification, password reset, sessions, and roles.
2. **Profiles**: school, level, track, specialty, subjects, goals, and preferences.
3. **Curriculum**: levels, subjects, topics, syllabus versions, and academic years.
4. **Content**: papers, sections, questions, options, explanations, tags, difficulty, and document files.
5. **Exam attempts**: attempt creation, answer saves, timing, submission, grading, and result snapshots.
6. **Review**: saved questions, flashcards, mastery state, and spaced-repetition scheduling.
7. **Planning**: study plans, tasks, reminders, and completion events.
8. **Analytics**: progress summaries, streaks, strengths, weak topics, and achievements.
9. **AI tutor**: prompt policy, retrieval of approved content, usage limits, conversations, and feedback.
10. **Administration**: content upload, answer-key review, moderation, audit logs, and user support.

## 7. Suggested Firestore Data Model

A first relational schema could include:

```text
users
  id, email, password_hash, role, email_verified_at, created_at, updated_at

profiles
  user_id, full_name, nickname, school_name, track, specialty,
  goal, session_duration, avatar_url

subjects
  id, name, code, level, syllabus_version

user_subjects
  user_id, subject_id

papers
  id, subject_id, title, year, session, paper_number, level,
  duration_seconds, document_key, status, published_at

questions
  id, paper_id, topic_id, position, prompt, explanation, difficulty

question_options
  id, question_id, option_key, option_text, is_correct

topics
  id, subject_id, name, parent_id

exam_attempts
  id, user_id, paper_id, status, started_at, expires_at, submitted_at,
  score, percentage, grading_version

attempt_answers
  attempt_id, question_id, selected_option_key, answered_at,
  is_correct

saved_questions
  user_id, question_id, created_at

review_cards
  user_id, question_id, state, due_at, interval_days, ease_factor,
  last_reviewed_at

study_plans
  id, user_id, start_date, end_date, status

study_tasks
  id, study_plan_id, topic_id, scheduled_for, duration_minutes,
  status, completed_at

achievements
  id, code, title, description, icon_key

user_achievements
  user_id, achievement_id, earned_at

ai_conversations
  id, user_id, title, created_at

ai_messages
  id, conversation_id, role, content, model, token_count, created_at
```

Use foreign keys, unique constraints, indexes on search/filter fields, and soft deletion where content must be auditable. Keep answer keys server-side and expose correctness only after submission or after an individual practice answer is checked.

## 8. API Contract Suggestions

Use versioned JSON endpoints, for example `/api/v1`.

### Identity and profile

```text
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
GET    /me
PATCH  /me/profile
PUT    /me/subjects
```

### Content

```text
GET    /subjects?level=A-Level
GET    /papers?subjectId=...&level=...&year=...&q=...
GET    /papers/:paperId
GET    /papers/:paperId/document-url
GET    /papers/:paperId/questions   # omit answer keys before submission
```

### Exams

```text
POST   /papers/:paperId/attempts
GET    /attempts/:attemptId
PUT    /attempts/:attemptId/answers/:questionId
POST   /attempts/:attemptId/submit
GET    /attempts/:attemptId/result
```

### Progress and review

```text
GET    /me/dashboard
GET    /me/progress?range=30d
GET    /me/saved-questions
POST   /me/saved-questions/:questionId
DELETE /me/saved-questions/:questionId
GET    /me/review-cards/due
POST   /me/review-cards/:questionId/review
GET    /me/achievements
```

### Planning and AI

```text
GET    /me/study-plan
POST   /me/study-plan/generate
PATCH  /study-tasks/:taskId
POST   /ai/conversations
POST   /ai/conversations/:conversationId/messages
```

Every endpoint should return consistent error objects, for example `{ "code": "VALIDATION_ERROR", "message": "...", "fields": {} }`, and the frontend should translate these into field, page, or retry states.

## 9. Important Backend Rules for Exams

1. Create an attempt on the server and return `attemptId`, `startedAt`, `expiresAt`, and the ordered question set.
2. Store answers incrementally so a refresh or temporary network failure does not erase the session.
3. Derive remaining time from server timestamps. Do not trust a browser-supplied duration.
4. Make submission idempotent. Repeating the request should return the same result instead of grading twice.
5. Grade against a versioned answer key and store a result snapshot so later content edits do not change historical scores.
6. Do not return answer keys in the initial exam payload.
7. Validate that the user owns the attempt and that the attempt is still open.
8. Record audit events for submission, timeout, grading, and administrative answer-key changes.

## 10. Security and Privacy

The current browser-storage auth must be replaced before public release.

- Hash passwords with Argon2id or bcrypt; never store raw passwords.
- Use secure, HTTP-only, SameSite cookies for sessions where possible.
- Add CSRF protection when cookie authentication is used.
- Apply rate limits to login, registration, password reset, and AI endpoints.
- Validate and sanitize all request data on the server.
- Keep PDFs and answer keys in private storage with short-lived signed URLs.
- Enforce authorization at the API layer, not only by hiding frontend controls.
- Separate student, teacher, content-editor, and administrator permissions.
- Encrypt sensitive data in transit and at rest.
- Minimize stored student information and provide account deletion/export workflows.
- Add audit logs for content and grading changes.
- Never execute arbitrary student JavaScript on the API server. Practical-lab execution requires a heavily sandboxed worker, strict CPU/memory/time limits, no network access, and disposable containers or a trusted remote execution provider.

## 11. AI Tutor Implementation

The AI feature should be mediated by the backend rather than calling a model directly from the browser. A practical flow is:

1. Authenticate the student and enforce usage limits.
2. Retrieve the relevant paper, topic, syllabus material, and approved explanations.
3. Build a context-limited prompt that does not expose unrelated student data.
4. Ask the model to explain rather than invent answer keys.
5. Stream the response to the frontend if the chosen provider supports it.
6. Store conversation metadata and optional messages according to the privacy policy.
7. Record thumbs-up/down feedback and flagged responses for review.

Use retrieval-augmented generation over approved PastQ content. The AI must not be the authority for grading; the versioned answer key and grading service are authoritative.

## 12. PDFs and Content Operations

A content editor should upload a paper, enter metadata, associate it with a subject and syllabus version, upload the answer key, and add explanations. The system should validate that:

- the PDF is readable and virus-scanned;
- question positions match the answer key;
- each option has a stable key;
- the paper has the correct level, year, session, and duration; and
- the content is reviewed before publication.

Store PDFs in object storage and serve them through signed URLs or a controlled document proxy. Do not place private answer keys in the public bundle or in a publicly readable PDF metadata endpoint.

## 13. Loading, Error, and Offline Behavior

Every API-backed page should define explicit states:

- initial loading;
- empty result;
- validation error;
- permission error;
- expired session;
- network failure with retry;
- partially saved exam answer; and
- successful completion.

Exam answers should be queued locally when the network briefly drops and synchronized when the connection returns. The server remains authoritative if two devices submit conflicting answers.

## 14. Testing Strategy

### Frontend

- Unit-test answer selection, countdown transitions, score display, filters, and form validation.
- Component-test loading, empty, error, and success states using mocked API responses.
- End-to-end test registration, login, paper search, exam submission, timeout, results, saving, and flashcard review.
- Test keyboard navigation, focus visibility, labels, color contrast, and responsive layouts.

### Backend

- Unit-test grading, authorization, expiry, achievement rules, and spaced-repetition scheduling.
- Integration-test database constraints and API contracts.
- Test duplicate submissions, expired attempts, unauthorized attempt access, and rate limits.
- Add migration tests and backups before launch.

Keep a shared API schema, ideally OpenAPI-generated types, so frontend request and response shapes cannot drift silently.

## 15. Recommended Implementation Phases

### Phase 1: Replace demo identity

Add registration/login API endpoints, password hashing, sessions, protected routes, profile persistence, and a logout flow. Replace `src/utils/auth.js` with an API client while keeping the existing form components.

### Phase 2: Build the content service

Create subjects, topics, papers, questions, answer keys, explanations, PDF storage, and an editor workflow. Replace hard-coded arrays in `SubjectSearch.jsx` and the archive view with paginated API queries.

### Phase 3: Make exams durable

Create server-side attempts, autosave answers, server expiry, idempotent submission, versioned grading, and result retrieval. Consolidate the two exam implementations around one shared runner.

### Phase 4: Persist learning data

Implement saved questions, progress summaries, study plans, streaks, achievements, and flashcard scheduling. Update the dashboard to consume a single dashboard-summary endpoint.

### Phase 5: Add AI and practical execution safely

Add a backend AI gateway with retrieval, quotas, moderation, and observability. Move code execution to an isolated worker or remove execution until a secure sandbox is available.

### Phase 6: Production hardening

Add monitoring, structured logs, backups, analytics consent, accessibility review, load tests, content moderation, data-retention policies, and a staged deployment process.

## 16. Current Prototype Limitations

- Accounts and passwords use plain browser storage.
- Paper catalogue records and demo answer content are local or hard-coded.
- PDF URLs point to a public PDF.js sample document rather than PastQ-owned papers.
- Some dashboard actions are presentational placeholders.
- Progress, saved questions, scores, achievements, and flashcard mastery are not fully persisted.
- AI responses are simulated.
- The app mixes view-state navigation with feature components and should eventually use protected URL routes.

These limitations are intentional for a self-contained frontend demonstration. The backend plan above identifies the ownership changes required to make the same user experience reliable, secure, and multi-device.

## 17. Contribution Checklist

When changing a feature:

1. Edit the component or feature that owns the behavior.
2. Keep shared controls presentational and prop-driven.
3. Move remote data access into an API/data layer rather than embedding fetch logic in multiple screens.
4. Add loading, empty, error, and success states.
5. Update this document when routes, storage contracts, or API assumptions change.
6. Run `npm run lint` and `npm run build` before submitting the change.
