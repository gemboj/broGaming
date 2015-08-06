var grunt = require('grunt');

grunt.registerTask('default', 'default task description', ['concatTestable', 'copyResources']);

grunt.registerTask('concatTestable', 'merges javascript logic files into one library with a proper namespace', function(){
    var resourcePath = './logic/',
        outputPath = './resources/';

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
        output[subDir].content = "(function(window){\n\n"
            + "if(window." + output[subDir].libName + " !== undefined){\n"
            + "\tthrow('windows." + output[subDir].libName + " is already defined!');\n"
            + "}\n"
            + "var " + output[subDir].libName + " = {};\n"

            + output[subDir].content

            + "\nwindow." + output[subDir].libName + " = " + output[subDir].libName + ";\n\n"
            + '})(window);\n';

        //console.log(output[subDir].path);
        grunt.file.write(output[subDir].path, output[subDir].content);
    }
});

grunt.registerTask('copyResources', 'copies all resources to main directory', function(){
    var resourcePublicPath = './resources/public',
        resourcePrivatePath = './resources/private',
        outputPublicPath = './public/',
        outputPrivatePath = './private/';

    grunt.file.recurse(resourcePublicPath, function (abspath, rootdir, subdir, filename) {
        var fileContent = grunt.file.read(abspath);

        grunt.file.write(outputPublicPath + subdir + '/' + filename, fileContent);
    });

    grunt.file.recurse(resourcePrivatePath, function (abspath, rootdir, subdir, filename) {
        var fileContent = grunt.file.read(abspath);

        grunt.file.write(outputPrivatePath + subdir + '/' + filename, fileContent);
    });
});