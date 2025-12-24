#!/usr/bin/env node

import { Command } from "commander";
import { scan } from "./scanner/index.js";

const NAME = "mdn-http-observatory-scan";
const program = new Command();

program
  .name(NAME)
  .description("CLI for the MDN HTTP Observatory scan functionality")
  .version("1.0.0")
  .argument("<hostname>", "hostname to scan")
  .option('-h, --httpsPort <port>', 'Optional HTTPS port', '443')
  .option('-t, --httpPort <port>', 'Optional HTTP port', '80')
  .option('-p, --path <path>', 'Optional path', '/')
  .parse(process.argv)
  .action(async (hostname, _options) => {
    try {
      const result = await scan(hostname, _options);
      const tests = Object.fromEntries(
        Object.entries(result.tests).map(([key, test]) => {
          const { scoreDescription, ...rest } = test;
          return [key, rest];
        })
      );
      const ret = {
        scan: result.scan,
        tests: tests,
      };
      console.log(JSON.stringify(ret, null, 2));
    } catch (e) {
      if (e instanceof Error) {
        console.log(JSON.stringify({ error: e.message }));
        process.exit(1);
      }
    }
  });

program.parse();
