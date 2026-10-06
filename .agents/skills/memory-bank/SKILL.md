---
name: memory-bank
description: >-
  Persistent cross-session memory system. Instructs the agent to consult and update
  the project's memory-bank/ folder (projectbrief.md, activeContext.md, systemPatterns.md,
  techContext.md, productContext.md, progress.md) on every task to eliminate amnesia and preserve project decisions.
---

# Memory Bank Skill

The **Memory Bank** is the persistent source of truth for the project. Because AI agents reset context between sessions, the Memory Bank ensures that architectural decisions, user requirements, current focus, and progress are remembered and continued seamlessly.

## Core Files in `memory-bank/`

| File | Purpose |
| :--- | :--- |
| `projectbrief.md` | Core vision, scope, high-level objectives (foundation document). |
| `productContext.md` | Why the product exists, user personas, problem statements, UX goals. |
| `systemPatterns.md` | System architecture, component relationships, engineering patterns. |
| `techContext.md` | Tech stack, dependencies, database schema, APIs, constraints. |
| `activeContext.md` | Current focus, recent architectural decisions, immediate next steps. |
| `progress.md` | Completed work, tasks in progress, upcoming backlog, known issues. |

## Operational Protocol for AI Agents

1. **Session Ingestion (Before Any Action):**
   - At the beginning of every task or conversation, inspect `memory-bank/activeContext.md` and `memory-bank/progress.md` to understand where the project currently stands.
   - Cross-reference with `projectbrief.md` and `systemPatterns.md` before making architectural suggestions or introducing new libraries.

2. **Work Execution:**
   - Follow established specifications and conventions documented in `systemPatterns.md` and `techContext.md`.
   - Never deviate from approved architectural patterns without documenting the rationale.

3. **Session Synchronization (Before Ending Turn):**
   - Whenever an important decision is made, code is committed, or a milestone is reached, update `memory-bank/activeContext.md` and `memory-bank/progress.md`.
   - If a new architectural pattern or dependency is added, update `systemPatterns.md` or `techContext.md`.
