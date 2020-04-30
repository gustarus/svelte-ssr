import colors from 'colors/safe';
export default function displayCommandGreetings(cmd) {
    console.log(`[${colors.blue(cmd.name())}] ${cmd.description()}`);
}
;
