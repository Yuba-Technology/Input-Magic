# Contributing to Input Magic

Hi there!! 👋

We are thrilled that you are considering contributing to Input Magic! Open source projects like this one grow and thrive because of contributors like you. Whether it's fixing bugs, adding new features, improving documentation or spreading the word, your contributions are greatly appreciated. Let's make something amazing together!

We're so excited to have you on board! However, before you start contributing, Please take a moment to review this document - it's designed to make the contribution process enjoyable and productive for everyone involved.

By following these guidelines, you're showing that you respect the time and effort put in by the developers managing and developing this open source project. And we promise, they will show you the same respect in return when addressing your issues or assessing your patches and features.

## Using the issue tracker

The [issue tracker](https://github.com/Yuba-Technology/Input-Magic/issues) is the perfect place for [bug reports](#bug-reports), [features requests](#feature-requests) and [submitting pull requests](#pull-requests). We just ask you to keep a few guidelines in mind:

- **Please refrain from using the issue tracker for personal support requests**. We're here to support you! For personal assistance, head over to [Our GitHub Discussions](https://github.com/Yuba-Technology/Input-Magic/discussions). It's the perfect place to seek help.

- Let's **keep our discussions focused and respectful**. Please avoid derailing or trolling issues. We value everyone's opinions and ideas.

- Instead of posting comments consisting solely of "+1" or ":thumbsup:", **show your support using [GitHub's "reactions" feature](https://blog.github.com/2016-03-10-add-reactions-to-pull-requests-issues-and-comments/)**. It's a great way to express your enthusiasm! We reserve the right to delete comments which violate this rule.

## Issues assignment

Our dedicated core team will be reviewing open issues, analyzing them, and providing guidance on how to proceed. **While we don't assign issues to anyone outside the core team**, we absolutely love when contributors join the discussion, share their insights on the best solutions, and even submit a PR if they're up for it. Please wait until the issue is ready to be worked on before submitting a PR - we value your time and don't want it to be wasted.

We're a small team with limited resources, and while we strive to respond as quickly as possible, there might be some delays. Your patience is greatly appreciated! If you don't receive an immediate response, please know it doesn't mean we're ignoring you or don't care about your issue or PR. We promise to get back to you as soon as we can.

## Issues and labels

Our bug tracker uses several labels to help us organize and identify issues. Here's what they represent and how we use them:

- `browser bug` - Issues that are reported to us, but actually are the result of a browser-specific bug. These are diagnosed with reduced test cases and result in an issue opened on that browser's own bug tracker.
- `confirmed` - Issues that have been confirmed with a reduced test case and identify a bug in the source code.
- `docs` - Issues for improving or updating our documentation.
- `examples` - Issues involving the example templates included in our docs.
- `feature` - Issues asking for a new feature to be added, or an existing one to be extended or modified. New features require a minor version bump (e.g., `v3.0.0` to `v3.1.0`).
- `frontend` - Issues related to the frontend framework, including styles, components, and JavaScript/TypeScript.
- `backend` - Issues related to the backend systems and processes.
- `build` - Issues with our build system, which is used to run all our tests, concatenate and compile source files, and more.
- `help wanted` - Issues we need or would love help from the community to resolve.
- `meta` - Issues with the project itself or our GitHub repository.

For a complete look at our labels, see the [project labels page](https://github.com/Yuba-Technology/Input-Magic/labels).

## Bug reports

A bug is a _demonstrable problem_ that is caused by the code in the repository. Good bug reports are extremely helpful, so thanks!

Guidelines for bug reports:

0. **[Validate your HTML](https://html5.validator.nu/)** to ensure your problem isn't caused by a simple error in your own code.

1. **Use the GitHub issue search** &mdash; check if the issue has already been reported.

2. **Check if the issue has been fixed** &mdash; try to reproduce it using the latest `main` (or `v4-dev` branch if the issue is about v4) in the repository.

3. **Isolate the problem** &mdash; ideally create a [reduced test case](https://css-tricks.com/reduced-test-cases/) and a live example. Here's a useful template to get you started: [Template for reduced test cases](-project-test-case-template-).

A good bug report shouldn't leave others needing to chase you up for more information. Please try to be as detailed as possible in your report.

For issues, please provide details about your environment, such as the operating system and browser(s) where the problem occurs. Do other browsers show the bug differently? What steps will reproduce the issue? What would you expect to be the outcome? All these details will help people to fix any potential bugs.

Example:

> Short and descriptive example bug report title
>
> A summary of the issue and the environment in which it occurs. If
> suitable, include the steps required to reproduce the bug.
>
> 1. This is the first step
> 2. This is the second step
> 3. Further steps, etc.
>
> `<url>` - a link to the reduced test case
>
> Any other information you want to share that is relevant to the issue being reported. This might include the lines of code that you have identified as causing the bug, and potential solutions (and your opinions on their merits). We value your insights!

### Reporting upstream browser bugs

Sometimes bugs reported to us are actually caused by bugs in the browser(s) themselves, not bugs in our code. It's like a treasure hunt, and you're the detective!

| Vendor(s)     | Browser(s)                   | Rendering engine | Bug reporting website(s)                                | Notes                                                    |
| ------------- | ---------------------------- | ---------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| Mozilla       | Firefox                      | Gecko            | <https://bugzilla.mozilla.org/enter_bug.cgi>            | "Core" is normally the right product option to choose.   |
| Apple         | Safari                       | WebKit           | <https://bugs.webkit.org/enter_bug.cgi?product=WebKit>  | In Apple's bug reporter, choose "Safari" as the product. |
| Google, Opera | Chrome, Chromium, Opera v15+ | Blink            | <https://bugs.chromium.org/p/chromium/issues/list>      | Click the "New issue" button.                            |
| Microsoft     | Edge                         | Blink            | <https://developer.microsoft.com/en-us/microsoft-edge/> | Go to "Help > Send Feedback" from the browser            |

## Feature requests

Feature requests are warmly welcomed. But before you submit, take a moment to see if your idea aligns with the goals and scope of the project. It's up to _you_ to make a compelling case to convince us, the project's developers, of the benefits of this feature. Please provide as much detail and context as possible. We can't wait to hear your innovative ideas!

## Pull requests

Good pull requests—patches, improvements, new features—are a fantastic help. They should remain focused in scope and avoid containing unrelated commits.

**Please ask first** before embarking on any **significant** pull request (e.g. implementing features, refactoring code, porting to a different language), otherwise you risk spending a lot of time working on something that the project's developers might not want to merge into the project. For trivial things, or things that don't require a lot of your time, you can go ahead and make a PR.

Please adhere to the [coding guidelines](#code-guidelines) used throughout the project (indentation, accurate comments, etc.) and any other requirements (such as test coverage).

**Do not edit and do not commit any dist files (`dist/` or even `**/dist/**`).** Those files are automatically generated by our build tools. You should edit the source files in [`/src/`](https://github.com/Yuba-Technology/Input-Magic/tree/main/src) instead.

Similarly, when contributing to documentation or wiki, you should edit the documentation source files in [the `/docs` directory of the `main` branch](https://github.com/Yuba-Technology/Input-Magic/tree/main/docs). **Please also do not edit the wiki directly**. The wiki is generated from the `/docs` directory of the `main` branch.

Adhering to the following process is the best way to get your work included in the project:

1. [Fork](https://help.github.com/articles/fork-a-repo/) the project, clone your fork,
   and configure the remotes:

   ```bash
   # Clone your fork of the repo into the current directory
   git clone https://github.com/Yuba-Technology/Input-Magic.git
   # Navigate to the newly cloned directory
   cd Input-Magic
   # Assign the original repo to a remote called "upstream"
   git remote add upstream https://github.com/Yuba-Technology/Input-Magic.git
   ```

2. If you cloned a while ago, get the latest changes from upstream:

   ```bash
   git checkout main
   git pull upstream main
   ```

3. Create a new topic branch (off the main project development branch) to
   contain your feature, change, or fix:

   ```bash
   git checkout -b <topic-branch-name>
   ```

4. Commit your changes in logical chunks. Please adhere to these [git commit
   message guidelines](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
   or your code is unlikely be merged into the main project. Use Git's
   [interactive rebase](https://help.github.com/articles/about-git-rebase/)
   feature to tidy up your commits before making them public.

5. Locally merge (or rebase) the upstream development branch into your topic branch:

   ```bash
   git pull [--rebase] upstream main
   ```

6. Push your topic branch up to your fork:

   ```bash
   git push origin <topic-branch-name>
   ```

7. [Open a Pull Request](https://help.github.com/articles/about-pull-requests/)
   with a clear title and description against the `main` branch.

**IMPORTANT**: By submitting a patch, you agree to allow the project owners to license your work under the terms of the [MIT License](../LICENSE) (if it includes code changes) and under the terms of the [Creative Commons Attribution 3.0 Unported License](https://creativecommons.org/licenses/by/3.0/)(if it includes documentation changes).

## Code guidelines

### HTML

[Adhere to the Code Guide.](https://codeguide.co/#html)

- Use tags and elements appropriate for an HTML5 doctype (e.g., self-closing tags).
- Use CDNs and HTTPS for third-party JS when possible. We don't use protocol-relative URLs in this case because they break when viewing the page locally via `file://`.
- Use [WAI-ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) attributes in documentation examples to promote accessibility.

### CSS

[Adhere to the Code Guide.](https://codeguide.co/#css)

- When feasible, default color palettes should comply with [WCAG color contrast guidelines](https://www.w3.org/TR/WCAG20/#visual-audio-contrast).
- Except in rare cases, don't remove default `:focus` styles (via e.g. `outline: none;`) without providing alternative styles. See [this A11Y Project post](https://www.a11yproject.com/posts/2013-01-25-never-remove-css-outlines/) for more details.

### JS/TS

- Use semicolons in every line.
- 4 spaces (no tabs)
- strict mode
- "Attractive"

### Checking coding style

We use [ESLint](https://eslint.org/) and [Stylelint](https://stylelint.io/) to lint JavaScript and CSS code in the project. You can run the following commands to check the coding style of your code:

```sh
npm run lint
```

If you want to automatically fix any fixable issues, you can run:

```sh
npm run lint-fix
```

## License

By contributing your code, you agree to license your contribution under the [MIT License](../LICENSE).
By contributing to the documentation, you agree to license your contribution under the [Creative Commons Attribution 3.0 Unported License](https://creativecommons.org/licenses/by/3.0/).
