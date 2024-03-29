<div align="center">
<h1>SXA Umbrella</h1>
<p>
SXA Umbrella provides the project structure and tools to optimize the front-end team development workflow in any Sitecore SXA project. 
</p>
</div>

## Quickstart
To get you up and running as quick as possible to test out the SXA Umbrella tooling we make the following assumptions to "connect" to the provided code structure. Note that the tooling can handle ANY required structure:
- **tenant**: `DigitalMarketingPlatform` (use your own tenant name)
- **site**: `ComponentLibrary` (site for showcasing components, can be used as a [shared site](https://doc.sitecore.com/developers/sxa/93/sitecore-experience-accelerator/en/recommendations--sharing-content.html) for the tenant)
- Modules will be organized under a folder named `DMP` (abbreviation for Digital Marketing Platform) to prevent collision with the out-of-the-box `Experience Accelerator` folder

Get up and running with SXA Umbrella given a Sitecore 9.3 or higher environment with SXA enabled:

### Enable the Sitecore "Creative Exchange" end-points
**Why?** SXA Umbrella uses, just like the SXA CLI tooling by Sitecore, the Creative Exchange endpoints to sync changes to the Sitecore server.

**How:** On the Sitecore server:
-  Open `<PathToInstance/Website>/App_Config/Include/z.Feature.Overrides` and remove `.disabled` from the `z.SPE.Sync.Enabler.Gulp.config.disabled` file (on my server located at `C:\inetpub\wwwroot\UmbrellaCorpsc.dev.local`)

### Enable PowerShell remoting for your local dev machine
**Why?** Using PowerShell Remoting the SXS Umbrella tooling can add additional powerful functionality like validation and testing.

**How:** On the Sitecore server: (adapted from: [ShieldsDown.config for Sitecore PowerShell developers](https://alan-null.github.io/2017/01/spe-dev-config))

- Create folder `<PathToInstance/Website>/App_Config/Include/zzz`
- Create file `<PathToInstance/Website>/App_Config/Include/zzz/zzz_spe_shieldsdown.config`
- Copy the content described in the above linked post to this file:
```xml
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/">
  <sitecore>
    <powershell>
      <services>
        <remoting>
          <patch:attribute name="enabled">true</patch:attribute>
          <authorization>
            <add Permission="Allow" IdentityType="User" Identity="sitecore\admin" />
          </authorization>
        </remoting>
        <restfulv2>
          <patch:attribute name="enabled">true</patch:attribute>
        </restfulv2>
      </services>
      <userAccountControl>
        <gates>
          <gate name="ISE">
              <patch:delete/>
          </gate>
          <gate name="Console">
              <patch:delete/>
          </gate>
          <gate name="ItemSave">
              <patch:delete/>
          </gate>
          <gate name="ISE" token="Permissive"/>
          <gate name="Console" token="Permissive"/>
          <gate name="ItemSave" token="Permissive"/>
        </gates>
        <tokens>
          <token name="Permissive" expiration="00:00:00" elevationAction="Allow"/>
        </tokens>
      </userAccountControl>
    </powershell>
  </sitecore>
</configuration>
```

### Configure Sitecore to work with SXA Umbrella
**Why?**  SXA Umbrella provides pre-configured configuration and code examples. Get familiar with these first, before applying it to your situation.

**How:**
- Install the Grid package `DMP Bootstrap 4 Grid-1.0.zip` as show-cased by [Barend Emmerzaal](https://barendemmerzaal.com/) in the video [Custom Sitecore SXA Bootstrap Grid implementation](https://www.youtube.com/watch?v=vMbr4OdJ2Xg) 
- Create a tenant `DigitalMarketingPlatform` 
- Create a site `ComponentLibrary` with the virtual folder `/ComponentLibrary`, the default modules selected, `Create a new theme` selected with `new theme name` set to `ComponentLibrary`, and grid `DMP Bootstrap 4`
- Create Variant Definition `/sitecore/content/DigitalMarketingPlatform/ComponentLibrary/Presentation/Rendering Variants/Page Content/Scriban Content`

### Get the code and make the required configuration changes
**Why?** We need a copy of the SXA Umbrella code, it has all batteries included, and need to change the config files to apply to your situation.

**How:**
- Navigate to https://github.com/macaw-interactive/sxa-umbrella, and unzip the downloadable zip file into a convenient folder for your front-end - - Update the `config/config.json` file to reflect your Sitecore server and credentials
- Configure the `metadata.json` file with the GUID of the site to deploy to (select `/sitecore/content/DigitalMarketingPlatform/ComponentLibrary` and copy the `Item ID`)
- Run `npm install` (*node.js and npm should be already installed*)
- Run `npm run build-deploy-watch` to kickstart the whole process

[TOC]

## Introduction
The roots of SXA Umbrella lie in the [SXACLI-enhancements](https://github.com/macaw-interactive/SXACLI-enhancements) project where we embraced the SXA CLI tooling by Sitecore that provided a developer-first approach for our front-end developers in SXA development. Because the out-of-the-box SXA CLI functionality was insufficient for our development workflow we extended it with additional functionality to support the team development cycle. The [SXACLI-enhancements](https://github.com/macaw-interactive/SXACLI-enhancements) project was built on top of the code-base of SXA CLI and was limited to handle a single SXA theme and the creation of rendering variants using Scriban for a single SXA site. This approach was too limited for our SXA projects, so we decided to do a complete rewrite of the code-base to support the creation of multiple **themes**, **base themes**, **theme extensions**, **grids**, **rendering variant** collections for multiple sites (for example a shared site and multiple other sites), and project artifacts.

## SXA Umbrella enhancements over standard SXA CLI
The out-of-the-box SXA CLI is a bit limited. It only supports a single gulp task to sync all project changes to Sitecore. So only if you change something it will be deployed to Sitecore. in SXA Umbrella we provide a huge set of enhanced features:

### Support for a team development cycle
    
A Sitecore SXA project is team-work, so the tooling must support a typical team development cycle:
- Pull the latest code from source control
- Build all artifacts and do a full deploy to a personal Sitecore instance
- Start watch node for incremental deploy of changed artifacts to Sitecore
- Commit changes to source-control

### Using modern front-end tools

Built from the ground up using modern front-end tooling, but standing on the shoulders of giants: using the concepts of the SXA CLI, and the end-points provided by SXA Creative Exchange to sync changes directly to your Sitecore environment.
- SXA Umbrella uses the latest front-end tools like [Gulp 4](https://gulpjs.com/) and [Webpack 4](https://webpack.js.org/)
- SXA Umbrella supports JavaScript, [EcmaScript (ES6+)](http://es6-features.org/), and [TypeScript](https://www.typescriptlang.org/)

### Webpack compatible theme SASS
SXA Umbrella uses Webpack for the creation of JavaScript and CSS bundles. The default Sitecore theme code as delivered in the NPM module `@sxa/Theme`, and copied into the project by SXA CLI, is not Webpack compatible due to non-standard SASS language constructs used in the code-base (wildcard imports). SXA Umbrella provides an NPM package `sxa-defaulttheme` in the `local_modules` where the issues are fixed and the default provided theme is turned into a Webpack compatible SASS code-base.
  
### Webpack-based scripts transpilation
SXA Umbrella provides Webpack-based transpilation of JavaScript, ES6 and TypeScript from the `src` folder into a single `scripts\pre-optimized-min.js` file to be deployed to Sitecore:
- Support for embedded sourcemaps in *development* mode for full debugging support in the browser using the source files
  ![Code debugging](docs/code_debugging.png)
- Optimized, uglified and minified bundle with no sourcemaps in *production* mode
- Bundle analyzer output in the `stats` folder in *production* mode

### Webpack-based styles transpilation
SXA Umbrella provides Webpack-based transpilation of SASS from the `src` folder and (through imports) from the  `sxa-defaulttheme` node module into a single `scripts\pre-optimized-min.css` file to be deployed to Sitecore
- Support for embedded sourcemaps in *development* mode for full traceability of the origin of styles
![Styling traceability](docs/styling_traceability.png)   
- Optimized, minified bundle with no sourcemaps in *production* mode

### Configuration for TypeScript transpilation
[TypeScript - JavaScript that scales](https://www.typescriptlang.org/). The tag-line on the TypeScript site says it all. When working in a team (even a team of one) type-checking is an invaluable tool to prevent issues that can be prevented easily by a computer. SXA Umbrella providing an NPM package `sxa-styles` in the `local_modules` with TypeScript types for the XA library to build Sitecore SXA compatible components the SXA way.

### Full configuration for ES6+ transpilation
For the JavaScript developers: use the latest ES6 language features that get transpiled into the rusty JavaScript 5 that all browsers understand.

### Minimal configuration
The configuration for SXA Umbrella is as minimal as possible due to convention over configuration where possible. The folder structure provides information about what should be deployed where. We only need minimal configuration:
- The target Sitecore server and credentials for deployment (`config/config.json`)
- Per rendering variant collection the GUID of the site to deploy to (`Rendering Variants/**/metadata.json`)
- The files to include/exclude for cleaning, sync and distribution (`config/gulp.config.js`) 
- Per theme (base theme, theme, extension theme, grid) we need an entry in the Webpack configuration (`config/webpack.config.js`)

### Validation of source code against Sitecore server
Validate the structure of your code for Rendering Variants against the Sitecore server. Give warnings if unexpected files or file structures are found, and when required items within Sitecore are missing.

### Full support for debugging of the tools
The tools provided by SXA Umbrella is a starting point for your project. You probably want to extend the NPM scripts, the Gulp tasks and the Webpack configuration. SXA Umbrella provides all the required configurations to debug the tooling in Visual Studio Code by providing a `launch.json` file in the `.vscode` folder with the following debug configurations:

- Gulp: fullDeploy
- Gulp: Watch
- PowerShell: Validate
- PowerShell: Test
- Webpack: development
- Webpack: production

## SXA Umbrella folder structure
The philosophy of SXA Umbrella is to be opinionated about the structure in the front-end folder. The SXA Umbrella front-end folder contains two important folders for your front-end work:

- **Media Library** - for all themes, grids and project artifacts related stuff
- **Rendering Variants** - for multiple rendering variant collections (one collection per site)

## Media Library
The `Media Library` folder follows the structure of Sitecore. Add subfolders for **Extension Themes**, **Base Themes** and **Themes** as required. **Grids** should live is the `Feature` folder (e.g. `Feature/DMP/DMP Bootstrap 4`).

Within `Themes` you can directly create a theme folder (e.g. `Themes/<Theme>`), or organize themes in a `<Tenant>/<Site>/<Theme>` structure as Sitecore does when you select to create a new theme on the creation of a new site.

```
Media Library
├── Base Themes
│   └── .gitkeep
├── Extension Themes
│   └── .gitkeep
├── Feature
│   └── DMP Bootstrap 4
│       └── DMP Bootstrap 4 Grid Theme
│           └── src
│               ├── grid.scss
│               └── grid.ts
├── Project
│   └── .gitkeep
└── Themes
    └── DigitalMarketingPlatform
        └── ComponentLibrary
            └── ComponentLibrary
                ├── fonts
                │   ├── fontawesome
                │   │   ├── fontawesome-webfont.eot
                │   │   ├── fontawesome-webfont.svg
                │   │   ├── fontawesome-webfont.ttf
                │   │   ├── fontawesome-webfont.woff
                │   │   ├── fontawesome-webfont.woff2
                │   │   └── FontAwesome.otf
                │   └── opensans
                │       ├── opensans-bold.woff
                │       ├── opensans-light.woff
                │       ├── opensans-semibold.woff
                │       └── opensans.woff
                ├── images
                │   ├── arrow-left.png
                │   ├── arrow-right.png
                │   ├── overlay-bg.png
                │   ├── player.png
                │   ├── radiobox.png
                │   ├── sprite-flag.png
                │   └── square_bg.png
                └── src
                    ├── components
                    │   └── xaclock
                    │       ├── xaclock.scss
                    │       └── xaclock.ts
                    ├── theme
                    │   └── sass
                    │       ├── component-accordion.scss
                    │       └── main.scss
                    ├── index.scss
                    ├── index.ts
                    ├── jqueryNoConflict.ts
                    └── theme.scss
```

## Rendering Variants

The `Rendering Variants` folder can contain one or more sub-folders for rendering variant collections. Each collection belongs to an SXA site, and will be deployed to the folder `<tenant>/<site>/Presentation/Rendering Variants`. The folder needs to have sub-folders `-/scriban` because the Scriban update end-point in Sitecore requires this in the file path.

A sample rendering variants collection is provided for the site `ComponentLibrary`:

```
Rendering Variants
└── ComponentLibrary
    └── -
        └── scriban
            ├── Page Content
            │   └── Scriban Content
            │       ├── item
            │       │   └── subitem.scriban
            │       └── item.scriban
            └── metadata.json
```

The `metadata.json` file configures the `siteId` of the site where the rendering variants are deployed to, e.g.:

```json
{
    "siteId": "{384B74E8-3DA0-472F-9F4B-F0E851B99EE0}",
    "database": "master"
}
```

## NPM Scripts to support team development workflow
The following NPM scripts are provided for the optimal team development workflow:

### build-deploy-watch
Execute `npm run build-deploy-watch` to build everything, deploy to Sitecore and go into watch mode. This is the first thing to do after a pull request to get the latest changes made by the team, and make sure that these changes are reflected on the Sitecore server used for your daily development work. The JavaScript and CSS bundles are built in *development* mode and include sourcemaps for optimal support for debugging.

Make sure that the Visual Studio solution containing possible Unicorn items to be synchronized is built and deployed first (if applicable).

### watch
Execute `npm run watch` to go directly into watch mode. You can do this if you start your work without getting the changes made by your team first. You get a quick start of the day and can continue with your work. The JavaScript and CSS bundles are built in *development* mode and include sourcemaps for optimal support for debugging.

### build:dist
Execute `npm run build:dist` when you want to create a *production* build of your code to the `dist` folder. This command is normally executed on a build server.

The JavaScript bundles are uglified and minified and do not contain sourcemaps. The CSS bundles are minified and prepared for multiple browser support and do not contains sourcemaps.

Bundle analyzer output is written to the `stats` folder to give you more insights in the size of the different modules included in your bundle:

![Bundle Analyzer](docs/BundleAnalyzer.png)

Note that during this build the resulting artifacts for themes and grids will end-up in the `dist` folder located in the root of the front-end folder. These artifacts should be part of the deployment package for Sitecore together with a custom script to deploy the files as items in Sitecore. Preferably don't deploy these files using Unicorn, because the build of JavaScript and CSS bundles should be executed on a build server, not on a developer his local machine.

The Scriban rendering variant items can be deployed using Unicorn because these files need to be deployed to Sitecore "as is". For Scriban files no build process is needed.

### validate
*Note: PowerShell Remoting must be enabled.*

Execute `npm run validate` to run a powerful validation of the current front-end code-base against your Sitecore environment. The validation uses PowerShell remoting to compare the state of the code against available Sitecore items. The following validations are currently executed:

#### Rendering Variants
The `Rendering Variants` folder can contain rendering variants with Scriban files for multiple sites. We call the set of rendering variants for sites *rendering variant collections*. Each collection lives in a folder with the same name as the site it will be deployed to. The following validations are executed:

- The `Rendering Variants` folder contains no other files than the `metadata.json` and `*.scriban` files
- The `SiteId` as specified in the `manifest.json` exists as an item in Sitecore with the same name as the site folder, and the template of the item is 'Site'
- A rendering variants collection is located in a folder `<siteName>/-/scriban`
- All renderings exist with the same name in Sitecore, and the template of the corresponding items is `Variants`
- All rendering variants in the rendering folder exist  with the same name in Sitecore, and the template of the corresponding items is `Variant Definition`

### test
*Note: PowerShell Remoting must be enabled.*

Execute `npm run test` to execute a set of integration tests to validate the good working of the code. This command is for developors and contributors.

## Other NPM scripts

Note that there are many more "internal" npm scripts available in the `package.json`, but those are not needed in your day-to-day work.

## Writing components the SXA way

There is an example of a TypeScript component written the SXA way at `sources/components/xaclock`.

TypeScript types for the SXA way of writing components is available at `sxa-types/xa`.

*In the future more information will be added for building components the SXA way*
   
## Creating a custom theme

We tried to minimize the modification of the default provided theme code. A copy of the theme code provided by Sitecore lives in the local module `local_modules/sxa-defaulttheme`. This code is based on the code provided in the NPM package `@sxa/Theme` and provides the SASS styling for all provided components. The SASS code is copied and modified by a gulp task as provided in the `sxa-defaulttheme` package. The SASS code can be regenerated if required, for example when an updated NPM package with fixes in the theme code comes out. The theme code is made compatible for consumption by Webpack.

Our philosophy is to not touch the SASS code at all as provided in the `sxa-defaulttheme` package, but create overrides in the theme folder.

In the provided example theme `Media Library\Themes\DigitalMarketingPlatform\ComponentLibrary\ComponentLibrary` we did execute the following steps:

- The `images` and `fonts` are copied over from the `sxa-defaulttheme` local module
- The root of the SASS is in the file `<theme>/src/index.scss`, this file is included by `<theme>/src/index.ts` and the extraction of the CSS bundle is handled by Webpack
- Overrides on the provided SASS for the theme are done in the file `<theme>/src/theme.scss`. In this way it is easy to create multiple themes from the same default SASS code-base by just providing different `theme.sass` files in the transpilation
- The file `<theme>/index.ts` is the entry point of all code (TypeScript, ES6, JavaScript, SASS)

For each theme or grid an entry must be provided in the `config/webpack.config.js` file. We currently have the following configuration for the `Componentlibrary` theme and the `DMP Bootstrap 4` grid:

```javascript
const customEntryOutputConfigurations = {
	grid_DMP_Bootstrap_4: {
		entry: {
			'pre-optimized-min': ['../Media Library/Feature/DMP Bootstrap 4/DMP Bootstrap 4 Grid Theme/src/grid.ts']
		},
		output: {
			path: path.resolve(__dirname, '../Media Library/Feature/DMP Bootstrap 4/DMP Bootstrap 4 Grid Theme'),
			library: 'grid_DMP_Bootstrap_4',
			libraryTarget: 'umd',
			filename: 'scripts/[name].js'
		}
	},

	theme_ComponentLibrary: {
		entry: {
			'pre-optimized-min': [ '../Media Library/Themes/DigitalMarketingPlatform/ComponentLibrary/ComponentLibrary/src/index.ts' ]
		},
		output: {
			path: path.resolve(__dirname, '../Media Library/Themes/DigitalMarketingPlatform/ComponentLibrary/ComponentLibrary'),
			library: 'theme_ComponentLibrary',
			libraryTarget: 'umd',
			filename: 'scripts/[name].js'
		}
	}
};
```

This configuration can be modified and extended for additional themes and grids.

# Creating a custom grid
The provided SXA Umbrella configuration assumes the use of **Bootstrap 4** as the basis for new grids, but this can be any grid as is suitable for your project. The SASS bootstrap 4 code is added as an NPM package and a new variation of the **Bootstrap 4** grid can be easily created by referencing the SASS grid files from the NPM package.

The code for an example grid setup `DMP Bootstrap 4``` is provided in the SXA Umbrella code-base. This grid setup works perfectly in combination with the Bootstrap SXA Grid provided by my colleague [Barend Emmerzaal](https://barendemmerzaal.com/) as explained in the video [Custom Sitecore SXA Bootstrap Grid implementation](https://www.youtube.com/watch?v=vMbr4OdJ2Xg). The grid installation package is available in the [download](https://barendemmerzaal.com/downloads.html) section of his website.

The code structure for the grid is as follows:

```
Media Library
├── Feature
    └── DMP Bootstrap 4
        └── DMP Bootstrap 4 Grid Theme
            └── src
                ├── grid.scss
                └── grid.ts

```

The `grid.ts` file is necessary to build the grid bundle. it includes the `grid.scss` file:

```javascript
import "./grid.scss";
```

The `grid.scss` file is used to provide SASS variable overrides on the default Bootstrap 4 grid:

```scss
// overwrites
$grid-gutter-width: 80px !default;

@import "~bootstrap/scss/functions.scss";
@import "~bootstrap/scss/mixins.scss";
@import "~bootstrap/scss/variables.scss";

@import "~bootstrap/scss/grid.scss";
```

Note that overrides are defined **above** the imports using [`!default`](https://thoughtbot.com/blog/sass-default). This means that when defined the value of the variable can't be overwritten anymore.

Note that a file `pre-optimized-min.css` is written to the folder `Media Library\Feature\DMP Bootstrap 4\DMP Bootstrap 4 Grid Theme\styles`, which already contains the file `bootstrap-gridmin.css` provided in the `DMP Bootstrap 4` package. The `pre-optimized-min.css` will have precedence over this file, but the file can be removed as well. 

## SXA Umbrella on Steroids - remoting!

In the quickstart section the steps to enable PowerShell Remoting are described, so more powerful tooling is possible. Currently, three tools are available based on PowerShell remoting:

- `.\tools\get-itemfields.ps1` - to get the internal field names of a Sitecore item
- `npm run validate` - validate the configuration of Sitecore against the code-base
  - Currently only the rendering variants are validated
- `npm run test` - execute integration tests for SXA Umbrella
  - Currently only the build/deploy of the rendering variants are tested 

### get-itemfields.ps1

When writing Scriban files it is handy to know the internal names of the fields of a Sitecore item.
Execute the script:

`.\tools\get-itemfields.ps1 <Sitecore-item-path>` 

to get information of the internal names of the fields of an item.

## Tips & tricks

In this section some tips & tricks to optimize your development with SXA Umbrella.

### Maintain your .gitignore file

Exclude the `scripts` and `styles` folders from your themes. The first version of SXA Umbrella tried to exclude these folders with a wildcard pattern, but this also excluded these folders from the `src` folder in themes. This broke legacy themes, where all theme SASS code is copied to the `src/theme` folder including a `styles` folder which was erroneously excluded. Specify the complete folder paths in your `.gitignore` file. A good Visual Studio Code extension to help you with this is [gitignore](https://marketplace.visualstudio.com/items?itemName=michelemelluso.gitignore). With this package installed you can right-click on the folders to exclude and add it to the `.gitignore` file.

### Scriban items with sub-items

A Sitecore Scriban item can have a Scriban sub-item. To structure this you can do this as follows:

```
MyRenderingVariant
├── item
│   └── subitem.scriban
└── item.scriban
```

# Frequently asked questions

### I have an existing, heavily modified theme - can I use SXA Umbrella?

Absolutely! As an example of a project where this is the case I created the project [
SXA.Styleguide.Frontend.SXAUmbrella](https://github.com/macaw-interactive/SXA.Styleguide.Frontend.SXAUmbrella/blob/master/README.md), a rewrite of the front-end of the great [SXA Styleguide](https://www.markvanaalst.com/blog/sxa-styleguide/introducing-the-sxa-styleguide/) project by [Mark van Aalst](https://www.markvanaalst.com/). The repository contains a folder [legacy](https://github.com/macaw-interactive/SXA.Styleguide.Frontend.SXAUmbrella/tree/master/legacy) with the tooling to convert the SASS of a 'legacy' theme into a theme with the SASS code fixed for consumption by Webpack.

1. create a folder `legacy` in your project
2. copy you legacy theme SASS into the folder `theme/sass`
3. create the theme folder at the correct location in the `Media Library` folder
4. configure this folder in the variable `destinationTheme` in the file `package.json`
5. execute `npm install` in the `legacy` folder
6. execute `npm run fix` in the legacy folder
7. create the files [index.ts](https://github.com/macaw-interactive/SXA.Styleguide.Frontend.SXAUmbrella/blob/master/Media%20Library/Themes/Sitecore/Styleguide/Styleguide/src/index.ts) and [index.scss](https://github.com/macaw-interactive/SXA.Styleguide.Frontend.SXAUmbrella/blob/master/Media%20Library/Themes/Sitecore/Styleguide/Styleguide/src/index.scss) as suitable for your specific theme

### Why is the `config/config.json` file a JSON file and not JavaScript?

It should be easy for tools to read the configuration settings, also for non-JavaScript tools like PowerShell scripts.

### Why do I need to add an entry per theme in the Webpack configuration file?

The file `config\webpack.config.js` contains multiple output configurations as shown in the [multi-compiler](https://github.com/webpack/webpack/tree/master/examples/multi-compiler) example. We could easily automate the generation of the required configurations if all themes needed to be compiled alike, but we see potential cases where a different configuration is required. A good example is when a theme contains additions output configurations for a React bundle. 

### Why does a rendering variants need to be in a folder `-/scriban`?

The used end-point for uploading Scriban files checks the Scriban file paths for the occurrence of the string `-/scriban` to determine the relative path within the folder `<sites>/Presentation/Rendering Variants` folder to deploy to.

### Can the front-end folder be partitioned into multiple deployment packages?

When you are working with multiple teams on separate solutions for a Sitecore environment that should be deployed separately, there is no reason why you can't have multiple solutions each with a front-end folder containing the SXA Umbrella setup.

### Can the `sxa-defaulttheme` be recreated?

The `sxa-defaulttheme` local module contains a Gulp task `create-fixed-defaulttheme-sass-for-webpack` that can be executed by the NPM script `build` to copy and fix the SASS code for the default theme as provided by Sitecore in the npm package @sca/Theme. This task resolves wildcard imports to the actual imports and fixes import paths to fix the SASS for consumption by Webpack. Regeneration of the fixed SASS code is required in the following cases:

- Sitecore provides an updated version of the default theme by updating the @sxa/theme NPM package (currently version 1.0.1)
- Modifications must be made to the flags sprite (resulting image `sprite-flag.png` is copied over to the `ComponentLibrary` theme)

### Can SXA Umbrella be used on older versions of Sitecore SXA?

Although Sitecore SXA is developed with Sitecore 9.3 SXA and up in mind, there is no reason why (part of) the tooling would not work on older versions of Sitecore SXA. SXA Umbrella uses the endpoints of Creative Exchange Live which were available far before Sitecore 9.3. The Rendering variants using Scriban files will **not** work on older versions of Sitecore, because this feature was introduced in Sitecore 9.3 SXA.

### Scriban import failed for Scriban files in the folder 'xyz': filePath is not defined

When you create a new Scriban file which is still empty the Scriban import fails with this error. Add content to the Scriban file and this error will disappear.

# Solving issues

### Remoting not working
To enable PowerShell remoting for your local dev machine the easiest approach is described in the blog post [ShieldsDown.config for Sitecore PowerShell developers](https://alan-null.github.io/2017/01/spe-dev-config), as described in the quickstart.
If Remoting is not working correctly, execute the following steps:
- Open console window and do an `iisreset`
- Check the resulting configuration on the url `https://<your-sitecore-server>/sitecore/admin/showconfig.aspx` for the following `remoting` configuration:
```xml
<remoting requireSecureConnection="false" enabled="true">
  <authorization>
    <add Permission="Allow" IdentityType="User" Identity="sitecore\admin" patch:source="zzz_spe_shieldsdown.config"/>
  </authorization>
</remoting>
```

# Related blog posts 

Below some blog posts regarding SXA CLI and SXA Umbrella.

## Posts about SXA Umbrella

The blog posts below are related to SXA Umbrella:

- [From SXACLI to enhancements to SXA Umbrella](https://www.sergevandenoever.nl/From_SXACLI_to_enhancements_to_SXA_Umbrella/)

## Posts about Sitecore SXA CLI

The blog posts below contain some information about initial research into SXA CLI:

- [Sitecore 9.3 - create a custom theme for SXA using SXA CLI](https://www.sergevandenoever.nl/sitecore-93-custom-theme-with-SXA-CLI/)
- [Sitecore 9.3 SXA CLI - get item fields](https://www.sergevandenoever.nl/Sitecore-93-SXA-CLI-GetItemFields/)
- [Sitecore SXA theme investigation](https://www.sergevandenoever.nl/Sitecore-SXA-Theme-Investigation/)