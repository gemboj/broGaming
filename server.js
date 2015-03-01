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
			chatHandler.joinRoom({socketUser: socket._user, room: chat.rooms[0]});

			return next();
		}
		next(new Error('Undefined nick'));
	});
	
	
	io.sockets.on('connection', function(socket) {
        socket.on("broadcastRoom", function(data){
            io.sockets.in(data.roomId).emit(data.action, data);
        });

		socket.on("privateMessage", function(data){
			var user = chat.findUser(data.receiver);
			if(user != -1){
				user.getSocket().emit(data.messageContent, data);
			}
			else{
				socket.emit("chatMsg", {nick: "Server", msg: "User " + data.receiver + " does not exist. MessageContent: " + data.messageContent});
			}

		});

		socket.on("chat", function(data, cb){
			data.socketUser = socket._user;
			chatHandler[data.action](data, cb);
		});
		
		socket.on('disconnect', function(data) {
			var user = chat.findUserS(socket);
			
			if(user){
				chatHandler.leaveAllRooms(user);
			}
		});
		
	});
	
	return io;
})();

var chatHandler = {
	createRoom: function(data, cb){
		var room = chat.newRoom(data.roomName, data.socketUser, data.appName);
		data.room = room;
		chatHandler.joinRoom(data);
		cb(room.serialize(data.socketUser));
	},

	validateNick: function(data, cb){
		if(chat.validUserNick(data.nick) === 1){
			cb(1);
			return;
		}
		cb(0);
	},

	inviteRoom: function(data, cb){//roomId, roomName, nick, appName
		var user = chat.findUser(data.inviteReceiver);
		var room = chat.findRoom(data.roomId);

		if(room.hasUser(user)){
			data.socketUser.getSocket().emit("chatMsg", {nick: "Server", msg: "User " + user.getNick() + " already in room: " + room.getName()});
		}
		else{
			delete data.socketUser;
			user.getSocket().emit("inviteRoom", data);
		}
	},

	joinRoom: function(data, cb){
		var room = data.room ? data.room : chat.findRoom(data.roomId);
		var user = data.socketUser;

		if(room.hasUser(user)){
			data.socketUser.getSocket().emit("chatMsg", {nick: "Server", msg: "Already in room: " + room.getName()});
		}
		else if(!room.isLocked()){
			io.sockets.in(room.getId()).emit("addUser", {nick: user.getNick(), roomId: room.getId()});
			user.joinRoom(room);

			user.getSocket().join(room.getId());
			if(cb) {
				cb(room.serialize(data.socketUser));
			}
		}
		else{
			data.socketUser.getSocket().emit("chatMsg", {nick: "Server", msg: "Room is locked."});
		}
	},
	
	leaveRoom: function(data, cb){
		var room = data.room ? data.room : chat.findRoom(data.roomId);

		data.socketUser.getSocket().leave(data.roomId);
		data.socketUser.leaveRoom(room);

		io.sockets.in(room.getId()).emit("userDisconnected", {nick: data.socketUser.getNick(), roomId: room.getId()});
	},
	
	leaveAllRooms: function(user){
		var rooms = user.getRooms();	//rooms is a reference, so it reflects all changes made by leaveRoom fnction
		/*for(var i = 0; i < rooms.length; i++){
			i=0;
			this.leaveRoom(user, rooms[i]);
		};*/
		while(rooms.length != 0){
			this.leaveRoom({socketUser: user, room: rooms[0]});
		}
	},

	getRooms: function(data, cb){
		cb(data.socketUser.serializeRooms());
	},

	changeNick: function(data, cb){//user, newNick, cb){
		var temp = chat.validUserNick(data.newNick);
		if(temp != 1){
			cb(temp);
			return;
		};
		var rooms = data.socketUser.getRooms();
		for(var i = 0; i < rooms.length; i++){
			var room = rooms[i];
			io.sockets.in(room.getId()).emit("changeNick", {oldNick: data.socketUser.getNick(), newNick: data.newNick});
		}
		data.socketUser.setNick(data.newNick);

		cb({oldNick: data.socketUser.getNick(), newNick: data.newNick});
	},

	chatMsg: function(data, cb){
		io.sockets.in(data.roomId).emit("chatMsg", {nick: data.nick, msg: data.msg});
	},

	lockRoom: function(data, cb){//roomId
		var room = chat.findRoom(data.roomId);
		if(room != -1){
			if(data.socketUser == room.getHost()){
				if(!room.isLocked()){
					room.lock();
					io.sockets.in(data.roomId).emit("chatMsg", {nick: "Server", msg: "Room locked."});
					if(cb){
						cb();
					}
				}
				else{
					data.socketUser.getSocket().emit("chatMsg", {nick: "Server", msg: "Room already locked."});
				}
			}
			else{
				data.socketUser.getSocket().emit("chatMsg", {nick: "Server", msg: "Only room host can lock room."});
			}
		}
		else{
			data.socketUser.getSocket().emit("chatMsg", {nick: "Server", msg: "Room not found."});
		}
	},

	unlockRoom: function(data, cb){//roomId
		var room = chat.findRoom(data.roomId);
		if(room != -1){
			if(data.socketUser == room.getHost()){
				if(room.isLocked()){
					room.unlock();
					io.sockets.in(data.roomId).emit("chatMsg", {nick: "Server", msg: "Room unlocked."});
					if(cb){
						cb();
					}
				}
				else{
					data.socketUser.getSocket().emit("chatMsg", {nick: "Server", msg: "Room already unlocked."});
				}
			}
			else{
				data.socketUser.getSocket().emit("chatMsg", {nick: "Server", msg: "Only room host can unlock room."});
			}
		}
		else{
			data.socketUser.getSocket().emit("chatMsg", {nick: "Server", msg: "Room not found."});
		}
	}
};

server.listen(4000);