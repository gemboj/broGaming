function AppLoader(ajax, require){
    var that = this;

    this.load = function(name){
        return new Promise(function(resolve, reject){
            ajax({url: 'apps/' + name + '/' + name + '.html'})
                .done(function(data){
                    require(['apps/' + name + '/' + name + '.js'], function(func){
                        resolve({name: name, html: data, mainFunc: func});
                    })
                })
        });
    }
}