var chat = (function(){
	var chat = {};
	chat.rooms = [];
	
	chat.findUser = function(nick){
		for(var i = 0; i < chat.rooms.length; i++){
			var userList = chat.rooms[i].getUserList();
			for(var j = 0; j < userList.length; j++){
				if(userList[j].getNick() === nick){
					return userList[j];
				}
			}
		}
		
		return -1;
	};
	
	chat.addRooms = function(rooms){
		for(var i = 0; i < rooms.length; i++){
			chat.rooms.push(rooms[i]);
		};
	};
	
	chat.addRoom = function(room){
		chat.rooms.push(room);
	};
	
	chat.delRoom = function(room){
		var index = chat.rooms.indexOf(room);
		if((index != -1) && (chat.rooms.length > 1)){
			chat.rooms[index].onDelete();
			chat.rooms.splice(index, 1);
			return 0;
		}
		else{
			return -1;
		}
	};
	
	chat.findRoom = function(id){
		for(var i = 0; i < chat.rooms.length; i++){
			var room = chat.rooms[i];
			var roomId = room.getId();

			if(roomId === id){
				return room;
			}			
		}
		
		return -1;
	};	

	chat.getRooms = function(){
		return this.rooms;
	};
	
	chat.User = function(nick){
		this._nick = nick;
	};

	chat.User.prototype = {
		getNick: function(){
			return this._nick;
		},
		
		setNick: function(nick){
			this._nick = nick;
		}
	};
	
	chat.Room = function(id, name, host){
		this._id = id;
		this._name = name;
		this._userList = [];
		this._host = host;
		this._isLocked = false;
	};
	
	chat.Room.prototype = {
		getId: function(){
			return this._id;
		},

		setId: function(id){
			this._id = id;
		},

		getHost: function(){
			return this._host;
		},

		setHost: function(host){
			this._host = host;
		},
		
		getName: function(){
			return this._name;
		},
		
		setCurrentRoom: function(name){
			this._name = name;
		},
		
		getUserList: function(){
			return this._userList;
		},
		
		setUserList: function(users){
			this._userList = users;
		},
		
		addUser: function(user){
			this._userList.push(user);
		},

		lock: function(){
			this._isLocked = true;
		},

		unlock: function(){
			this._isLocked = false;
		},

		isLocked: function(){
			return this._isLocked;
		},
		
		delUser: function(user){
			var index = this._userList.indexOf(user);
			if(index != -1){
				this._userList.splice(index, 1);
			};
		},
		
		userCount: function(){
			return this._userList.length;
		},
		
		getUserNickList: function(){
			var arr =[];
			var userList = this.getUserList();
			
			for(var i = 0; i < userList.length; i++){
				arr.push(userList[i].getNick());
			};			
			
			return arr;
		},

		hasUser: function(user){
			var userList = this.getUserList();
			for(var i = 0; i < this.userCount(); i++){
				if(userList[i] == user){
					return true;
				}
			}
			return false;
		},

		onDelete: function(){

		}
	};	
	
	return chat;
})();

// <!-- server
var f = function(){};
f.prototype = chat;

var chatServer = new f;
chatServer.uber = chat;
chatServer.forbNames = ["server", ""];
chatServer.defaultRoomName = "Main";
chatServer.availableRooms = [0];

chatServer.getDefaultRoomName = function(){
	return chatServer.defaultRoomName;
};	

chatServer.newRoom = function(name, host, appName){
	var index = chatServer.availableRooms.shift();
	var room = new chatServer.Room(index, name, host, appName);
	chatServer.rooms.push(room);
	
	if(chatServer.availableRooms.length === 0){
		chatServer.availableRooms.push(++index);
	};
	
	return room;
};

chatServer.newUser = function(nick, socket){
	return new chatServer.User(nick, socket);
};

chatServer.findUserS = function(socket){		
	for(var i = 0; i < chatServer.rooms.length; i++){
		var userList = chatServer.rooms[i].getUserList();
		for(var i = 0; i < userList.length; i++){
			if(userList[i].getSocket() === socket){
				return userList[i];
			}
		}
	}
	
	return -1;
}

chatServer.validUserNick = function(nick){
	var index = chatServer.forbNames.indexOf(nick.toLowerCase());
	
	if(index != -1){
		return "Forbidden nick.";
	}
	
	if(chatServer.findUser(nick) != -1){
		return "Nick already exists.";
	};
	
	return 1;
};

chatServer.validRoomName = function(name){
	var index = chatServer.forbNames.indexOf(name.toLowerCase());
	
	if(index != -1){
		return "Forbidden name.";
	}
	
	return;
};

chatServer.User = function(name, socket){
	chatServer.uber.User.call(this, name);
	this._socket = socket;
	this._rooms = [];
};

chatServer.User.prototype = Object.create(chat.User.prototype);
chatServer.User.prototype.constructor = chatServer.User;

chatServer.User.prototype.getSocket = function(){
	return this._socket;
}

chatServer.User.prototype.serializeRooms = function(){
	var rooms = this.getRooms();
	var temp = [];
	
	for(var i = 0; i < rooms.length; i++){
		temp.push(rooms[i].serialize(this));
	};
	return temp;
}

chatServer.User.prototype.getRooms = function(){
	return this._rooms;
};

chatServer.User.prototype.setRooms = function(rooms){
	this._rooms = rooms;
};

chatServer.User.prototype.addRoom = function(room){
	this._rooms.push(room);
};

chatServer.User.prototype.delRoom = function(room){
	var index = this._rooms.indexOf(room);
	if(index != -1){
		this._rooms.splice(index, 1);
	};
};

chatServer.User.prototype.joinRoom = function(room){
	var roomName = room.getName();
	
	room.addUser(this);
	this.addRoom(room);
};

chatServer.User.prototype.leaveRoom = function(room){
	var index = this._rooms.indexOf(room);
	
	if(index != -1){
		this.delRoom(room);
		room.delUser(this);

		if(room.userCount <= 0){
			chatServer.delRoom(room);
		};
	};
}

chatServer.Room = function(id, roomName, host, appName){
	chatServer.uber.Room.call(this, id, roomName, host);
	this._appName = appName;
}

chatServer.Room.prototype = Object.create(chat.Room.prototype);
chatServer.Room.prototype.constructor = chatServer.Room;

chatServer.Room.prototype.serialize = function(user){
	var tmp = {};
	tmp.id = this.getId();
	tmp.name = this.getName();
	tmp.userList = this.getUserNickList();
	tmp.host = this.getHost().getNick();
	tmp.appName = this.getAppName();
	var index = tmp.userList.indexOf(user.getNick());
	tmp.userList.splice(index, 1);
	return tmp;
};

chatServer.Room.prototype.getAppName = function(){
	return this._appName;
};

chatServer.newRoom(chatServer.getDefaultRoomName(), chatServer.newUser("Server"));
module.exports = chatServer;
// server -->

//<!-- client
var f = function(){};
f.prototype = chat;

var chatClient = new f;
chatClient.uber = chat;
chatClient._currentRoom;
chatClient._currentUser;

chatClient.setUser = function(nick){
	this._currentUser = new this.User(nick);
};

chatClient.setNick = function(nick){
	this._currentUser.setNick(nick);
};

chatClient.getNick = function(){
	return this._currentUser.getNick();
};

chatClient.getCurrentUser = function(){
	return this._currentUser;
};

chatClient.setCurrentRoom = function(room){
	chatClient._currentRoom = room;
};

chatClient.getCurrentRoom = function(){
	return chatClient._currentRoom;
};

chatClient.deserializeRooms = function(_rooms){
	var rooms = _rooms;
	if(Object.prototype.toString.call(_rooms) != '[object Array]'){
		rooms = [_rooms];
	}

	var tempArr = [];
	for(var i = 0; i < rooms.length; i++){
		tempArr.push(chatClient.deserializeRoom(rooms[i]));
	}


	return tempArr;
};

chatClient.deserializeRoom = function(room){
	var tempRoom;
	var host = chatClient.getCurrentUser().getNick() === room.host ? chatClient.getCurrentUser() : chatClient.findUser(room.host);
	if(room.appName){
		if(host === chatClient.getCurrentUser()){
			tempRoom = new chatClient.ServerRoom(room.id, room.name, room.appName);
		}
		else{
			tempRoom = new chatClient.GameRoom(room.id, room.name, room.appName);
		}
	}
	else{
		tempRoom = new chatClient.Room(room.id, room.name);
	}


	for(var i = 0; i < room.userList.length; i++){
		var user = chatClient.findUser(room.userList[i]);
		if(user === -1){
			user = new chatClient.User(room.userList[i]);
		}

		tempRoom.getUserList().push(user);
	}


	tempRoom.setHost(host);
	//tempRoom.setApp(room.app);

	return tempRoom;
};

chatClient.Room = function(id, name){
	chatClient.Room.uber.call(this, id, name);

	this._interfaceElement = new this.ListElement(this.getName());
};
chatClient.Room.uber = chat.Room;
chatClient.Room.prototype = Object.create(chat.Room.prototype);
chatClient.Room.prototype.constructor = chatClient.Room;

chatClient.Room.prototype.getInterfaceElement = function(){
	return this._interfaceElement.roomLi;
};

chatClient.Room.prototype.getApp = function(){
	return false;
};

chatClient.Room.prototype.setOnClose = function(fun){
	this._interfaceElement.onClose = fun;
};

chatClient.Room.prototype.setOnClick = function(fun){
	this._interfaceElement.onClick = fun;
};

chatClient.Room.prototype.onDelete = function(){
	//chatClient.Room.uber.prototype.onDelete.call(this);
	socketHandler.emit("chat", {action: "leaveRoom", roomId: this.getId()});
};

chatClient.Room.prototype.ListElement = function(name){
	this.onClose = function(){};
	this.onClick = function(){};
	this.roomLi;

	var roomLi = $(document.createElement('li'));
	roomLi.text(name);

	var that = this;
	roomLi.on('click', function(){
		that.onClick();
	});

	var close = $(document.createElement('span'));
	close.text("x");

	close.on('click', function(){
		that.onClose();
	});

	roomLi.prepend(close);

	this.roomLi = roomLi;
};

chatClient.GameRoom = function(id, roomName, appName){
	chatClient.GameRoom.uber.call(this, id, roomName);

	this._tab = new Tab(appName, this.getId());
	chatInterface.tabs.addTab(this._tab);
	var that = this;
	appLoader.loadNewApp(appName, this._tab, function(appInstance){
		that._app = appInstance;
	});
};

chatClient.GameRoom.uber = chatClient.Room;
chatClient.GameRoom.prototype = Object.create(chatClient.Room.prototype);
chatClient.GameRoom.prototype.constructor = chatClient.GameRoom;

chatClient.GameRoom.prototype.onDelete = function(){
	chatClient.GameRoom.uber.prototype.onDelete.call(this);
	this._app.stop();
	chatInterface.tabs.delTab(this._tab);
};

chatClient.GameRoom.prototype.onIceCandidate = function(data){//iceCandidate
	this._app.onIceCandidate(data.iceCandidate);
};

chatClient.GameRoom.prototype.readyCheck = function(senderNick, successCb, failCb){
	if(this._app.readyCheck(senderNick, this.getId())){
		successCb();
	}
	else{
		failCb();
	}

};

chatClient.GameRoom.prototype.setRemoteDescription = function(sessionDescription){
	this._app.setRemoteDescription(sessionDescription);
};

chatClient.GameRoom.prototype.getApp = function(){
	return true;
};

chatClient.ServerRoom = function(id, roomName, appName){
	chatClient.ServerRoom.uber.call(this, id, roomName, appName);

	this.addPlayButton();

	var that = this;
	appLoader.loadNewServer(appName, this, function(serverInstance){
		that._serverInstance = serverInstance;
	});
};

chatClient.ServerRoom.uber = chatClient.GameRoom;
chatClient.ServerRoom.prototype = Object.create(chatClient.GameRoom.prototype);
chatClient.ServerRoom.prototype.constructor = chatClient.ServerRoom;

chatClient.ServerRoom.prototype.onDelete = function(){
	chatClient.ServerRoom.uber.prototype.onDelete.call(this);

};

chatClient.ServerRoom.prototype.addPlayButton = function(){
	var that = this;

	this.onPlay = function(){
		that._serverInstance.startServer();
	};

	var playButton = $(document.createElement('span'));
	playButton.text("|>");
	playButton.on('click', function(){
		that.onPlay();
	});

	//this.roomLi.append(playButton);


	this.getInterfaceElement().append(playButton);
};

chatClient.ServerRoom.prototype.onIceCandidate = function(data){//iceCandidate, receiver, sender
	this._serverInstance.onIceCandidate(data.iceCandidate, data.sender);
};

chatClient.ServerRoom.prototype.onClientReady = function(clientNick){
	this._serverInstance.onClientReady(clientNick);
};

chatClient.ServerRoom.prototype.setRemoteDescription = function(sessionDescription, sender){
	this._serverInstance.setRemoteDescription(sessionDescription, sender);
};

chatClient.ServerRoom.prototype.delUser = function(user){
	chatClient.ServerRoom.uber.delUser(user);
	this._serverInstance.clientDisconnected(user.getNick());
};
// client -->