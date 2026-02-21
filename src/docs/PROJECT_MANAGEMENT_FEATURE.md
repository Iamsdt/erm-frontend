# AI-Powered Project & Sprint Management Specification

## 1. Overview

This document outlines the architecture, roles, and actionable implementation steps for the new AI-Powered Project and Sprint Management module. This feature transforms the ERM (Employee Resource Management) system into a proactive workspace by integrating an AI Scrum Master that handles daily standups, tracks estimates automatically, and assists developers in resolving blockers.

## 2. Core Features

- **Project & Sprint Management:** Hierarchical organization of Projects -> Sprints -> Tasks.
- **Dynamic Kanban Boards:** Visual task management with customizable workflows per sprint.
- **AI Scrum Master:**
  - Conducts daily standups via a conversational interface.
  - Evaluates developer responses to identify progress and blockers.
  - Automatically updates task estimates and statuses based on natural language updates.
  - Acts as a first-line rubber-duck/troubleshooter for developer blockers.
- **Automated Tracking:** Real-time monitoring of task progress and sprint health.

## 3. Roles & Permissions

| Role                        | Description                                       | Permissions                                                                                                                                                                                                                      |
| :-------------------------- | :------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Admin / Project Manager** | Oversees projects, sprints, and team performance. | - Create/Edit/Archive Projects and Sprints.<br>- Define custom Kanban workflows (columns).<br>- Assign users to projects/tasks.<br>- View global sprint reports and AI-generated insights.<br>- Override AI-generated estimates. |
| **Developer / Team Member** | Executes tasks and interacts with the AI.         | - View assigned projects and active sprints.<br>- Move tasks across the Kanban board.<br>- Participate in AI daily standups.<br>- Chat with AI for blocker resolution.<br>- Manually log time/updates (optional).                |
| **AI Agent (System)**       | Automated assistant managing agile ceremonies.    | - Read task statuses and developer history.<br>- Prompt users for daily updates.<br>- Update task remaining time/estimates.<br>- Flag tasks as "Blocked" and notify Managers.                                                    |

## 4. Required Pages & UI Components

### 4.1. Pages (Routes)

1. **`/projects` (Projects Dashboard)**
   - List/Grid view of all active projects.
   - High-level progress bars and health status (AI generated).
2. **`/projects/:projectId` (Project Details & Sprints)**
   - List of all sprints (Active, Backlog, Completed) for a specific project.
   - Project-level metrics and team members.
3. **`/projects/:projectId/sprints/:sprintId` (Active Sprint / Kanban Board)**
   - Drag-and-drop Kanban board.
   - Columns based on sprint workflow (e.g., Todo, In Progress, In Review, Done).
   - Task cards showing assignee, priority, and AI-adjusted estimates.
4. **`/projects/reports` (Analytics & Tracking)**
   - Burndown charts.
   - Developer velocity and AI estimate accuracy reports.

### 4.2. Global UI Components

1. **AI Standup Widget (Global Drawer/Modal)**
   - A chat-like interface that pops up daily for the developer.
   - Prompts: "What did you accomplish yesterday?", "What is the plan for today?", "Any blockers?"
2. **Task Details Modal**
   - Opens when clicking a task on the Kanban board.
   - Shows description, comments, history, and an "AI Insights" tab detailing how estimates were adjusted.
3. **AI Blocker Resolution Chat**
   - Integrated into the Task Details or Standup Widget.
   - Allows the developer to say "I'm stuck on X", prompting the AI to search documentation, suggest fixes, or escalate to a senior developer.

## 5. Actionable Implementation Plan

### Phase 1: Foundation (CRUD & UI)

- [ ] **Database/API:** Create endpoints for Projects, Sprints, and Tasks.
- [ ] **Frontend Routes:** Setup `main.routes.jsx` for the new `/projects` paths.
- [ ] **UI Components:** Build the Projects List and Sprint List views using existing `shadcn/ui` components (Cards, Tables).
- [ ] **State Management:** Create Redux slices (`projectSlice`, `sprintSlice`) and TanStack Query hooks (`useProjects`, `useSprints`).

### Phase 1: Implementation Complete ✅

**Completed On:** February 22, 2026

**What Was Built:**

- Full API layer with project, sprint, and task endpoints abstraction
- Redux state management with project store
- Mock data endpoints for development/testing
- TanStack Query integration for automatic caching and synchronization
- Two complete pages with container/presenter pattern:
  - **Projects List Page:** Displays all projects in a responsive grid with cards showing status, progress, team, and dates
  - **Project Details Page:** Shows individual project info with embedded sprints list view
- Navigation menu integration with icon
- Proper error handling, loading states, and PropTypes validation

**Files Created:**

- `src/services/api/project.api.js` - API client layer
- `src/services/mock/project.mock.js` - Mock data handlers
- `src/services/query/project.query.js` - TanStack Query hooks
- `src/services/store/slices/project.slice.js` - Redux state
- `src/pages/projects/index.jsx` & `projects.ui.jsx` - Projects list container & UI
- `src/pages/projects/project-details/index.jsx` & `project-details.ui.jsx` - Project details container & UI

**Files Updated:**

- `src/lib/constants/api.constant.js` - Added project API paths
- `src/lib/constants/route.constant.js` - Added project routes
- `src/lib/constants/redux.constant.js` - Added PROJECT_STORE constant
- `src/services/store/reducers.js` - Integrated project slice
- `src/services/mock/mock.js` - Registered project mock handlers
- `src/route/main.routes.jsx` - Added project routes to routing
- `src/lib/menu-list.js` - Added Projects to main navigation menu

**How to Test:**

1. Run `npm run dev` to start the development server
2. Navigate to `http://localhost:3031/projects` (after login)
3. View the projects list with mock data (3 sample projects)
4. Click "View Details" to see individual project information
5. See sprints list with clickable links ready for Phase 2

### Phase 2: Kanban & Workflow

- [ ] **Drag & Drop:** Implement Kanban board using a library like `@hello-pangea/dnd` or `dnd-kit`.
- [ ] **Task Management:** Build the Task Details modal with assignment, status changes, and manual estimation fields.
- [ ] **Custom Workflows:** Allow Managers to define custom columns for the Kanban board.

### Phase 3: AI Integration (The "AI Scrum Master")

- [ ] **Standup UI:** Build the chat interface/drawer for daily standups.
- [ ] **LLM Integration (Backend):** Connect the frontend chat to the backend AI service.
- [ ] **Prompt Engineering:** Design system prompts for the AI to extract task progress and blockers from natural language.
- [ ] **Auto-estimation Logic:** Implement the flow where AI parses the standup ("I'm 50% done with the API") and triggers a mutation to update the task's remaining hours.

### Phase 4: Blocker Resolution & Analytics

- [ ] **Blocker Workflow:** If AI detects a blocker, automatically label the task as "Blocked" on the Kanban board and send a notification to the Manager.
- [ ] **AI Troubleshooting:** Enable the AI to ask follow-up technical questions to help the developer unblock themselves.
- [ ] **Dashboards:** Build burndown charts and progress monitors using a charting library (e.g., `recharts`).

## 6. Technical Considerations for Frontend

- **Real-time Updates:** Use WebSockets or React Query polling for the Kanban board so multiple users see task movements instantly.
- **AI Chat State:** Persist the AI chat history in Redux or local storage so developers don't lose context if they refresh.
- **Guards:** Implement a `ProjectManagerGuard` (similar to existing `attendance-role-guard.jsx`) to restrict access to project creation and configuration.
