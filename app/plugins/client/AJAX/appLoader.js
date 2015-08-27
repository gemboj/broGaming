function AppLoader(ajax, newTab){
    var that = this;

    this.load = function(name){
        ajax({url: 'apps/' + name + '/' + name + '.html'})
            .done(function(data){
                require(['apps/' + name + '/' + name + '.js'], function(func){
                    newTab(name, data, func);
                })
            })
    }
}