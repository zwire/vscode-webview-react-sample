import { commands, ExtensionContext } from "vscode";
import { MainPanel } from "./panels/MainPanel";

export function activate(context: ExtensionContext) {
  // Create the show command
  const showCommand = commands.registerCommand("vscode-webview-react-sample.show", () => {
    MainPanel.render(context.extensionUri);
  });

  // Add command to the extension context
  context.subscriptions.push(showCommand);
}
