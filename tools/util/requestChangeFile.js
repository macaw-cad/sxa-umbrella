const fs = require('fs');
const got = require('got');
const FormData = require('form-data');
require('colors');

const uploadScriptPath = '/sitecore modules/PowerShell/Services/RemoteScriptCall.ashx';

module.exports = async (filePath, destinationPath, context) => {
    const url = `${context.server}${uploadScriptPath}?user=${context.user.login}&password=${context.user.password}&script=${context.destinationPath}&sc_database=master&apiVersion=media&scriptDb=master`;
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    try {
        await got.post(url, { rejectUnauthorized: false, body: form });
        console.log(`Upload of '${destinationPath}' was successful!`.green);
    } catch (error) {
        console.log(`Upload of '${destinationPath}' failed: ${error.message}`.red);
        if (error.response) {
            console.log(`Status code: ${error.response.statusCode}, status message: ${error.response.statusMessage}`.red);
        }
    }
}