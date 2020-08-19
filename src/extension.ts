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
				enableScripts: true,
				localResourceRoots: [vscode.Uri.file(join(context.extensionPath, ...app.assetPaths))],

			}
		);

		panel.webview.onDidReceiveMessage(
			message => app.messageBus(message, vscode),
			undefined,
			context.subscriptions
		);
		try {
			const generator = new AngularGenerator(vscode, panel, context, app.assetPaths);
			const html = generator.getHtmlWithUris();
			vscode.window.showInformationMessage(html);
			panel.webview.html = html;
		}
		catch (e) {
			vscode.window.showErrorMessage(e.message);
		}
	});


	context.subscriptions.push(disposable);
}

export function deactivate() {
	app.deactivate();
}


