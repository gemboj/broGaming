var IPADDRESS = "127.0.0.1:4000";

var socketHandler;
function socketHandlerC(socket, nick){
	var handler = {};
	handler._socket = socket;
	
	handler._events = {
		error: function(err){
			chatInterface.log.append("Server", err);
		},
		
		connect: function(){			
			chatApp.onConnect(nick);

			handler.emit("getRooms", null, function(rooms){
				var drooms = chatClient.deserializeRooms(rooms);
				chatClient.addRooms(drooms);
				chatInterface.room.addRooms(drooms);
				chatApp.setCurrentRoom(drooms[0]);
			});
		},
		//data.nick, data.msg
		chatMsg: function(data){
			chatInterface.log.append(data.nick, data.msg);
		},
		//nick, roomId
		delUser: function(data){
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
					handler.emit("joinRoom", data.roomId, function(room){
						var droom = chatClient.deserializeRooms(room);
						chatApp.addRooms(droom);
						$(chatInterface.room.roomsListId).fadeIn();
					});
				},
				noFunction: function(){

				}
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
	
	handler.addEvents(handler._events);
	
	socketHandler = handler;
}


var chatApp = {
	appId: 0,
	ctxMenu: null,
	onConnect: function(nick){
		var that = chatInterface;
		$(that.connectBId).fadeToggle("slow", function(){
			$(that.changeNickBId).fadeToggle("slow");
		});

		$(that.nickIId).on("keyup", function(){
			socketHandler.emit("validateNick", that.getNickI(), function(valid){
				if(valid){
					$(that.nickIId).css("color", "black");
				}
				else{
					$(that.nickIId).css("color", "red");
				};
			});
		});

		$(that.createRoomBId).on("click", function(){
			var roomName = that.getRoomNameI();
			socketHandler.emit("createRoom", roomName, function(room){
				var rooms = chatClient.deserializeRooms(room);
				chatApp.addRooms(rooms);
				$(chatInterface.room.roomsListId).fadeIn();
			});
		});

		$(that.changeNickBId).on("click", function(){
			var newNick = that.getNickI();
			socketHandler.emit("changeNick", newNick, function(data){
				if(typeof data == "string"){
					chatInterface.log.append("Server", info);
					return;
				}
				chatApp.changeNick(data.oldNick, data.newNick);
				//chatInterface.room.setNick(newNick);
			});
		});

		//$(that.msgFId).attr("action", "javascript:chat.sendMsg();");
		$(that.msgFId).on("submit", function(){
			socketHandler.emit("chatMsg", {nick: that.getNickI(), msg: that.getMsgI(), roomId: chatClient.getCurrentRoom().getId()});
			that.clearMsgI();
		});

		$(that.room.listBId).on("click", function(){
			//$(that.roomsList.roomsListId).slideToggle();
			$(that.room.roomsListId).fadeToggle();
		});

		$("#appsCon > *").on("click", function(evt){
			tabs.addTab(new Tab($(this).attr("id") + chatApp.appId));
			chatApp.appId++;
		});

		$(window).click(function(){
			chatApp.setCtxMenu(null);
		});
	},

	setCtxMenu: function(menu){
		var m = this.ctxMenu;
		if(m){
			m.remove();
		}
		this.ctxMenu = menu;
	},

	setCurrentRoom: function(room) {
		chatClient.setCurrentRoom(room);
		chatInterface.room.setCurrentRoom(room);
		chatInterface.room.clearUserList();
		chatInterface.room.addUsersRoom(room);
	},

	addRoom: function(room){
		//socketHandler.emit("joinRoom", room.getId());
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
			room.getLI().remove();
			socketHandler.emit("leaveRoom", room.getId());
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
	}
}

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
			var id = room.getId(), name = room.getName();
			var roomI = $(document.createElement('li'));

			room.setLI(roomI);

			roomI.text(name);
			roomI.data({id: id});

			roomI.on('click', function(){
				chatApp.setCurrentRoom(room);
			});

			var close = $(document.createElement('span'));
			close.text("x");

			close.on('click', function(){
				chatApp.delRoom(room);
			})

			roomI.prepend(close);

			$(this.roomsListId).append(roomI);
		},

		addRooms: function(rooms){
			for(var i = 0; i < rooms.length; i++){
				this.addRoom(rooms[i]);
			}
		},

		delRoom: function(room){
			room.getLI().remove();
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
		width: 100,

		createMenu: function(x, y, nick){
			var ul = $(document.createElement('ul'));
			ul.attr("class", "playerCtxMenu");

			ul.css("top", y + "px");
			ul.css("left", (x - this.width) + "px");

			var rooms = chatClient.getRooms();
			for(var i = 0; i < rooms.length; i++){
				var li = $(document.createElement('ul'));
				li.text(rooms[i].getName());

				li.click(this.inviteRoomFun(ul, rooms[i].getId(), rooms[i].getName(), nick));

				ul.append(li);
			}

			$("body").append(ul);
			chatApp.setCtxMenu(ul);
		},

		inviteRoomFun: function(ul, roomId, roomName, nick){
			return function(){
				socketHandler.emit("inviteRoom", {roomId: roomId, roomName:roomName , inviteReceiver: nick});
				//ul.remove();
				//chatApp.ctxMenu = null;
			}
		}
	};

	chatI.notifications = {
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

			$("#notifications").append(notif);
		}
	}



	return chatI;
})();

var tabs = function(){
	var tabs = {};
	tabs.navId = ".navigation";
	tabs.conId = ".content";
	tabs.list = [];//does not contain Chat i Apps tabs;
	tabs.defaultList = [];//default tabs
	
	tabs.getNavId = function(){
		return tabs.navId;
	};
	
	tabs.getConId = function(){
		return tabs.conId;
	};
	
	tabs.addTab = function(tab){
		tabs.list.push(tab);
		
		$(tabs.getNavId()).append(tab.getNavHtml());
		$(tab.getNavId() + " a").on("click", tabs.changeTabCb);
		
		var name = tab.getName();
		$(tabs.getConId()).append(tab.getConHtml());
		$(tab.getConId()).load("./apps/" + name + "/" + name + ".html");
		
		tabs.changeTab(tab);
		
        $.getScript("http://localhost:4000/apps/" + name + "/" + name + ".js", function(data, status, jqxhr){
			var a = 5;
		});
	};
	
	/*tabs.delTab = function(tabId){
		var index = tabs.list.indexOf(tabId);
		if(index === -1){
			console.log("Tab " + tabId + " does not exist.");
		}
		
		tabs.list.splice(index, 1);
		$(tabs.getNavId() + " a[href=" + tabId + "]").remove();
		
	};*/
	
	tabs.changeTab = function(destTab){
		$('.tabs ' + destTab.getConId()).css("display", "flex").siblings().hide();
		$('.tabs ' + destTab.getNavId()).addClass('selected').siblings().removeClass('selected');
	};
	
	tabs.changeTabCb = function(evt){//callback function for onclick event
		var currentAttrValue = $(this).attr('href');
 
        // Show/Hide Tabs
        $('.tabs ' + currentAttrValue).css("display", "flex").siblings().hide();
 
        // Change/remove current tab to active
        $(this).parent('li').addClass('selected').siblings().removeClass('selected');
		
		evt.preventDefault();
	};
	
	tabs.init = function(){
		$(".navigation > li > a").each(function(index){
			tabs.defaultList.push($(this).attr("href"));
		});
	};
	
	tabs.init();
	
	return tabs;
}();

function Tab(name){
	this._name = name;
	this._header = this.makeHeader(name);
	
	this._navId = "#" + name + "Nav";
	this._conId = "#" + name + "Con";
	
	this._navHtml = '<li id="' + name + 'Nav"><a href=' + this._conId + '>' + this._header + '</a></li>';
	this._conHtml = '<div id="' + name + 'Con" class="tab"></div>';
};

Tab.prototype = {
	getName: function(){
		return this._name;
	},
	
	getNavId: function(){
		return this._navId;
	},
	
	getConId: function(){
		return this._conId;
	},
	
	getNavHtml: function(){
		return this._navHtml;
	},
	
	getConHtml: function(){
		return this._conHtml;
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
	$(".tabs .navigation a").on('click', tabs.changeTabCb);
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