Welcome! In this chapter, we will guide you to install and run Input Magic on your computer, and give you a basic understanding of this project.

## Project Directory Structure

In the structure outlined below, we've highlighted some of the **key files and directories** within the project that you should focus on. However, this doesn't imply that the other files are of any less importance. Every file in the project serves a specific purpose and contributes to the overall functionality of the application.

```
Input-Magic
├─.github
│  ├─.git_commit_template.txt # Commit message template
│  ├─CONTRIBUTING.md # Contributing guidelines
│  └─SUPPORT.md # Support guidance
├─assets
│  ├─images
│  └─scss
├─dist # Compiled files, ready to deploy
├─docs
├─node_modules
├─public # Copied to dist on build
├─src
│   └─**/*.ts # Source code
│      └─TESTS/*.test.ts # Test files
├─CODE_OF_CONDUCT.md
├─LICENSE
├─README.md
├─SECURITY.md # Security policy
├─package.json
├─webpack.common.js # Basic Webpack config
├─webpack.dev.js # Development config
└─webpack.prod.js # Production config
```

## Installation

### Prerequisites

Before you start, make sure you have the following tools installed on your computer:

- [Git](https://git-scm.com/)
- [Node.js v20 or later](https://nodejs.org/)

### Clone the Repository

To get started, clone the Input-Magic repository to your local machine:

```sh
# https:
git clone https://github.com/Yuba-Technology/Input-Magic.git
# ...or use ssh instead:
git clone git@github.com:Yuba-Technology/Input-Magic.git
```

After cloning the repository, navigate to the project directory:

```sh
cd Input-Magic
```

### Install Dependencies

Next, install the project dependencies using npm:

```sh
npm install
```

### Run the Project

To run the project locally, use the following command:

```sh
npm run server
```

If everything is set up correctly, you should see a browser window open with the _Input Magic_ application running.

🥳👏👏 Kudos to you! You've successfully installed and launched _Input Magic_ on your machine. But don't worry if you hit a snag - our [FAQ](https://github.com/Yuba-Technology/Input-Magic/wiki/FAQ) page is here to guide you. And remember, the [Discussions](https://github.com/Yuba-Technology/Input-Magic/discussions) section is always open for you to ask questions and share your thoughts. We're here to help!

## Next Steps

Now that you've got _Input Magic_ up and running, you're all set to dive into the codebase and start making your mark. If you're new around here, we recommend starting with the [Contributing Guidelines](https://github.com/Yuba-Technology/Input-Magic/blob/main/.github/CONTRIBUTING.md).

We'll be delving into deeper concepts in the upcoming chapters. In the [next chapter](https://github.com/Yuba-Technology/Input-Magic/wiki/Prebuilt-Commands), we'll introduce some prebuilt commands in `package.json` that will facilitate your development process. So, stick around!

Got questions or need a helping hand? Don't hesitate to reach out to us on the [Discussions](https://github.com/Yuba-Technology/Input-Magic/discussions) page.
