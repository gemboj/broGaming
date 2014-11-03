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
	}
	
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
	
	chat.Room = function(id, name){
		this._id = id;
		this._name = name;
		this._userList = [];
	};
	
	chat.Room.prototype = {
		getId: function(){
			return this._id;
		},
		
		setId: function(id){
			this._id = id;
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
chatServer.defaultRoomName = "All";
chatServer.availableRooms = [0];

chatServer.getDefaultRoomName = function(){
	return chatServer.defaultRoomName;
};	

chatServer.newRoom = function(name){
	var index = chatServer.availableRooms.shift();
	var room = new chatServer.Room(index, name);
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

chatServer.Room = function(id, name){
	chatServer.uber.Room.call(this, id, name);
}

chatServer.Room.prototype = Object.create(chat.Room.prototype);
chatServer.Room.prototype.constructor = chatServer.Room;

chatServer.Room.prototype.serialize = function(user){
	var tmp = {};
	tmp.id = this.getId();
	tmp.name = this.getName();
	tmp.userList = this.getUserNickList();
	var index = tmp.userList.indexOf(user.getNick());
	tmp.userList.splice(index, 1);
	return tmp;
}

chatServer.newRoom(chatServer.getDefaultRoomName());
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
		var room = rooms[i];
		var temp = new chatClient.Room(room.id, room.name);

		for(var i = 0; i < room.userList.length; i++){
			temp.getUserList().push(new chatClient.User(room.userList[i]));
		};
		tempArr.push(temp);
	};
	return tempArr;
};

chatClient.Room = function(id, name){
	chatClient.uber.Room.call(this, id, name);
}

chatClient.Room.prototype = Object.create(chat.Room.prototype);
chatClient.Room.prototype.constructor = chatClient.Room;

chatClient.Room.prototype.setLI = function(li){
	this.li = li;
}

chatClient.Room.prototype.getLI = function(){
	return this.li;
}
// client -->