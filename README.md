# consol
a customizable, extensible logging framework written in typescript

## functions
consol includes basic functions seen in any logging frameworks
- info
- success
- warning
- debug
- error
- fatal

## formatting
consol supports changing the format of your log messages.
by default, logs are formatted in the following manner: `%Y/%m/%d %H:%M:%S {level} {message}`, where level is the string associated with the called function, and `%Y/%m/%d %H:%M:%S` is the date in the form of a [strftime](https://www.npmjs.com/package/strftime) string.

here is a brief list of all functions related to formatting your log messages:
- `setFormats` - take in an object of type `LoggerOptions.formats` and merge it with the default settings
- `setLogFormat` - set the format of logged messages
- `setDateFormat` - set the format of the date in logged messages
  - `setAltDateFormat` - an alternative property you can set for representing the date in logged messages

### placeholders
with the log format, it supports placeholders in messages. here is a list of all current placeholders and their functionality:
- colors
  - `

## styling
