$( function() {
    $( "#startRange" ).datepicker();
	$( "#endRange" ).datepicker();
  } );

//Constant variables
var NOON = 12;
var MINUTEINHOUR = 60.0;
var HOURINDAY = 24.0;

//This variable will hold a reference to the Events list items collection  
var eventList = [];
var eventWant = "";
var returnedItems = null;
var returnedItems2 = null;
var returnedItems3 = null;
var markup;
var listItem;
var listItem2;
var listItem3;
var sel;
var opt;
//Array of speaker objects containing speaker information
var speakerObjectList = [];
var startDate;
var endDate;
var currentDate;
//Array of venue objects containing venue information
var venueObjectList = [];
var EventObjectList = [];

//Dictionaries of constants
var monthDictionary = {};
monthDictionary[0] = "JANUARY";
monthDictionary[1] = "FEBRUARY";
monthDictionary[2] = "MARCH";
monthDictionary[3] = "APRIL";
monthDictionary[4] = "MAY";
monthDictionary[5] = "JUNE";
monthDictionary[6] = "JULY";
monthDictionary[7] = "AUGUST";
monthDictionary[8] = "SEPTEMBER";
monthDictionary[9] = "OCTOBER";
monthDictionary[10] = "NOVEMBER";
monthDictionary[11] = "DECEMBER";

var dayOfWeekDictionary = {};
dayOfWeekDictionary[0] = "SUNDAY";
dayOfWeekDictionary[1] = "MONDAY";
dayOfWeekDictionary[2] = "TUESDAY";
dayOfWeekDictionary[3] = "WEDNESDAY";
dayOfWeekDictionary[4] = "THURSDAY";
dayOfWeekDictionary[5] = "FRIDAY";
dayOfWeekDictionary[6] = "SATURDAY";

//Strings for speaker attributes and venue attributes
var titleString = 'Title';
var jobString = 'Job_x0020_Title';
var streetString = 'Street_x0020_Address';
var cityString = 'City';
var stateString = 'State';
var phoneString = 'Phone';
var faxString = 'Fax';
var emailString = 'E_x002d_Mail_x0020_Address';
var designationString = 'Designations';
var FRNumberString = 'FR_x0020_Number';
var NONumberString = 'NO_x0020_Number';
var DNONumberString = 'DNO_x0020_Number';
var contactString = 'Contact_x0020_Type';
var speakerAgreeString = 'Speaker_x0020_agreement';
var speakerComplianceString = 'Speaker_x0020_Compliance';
var zipString = 'Zip_x0020_Code';
var reservationString = 'Reservation_x0020_Phone';
var venueLocationString = 'Venue_x0020_Location';
var roomNameString = 'Room_x0020_Name';
var roomLocationString = 'Room_x0020_Location';
var groupSessionString = 'Group_x0020_Session';
var startTimeString = 'Start_x0020_DateTime';
var endTimeString = 'End_x0020_DateTime';

//Boolean variables for what information to show in report
var jobTitleBool = false;
var phoneNumberBool = false;
var emailBool = false;
var addressBool = false;
var cityStateBool = false;
var faxNumberBool = false;
var designationsBool = false;
var FRNumberBool = false;
var NONumberBool = false;
var DNONumberBool = false;
var speakerAgreeBool = false;
var speakerComplianceBool = false;

//First contact type to show up, so there is no space before that type
var firstContactType = true;

//Keep track of which attribute we're displaying
var returnAttributeNumber=0;

//Array of sessionOrderObject for sorting session according to start time
var sessionOrderObjectArray=[];

//Queryspeaker queries the list of contacts, calls speakerCallback
function querySpeaker() {
	var context2;
	var list2;
	var caml2;
	//Get the current context  
	context2 = new SP.ClientContext();
	//Get the Sessions list. Alter this code to match the name of your list  
	list2 = context2.get_web().get_lists().getByTitle('Contacts');
	//Create a new CAML query
	caml2 = new SP.CamlQuery();
	caml2.set_viewXml('<View><RowLimit>1000</RowLimit></View>');
	//Specify the query and load the list oject  
	returnedItems2 = list2.getItems(caml2);
	context2.load(returnedItems2);
	//Run the query asynchronously, passing the functions to call when a response arrives  
	context2.executeQueryAsync(speakerCallback, onFailedCallback);
}

//speakerCallback stores all the speaker/contact details in objects
function speakerCallback(sender, args) {
	//Items returned from the query
	var enumerator2 = returnedItems2.getEnumerator();
	while(enumerator2.moveNext()) {
		listItem2 = enumerator2.get_current();
		//Store each type of data in an object for each contact, each field is part of the contact			
		var tempObj = new Object();
		tempObj.Name = listItem2.get_item(titleString);
		tempObj.Job = listItem2.get_item(jobString);
		tempObj.Address = listItem2.get_item(streetString);
		tempObj.City = listItem2.get_item(cityString);
		tempObj.State = listItem2.get_item(stateString);
		tempObj.Phone = listItem2.get_item(phoneString);
		tempObj.Fax = listItem2.get_item(faxString);
		tempObj.Email = listItem2.get_item(emailString);
		tempObj.Designations = listItem2.get_item(designationString);
		tempObj.FR = listItem2.get_item(FRNumberString);
		tempObj.NO = listItem2.get_item(NONumberString);
		tempObj.DNO = listItem2.get_item(DNONumberString);
		tempObj.Contact = listItem2.get_item(contactString);
		tempObj.Agreement = listItem2.get_item(speakerAgreeString);
		tempObj.Compliance = listItem2.get_item(speakerComplianceString);
		speakerObjectList.push(tempObj);
	}
}

//queryVenue queries venues list and calls venueCallBack
function queryVenue() {
	var context4;
	var list4;
	var caml4;
	//Get the current context  
	context4 = new SP.ClientContext();
	//Get the Sessions list. Alter this code to match the name of your list  
	list4 = context4.get_web().get_lists().getByTitle('Venues');
	//Create a new CAML query
	caml4 = new SP.CamlQuery();
	caml4.set_viewXml('<View><RowLimit>1000</RowLimit></View>');
	//Specify the query and load the list oject  
	returnedItems4 = list4.getItems(caml4);
	context4.load(returnedItems4);
	//Run the query asynchronously, passing the functions to call when a response arrives  
	context4.executeQueryAsync(venueCallback, onFailedCallback);
}

//venueCallback gets venues and stores venue information in object
function venueCallback(sender, args) {
	//Items returned from the query
	var enumerator4 = returnedItems4.getEnumerator();
	while(enumerator4.moveNext()) {
		listItem4 = enumerator4.get_current();
		//Store each type of data in an object for each venue, each field is part of the contact	
		var tempObj = new Object();
		tempObj.Name = listItem4.get_item(titleString);
		tempObj.Address = listItem4.get_item(streetString);
		tempObj.City = listItem4.get_item(cityString);
		tempObj.State = listItem4.get_item(stateString);
		tempObj.Zip = listItem4.get_item(zipString);
		tempObj.Phone = listItem4.get_item(reservationString);
		venueObjectList.push(tempObj);
	}
}

//This function loads the list and runs the query to produce the T&C Report
function queryListItems() {	
	startDate = new Date(document.getElementById("startRange").value);
	endDate = new Date(document.getElementById("endRange").value);
	//account for time zone difference
	startDate.setDate(startDate.getDate() + startDate.getTimezoneOffset() / MINUTEINHOUR / HOURINDAY);
	//account for time zone difference, 1 is to include an extra day at the end
	endDate.setDate(endDate.getDate() + (endDate.getTimezoneOffset() / MINUTEINHOUR / HOURINDAY) + 1);
	var yourSelect = document.getElementById("listEvents");
	//Check if user has selected an event to generate report
	eventWant = yourSelect.options[yourSelect.selectedIndex].value;

	//Process which boxes are checked to display contact information accordingly
	jobTitleBool = document.getElementById("jobTitle").checked;
	phoneNumberBool = document.getElementById("phoneNumber").checked;
	emailBool = document.getElementById("email").checked;
	addressBool = document.getElementById("address").checked;
	cityStateBool = document.getElementById("cityState").checked;
	faxNumberBool = document.getElementById("faxNumber").checked;
	designationsBool = document.getElementById("Designations").checked;
	FRNumberBool = document.getElementById("FRNumber").checked;
	NONumberBool = document.getElementById("NONumber").checked;
	DNONumberBool = document.getElementById("DNONumber").checked;
	speakerAgreeBool = document.getElementById("speakerAgree").checked;
	speakerComplianceBool = document.getElementById("speakerCompliance").checked;

	if((eventWant == "base") == true) {
		alert('Please Select an Event');
	} else if(!(startDate <= endDate)) {
		alert('Invalid date range');
	}

	//Continue if user has selected an option and date range is valid
	else {
		var context;
		var list;
		var caml;
		//Get the current context  
		context = new SP.ClientContext();
		//Get the Sessions list. Alter this code to match the name of your list  
		list = context.get_web().get_lists().getByTitle('Sessions');
		//Create a new CAML query
		caml = new SP.CamlQuery();
		caml.set_viewXml('<View><RowLimit>1000</RowLimit></View>');
		//Specify the query and load the list oject  
		returnedItems = list.getItems(caml);
		context.load(returnedItems);
		//Run the query asynchronously, passing the functions to call when a response arrives  
		context.executeQueryAsync(onSucceededCallback, onFailedCallback);
	}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//This main function creates the report when the button is clicked
function onSucceededCallback(sender, args) {
	//Get an enumerator for the items in the list 
	var enumerator;
	enumerator = returnedItems.getEnumerator();
	//Formulate HTML from the list items  
	//Writing the title and styling it

	var eventPosition = -1;
	for(var i = 0; i < EventObjectList.length; i++) {
		//If the event in position i is the event we want
		if(EventObjectList[i].Name == eventWant) {
			//Store the event position
			eventPosition = i;
			break;
		}
	}

	//Initialize venueString to be displayed
	var venueString = "";
	var count = 0;
	
	//Sorts the venueObjectList by alphabetical order
	venueObjectList.sort(function(a, b){
		if(a.Name < b.Name){ 
			return -1;
		}
		if(a.Name > b.Name){
			return 1;
		}
		return 0;
	})

	//Only print out the venues that are tied to the event
	while(venueObjectList[count] != undefined) {
		for(var i = 0; i < (EventObjectList[eventPosition].Location).length; i++) {
			if(venueObjectList[count].Name == EventObjectList[eventPosition].Location[i]) {
				venueString += "<span class='venueClass'>" + venueObjectList[count].Name + "</span><br>";
				venueString += venueObjectList[count].Address + "<br>";
				venueString += venueObjectList[count].City + ", " + venueObjectList[count].State + " " + venueObjectList[count].Zip + "<br>";
				venueString += "General Phone: " + venueObjectList[count].Phone + "<br><br>";
			}
		}
		count++;
	}

	markup = "<head><link rel='stylesheet' type='text/css' href='/sites/fo/tacr/SiteAssets/myScript.css'></head>" +
		"<title>T&C Report</title><body><center><h2>2016 Annual Meeting of the Association of Network" +
		" Representatives</h2><div id='location'>" + venueString + "" +
		"</div><br></center>";
	//Loop through all the items  
	while(enumerator.moveNext()) //for each session possible
	{
		var tempEventString= ""; //initialize string to be apended
		var tempFullDate;
		listItem = enumerator.get_current();
		var eventName = (listItem.get_item('Event')).get_lookupValue();
		//gets the name of the event this session belongs to

		//full date of the session to check for range
		tempFullDate = new Date(listItem.get_item(startTimeString));

		//startHour gets the hour of the start time
		var startHour = ((listItem.get_item(startTimeString)).getHours());
		//startMinute get the minute of the start time
		var startMinute = (listItem.get_item(startTimeString)).getMinutes();

		//Execute code if session in event we want to query and in date range
		if((eventName == eventWant) && (tempFullDate >= startDate) && (tempFullDate <= endDate)) {
			//Changing the format from 24-hour to am/pm for start time
			var ampmString = (attachAmpmString(startHour)).ampmString;
			startHour = (attachAmpmString(startHour)).hour;

			//adds a 0 to the string startHour if it has 1 digit
			if(startHour.toString().length == 1) {
				startHour = "0" + String(startHour);
			} else {
				startHour = String(startHour);
			}

			//adds a 0 to the string startMinute if it has 1 digit
			if(startMinute.toString().length == 1) {
				startMinute = "0" + String(startMinute);
			} else {
				startMinute = String(startMinute);
			}

			var timeStart = startHour + ":" + startMinute + ampmString;
			//make the timeStart string to represent start time

			var endHour = ((listItem.get_item(endTimeString)).getHours());
			//endHour gets the hour of the end time
			var endMinute = (listItem.get_item(endTimeString)).getMinutes();
			//endMinute gets the minute of the end time

			//Changing the format from 24-hour to am/pm for end time
			var ampmString2 = (attachAmpmString(endHour)).ampmString;
			endHour = (attachAmpmString(endHour)).hour;

			//adds a 0 to the string endHour if it has 1 digit
			if(endHour.toString().length == 1) {
				endHour = "0" + String(endHour);
			} else {
				endHour = String(endHour);
			}

			//adds a 0 to the string endMinute if it has 1 digit
			if(endMinute.toString().length == 1) {
				endMinute = "0" + String(endMinute);
			} else {
				endMinute = String(endMinute);
			}

			//make the timeEnd string to represent end time
			var timeEnd = endHour + ":" + endMinute + ampmString2;

			var roomName = listItem.get_item(roomNameString);
			if(roomName == null) {
				roomName = "None"; //set room name to none
			}

			//gets the room location
			var roomLocation = listItem.get_item(roomLocationString);

			//count to keep track of which contact we're on
			var count = 0;
			//string of contacts to be displayed
			var contactStringSum = "";
			var tempContactString = "";
			//Arrays that contain the code to display each type of contacts
			var generalStringArray = [];
			var speakerStringArray = [];
			var hostStringArray = [];
			var chairpersonStringArray = [];

			//iterate through each contact of the session				
			while(listItem.get_item('Speakers')[count] != undefined) {
				var tempContact = listItem.get_item('Speakers')[count];
				//get the name of a speaker/contact
				var tempStr = (tempContact).get_lookupValue(); 
				tempContactString = "";
				//count is the number order of the speaker for a specific session

				//Get contact value and add to markup
				var speakerNum = -1;
				for(var i = 0; i < speakerObjectList.length; i++) {
					//find the index of the speaker stored in the array
					if(speakerObjectList[i].Name == tempStr) {
						speakerNum = i;
						break;
					}
				}

				//Add OK to the end of speaker if needed (speakerAgreement is true)
				var agreementString = "";
				if(speakerObjectList[speakerNum].Agreement) {
					agreementString = "<span class='okClass'> OK</span>"
				}
				tempContactString += "<span class='contactName'>" + tempStr + "</span>" + agreementString + "<br>";

				//display all the data for a specific speaker if it's not null, given that it is checked in the checkbox by the user	
				tempContactString += displayNotNullData("", speakerObjectList[speakerNum].Job, jobTitleBool);
				tempContactString += displayNotNullData("", speakerObjectList[speakerNum].Phone, phoneNumberBool);
				tempContactString += displayNotNullData("", speakerObjectList[speakerNum].Email, emailBool);
				tempContactString += displayNotNullData("Address: ", speakerObjectList[speakerNum].Address, addressBool);
				if ((speakerObjectList[speakerNum].City!=null)&&(speakerObjectList[speakerNum].State!=null)){
					tempContactString += displayNotNullData("", speakerObjectList[speakerNum].City+", "+speakerObjectList[speakerNum].State, cityStateBool);
				}
				else{
					tempContactString += displayNotNullData("City: ", speakerObjectList[speakerNum].City, cityStateBool);
					tempContactString += displayNotNullData("State: ", speakerObjectList[speakerNum].State, cityStateBool);
				}
				tempContactString += displayNotNullData("Fax: ", speakerObjectList[speakerNum].Fax, faxNumberBool);
				tempContactString += displayNotNullData("Designations: ", speakerObjectList[speakerNum].Designations, designationsBool);
				tempContactString += displayNotNullData("FR Number: ", speakerObjectList[speakerNum].FR, FRNumberBool);
				tempContactString += displayNotNullData("NO Number: ", speakerObjectList[speakerNum].NO, NONumberBool);
				tempContactString += displayNotNullData("DNO Number: ", speakerObjectList[speakerNum].DNO, DNONumberBool);
				tempContactString += displayNotNullData("Speaker Agreement: ", speakerObjectList[speakerNum].Agreement, speakerAgreeBool);
				tempContactString += displayNotNullData("Speaker Compliance: ", speakerObjectList[speakerNum].Compliance, speakerComplianceBool);
				
				var tempObj = new Object();
				tempObj.string=tempContactString;
				tempObj.Name=tempStr;

				//Check what type of contact this is and push the object to the specific list
				//Add to the following list when new types of contacts are added
				switch(speakerObjectList[speakerNum].Contact) {
					case "Host":
						hostStringArray.push(tempObj);
						break;
					case "General":
						generalStringArray.push(tempObj);
						break;
					case "Speaker":
						speakerStringArray.push(tempObj);
						break;
					case "Chairperson":
						chairpersonStringArray.push(tempObj);
						break;
					default:
						contactStringSum+=tempContactString;
				}
				//Increment count until there are no more contacts
				count++;
			}

			//Sorts the contacts alphabetical according to first name
			hostStringArray=sortContact(hostStringArray);
			generalStringArray=sortContact(generalStringArray);
			speakerStringArray=sortContact(speakerStringArray);
			chairpersonStringArray=sortContact(chairpersonStringArray);
			
			//reset firstContactType to true
			firstContactType = true;
			
			//The following decides the order of the type of contact that will show up
			//Add to the following list when new types of contacts are added
			contactStringSum += contactAlign(combineStringArray(speakerStringArray), "Speakers:");
			contactStringSum += contactAlign(combineStringArray(hostStringArray), "Hosts:");
			contactStringSum += contactAlign(combineStringArray(generalStringArray), "General:");
			contactStringSum += contactAlign(combineStringArray(chairpersonStringArray), "Chairperson:");

			//Whether this is a group session
			var check = "";
			if(listItem.get_item(groupSessionString) == true) {
				check = "Yes"
			} else {
				check = "No"
			}

			//add the variables to tempEventString
			//Decides the order of the columns
			tempEventString += "<tr>"; //Starts the row

			var publishStr = "";
			//if field is false then write out DO NOT PUBLISH under session name
			if(!listItem.get_item('Publish')) {
				publishStr = "<br> DO NOT PUBLISH";
			}

			var confirmString = "";
			if(listItem.get_item('Confirmed')) {
				confirmString = "<br> <span class='confirmStyle'>CONFIRMED</span>";
			}

			tempEventString += "<td><div class='time'>" + String(timeStart) + " - " + String(timeEnd) + " <br> </div>" + listItem.get_item('Source') + confirmString + publishStr + "</td>";
			//Prints out the time, source, and whether it should be published

			var locationStr = "";
			if(roomLocation != null) //if location is not null then set the location
			{
				locationStr = "<br>" + listItem.get_item(roomLocationString) + " - " + roomName;
			}

			//Gets the audience of the session
			var audienceString = "";
			var audienceData = listItem.get_item('Audience');
			if(audienceData != null) {
				audienceString = "<br>" + audienceData;
			}

			//Gets the cost of the session
			var costString = "";
			var sessionCost = listItem.get_item('Cost');
			if(sessionCost != null) {
				costString = "<br>$" + sessionCost;
			}

			//Gets the synopses
			var synopses = listItem.get_item('Synopses');
			var synopsesString = "";
			if(synopses != null) {
				synopsesString = "<br>" + synopses;
			}
			//Get the AV Needs for a session
			var avNeeds = listItem.get_item('AV_x0020_Needs');
			var avString = "";
			if(avNeeds != null) {
				avString = "<br>" + avNeeds;
			}

			tempEventString += "<td><span class='sessionName'>" + listItem.get_item('Title') + "</span>" + costString + locationStr + audienceString + avString + synopsesString + " </td>";
			tempEventString += "<td>" + contactStringSum + "</td>"; //shows information of the contact
			tempEventString += "</tr>"; //Ends the row
			
			//Creates the object that contains the string to be displayed and the date associated with the event
			var sessionOrderObject = new Object();
			sessionOrderObject.string=tempEventString;
			sessionOrderObject.date=tempFullDate;
			sessionOrderObjectArray.push(sessionOrderObject);
		}
	}
	
	//Sorts session order according to startTime
	sessionOrderObjectArray=sortEvents(sessionOrderObjectArray);
	
	var firstPage = true;
	//Add each html element in the sorted array into the document to be displayed
	for(var i = 0; i < sessionOrderObjectArray.length; i++) {
		var dayStr = (sessionOrderObjectArray[i].date).getDate();
		//Gets the string for the month from the dictionary
		var monthStr = monthDictionary[(sessionOrderObjectArray[i].date).getMonth()];
		//Gets the string for the day of week from the dictionary
		var dayOfWeekString = dayOfWeekDictionary[(sessionOrderObjectArray[i].date).getDay()];

		//Only break if it's the first page
		if(firstPage) {
			markup += "<table style='width:100%'><thead><tr><th colspan='3' class='date'>" + dayOfWeekString + ", " + monthStr + " " + dayStr + "</th></tr><tr><th class='firstColumn'>Time</th>" +
				"<th class='secondColumn'>Session</th><th class='thirdColumn'>Contacts</th></tr></thead>";
		} else {
			markup += "<table style='width:100%' class='tableBreak'><thead><tr><th colspan='3' class='date'>" + dayOfWeekString + ", " + monthStr + " " + dayStr + "</th></tr><tr><th class='firstColumn'>Time</th>" +
				"<th class='secondColumn'>Session</th><th class='thirdColumn'>Contacts</th></tr></thead>";
		}
		
		//Mark that it is past the first page
		firstPage = false;

		markup += sessionOrderObjectArray[i].string;
		//While loop to link all sessions in same day to the same table
		while(i < sessionOrderObjectArray.length - 1 && (sessionOrderObjectArray[i].date).getDate() == (sessionOrderObjectArray[i+1].date).getDate() && (sessionOrderObjectArray[i].date).getMonth() == (sessionOrderObjectArray[i+1].date).getMonth()) {
			i++;
			markup += sessionOrderObjectArray[i].string;
		}

		markup += "</table><br><br>";
	}
	//open new window, MAKE SURE POP UP WINDOW IS NOT BLOCKED
	newwindow = window.open();
	newdocument = newwindow.document;
	newdocument.write(markup);
	newdocument.close();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//This function fires when the query fails  
function onFailedCallback(sender, args) {
	//Display the details  
	alert('Query failed');
}

//Attaches either "am" or "pm" at the end of the string according to the time
function attachAmpmString(Hour) {
	var tempObject = new Object();
	if(Hour > NOON) {
		tempObject.hour = Hour - NOON;
		tempObject.ampmString = " p.m.";
	} else if(Hour == NOON) {
		tempObject.hour = Hour;
		tempObject.ampmString = " p.m.";
	} else if(Hour == 0) {
		tempObject.hour = Hour + NOON;
		tempObject.ampmString = " a.m.";
	} else {
		tempObject.hour = Hour;
		tempObject.ampmString = " a.m.";
	}
	return tempObject;
}

//Get the events list data, calls eventCallback
function getEvent() {
	var context3;
	var list3;
	var caml3;
	//Get the current context  
	context3 = new SP.ClientContext();
	//Get the Sessions list. Alter this code to match the name of your list  
	list3 = context3.get_web().get_lists().getByTitle('Events');
	//Create a new CAML query
	caml3 = new SP.CamlQuery();
	caml3.set_viewXml('<View><RowLimit>1000</RowLimit></View>');
	//Specify the query and load the list oject  
	returnedItems3 = list3.getItems(caml3);
	context3.load(returnedItems3);
	//Run the query asynchronously, passing the functions to call when a response arrives  
	context3.executeQueryAsync(eventCallback, onFailedCallback);
}

//Gets events names and put them in drop down list
function eventCallback(sender, args) {
	var enumerator3 = returnedItems3.getEnumerator();
	while(enumerator3.moveNext()) {
		//for each session possible populate the dropdown list
		listItem3 = enumerator3.get_current();
		var option = document.createElement("option");
		eventList.push(listItem3.get_item('Title'));
		option.value = listItem3.get_item('Title');
		option.innerHTML = listItem3.get_item('Title');
		var selectOption = document.getElementById("listEvents");
		selectOption.appendChild(option);

		//Stores the events into an event object list to be used later
		var tempObj = new Object();
		tempObj.Name = listItem3.get_item(titleString);
		var count = 0;
		var tempLocationArray = [];
		while(listItem3.get_item('Venue_x0020_Location')[count] != undefined) {
			tempLocationArray.push(listItem3.get_item(venueLocationString)[count].get_lookupValue());
			count++;
		}
		tempObj.Location = tempLocationArray;
		EventObjectList.push(tempObj);
	}
}

//Display data (preString+stringInput) if stringInput is not null and stringBoolean is true
function displayNotNullData(preString, stringInput, stringBoolean) {
    if(stringInput != null && stringBoolean) {
        return preString + stringInput + "<br>";
    } else {
        return "";
    }
}

//Add a space if this is the first contact type, no space if it is not
function contactAlign(nameString, spanString) {
	if(nameString != "") {
		if(!firstContactType) {
			return "<br><span class='contactType'>" + spanString + "</span><br>" + nameString;
		} else {
			firstContactType = false;
			return "<span class='contactType'>" + spanString + "</span><br>" + nameString;
		}
	}
	return "";
}

//Either select or deselect all the checkboxes
function selectDeselectAll(bool) {
	document.getElementById("jobTitle").checked = bool;
	document.getElementById("phoneNumber").checked = bool;
	document.getElementById("email").checked = bool;
	document.getElementById("address").checked = bool;
	document.getElementById("cityState").checked = bool;
	document.getElementById("faxNumber").checked = bool;
	document.getElementById("Designations").checked = bool;
	document.getElementById("FRNumber").checked = bool;
	document.getElementById("NONumber").checked = bool;
	document.getElementById("DNONumber").checked = bool;
	document.getElementById("speakerAgree").checked = bool;
	document.getElementById("speakerCompliance").checked = bool;
}

//This function returns a string formed by the string of each of the objects in the array
function combineStringArray(array) {
	var tempString="";
	for (var i=0;i<array.length;i++)
	{
		tempString+=array[i].string;
	}
	return tempString;
}

//Sorts the contacts alphabetically within the list of contact objects
function sortContact(contactList){
	var tempList=contactList;
	tempList.sort(function(a, b){
		if(a.Name < b.Name){
			return -1;
		}
		if(a.Name > b.Name){
			return 1;
		}
		return 0;
	})
	return tempList;
}

//sorts the events by start time
function sortEvents(eventObject){
	var tempList=eventObject;
	tempList.sort(function(a, b){
		if((a.date).getTime() < (b.date).getTime()){
			return -1;
			}
		if((a.date).getTime() > (b.date).getTime()){
			return 1;
			}
		return 0;
	})
	return tempList;
}

//In progress
function returnAttribute(){
	
}

//Runs 3 functions to generate the report
function generateReport() {
	querySpeaker();
	queryVenue();
	queryListItems();
}

//The following code runs as soon as the page is loaded
$(window).load(function() {
	var selectHtml = "";
	selectHtml += "";

	//Get the current date, attach 0 in front of month and day as needed
	currentDate = new Date(Date.now());
	var monthString = currentDate.getMonth() + 1;
	if(monthString < 10) {
		monthString = "0" + monthString;
	}
	var dayString = currentDate.getDate();
	if(dayString < 10) {
		dayString = "0" + dayString;
	}
	currentDate = currentDate.getFullYear() + "-" + monthString + "-" + dayString;
	
	//Update the startRange to the current date
	//document.getElementById("startRange").value = currentDate;
	//UNCOMMENT when finished if needed

	//Slightly different display below if browser is not Chrome
	/*if( navigator.userAgent.indexOf("Chrome") == -1 ) 
	{
		document.getElementById("startRange").value = "01/01/2016";
		document.getElementById("endRange").value = "01/01/2020";
	}*/
	getEvent();
});