---
nav:
  title: Coding Tips
toc: content
title: Tips
---

# Linux
 ## WSL 
 
  ### View the list of distros and their current state
    
      wsl.exe -l -v
     
  ### Shutdown Current distro
     ```bash
      wsl.exe -l -v
     ```
  ### Shutdown specific distro
     ```bash
      wsl.exe -t <DistroName>
     ```
  ### Boot up the default distro
     ```bash
      wsl.exe
     ```
  ### Boot up specific distro
     ```bash
      wsl.exe -d <DistroName>
     ```
     
# Electron Js
 ## Make all links open with the browser, not with the application
   - createWindow fn 
   ```ts
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return { action: 'deny' }
    })
  ```

# Services Worker

## Post message
`Listen message Example`
```ts
// worker.js
window.onmessage = (event) => {
    if (event.data.payload === 'removeLoading') {
       
    }
};
// Usage in comp or fn
postMessage({ payload: 'removeLoading' });
```

# DOM and Style
Ref: https://github.com/heliomarpm/electron-vuevite-quick-start/blob/main/electron/preload.ts
## Show loading or spinner 
`More loading here`
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit

```ts
const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) {
      return parent.removeChild(child);
    }
  },
};

const className = 'loaders-css__square-spin';
const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
const oStyle = document.createElement('style');
const oDiv = document.createElement('div');

oStyle.id = 'app-loading-style';
oStyle.innerHTML = styleContent;
oDiv.className = 'app-loading-wrap';
oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

const showLoading = () => {
  safeDOM.append(document.head, oStyle);
  safeDOM.append(document.body, oDiv);
};

const removeLoading = () => {
  safeDOM.remove(document.head, oStyle);
  safeDOM.remove(document.body, oDiv);
};

```
