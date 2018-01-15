/**
 * https://code.visualstudio.com/docs/editor/tasks#vscode  Variable substitution
 *
 * 原本想参考 上面的占位替换处理方式，但是vscode 的源码中是在 ConfigurationResolverService处理的
 * 但是无法通过vscode的方式获取到，只能自己编写代码实现；（vscode的源码 机制原理看不懂）
 *
 * 其他参考 https://github.com/formulahendry/vscode-code-runner/blob/master/src/codeManager.ts
 */
const vscode = require('vscode');
const path = require('path');
const VARMAP ={
	'file':filePath,
	'filepath':filePath,
	'filebasename':fileBaseName,
	'filedirname':fileDirname,
	'filebasenamenoextension':fileBasenameNoExtension,
	'fileextname':fileExtname
}

function variableSubstitutionResolver (value){
	let regexp = /\$\{(.*?)\}/g;
	const originalValue = value;
	const resolvedString = value.replace(regexp, function (match, name) {
		name = name.toLowerCase();
		let fun = VARMAP[name];
		return fun.apply(this,[match,name])
	});
	return resolvedString;
}
function fileExtname(match,name){
	return path.extname(filePath(match,name));
}
function fileDirname(match,name){
	return path.dirname(filePath(match,name));
}
function fileBasenameNoExtension(match,name){
	const basename = fileBaseName(match,name);
	return basename.slice(0, basename.length - path.extname(basename).length);
}
function fileBaseName(match,name){
	return path.basename(filePath(match,name))
}

function filePath(match,name){
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		return editor.document.uri.fsPath
	}
	return ''
}

module.exports = { variableSubstitutionResolver :variableSubstitutionResolver}