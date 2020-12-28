'use strict';

const socketIO = require('socket.io');
var ot = require('ot');
const { callbackPromise } = require('nodemailer/lib/shared');
const task_model = require('./models/task_model');
var roomList = {};


module.exports = (server) => {

    const io = socketIO(server);

    var str = "This is a markdown heading \n\n var i = i + 1";
    
    io.on('connection', socket => {

        socket.on('joinRoom', function(data){

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
        })
        
        socket.on('chatMessage', function(data){
            io.to(socket.roomId).emit('chatMessage', data);
        })

        socket.on('hideCallButton', function(data){
            io.to(socket.roomId).emit('hideCallButton', data);
        });

        socket.on('endCall', function(data){
            io.to(socket.roomId).emit('endCall', data);
        })

        socket.on('disconnect', function(){
            socket.leave(socket.roomId);
        })

    });
}

