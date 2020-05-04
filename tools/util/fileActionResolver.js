const path = require('path');
const findUp = require('find-up');
const colors = require('colors');
const deleteFile = require('./requestDeleteFile');
const changeFile = require('./requestChangeFile');
const changeScriban =  require('./requestChangeScriban');

const mediaLibraryDestinationPath = (filePath) => path.relative(path.join(global.rootPath, 'Media Library'), filePath).replace(/\\/g,'/');

module.exports = (fileEvent, filePath, context) => {
    if (filePath.indexOf('.scriban') > -1 || filePath.indexOf('metadata.json') > -1) {
        const renderingVariantsMetadataPath = findUp.sync('metadata.json', { cwd: path.dirname(filePath) });
        if (!renderingVariantsMetadataPath) {
            console.log(`Scriban file event '${fileEvent}' for '${filePath}' failed because a parent folder should contain the file 'metadata.json' specifying the SXA site to upload to in the format {"siteId":"{F5AE341E-0C2E-44F8-8AD6-765DC311F57E}","database":"master"}`.red);
        } else {
            const renderingVariantsRootPath = path.dirname(renderingVariantsMetadataPath);
            context.limiter.schedule(() => changeScriban(renderingVariantsRootPath, filePath, context));
        }

    } else if (fileEvent == 'change' || fileEvent == 'add') {
        context.limiter.schedule(() => changeFile(filePath, mediaLibraryDestinationPath(filePath), context));
    } else if (fileEvent == 'unlink') {
        context.limiter.schedule(() => deleteFile(mediaLibraryDestinationPath(filePath), context));
    }
};