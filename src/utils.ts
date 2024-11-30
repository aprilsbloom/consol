import supportsColor from 'supports-color';
import type { Style } from './types';

export const ANSI_ESCAPE = '\x1b';
export const styles: Record<Style, string> = {
	reset: `${ANSI_ESCAPE}[0m`,
	bold: `${ANSI_ESCAPE}[1m`,
	italic: `${ANSI_ESCAPE}[3m`,
	underline: `${ANSI_ESCAPE}[4m`,
	strikethrough: `${ANSI_ESCAPE}[9m`,
}

export function hexToAnsi(hex: string, background: boolean = false): string {
	if (!supportsColor.stdout) return styles.reset;
	if (!supportsColor.stdout.hasBasic) return styles.reset;

	// deal w 16m colors first
	if (supportsColor.stdout.has16m) {
		const [r, g, b] = hexToRGB(hex);
		return `${ANSI_ESCAPE}[${background ? '48' : '38'};2;${r};${g};${b}m`;
	}

	// deal w 256 colors
	if (supportsColor.stdout.has256) {
		// use this lookup table: https://stackoverflow.com/a/60392218
	}

	return styles.reset;
}

export function hexToRGB(hex: string): [number, number, number] {
	hex = hex.toUpperCase();
	if (hex.startsWith('#')) hex = hex.slice(1);
	if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
	if (!/^[0-9A-F]{6}$/i.test(hex)) throw new Error('Invalid hex string!');

	const r = Number.parseInt(hex.slice(0, 2), 16);
	const g = Number.parseInt(hex.slice(2, 4), 16);
	const b = Number.parseInt(hex.slice(4, 6), 16);

	return [r, g, b];
}

export const SUPPORTED_LANGUAGES = [
  "1c",
  "abnf",
  "accesslog",
  "actionscript",
  "ada",
  "ado",
  "adoc",
  "ahk",
  "angelscript",
  "apache",
  "apacheconf",
  "applescript",
  "arcade",
  "arduino",
  "arm",
  "armasm",
  "as",
  "asc",
  "asciidoc",
  "aspectj",
  "atom",
  "autohotkey",
  "autoit",
  "avrasm",
  "awk",
  "axapta",
  "bash",
  "basic",
  "bat",
  "bf",
  "bind",
  "bnf",
  "brainfuck",
  "c",
  "c#",
  "c++",
  "cal",
  "capnp",
  "capnproto",
  "cc",
  "ceylon",
  "cjs",
  "clean",
  "clj",
  "clojure",
  "clojure-repl",
  "cls",
  "cmake",
  "cmake.in",
  "cmd",
  "coffee",
  "coffeescript",
  "console",
  "coq",
  "cos",
  "cpp",
  "cr",
  "craftcms",
  "crm",
  "crmsh",
  "crystal",
  "cs",
  "csharp",
  "cson",
  "csp",
  "css",
  "cts",
  "cxx",
  "d",
  "dart",
  "dcl",
  "delphi",
  "dfm",
  "diff",
  "django",
  "dns",
  "do",
  "docker",
  "dockerfile",
  "dos",
  "dpr",
  "dsconfig",
  "dst",
  "dts",
  "dust",
  "ebnf",
  "edn",
  "elixir",
  "elm",
  "erb",
  "erl",
  "erlang",
  "erlang-repl",
  "ex",
  "excel",
  "exs",
  "f#",
  "f90",
  "f95",
  "feature",
  "fix",
  "flix",
  "fortran",
  "fs",
  "fsharp",
  "gams",
  "gauss",
  "gcode",
  "gemspec",
  "gherkin",
  "glsl",
  "gml",
  "gms",
  "go",
  "golang",
  "golo",
  "gql",
  "gradle",
  "graph",
  "graphql",
  "groovy",
  "gss",
  "gyp",
  "h",
  "h++",
  "haml",
  "handlebars",
  "haskell",
  "haxe",
  "hbs",
  "hh",
  "hpp",
  "hs",
  "hsp",
  "html",
  "html.handlebars",
  "html.hbs",
  "htmlbars",
  "http",
  "https",
  "hx",
  "hxx",
  "hy",
  "hylang",
  "i7",
  "iced",
  "icl",
  "inform7",
  "ini",
  "ino",
  "instances",
  "ipython",
  "irb",
  "irpf90",
  "isbl",
  "java",
  "javascript",
  "jboss-cli",
  "jinja",
  "jldoctest",
  "js",
  "json",
  "jsonc",
  "jsp",
  "jsx",
  "julia",
  "julia-repl",
  "k",
  "kdb",
  "kotlin",
  "kt",
  "kts",
  "lasso",
  "lassoscript",
  "latex",
  "ldif",
  "leaf",
  "less",
  "lisp",
  "livecodeserver",
  "livescript",
  "llvm",
  "ls",
  "ls",
  "lsl",
  "lua",
  "m",
  "mak",
  "make",
  "makefile",
  "markdown",
  "mathematica",
  "matlab",
  "maxima",
  "md",
  "mel",
  "mercury",
  "mikrotik",
  "mips",
  "mipsasm",
  "mizar",
  "mjs",
  "mk",
  "mkd",
  "mkdown",
  "ml",
  "ml",
  "mm",
  "mma",
  "mojolicious",
  "monkey",
  "moo",
  "moon",
  "moonscript",
  "mts",
  "n1ql",
  "nc",
  "nestedtext",
  "nginx",
  "nginxconf",
  "nim",
  "nix",
  "nixos",
  "node-repl",
  "nsis",
  "nt",
  "obj-c",
  "obj-c++",
  "objc",
  "objective-c++",
  "objectivec",
  "ocaml",
  "openscad",
  "osascript",
  "oxygene",
  "p21",
  "parser3",
  "pas",
  "pascal",
  "patch",
  "pb",
  "pbi",
  "pcmk",
  "pde",
  "perl",
  "pf",
  "pf.conf",
  "pgsql",
  "php",
  "php-template",
  "pl",
  "plaintext",
  "plist",
  "pm",
  "podspec",
  "pony",
  "postgres",
  "postgresql",
  "powershell",
  "pp",
  "processing",
  "profile",
  "prolog",
  "properties",
  "proto",
  "protobuf",
  "ps",
  "ps1",
  "puppet",
  "purebasic",
  "pwsh",
  "py",
  "pycon",
  "python",
  "python-repl",
  "q",
  "qml",
  "qt",
  "r",
  "rb",
  "re",
  "reasonml",
  "rib",
  "roboconf",
  "routeros",
  "rs",
  "rsl",
  "rss",
  "ruby",
  "ruleslanguage",
  "rust",
  "sas",
  "scad",
  "scala",
  "scheme",
  "sci",
  "scilab",
  "scm",
  "scss",
  "sh",
  "shell",
  "shellsession",
  "smali",
  "smalltalk",
  "sml",
  "sqf",
  "sql",
  "st",
  "stan",
  "stanfuncs",
  "stata",
  "step",
  "step21",
  "stp",
  "styl",
  "stylus",
  "subunit",
  "sv",
  "svg",
  "svh",
  "swift",
  "taggerscript",
  "tao",
  "tap",
  "tcl",
  "tex",
  "text",
  "thor",
  "thrift",
  "tk",
  "toml",
  "tp",
  "ts",
  "tsx",
  "twig",
  "txt",
  "typescript",
  "v",
  "vala",
  "vb",
  "vbnet",
  "vbs",
  "vbscript",
  "vbscript-html",
  "verilog",
  "vhdl",
  "vim",
  "wasm",
  "wildfly-cli",
  "wl",
  "wren",
  "wsf",
  "x++",
  "x86asm",
  "xhtml",
  "xjb",
  "xl",
  "xls",
  "xlsx",
  "xml",
  "xpath",
  "xq",
  "xqm",
  "xquery",
  "xsd",
  "xsl",
  "yaml",
  "yml",
  "zep",
  "zephir",
  "zone",
  "zsh"
]