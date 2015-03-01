var IPADDRESS = "37.247.60.6:4000";

var socketHandler = {};
socketHandler.events = [];//queue events before socketHandler is created
socketHandler.addEvents = function(events){
	this.events.push(events);
};

function socketHandlerC(socket, nick){
	var handler = {};
	handler._socket = socket;
	
	handler._events = {
		error: function(err){
			chatInterface.log.append("Server", err);
		},
		
		connect: function(){			
			chatApp.onConnect(nick);

			handler.emit("chat", {action: "getRooms"}, function(rooms){
				var drooms = chatClient.deserializeRooms(rooms);
				chatClient.addRooms(drooms);
				chatInterface.room.addRooms(drooms);
				chatApp.setCurrentRoom(drooms[0]);
			});
		}
	};
		
	handler.emit = function(evt, arg, cb){
		handler._socket.emit(evt, arg, cb);
	};
	
	handler.addEvents = function(events){
		for(var event in events){
			handler._socket.on(event, events[event]);
		}
	};

	handler.removeEvent = function(eventName){
		this._socket.removeAllListeners(eventName)
	};
	
	handler.addEvents(handler._events);
	for(var i = 0; i < socketHandler.events.length; i++){
		handler.addEvents(socketHandler.events[i]);
	};

	socketHandler = handler;
}


var chatApp = {
	ctxMenu: null,
	onConnect: function(nick){
		socketHandler.addEvents(this.chatEvents);

		var that = chatInterface;
		$(that.connectBId).fadeToggle("slow", function(){
			$(that.changeNickBId).fadeToggle("slow");
		});

		$(that.nickIId).on("keyup", function(){
			socketHandler.emit("chat", {action: "validateNick", nick: that.getNickI()}, function(valid){
				if(valid){
					$(that.nickIId).css("color", "black");
				}
				else{
					$(that.nickIId).css("color", "red");
				};
			});
		});

		$(that.createRoomBId).on("click", function(){
			chatApp.createRoom(that.getRoomNameI());
		});

		$(that.changeNickBId).on("click", function(){
			var newNick = that.getNickI();
			socketHandler.emit("chat", {action: "changeNick", newNick: newNick}, function(data){
				if(typeof data == "string"){
					chatInterface.log.append("Server", data);
					return;
				}
				chatApp.changeNick(data.oldNick, data.newNick);
				//chatInterface.room.setNick(newNick);
			});
		});

		//$(that.msgFId).attr("action", "javascript:chat.sendMsg();");
		$(that.msgFId).on("submit", function(){
			socketHandler.emit("chat", {action: "chatMsg", nick: that.getNickI(), msg: that.getMsgI(), roomId: chatClient.getCurrentRoom().getId()});
			that.clearMsgI();
		});

		$(that.room.listBId).on("click", function(){
			//$(that.roomsList.roomsListId).slideToggle();
			$(that.room.roomsListId).fadeToggle();
		});

		$('#appsCon > *').on("click", function(evt){
			chatApp.createRoom(Tab.prototype.makeHeader($(this).attr("id")), $(this).attr("id"));
		});

		$(window).click(function(){
			chatApp.setCtxMenu(null);
		});
	},

	chatEvents: {
		//data.nick, data.msg
		chatMsg: function(data){
			chatInterface.log.append(data.nick, data.msg);
		},
		//nick, roomId
		userDisconnected: function(data){
			var room = chatClient.findRoom(data.roomId),
				user = chatClient.findUser(data.nick);
			chatApp.delUser(room, user);
		},
		//nick, roomId
		addUser: function(data){
			var room = chatClient.findRoom(data.roomId),
				user = chatClient.findUser(data.nick);

			if(user == -1){
				user = new chatClient.User(data.nick);
			}

			chatApp.addUser(room, user);
		},
		//data.oldNick, data.newNick
		changeNick: function(data){
			chatApp.changeNick(data.oldNick, data.newNick);
			/*chatClient.setNick(data.newNick);
			 chat.room.changeNick(data.oldNick, data.newNick);*/
		},

		inviteRoom: function(data){
			chatInterface.notifications.createNotif({
				info: "Invite to room: " + data.roomName,
				yesFunction: function(){
					data.action = "joinRoom";

					socketHandler.emit("chat", data, function(room){
						chatApp.joinedRoom(room);
					});
				},
				noFunction: function(){

				}
			});
		}
	},

	joinedRoom: function(room){
		var deserializedRoom = chatClient.deserializeRoom(room);
		chatApp.addRoom(deserializedRoom);
		$(chatInterface.room.roomsListId).fadeIn();
		return deserializedRoom;
	},

	setCtxMenu: function(menu){
		var m = this.ctxMenu;
		if(m){
			m.remove();
		}
		this.ctxMenu = menu;
	},

	createRoom: function(roomName, appName){
		socketHandler.emit("chat", {action: "createRoom", roomName: roomName, appName: appName}, function(room){
			chatApp.joinedRoom(room);
		});
	},

	setCurrentRoom: function(room) {
		chatClient.setCurrentRoom(room);
		chatInterface.room.setCurrentRoom(room);
		chatInterface.room.clearUserList();
		chatInterface.room.addUsersRoom(room);
	},

	addRoom: function(room){
		chatClient.addRoom(room);
		chatInterface.room.addRoom(room);
	},

	addRooms: function(rooms){
		for(var i = 0; i < rooms.length; i++){
			chatApp.addRoom(rooms[i]);
		}
	},

	delRoom: function(room){
		if(!chatClient.delRoom(room)) {
			if (room === chatClient.getCurrentRoom()) {
				if (chatClient.getRooms().length === 0) {
					chatApp.setCurrentRoom(new chatClient.Room(-1, "not in room"));
				}
				else {
					chatApp.setCurrentRoom(chatClient.getRooms()[0]);
				}
			}
			chatInterface.room.delRoom(room);
		}
	},

	delUser: function(room, user){
		room.delUser(user);
		if(chatClient.getCurrentRoom() === room){
			chatInterface.room.delUser(user);
		}
	},

	addUser: function(room, user){
		room.addUser(user);
		if(chatClient.getCurrentRoom() === room){
			chatInterface.room.addUser(user);
		}
	},

	changeNick: function(oldNick, newNick){
		var user = chatClient.findUser(oldNick);
		if(user != -1) {
			user.setNick(newNick);
			chatInterface.room.changeNick(oldNick, newNick);
		}
	},

	getInviteRoomFunction: function(roomId, roomName, nick){
		return function(){
			socketHandler.emit("chat", {action: "inviteRoom", roomId: roomId, roomName:roomName , inviteReceiver: nick});
		}
	},

	getPlayAppFunction: function(room){
		return function(){
			socketHandler.emit("chat", {action: "lockRoom", roomId: room.getId()}, function(){
				//socketHandler.emit("broadcastRoom", {action: "appCheck", roomId: room.getId()});
				//appLoader.loadNewServer(room.getApp().getName(), room);
			});

			alert("play!");
		}
	}
};

var chatInterface = (function(){
	var chatI = {
		msgIId: "#inputMsg",//I - input
		nickIId: "#inputNick",
		roomNameIId: "#inputRoomName",
		connectBId: "#connect",//B - button
		changeNickBId: "#changeNick",
		createRoomBId: "#createRoom",
		msgFId: "#messageForm",//F - form
        
		getMsgI: function(){
			return $(this.msgIId).val();
		},
		
		getRoomNameI: function(){
			return $(this.roomNameIId).val().trim();
		},
		
		clearMsgI: function(){
			$(this.msgIId).val("");
		},
		
		getNickI: function(){
			return $(this.nickIId).val().trim();
		}
	};
	
	chatI.room = {
		id: "#chatRoom",
		nameId: "#roomName",
		listBId: "#chooseRoom",
		roomsListId: "#roomsList",

		addUsers: function(users){	
			for(var i = 0; i < users.length; i++){
				this.addUser(users[i]);
				//var nick = users[i].getNick();
				//$(this.id).append('<li id="' + nick + '"><span>' + nick + '</span></li>');
			};
		},
		
		addUsersRoom: function(room){
			var arr = room.getUserList();
			this.addUsers(arr);
		},
		
		addUser: function(user){
			var nick = user.getNick();
			//$(this.id).append('<li id="' + nick + '"><span>' + nick + '</span></li>');
			var li = $(document.createElement('li'));

			var nickSpan = $(document.createElement('span'));
			nickSpan.text(nick);

			li.append(nickSpan);

			li.click(function(evt){
				var x = evt.clientX;
				var y = evt.clientY;

				chatInterface.playerCtxMenu.createMenu(x, y, nick);
				evt.stopPropagation();
			});

			$(this.id).append(li);
		},
		
		delUser: function(user){
			$(this.id + " > li").filter(function(){
				return ($(this).text() === user.getNick());
			}).remove();
		},
		
		changeNick: function(oldNick, newNick){
			$(this.id + " > li > span").filter(function(){
				return ($(this).text() === oldNick);
			}).text(newNick);
		},
		
		clearUserList: function(){
			$(this.id + "> li").remove();
		},
		
		setCurrentRoom: function(room){
			$(this.nameId).text(room.getName());
		},

		clearRoomList: function(){
			$(this.roomsListId + "> li").remove();
		},

		addRoom: function(room){
			room.setOnClick(function(){
				chatApp.setCurrentRoom(room);
			});

			room.setOnClose(function(){
				chatApp.delRoom(room);
			});

			$(this.roomsListId).append(room.getInterfaceElement());
		},

		addRooms: function(rooms){
			for(var i = 0; i < rooms.length; i++){
				this.addRoom(rooms[i]);
			}
		},

		delRoom: function(room){
			room.getInterfaceElement().remove();
		}
	};
	
	chatI.log = {
		id: ".chatLog",

		append: function(nick, msg){
			$(this.id).append(nick + ": " + msg + "\n");	
		}
	};

	chatI.playerCtxMenu = {
		id: ".playerCtxMenu",
		width: 200,

		createMenu: function(x, y, nick){
			var div = $(document.createElement('div'));
			div.attr("class", "playerCtxMenu");
			div.css("width", this.width + "px");
			div.css("top", y + "px");
			div.css("left", (x - this.width) + "px");

			var chatRooms = $(document.createElement('ul')),
				gameRooms = $(document.createElement('ul'));

			var rooms = chatClient.getRooms();
			for(var i = 0; i < rooms.length; i++){
				var li = $(document.createElement('li'));
				li.text(rooms[i].getName());


				li.click(chatApp.getInviteRoomFunction(rooms[i].getId(), rooms[i].getName(), nick));

				var roomApp = rooms[i].getApp();
				if(roomApp){
					gameRooms.append(li);
				}
				else{
					chatRooms.append(li);
				}
			}
			var chatRoomsHeader = $(document.createElement('p')),
				gameRoomsHeader = $(document.createElement('p'));
			chatRoomsHeader.text("Chat Rooms:");
			gameRoomsHeader.text("Game Rooms:");
			chatRoomsHeader.hover(function(){
				chatRooms.fadeIn("fast");
				gameRooms.fadeOut("fast");
			}, function(){});

			gameRoomsHeader.hover(function(){
				chatRooms.fadeOut("fast");
				gameRooms.fadeIn("fast");
			}, function(){});

			div.append(chatRoomsHeader);
			div.append(chatRooms);
			div.append(gameRoomsHeader);
			div.append(gameRooms);

			$("body").append(div);
			chatApp.setCtxMenu(div);
		}
	};

	chatI.notifications = {
		notificationsId: "#notifications",
		createNotif: function(input){
			var notif = $(document.createElement('div'));
			notif.text(input.info);

			var temp = $(document.createElement('div'));
			var yes = $(document.createElement('span'));
			var no = $(document.createElement('span'));

			temp.attr("class", "flexContainerH");
			yes.attr("class", "flexFull");
			no.attr("class", "flexFull");

			yes.text("yes");
			no.text("no");

			yes.click(function(){
				input.yesFunction();

				notif.remove();
			});
			no.click(function(){
				input.noFunction();

				notif.remove();
			});

			temp.append(yes);
			temp.append(no);

			notif.append(temp);

			$(this.notificationsId).append(notif);
		}
	};

	chatI.tabs = function(){
		var tabs = {};
		tabs.navId = ".navigation";
		tabs.conId = ".content";
		tabs.list = [];//does not contain Chat i Apps tabs;

		tabs.getNavId = function(){
			return tabs.navId;
		};

		tabs.getConId = function(){
			return tabs.conId;
		};

		tabs.addTab = function(tab){
			tabs.list.push(tab);

			$(tabs.getNavId()).append(tab.getNav());
			$(tabs.getConId()).append(tab.getCon());

			tab.setOnClick(tabs.changeTabCb);

			tabs.changeTab(tab);
		};

		tabs.delTab = function(tab){
			var index = tabs.list.indexOf(tab);
			if(index === -1){
				console.log("Tab " + tab.getName() + " does not exist.");
				return;
			}
			tabs.list.splice(index, 1);

			$(tab.getNav()).remove();
			$(tab.getCon()).remove();
		};

		tabs.changeTab = function(destTab){
			destTab.getCon().css("display", "flex").siblings().hide();
			destTab.getNav().addClass('selected').siblings().removeClass('selected');
		};

		tabs.changeTabCb = function(evt, _that){//callback function for onclick event
			var that = _that || this;
			var currentAttrValue = $(that).attr('href');

			// Show/Hide Tabs
			$('.tabs ' + currentAttrValue).css("display", "flex").siblings().hide();

			// Change/remove current tab to active
			$(that).parent('li').addClass('selected').siblings().removeClass('selected');

			evt.preventDefault();
		};

		return tabs;
	}();

	return chatI;
})();

var appLoader = function(){
	var loader = {};
	loader.loadedAppConstructors = {};

	loader.loadNewApp = function(name, tab, cb){
		var that = this;
		this.loadConstructor(name, name, function(){
			var appInstance = new that.loadedAppConstructors[name](tab.getName(), tab.getCon());
			cb(appInstance);
		});
	};

	loader.loadNewServer = function(appName, room, cb){
		var that = this,
			serverName = appName + "Server";
		this.loadConstructor(appName, serverName, function(){
			var serverInstance = new that.loadedAppConstructors[serverName](room);
			cb(serverInstance);
		});
	};

	loader.addConstructor = function(name, constructor){
		this.loadedAppConstructors[name] = constructor;
	};

	loader.loadConstructor = function(appName, fileName, cb){
		if(!this.loadedAppConstructors[fileName]){
			$.getScript("http://" + IPADDRESS +"/apps/" + appName + "/" + fileName + ".js", function(data, status, jqxhr){
				cb();
			});
		}
		else{
			cb();
		}
	};

	return loader;
}();

function Tab(name, id){
	this._name = name + id;
	this._fileName = name;
	this._header = this.makeHeader(name);

	this._onClick = function(){};

	this._createNav();
	this._createCon();
}

Tab.prototype = {
	getName: function(){
		return this._name;
	},

	getHeader: function(){
		return this._header;
	},

	getFileName: function(){
		return this._fileName;
	},

	getNav: function(){
		return this._nav;
	},
	
	getCon: function(){
		return this._con;
	},

	setOnClick: function(fun){
		this._onClick = fun;
	},

	_createNav: function(){
		//this._navHtml = '<li id="' + this._name + 'Nav"><a href=' + this._conId + '>' + this._header + '</a></li>';
		var tabLi = $(document.createElement('li'));
		tabLi.attr("id", this._name + "Nav");

		var tabA = $(document.createElement('a'));
		tabA.attr("href", "#" + this._name + "Con");
		tabA.text(this._header);

		var that = this;
		tabA.on('click', function(evt){
			that._onClick(evt, this);
		});
		tabLi.append(tabA);

		this._nav = tabLi;
	},

	_createCon: function(){
		//this._conHtml = '<div id="' + this._name + 'Con" class="tab"></div>';
		var tabDiv = $(document.createElement('div'));
		tabDiv.attr("id", this._name + "Con");
		tabDiv.attr("class", "tab");

		this._con = tabDiv;
	},
	
	makeHeader: function(_name){
		var arr;	
		var name = _name.slice(0, _name.length);
		
		var re = /([A-Z])/g;	
		arr = re.exec(name)
		name = name.replace(re, " " + "$&");	
		
		re = /^(\w)/g;
		arr = re.exec(name);
		name = name.replace(arr[1], arr[1].toUpperCase());
		
		return name;
	}
};
  
  
$("document").ready(function(){
	
	//tabs
	$(".tabs .navigation a").on('click', chatInterface.tabs.changeTabCb);
	$("#connect").on("click", function(){
		var nick = chatInterface.getNickI();
		chatClient.setUser(nick);
		
		var socket = io.connect(IPADDRESS, { 'force new connection': true, query:  "nick="+ nick});
		socketHandlerC(socket, nick);//socket handler constructor
	});
    
    $.ajaxSetup({ 
        cache: true 
    });
});