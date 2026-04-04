Create a GitHub issue for: $ARGUMENTS

Use the GitHub MCP tool to create the issue with this exact structure:

## Context
[Explain the background. Why does this feature/fix need to exist?]

## Goals
[What should be achieved after this issue is resolved?]

## Scope of Work
[What is included and explicitly what is NOT included]

## Suggested Technical Checklist
- [ ] [Specific technical task 1]
- [ ] [Specific technical task 2]
- [ ] [Specific technical task 3]

## Acceptance Criteria
- [ ] [User-facing behavior that must work correctly]
- [ ] [Edge case that must be handled]

## Blackbox Test Plan
| #   | Action | Expected Result |
| --- | ------ | --------------- |
| 1   | [Step] | [Expected]      |
| 2   | [Step] | [Expected]      |

## Notes
[Any additional context, references, or warnings for the implementor]

---
Important rules:
- Read the relevant source files first before writing the checklist
- Technical checklist must reference actual file paths in the project (e.g. src/features/auth/auth.service.ts)
- Acceptance criteria must be testable and specific, not vague
- Blackbox test plan must be written from the user's perspective, not the developer's