# consol
> [!NOTE]
> this is currently not fully functional and everything included is subject to change.

a customizable logging framework written in typescript


## formats
by default, consol supports full customization of the logged output. it allows you to change the position and ordering of everything shown to the end user, through the process of placeholder strings and functions as shown below.

consol currently allows you to change the format of all logs, the path to each log, as well as the strings associated with each log level (see: [placeholders](#placeholders)). these can be modified using the following functions:
- `setLogFormat()`
- `setPathFormat()`
- `setInfoFormat()`
- `setSuccessFormat()`
- `setWarningFormat()`
- `setErrorFormat()`
- `setFatalFormat()`
- `setDebugFormat()`


### placeholders
consol includes some built in placeholder strings that you can add/remove to your log format.

these are the placeholders currently implemented:
- `!{level}`
  - print the format associated with the current log level
  - functions can be included in these
- `!{message}`
  - the actual content of your message (no clue why you'd want to remove this)


### functions
consol supports functions, which follow the format of `!{name:arg}`. most of these functions are omitted from logs that are written to files as they're mostly purely cosmetic.

consol currently supports the following:
- `!{date:strftime}`
  - `strftime` can be replaced with any supported [strftime](https://github.com/samsonjs/strftime?tab=readme-ov-file#supported-specifiers) specifiers, as well as any additional text
- `!{hex:bg/fg:color}`
  - `color` can be either a shorthand hex value (3 characters long) or the full 6 characters long.
  - in its current state, you must omit the #, which normally denotes a hex value in css
  - `bg/fg` must be one or the other, they represent background and foreground colors
- `!{styles:style}`
  - currently, consol supports the following styles:
    - `reset`, `bold`, `italic`, `underline` and `strikethrough`
  - these are just shorthand for the raw ansi values