var IPADDRESS = "127.0.0.1:4000";

var socketHandler;
function socketHandlerC(socket, nick){
	var handler = {};
	handler._socket = socket;
	
	handler._events = {
		error: function(err){
			chatI.log.append("Server", err);
		},
		
		connect: function(){			
			chatI.onConnect(nick);			
			
			handler.getRooms(chatClient.getNick(), function(rooms){
				var drooms = chatClient.deserializeRooms(rooms);
				chatClient.addRooms(drooms);				
				chatClient.setCurrentRoom(drooms[0]);
				chatI.room.addUsersRoom(chatClient.getCurrentRoom());
				chatI.room.setName(chatClient.getCurrentRoom().getName());
			});
			
			
		},
		//data.nick, data.msg
		chatMsg: function(data){
			chatI.log.append(data.nick, data.msg);
		},
		//nick, roomId
		delUser: function(data){
			var room = chat.findRoom(data.roomId);
			if(room != -1){
				room.delUser(data.nick);
				chatI.room.delUser(data.nick);
			}
		},
		//nick, roomId
		addUser: function(data){
			var room = chat.findRoom(data.roomId);
			if(room != -1){
				var user = chatClient.findUser(data.nick);
				if(user == -1){
					user = new chatClient.User(data.nick);					
				}
				
				room.addUser(user);
				chatI.room.addUser(user);				
			}
		},
		//data.oldNick, data.newNick
		changeNick: function(data){
			chatClient.setNick(data.newNick);
			chat.room.changeNick(data.oldNick, data.newNick);
		}
	};
	
	/*handler.getUserList = function(roomName, cb){
		handler._socket.emit("getUserList", roomName, function(userList){	
			if(cb){
				cb(userList)
			};
		});
	};*/
	
	handler.getRooms = function(nick, cb){
		handler._socket.emit("getRooms", null, function(rooms){
			if(cb){
				cb(rooms)
			};
		});
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

var chatI = (function(){
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
		},
		
		onConnect: function(nick){
			var that = this;
			$(this.connectBId).fadeToggle("slow", function(){
				$(that.changeNickBId).fadeToggle("slow");
			});
			
			$(this.nickIId).on("keyup", function(){
				socketHandler.emit("validateNick", that.getNickI(), function(valid){
					if(valid){
						$(that.nickIId).css("color", "black");
						
					}
					else{
						$(that.nickIId).css("color", "red");
					};
				});
			});
			
			$(this.createRoomBId).on("click", function(){
				var roomName = that.getRoomNameI();
				socketHandler.emit("createRoom", roomName, function(index){
					var room = new chatClient.Room(index, roomName);
					chatClient.addRoom(room);
					//chatClient.setCurrentRoom(room);
					that.roomsList.addRoom(index, roomName);
				});
			});
			
			$(this.changeNickBId).on("click", function(){
				var newNick = that.getNickI();
				socketHandler.emit("changeNick", newNick, function(){			
					chat.setNick(newNick);
				});
			});
			
			
			
			//$(this.msgFId).attr("action", "javascript:chat.sendMsg();");
			$(this.msgFId).on("submit", function(){
				socketHandler.emit("chatMsg", {nick: that.getNickI(), msg: that.getMsgI(), roomId: chatClient.getCurrentRoom().getId()});
				that.clearMsgI();
			});
			
			$(this.room.listBId).on("click", function(){
				//$(that.roomsList.roomsListId).slideToggle();
				$(that.roomsList.roomsListId).fadeToggle();				
			});

		}
	};
	
	chatI.room = {
		id: "#chatRoom",
		nameId: "#roomName",
		listBId: "#chooseRoom",
		
		addUsers: function(users){	
			for(var i = 0; i < users.length; i++){
				var nick = users[i].getNick();
				$(this.id).append('<li id="' + nick + '"><span>' + nick + '</span></li>');
			};
		},
		
		addUsersRoom: function(room){
			var arr = room.getUserList();
			this.addUsers(arr);
		},
		
		addUser: function(user){
			var nick = user.getNick();
			$(this.id).append('<li id="' + nick + '"><span>' + nick + '</span></li>');
		},
		
		delUser: function(nick){
			$(this.id + " #" + nick).remove();
		},
		
		
		changeNick: function(oldNick, newNick){
			$(this.id + " [id='" + oldNick + "'] span").text(newNick);
			$(this.id + " [id='" + oldNick + "']").attr("id", newNick);
		},
		
		clearList: function(){
			$(this.id + " li").remove();
		},
		
		setName: function(roomName){
			$(this.nameId).text(roomName);
		}
	};
    
    chatI.roomsList = {
        roomsListId: "#roomsList",
        
        addRoom: function(id, name){
            $(this.roomsListId).append('<li>' + name + '</li>');
			var li = $(this.roomsListId + "li:contains('" + name + "')")[0];
			jQuery.data(li, {id: id});
        }
    };
	
	chatI.log = {
		id: ".chatLog",
		
		append: function(nick, msg){
			$(this.id).append(nick + ": " + msg + "\n");	
		}
	};
	
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
		var nick = chatI.getNickI();
		chatClient.setUser(nick);
		
		var socket = io.connect(IPADDRESS, { 'force new connection': true, query:  "nick="+ nick});
		socketHandlerC(socket, nick);//socket handler constructor
	});
	
	$("#appsCon > *").on("click", function(evt){
		tabs.addTab(new Tab($(this).attr("id")));
	});
    
    $.ajaxSetup({ 
        cache: true 
    }); 
	//webGLStart();
});