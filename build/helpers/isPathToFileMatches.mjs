export default function isPathToFileMatches(pathToFile, template) {
    if (typeof template === 'string') {
        return pathToFile.includes(template);
    }
    else if (typeof template === 'object' && template instanceof Array) {
        return !!template.find((candidate) => pathToFile.includes(candidate));
    }
    else if (typeof template === 'object' && template instanceof RegExp) {
        return template.test(pathToFile);
    }
    else {
        throw new Error('Unsupported type of \'template\' option passed: should be a string or a regular expression');
    }
}
