function AppLoader(ajax){
    var that = this;

    this.load = function(name){
        ajax({url: 'apps/' + name + '/' + name + '.html'})
            .done(function(data){
                console.dir(data);

                require(['apps/' + name + '/' + name + '.js'], function(func){
                    func();
                })
            })
    }
}