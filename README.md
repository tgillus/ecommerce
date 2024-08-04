# E-Commerce

This project serves as a playground to explore event-based APIs and microservices.

This project is designed for deployment to [Amazon Web Services (AWS)](https://aws.amazon.com/) cloud. The [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) is used to create all of the necessary AWS cloud infrastructure to run the project.

## Prerequisites

Ensure the following requirements are met prior to usage:

- Node.js 18 or higher
- An active [Amazon Web Services (AWS)](https://aws.amazon.com/) account

## Setup

1. Clone the repository:

```sh
git clone git@github.com:tgillus/ecommerce.git
```

2. Install the project dependencies:

```sh
cd ecommerce
npm install
```

3. Create a `.env` in the root of the project based on the `.env.example` file and add values for each of the environment variables:

```sh
cp .env.example .env
```

The environment variables have place holder values that need to be replaced with actual values.

**NOTE**: The `.env` file is used to store sensitive information such as OAuth client id and client secret values. Do not commit the `.env` file to source control.

## Commands

| Command               | Description                                                 |
| --------------------- | ----------------------------------------------------------- |
| `npm run build`       | Check for TypeScript errors.                                |
| `npm run watch`       | Watch for changes and check for TypeScript errors.          |
| `npm run test`        | Execute unit tests.                                         |
| `npm run cdk deploy`  | Deploy a CDK stack to AWS.                                  |
| `npm run cdk diff`    | Compare a deployed stack with current state.                |
| `npm run cdk destroy` | Delete a CDK stack (and its associated resources) from AWS. |
| `npm run cdk synth`   | Emit synethesize CloudFormation template for a CDK stack.   |
| `npm run format`      | Format source files.                                        |
| `npm run lint`        | Run linter against source files.                            |
| `npm run lint:fix`    | Lint source files and fix issues disovered by the linter.   |

## Command Examples

### Typecheck Codebase

```sh
npm run build
```

### Execute Unit Tests

```sh
npm run test
```

### Deploy AWS Resources

```sh
npm run cdk deploy -- --all
```

### Execute Integration Tests

```sh
npm run test:e2e
```

### Delete AWS Resources

```sh
npm run cdk destroy -- --all --force
```
