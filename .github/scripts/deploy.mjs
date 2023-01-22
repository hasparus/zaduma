// @ts-check

// We're building on GitHub Actions instead of Vercel to keep access to Git history.

import { execSync } from "child_process";
import parseArgs from "yargs-parser";

const { token, prod } = parseArgs(process.argv.slice(2));

// 1. Pull vercel environment information
// 2. Build project artifacts
// 3. Deploy project artifacts to vercel
// 4. Alias deployment to ${branch}--zaduma.vercel.app and write to GITHUB_ENV
execSync(
  `\
  vercel pull \
    --yes \
    --token=${token} \
    --environment=${prod ? "production" : "preview"} && \
  
  vercel build --token=${token} ${prod ? "--prod" : ""} && \

  DEPLOYMENT_URL=$(\
    vercel deploy \
      --prebuilt \
      --token=${token} \
      ${prod ? "--prod" : ""} \
  ) && \

  DEPLOYMENT_ALIAS="${createDeploymentAlias()}" && \
  
  echo "DEPLOYMENT_ALIAS=$DEPLOYMENT_ALIAS" >> $GITHUB_ENV && \

  vercel alias $DEPLOYMENT_URL $DEPLOYMENT_ALIAS --token=${token}
`
    .split("\n")
    .filter((s) => s.trim())
    .join("\n")
);

function createDeploymentAlias() {
  if (!process.env.REF_NAME) throw new Error("process.env.REF_NAME is missing");

  const refSlug = process.env.REF_NAME.replace(
    "dependabot/npm_and_yarn/",
    "deps-"
  )
    .replace(/[^a-z0-9]/gi, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

  return `${refSlug}--zaduma.vercel.app`;
}
