window.addEventListener('load', function () {
    console.log(localStorage["id"])
    console.log(localStorage["name"])
    console.log(localStorage["email"])
    if(!(localStorage["id"] && localStorage["name"] && localStorage["email"])){
        localStorage.removeItem("id");
        localStorage.removeItem("email");
        localStorage.removeItem("name");
        window.open('index.html','_self');
    }
    //ID:DATE:MESSAGE
    //ID:DATE:MESSAGE
    firebase.database().ref('Conant/Students').once('value', function (snapshot) {
        snapshot.forEach(function (item) {
            if(item.val().ID!==localStorage["id"]) {
                var a = document.createElement('a');
                // a.onclick= () => {console.log("test")};
                a.innerText = item.val().Name;
                a.onclick = () => {
                    openChat(item.val());
                    window.history.replaceState(null, null, "?uid=" + item.val().ID);
                }

                document.getElementById("cdropdown-content").appendChild(a);
            }
        });
    });
    firstOpen()
})

function firstOpen() {
    const urlSearchParams = new URLSearchParams(window.location.search)
    chatID = urlSearchParams.get("uid")
    if(chatID){
        firebase.database().ref('Conant/Students').once('value', function (snapshot) {
            snapshot.forEach(function (item) {
                if (item.val().ID === chatID) {
                    openChat(item.val())
                }
            });
        });
    }
}


    let chats = []
    let chattingUser = {
        ID: "NULLNONENANONENULL"
    }
    function openChat(user) {

        $("#textInp").on('keypress', function (e) {
            if (e.which === 13) {
                sendChat();
            }
        });

        if (chattingUser.ID !== user.ID) {
            chattingUser = user;
            console.log("showing");
            document.getElementById("chattingUser").innerHTML = user.Name
            document.getElementById("chatbox").style.visibility = "visible"
            // firebase.database().ref("Conant/Students/"+localStorage["id"]+"/Chats/"+user.ID).push({
            //     default:"NaNNuLlNaN"
            // });
            firebase.database().ref("Conant/Students/" + localStorage["id"] + "/Chats/" + user.ID).once('value', function (snapshot) {
                console.log(snapshot)
                chats = [];
                snapshot.forEach(function (item) {
                    let val = item.val();
                    // var id, time, msg;
                    // console.log(val);
                    // id = val.substring(0, val.indexOf(":"));
                    // val = val.substring(val.indexOf(":") + 1);
                    // time = val.substring(0, val.indexOf(":"));
                    // val = val.substring(val.indexOf(":") + 1);
                    // msg = val;
                    var chat = {
                        id: val.ID,
                        time: new Date(val.Time),
                        msg: val.Message
                    }
                    chats.push(chat)
                });
                updateChats()
            });
        }
    }

    function updateChats() {
        firebase.database().ref("Conant/Students/" + localStorage["id"] + "/Chats/" + chattingUser.ID).on('value', function (snapshot) {
            console.log(snapshot)
            chats = [];
            snapshot.forEach(function (item) {
                let val = item.val();
                var chat = {
                    id: val.ID,
                    time: val.Time,
                    msg: val.Message
                }
                chats.push(chat)
            });
            displayChats();
        });
    }

    function displayChats() {
        $("#rect").empty();
        console.log('displaying')
        // console.log(chats);
        chats = chats.slice().sort((a, b) => a.time - b.time)
        for (i = 0; i < chats.length; i++) {
            c = chats[i];
            let name, message, time
            if (c.id === chattingUser.ID) {
                name = chattingUser.Name;
            } else {
                name = localStorage['name'];
            }
            message = c.msg;
            time = new Date(c.time).toLocaleString()
            n = document.createElement("span")
            n.innerHTML = name + ": "
            n.className = "nString"

            m = document.createElement("span")
            m.innerHTML = message
            m.className = "mString"

            t = document.createElement("span")
            t.innerHTML = time + "\n";
            t.className = "tString"

            //keeps scroll to bottom

            const out = document.getElementById("rect")
            const isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1


            document.getElementById("rect").append(n, m, t);

            // scroll to bottom if isScrolledToBottom is true
            if (isScrolledToBottom) {
                out.scrollTop = out.scrollHeight - out.clientHeight
            }
        }

    }


//ID:DATE:MESSAGE
    function sendChat() {
        if (document.getElementById("textInp").value !== "") {
            $("#textInp").attr("disabled", "disabled");
            var msg = document.getElementById("textInp").value;
            document.getElementById("textInp").value = ""
            var date = new Date($.now());
            console.log(date);
            var chat = {
                ID: localStorage["id"],
                Time: date.toString(),
                Message: msg
            }
            firebase.database().ref("Conant/Students/" + chattingUser.ID + "/Chats/" + localStorage["id"]).push(chat);
            firebase.database().ref("Conant/Students/" + localStorage["id"] + "/Chats/" + chattingUser.ID).push(chat);
            $("#textInp").removeAttr("disabled");
            updateChats();
        }
    }

