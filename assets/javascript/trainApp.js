  


 
  $(document).ready(function(){
    displayTime();

      // calculating current time
  function displayTime(){
    var time = moment().format("HH:mm");
    $("#timeNow").html("<h3>Time Now:" + time+ "</h3>");
    setTimeout(displayTime,1000);
  }




    // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB5RKIANHycyb9v1uqTGZT7MCUCEkDcADk",
    authDomain: "trainscheduller.firebaseapp.com",
    databaseURL: "https://trainscheduller.firebaseio.com",
    projectId: "trainscheduller",
    storageBucket: "trainscheduller.appspot.com",
    messagingSenderId: "677971624541"
  };
  firebase.initializeApp(config);


  var trainDB = firebase.database();

  var trainName ="";
  var destination ="";
  var frequency ="";
  var firstTrainTime ="";
  


  $("#submit").on("click", function(){
    event.preventDefault();

    //code below prevent submission of an incomplete form (i.e. All input fields must be filled)
    var tdata = $(".data").val().trim();
    if (tdata == ""){
      alert("Please Compete All Schedule Details");
      return false;
    }

    trainName=$("#trainName").val().trim();
    destination=$("#destination").val().trim();
    frequency=$("#frequency").val().trim();
    firstTrainTime=$("#firstTrainTime").val().trim();
      var output = moment(firstTrainTime, "hh:mm A").format("HH:mm");
      console.log(output);
      firstTrainTime=output;
      console.log(firstTrainTime); // lines 35-38 Used moments js to convert firstTrainTime to military 

    
    // Pushing each entry into firebase
    trainDB.ref().push({
      trainName:trainName,
      destination:destination,
      frequency:frequency,
      

    });

    //Calculating Next Arrival Time and Minutes to Arrival
    var freq = frequency; //arrival frequency
    var firstTime = output;  //referencing from line 53
    console.log(output);

    var timeNow = moment().format("HH:mm");

    var timeDiff = moment.utc(moment(timeNow, "HH:mm").diff(moment(output, "HH:mm"))).format("HH:mm");// var timeDiff = moment().diff(moment(firstTime),"minutes");
    var timeDiffInMins = moment.duration(timeDiff, 'minutes').asMinutes(); // timeDiff in Minutes
    var tModulo = timeDiffInMins % freq; //this will help calculate mins to arrival
    var minsToArrival = freq - tModulo;

    var nextArrivalTimeInMins = moment().add(minsToArrival, "minutes")
    var nextArrivalTime = moment(nextArrivalTimeInMins).format("HH:mm"); //next arrival time in military time



    // trainDB.ref().on("value", function(snapshot){
    //   console.log(snapshot.val());
    // })

    // //getting a snapshot of the latest submissions
    // trainDB.ref().on("child_added", function(snapshot){
    //   console.log(snapshot.val());
    // })

    //this code dynamically updates the schedule Table anytime the Employee Details form is filled and submitted
    $("#scheduleTable").append("<tr>'<td>"+trainName+"</td>''<td>"+destination+"</td>''<td>"+frequency+"</td>''<td>"+nextArrivalTime+"</td>''<td>"+minsToArrival+"</td>'</tr>");


    //this code will clear the form after clicking sunmit
    trainName=$("#trainName").val("");
    destination=$("#destination").val("");
    frequency=$("#frequency").val("");
    firstTrainTime=$("#firstTrainTime").val("");

    

  })

  });

  
  
    

