//const socket = io("/");
const chatInputBox = document.getElementById("chat_message");
const all_messages = document.getElementById("all_messages");
const main__chat__window = document.getElementById("main__chat__window");
const videoGrid = document.getElementById("video-grid");
var total_participants = document.getElementById("total-participants");
const myVideo = document.createElement("video");
myVideo.muted = true;

const userId = Math.floor(Math.random() * 9999).toString();
const userName = "User"+userId;


var peer = new Peer();
var peerList = {};

let myVideoStream;


var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

  

    socket.on("userConnected", (userId) => {
      connectToNewUser(userId, stream);
    });

    document.addEventListener("keydown", (e) => {
      if (e.keyCode === 13 && chatInputBox.value != "") {
        socket.emit("chatMessage", chatInputBox.value);
        chatInputBox.value = "";
      }
    });

    socket.on("createMessage", (data) => {
      console.log(data);
      let li = document.createElement("li");
      li.innerHTML = userMessage(data.username, data.message)
      all_messages.append(li);
      main__chat__window.scrollTop = main__chat__window.scrollHeight;
    });

  });

  var userMessage = function(name, text){
    return (
      '<div class="card mb-3">'+
        '<div class="row">'+
          '<div class="col-md-8">'+
            '<div>'+
              '<span class="card-text msg-text">'+ text + '</span><br/>'+
              '<small class="text-muted user"> sender: '+ name + '</small>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'
    );
  }


socket.on("userDisconnected", (userId,) => {
    if(peerList[userId]) peerList[userId].close()
    let totalUsers = document.getElementsByTagName("video").length;
    total_participants.innerHTML = totalUsers;
})

peer.on("call", function (call) {
  getUserMedia(
    { video: true, audio: true },
    function (stream) {
      call.answer(stream); // Answer the call with an A/V stream.
      const video = document.createElement("video");
      call.on("stream", function (remoteStream) {
        addVideoStream(video, remoteStream);
      });

      call.on('close', () => {
        video.remove()
        let totalUsers = document.getElementsByTagName("video").length;
        total_participants.innerHTML = totalUsers;
      })

      peerList[peer.id] = call;
    },
    function (err) {
      console.log("Failed to get local stream", err);
    }
  );
});

peer.on("open", (id) => {
    //console.log(id);
    socket.emit("joinRoom", {roomId: ROOM_ID, userid: id, username: userName});
});


// CHAT
const connectToNewUser = (userId, streams) => {
  
    var call = peer.call(userId, streams);
    console.log(call);
    var video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
        //console.log(userVideoStream);
        addVideoStream(video, userVideoStream);
    });

    call.on("close", () =>{
      video.remove()
      let totalUsers = document.getElementsByTagName("video").length;
      total_participants.innerHTML = totalUsers;
    });
    peerList[userId] = call;

};



const addVideoStream = (videoEl, stream) => {
    videoEl.srcObject = stream;
    videoEl.addEventListener("loadedmetadata", () => {
        videoEl.play();
    });

    videoGrid.append(videoEl);
    let totalUsers = document.getElementsByTagName("video").length;
    
    if (totalUsers > 1) {
        for (let index = 0; index < totalUsers; index++) {
        document.getElementsByTagName("video")[index].style.width =
            100 / totalUsers + "%";
        }
    }

    //total_participants.innerHTML = totalUsers;
   
};



const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setPlayVideo = () => {
  const html = `<i class="unmute fa fa-pause-circle"></i>
  <span class="unmute">Resume Video</span>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};

const setStopVideo = () => {
  const html = `<i class=" fa fa-video-camera"></i>
  <span class="">Pause Video</span>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `<i class="unmute fa fa-microphone-slash"></i>
  <span class="unmute">Unmute</span>`;
  document.getElementById("muteButton").innerHTML = html;
};
const setMuteButton = () => {
  const html = `<i class="fa fa-microphone"></i>
  <span>Mute</span>`;
  document.getElementById("muteButton").innerHTML = html;
};
