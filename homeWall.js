window.addEventListener('load', function () {
    if(!(localStorage["id"] && localStorage["name"] && localStorage["email"])){
        localStorage.removeItem("id");
        localStorage.removeItem("email");
        localStorage.removeItem("name");
        window.open('index.html','_self');
    }
    idV = localStorage["id"].toString()
    nameV = localStorage["name"].toString();
    emailV = localStorage["email"].toString();
    $("#timeSelect").val('07:00')


    $('.sortByDrop').on('change',function (e){
        var optionSelected = $("option:selected", this);
        var valueSelected = this.value;
        //console.log(optionSelected.index())
        //console.log(valueSelected)
        loadPosts(optionSelected.index())
    })

})
loadPosts(0)


// test();
// function test() {
//     firebase.database().ref("Conant/Students").once('value',function (snapshot){
//         snapshot.forEach(function (student){
//             student.forEach(function (studentData){
//                 if(studentData.key == "Distances"){
//                     studentData.forEach(function (dists){
//                       //console.log(dists.val())
//                     })
//                 }
//             });
//         });
//     })
// }

// let localStudents = [];
//
// createLocalStudents().then(loadPosts());
//
//
// async function createLocalStudents(){
//     // localStudents = [];
//     firebase.database().ref("Conant/Students").once('value',function (snapshot){
//         snapshot.forEach(function (item){
//             if(item.val().ID!=idV){
//                 localStudents.push(item.val())
//                 // appendStudent(item.val().ID)
//             }
//         });
//     })
//     //console.log(localStudents)
// }

// function appendStudent(ID){
//     //console.log(ID)
//     //console.log(idV)
//     //console.log(localStorage["id"]);
//     student = firebase.database().ref("Conant/Students/" + ID +"/Distances/D" + idV).once('value',function (snapshot){
//         //console.log(snapshot.val())
//         return {
//             ID: ID,
//             Dist: snapshot.val().MilesVal
//         }
//     });
//     localStudents.push(student)
// }

var selectedType;
function setType(){
    var selectBox = document.getElementById("requestType");
    selectedType = selectBox.options[selectBox.selectedIndex].value;
    if(selectedType==1){
        $(".canDrive").css("visibility","visible");
    }else{
        $(".canDrive").css("visibility","hidden");
    }
    // //console.log(selectedType)
}

$(function(){
    var $select = $("#requestType");
        $select.append($('<option>Need Ride</option>').val(0))
        $select.append($('<option>Can Drive</option>').val(1))

    $select = $("#seatsDrop");
        for (i=1;i<=6;i++){
            $select.append($('<option></option>').val(i).html(i))
        }
});

function post() {
    var postedTime, postText, driveTime, availableSeats, takenSeats
    postedTime = new Date($.now()).toString();
    postText = $("#postText").val()
    driveTime = $("#timeSelect").val();
    //console.log(selectedType)
    //can drive
    if (selectedType == 1) {
        //console.log("can drive")
        availableSeats = $('#seatsDrop').val();
        takenSeats = 0;
        post = {
            UserID: idV,
            UserName: nameV,
            PostText: postText,
            PostedTime: postedTime,
            DriveTime: driveTime,
            AvailableSeats: parseInt(availableSeats),
            TakenSeats: takenSeats,
            PostType: "1"
        }

    }
    //need ride
    else {
        post = {
            UserID: idV,
            UserName: nameV,
            PostText: postText,
            PostedTime: postedTime,
            DriveTime: driveTime,
            PostType: "0"
        }
    }
    firebase.database().ref("Conant/Posts").push(
        post
    );
    posts.push(post)

    $(`#postText`).val('');
    $(`#timeSelect`).val('07:00');
    $("#seatsDrop").val('1');
    loadPosts()
}

function setPostDist(index, item) {
    if (item.val().UserID != idV) {
        firebase.database().ref('Conant/Students/' + item.val().UserID + '/Distances/D' + idV).once('value', function(snapshot){
            posts[index].MilesVal = snapshot.val().MilesVal
            posts[index].Miles = snapshot.val().Miles
        });
    }
}


var posts = []

function loadPosts(sortMethod){
    posts = []
    //console.log(sortMethod)

    $("#wallRequests").empty();
    let index = 0
    firebase.database().ref("Conant/Posts").once('value', function (snapshot) {
        snapshot.forEach(function (item) {
            posts.push(item.val());
            posts[posts.length - 1].PostedTime = new Date(item.val().PostedTime);
            posts[posts.length - 1].key = item.key;
            index++;
        });


    }).then(async()=>{
        var index=0;
        //console.log(posts)
        for (const item of posts) {
            //console.log(item);
            if (item.UserID != idV) {
               await firebase.database().ref('Conant/Students/' + item.UserID + '/Distances/D' + idV).once('value', function(snapshot){
                    item.MilesVal = snapshot.val().MilesVal
                    item.Miles = snapshot.val().Miles
                });
            }
            index++;
        }


        if(sortMethod == 0){
            posts = posts.slice().sort((a, b) =>  b.PostedTime - a.PostedTime);
        }else if(sortMethod ==1){
            //console.log('a-b')
            posts = posts.slice().sort((a, b) => a.PostedTime - b.PostedTime);
        }

        else if(sortMethod == 2||sortMethod == 3){
            if(sortMethod == 2){
                posts = posts.slice().sort((a, b) =>  a.MilesVal - b.MilesVal);
            }else{
                posts = posts.slice().sort((a, b) => b.MilesVal - a.MilesVal);
            }
        }
        index=0;
        posts.forEach(function (item){
       if(item.UserID!=idV){
           $("#wallRequests").append(
               $('<div>').prop({
                   class: 'postedMessage'
               })
                   .append( $("<h2>").prop({
                       class: 'postUserName',
                       innerHTML: item.UserName + " "  + item.DriveTime
                   }))
                   .append($("<h4>").prop({
                       class: 'postText',
                       innerHTML: item.PostText
                   }))
                   .append($("<a>").prop({
                       class: 'postDist',
                   }))
                   .append($("<br>").prop({
                       class: 'space',
                   }))
                   .append($("<a>").prop({
                       class: 'postTime',
                       innerHTML: item.PostedTime.toLocaleString()
                   }))
                   .append($("<br>").prop({
                       class: 'space',
                   }))
                   .append($("<a>").prop({
                       class: 'postDist',
                       innerHTML: item.Miles + " Mile(s) away "
                   })));
       }else{
           $("#wallRequests").append(
               $('<div>').prop({
                   class: 'postedMessage'
               })
                   .append( $("<h2>").prop({
                       class: 'postUserName',
                       innerHTML: item.UserName + " "  + item.DriveTime
                   }))
                   .append($("<h4>").prop({
                       class: 'postText',
                       innerHTML: item.PostText
                   }))
                   .append($("<a>").prop({
                       class: 'postDist',
                   }))
                   .append($("<br>").prop({
                       class: 'space',
                   }))
                   .append($("<a>").prop({
                       class: 'postTime',
                       innerHTML: item.PostedTime.toLocaleString()
                   }))
                   .append($("<br>").prop({
                       class: 'space',
                   })));
       }
        if(item.UserID==idV){
            if(item.AvailableSeats!=null) {
                $('.postUserName')[index].innerHTML = "You are offering to drive at "  + item.DriveTime + " for "
            }else{
                $('.postUserName')[index].innerHTML = "You need a ride at " +  item.DriveTime
            }
        }
        if(item.AvailableSeats!=null){
            var available = parseInt(item.AvailableSeats)-parseInt(item.TakenSeats);
            if(parseInt(item.AvailableSeats)==1) {
                // //console.log(item.pos)
                // //console.log($('.postUserName'))
                $('.postUserName')[index].innerHTML = $(`.postUserName`)[index].innerHTML + " for " + item.AvailableSeats + " person"
            }else{
                $('.postUserName')[index].innerHTML = $(`.postUserName`)[index].innerHTML + " for " + item.AvailableSeats + " people"
            }
            $(`.postUserName`)[index].after(available +"/" + item.AvailableSeats + " seats left")
        }
        index++
        });
        $('.postedMessage').last().css('margin-bottom', '42px')


        reqButtons();
        checkOffers();

    });

}

// function getDistances(){
//     //TODO: fix iteration for distances
//     const distID = "D" + idV;
//     var distAway;
//     // //console.log($('.postTime'))
//      firebase.database().ref("Conant/Posts").once('value', function (snapshot) {
//         var index = 0;
//          snapshot.forEach(function (item) {
//             //console.log(index)
//             if(item.val().UserID!==idV){
//                 setDists(item, distID, index);
//             }else{
//                 //console.log("self");
//             }
//             index++;
//         });
//     });
// }
//
// function setDists(item, distID, index){
//     firebase.database().ref('Conant/Students/' + item.val().UserID + '/Distances/' + distID).once('value', function (snapshot) {
//         //console.log(snapshot.val().Miles );
//         distAway = "\n" + snapshot.val().Miles + " Mile(s) away ";
//         $('.postDist')[index].append( distAway);
//     })
// }

function reqButtons(){
        var index = 0;
        posts.forEach(function (item) {
            // console.log(item)
            postType = item.PostType;
            //console.log(index)
            if(item.UserID!==idV){
                if(item.AvailableSeats-item.TakenSeats<1){
                    $txt = $("<div>This ride is full</div>").prop({
                        class: 'offerText'
                    });
                    $('<div>').append($txt).appendTo($('.postedMessage')[index])
                }else {
                    checkReq(item, index, postType)
                }
            }
            index++;
        });
}

function checkReq(item, index, postType){
    firebase.database().ref("Conant/Posts/" + item.key + "/Incoming/" + idV).once('value',function (snapshot1){
        if(!snapshot1.exists()) {
            //console.log("POSTY " + postType)
            if (postType == 0){
            $btn = $("<button>Offer a Ride</button>").prop({
                class: 'offerButton'
            });
            } else{
                $btn = $("<button>Request a Ride</button>").prop({class: 'offerButton'});
            }
        var button = $btn
            $btn.click(function () {
                reqRide(button, postType)
                firebase.database().ref("Conant/Posts/" + item.key + "/Incoming/" + idV).set({
                    UserName: nameV,
                    Offer: 0
                });

            });
            $('<div>').append($btn).appendTo($('.postedMessage')[index]);
        }
        else if(snapshot1.val().Offer==0){
            //console.log("exist")
            if(postType==0) {
                $txt = $("<div>Outgoing Pending Offer to Drive</div>").prop({
                    class: 'offerText'
                });
            }else{
                $txt = $("<div>Outgoing Pending Request for Ride</div>").prop({
                    class: 'offerText'
                });
            }
            $('<div>').append($txt).appendTo($('.postedMessage')[index])
        }else{
            if(postType==0) {
                $txt = $("<div>" + item.UserName + " has accepted your offer</div>").prop({
                    class: 'offerText'
                });
            }else{
                $txt = $("<div>" + item.UserName + " has accepted your request</div>").prop({
                    class: 'offerText'
                });
            }
            $btn = $("<button>Open Chat</button>").prop({
                class: 'offerButton'
            });
            $btn.click(()=>openChatOffer(item.UserID));
            var userOffer = $($txt).append($btn)
            userOffer.appendTo($('.postedMessage')[index]);
        }
    });
}

function reqRide(self, postType){
    if(postType==0) {
        $txt = $("<div>Outgoing Pending Offer to Drive</div>").prop({
            class: 'offerText'
        });
    }else{
        $txt = $("<div>Outgoing Pending Request for Ride</div>").prop({
            class: 'offerText'
        });
    }
    $(self).replaceWith($txt)
}



function checkOffers() {
    let index = 0;

          posts.forEach(function (item) {
              //console.log(index)
            if (item.UserID == idV) {
                //console.log(index)
                appendOffer(index, item.key, item.PostType, item.UserID)
            }
            index++;
        });
}

function appendOffer(index, key, postType){
    //console.log(postType)

    firebase.database().ref("Conant/Posts/"+ key + "/Incoming").once('value', function (snapshot) {
        var avail
    snapshot.forEach(function (item) {
        if(item.val().Offer==0) {
            //console.log(postType)
            // noinspection EqualityComparisonWithCoercionJS
            if(postType == 0) {
                $txt = ("<div class:'offerText'>" + item.val().UserName + " sent you an offer </div>");
                $btn = $("<button>Accept Offer</button>").prop({
                    class: 'offerButton'
                });
            }else{
                $txt = ("<div class:'offerText'>" + item.val().UserName + " requested a ride</div>");
                $btn = $("<button>Accept Request</button>").prop({
                    class: 'offerButton'
                });
                firebase.database().ref("Conant/Posts/"+ key ).once('value',function (snapshot1){
                     taken = snapshot1.val().TakenSeats;
                }).then(()=> firebase.database().ref("Conant/Posts/"+ key ).update({
                    TakenSeats: parseInt(taken)+1
                }));
            }
            var userOffer = $($txt).append($btn)
            userOffer.appendTo($('.postedMessage')[index]);
            $btn.click(()=>acceptOffer(key,item, index, userOffer));
        }else{
            if(postType == 0) {
                $txt = ("<div class:'offerText'>Offer from " + item.val().UserName + " accepted. </div>");
                $btn = $("<button>Open Chat</button>").prop({
                    class: 'offerButton'
                });
            }else{
                $txt = ("<div class:'offerText'>Request from " + item.val().UserName + " accepted. </div>");
                $btn = $("<button>Open Chat</button>").prop({
                    class: 'offerButton'
                });
            }
            $btn.click(()=>openChatOffer(item.key));
            var userOffer = $($txt).append($btn)
            userOffer.appendTo($('.postedMessage')[index]);



            // $('<div>').append("Offer from " + item.val().UserName + " accepted." ).appendTo($('.postedMessage')[index]);
        }
    });
});

}

function acceptOffer(key,item, index, self){
    $txt = ("<div class:'offerText'>Offer from " + item.val().UserName + " accepted. </div>");
    $btn = $("<button>Open Chat</button>").prop({
        class: 'offerButton'
    });
    $btn.click(()=>openChatOffer(item.key));
    var userOffer = $($txt).append($btn)

    $(self).replaceWith(userOffer)
    firebase.database().ref("Conant/Posts/"+ key + "/Incoming/"+item.key).update({
        Offer: 1,
    });
}

function openChatOffer(userID){
    window.open('chat.html?uid=' + userID,'_self');
}


