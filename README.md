# Immersive [![CircleCI](https://circleci.com/gh/MatthieuLemoine/immersive/tree/master.svg?style=svg)](https://circleci.com/gh/MatthieuLemoine/immersive/tree/master)

A framework to build immersive CLIs & great developer tools.

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
  // Path to the directory where commands are defined (required)
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

## Features

- Customization
- Config persistence
- Auto loading of commands
- Autocomplete
- Command history
- Async commands support
- Enhanced context for commands
- Environments management
- Enhanced REPL
- Display tables
- Help command

## Inspiration

Inspired by the awesome [vorpal](https://github.com/dthree/vorpal) framework.
