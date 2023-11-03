import * as vscode from 'vscode';
import { AngularGenerator, App, IOniExtensionApp } from '@onivoro/server-app-vscx';
import { join } from 'path';

let app: IOniExtensionApp;

export function activate(context: vscode.ExtensionContext) {
	app = new App();

	let disposable = vscode.commands.registerCommand(app.registeredCommand, () => {

		const panel = vscode.window.createWebviewPanel(
			app.viewType!,
			app.title,
			vscode.ViewColumn.One,
			{
				enableScripts: true
			}
		);

		panel.webview.onDidReceiveMessage(
			message => {
			  switch (message.command) {
				case 'cta':
				//   vscode.window.showErrorMessage(message.text);
				  vscode.window.showInformationMessage(message.text);
				  return;
			  }
			},
			undefined,
			context.subscriptions
		  );

		try {
			const html = `
			<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <base href="/"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>

	<body style="background-color: var(--vscode-editor-background)">
		<div id="ui-inventory" api-key="" api-id="ai_37afdc1726be47bd8f6c1e98b28797e4"
			primary="var(--vscode-button-background)"
			accent="var(--vscode-button-secondarybackground)"
			primary="var(--vscode-button-foreground)"
			accent="var(--vscode-button-secondaryforeground)"
			base="var(--vscode-editor-foreground)"
			base-muted="var(--vscode-editor-selectionforeground)"
			constrast="var(--vscode-editor-background)"
			constrast-muted="var(--vscode-editor-selectionbackground)"
		></div>

		<script src="https://envent-staging.s3.us-east-2.amazonaws.com/ui-inventory/init.js" type="module"></script>

		<script>
			const vscode = acquireVsCodeApi();
			// THIS IS THE ADAPTER SCRIPT FOR THIS PARTICULAR EMBEDDING OF THE EN-IPS APPLICATION (line 58)
			window.addEventListener('cta', (event) => vscode.postMessage({ command: 'cta', text: \`en IPS Item: \${event.detail.sku}\ - \${event.detail.model}\`}));
		</script>

  </body>
</html>
`;
			// vscode.window.showInformationMessage(html);
			panel.webview.html = html;
		}
		catch (e: any) {
			vscode.window.showErrorMessage(e.message);
		}
	});


	context.subscriptions.push(disposable);
}

export function deactivate() {
	app.deactivate();
}


