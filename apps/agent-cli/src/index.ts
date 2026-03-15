#!/usr/bin/env node

import { defineCommand, runMain } from 'citty';
import init from './commands/init';
import sync from './commands/sync';
import status from './commands/status';
import convert from './commands/convert';
import mcp from './commands/mcp';
import skill from './commands/skill';
import create from './commands/create';

const main = defineCommand({
  meta: {
    name: 'agent-cli',
    version: '0.2.0',
    description: 'Universal AI agent config — sync .agents to any IDE',
  },
  subCommands: {
    init: () => init,
    sync: () => sync,
    status: () => status,
    convert: () => convert,
    mcp: () => mcp,
    skill: () => skill,
    create: () => create,
  },
});

runMain(main);
