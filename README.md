# Immersive [![CircleCI](https://circleci.com/gh/MatthieuLemoine/immersive/tree/master.svg?style=svg)](https://circleci.com/gh/MatthieuLemoine/immersive/tree/master)

A framework to build immersive CLIs & great developer tools.

## Features

- [Customization](https://github.com/MatthieuLemoine/immersive/wiki/Configuration#customization)
- [Configuration persistence](https://github.com/MatthieuLemoine/immersive/wiki/Configuration)
- [Auto loading of commands](https://github.com/MatthieuLemoine/immersive/wiki/Commands#commands-directory)
- [Autocomplete](https://github.com/MatthieuLemoine/immersive/wiki/Commands#autocomplete)
- [Command history](https://github.com/MatthieuLemoine/immersive/wiki/Commands#history)
- [Async commands support](https://github.com/MatthieuLemoine/immersive/wiki/Commands#example)
- [Enhanced context for commands](https://github.com/MatthieuLemoine/immersive/wiki/Commands#enhanced-context)
- [Environments management](https://github.com/MatthieuLemoine/immersive/wiki/Environments)
- [Enhanced REPL](https://github.com/MatthieuLemoine/immersive/wiki/REPL)
- [Make your own REPL](https://github.com/MatthieuLemoine/immersive/wiki/REPL#make-your-own-repl)
- [Display tabular data](https://github.com/MatthieuLemoine/immersive/wiki/Logger#table)
- [Help command](https://github.com/MatthieuLemoine/immersive/wiki/Commands#built-in-commands)

## Install

```
yarn add immersive
or
npm install immersive
```

## Usage

```javascript
import immersive from 'immersive';

const config = {
  // Application name used for config persistence (required)
  projectName: 'Immersive',
  // Will be displayed on CLI start (optional - default to displayName)
  displayName: 'Immersive',
  // Loaded commands (required if commandsDirectory not provided) - Should be valid map of ImmersiveCommand
  commands: {
    'import-orgs': {
      command: 'importOrgs',
      description: 'Import organizations',
      action: () => {},
    },
  },
  // Path to the directory where commands are defined (required if commands not provided)
  commandsDirectory: path.join(__dirname, 'commands'),
  // Will be accessible from commands as argument (optional)
  helpers: {
    db,
  },
  // Configuration will be passed to helpers based on the current environment (optional)
  environments: {
    development: { database: 'devdb' },
    staging: { database: 'stagingdb' },
    production: { database: 'proddb' },
  },
  // Define the current environment on CLI start
  // The current environment can be changed using the `env <envName>` command (optional)
  defaultEnvironment: 'development',
  // Default cli config (optional)
  defaultConfig: {
    // Displayed in prompt
    user: 'john',
    // Displayed in prompt
    symbol: '>',
    colors: {
      prompt: 'green',
    },
  },
};

immersive(config);
```

## Inspiration

Inspired by the awesome [vorpal](https://github.com/dthree/vorpal) framework.
