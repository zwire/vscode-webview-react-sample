import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from "vscode";

/**
 * A helper function that returns a unique alphanumeric identifier called a nonce.
 *
 * @remarks This function is primarily used to help enforce content security
 * policies for resources/scripts being executed in a webview context.
 *
 * @returns A nonce
 */
function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

/**
 * A helper function which will get the webview URI of a given file or resource.
 *
 * @remarks This URI can be used within a webview's HTML as a link to the
 * given file/resource.
 *
 * @param webview A reference to the extension webview
 * @param extensionUri The URI of the directory containing the extension
 * @param pathList An array of strings representing the path to a file/resource
 * @returns A URI pointing to the file/resource
 */
function getUri(webview: Webview, extensionUri: Uri, pathList: string[]) {
  return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}

/**
 * This class manages the state and behavior of webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 */
export class Panel {
  private static panels: { [key: string]: Panel; } = {};
  private readonly _key: string;
  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[];

  /**
   * The MainPanel class private constructor (called only from the render method).
   *
   * @param key A key for current instance identification
   * @param panel A reference to the webview panel
   * @param extensionUri The URI of the directory containing the extension
   * @param msgHandler A callback function to handle messages from webview
   */
  private constructor(key: string, panel: WebviewPanel, extensionUri: Uri, msgHandler: any) {
    this._key = key;
    this._panel = panel;
    this._disposables = [];

    this._panel.webview.onDidReceiveMessage(msgHandler);

    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
  }

  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   *
   * @param extensionUri The URI of the directory containing the extension
   * @param key A key for current instance identification
   * @param msgHandler A callback function to handle messages from webview
   */
  public static render(extensionUri: Uri, key: string, msgHandler: any) {
    if (key in Panel.panels) {
      // If the webview panel already exists reveal it
      Panel.panels[key]._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = window.createWebviewPanel(
        // Panel view type
        "show",
        // Panel title
        "vscode webview sample (React)",
        // The editor column the panel should be displayed in
        ViewColumn.One,
        // Extra panel configurations
        {
          // Enable JavaScript in the webview
          enableScripts: true,
          // Restrict the webview to only load resources from the `out` and `${key}/build` directories
          localResourceRoots: [
            Uri.joinPath(extensionUri, "out"),
            Uri.joinPath(extensionUri, `${key}/build`),
          ],
        }
      );

      Panel.panels[key] = new Panel(key, panel, extensionUri, msgHandler);
    }
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    delete Panel.panels[this._key];

    // Dispose of the current webview panel
    this._panel.dispose();

    // Dispose of all disposables (i.e. commands) for the current webview panel
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where references to the React webview build files
   * are created and inserted into the webview HTML.
   *
   * @param webview A reference to the extension webview
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview panel
   */
  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    // The CSS file from the React build output
    const stylesUri = getUri(webview, extensionUri, [this._key, "build", "assets", "index.css"]);
    // Codicon font file from the React build output
    const codiconFontUri = getUri(webview, extensionUri, [
      this._key,
      "build",
      "assets",
      "codicon.ttf",
    ]);
    // The JS file from the React build output
    const scriptUri = getUri(webview, extensionUri, [this._key, "build", "assets", "index.js"]);

    const nonce = getNonce();

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'nonce-${nonce}'; font-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>vscode webview sample (React)</title>
          <style nonce="${nonce}">
            @font-face {
              font-family: "codicon";
              font-display: block;
              src: url("${codiconFontUri}") format("truetype");
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }
}
