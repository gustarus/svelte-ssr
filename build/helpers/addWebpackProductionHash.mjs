export default function addWebpackProductionHash(template, isProductionMode = false) {
    return isProductionMode ? template.replace('[name]', '[name].[hash]') : template;
}
