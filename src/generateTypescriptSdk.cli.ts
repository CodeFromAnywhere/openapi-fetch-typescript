#!/usr/bin/env node

import fs from "node:fs";
import { generateTypescriptSdk } from "./generateTypescriptSdk.js";
import path from "node:path";

const cli = async () => {
  // e.g. npx openapi-fetch-typescript https://guest163.actionschema.com/openapi.json /path/to/file [clientName]
  const [openapiUrlOrPath, pathToOutputFile] = process.argv.slice(2) as (
    | string
    | undefined
  )[];

  if (!openapiUrlOrPath) {
    console.log("Please provide an URL as the first argument");
    return;
  }

  const usage = `Usage: npx openapi-fetch-typescript [openapi-url or path] [output-path]`;
  if (openapiUrlOrPath === "--help" || openapiUrlOrPath === "-h") {
    console.log(usage);
    return;
  }

  const cwd = process.cwd();
  const absolutePath = pathToOutputFile?.startsWith("/")
    ? pathToOutputFile
    : pathToOutputFile
    ? path.join(cwd, pathToOutputFile)
    : path.join(cwd, "types.ts");

  const absoluteFolderPath = path.parse(absolutePath).dir;

  if (!fs.existsSync(absoluteFolderPath)) {
    console.log("Output folder doesn't exist", absoluteFolderPath);
    return;
  }

  const { isSuccessful, message, result } = await generateTypescriptSdk({
    openapiUrlOrPath,
    cwd,
  });

  if (!isSuccessful || !result) {
    console.log({ openapiUrlOrPath, cwd, isSuccessful, message, result });
    return;
  }

  fs.writeFileSync(absolutePath, result, "utf8");
  console.log("DONE writing to", absolutePath);
};

cli();
