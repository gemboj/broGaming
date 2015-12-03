var grunt = require('grunt');

grunt.registerTask('default', 'default task description', ['concatAppRequireJs', 'concatApps']);

grunt.registerTask('concatAppRequireJs', 'merges javascript src files into one requireJs library', function(){
    var resourcePath = './src/',
        outputPath = './development/',
        dependencyPath = './dependencies/src/';

    var output = {};
    grunt.file.recurse(resourcePath, function (abspath, rootdir, subdir, filename) {
        var fileContent = grunt.file.read(abspath),
            libName = /(\w+)\/$/.exec(subdir + '/')[1];
        var platforms = [];

        if(subdir.indexOf('server') > -1) {
            platforms.push('server/');
        }
        if(subdir.indexOf('client') > -1){
            platforms.push('client/');
        }
        if(platforms.length === 0){
            platforms.push('client/');
            platforms.push('server/');
        }

        for(var i = 0; i < platforms.length; ++i) {
            var platform = platforms[i];

            var pathDir = subdir.replace(platform, '');

            var className = /function\s+(\w+)\(/.exec(fileContent)[1];
            var newFileContent = fileContent.replace(/(function)\s+(\w+)\(/, "$2 = $1(");
            newFileContent = newFileContent.replace(new RegExp('^' + className, 'gm'), libName + "." + className);

            var index = subdir + platform;
            output[index] = (output[index] === undefined ? {} : output[index]);

            output[index].path = outputPath + platform + 'javascripts/' + pathDir + '.js';
            output[index].dependenciesPath = dependencyPath + subdir + '.json';
            output[index].content = (output[index].content === undefined ? '' : output[index].content) + '\n' + newFileContent;
            output[index].libName = libName;
        }
    });

    for(subDir in output){
        var wrappedContent = '';

        var dependenciesJSON = null;
        try {
            dependenciesJSON = grunt.file.readJSON(output[subDir].dependenciesPath);
        }
        catch(e){

        }

        var resolvedDependencies = resolveDependencies(dependenciesJSON, output[subDir]);

        if(output[subDir].path.indexOf('client') > -1){
            wrappedContent = wrapRequireJsModule(output[subDir].content, output[subDir].libName, resolvedDependencies);
        }
        else{
            wrappedContent = wrapNodeJsModule(output[subDir].content, output[subDir].libName, resolvedDependencies);
        }

        grunt.file.write(output[subDir].path, wrappedContent);
    }
});

grunt.registerTask('concatApps', 'merges javascript apps files', function(){
    var resourcePath = './apps/',
        outputPath = './development/',
        dependencyPath = './dependencies/apps/';

    var output = {};
    grunt.file.recurse(resourcePath, function (abspath, rootdir, subdir, filename) {
        var fileContent = grunt.file.read(abspath),
            libName = /(\w+)\/$/.exec(subdir + '/')[1];




        var platforms = ['client/'];

        for(var i = 0; i < platforms.length; ++i) {
            var platform = platforms[i],
                pathDir = subdir.replace(platform, '');

            if(filename.indexOf('.js') === -1){
                grunt.file.write(outputPath + platform + 'apps/' + pathDir + '/' + filename, fileContent);

                return;
            }

            var className = /function\s+(\w+)\(/.exec(fileContent)[1];
            var newFileContent = fileContent.replace(/(function)\s+(\w+)\(/, "$2 = $1(");
            newFileContent = newFileContent.replace(new RegExp('^' + className, 'gm'), libName + "." + className);

            var index = subdir + platform;
            output[index] = (output[index] === undefined ? {} : output[index]);

            output[index].path = outputPath + platform + 'apps/' + pathDir + '.js';
            output[index].dependenciesPath = dependencyPath + subdir + '.json';
            output[index].content = (output[index].content === undefined ? '' : output[index].content) + '\n' + newFileContent;
            output[index].libName = libName;
        }
    });

    for(subDir in output){
        var wrappedContent = '';

        var dependenciesJSON = null;
        try {
            dependenciesJSON = grunt.file.readJSON(output[subDir].dependenciesPath);
        }
        catch(e){

        }

        var resolvedDependencies = resolveDependencies(dependenciesJSON, output[subDir]);

        if(output[subDir].path.indexOf('client') > -1){
            wrappedContent = wrapRequireJsModule(output[subDir].content, output[subDir].libName, resolvedDependencies);
        }
        else{
            wrappedContent = wrapNodeJsModule(output[subDir].content, output[subDir].libName, resolvedDependencies);
        }

        grunt.file.write(output[subDir].path, wrappedContent);
    }
});

grunt.registerTask('copyResources', 'copies all resources to main directory', function(){
    var resourcePublicPath = './development/client',
        resourceServerPath = './development/server',
        outputPublicPath = './production/client/',
        outputServerPath = './production/server/';

    grunt.file.recurse(resourcePublicPath, function (abspath, rootdir, subdir, filename) {
        var fileContent = grunt.file.read(abspath);

        grunt.file.write(outputPublicPath + subdir + '/' + filename, fileContent);
    });

    grunt.file.recurse(resourceServerPath, function (abspath, rootdir, subdir, filename) {
        var fileContent = grunt.file.read(abspath);

        grunt.file.write(outputServerPath + subdir + '/' + filename, fileContent);
    });
});

function resolveDependencies(dependenciesJSON, output){
    var resolvedDependencies = {paths: [], args: []};

    if(dependenciesJSON !== null){
        var dependencies = dependenciesJSON.dependencies;
        for(var i = 0; i < dependencies.length; ++i){
            if(dependencies[i].class){
                output.content = output.content.replace(new RegExp('([\\s\\(])' + dependencies[i].class, 'g'), '$1' + dependencies[i].module + '.' + dependencies[i].class);
            }

            if(dependencies[i].path != '.'){
                resolvedDependencies.paths.push('"' + dependencies[i].path + '"');
                resolvedDependencies.args.push(dependencies[i].module);
            }
        }
    }

    return resolvedDependencies;
}

function wrapRequireJsModule(content, libName, resolvedDependencies){
    var dependenciesDirs = resolvedDependencies.paths.toString();
    var dependenciesArgs = resolvedDependencies.args.toString();


    return "define([" + dependenciesDirs + "], function (" + dependenciesArgs + "){\n"
        + "var " + libName + " = {};\n"

        + content

        + "\n\nreturn " + libName + ";\n"
        + "});";
}

function wrapNodeJsModule(content, libName, resolvedDependencies){
    var dependanciesString = '';

    for(var i = 0; i < resolvedDependencies.paths.length; ++i){
        var path = resolvedDependencies.paths[i][0] + (resolvedDependencies.paths[i][1] != '/' ? '' : '.') + resolvedDependencies.paths[i].slice(1);
        dependanciesString += 'var ' + resolvedDependencies.args[i] + ' = require(' + path + ');';
    }

    return "var " + libName + " = {};\n"
        + dependanciesString + '\n'
        + content

        + "\n\nmodule.exports = " + libName + ";";
}