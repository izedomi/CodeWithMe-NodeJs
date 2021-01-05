const socket = io("/");

var EditorClient = ot.EditorClient;
var SocketIOAdapter = ot.SocketIOAdapter;
var CodeMirrorAdapter = ot.CodeMirrorAdapter;


var editor = CodeMirror.fromTextArea(document.getElementById("code-screen"), {
  lineNumbers: true,
  theme: "monokai"
});


var cmClient;
var code = $('#code-screen').val();
function setDefaultEditorContent(str, revision, clients, serverAdapter){
 
  if(code.trim() == ""){
     editor.setValue(str);
  }

  cmClient = window.cmClient = new EditorClient(
    revision, clients, serverAdapter, new CodeMirrorAdapter(editor)
  );
}

socket.on('doc', function(obj){
  setDefaultEditorContent(obj.str, obj.revision, obj.clients, new SocketIOAdapter(socket));
})

