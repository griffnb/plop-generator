const vscode = require("vscode");
const { getGenerator, getGeneratorParameters, getCurrentPath } = require("./plopHelpers");

function activate(context) {
	let disposable = vscode.commands.registerCommand("plopgenerator.generate", async function(dir) {
		const currentPath = getCurrentPath(dir);
		const generator = await getGenerator(dir);
		const parameters = await getGeneratorParameters(generator);
		parameters["destpath"]= currentPath
		console.log("parameters", parameters,currentPath);
		try {
			await generator.runActions(parameters);
			vscode.window.showInformationMessage(`${generator.name} generated successfully`);
		} catch (error) {
			vscode.window.showErrorMessage(error);
		}
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
};
