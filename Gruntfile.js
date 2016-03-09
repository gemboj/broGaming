var grunt = require('grunt');
grunt.loadNpmTasks('grunt-contrib-clean');

grunt.initConfig({
    clean: [
        "development/{server,client}/javascripts/*", "development/client/apps/*"
    ],
    concat: {
        platforms: {
            client: {
                input: "src/client/",
                dependency: "dependencies/client/",
                outputs: ["development/client/javascripts/"],
                wrapping: ["Require"]
            },
            server: {
                input: "src/server/",
                dependency: "dependencies/server/",
                outputs: ["development/server/javascripts/"],
                wrapping: ["Node"]
            },
            clientServer: {
                input: "src/client-server/",
                dependency: "dependencies/client-server/",
                outputs: [
                    "development/client/javascripts/",
                    "development/server/javascripts/"
                ],
                wrapping: [
                    "Require",
                    "Node"
                ]
            },
            apps: {
                input: "apps",
                dependency: "dependencies/apps/",
                outputs: [
                    "development/client/apps/"
                ],
                wrapping: [
                    "Require"
                ]
            }
        }
    }
});

grunt.registerTask('default', 'default task description', ['concatAppRequireJs', 'concatApps']);
grunt.registerTask('testConcat', ['clean', 'concat']);
grunt.registerTask('concat', function(){
    var config = grunt.config.get().concat,
        platforms = config.platforms;

    for(var platformIndex in platforms){
        var platform = platforms[platformIndex],
            inputPath = platform.input,
            dependencyPath = platform.dependency,
            outputPaths = platform.outputs,
            wrapping = platform.wrapping,
            outputs = {};


        grunt.file.recurse(inputPath, function (abspath, rootdir, subdir, filename) {
            var fileContent = grunt.file.read(abspath),
                moduleName = getModuleName(subdir),
                outputIndex = subdir + platformIndex;

            if(!isJavascriptFile(filename)){
                for(var i = 0; i < outputPaths.length; i++){
                    var path = outputPaths[i];

                    grunt.file.copy(abspath, path + subdir + "/" + filename);
                }

                return;
            }

            fileContent = changeClassNameNotation(fileContent, moduleName);

            if(outputs[outputIndex] === undefined){
                createOutputAttribute(outputs, outputIndex);

                outputs[outputIndex].paths = [];
                outputs[outputIndex].wrapping = [];
                for(var outputPathIndex = 0; outputPathIndex < outputPaths.length; outputPathIndex++){
                    var outputPath = outputPaths[outputPathIndex];

                    outputs[outputIndex].paths.push(outputPath + subdir + '.js');
                    outputs[outputIndex].wrapping.push(wrapping[outputPathIndex]);
                }

                outputs[outputIndex].dependencyPath = dependencyPath + subdir + '.json';
                outputs[outputIndex].content = fileContent;
                outputs[outputIndex].moduleName = moduleName;
            }
            else{
                outputs[outputIndex].content += '\n' + fileContent;
            }
        });

        for(var outputIndex in outputs){
            var output = outputs[outputIndex];

            var dependencyJSON = null;
            try {
                dependencyJSON = grunt.file.readJSON(output.dependencyPath);
            } catch(e){}

            var resolvedDependency = resolveDependencies(dependencyJSON, output);

            for(var i = 0; i < output.paths.length; i++){
                var paath = output.paths[i];

                var wrappedContent = "";
                if(output.wrapping[i] === "Require"){
                    wrappedContent = wrapRequireJsModule(output.content, output.moduleName, resolvedDependency);
                }
                else{
                    wrappedContent = wrapNodeJsModule(output.content, output.moduleName, resolvedDependency);
                }

                grunt.file.write(output.paths[i], wrappedContent);
            }

        }

        /*for(var outputIndex = 0; outputIndex < outputPaths.length; outputIndex++){
            var outputPath = outputPaths[outputIndex];

            grunt.file.write(outputPath + subdir + "/" + filename, fileContent);
        }*/
    }
});

function isJavascriptFile(filename){
    return /\.js/.test(filename);
}

function changeClassNameNotation(fileContent, moduleName){
    var className = /function\s+(\w+)\(/.exec(fileContent)[1];

    var temp = fileContent.replace(/(function)\s+(\w+)\(/, "$2 = $1("),
        temp2 = temp.replace(new RegExp('^' + className, 'gm'), moduleName + "." + className);

    return temp2;
}

function getModuleName(subdir){
    return /(\w+)\/$/.exec(subdir + '/')[1];
}

function createOutputAttribute(output, index){
    output[index] = {};
}

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
    /*for(var i = 0; i < resolvedDependencies.paths.length; i++){
        if((i+1) < resolvedDependencies.paths.length && resolvedDependencies.paths[i+1] === resolvedDependencies.paths[i]){
            resolvedDependencies.paths.splice(i, 1);
            resolvedDependencies.args.splice(i, 1);
        }
    }*/

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