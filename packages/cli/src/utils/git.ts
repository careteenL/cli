import { execSync } from 'child_process';

export const isInitGitRepository = () => {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
};

export const tryGitInit = () => {
  try {
    execSync('git --version', { stdio: 'ignore' });
    if (isInitGitRepository()) {
      return false;
    }
    execSync('git init', { stdio: 'ignore' });
    return true;
  } catch (e) {
    console.warn('Git repo not initialized', e);
    return false;
  }
};

export const tryGitCommit = () => {
  try {
    execSync('git add -A', { stdio: 'ignore' });
    execSync('git commit -m "chore🎉: Initialize project using @careteen/cli"', {
      stdio: 'ignore',
    });
    return true;
  } catch (e) {
    console.warn('Git commit not created', e);
    console.warn('Removing .git directory...');
    return false;
  }
};

export const gitInitRepo = () => {
  let initializedGit = false;
  if (tryGitInit()) {
    initializedGit = true;
    console.log();
    console.log('Initialized a git repository.');
  }
  if (initializedGit && tryGitCommit()) {
    console.log();
    console.log('Created git commit.');
  }
};
