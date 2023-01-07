// @ts-check

// We're building on GitHub Actions instead of Vercel to keep access to Git history.

import { execSync } from "child_process";
import parseArgs from "yargs-parser";

const { token, prod, ref } = parseArgs(process.argv.slice(2));

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
  
  vercel deploy --prebuilt --token=${token} && \

  DEPLOYMENT_URL=$(\
    vercel deploy \
      --prebuilt \
      --token=${token} \
      ${prod ? "--prod" : ""} \
  ) && \
  DEPLOYMENT_ALIAS="${ref}--zaduma.vercel.app" && \
  
  vercel alias $DEPLOYMENT_URL $DEPLOYMENT_ALIAS --token=${token} && \
  echo "DEPLOYMENT_ALIAS=$\{DEPLOYMENT_ALIAS\}" >> $GITHUB_ENV
`
    .split("\n")
    .filter((s) => s.trim())
    .join("\n")
);