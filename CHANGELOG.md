# Change Log

[BACK TO MAIN README](README.md)

All notable changes to the "vscode-f5-chariot" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

---

## [1.22.0] - (07-23-2022)

- acc 1.22.0 release
  - <https://github.com/f5devcentral/f5-automation-config-converter#v1.22.0>

---

## [1.19.2] - (03-23-2022)

- acc 1.19.2 release
  - <https://github.com/f5devcentral/f5-automation-config-converter#v1.19.2>

---

## [1.18.0] - (01-26-2022)

- acc 1.18 release
  - <https://github.com/f5devcentral/f5-automation-config-converter#v1.18.0>

---

## [1.17.1] - (12-26-2021)

- fix for bug -> conversion failing with - f5.chariot.convertAS3 failed with [TypeError: doc.getText is not a functio #7
  - <https://github.com/f5devcentral/vscode-f5-chariot/issues/7>

---

## [1.17.0] - (12-17-2021)

- update to v1.17.0 acc
  - Please see <https://github.com/f5devcentral/f5-as3-config-converter/releases> for release information
- smoothed out tests
- changed output editor to standard 'untitled', but then injects the atc apropriate schema from the vscode-f5 command 'f5.injectSchemaRef'
  - this will continue the effort to make editing of the output easy with schema validation
  - should silently fail if command not available

---

## [1.16.3] - (11-28-2021)

- github action automation done
  - added open-vsix publishing step

---

## [1.16.2] - (11-25-2021)

- Updated logger to f5-conx-core@v0.11.0
- automated github actions testing and extension publishing

Please see <https://github.com/f5devcentral/f5-as3-config-converter/releases> for release information

---

## [1.16.1] - (11-12-2021)

- Enabled Declarative Onboarding conversion flag
- updated conversion output file name to include as3/do for schema reference
- adjustect tests/utils to return editor opened from conversion output for better flow

Please see <https://github.com/f5devcentral/f5-as3-config-converter/releases> for release information

---

## [1.14.0-...]

Please see <https://github.com/f5devcentral/f5-as3-config-converter/releases> for release information

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
