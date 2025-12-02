flyctl deploy --build-only --push -a expertrecruitments --image-label deployment-af5c320e116f6b1700151a8d8cc2c094 --config fly.toml
==> Verifying app config
--> Verified app config
Validating fly.toml
[32m✓[0m Configuration is valid
==> Building image
Waiting for depot builder...

==> Building image with Depot
--> build:  (​)
#1 [internal] load build definition from Dockerfile
#1 transferring dockerfile:
#1 transferring dockerfile: 977B 0.7s done
#1 DONE 0.7s

#2 resolve image config for docker-image://docker.io/docker/dockerfile:1
#2 DONE 0.7s

#1 [internal] load build definition from Dockerfile
#1 transferring dockerfile: 977B 0.7s done
#1 DONE 0.7s

#3 docker-image://docker.io/docker/dockerfile:1@sha256:b6afd42430b15f2d2a4c5a02b919e98a525b785b1aaff16747d2f623364e39b6
#3 resolve docker.io/docker/dockerfile:1@sha256:b6afd42430b15f2d2a4c5a02b919e98a525b785b1aaff16747d2f623364e39b6 done
#3 CACHED

#4 [internal] load build definition from Dockerfile
#4 Deduplicating step ID [internal] load build definition from Dockerfile, another build is calculating it done
#4 DONE 0.0s

#5 [internal] load metadata for docker.io/library/node:20.18.0-slim
#5 DONE 1.8s

#6 [internal] load .dockerignore
#6 transferring context:
#6 transferring context: 99B 0.7s done
#6 DONE 0.7s

#7 [base 1/2] FROM docker.io/library/node:20.18.0-slim@sha256:28fbbb764069c698ead61d6a739a7615e8f0e07a4b8fe1473ceca70c1c3d6aaa
#7 resolve docker.io/library/node:20.18.0-slim@sha256:28fbbb764069c698ead61d6a739a7615e8f0e07a4b8fe1473ceca70c1c3d6aaa done
#7 DONE 0.0s

#8 [base 2/2] WORKDIR /app
#8 CACHED

#9 [internal] load build context
#9 transferring context: 11.57MB 5.1s
#9 transferring context: 52.60MB 10.1s
#9 transferring context: 93.63MB 15.1s
#9 transferring context: 134.58MB 20.2s
#9 transferring context: 167.77MB 27.6s
#9 transferring context: 208.56MB 32.7s
#9 transferring context: 249.69MB 37.7s
#9 transferring context: 265.56MB 39.9s done
#9 DONE 39.9s

#10 [build 1/6] RUN apt-get update -qq &&     apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3
#10 CACHED

#11 [build 2/6] COPY package-lock.json package.json ./
#11 CACHED

#12 [build 3/6] RUN npm ci --include=dev
#12 CACHED

#13 [build 4/6] COPY . .
#13 CACHED

#14 [build 5/6] RUN npm run build
#14 0.220 
#14 0.220 > rest-express@1.0.0 build
#14 0.220 > vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
#14 0.220 
#14 0.648 vite v5.4.14 building for production...
#14 0.733 transforming...
#14 1.047 Browserslist: browsers data (caniuse-lite) is 14 months old. Please run:
#14 1.047   npx update-browserslist-db@latest
#14 1.047   Why you should do it regularly: https://github.com/browserslist/update-db#readme
#14 3.132 x Build failed in 2.45s
#14 3.132 error during build:
#14 3.132 [vite:esbuild] Transform failed with 1 error:
#14 3.132 /app/client/src/pages/job-seeker-register.tsx:379:0: ERROR: Unexpected "}"
#14 3.132 file: /app/client/src/pages/job-seeker-register.tsx:379:0
#14 3.132 
#14 3.132 Unexpected "}"
#14 3.132 377|    );
#14 3.132 378|  }
#14 3.132 379|  }
#14 3.132    |  ^
#14 3.132 380|  
#14 3.132 
#14 3.132     at failureErrorWithLog (/app/node_modules/vite/node_modules/esbuild/lib/main.js:1472:15)
#14 3.132     at /app/node_modules/vite/node_modules/esbuild/lib/main.js:755:50
#14 3.132     at responseCallbacks.<computed> (/app/node_modules/vite/node_modules/esbuild/lib/main.js:622:9)
#14 3.132     at handleIncomingPacket (/app/node_modules/vite/node_modules/esbuild/lib/main.js:677:12)
#14 3.132     at Socket.readFromStdout (/app/node_modules/vite/node_modules/esbuild/lib/main.js:600:7)
#14 3.132     at Socket.emit (node:events:519:28)
#14 3.132     at addChunk (node:internal/streams/readable:559:12)
#14 3.132     at readableAddChunkPushByteMode (node:internal/streams/readable:510:3)
#14 3.132     at Readable.push (node:internal/streams/readable:390:5)
#14 3.132     at Pipe.onStreamRead (node:internal/stream_base_commons:191:23)
#14 3.132 ✓ 22 modules transformed.
#14 ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
npm run build failed
------
 > [build 5/6] RUN npm run build:
3.132     at /app/node_modules/vite/node_modules/esbuild/lib/main.js:755:50
3.132     at responseCallbacks.<computed> (/app/node_modules/vite/node_modules/esbuild/lib/main.js:622:9)
3.132     at handleIncomingPacket (/app/node_modules/vite/node_modules/esbuild/lib/main.js:677:12)
3.132     at Socket.readFromStdout (/app/node_modules/vite/node_modules/esbuild/lib/main.js:600:7)
3.132     at Socket.emit (node:events:519:28)
3.132     at addChunk (node:internal/streams/readable:559:12)
3.132     at readableAddChunkPushByteMode (node:internal/streams/readable:510:3)
3.132     at Readable.push (node:internal/streams/readable:390:5)
3.132     at Pipe.onStreamRead (node:internal/stream_base_commons:191:23)
3.132 ✓ 22 modules transformed.
------
==> Building image
Waiting for depot builder...

==> Building image with Depot
--> build:  (​)
#1 [internal] load build definition from Dockerfile
#1 transferring dockerfile:
#1 transferring dockerfile: 977B 0.7s done
#1 DONE 0.7s

#2 resolve image config for docker-image://docker.io/docker/dockerfile:1
#2 DONE 0.9s

#1 [internal] load build definition from Dockerfile
#1 transferring dockerfile: 977B 0.7s done
#1 DONE 0.7s

#3 docker-image://docker.io/docker/dockerfile:1@sha256:b6afd42430b15f2d2a4c5a02b919e98a525b785b1aaff16747d2f623364e39b6
#3 resolve docker.io/docker/dockerfile:1@sha256:b6afd42430b15f2d2a4c5a02b919e98a525b785b1aaff16747d2f623364e39b6 done
#3 CACHED

#4 [internal] load build definition from Dockerfile
#4 Deduplicating step ID [internal] load build definition from Dockerfile, another build is calculating it done
#4 DONE 0.0s

#5 [internal] load metadata for docker.io/library/node:20.18.0-slim
#5 DONE 0.6s

#6 [internal] load .dockerignore
#6 transferring context:
#6 transferring context: 99B 0.7s done
#6 DONE 0.7s

#7 [base 1/2] FROM docker.io/library/node:20.18.0-slim@sha256:28fbbb764069c698ead61d6a739a7615e8f0e07a4b8fe1473ceca70c1c3d6aaa
#7 resolve docker.io/library/node:20.18.0-slim@sha256:28fbbb764069c698ead61d6a739a7615e8f0e07a4b8fe1473ceca70c1c3d6aaa done
#7 DONE 0.0s

#8 [base 2/2] WORKDIR /app
#8 CACHED

#9 [internal] load build context
#9 transferring context: 26.46kB 0.8s done
#9 DONE 0.8s

#10 [build 3/6] RUN npm ci --include=dev
#10 CACHED

#11 [build 1/6] RUN apt-get update -qq &&     apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3
#11 CACHED

#12 [build 2/6] COPY package-lock.json package.json ./
#12 CACHED

#13 [build 4/6] COPY . .
#13 CACHED

#14 [build 5/6] RUN npm run build
#14 0.225 
#14 0.225 > rest-express@1.0.0 build
#14 0.225 > vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
#14 0.225 
#14 0.635 vite v5.4.14 building for production...
#14 0.715 transforming...
#14 1.042 Browserslist: browsers data (caniuse-lite) is 14 months old. Please run:
#14 1.042   npx update-browserslist-db@latest
#14 1.042   Why you should do it regularly: https://github.com/browserslist/update-db#readme
#14 3.116 ✓ 23 modules transformed.
#14 3.117 x Build failed in 2.45s
#14 3.117 error during build:
#14 3.117 [vite:esbuild] Transform failed with 1 error:
#14 3.117 /app/client/src/pages/job-seeker-register.tsx:379:0: ERROR: Unexpected "}"
#14 3.117 file: /app/client/src/pages/job-seeker-register.tsx:379:0
#14 3.117 
#14 3.117 Unexpected "}"
#14 3.117 377|    );
#14 3.117 378|  }
#14 3.117 379|  }
#14 3.117    |  ^
#14 3.117 380|  
#14 3.117 
#14 3.117     at failureErrorWithLog (/app/node_modules/vite/node_modules/esbuild/lib/main.js:1472:15)
#14 3.117     at /app/node_modules/vite/node_modules/esbuild/lib/main.js:755:50
#14 3.117     at responseCallbacks.<computed> (/app/node_modules/vite/node_modules/esbuild/lib/main.js:622:9)
#14 3.117     at handleIncomingPacket (/app/node_modules/vite/node_modules/esbuild/lib/main.js:677:12)
#14 3.117     at Socket.readFromStdout (/app/node_modules/vite/node_modules/esbuild/lib/main.js:600:7)
#14 3.117     at Socket.emit (node:events:519:28)
#14 3.117     at addChunk (node:internal/streams/readable:559:12)
#14 3.117     at readableAddChunkPushByteMode (node:internal/streams/readable:510:3)
#14 3.117     at Readable.push (node:internal/streams/readable:390:5)
#14 3.117     at Pipe.onStreamRead (node:internal/stream_base_commons:191:23)
#14 ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
npm run build failed
------
 > [build 5/6] RUN npm run build:
3.117     at failureErrorWithLog (/app/node_modules/vite/node_modules/esbuild/lib/main.js:1472:15)
3.117     at /app/node_modules/vite/node_modules/esbuild/lib/main.js:755:50
3.117     at responseCallbacks.<computed> (/app/node_modules/vite/node_modules/esbuild/lib/main.js:622:9)
3.117     at handleIncomingPacket (/app/node_modules/vite/node_modules/esbuild/lib/main.js:677:12)
3.117     at Socket.readFromStdout (/app/node_modules/vite/node_modules/esbuild/lib/main.js:600:7)
3.117     at Socket.emit (node:events:519:28)
3.117     at addChunk (node:internal/streams/readable:559:12)
3.117     at readableAddChunkPushByteMode (node:internal/streams/readable:510:3)
3.117     at Readable.push (node:internal/streams/readable:390:5)
3.117     at Pipe.onStreamRead (node:internal/stream_base_commons:191:23)
------
Error: failed to fetch an image or build from source: error building: failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
npm run build failed
unsuccessful command 'flyctl deploy --build-only --push -a expertrecruitments --image-label deployment-af5c320e116f6b1700151a8d8cc2c094 --config fly.toml'
