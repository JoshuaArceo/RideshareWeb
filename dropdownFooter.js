$(document).ready(function() {
    //Drop down
    $("body").prepend(
        $('<div>').prop({
            id: 'dropdown',
        })
    );
    $("<button class='dropbtn'>Menu</button>").appendTo('#dropdown');
    $(" <div class='dropdown-content'>").appendTo("#dropdown");
    $("<a href='homeWall.html'>Find Users</a>").appendTo('.dropdown-content');
    $("<a href='chat.html'>Chat</a>").appendTo('.dropdown-content');
    // $("<a href='outReq.html'>Outgoing Requests</a>").appendTo('.dropdown-content');
    // $("<a href='inReq.html'>Incoming Requests</a>").appendTo('.dropdown-content');

    //Sign out
    $("body").prepend(
        $('<div>').prop({
            class: 'footer',
        })
    );
    $("<a id='userName'>Signed in as: </a>").appendTo('.footer');
    $("<a id='signOutButton' href='#' onclick='signOut();'>Sign out</a>").appendTo('.footer');
    document.getElementById("userName").innerHTML = "Signed in as: " + localStorage["email"];

    $('head').append('<link rel="stylesheet" type="text/css" href="dropdownFooter.css">');
});

function signOut() {
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    firebase.auth().signOut().then(() => {
        window.open ('index.html','_self',false);
        resetVars();
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });

}


if(!(localStorage["id"] && localStorage["name"] && localStorage["email"])){
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    window.open('index.html','_self');
}




