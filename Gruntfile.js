var grunt = require('grunt');

grunt.registerTask('default', 'default task description', ['concatLogicRequireJs']);

grunt.registerTask('concatLogicRequireJs', 'merges javascript logic files into one requireJs library', function(){
    var resourcePath = './logic/',
        outputPath = './development/';

    var output = {};
    grunt.file.recurse(resourcePath, function (abspath, rootdir, subdir, filename) {
        var fileContent = grunt.file.read(abspath),
            result = /\/(\w+)$/.exec(subdir),
            libName = result[1],
            pathDir = subdir.substring(0, subdir.length - libName.length);


        var newFileContent = fileContent.replace(/(function)\s+(\w+)\(/, libName + ".$2 = $1(");

        output[subdir] = (output[subdir] === undefined ? {} : output[subdir]);

        output[subdir].path = outputPath + pathDir + 'javascripts/logic/' + libName + '.js';
        output[subdir].content = (output[subdir].content === undefined ? '' : output[subdir].content) + '\n' + newFileContent;
        output[subdir].libName = libName;
    });

    for(subDir in output){
        output[subDir].content = "define('" + output[subDir].libName + "', function (){\n"
            + "var " + output[subDir].libName + " = {};\n"

            + output[subDir].content

            + "\n\nreturn " + output[subDir].libName + ";\n"
            + "});";

        //console.log(output[subDir].path);
        grunt.file.write(output[subDir].path, output[subDir].content);
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