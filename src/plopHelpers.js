const fs = require("fs");
const path = require("path");
const vscode = require("vscode");


function getCurrentPath(dir) {
	if (dir && dir.fsPath) {
		const directory = dir.fsPath;
		return fs.statSync(directory).isDirectory ? directory : path.dirname(directory);
	} else {
		vscode.window.showErrorMessage("No directory selected");
	}
}

function getPlopPath(dir){
	if (dir && dir.fsPath) {
		for(let i=0; i< vscode.workspace.workspaceFolders.length; i++){
			const workspace = vscode.workspace.workspaceFolders[i].uri.fsPath;
			console.log("workspace",workspace)
			if(dir.fsPath.includes(workspace+"/")){
				console.log("Found",path.join(workspace,"plopfile.js"))
				return path.join(workspace,"plopfile.js");
			}
		}
	}
	return null;

}

async function getGenerator(dir) {
	const plopFile = getPlopPath(dir);
	const plop = require("node-plop")(plopFile);

	const generators = plop.getGeneratorList();
	if (generators && generators.length > 0) {
		const generator =
			generators.length === 1
				? generators[0]
				: await vscode.window.showQuickPick(
						generators.map(g => ({
							label: g.name,
							description: g.description
						})),
						{
							placeHolder: "Please choose a generator"
						}
				  );
		return plop.getGenerator(generator.label) || plop.getGenerator(generator.name);
	} else {
		vscode.window.showErrorMessage("No generators found");
	}
}

async function getGeneratorParameters(generator) {
	const parameters = {};
	if (generator) {
		for (let i = 0; i < generator.prompts.length; i++) {
			const { message, name } = generator.prompts[i];
			if (name !== "destpath") {
				parameters[name] = await vscode.window.showInputBox({
					placeHolder: name,
					prompt: message
				});
			}
		}
		return parameters;
	} else {
		vscode.window.showErrorMessage("The generator doesn't exist");
	}
}

module.exports = {
	getCurrentPath,
	getGenerator,
	getGeneratorParameters
};
