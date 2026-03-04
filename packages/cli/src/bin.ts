#!/usr/bin/env node
import { Command } from "commander";
import { initCommand } from "./commands/init";
import { resolveCommand } from "./commands/resolve";
import { addCommand } from "./commands/add";

const program = new Command();

program
    .name("salve")
    .description("Salve CLI - Cultural Protocol Engine")
    .version("0.1.0");

program.addCommand(initCommand);
program.addCommand(resolveCommand);
program.addCommand(addCommand);

program.parse(process.argv);
