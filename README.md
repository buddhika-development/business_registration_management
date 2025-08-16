# Project Guidelines

API guide line : https://docs.google.com/document/d/1hcRQVfNOmc2JKX-Osg1MYPa9S1QNN4Dva_npZaCpI5U/edit?usp=sharing
ERD : https://app.eraser.io/workspace/D4lXyDrEEVJwtkjCggwt?origin=share
Sequence Diagrams : https://drive.google.com/file/d/1rTjqCWM3MG68BQcPSbyNSNKh-KNp_qna/view?usp=sharing


## Naming Conventions

To ensure consistency across the codebase, follow these rules:

- **Variables, functions, and methods:** Use **camelCase**  
  Example: `userName`, `getUserData()`

- **Constants:** Use **UPPERCASE_WITH_UNDERSCORES**  
  Example: `MAX_RETRY_COUNT`, `API_BASE_URL`

- **Classes and Components:** Use **PascalCase**  
  Example: `UserProfile`, `OrderManager`

---

## Branching Strategy

We follow a structured branching strategy to maintain code quality and streamline collaboration:

- **Main Branch:**  
  - Always stable and ready for production deployment.
  - No direct commits allowed; only merge tested and approved branches.

- **Feature Branches:**  
  - Naming format: `feature/<feature-name>`  
  - Example: `feature/user-authentication`
  - Create a new branch from `main` when starting a new feature.
  - Merge into `main` only after passing code review and tests.

- **Bug Fix Branches:**  
  - Naming format: `bug/<bug-description>`  
  - Example: `bug/fix-login-error`
  - Create from `main` and merge back after review and testing.

- **Hotfix Branches:**  
  - Naming format: `hotfix/<hotfix-description>`  
  - Example: `hotfix/payment-gateway-timeout`
  - Used for urgent production fixes.

---

## Commit Message Guidelines

Follow this convention for commit messages:

```
<type>: <short description>

[optional detailed description]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (no logic change)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

Example:
```
feat: add user authentication with JWT
fix: resolve login error caused by missing token validation
```

---

## Pull Requests

- Always create a pull request (PR) when merging into `main`.
- Ensure the PR includes:
  - Description of changes
  - Related issue or task link
  - Testing steps
- At least one reviewer must approve before merging.

---

## Code Reviews

- Review code for:
  - Readability
  - Maintainability
  - Adherence to naming conventions
  - Proper branching and commit message practices
- Provide constructive feedback.

---

Following these guidelines will keep our repository clean, consistent, and easy to maintain.
