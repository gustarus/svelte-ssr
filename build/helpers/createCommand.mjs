import Command from './../models/Command';
import formatter from './../instances/formatter';
export default function createCommand(parts) {
    if (!parts.length) {
        throw new Error('Unable to ensure command: parts are invalid');
    }
    if (parts.length === 1 && parts[0] instanceof Command) {
        return parts[0];
    }
    return new Command({ formatter, parts });
}
;
