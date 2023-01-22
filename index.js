const core = require("@actions/core");
const github = require("@actions/github");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const simpleGit = require("simple-git");

const algo = "aes-256-cbc";
const initVector = Buffer.alloc(16, 0);

/* VARIABLES */
const inputFilePath = core.getInput("input-file-path");
const secret = core.getInput("encrypt-secret");
const mode = core.getInput("mode");
const repositoryToken = core.getInput("repo-token");
const githubUsername = core.getInput("github-username");
const githubEmail = core.getInput("github-email");
const commitMessage = core.getInput("commit-msg") || `update: post ${mode}`;
const branchName = core.getInput("branch-name");
const repoOwner = core.getInput("repo-owner");
const repoName = core.getInput("repo-name");

const commitTheCode = async () => {
  await simpleGit.addConfig("user.name", githubUsername);
  await simpleGit.addConfig("user.email", githubEmail);

  await simpleGit.add(".");

  await simpleGit.commit(commitMessage);

  await simpleGit.push(
    `https://x-access-token:${repositoryToken}@github.com/${repoOwner}/${repoName}.git`,
    `HEAD:${branchName}`
  );
};

const encryptData = (data, secret, filePath) => {
  const cipher = crypto.createCipheriv(algo, secret, initVector);

  let encrypted = cipher.update(data, "utf-8", "hex");
  encrypted += cipher.final("hex");

  fs.writeFileSync(filePath, encrypted);
};

const decryptData = (data, secret, filePath) => {
  const decipher = crypto.createDecipheriv(algo, secret, initVector);

  let decrypted = decipher.update(data.toString(), "hex", "utf8");
  decrypted += decipher.final("utf8");

  fs.writeFileSync(filePath, decrypted);
};

const executeAction = async () => {
  try {
    const filePath = path.join(__dirname, inputFilePath);
    const data = fs.readFileSync(path.basename(filePath));

    if (mode === "encryption") encryptData(data, secret, filePath);
    else if (mode === "decryption") decryptData(data, secret, filePath);

    await commitTheCode();

    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
};

executeAction();
