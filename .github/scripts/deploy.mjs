// @ts-check

// We're building on GitHub Actions instead of Vercel to keep access to Git history.
//
// Each `vercel` subcommand runs in its own child process so that a non-zero
// exit pinpoints exactly which step failed (pull / build / deploy / alias)
// and surfaces stderr directly in the Actions log. The deployment URL is
// parsed from `vercel deploy` stdout by picking the last `https://…` line,
// which is robust to banners or deprecation notices printed by pnpm/vercel.

import { spawnSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import parseArgs from "yargs-parser";

const { token, prod } = parseArgs(process.argv.slice(2));

if (!token) {
  console.error("deploy.mjs: missing --token");
  process.exit(2);
}

const environment = prod ? "production" : "preview";

/**
 * Run `pnpm <args...>` and exit the script on failure.
 *
 * @param {string} label
 * @param {string[]} args
 * @param {{ captureStdout?: boolean }} [opts]
 * @returns {string} captured stdout (empty string when captureStdout is false)
 */
function pnpmRun(label, args, opts = {}) {
  const redacted = args.map((a) => a.replace(token, "***"));
  console.log(`\n▶ ${label}: pnpm ${redacted.join(" ")}`);

  const result = spawnSync("pnpm", args, {
    stdio: opts.captureStdout
      ? ["inherit", "pipe", "inherit"]
      : "inherit",
    encoding: "utf8",
  });

  if (result.error) {
    console.error(`✗ ${label} failed to spawn: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`✗ ${label} exited with code ${result.status}`);
    if (opts.captureStdout && result.stdout) {
      console.error("--- stdout ---\n" + result.stdout);
    }
    process.exit(result.status ?? 1);
  }

  return opts.captureStdout ? result.stdout ?? "" : "";
}

// 1. Pull Vercel environment information.
pnpmRun("vercel pull", [
  "vercel",
  "pull",
  "--yes",
  `--token=${token}`,
  `--environment=${environment}`,
]);

// 2. Build project artifacts.
pnpmRun("vercel build", [
  "vercel",
  "build",
  `--token=${token}`,
  ...(prod ? ["--prod"] : []),
]);

// 3. Deploy prebuilt artifacts. Capture stdout so we can extract the URL.
const deployStdout = pnpmRun(
  "vercel deploy",
  [
    "vercel",
    "deploy",
    "--prebuilt",
    `--token=${token}`,
    ...(prod ? ["--prod"] : []),
  ],
  { captureStdout: true },
);

const deploymentUrl = deployStdout
  .split(/\r?\n/)
  .map((l) => l.trim())
  .reverse()
  .find((l) => /^https:\/\/\S+$/.test(l));

if (!deploymentUrl) {
  console.error("✗ could not find a deployment URL in `vercel deploy` output");
  console.error("--- stdout ---\n" + deployStdout);
  process.exit(1);
}
console.log(`deployment URL: ${deploymentUrl}`);

// 4. Alias the deployment to `${branch}--zaduma.vercel.app` and write the
//    alias to $GITHUB_ENV so later steps can reference it.
const deploymentAlias = createDeploymentAlias();
console.log(`deployment alias: ${deploymentAlias}`);

if (process.env.GITHUB_ENV) {
  appendFileSync(
    process.env.GITHUB_ENV,
    `DEPLOYMENT_ALIAS=${deploymentAlias}\n`,
  );
}

pnpmRun("vercel alias", [
  "vercel",
  "alias",
  deploymentUrl,
  deploymentAlias,
  `--token=${token}`,
]);

function createDeploymentAlias() {
  if (!process.env.REF_NAME) throw new Error("process.env.REF_NAME is missing");

  const refSlug = process.env.REF_NAME.replace(
    "dependabot/npm_and_yarn/",
    "deps-",
  )
    .replace(/[^a-z0-9]/gi, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

  return `${refSlug}--zaduma.vercel.app`;
}
