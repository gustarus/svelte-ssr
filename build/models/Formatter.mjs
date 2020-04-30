import Component from '../base/Component';
export default class Formatter extends Component {
    convertObjectPropertiesFromOptionToCamel(source) {
        return this.convertObjectPropertiesWithFormatter(source, this.convertOptionToCamel);
    }
    convertObjectPropertiesFromCamelToOption(source) {
        return this.convertObjectPropertiesWithFormatter(source, this.convertCamelToOption);
    }
    convertOptionToCamel(name) {
        return name.replace(/-([\w])/, (match, symbol) => {
            return symbol.toUpperCase();
        });
    }
    convertCamelToOption(name) {
        return name.replace(/(\w)([A-Z])/g, (match, head, symbol) => {
            return `${head}-${symbol.toLowerCase()}`;
        });
    }
    convertObjectPropertiesWithFormatter(source, nameFormatter) {
        const result = source instanceof Array ? [] : {};
        for (const name in source) {
            const nameFormatted = nameFormatter(name);
            if (source[name] && typeof source[name] === 'object') {
                result[nameFormatted] = this.convertObjectPropertiesWithFormatter(source[name], nameFormatter);
            }
            else {
                result[nameFormatted] = source[name];
            }
        }
        return result;
    }
}
;
