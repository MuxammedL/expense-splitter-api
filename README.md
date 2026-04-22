# Expense Splitter API

Expense Splitter API is a small REST service built with TypeScript and Express for managing shared group expenses.

It allows users to:

- create groups
- add members
- add shared expenses
- calculate balances
- generate optimized settlements showing who should pay whom

The main business feature of the project is **automatic debt balancing**.

## Version

**1.0.0**

## Tech Stack

- Node.js
- TypeScript
- Express
- Jest
- ESLint
- Docker
- GitHub Actions

## Features

- Create a group
- Add members to a group
- Add expenses to a group
- View all groups
- View group details
- Calculate net balances
- Generate settlements
- Health check endpoint
- Version endpoint

## Project Structure

```text
src/
├── app.ts
├── server.ts
├── controllers/
├── routes/
├── services/
├── types/
├── models/
└── data/

tests/
.github/workflows/
Dockerfile
README.md
```
