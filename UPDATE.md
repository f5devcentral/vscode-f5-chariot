# how to update acc package

Since ACC is not published as an npm package, we have to point directly to the github repo for code and updates.  To prevent any skew along the way we point to specific tags/versions

To update ACC package use the following command but update the version tag at the end.  DO NOT use latest.

Update the vscode-f5-chariot package version

For the example below, we assume the current verion is 1.18.0, we want to upgrade to 1.19.0

```bash
npm verion 1.19.0
```

Install the latest tag using the specific tag

```bash
npm install f5devcentral/f5-automation-config-converter.git#v1.19.0
```

update CHANGELOG.md


## run tests

npm test

