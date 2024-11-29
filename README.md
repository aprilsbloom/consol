# consol
a customizable logging library written in typescript

![github stars](https://badgen.net/github/stars/aprilsbloom/consol) 
![npm version](https://badgen.net/npm/v/consol.js) 
![total npm downloads](https://badgen.net/npm/dt/consol.js) 
![monthly npm downloads](https://badgen.net/npm/dm/consol.js)

## formats
by default, consol supports full customization of everything, mainly through the process of placeholder strings and functions as shown below.

consol currently allows you to change the format of all logs, the path to each log, as well as the strings associated with each log level (see: [placeholders](#placeholders) & [functions](#functions)). these can be modified using the following functions:
- `consol.options.setPathFormat()`
  - note: consol supports writing logs to files. this can be enabled by calling `consol.options.setOutputToFile()`
- `consol.options.setBaseLogFormat()`
- `consol.options.setLogFormat()`
- `consol.options.setInfoFormat()`
- `consol.options.setSuccessFormat()`
- `consol.options.setWarningFormat()`
- `consol.options.setErrorFormat()`
- `consol.options.setFatalFormat()`
- `consol.options.setDebugFormat()`


## placeholders
consol includes some built in placeholder strings that you can add/remove to your log format.

these are the placeholders currently implemented:
- `!{level}!`
  - print the format associated with the current log level
  - functions can be included in these
- `!{message}!`
  - the actual content of your message (no clue why you'd want to remove this)
- `!{username}!`
  - the username of the current account logged into the system
- `!{hostname}`
  - the hostname of the system


## functions
consol supports functions, which follow the format of `!{name:arg}!`. most of these functions are omitted from logs that are written to files as they're mostly purely cosmetic.

consol currently supports the following:
- `!{date:format}!`
  - `format` can be replaced with any supported [strftime](https://github.com/samsonjs/strftime?tab=readme-ov-file#supported-specifiers) specifiers, as well as any additional text
- `!{hex:type:#color}!`
  - `type` must be either `bg` or `fg` for background & foreground (text) colors
  - `color` can be either a shorthand hex value (3 characters long) or the full 6 characters long.
    - you *can* include the # before the value, but it isn't required
- `!{styles:style}!`
  - currently, consol supports the following styles:
    - `reset`, `bold`, `italic`, `underline` and `strikethrough`
  - these are just shorthand for the raw ansi values
- `!{code:lang:code}`
  - consol supports every language & alias listed [here](https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md)
- `!{ram:type:format}`
  - `type`: `free`, `used` and `total`
    - these correspond to the total amount free, used, or amount of ram available on the system
  - `format`: `percent` & `bytes`
    - selecting percent returns the raw percentage value of the type
    - selecting bytes returns the raw amount with no post processing involved
- `!{cpu:format}`
  - `format`: `name`, `cores`, `speed`
    - `name` returns a comma separated list of each CPU on the system if present
    - `cores` returns the integer number of cores
    - `speed` returns the highest speed value across all CPUs present on the system
- `!{uptime:format}`
  - `format` can be replaced with any supported [strftime](https://github.com/samsonjs/strftime?tab=readme-ov-file#supported-specifiers) specifiers, as well as any additional text
- `!{env:name}`
  - `name` can be replaced with any valid system environment variable

in the path format, only the date function is supported, as it doesn't make sense to include ansi values.
when outputting to a file, all functions are also stripped except for the date function.


## misc customization
here are a few misc customization options consol also offers:
- `consol.options.enableLogging()` / `consol.options.disableLogging()`
  - outright stop logging anything to the console
- `consol.options.setLogLevel()`
  - by default, this is set to `LogLevel.Fatal`, meaning it omits any debug logs.
- `consol.options.setJsonIndent()`
  - this allows you to change the indentation levels of any stringified objects being logged
