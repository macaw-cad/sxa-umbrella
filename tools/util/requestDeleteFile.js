const got = require('got');
require('colors');

const removeScriptPath = '/-/script/v2/master/RemoveMedia';

module.exports = async (destinationPath, context) => {
    const url = `${context.server}${removeScriptPath}?user=${context.user.login}&password=${context.user.password}&path=${destinationPath}&database=master`;
    try {
        await got.get(url, { rejectUnauthorized: false });
        console.log(`Removing of '${destinationPath}' was successful!`.green);
    } catch(error) {
        console.log(`Removing of '${destinationPath}' failed: ${error.message}`.red);
        if (error.response) {
            console.log(`Status code: ${error.response.statusCode}, status message: ${error.response.statusMessage}`.red);
        }
    };
}