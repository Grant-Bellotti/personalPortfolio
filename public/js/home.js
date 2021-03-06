let ident;

let messageid;
let socket = io();
$.ajax({
  url: "/getmessageid",
  type: "GET",
  data: {'id':0},
  success: function(data){
    messageid = data;
  } ,
  dataType: "json"
});

//Get message from server.
socket.on('welcome', function(data) {
  let storedMessages = "4455";
  $.ajax({
   url: "/getstoredMessages",
   type: "GET",
   data: {'id':0},
   success: function(data2){
     storedMessages = data2.test;
     console.log(data2.test);
     $("#messages").append(storedMessages);
     for(let i =1; i<=data2.IDs;i++) {
      collapseIt(i);
     }
   } ,
   dataType: "json"
  });

});

//Get message from server.
socket.on('update', (data) => {
  let para = document.createElement("div");
  $.ajax({
      url: "/getmessageid",
      type: "GET",
      data: {'id':0},
      success: function(data){
        messageid = data;
       } ,
       dataType: "json"
     });
if(data.type == "Text") {
  $("#messages").append(
    '<div class="postBlock">' +
    '<p class="postli" style="background-color:'+ data.color +';">' + data.msg + ": " + data.user + '<br>'+'<body>'+data.bodyMSG+'</body>'+'</p>'+
    '<div>'+
    "<button type=button id ="+ messageid+ " class='collapsible' " + 'style="background-color:'+ data.color + ';">' + 'Comments</button>'+

        "<div id =" + "d"+ messageid + " class="+ "content"+"> " +"<hr>"
        +"<ul id=" + "p"+ messageid + "></ul>" + "<br>"
        +"<input id =" + "t" + messageid + " type="+ "text"+">"
        +"<input id =" + "c"+ messageid + " type=button name=commentb" +
        "value=PostComment onclick= " + "commentit("+  messageid + ")>" +"<br>"
      +"</div>"
      +"</div>"
      +"</div>"
  );
}
else if(data.type == "Image") {
  $("#messages").append(
    "<div class='postBlock'>" +
    "<p class='imageUser'>" + data.user + "</p>" +
    "<img id='display' class='postli'" + 'style="background-color:'+ data.color +';" src="images/' + data.msg +'"height="150" width="150">' +
    "<div>" +
    "<button type=button id ="+ messageid+ " class='collapsible' " + 'style="background-color:'+ data.color + ';">' + 'Comments</button>'+

        "<div id =" + "d"+ messageid + " class="+ "content"+"> " +"<hr>"
        +"<ul id=" + "p"+ messageid + "></ul>" + "<br>"
        +"<input id =" + "t" + messageid + " type="+ "text"+">"
        +"<input id =" + "c"+ messageid + " type=button name=commentb" +
        "value=PostComment onclick= " + "commentit("+  messageid + ")>" +"<br>"
      +"</div>"
      +"</div>"
      +"</div>"
  );
}

collapseIt(messageid);
});


socket.on('updateComments',(data) =>
{
  $("#"+"p"+data.messageID).append("<p> "+ data.user + ": " + data.text +  " <p>");
});

function changeView() {
  if ($("input:radio[name='type']:checked").val() == "Text") {
    document.getElementById("postC2").style.visibility = "visible";
    document.getElementById("postC").style.visibility = "visible";
    document.getElementById("uploader").style.visibility = "hidden";
    document.getElementById("uploader2").style.visibility = "hidden";
  }
  else if ($("input:radio[name='type']:checked").val() == "Image") {
    document.getElementById("postC").style.visibility = "hidden";
    document.getElementById("postC2").style.visibility = "hidden";
    document.getElementById("uploader").style.visibility = "visible";
    document.getElementById("uploader2").style.visibility = "visible";
  }
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;

}
/*
function doit() {
//Send message to server.
      msg = $('#postT').val();
      user = $('#tempUser').val();
      pw = $('#password').val();
      color = getRandomColor()
          $.ajax({
            url: "/check",
            type: "GET",
            data: {username:user,password:pw},
            success: function(data){
                if (data.error){
                  alert(data.message);
                }
                else {
                	socket.emit('update', {'msg': msg,'user':user,'color':color});
                }
              } ,
            dataType: "json"
          });

      return false;
}
*/



function uploadSuccess(data) {
  let type = $("input:radio[name='type']:checked").val();
  let user = $('#tempUser').val();
  let pw = $('#password').val();
  let msg = "";


  let bodyMSG = ''
  let color = getRandomColor()
  if (data.error)
  {
    alert(data.message);
    return;
  }

  $.ajax({
    url: "/check",
    type: "GET",
    data: {username:user,password:pw},
    success: function(data2){
      if (data2.error){
        alert(data2.message);
      }
      else {
        if (type == "Text") {
          msg = $('#postT').val();
          bodyMSG = $('#postC').val();

          if(msg == "") {
            alert ("title is required");
            return;
          }
          else if(bodyMSG == "") {
            alert ("message is required");
            return;
          }

        }
        else if (type == "Image") {
          msg = data.filename2;

          if(msg == "empty.webp") {
            alert ("image is required");
            return;
          }

        }

        $.ajax({
          url: "/storeMessage",
          type: "POST",
          data: {message:msg,id:messageid,user:user,type:type,color:color,comments:"",realMessage:bodyMSG},
          success: function(data){

          } ,
          dataType: "json"
        });
        socket.emit('update', {'type':type, 'msg': msg,'user':user,'color':color,'bodyMSG':bodyMSG});
        $('#postT').val("");
        $('#postC').val("");
        $('#uploader').val("");
      }
    } ,
    dataType: "json"
  });
}

function commentit(id){
let text = $("#"+"t"+id).val();
let user =  $('#tempUser').val();
let pw = $('#password').val();
if(text != ""){
  $.ajax({
    url: "/check",
    type: "GET",
    data: {username:user,password:pw},
    success: function(data){
      if (data.error){
        alert(data.message);
      }
      else {
        $.ajax({
              url: "/storeComment",
              type: "POST",
              data: {text: text,messageID:id,user:user},
              success: function(data){


              } ,
              dataType: "json"
            });
        socket.emit('updateComments', {'text': text,'messageID':id,'user': user});
        $("#"+"t"+id).val("");
      }
    } ,
    dataType: "json"
  });
}
else
  alert("you need a message");
}

function collapseIt(messageID){
var coll = document.getElementById(messageID);

  coll.addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });

}

function showPassword() {
  var input = document.getElementById("password");
  if (input.type === "password") {
    input.type = "text";
  }
  else {
    input.type = "password";
  }
}
$(document).ready(function(){
  $("form").submit(function(event) {
    let data = new FormData($(this)[0]);
    $.ajax({
      url: '/fileupload',
      type: 'POST',
      data: data,
      processData: false, // These two are needed to prevent JQuery from processing the form data
      contentType: false,
      mimeType: 'multipart/form-data',
      dataType: 'json', // Without this, the server's response will be a string instead of a JSON object
      success: uploadSuccess
    });
    return false;
  });
  changeView();
});
