export default function addWebpackProductionHash(template: string, isProductionMode = false) {
  return isProductionMode ? template.replace('[name]', '[name].[hash]') : template;
}
