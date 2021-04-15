
# ACC core extraction

At a high level, it was waaaaay easier to extract the necessary function to convert tmos to as3 than it was to work through the process of integrating with a docker container, whether directly or over API

## Issues with docker integration

- requires another software setup from user
  - Install/setup docker
  - load acc image, run it
- Was gettin inconsistent system/runtime errors during the process of savign the config to a file, then running the docker container on it, and getting it's output to display for user
- Had trouble with the new API
  - Not documented
  - utilizes a form post, which is like a file upload, not just posting a body
- the base acc project code is about 24Mb
- xompressed docker container is about 45Mb
- imported docker container is about 131Mb

## How to extract ACC from future docker image updates?

The basis of this workflow is creating a project/repo for managing the repackaging of ACC

The project would have scripts/tests to download the latest ACC image, extract the core ACC app code, then run tests against the wrapper file to test and make sure everything still works as expected.

The project could then be easily integrated into any other project

Steps to script for the future:

1. Query repo for latest docker image
2. download latest docker image
3. extract app from docker image
   *wrapper file and tests should already be there*
4. Run tests on wrapper file to confirm functionality
