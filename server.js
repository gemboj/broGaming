var chat = require("./server/chat.js");


var server = (function(){
	var http = require('http');
	var fs = require('fs');
	var server = http.createServer();
	
	server.on('request', function(req, res){
		if (req.url === '/favicon.ico') {
			res.end();
			return;
		}
		
		url = req.url;
		if(req.url == "/"){
			url = "/index.html";
			extension = "html";
		}
		
		var reExt = /\.(\w+)$/ig;
		var extension = reExt.exec(url)[1];//req.url.substring(req.url.length-3, req.url.length); ZMIENIC NA REGEXP
		
		if(extension === "js"){
			extension = "javascript";
		}
		
		if((extension === "gif")||(extension === "png")){//serving images
			var img = fs.readFileSync("." + url);
			res.writeHead(200, {'Content-Type': 'image/' + extension });
			res.end(img, 'binary');
		}
		else{
			console.log(url);
			fs.readFile('.' + url, 'utf-8', function (error, data) {
				
				if(error){
					res.writeHead(404, {'Content-Type': 'text/html'});
					console.log(error);
					res.end();
					return;
				};
				var sendData = data;
				
				if(extension === "html"){
					sendData = server.include(data);
				};
				if(req.url === "/server/chat.js"){
					sendData = server.parse(data);
				};

				res.writeHead(200, {'Content-Type': 'text/' + extension});
				res.write(sendData);
				res.end();
			});
		}
	});
	
	server.include = function(string){
		var temp = string;
		var re = /<!--\s*#include=['"]([\/\.\w]+\.\w*)['"]\s*-->/ig;
		var arr;
		while((arr = re.exec(temp)) != null){
			if(fs.existsSync(arr[1])){
				var file = fs.readFileSync(arr[1], 'utf-8');
				temp = temp.replace(arr[0], file);
				re.lastIndex += (file.length - arr[0].length);
			}
			else{
				console.log(arr[1] + " does not exist.");
				temp = temp.replace(arr[0], "");
				re.lastIndex -= arr[0].length;
			}
		}
		
		return temp;
	}
	
	server.parse = function(string){
		var temp = string;
		
		var re = /(\/\/\s*<!--\s*server[\s\S]*server\s*-->)/igm;
		var arr;
		while((arr = re.exec(temp)) != null){
			temp = temp.replace(arr[0], "");
			re.lastIndex -= arr[0].length;
		}
		
		return temp;
	};
	
	return server;
})();

var io = (function(){
	var io = require('socket.io')().listen(server);
	
	io.use(function(socket, next){//authorization
		var nick = socket.handshake.query.nick;
		if (nick){
			var temp = chat.validUserNick(nick)
			if(temp != 1){
				return next(new Error(temp));
			}

			socket._user = chat.newUser(nick, socket);
			socketHandler.joinRoom(socket._user, chat.rooms[0]);

			return next();
		}
		next(new Error('Undefined nick'));
	});
	
	
	io.sockets.on('connection', function(socket) {
        socket.on("broadcastRoom", function(data){
            io.sockets.in(data.roomId).emit(data.event, data);
        });
        
		socket.on("getRooms", function(nick, cb){
			if(nick){
				cb(chat.findUser(nick).serializeRooms());
				return;
			};
			
			cb(socket._user.serializeRooms());
			return;
		});
		
		socket.on("createRoom", function(roomName, cb){
			var room = chat.newRoom(roomName);
			socketHandler.joinRoom(socket._user, room);
			cb(room.serialize(socket._user));
		});

		socket.on('joinRoom', function(roomId, cb){
			var room = chat.findRoom(roomId);
			socketHandler.joinRoom(socket._user, room);
			cb(room.serialize(socket._user));
		});

		socket.on('leaveRoom', function(roomId){
			var room = chat.findRoom(roomId);
			socketHandler.leaveRoom(socket._user, room);
		})
	
		socket.on('chatMsg', function(data) {		
			io.sockets.in(data.roomId).emit("chatMsg", data);
		});

		socket.on('delRoom', function(roomId){
			socketHandler.delRoom(socket._user, roomId);
		});
		
		socket.on('changeNick', function(newNick, cb){
			socketHandler.changeNick(socket._user, newNick, cb);
			/*var temp = chat.validUserNick(newNick);
			if(temp != 1){
				socket.emit("chatMsg", {nick: "Server", msg: temp});
				return;
			};			
			
			chat.changeNick(socket._user, newNick);		
			
			cb();*/
		});

		socket.on("inviteRoom", function(data){
			var user = chat.findUser(data.inviteReceiver);
			user.getSocket().emit("inviteRoom", data);
		})
		
		socket.on("validateNick", function(nick, cb){
			if(chat.validUserNick(nick) === 1){
				cb(1);
				return;
			}
			cb(0);
		});


		
		socket.on('disconnect', function(data) {
			var user = chat.findUserS(socket);
			
			if(user){
				socketHandler.leaveAllRooms(user);
			}
		});
		
	});
	
	return io;
})();

var socketHandler = {
	joinRoom: function(user, room){
		io.sockets.in(room.getId()).emit("addUser", {nick: user.getNick(), roomId: room.getId()});
		user.joinRoom(room);

		user.getSocket().join(room.getId());
	},
	
	leaveRoom: function(user, room){
		user.getSocket().leave(room.getId());

		user.leaveRoom(room);
		io.sockets.in(room.getId()).emit("delUser", {nick: user.getNick(), roomId: room.getId()});
	},
	
	leaveAllRooms: function(user){
		var rooms = user.getRooms();	//rooms is a reference, so it reflects all changes made by leaveRoom fnction
		/*for(var i = 0; i < rooms.length; i++){
			i=0;
			this.leaveRoom(user, rooms[i]);
		};*/
		while(rooms.length != 0){
			this.leaveRoom(user, rooms[0]);
		}
	},

	changeNick: function(user, newNick, cb){
		var temp = chat.validUserNick(newNick);
		if(temp != 1){
			cb(temp);
			return;
		};
		var rooms = user.getRooms();
		for(var i = 0; i < rooms.length; i++){
			var room = rooms[i];
			io.sockets.in(room.getId()).emit("changeNick", {oldNick: user.getNick(), newNick: newNick});
		}
		user.setNick(newNick);

		cb({oldNick: user.getNick(), newNick: newNick});
	}
};

server.listen(4000);