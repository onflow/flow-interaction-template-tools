Flow Interaction Template CLI
=================

Flow Interaction Template CLI

<!-- [![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world) -->

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @onflow/flow-interaction-template-cli
$ flix COMMAND
running command...
$ flix (--version)
@onflow/flow-interaction-template-cli/0.1.0 darwin-arm64 node-v16.16.0
$ flix --help [COMMAND]
USAGE
  $ flix COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`flix audit PATH`](#flix-audit-path)
* [`flix generate PATH`](#flix-generate-path)
* [`flix serve PATH [PORT]`](#flix-serve-path-port)
* [`flix verify TEMPLATEPATH AUDITORADDRESS`](#flix-verify-templatepath-auditoraddress)

## `flix audit PATH`

Generate transaction templates from .cdc files.

```
USAGE
  $ flix audit [PATH] [-f <value>]

ARGUMENTS
  PATH  Path to a folder or individual Interaction Template JSON file.

FLAGS
  -f, --flowJsonPath=<value>  Path to a flow.json configuration file.

DESCRIPTION
  Generate transaction templates from .cdc files.

EXAMPLES
  $ flowplate audit ./src/cadence
```

_See code: [dist/commands/audit/index.ts](https://github.com/onflow/flow-interaction-template-tools/blob/v0.1.0/dist/commands/audit/index.ts)_

## `flix generate PATH`

Generate transaction templates from .cdc files.

```
USAGE
  $ flix generate [PATH] [-f <value>]

ARGUMENTS
  PATH  Path to a folder or individual CDC file.

FLAGS
  -f, --flowJsonPath=<value>  Path to a flow.json configuration file.

DESCRIPTION
  Generate transaction templates from .cdc files.

EXAMPLES
  $ flowplate generate ./src/cadence
```

_See code: [dist/commands/generate/index.ts](https://github.com/onflow/flow-interaction-template-tools/blob/v0.1.0/dist/commands/generate/index.ts)_

## `flix serve PATH [PORT]`

Serve InteractionTemplate queryable by id.

```
USAGE
  $ flix serve [PATH] [PORT]

ARGUMENTS
  PATH  Path to a folder or individual Interaction Template JSON file.
  PORT  Port to run on.

DESCRIPTION
  Serve InteractionTemplate queryable by id.

EXAMPLES
  $ flowplate serve ./src/templates
```

_See code: [dist/commands/serve/index.ts](https://github.com/onflow/flow-interaction-template-tools/blob/v0.1.0/dist/commands/serve/index.ts)_

## `flix verify TEMPLATEPATH AUDITORADDRESS`

Verify InteractionTemplate is audited by an auditor account.

```
USAGE
  $ flix verify [TEMPLATEPATH] [AUDITORADDRESS] [-f <value>]

ARGUMENTS
  TEMPLATEPATH    Path to an individual Interaction Template JSON file.
  AUDITORADDRESS  Address of an Auditor to verify if they have audited the Interaction Template.

FLAGS
  -f, --flowJsonPath=<value>  Path to a flow.json configuration file.

DESCRIPTION
  Verify InteractionTemplate is audited by an auditor account.

EXAMPLES
  $ flowplate verify "./src/cadence/template.json" "0xABC123DEF456
```

_See code: [dist/commands/verify/index.ts](https://github.com/onflow/flow-interaction-template-tools/blob/v0.1.0/dist/commands/verify/index.ts)_
<!-- commandsstop -->
