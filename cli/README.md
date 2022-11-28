oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

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
* [`flix help [COMMAND]`](#flix-help-command)
* [`flix plugins`](#flix-plugins)
* [`flix plugins:install PLUGIN...`](#flix-pluginsinstall-plugin)
* [`flix plugins:inspect PLUGIN...`](#flix-pluginsinspect-plugin)
* [`flix plugins:install PLUGIN...`](#flix-pluginsinstall-plugin-1)
* [`flix plugins:link PLUGIN`](#flix-pluginslink-plugin)
* [`flix plugins:uninstall PLUGIN...`](#flix-pluginsuninstall-plugin)
* [`flix plugins:uninstall PLUGIN...`](#flix-pluginsuninstall-plugin-1)
* [`flix plugins:uninstall PLUGIN...`](#flix-pluginsuninstall-plugin-2)
* [`flix plugins update`](#flix-plugins-update)
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

## `flix help [COMMAND]`

Display help for flix.

```
USAGE
  $ flix help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for flix.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `flix plugins`

List installed plugins.

```
USAGE
  $ flix plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ flix plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.0/src/commands/plugins/index.ts)_

## `flix plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ flix plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ flix plugins add

EXAMPLES
  $ flix plugins:install myplugin 

  $ flix plugins:install https://github.com/someuser/someplugin

  $ flix plugins:install someuser/someplugin
```

## `flix plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ flix plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ flix plugins:inspect myplugin
```

## `flix plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ flix plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ flix plugins add

EXAMPLES
  $ flix plugins:install myplugin 

  $ flix plugins:install https://github.com/someuser/someplugin

  $ flix plugins:install someuser/someplugin
```

## `flix plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ flix plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ flix plugins:link myplugin
```

## `flix plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ flix plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ flix plugins unlink
  $ flix plugins remove
```

## `flix plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ flix plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ flix plugins unlink
  $ flix plugins remove
```

## `flix plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ flix plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ flix plugins unlink
  $ flix plugins remove
```

## `flix plugins update`

Update installed plugins.

```
USAGE
  $ flix plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

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
