# 📄 Project Report — Expense Splitter API (v1.0.0)

**Student:** layicovmuxammed@gmail.com  
**Date:** 2026-04-19

---

## 1. Project Purpose & Description

**Expense Splitter API** is a RESTful web service built with **Node.js, TypeScript, and Express**.

It allows users to manage shared group expenses by creating groups, adding members, recording expenses, calculating net balances, and generating optimized settlements that show who should pay whom.

The main business feature of the project is **automatic debt balancing**.

For example, if several people share costs during a trip, dinner, taxi ride, or event, this API can calculate each person’s fair share and generate a simplified payment plan.

The project was designed to demonstrate a full DevOps lifecycle:

- local development
- version control with Git and GitHub
- automated CI with GitHub Actions
- testing and code quality checks
- Docker packaging

---

## 2. Branching & Versioning Approach

- Development was done using Git branches.
- Feature work can be developed on a branch such as:

```bash
feature/expense-splitter-api
```

- When the feature is complete, a Pull Request can be opened to merge into `main`.
- After merging, the release can be tagged:

```bash
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
```

Commit messages follow a clear convention:

| Prefix | Meaning |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `test:` | Tests added or updated |
| `docs:` | Documentation changes |
| `chore:` | Maintenance or configuration changes |

Example commits:

```bash
feat: add group expense endpoints
test: add settlement calculation tests
docs: add project report
chore: add CI pipeline
```

---

## 3. Build / Test / Quality Steps & Why They Matter

| Step | Tool | Why it matters |
|------|------|----------------|
| Build | TypeScript compiler | Ensures the TypeScript project compiles successfully |
| Test | Jest | Verifies business logic and API behavior |
| Quality | ESLint | Enforces code style and catches potential issues |
| Package | Docker build | Produces a reproducible and portable application image |

All stages can run automatically on every push and pull request using **GitHub Actions**.

The CI pipeline contains these stages:

1. **Build**
   - Installs dependencies with `npm ci`
   - Builds the TypeScript project using `npm run build`

2. **Test**
   - Runs automated tests with `npm test`

3. **Quality**
   - Runs ESLint with `npm run lint`

4. **Package**
   - Builds a Docker image for the application

---

## 4. Dockerfile & Image Explanation

The project includes a Dockerfile that packages the API into a container image.

Docker is useful because it makes the application easier to run in different environments. Instead of manually installing Node.js, dependencies, and configuration on every machine, the application can be built once and run as a container.

Example Docker build command:

```bash
docker build -t expense-splitter-api:1.0.0 .
```

Example Docker run command:

```bash
docker run -p 3000:3000 --name expense-api expense-splitter-api:1.0.0
```

The image tag used for this release is:

```bash
expense-splitter-api:1.0.0
```

The application exposes a health check endpoint:

```text
GET /health
```

This endpoint can be used to confirm that the API is running correctly.

---

## 5. Configuration & Secrets Strategy

| Variable | Type | Purpose |
|----------|------|---------|
| `APP_VERSION` | Config | Displays the current application version |
| `PORT` | Config | Defines the port where the server runs |
| `NODE_ENV` | Config | Defines the runtime environment |
| `SECRET_KEY` | Secret | Could be used for authentication in future versions |
| `DB_PASSWORD` | Secret | Could be used if a database is added later |

Current version of the project uses in-memory storage, so no database password is required yet.

Configuration values such as `PORT`, `NODE_ENV`, and `APP_VERSION` can be stored in `.env` files or passed as environment variables.

Secrets must not be committed to Git.

Recommended secret storage:

- GitHub Actions Secrets
- HashiCorp Vault
- Cloud provider secret managers

Example safe `.env.example` file:

```env
APP_VERSION=1.0.0
PORT=3000
NODE_ENV=development
```

Example values that should not be committed:

```env
SECRET_KEY=real-secret-value
DB_PASSWORD=real-database-password
```

---

## 6. Problems Faced & Solutions

| Problem | Solution |
|---------|----------|
| Designing correct shared expense logic | Implemented service-layer functions for balance and settlement calculation |
| Avoiding incorrect expense data | Added validation for group, member, amount, payer, and participants |
| Keeping business logic separate from routes | Used controller and service layers |
| Ensuring code reliability | Added automated tests with Jest |
| Making the app portable | Added Docker support |
| Automating checks | Added GitHub Actions CI pipeline |

One important challenge was the settlement algorithm.

The API first calculates each member’s net balance:

- positive balance means the member should receive money
- negative balance means the member should pay money

Then the settlement logic matches debtors with creditors and creates a simplified list of payments. This reduces unnecessary transactions and gives a clear final result.

---

## 7. API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/` | Root API check |
| `GET` | `/health` | Health check endpoint |
| `GET` | `/version` | Returns application version |
| `POST` | `/groups` | Creates a new group |
| `POST` | `/groups/:groupId/members` | Adds a member to a group |
| `POST` | `/groups/:groupId/expenses` | Adds an expense to a group |
| `GET` | `/groups` | Lists all groups |
| `GET` | `/groups/:groupId` | Shows details of one group |
| `GET` | `/groups/:groupId/balances` | Calculates net balances |
| `GET` | `/groups/:groupId/settlements` | Generates optimized settlements |

---

## 8. Example API Flow

Create a group:

```bash
curl -X POST http://localhost:3000/groups \
  -H "Content-Type: application/json" \
  -d '{"name":"Weekend Trip"}'
```

Add a member:

```bash
curl -X POST http://localhost:3000/groups/<GROUP_ID>/members \
  -H "Content-Type: application/json" \
  -d '{"name":"Ali"}'
```

Add an expense:

```bash
curl -X POST http://localhost:3000/groups/<GROUP_ID>/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Dinner",
    "amount":90,
    "paidByMemberId":"<ALI_ID>",
    "participantIds":["<ALI_ID>","<VELI_ID>","<AYSE_ID>"]
  }'
```

Get balances:

```bash
curl http://localhost:3000/groups/<GROUP_ID>/balances
```

Get settlements:

```bash
curl http://localhost:3000/groups/<GROUP_ID>/settlements
```

---

## 9. Release Summary

- **Project:** Expense Splitter API
- **Version:** 1.0.0
- **Image Tag:** `expense-splitter-api:1.0.0`
- **Git Tag:** `v1.0.0`
- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express
- **Testing:** Jest
- **Quality Tool:** ESLint
- **CI:** GitHub Actions
- **Docker:** Supported
- **Health Check:** `/health`

---

## 10. Conclusion

The **Expense Splitter API** demonstrates a complete backend and DevOps workflow.

It includes a real business feature, REST API design, validation, service-layer architecture, automated testing, linting, Docker packaging, and CI pipeline automation.

The most important feature of the project is automatic debt balancing, which calculates how shared expenses should be settled between group members.

This makes the project more practical than a simple Hello World API and shows how a real backend service can be developed, tested, packaged, and prepared for deployment.