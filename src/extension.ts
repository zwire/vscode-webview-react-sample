import { window, commands, ExtensionContext } from "vscode";
import { Panel } from "./panel";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(commands.registerCommand("webview-sample.show", () => {
    Panel.render(context.extensionUri, "app1", (e: any) => {
      console.log(e);
      window.showInformationMessage(e.name);
    });
  }));
}
