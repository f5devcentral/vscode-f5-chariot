# Change Log

[BACK TO MAIN README](README.md)

All notable changes to the "vscode-f5-chariot" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.


---

## [0.3.0] - (10-26-2020)

### Added
- Added progress bar for the main "Chariot Convert" command to indicate status

---

## [0.2.0] - (10-20-2020)

## Added
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
