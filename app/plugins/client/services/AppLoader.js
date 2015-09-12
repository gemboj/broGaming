function AppLoader(scope, ajax, require, createRoom, newTab){
    Service.call(this, scope);
    var that = this;

    this.createApp = function(name, room){
        var roomData = null;

        return handleRoom(room, name)
            .then(function(room){
                room.app = name;
                roomData = room;
                return that.load(name);
            })
            .then(function(data){
                newTab(data.name, data.html, data.app, roomData);
            })
            .catch(function(err){
                //that.applyChanges();
                //console.log(err)
            });
    };

    function handleRoom(room, name){
        if(room){
            return Promise.resolve(room);
        }
        else{
            return createRoom(name);
        }
    }

    this.load = function(name){
        return new Promise(function(resolve, reject){
            ajax({url: 'apps/' + name + '/' + name + '.html'})
                .done(function(data){
                    require(['apps/' + name + '/' + name + '.js'], function(app){
                        resolve({name: name, html: data, app: app});
                    })
                })
        });
    };

    this.loadEjs = function(name){
        return new Promise(function(resolve, reject){
            ajax({url: name})
                .done(function(data){
                    resolve(data);
                })
        });
    }
}