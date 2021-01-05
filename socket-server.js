'use strict';

const socketIO = require('socket.io');
var ot = require('ot');
const task_model = require('./models/task_model');
var roomList = {};


module.exports = (server) => {

    const io = socketIO(server);

    var str = "This is a markdown heading \n\n var i = i + 1";
    
    io.on('connection', socket => {

        socket.on('joinRoom', function(data){

            //console.log("user joined room")

            //auto save editor content
            if(!roomList[data.roomId]){
                var socketIOServer = new ot.EditorSocketIOServer(str, [], data.roomId, function(socket, cb){
                    var self = this;
                    task_model.findByIdAndUpdate(data.roomId, {content: self.document}, function(err){
                        if(err){
                           return cb(false)
                        }
                        cb(true)
                    })
                })

                roomList[data.roomId] = socketIOServer;
            }

            roomList[data.roomId].addClient(socket);
            roomList[data.roomId].setName(socket, data.username);

            socket.roomId = data.roomId;
            socket.join(data.roomId)
            io.to(socket.roomId).emit('userConnected', data.userid);

            socket.on('disconnect', () => {
                //console.log(data.userid + "sssssss")
                //socket.leave(socket.roomId);
                io.to(socket.roomId).emit('userDisconnected', data.userid);
            })

            socket.on('chatMessage', function(msg){
                io.to(socket.roomId).emit('createMessage', {message: msg, username: data.username});
            })
        })
        
       


    });
}

