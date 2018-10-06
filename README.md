# Immersive [![CircleCI](https://circleci.com/gh/MatthieuLemoine/immersive/tree/master.svg?style=svg)](https://circleci.com/gh/MatthieuLemoine/immersive/tree/master)

A framework to build immersive CLIs & great developer tools.

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

## Install

```
yarn add immersive
or
npm install immersive
```

## Usage

```javascript
import immersive from 'immersive';

const config = {};

immersive(config);
```

## Inspiration

Inspired by the awesome [vorpal](https://github.com/dthree/vorpal) framework.
