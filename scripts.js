var socket = io();
$(() => {
    $("#send").click(() => {
        var message = {name : $("#name").val(), message: $("#message").val()};
        postMessage(message);
    });
    getMessages();
})

socket.on("message",addMessage);

function addMessage(message){
    $('#messages').append(`<h4>${message.name}</h4> <p>${message.message}</p>`);
}

function getMessages(){
    $.get("https://agile-beyond-98031.herokuapp.com/messages",(data) => {
        console.log(data);
        data.forEach(msg => addMessage(msg));
    });
}

function postMessage(message){
    $.post("https://agile-beyond-98031.herokuapp.com/messages", message);
}