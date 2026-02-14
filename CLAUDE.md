# How we work
Always use `git` to incrementally commit changes as you work. Every incremental atomic change deserves its own commit; avoid bundling multiple different changes into a single commit. Always commit changes after completing each task — never leave uncommitted work.

This serves two purposes:

1. If we realize we're on the wrong path as we build, we have frequent checkpoints to revert back to.
2. Future developers can reason about the history of each line of code, and the intention behind each change.

If `git` is not initialized, confirm with the user whether we're in a directory that should be a repository.

## Commit messages

Follow conventional commit message subjects, such as:

- feat: add tool for querying the web
- chore: add logging for error conditions
- feat(server): support concurrency on startup
- fix(ui): fix inconsistent rendering on mobile

# Builds

Run `./build.sh` after making changes to the source files, so that the extension is ready to be reloaded in Chrome.
