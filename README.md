# RealWorld UI Automated Tests

This project contains UI automated tests for the RealWorld Django Rest Framework Angular application. It uses Playwright for browser automation and TestContainers for Docker orchestration.

## Prerequisites

- Node.js (v16 or later)
- npm (v8 or later)
- Docker and Docker Compose
- Git

## Setup Instructions

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/realworld-ui-tests.git
   cd realworld-ui-tests
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

### Running Tests

#### Option 1: Against a locally running application

1. Start the RealWorld application using Docker:
   ```bash
   docker run -d -p 8000:8000 nemtam/realworld-django-rest-framework-angular:latest
   docker run -d -p 4200:4200 -e API_URL=http://localhost:8000/api nemtam/realworld-django-rest-framework-angular-web:latest
   ```

2. Run the tests:
   ```bash
   npm test
   ```

#### Option 2: Using TestContainers (automatically manages containers)

Run tests with TestContainers enabled:
```bash
USE_TESTCONTAINERS=true npm test
```

#### Option 3: Using Docker Compose

1. Build and run everything in Docker:
   ```bash
   docker-compose up --build
   ```

### Configuration

The test suite is configured via the `config/default.yml` file. You can override these settings with environment variables:

- `BASE_URL`: URL of the Angular frontend
- `API_URL`: URL of the Django API
- `TEST_USER_EMAIL`: Email for test user
- `TEST_USER_USERNAME`: Username for test user
- `TEST_USER_PASSWORD`: Password for test user
- `CONFIG_FILE`: Path to a custom YAML config file

Example:
```bash
BASE_URL=http://localhost:4200 TEST_USER_PASSWORD=StrongPass123! npm test
```

## Running Headless in CI/CD

The tests are configured to run headless by default. For CI/CD environments, no additional configuration is needed:

```bash
npm test
```

## Viewing Reports

After running tests, a HTML report is generated in the `playwright-report` directory. Open it with:

```bash
npx playwright show-report
```

## Additional Commands

- Run tests with browser UI visible:
  ```bash
  npm run test:headed
  ```

- Run tests in debug mode:
  ```bash
  npm run test:debug
  ```

- Build Docker image:
  ```bash
  npm run docker:build
  ```

- Run tests in Docker:
  ```bash
  npm run docker:test
  ```