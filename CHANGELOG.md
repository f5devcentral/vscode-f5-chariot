# Change Log

[BACK TO MAIN README](README.md)

All notable changes to the "vscode-f5-chariot" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

---

## [1.14.0-...]

Please see https://github.com/f5devcentral/f5-as3-config-converter/releases for release information

---

## [1.13.0] - (07-07-2021)

### Modified

- ACC v1.13.0
  - <https://github.com/f5devcentral/f5-as3-config-converter/releases/tag/v1.13.0>
- Convert all /r/n to /n before processing with ACC
  - ACC is based on linux
- Utilize new f5-as3-config-converter exposed function
  - Removed local custom acc wrapper function
  - This should make the ACC package more standard and easily testable
- Stated adding tests and artifacts

---

## [1.12.0] - (05-25-2021)

### Modified

- ACC v1.12.0
  - <https://github.com/f5devcentral/f5-as3-config-converter/releases/tag/v1.12.0>
- Minor code tweaks for house keeping
- all logs are now info
- extension only loads on first command execution
- command execution makes output visible

---

## [1.11.0] - (04-15-2021)

### Modified

- Complete refactor for direct integration with acc code, bypassing docker/rest-api.
- Alligned local version with ACC version
  - the thought here is to release a new extension version for each ACC release
  - update independently of the main vscode-f5 extension
  - users could easily revert to previous versions

---

## [0.5.0] - (03-14-2020)

This version was primarily exploration on the ACC REST API which led to integrating directly with the code

---

## [0.4.0] - (12-14-2020)

### Added

- Added configuration option to specify entire docker command string
  - This should provide complete flexibility for getting the command to execute on different systems
  - And control the different ACC processing outputs that are now available with v1.8
- Added catching and logging of all errors from docker command execution
  - This should provide full visibility into all execution output

### Modified

- Updated default ACC version to latest 1.8

---

## [0.3.0] - (10-26-2020)

### Added

- Added progress bar for the main "Chariot Convert" command to indicate status

---

## [0.2.0] - (10-20-2020)

### Added

- Command for quick access to settings
- OUTPUT logging in vscode to provide feedback about what's happening and hopefully some idea of errors when they happen
- System informtion to logs for troubleshooting (Host OS, Platform, Release, and UserInfo)

## Modified

- Added the following switches to the docker command to provide the most output
  - --unsupported --unsupported-objects unSupported.json

---

## [0.0.1] - (10-17-2020)

## initial

- Right click option to convert text in editor with charon
  - based on the .conf input
  - outputs to coverted.as3.json so it should get as3 validation if vscode-f5 extension is installed
  - options to set the output file and docker images

---
