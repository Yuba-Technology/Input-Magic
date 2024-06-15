In this chapter, we'll introduce some prebuilt commands in the `package.json` file that will facilitate your development process. These commands are designed to help you with various tasks such as formatting and linting code, building and running the project, and running tests.

## Formatting and Linting Code

- `format`: Uses [Prettier](https://prettier.io/) to format all files in the project.

- `lint`: Uses [ESLint](https://eslint.org/) and [Stylelint](https://stylelint.io/) to lint JavaScript and CSS code in the project.

- `lint-fix`: Uses ESLint and Stylelint to lint JavaScript and CSS code in the project, and automatically fixes any fixable issues.

## Building and Running the Project

We use [Webpack](https://webpack.js.org/) to build and run the project.

- `build`: Builds the project, generating code for the production environment.

- `dev`: Builds the project, generating code for the development environment.

- `server`: Starts a development server and automatically opens a browser window.

## Running Tests

- `test`: Runs all tests.

These commands can be run by typing `npm run <command>` in the terminal, where `<command>` is the name of the command you want to run. For example, if you want to run the `format` command, you can type `npm run format` in the terminal.
