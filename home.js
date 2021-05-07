/*
@deprecated
Old method for finding users, may be repurposed for admin in future



 */

test();
function test() {
    firebase.database().ref("Conant/Students").once('value',function (snapshot){
        snapshot.forEach(function (student){
            student.forEach(function (studentData){
                if(studentData.key == "Distances"){
                    studentData.forEach(function (dists){
                        console.log(dists.val())
                    })
                }
            });
        });
    })
}


//Ready
// var idV, nameV, ageV, addressV, emailV;

function test(x) {
    alert(x);
}

function resetVars(){
    idV = "";
    nameV="";
    ageV="";
    addressV="";
    emailV="";
}

function Ready() {
    addressV = document.getElementById('addressbox').valueOf().value;
    ageV = document.getElementById('agebox').valueOf().value;
}

async function setID() {

    idV = localStorage["id"].toString()
    nameV = localStorage["name"].toString();
    emailV = localStorage["email"].toString();
    // console.log(checkDupe());
    if (!await checkDupe()) {
        window.open('registerInfo.html','_self');
    } else {
        document.getElementById("listView").style.display = "inline"
            searchUser();
        // document.getElementsByClassName("dropdown")[0].style.display = "block";
    }
    let userElement = document.getElementById("userName");
    userElement.innerHTML = "Signed in as: " + emailV;
    // console.log(setStudentsList())
}







async function checkList(){
    if(await setStudentsList().length === 0){
        firebase.database().ref(schoolID + '/Students/null').set({
            Name: "default",
            Address: "1 Rocket Road, Hawthorne CA 90250",
            Age: "null",
            ID: "null",
            Email: "default@null.com"
        });
    }
}

let schoolID = 'Conant';

async function setStudentsList() {

    let studentList = [];
    return await firebase.database().ref('Conant/Students').once('value', function (snapshot) {
        snapshot.forEach(function (item) {
            if (idV !== item.val().ID) {
                // console.log("Name: " + item.val().Name);
                studentList.push(item.val());

            }
        });
    }).then(result => {return studentList});
}

async function checkDupe() {
    let dupe = false;
    return await  firebase.database().ref('Conant/Students').once('value', function (snapshot) {
        snapshot.forEach(function (item) {
            if (emailV === item.val().Email) {
                // console.log("its true");
                dupe = true;
            }
        });
    }).then(result => {
        // console.log(dupe);
        return dupe;
    });
}

async function checkSort() {
    var selectBox = document.getElementById("sortBy");
    var selectedValue = selectBox.options[selectBox.selectedIndex].id;
    switch (selectedValue) {
        case "distanceLowToHigh":
            sortDistance(false);
            break;
        case "distanceHighToLow":
            sortDistance(true);
            break;
        case "nameAlphabetical":
            await sortAlphabetical();
            break;
    }


}
async function sortDistance(high) {
    //TODO FIX SORTS
    let students = await setStudentsList();
    let studentD = await setStudentDists();
    if(high){
        sortHighToLow(studentD);
    }else {
        sortLowToHigh(studentD);
    }
}

async function setStudentDists(){
    const distID = "D" + idV;
    let tempArray = [];
    return await firebase.database().ref('Conant/Students').once('value', function (snapshot) {
        snapshot.forEach(function (item) {
            if (idV !== item.val().ID) {
                firebase.database().ref('Conant/Students/' + item.val().ID + '/Distances/' + distID).once('value', function (snapshot1) {
                    // console.log(snapshot1.val().MilesVal)
                    tempArray.push(snapshot1.val().MilesVal);
                });
            }
        })
    }).then(result => {
        // console.log(tempArray);
        return tempArray});
}

function sortHighToLow(studentD){
    // console.log("high")
    // console.log(studentD);
    // let tempS = students.splice(0);
    // let tempD = studentD.splice(0)
    // if (!high) {
    //     console.log(studentD);
    //     studentD.sort(function(a, b){return a-b});
    //     for (i = 0; i < studentD.length; i++) {
    //         let y = 0;
    //         for (y = 0; y < tempD.length; y++) {
    //             if (studentD[i] === tempD[y].Name) {
    //                 tempS[i] = students[y];
    //                 break;
    //             }
    //         }
    //     }
    //
    //     console.log(tempS);
    //     // updateList(tempS);
    // }
    // else {
    //     console.log("high");
}

function sortLowToHigh(studentD){
    // console.log("low")
    // console.log(studentD);
}







 async function sortAlphabetical() {
     let temp;
     // console.log("alpha");
     let students;
     // console.log(setStudentsList());
     students = await setStudentsList().then(result =>{
        //      let i = 0;
        students = result;
        let studentNames = []
        temp = students.slice(0);
         let i;
         for(i = 0; i < students.length; i++) {
             studentNames.push(students[i].Name)
        }
     studentNames.sort();
     // console.log(studentNames);
     for (i = 0; i < studentNames.length; i++) {
         let y = 0;
         for (y = 0; y < temp.length; y++) {
             if (studentNames[i] === students[y].Name) {
                 temp[i] = students[y];
                 break;
             }
         }
     }
     // console.log(studentNames);
    }).then(result => { updateList(temp)});
 }

var finalString;

// Select
function searchUser() {
    $('#studentList').empty();
    //TODO: maybe map integration
    // let select = document.getElementById("studentsList");
    // let selectedIndex = document.getElementById("studentsList").selectedIndex;
    firebase.database().ref('Conant/Students').once('value', function (snapshot) {
        snapshot.forEach(function (item) {
            if(item.val().ID!==idV){
                console.log(item.val().ID);
    console.log(idV)
    var distID = "D" + item.val().ID;
    console.log(distID)
    var reqID = "R" + item.val().ID;
    console.log(reqID)
    let nameString, addressString, ageString, distanceString, durationString, requestStatus
    console.log('Conant/Students/' + idV + '/Distances/' + distID);

    nameString = "Name: " + item.val().Name;
    addressString = "Address: " + item.val().Address;
    ageString = "Age: " + item.val().Age;
    firebase.database().ref('Conant/Students/' + idV + '/Distances/' + distID).once('value', function (snapshot) {
            console.log(snapshot.val().Miles);
            distanceString = "Distance: " + snapshot.val().Miles + " Miles";
            console.log(distanceString);
            durationString = "Duration: " + snapshot.val().Time;
        });
    firebase.database().ref('Conant/Students/' + idV +'/Requests/' +reqID).once('value',function (snapshot) {
        let uName = nameString.substring(nameString.indexOf(':')+1);
    /*
                              InYouDriveThem: other requesting you to drive them
                              InTheyDriveYou: other offering you a ride
                              OutTheyDriveYou: you requesting other for a ride
                              OutYouDriveThem: you offering a ride to other
                              YouAcceptedRide: you accepted a ride offer from them
                              TheyAcceptedRide: they accepted a ride offer from you
                              YouAcceptedDrive: you accepted to drive a request from them
                              TheyAcceptedDrive: they accepted a drive request from you
                              YouDeclinedRide: you declined a ride from them
                              TheyDeclinedRide: they declined a ride request from you
                              YouDeclinedDrive: you decline a drive request from them
                              TheyDeclinedDrive: they declined a drive request from you
                                                                                                        */
        if(snapshot.val().OutTheyDriveYou === "Y"){
            requestStatus = "You have already requested a ride from " + uName + " would you like to cancel the request?"
            setReqButtons("OUTTHEYDRIVE", item.val());
        }
        else if(snapshot.val().OutYouDriveThem === "Y"){
            requestStatus = "You have already offered a ride to " + uName + " would you like to cancel the offer?"
            setReqButtons("OUTYOUDRIVE", item.val());
        }

        else if(snapshot.val().InYouDriveThem === "Y"){
            requestStatus = uName + " has requested a ride, would you like to accept and drive them?"
            setReqButtons("INYOUDRIVE", item.val());
        }
        else if(snapshot.val().InTheyDriveYou === "Y"){
            requestStatus = uName + " has offered to drive you, would you like to accept?"
            setReqButtons("INTHEYDRIVE", item.val());
        }
        else if(snapshot.val().InYouDriveThem === "N" && snapshot.val().InTheyDriveYou==="N"){
            requestStatus = "Would you like to offer to drive or request a ride from " + uName + "?";
            setReqButtons("NONE", item.val());
        }

        if(snapshot.val().YouAcceptedRide === "Y"){
            requestStatus = "You have accepted a ride from " +uName
            setReqButtons("CONFIRMA", item.val());
        }
       if(snapshot.val().TheyAcceptedRide === "Y"){
           requestStatus = uName + " has accepted your ride offer"
           setReqButtons("CONFIRMA", item.val());
        }
        if(snapshot.val().YouAcceptedDrive === "Y"){
            requestStatus = "You have accepted a ride from " +uName
            setReqButtons("CONFIRMA", item.val());
        }
        if(snapshot.val().TheyAcceptedDrive === "Y"){
            requestStatus = uName + " has accepted your drive request"
            setReqButtons("CONFIRMA", item.val());
        }
        if(snapshot.val().TheyDeclinedRide === "Y"){
            requestStatus = uName + "has declined your ride request"
            setReqButtons("CONFIRMD", item.val());
        }
        if(snapshot.val().TheyDeclinedDrive === "Y"){
            requestStatus = uName + " has declined your offer to drive them"
            setReqButtons("CONFIRMD", item.val());
        }
    })
    .then(() => {
            console.log("done")
            finalString = nameString + "<br>" /* + addressString + "<br>"*/ + ageString + "<br>" + distanceString + "<br>" + durationString + "<br>" + requestStatus;
            insertItems();
        });
    }
    });
    });
}


let btn1, btn2, btnAmt;

function setReqButtons(inp, selected){
    console.log(inp);
    let btnOne, btnTwo, btnOneFunc, btnTwoFunc
    if(inp == "NONE"){
        btnAmt = 2;
        btnOne = "Offer Ride"
        btnTwo = "Request Ride"
        btnOneFunc = () => {
            firebase.database().ref(schoolID + '/Students/' + idV + "/Requests/" + "R"+selected.ID).update({
                OutYouDriveThem: "Y"
            });
            firebase.database().ref(schoolID + '/Students/' + selected.ID + "/Requests/" + "R"+idV).update({
                InTheyDriveYou: "Y"
            });
        }
        btnTwoFunc = () => {
            firebase.database().ref(schoolID + '/Students/' + idV + "/Requests/" + "R"+selected.ID).update({
                OutTheyDriveYou: "Y"
            });
            firebase.database().ref(schoolID + '/Students/' + selected.ID + "/Requests/" + "R"+idV).update({
                InYouDriveThem: "Y"
            });
        }
    }else if (inp == "INYOUDRIVE"){
        btnAmt = 2;
        btnOne = "Accept and Drive"
        btnTwo = "Decline"
        btnOneFunc = () => {
            firebase.database().ref(schoolID + '/Students/' + idV + "/Requests/" + "R"+selected.ID).update({
                InYouDriveThem: "N",
                YouAcceptedDrive: "Y"
            });
            firebase.database().ref(schoolID + '/Students/' + selected.ID + "/Requests/" + "R"+idV).update({
                OutTheyDriveYou: "N",
                TheyAcceptedDrive: "Y"
            });
        }
        btnTwoFunc = () => {
            firebase.database().ref(schoolID + '/Students/' + idV + "/Requests/" + "R"+selected.ID).update({
                InYouDriveThem: "N",
                YouDeclinedDrive: "Y"

            });
            firebase.database().ref(schoolID + '/Students/' + selected.ID + "/Requests/" + "R"+idV).update({
                OutTheyDriveYou: "N",
                TheyDeclinedDrive: "Y"
            });
        }
    }else if (inp == "INTHEYDRIVE"){
        btnAmt = 2;
        btnOne = "Accept and Ride"
        btnTwo = "Decline"
        btnOneFunc = () => {
            firebase.database().ref(schoolID + '/Students/' + idV + "/Requests/" + "R"+selected.ID).update({
                InTheyDriveYou: "N",
                YouAcceptedRide: "Y"
            });
            firebase.database().ref(schoolID + '/Students/' + selected.ID + "/Requests/" + "R"+idV).update({
                OutYouDriveThem: "N",
                TheyAcceptedRide: "Y"
            });
        }
        btnTwoFunc = () => {
            firebase.database().ref(schoolID + '/Students/' + idV + "/Requests/" + "R"+selected.ID).update({
                InTheyDriveYou: "N",
                YouDeclinedRide: "Y"
            });
            firebase.database().ref(schoolID + '/Students/' + selected.ID + "/Requests/" + "R"+idV).update({
                OutYouDriveThem: "N",
                TheyDeclinedRide: "Y"
            });
        }
    }else if (inp == "OUTTHEYDRIVE"){
        btnAmt = 1;
        btnOne = "Cancel Request"
        btnOneFunc = () => {
            firebase.database().ref(schoolID + '/Students/' + idV + "/Requests/" + "R"+selected.ID).update({
                OutTheyDriveYou: "N"
            });
            firebase.database().ref(schoolID + '/Students/' + selected.ID + "/Requests/" + "R"+idV).update({
                InYouDriveThem: "N"
            });
        }
    }else if (inp == "OUTYOUDRIVE"){
        btnAmt = 1;
        btnOne = "Cancel Offer"
        btnOneFunc = () => {
            firebase.database().ref(schoolID + '/Students/' + idV + "/Requests/" + "R"+selected.ID).update({
                OutYouDriveThem: "N"
            });
            firebase.database().ref(schoolID + '/Students/' + selected.ID + "/Requests/" + "R"+idV).update({
                InTheyDriveYou: "N"
            });
        }
    }
    else if (inp == "CONFIRMA"){
        btnAmt = 1;
        btnOne = "Open Chat"
        btnOneFunc = () => {
           window.open('chat.html','_self');
           //TODO open chat directly to user
           //  a.addEventListener('load', function(){
           //      a.openChat("hi");
           //  }, true);
            // alert("Coming soon: Chat to communicate with your peers and coordinate rides!")
        }
        btnTwo = "Cancel Ride"
        btnTwoFunc = () => {
            firebase.database().ref(schoolID + '/Students/' + idV + "/Requests/" + "R" + selected.ID).update({
                InYouDriveThem: "N",
                InTheyDriveYou: "N",
                OutTheyDriveYou: "N",
                OutYouDriveThem: "N",
                YouAcceptedRide: "N",
                TheyAcceptedRide: "N",
                YouAcceptedDrive: "N",
                TheyAcceptedDrive: "N",
                YouDeclinedRide: "N",
                TheyDeclinedRide: "N",
                YouDeclinedDrive: "N",
                TheyDeclinedDrive: "N"
            });
            firebase.database().ref(schoolID + '/Students/' + selected.ID + "/Requests/" + "R" + idV).update({
                InYouDriveThem: "N",
                InTheyDriveYou: "N",
                OutTheyDriveYou: "N",
                OutYouDriveThem: "N",
                YouAcceptedRide: "N",
                TheyAcceptedRide: "N",
                YouAcceptedDrive: "N",
                TheyAcceptedDrive: "N",
                YouDeclinedRide: "N",
                TheyDeclinedRide: "N",
                YouDeclinedDrive: "N",
                TheyDeclinedDrive: "N"
            });
        }
    }
    else if (inp == "CONFIRMD"){
        btnAmt = 1;
        btnOne = "OK"
        btnOneFunc = () => {
            firebase.database().ref(schoolID + '/Students/' + idV + "/Requests/" + "R"+selected.ID).update({
                InYouDriveThem: "N",
                InTheyDriveYou: "N",
                OutTheyDriveYou: "N",
                OutYouDriveThem: "N",
                YouAcceptedRide:"N",
                TheyAcceptedRide: "N",
                YouAcceptedDrive:"N",
                TheyAcceptedDrive: "N",
                YouDeclinedRide: "N",
                TheyDeclinedRide: "N",
                YouDeclinedDrive: "N",
                TheyDeclinedDrive: "N"
            });
            firebase.database().ref(schoolID + '/Students/' + selected.ID + "/Requests/" + "R"+idV).update({
                InYouDriveThem: "N",
                InTheyDriveYou: "N",
                OutTheyDriveYou: "N",
                OutYouDriveThem: "N",
                YouAcceptedRide:"N",
                TheyAcceptedRide: "N",
                YouAcceptedDrive:"N",
                TheyAcceptedDrive: "N",
                YouDeclinedRide: "N",
                TheyDeclinedRide: "N",
                YouDeclinedDrive: "N",
                TheyDeclinedDrive: "N"
            });
        }
    }

    // btnBox.empty();
    // document.getElementById("buttonBox").style.display="block";

    btn1 = $("<button>" + btnOne + "</button>");
    btn1.click(function () {
        btnOneFunc();
        searchUser();
    });
    // listView.append(btn1);

    if(btnAmt == 2) {
        btn2 = $("<button>" + btnTwo + "</button>");
        btn2.click(function () {
            btnTwoFunc();
            searchUser();
        });
        // listView.append(btn2);
    }

}

function insertItems(){
    let listView = $('#studentList');
    let insertPara = "<p>"+finalString+"</p>"
    listView.append(insertPara);
    listView.append(btn1);
    if(btnAmt == 2) {
        listView.append(btn2);
    }
}



