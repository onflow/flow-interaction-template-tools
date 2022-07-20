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
$ npm install -g flowplate
$ flowplate COMMAND
running command...
$ flowplate (--version)
flowplate/0.0.0 darwin-x64 node-v17.5.0
$ flowplate --help [COMMAND]
USAGE
  $ flowplate COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`flowplate audit PATH`](#flowplate-audit-path)
* [`flowplate generate PATH`](#flowplate-generate-path)
* [`flowplate hello PERSON`](#flowplate-hello-person)
* [`flowplate hello world`](#flowplate-hello-world)
* [`flowplate help [COMMAND]`](#flowplate-help-command)
* [`flowplate plugins`](#flowplate-plugins)
* [`flowplate plugins:install PLUGIN...`](#flowplate-pluginsinstall-plugin)
* [`flowplate plugins:inspect PLUGIN...`](#flowplate-pluginsinspect-plugin)
* [`flowplate plugins:install PLUGIN...`](#flowplate-pluginsinstall-plugin-1)
* [`flowplate plugins:link PLUGIN`](#flowplate-pluginslink-plugin)
* [`flowplate plugins:uninstall PLUGIN...`](#flowplate-pluginsuninstall-plugin)
* [`flowplate plugins:uninstall PLUGIN...`](#flowplate-pluginsuninstall-plugin-1)
* [`flowplate plugins:uninstall PLUGIN...`](#flowplate-pluginsuninstall-plugin-2)
* [`flowplate plugins update`](#flowplate-plugins-update)
* [`flowplate serve PATH [PORT]`](#flowplate-serve-path-port)
* [`flowplate verify TEMPLATEPATH AUDITPATH`](#flowplate-verify-templatepath-auditpath)

## `flowplate audit PATH`

Generate transaction templates from .cdc files.

```
USAGE
  $ flowplate audit [PATH]

ARGUMENTS
  PATH  Path to a folder or individual CDC file.

DESCRIPTION
  Generate transaction templates from .cdc files.

EXAMPLES
  $ flowplate audit ./src/cadence
```

_See code: [dist/commands/audit/index.ts](https://github.com/JeffreyDoyle/flowplate/blob/v0.0.0/dist/commands/audit/index.ts)_

## `flowplate generate PATH`

Generate transaction templates from .cdc files.

```
USAGE
  $ flowplate generate [PATH]

ARGUMENTS
  PATH  Path to a folder or individual CDC file.

DESCRIPTION
  Generate transaction templates from .cdc files.

EXAMPLES
  $ flowplate generate ./src/cadence
```

_See code: [dist/commands/generate/index.ts](https://github.com/JeffreyDoyle/flowplate/blob/v0.0.0/dist/commands/generate/index.ts)_

## `flowplate hello PERSON`

Say hello

```
USAGE
  $ flowplate hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Whom is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/JeffreyDoyle/flowplate/blob/v0.0.0/dist/commands/hello/index.ts)_

## `flowplate hello world`

Say hello world

```
USAGE
  $ flowplate hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

## `flowplate help [COMMAND]`

Display help for flowplate.

```
USAGE
  $ flowplate help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for flowplate.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `flowplate plugins`

List installed plugins.

```
USAGE
  $ flowplate plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ flowplate plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `flowplate plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ flowplate plugins:install PLUGIN...

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
  $ flowplate plugins add

EXAMPLES
  $ flowplate plugins:install myplugin 

  $ flowplate plugins:install https://github.com/someuser/someplugin

  $ flowplate plugins:install someuser/someplugin
```

## `flowplate plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ flowplate plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ flowplate plugins:inspect myplugin
```

## `flowplate plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ flowplate plugins:install PLUGIN...

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
  $ flowplate plugins add

EXAMPLES
  $ flowplate plugins:install myplugin 

  $ flowplate plugins:install https://github.com/someuser/someplugin

  $ flowplate plugins:install someuser/someplugin
```

## `flowplate plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ flowplate plugins:link PLUGIN

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
  $ flowplate plugins:link myplugin
```

## `flowplate plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ flowplate plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ flowplate plugins unlink
  $ flowplate plugins remove
```

## `flowplate plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ flowplate plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ flowplate plugins unlink
  $ flowplate plugins remove
```

## `flowplate plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ flowplate plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ flowplate plugins unlink
  $ flowplate plugins remove
```

## `flowplate plugins update`

Update installed plugins.

```
USAGE
  $ flowplate plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

## `flowplate serve PATH [PORT]`

Serve templates and audits by id.

```
USAGE
  $ flowplate serve [PATH] [PORT]

ARGUMENTS
  PATH  Path to a folder or individual CDC file.
  PORT  Port to run on.

DESCRIPTION
  Serve templates and audits by id.

EXAMPLES
  $ flowplate serve ./src/templates
```

_See code: [dist/commands/serve/index.ts](https://github.com/JeffreyDoyle/flowplate/blob/v0.0.0/dist/commands/serve/index.ts)_

## `flowplate verify TEMPLATEPATH AUDITPATH`

Verify InteractionTemplate using a corresponding InteractionTemplateAudit.

```
USAGE
  $ flowplate verify [TEMPLATEPATH] [AUDITPATH]

ARGUMENTS
  TEMPLATEPATH  Path to a file containing an InteractionTemplate.
  AUDITPATH     Path to a file containing an InteractionTemplateAudit.

DESCRIPTION
  Verify InteractionTemplate using a corresponding InteractionTemplateAudit.

EXAMPLES
  $ flowplate verify ./src/cadence/template ./src/cadence/audit
```

_See code: [dist/commands/verify/index.ts](https://github.com/JeffreyDoyle/flowplate/blob/v0.0.0/dist/commands/verify/index.ts)_
<!-- commandsstop -->
