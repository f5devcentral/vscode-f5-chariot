
# extraction!

## download

'https://api.github.com/repos/f5devcentral/f5-as3-config-converter/releases/latest'

## import into docker

docker load -i .\Downloads\f5-as3-config-converter-v1.11.0.tar.gz

## run image in docker

docker run --rm -v "$PWD":/app/data -p 8080:8080 f5-as3-config-converter:v1.11.0 serve
docker run --rm -v /:/ -p 8080:8080 f5-as3-config-converter:v1.11.0 serve

## check directory

bash-4.4$ pwd
/app

docker cp <containerId>:/file/path/within/container /host/path/target

<!-- docker exec -it 39ad068e1282618d6f94531ce9f9e1bc9e5cf53ed45bb1973287440efa595165 bash < -->

## create code archive

tar -czvf acc_coreCode_4.14.2021.tar.gz .

tar -czvf ./data/acc_coreCode1_4.14.2021.tar.gz ./init.js ./node_modules ./src ./package.json ./static

## confirm code archive

bash-4.4$ ls -la
total 8740
drwxr-xr-x   1 default root    4096 Apr 14 16:46 .
drwxr-xr-x   1 root    root    4096 Apr 14 14:48 ..
-rw-r--r--   1 default root 2896929 Apr 14 16:36 acc_1.11.0.tar.gz
-rw-r--r--   1 default root 5790259 Apr 14 16:46 acc_coreCode_4.14.2021.tar.gz
-rw-rw-rw-   1 default root     857 Apr  2 20:24 init.js
drwxr-xr-x 158 default root    4096 Apr  2 20:24 node_modules
-rw-rw-rw-   1 default root  228185 Apr  2 20:24 package-lock.json
-rw-rw-rw-   1 default root    1744 Apr  2 20:24 package.json
drwxr-xr-x   1 default root    4096 Apr  2 20:24 src
drwxr-xr-x   1 default root    4096 Apr  2 20:24 static

## download code archive

## unpack code archive to directory

* unpack to "acc" directory?

ted@r2d2:~/projects/vscode-f5-chariot/acc_1.11.0$ tar -xzvf acc_coreCode_1.11.0.tar.gz
