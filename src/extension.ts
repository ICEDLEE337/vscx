// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { searchHandler, openFolderHandler, cloneHandler, RepoManager, AngularGenerator } from '@onivoro/server-app-vscx';
import { join } from 'path';
// import { join } from 'path';

export function activate(context: vscode.ExtensionContext) {

	// const assets = GeneratorBase.enumerateAssets(process.cwd(), ['soundcheck', 'dist', 'soundcheck']);
	// const assets = AngularGenerator.enumerateAssets(context.extensionPath, assetPaths);
	// vscode.window.showInformationMessage(assets.sort().join(' '));

	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		vscode.window.showInformationMessage('we live fam');
		const assetPaths = ['soundcheck', 'dist', 'soundcheck'];

		const panel = vscode.window.createWebviewPanel(
			'gitgrok',
			'GitGrok',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [vscode.Uri.file(join(context.extensionPath, ...assetPaths))],

			}
		);

		panel.webview.onDidReceiveMessage(
			message => {
				const postMessage = (command: string, payload: any) => {
					panel.webview.postMessage({ command, payload });
				};
				const { command, payload } = message;
				switch (command) {
					case 'search':
						searchHandler(payload, vscode, postMessage);
						return;
					case 'openFile':
					case 'openFolder':
						openFolderHandler(payload, vscode);
						return;
					case 'clone':
						cloneHandler(payload, vscode);
						return;
					case 'info':
						vscode.window.showInformationMessage(payload);
						return;
					case 'warn':
						vscode.window.showWarningMessage(payload);
						return;
					case 'error':
						vscode.window.showErrorMessage(payload);
						return;
					case 'repoList':
						new RepoManager().getRepoList().then((repos: any) => {
							postMessage(command, repos);
						});
						return;
				}
			},
			undefined,
			context.subscriptions
		);
		try {
			const generator = new AngularGenerator(vscode, panel, context, assetPaths);
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

// this method is called when your extension is deactivated
export function deactivate() { }


