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
@onflow/flow-interaction-template-cli/0.2.1 darwin-arm64 node-v16.16.0
$ flix --help [COMMAND]
USAGE
  $ flix COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
- [Flow Interaction Template CLI](#flow-interaction-template-cli)
- [Usage](#usage)
- [Commands](#commands)
  - [`flix audit PATH`](#flix-audit-path)
  - [`flix catalog PATH [PROJECTS] [SKIP_PROJECTS]`](#flix-catalog-path-projects-skip_projects)
  - [`flix generate PATH`](#flix-generate-path)
  - [`flix serve PATH [PORT]`](#flix-serve-path-port)
  - [`flix verify TEMPLATEPATH AUDITORADDRESS`](#flix-verify-templatepath-auditoraddress)

## `flix audit PATH`

Audit Interaction Template json files.

```
USAGE
  $ flix audit [PATH] [-f <value>]

ARGUMENTS
  PATH  Path to a folder or individual Interaction Template JSON file.

FLAGS
  -f, --flowJsonPath=<value>  Path to a flow.json configuration file.

DESCRIPTION
  Audit Interaction Template json files.

EXAMPLES
  $ flowplate audit ./src/cadence
```

_See code: [dist/commands/audit/index.ts](https://github.com/onflow/flow-interaction-template-tools/blob/v0.2.1/dist/commands/audit/index.ts)_

## `flix catalog PATH [PROJECTS] [SKIP_PROJECTS]`

Generate Interaction Templates from NFT Catalog.

```
USAGE
  $ flix catalog [PATH] [PROJECTS] [SKIP_PROJECTS] [-f <value>]

ARGUMENTS
  PATH           Path to a folder to store the generated Interaction Templates.
  PROJECTS       List of NFT Catalog projects to generate Interaction Templates for (default all)
  SKIP_PROJECTS  List of NFT Catalog projects to skip when generating Interaction Templates (default none)

FLAGS
  -f, --flowJsonPath=<value>  Path to a flow.json configuration file.

DESCRIPTION
  Generate Interaction Templates from NFT Catalog.

EXAMPLES
  $ flowplate catalog
```

_See code: [dist/commands/catalog/index.ts](https://github.com/onflow/flow-interaction-template-tools/blob/v0.2.1/dist/commands/catalog/index.ts)_

## `flix generate PATH`

Generate Interaction Templates from .cdc files.

```
USAGE
  $ flix generate [PATH] [-f <value>]

ARGUMENTS
  PATH  Path to a folder or individual CDC file.

FLAGS
  -f, --flowJsonPath=<value>  Path to a flow.json configuration file.

DESCRIPTION
  Generate Interaction Templates from .cdc files.

EXAMPLES
  $ flowplate generate ./src/cadence
```

_See code: [dist/commands/generate/index.ts](https://github.com/onflow/flow-interaction-template-tools/blob/v0.2.1/dist/commands/generate/index.ts)_

## `flix serve PATH [PORT]`

Serve Interaction Templates queryable by id.

```
USAGE
  $ flix serve [PATH] [PORT]

ARGUMENTS
  PATH  Path to a folder or individual Interaction Template JSON file.
  PORT  Port to run on.

DESCRIPTION
  Serve Interaction Templates queryable by id.

EXAMPLES
  $ flowplate serve ./src/templates
```

_See code: [dist/commands/serve/index.ts](https://github.com/onflow/flow-interaction-template-tools/blob/v0.2.1/dist/commands/serve/index.ts)_

## `flix verify TEMPLATEPATH AUDITORADDRESS`

Verify that an Interaction Template has been audited by an Auditor.

```
USAGE
  $ flix verify [TEMPLATEPATH] [AUDITORADDRESS] [-f <value>]

ARGUMENTS
  TEMPLATEPATH    Path to an individual Interaction Template JSON file.
  AUDITORADDRESS  Address of an Auditor to verify if they have audited the Interaction Template.

FLAGS
  -f, --flowJsonPath=<value>  Path to a flow.json configuration file.

DESCRIPTION
  Verify that an Interaction Template has been audited by an Auditor.

EXAMPLES
  $ flowplate verify "./src/cadence/template.json" "0xABC123DEF456
```

_See code: [dist/commands/verify/index.ts](https://github.com/onflow/flow-interaction-template-tools/blob/v0.2.1/dist/commands/verify/index.ts)_
<!-- commandsstop -->
