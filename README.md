vite-aem-clientlib-generator
============================

Creates a AEM clientlib based on the manifest.json generated by Vite

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/vite-aem-clientlib-generator.svg)](https://npmjs.org/package/vite-aem-clientlib-generator)
[![Downloads/week](https://img.shields.io/npm/dw/vite-aem-clientlib-generator.svg)](https://npmjs.org/package/vite-aem-clientlib-generator)
[![License](https://img.shields.io/npm/l/vite-aem-clientlib-generator.svg)](https://github.com/Jdruwe/vite-aem-clientlib-generator/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g vite-aem-clientlib-generator
$ vite-aem-lib COMMAND
running command...
$ vite-aem-lib (-v|--version|version)
vite-aem-clientlib-generator/0.0.0 darwin-x64 node-v14.18.1
$ vite-aem-lib --help [COMMAND]
USAGE
  $ vite-aem-lib COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`vite-aem-lib hello [FILE]`](#vite-aem-lib-hello-file)
* [`vite-aem-lib help [COMMAND]`](#vite-aem-lib-help-command)

## `vite-aem-lib hello [FILE]`

describe the command here

```
USAGE
  $ vite-aem-lib hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ vite-aem-lib hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/Jdruwe/vite-aem-clientlib-generator/blob/v0.0.0/src/commands/hello.ts)_

## `vite-aem-lib help [COMMAND]`

display help for vite-aem-lib

```
USAGE
  $ vite-aem-lib help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.3/src/commands/help.ts)_
<!-- commandsstop -->
