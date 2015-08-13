var grunt = require('grunt');

grunt.registerTask('default', 'default task description', ['concatLogicRequireJs']);

grunt.registerTask('concatLogicRequireJs', 'merges javascript logic files into one requireJs library', function(){
    var resourcePath = './logic/',
        outputPath = './development/',
        dependencyPath = './dependencies/';

    var output = {};
    //var tree = {parent: null, name: 'treeRoot', content: ''};
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

            //var pathWithPlatformDir = subdir.substring(0, subdir.length - libName.length);
            var pathDir = subdir.replace(platform, '');

            //console.log(pathDir + '/');

            /*var mystr = pathDir + '/';
            var regex = /(\w+)\//g;
            var result;

            var treeNode = tree;
            while ((result = regex.exec(mystr)) !== null) {
                //console.log(result[1]);
                if (treeNode[result[1]] === undefined) {
                    var newTreeNode = {parent: treeNode, name: result[1], content: ''};
                    treeNode[result[1]] = newTreeNode;
                    treeNode = newTreeNode;
                }
                else {
                    treeNode = treeNode[result[1]];
                }
            }*/

            //console.log(regex.exec()[1]);
            //console.log(regex.exec(subdir + '/')[1]);
            /*for(var i = 1; i < result.length; ++i){
             console.log(result[i]);
             }*/

            /*var dependencies = [],
                dependenciesRegEx = /Object.create\((\w+)\)/g;
            while ((result = dependenciesRegEx.exec(fileContent)) !== null) {
                dependencies.push(result[1]);
            }*/

            var className = /function\s+(\w+)\(/.exec(fileContent)[1];
            var newFileContent = fileContent.replace(/(function)\s+(\w+)\(/, "$2 = $1(");
            newFileContent = newFileContent.replace(new RegExp(className, 'g'), libName + "." + className);

            var index = subdir + platform;
            output[index] = (output[index] === undefined ? {} : output[index]);

            output[index].path = outputPath + platform + 'javascripts/' + pathDir + '.js';
            output[index].dependenciesPath = dependencyPath + subdir + '.json';
            output[index].content = (output[index].content === undefined ? '' : output[index].content) + '\n' + newFileContent;
            output[index].libName = libName;
            //output[index].dependencies = dependencies;
            //output[index].node = treeNode;

            //treeNode.content += fileContent;
        }
    });
    //console.log(tree);
    for(subDir in output){
        var wrappedContent = '';

        var dependenciesJSON = null;
        try {
            dependenciesJSON = grunt.file.readJSON(output[subDir].dependenciesPath);
        }
        catch(e){

        }

        var resolvedDependencies = resolveDependencies(dependenciesJSON, output[subDir]);
        /*for(var i = 0; i < resolvedDependencies.classes.length; ++i){
            var className = resolvedDependencies.classes[i],
                libName = resolvedDependencies.args[i];
            output[subDir].content = output[subDir].content.replace(new RegExp(className, 'g'), libName + '.' + className);
        }*/

        if(output[subDir].path.indexOf('client') > -1){
            wrappedContent = wrapRequireJsModule(output[subDir].content, output[subDir].libName, resolvedDependencies);
        }
        else{
            wrappedContent = wrapNodeJsModule(output[subDir].content, output[subDir].libName, resolvedDependencies);
        }

        //console.log(wrappedContent);
        grunt.file.write(output[subDir].path, wrappedContent);
    }

     //console.log(output);
});

/*grunt.registerTask('concatLogicRequireJs', 'merges javascript logic files into one requireJs library', function(){
    var resourcePath = './logic/',
        outputPath = './development/';

    var output = {};
    grunt.file.recurse(resourcePath, function (abspath, rootdir, subdir, filename) {
        var fileContent = grunt.file.read(abspath),
            result = /\/(\w+)$/.exec(subdir),
            libName = result === null ? subdir : result[1];
        var platform = (subdir.indexOf('server') === -1 ? 'client/' : 'server/');
        var pathWithPlatformDir = subdir.substring(0, subdir.length - libName.length);
        var pathDir = pathWithPlatformDir.replace(platform, '');


        var newFileContent = fileContent.replace(/(function)\s+(\w+)\(/, libName + ".$2 = $1(");

        output[subdir] = (output[subdir] === undefined ? {} : output[subdir]);

        output[subdir].path = outputPath + platform + 'javascripts/' + pathDir + libName + '.js';
        output[subdir].content = (output[subdir].content === undefined ? '' : output[subdir].content) + '\n' + newFileContent;
        output[subdir].libName = libName;
    });

    for(subDir in output){
        var wrappedContent = '';

        if(output[subDir].path.indexOf('client') > -1){
            wrappedContent = wrapRequireJsModule(output[subDir].content, output[subDir].libName);
        }
        else{
            wrappedContent = wrapNodeJsModule(output[subDir].content, output[subDir].libName);
        }

        //console.log(output[subDir].path);
        grunt.file.write(output[subDir].path, wrappedContent);
    }
});*/

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
/*
function resolveDependencies(dependencies, treeNode){
    var resolvedDependencies = {paths: [], args: [], classes: []};
    for(var i = 0; i < dependencies.length; ++i) {
        var dependencyPath = '/';
        var currentNode = treeNode;
        while(currentNode !== null){
            var regExp = new RegExp('function\\s+' + dependencies[i] + '\\s*\\(');
            var result = regExp.exec(currentNode.content);
            var dependencyName = '';
            if(result && result[0]){
                dependencyName = currentNode.name;
                dependencyPath += dependencyName;
                break;
            }
            dependencyPath += '../'
            currentNode = currentNode.parent;
        }

        resolvedDependencies.paths.push('"' + dependencyPath + '"');
        resolvedDependencies.args.push(dependencyName);
        resolvedDependencies.classes.push(dependencies[i]);
    }

    return resolvedDependencies;
}*/

function resolveDependencies(dependenciesJSON, output){
    var resolvedDependencies = {paths: [], args: []};

    if(dependenciesJSON !== null){
        var dependencies = dependenciesJSON.dependencies;
        for(var i = 0; i < dependencies.length; ++i){
            resolvedDependencies.paths.push('"' + dependencies[i].path + '"');
            resolvedDependencies.args.push(dependencies[i].module);
            //moduleContent = moduleContent.replace(dependencies[i].class, dependencies[i].module + '.' + dependencies[i].class);
            output.content = output.content.replace(new RegExp(dependencies[i].class, 'g'), dependencies[i].module + '.' + dependencies[i].class);
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
        var path = resolvedDependencies.paths[i][0] + '.' + resolvedDependencies.paths[i].slice(1);
        dependanciesString += 'var ' + resolvedDependencies.args[i] + ' = require(' + path + ');';
    }

    return "var " + libName + " = {};\n"
        + dependanciesString + '\n'
        + content

        + "\n\nmodule.exports = " + libName + ";";
/*
    return "define(function (){\n"
        + "var " + libName + " = {};\n"

        + content

        + "\n\nreturn " + libName + ";\n"
        + "});";
*/
}