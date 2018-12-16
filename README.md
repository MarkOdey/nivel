# Spotful App Starter

## Getting Started

To use this boilerplate, you'll need to make sure you have Grunt, Node, and Node Package Manager (NPM) installed. 
- [Installation instructions for Grunt](https://gruntjs.com/ "gruntjs.com")  
- [Installed instructions for Node / NPM](http://blog.teamtreehouse.com/install-node-js-npm-mac)

1. Rename `Grunt.config.example` to `Grunt.config` and update all of your defaults.

2. Run `npm run setup` to install dependencies, and set up the development environment.

3. Now when you return to this project, you can simply run `grunt dev` to spin up the development environment.


### Build Tools
If you want to use the Grunt-powered toolkit for app development, you'll need to run a few commands in your terminal, and set up a few things.

1. Clone this repo.   
2. In your `package.json` file update the `name` and `version` keys to reflect this app. This is very important for our deployment flow, as these will be used to create the path to the S3 bucket where your app is hosted.   
3. `npm install` installs the necessary dependencies.  
4. Once your dependencies are installed, `grunt dev` starts up a server, and watches the files in your `/src` directory for changes. If a browser doesn't automatically open after running this command - you can access your app via `localhost:3000`.  
5. For development, your app will be previewed through `/demo` - which contains a simple index file with an iframe. This emulates the parent environment and communication flow of a Spotful App inside the platform.  
6. When your app is ready for distribution, `grunt build` prepares and packages your app into the `/dist` directory.  


### Accessing Data
The Spotful Editor generates editor fields from the `manifest.json`, which will be used to merge dynamic data into your app template. For mocking data, you'll find a `data.json` file in the `/demo` folder. Any mocked data you add in this file must reflect the structure in your `manifest.json` file.

This mocked data is served via the `app-communication-api` to your demo app - just as it would be in the Spotful platform. 

Any data you add to `demo/data.json` will be accessible via the `payload` which becomes available on every update. See a working example in the `src/app.js` file. 


#### Example data.json

```json
{
    "images" : [
        {"title": "Image title 1", "alt": "Alt Text 1", "src": "https://unsplash.it/700/500"},
        {"title": "Image title 2", "alt": "Alt Text 2", "src": "https://unsplash.it/600/500"},
        {"title": "Image title 3", "alt": "Alt Text 3", "src": "https://unsplash.it/800/500"}
    ]
}
```


### App Requirements
To ensure a standardized experience to both users and creators, we've compiled a short list of requirements to consider when building Spotful Apps. 

1. Default / Empty State - To provide a default (not broken) or informational empty state to alert creators either what to do next - or that they have yet to customize or add anything to the app.

2. Loading State - While your initial data loads, you should display some sort of loading state to let either creators and users know data is being loaded.

3. Well-Defined Manifest - Ensure that your labels and descriptions are informative. Be clear and be concise. 

4. Be Responsive - Your app should work cross-browser, and respond intuitively to a variable width and height. Feel free to hide non-essential items in smaller frames. Make sure you consider the mobile experience as well (support touchevents when necessary, consider different aspect ratios, etc). 



### Organizing Your App
Organize your app the way you would any other web project. Just like a website. Anything inside your `/src` will be compiled and copied into the `/dist` directory. This `/dist` folder is what will be deployed as your published app. 

_Default Spotful App Organization:_
```
src/
    app.js          // Do your javascripting here.
    index.html      // This will be rendered and served inside a Spotful Frame. 
    manifest.json   // Define fields & user-accessible data for the Spotful editor
    README.md       // Leave important information pertaining to your application.
    robots.txt      // Do you want this app to be accessible to search engines?

scss/
    main.scss       // Start your styling here. Anything added or imported will be compiled into CSS and moved to the `/dist` folder
```


### Writing A Manifest
To interface with our editor, Spotful Apps require a `manifest.json` file. See the available types [here](https://bitbucket.org/spotinteractive/spotful-spec-documents/src/master/manifest-v0.2.0/), or read more about it in our manifest [documentation](https://bitbucket.org/spotinteractive/spotful-spec-documents/src/master/manifest-v0.2.0/).


### Submitting and Initializing a Spotful App
Before your app can be used in the Spotful ecosystem, it has to be added and configured in the [Spotful Admin](https://admin.bespotful.com) under Apps. 

_Requirements:_
1. The URL to your `manifest.json` file.  
2. [Admin Panel] Permission (which user group has access to this app?)  
3. [Admin Panel] App Icon (what will the app look like in the Target Wheel?)  
4. [Admin Panel] App Group (*optional*, what category do you want the app to be under?)  


### Deploying a Spotful App
Apps are hosted on AWS in our `assets.bespotful.com` bucket. Use `grunt deploy` to push your app to AWS. Your app will be available 

**NOTE: Your *VERSION* and *TITLE* MUST be updated in your `package.json`.** 
- **Version** will be reflected in the URL, and the latest version will be served in the editor. 
- The **Title** is to be unique and dashed - this will be reflected in the URL. 


### Updating a Spotful App
Versioning is handled in the `package.json` file. Every time you make a change which you want to push, update the version number in the `package.json` file, as well as the `path/to/index.html` in your `manifest.json`, then push to AWS.

When you push a version of your app (by updating your `package.json` file, and pushing to AWS), you must also update the URL to your manifest in the [Spotful Admin](https://admin.bespotful.com) to reflect the latest available version in the editor. 

All apps created going forward will use this new version, and all apps created with a different version will maintain that version. 
