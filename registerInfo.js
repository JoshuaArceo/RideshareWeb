async function setUp() {
    idV = localStorage["id"].toString()
    nameV = localStorage["name"].toString();
    emailV = localStorage["email"].toString();
    if (!await checkDupe()) {
        document.getElementById("firstTime").style.display = "inline";
        // document.getElementById("dropdown").style.display = "none"
    }else{
        window.open('homeWall.html','_self');
    }
    $(function(){
        var $select = $("#agebox");
        for (i=13;i<=19;i++){
            $select.append($('<option></option>').val(i).html(i))
        }
    });
    let userElement = document.getElementById("userName");
    userElement.innerHTML = "Signed in as: " + emailV;
}

async function checkDupe() {
    let dupe = false;
    return await  firebase.database().ref('Conant/Students').once('value', function (snapshot) {
        snapshot.forEach(function (item) {
            if (localStorage["email"] === item.val().Email) {
                // console.log("its true");
                dupe = true;
            }
        });
    }).then(result => {
        // console.log(dupe);
        return dupe;
    });
}

async function setStudentsList() {
    console.log("setting list")
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
var addresses = [];
var addressDists = [];
var addressTimes = [];
let schoolID = 'Conant';
let calls = 0;

async function getDist(origin, dest){
    calls++
    console.log(calls)
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: [origin],
        destinations: dest,
        travelMode:'DRIVING',
        unitSystem: google.maps.UnitSystem.IMPERIAL,
    }, await callback)
    // .then(result => {contSubmit();});

}



async function callback(response, status) {
    if (status == 'OK') {
        // var origins = response.originAddresses;
        var destinations = response.destinationAddresses;
        console.log("destinations:")
        console.log(destinations)
        console.log(response)
        results = response.rows[0].elements;
        for(var i = 0; i<destinations.length; i++){
            addressDists.push(results[i].distance);
            addressTimes.push(results[i].duration.text);
        }
        console.log(addressDists)
        await contSubmit();
        // window.open ('home.html','_self',false);
    }

}

async function submit() {
//Insert
    addressV = document.getElementById('addressbox').valueOf().value;
    ageV = document.getElementById('agebox').valueOf().value;
    console.log(ageV);
    let students = await setStudentsList();
    if(students.length>0) {
        for (var i = 0; i < students.length; i++) {
            addresses.push(students[i].Address);
        }
        await getDist(addressV, addresses)
    }
}

async function contSubmit(){

    firebase.database().ref(schoolID + '/Students/' + idV).set({
        Name: nameV,
        Address: addressV,
        Age: ageV,
        ID: idV,
        Email: emailV
    });
    if(addressDists.length>0) {
        firebase.database().ref('Conant/Students').once('value', function (snapshot) {
            var ind = 0
            snapshot.forEach(function (item) {
                if (idV !== item.val().ID) {
                    // console.log(addressDists);
                    // console.log(addressTimes);
                    // console.log(item.val().ID);
                    // console.log(ind)
                    let mV = addressDists[ind].value;
                    let m = addressDists[ind].text.substring(0, addressDists[ind].text.length - 3);
                    let t = addressTimes[ind];
                    const words = t.split(" ");

                    for (let i = 0; i < words.length; i++) {
                        if (!isNaN(words[0])) {
                            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
                        }
                    }

                    t = words.join(" ");
                    // console.log(m);
                    // let randTime = Math.floor(Math.random() * 1800) + 900
                    // console.log(item.val())
                    // console.log(item.val().ID)
                    let refD = "D" + item.val().ID;
                    let refR = "R" + item.val().ID;

                    firebase.database().ref(schoolID + '/Students/' + idV + "/Distances/" + refD).set({
                        MilesVal: mV,
                        Miles: m,
                        Time: t
                    });
                    firebase.database().ref(schoolID + '/Students/' + idV + "/Requests/" + refR).set({
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
                    /*
                        InDriveMe: other requesting you to drive them
                        InDriveYou: other offering you a ride
                        OutDriveMe: you requesting other for a ride
                        OutDriveYou: you offering a ride to other
                     */

                    refD = "D" + idV;
                    refR = "R" + idV;
                    firebase.database().ref(schoolID + '/Students/' + item.val().ID + "/Distances/" + refD).set({
                        MilesVal: mV,
                        Miles: m,
                        Time: t
                    });
                    firebase.database().ref(schoolID + '/Students/' + item.val().ID + "/Requests/" + refR).set({
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
                    ind++;
                }

            });
        }).then(()=>window.open ('homeWall.html','_self',false));
    }
}
