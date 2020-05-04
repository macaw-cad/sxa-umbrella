const fs = require('fs');
const path = require('path');
const got = require('got');
const FormData = require('form-data');
require('colors');

const updateScribanPath = '/-/script/v2/master/ChangeScriban';

const scribanFileFilter = name => /(\.(scriban)$)/i.test(name);

const getScribanFiles = dir => {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getScribanFiles(file));
        } else {
            if (scribanFileFilter(file)) {
                results.push(file);
            }
        }
    });
    return results;
}

const getPayload = renderingVariantsRootPath => {
    var streams = []
    getScribanFiles(renderingVariantsRootPath).forEach((scribanFile) => {
        var content = fs.readFileSync(scribanFile, 'utf8');
        if (content.replace(/\s/g, '').length < 1) {
            throw new Error({ message: `'${filePath}' is empty` });
        }
        var b = Buffer.from(content, 'utf-8');
        var obj = {
            path: scribanFile.replace(/\\/g, '/'),
            content: b.toString('base64')
        };
        streams.push(obj);
    });
    return streams;
}

module.exports = async (renderingVariantsRootPath, filePath, context) => {
    const relativeRenderingVariantsRootPath = path.relative(global.rootPath, renderingVariantsRootPath).replace(/\\/g,'/');
    try {
        if (!relativeRenderingVariantsRootPath.endsWith('/-/scriban')) {
            throw new Error({ message: `'metadata.json', rendering variants and .scriban files MUST be in a folder '.../-/scriban'` });
        }
        const url = `${context.server}${updateScribanPath}?user=${context.user.login}&password=${context.user.password}&path=${filePath}`;
        const form = new FormData();
        form.append('streams', JSON.stringify(getPayload(renderingVariantsRootPath)));
        form.append('metadata', JSON.stringify(JSON.parse(fs.readFileSync(path.resolve(renderingVariantsRootPath, 'metadata.json')))));

        await got.post(url, { rejectUnauthorized: false, body: form });
        console.log(`Scriban import was successful for Scriban files in the folder '${relativeRenderingVariantsRootPath}'!`.green);
    } catch(error) {
        console.log(`Scriban import failed for Scriban files in the folder '${relativeRenderingVariantsRootPath}': ${error.message}`.red);
        if (error.response) {
            console.log(`Status code: ${error.response.statusCode}, status message: ${error.response.statusMessage}`.red);
        }
    }
}