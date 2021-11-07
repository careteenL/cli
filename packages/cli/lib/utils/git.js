"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tryGitInit = exports.tryGitCommit = exports.isInitGitRepository = exports.gitInitRepo = void 0;

var _child_process = require("child_process");

const isInitGitRepository = () => {
  try {
    (0, _child_process.execSync)('git rev-parse --is-inside-work-tree', {
      stdio: 'ignore'
    });
    return true;
  } catch (e) {
    return false;
  }
};

exports.isInitGitRepository = isInitGitRepository;

const tryGitInit = () => {
  try {
    (0, _child_process.execSync)('git --version', {
      stdio: 'ignore'
    });

    if (isInitGitRepository()) {
      return false;
    }

    (0, _child_process.execSync)('git init', {
      stdio: 'ignore'
    });
    return true;
  } catch (e) {
    console.warn('Git repo not initialized', e);
    return false;
  }
};

exports.tryGitInit = tryGitInit;

const tryGitCommit = () => {
  try {
    (0, _child_process.execSync)('git add -A', {
      stdio: 'ignore'
    });
    (0, _child_process.execSync)('git commit -m "chore🎉: Initialize project using @careteen/cli"', {
      stdio: 'ignore'
    });
    return true;
  } catch (e) {
    console.warn('Git commit not created', e);
    console.warn('Removing .git directory...');
    return false;
  }
};

exports.tryGitCommit = tryGitCommit;

const gitInitRepo = () => {
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

exports.gitInitRepo = gitInitRepo;