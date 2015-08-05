var grunt = require('grunt');

grunt.registerTask('default', 'default task description', ['concatJS:./resources/public/javascripts/:./public/javascripts/']);

grunt.registerTask('concatJS', 'merges javascript files into one library', function(resourcePath, outputPath){
    //var fileCOntent = grunt.file.read('./public/javascripts/chat/dataTransfer.js');
    var output = {};
    grunt.file.recurse(resourcePath, function (abspath, rootdir, subdir, filename) {
        var fileContent = grunt.file.read(abspath)
            regExp = /(function)\s+(\w+)\(/;

        var temp = fileContent.replace(regExp, subdir + ".$2 = $1(");

        output[subdir] = (output[subdir] === undefined ? '' : output[subdir]) + '\n' + temp;
    });

    for(lib in output){
        output[lib] = "(function(window){\n\n"
            + "if(window." + lib + " !== undefined){\n"
            + "\tthrow('windows." + lib + " is already defined!');\n"
            + "}\n"
            + "var " + lib + " = {};\n"

            + output[lib]

            + "\nwindow." + lib + " = " + lib + ";\n\n"
            + '})(window);\n';


        grunt.file.write(outputPath + lib + '.js', output[lib])
    }
});