import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";
import { vscode } from "../utilities/vscode";

export function CheckboxDemo() {
  const handle = (e: any, name: string) => {
    vscode.postMessage({ name, type: "checkbox_change", checked: e.target.checked });
  };
  return (
    <section className="component-container">
      <h2>Checkbox</h2>
      <section className="component-example">
        <p>Default Checkbox</p>
        <VSCodeCheckbox onChange={e => handle(e, 'default_checkbox')}>Label</VSCodeCheckbox>
      </section>
      <section className="component-example">
        <p>With Checked</p>
        <VSCodeCheckbox checked onChange={e => handle(e, 'with_checked_checkbox')}>Label</VSCodeCheckbox>
      </section>
      <section className="component-example">
        <p>With Indeterminate</p>
        <VSCodeCheckbox indeterminate={true} onChange={e => handle(e, 'with_indeterminate_checkbox')}>Label</VSCodeCheckbox>
      </section>
      <section className="component-example">
        <p>With Disabled</p>
        <VSCodeCheckbox disabled>Label</VSCodeCheckbox>
      </section>
      <section className="component-example">
        <p>With Readonly</p>
        <VSCodeCheckbox readOnly>Label</VSCodeCheckbox>
      </section>
    </section>
  );
}
