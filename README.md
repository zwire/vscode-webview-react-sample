# VS Code WebView Sample (React)

This sample extension demonstrates every React component in the Webview UI Toolkit for Visual Studio Code.

## Run The Sample

```bash
# Clone this repositpry
git clone https://github.com/husty530/vscode-webview-react-sample

# Navigate into sample directory and open in vscode
cd vscode-webview-react-sample
code .

# Install dependencies for the extension and webview UI source code
npm install

# Install dependencies for webview UI source code
cd app1 && npm install && cd ..

# Build webview UI source code
cd app1 && npm run build && cd ..
```

Once the sample is open inside VS Code you can run the extension by doing the following:

1. Press `F5` to open a new Extension Development Host window
2. Inside the host window, open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) and type `webview sample: Show`

For mode information, see [here](https://github.com/microsoft/vscode-webview-ui-toolkit-samples/tree/main/frameworks/component-gallery-react).

