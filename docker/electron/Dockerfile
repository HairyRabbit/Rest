FROM electronuserland/builder:wine

ENV ELECTRON_MIRROR=https://npm.taobao.org/mirrors/electron/
ENV ELECTRON_CACHE=/electron-cache/electron
ENV ELECTRON_BUILDER_CACHE=/electron-cache/electron-builder

RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc-multilib g++-multilib \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /project
RUN echo "\
const {app, BrowserWindow} = require('electron');\
let mainWindow;\
function createWindow() {\
  mainWindow = new BrowserWindow();\
  mainWindow.loadFile('index.html');\
  mainWindow.on('closed', function () { mainWindow = null; });\
};\
app.on('ready', createWindow);\
" > main.js && touch index.html

RUN npm init -y
RUN npm i -D electron-builder

# RUN echo "Prebuild linux 32"
# RUN npx electron-builder -l --ia32 2>&1

RUN echo "Prebuild linux 64"
RUN npx electron-builder -l --x64 2>&1

RUN echo "Prebuild windows 32"
RUN npx electron-builder -w --ia32 2>&1

RUN echo "Prebuild windows 64"
RUN npx electron-builder -w --x64 2>&1


RUN echo "Clean"
RUN rm -rf /project && mkdir /project


VOLUME /project/dist

# npm install node-sqlite3 --sqlite3_binary_host_mirror=https://npm.taobao.org/mirrors/node-sqlite3/
