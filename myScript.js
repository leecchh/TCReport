<script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.12.2.min.js">
</script>
<script language="javascript" type="text/javascript">  
//This example gets all the items in the Events list, up to 1000 elements  

var NOON=12;
var MINUTEINHOUR=60.0;
var HOURINDAY=24.0;
	
//This variable will hold a reference to the Events list items collection  
var eventList=[];
var eventWant="";
var returnedItems = null;
var returnedItems2 = null;
var returnedItems3 = null;
var markup;
var listItem;
var listItem2;
var listItem3;
var sel;
var opt;

//variables for ordering events by time
var eventOrder=[];
var yearArray=[];

//Array of speaker objects containing speaker information
var speakerObjectList=[];

var startDate;
var endDate;
var sessionFullDate=[];
var currentDate;
var delay=false;
  
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

var dayOfWeekDictionary={};
dayOfWeekDictionary[0]="SUNDAY";
dayOfWeekDictionary[1]="MONDAY";
dayOfWeekDictionary[2]="TUESDAY";
dayOfWeekDictionary[3]="WEDNESDAY";
dayOfWeekDictionary[4]="THURSDAY";
dayOfWeekDictionary[5]="FRIDAY";
dayOfWeekDictionary[6]="SATURDAY";
	
//Queryspeaker and speakerCallback stores all the speaker/contact details in arrays
function querySpeaker()
{
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

function speakerCallback(sender, args) 
{
//Items returned from the query
var enumerator2 = returnedItems2.getEnumerator();  
//counter to keep track of which contact we're on
var counter=0;
	while (enumerator2.moveNext()) 
	{  
		listItem2 = enumerator2.get_current();
		//Store each type of data in an object for each contact, each field is part of the contact

		var tempObj=new Object();
		tempObj.Name=listItem2.get_item('Title');
		tempObj.Job=listItem2.get_item('Job_x0020_Title');
		tempObj.Address=listItem2.get_item('Street_x0020_Address');
		tempObj.City=listItem2.get_item('City');
		tempObj.State=listItem2.get_item('State');
		tempObj.Phone=listItem2.get_item('Phone');
		tempObj.Fax=listItem2.get_item('Fax');
		tempObj.Email=listItem2.get_item('E_x002d_Mail_x0020_Address');
		tempObj.Designations=listItem2.get_item('Designations');
		tempObj.FR=listItem2.get_item('FR_x0020_Number');
		tempObj.NO=listItem2.get_item('NO_x0020_Number');
		tempObj.DNO=listItem2.get_item('DNO_x0020_Number');
		tempObj.Contact=listItem2.get_item('Contact_x0020_Type');
		tempObj.Agreement=listItem2.get_item('Speaker_x0020_agreement');
		tempObj.Compliance=listItem2.get_item('Speaker_x0020_Compliance');
		speakerObjectList.push(tempObj);

		counter++;//increment counter to move onto next contact
	}
}

//This function loads the list and runs the query to produce the table
function queryListItems() { 
	startDate=new Date(document.getElementById("startRange").value);
	endDate=new Date(document.getElementById("endRange").value);
	//account for time zone difference
	startDate.setDate(startDate.getDate()+startDate.getTimezoneOffset()/MINUTEINHOUR/HOURINDAY);
	//account for time zone difference, 1 is to include an extra day at the end
	endDate.setDate(endDate.getDate()+(endDate.getTimezoneOffset()/MINUTEINHOUR/HOURINDAY)+1);

	var yourSelect = document.getElementById( "listEvents" );	
	//Check if user has selected an event to generate report
	eventWant=yourSelect.options[ yourSelect.selectedIndex ].value;
	if ((eventWant=="base")==true)
	{
		alert('Please Select an Event');
	}
	else if(!(startDate<=endDate))
	{
		alert('Invalid date range');
	}
	
	//Continue if user has selected an option and date range is valid
	else
	{
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

  //This function fires when the query completes successfully  
function onSucceededCallback(sender, args) {  
	 //Get an enumerator for the items in the list 
	var enumerator;
	 enumerator = returnedItems.getEnumerator();  
	 //Formulate HTML from the list items  
	 //Writing the title and styling it
	 markup = "<head><link rel='stylesheet' type='text/css' href='/sites/fo/tacr/SiteAssets/myScript.css'></head>"+
	 "<title>T&C Report</title><body><center><h2>2016 Annual Meeting of the Association of Network"+
	 " Representatives</h2><div id='location'><strong>Wisconsin Center</strong><br>400 West Wisconsin Avenue<br>Milwaukee, WI 53203<br>General Phone: 414-908-6001"+
	 "</div><br></center>";  
	 //Loop through all the items  
	var order=0;
	while (enumerator.moveNext()) //for each session possible
	{  
		eventOrder[order]="";//initialize string to be apended
		 listItem = enumerator.get_current();
		var eventName=(listItem.get_item('Event')).get_lookupValue(); 
		//gets the name of the event this session belongs to
		
		//Stores the day of week, day, and the month into separate arrays
		sessionFullDate[order]=new Date(listItem.get_item('Start_x0020_DateTime'));
		//full date of the session to check for range
		
		yearArray[order]=((listItem.get_item('Start_x0020_DateTime')).getFullYear());
		
		//startHour gets the hour of the start time
		var startHour=((listItem.get_item('Start_x0020_DateTime')).getHours());

		//startMinute get the minute of the start time
		var startMinute=(listItem.get_item('Start_x0020_DateTime')).getMinutes();
			
		//Execute code if session in event we want to query and in date range
		if ((eventName==eventWant)&&(sessionFullDate[order]>=startDate)&&(sessionFullDate[order]<=endDate))
		{				
			//Changing the format from 24-hour to am/pm for start time
			var ampmString=(ampmAttach(startHour)).ampmString;
			startHour=(ampmAttach(startHour)).hour;
			
			if (startHour.toString().length==1) {startHour="0"+String(startHour);}
			else {startHour=String(startHour);}
			//adds a 0 to the string startHour if it has 1 digit
			
			if (startMinute.toString().length==1) {startMinute="0"+String(startMinute);}
			else {startMinute=String(startMinute);}
			//adds a 0 to the string startMinute if it has 1 digit
			
			var timeStart=startHour+":"+startMinute+ampmString;
			//make the timeStart string to represent start time
			
			var endHour=((listItem.get_item('End_x0020_DateTime')).getHours());
			//endHour gets the hour of the end time
			var endMinute=(listItem.get_item('End_x0020_DateTime')).getMinutes();
			//endMinute gets the minute of the end time
			
			//Changing the format from 24-hour to am/pm for end time
			var ampmString2=(ampmAttach(endHour)).ampmString;
			endHour=(ampmAttach(endHour)).hour;
			
			if (endHour.toString().length==1) {endHour="0"+String(endHour);}
			else {endHour=String(endHour);}
			//adds a 0 to the string endHour if it has 1 digit
			
			if (endMinute.toString().length==1) {endMinute="0"+String(endMinute);}
			else {endMinute=String(endMinute);}
			//adds a 0 to the string endMinute if it has 1 digit

			var timeEnd=endHour+":"+endMinute+ampmString2;
			//make the timeEnd string to represent end time
			
			var roomName=listItem.get_item('Room_x0020_Name');
			if (roomName==null)
			{
				roomName="None";//set room name to none
			}
			
			//gets the room location
			var roomLocation=listItem.get_item('Room_x0020_Location');
			
			//count to keep track of which contact we're on
			var count=0;
			//string of contacts to be displayed
			var contactString="";
			var tempContactString="";
			//Arrays that contain the code to display each type of contacts
			var generalString="";
			var speakerString="";
			var hostString="";
			var chairpersonString="";
			//iterate through each contact				
			while(listItem.get_item('Speakers')[count]!=undefined)
			{
				var tempContact=listItem.get_item('Speakers')[count];
				var tempStr=(tempContact).get_lookupValue();//get the name of a speaker
				tempContactString="";
				//count is the number order of the speaker for a specific session
					
				tempContactString+="<span class='contactName'>"+tempStr+"</span><br>";
				
				//Get contact value and add to markup
				var speakerNum=-1;
				for(var i=0;i<speakerObjectList.length;i++)
				{
					//find the index of the speaker stored in the array
					if(speakerObjectList[i].Name==tempStr)
					{
						speakerNum=i;
						break;
					}
				}
				
				//display all the data for a specific speaker if it's not null
				tempContactString+=displayNotNullData("", speakerObjectList[speakerNum].Job);
				tempContactString+=displayNotNullData("", speakerObjectList[speakerNum].Phone);
				tempContactString+=displayNotNullData("", speakerObjectList[speakerNum].Email);	
				
				//Check what type of contact this is and add to the specific string
				switch(speakerObjectList[speakerNum].Contact) {
					case "Host":
						hostString+=tempContactString;
						break;
					case "General":
						generalString+=tempContactString;
						break;
					case "Speaker":
						speakerString+=tempContactString;
						break;
					case "Chairperson":
						chairpersonString+=tempContactString;
						break;
					default:
						contactString+=tempContactString;
				}
				
				//contactString+=displayNotNullData("Fax: ", speakerObjectList[speakerNum].Fax);
				//contactString+=displayNotNullData("Address: ", speakerObjectList[speakerNum].Address);
				//contactString+=displayNotNullData("City: ", speakerObjectList[speakerNum].City);
				//contactString+=displayNotNullData("State: ", speakerObjectList[speakerNum].State);

				//contactString+="Designations: "+speakerDesignation[speakerNum]+"<br>";
				//contactString+="FR: "+speakerFR[speakerNum]+"<br>";
				//contactString+="NO: "+speakerNO[speakerNum]+"<br>";
				//contactString+="DNO: "+speakerDNO[speakerNum]+"<br>";
				//if (speakerContact[speakerNum]!=null)
				//{
				//	contactString+="Contact Type: "+speakerContact[speakerNum]+"<br>";
				//}
				
				//contactString+="Agreement: "+speakerAgree[speakerNum]+"<br>";
				//contactString+="Compliance: "+speakerCom[speakerNum]+"<br>";

				count++; //Increment count until there are no more contacts
			}
			
			//First contact type to show up, so there is no space before that type
			var firstContactType=true;
			//The following decides the order of the type of contact that will show up
			if (speakerString!="")
			{
				if (!firstContactType)
				{
					contactString+="<br>";
				}
				else
				{
					firstContactType=false;
				}
				contactString+="<span class='contactType'>Speakers:</span><br>";
				contactString+=speakerString;
			}
			if (hostString!="")
			{
				if (!firstContactType)
				{
					contactString+="<br>";
				}
				else
				{
					firstContactType=false;
				}
				contactString+="<span class='contactType'>Hosts:</span><br>";
				contactString+=hostString;
			}
			if (generalString!="")
			{
				if (!firstContactType)
				{
					contactString+="<br>";
				}
				else
				{
					firstContactType=false;
				}
				contactString+="<span class='contactType'>General:</span><br>";
				contactString+=generalString;
			}
			if (chairpersonString!="")
			{
				if (!firstContactType)
				{
					contactString+="<br>";
				}
				else
				{
					firstContactType=false;
				}
				contactString+="<span class='contactType'>Chairperson:</span><br>";
				contactString+=chairpersonString;
			}
			
			//Whether this is a group session
			var check="";
			if (listItem.get_item('Group_x0020_Session')==true)
			{
				check="Yes"
			}
			else
			{
				check="No"
			}	
			
			//add the variables to eventOrder
			//Decides the order of the columns
			eventOrder[order] += "<tr>";//Starts the row
						
			var publishStr="";
			//if field is false then write out DO NOT PUBLISH under session name
			if (!listItem.get_item('Publish'))
			{
				publishStr="<br> DO NOT PUBLISH";
			}
			
			var confirmString="";
			if (listItem.get_item('Confirmed'))
			{
				confirmString="<br> <span class='confirmStyle'>CONFIRMED</span>";
			}
			
			eventOrder[order]+="<td><div class='time'>"+String(timeStart)+" - "+String(timeEnd)+" <br> </div>"+listItem.get_item('Source')+confirmString+publishStr+"</td>";
			//Prints out the time, source, and whether it should be published
			
			var locationStr="";
			if (roomLocation!=null)//if location is not null then set the location
			{
				locationStr="<br>"+listItem.get_item('Room_x0020_Location')+" - "+roomName;
			}
			
			//Gets the audience of the session
			var audienceString="";
			var audienceData=listItem.get_item('Audience');
			if(audienceData!=null)
			{
				audienceString="<br>"+audienceData;
			}
			
			//Gets the cost of the session
			var costString="";
			var sessionCost=listItem.get_item('Cost');
			if(sessionCost!=null)
			{
				costString="<br>$"+sessionCost;
			}
			
			//Gets the synopses
			var synopses=listItem.get_item('Synopses');
			var synopsesString="";
			if(synopses!=null)
			{
				synopsesString="<br>"+synopses;
			}				

			//Get the AV Needs for a session
			var avNeeds=listItem.get_item('AV_x0020_Needs');
			var avString="";
			if(avNeeds!=null)
			{
				avString="<br>"+avNeeds;
			}
			
			eventOrder[order]+="<td><span class='sessionName'>"+listItem.get_item('Title')+"</span>"+costString+locationStr+audienceString+avString+synopsesString+" </td>";
			eventOrder[order]+="<td>"+contactString+"</td>";//shows information of the contact
			eventOrder[order]+="</tr>";//Ends the row
			//eventOrder[order] += 'Group Session: ' + check+'<br>';//Gets whether it is a group session
		 }
		 order++;//add one to the variable in order to organize the events based on start time
	}	
	
	//Selection sort O(n^2) in terms of start time, can be improved for large data sets
	for(var a=0;a<sessionFullDate.length-1;a++)
	{
		for(var b=a+1;b<sessionFullDate.length;b++)
		{
			//compare the start time of two sessions, switch if necessary to sort list of sessions
			if (sessionFullDate[a].getTime()>sessionFullDate[b].getTime())
			{
				//Flip the order html is made
				var temp=eventOrder[a];
				eventOrder[a]=eventOrder[b];
				eventOrder[b]=temp;
				
				//Flip the time of the session as well
				var tempFullTime=sessionFullDate[a];
				sessionFullDate[a]=sessionFullDate[b];
				sessionFullDate[b]=tempFullTime;
			}
		}
	}

	var firstPage=true;
	//Add each html element in the sorted array into the document to be displayed
	for(var i=0;i<eventOrder.length;i++)
	{
		//If the eventOrder is not empty, the session is in the event we want so we add it to the html
		if (eventOrder[i]!="")
		{
			var dayStr=sessionFullDate[i].getDate();
			//Gets the string for the month from the dictionary
			var monthStr=monthDictionary[sessionFullDate[i].getMonth()];
			//Gets the string for the day of week from the dictionary
			var dayOfWeekString=dayOfWeekDictionary[sessionFullDate[i].getDay()];
			
			//Only break if it's the first page
			if(firstPage){
				markup+="<table style='width:100%'><thead><tr><th colspan='3' class='date'>"+dayOfWeekString+", "+monthStr+" "+dayStr+"</th></tr><tr><th class='firstColumn'>Time</th>"+
				"<th class='secondColumn'>Session</th><th class='thirdColumn'>Contacts</th></tr></thead>";
			}
			else{
				markup+="<table style='width:100%' class='tableBreak'><thead><tr><th colspan='3' class='date'>"+dayOfWeekString+", "+monthStr+" "+dayStr+"</th></tr><tr><th class='firstColumn'>Time</th>"+
				"<th class='secondColumn'>Session</th><th class='thirdColumn'>Contacts</th></tr></thead>";
			}
		 
			firstPage=false;
			
			markup+=eventOrder[i];
			//While loop to link all sessions in same day to the same table
			while (i<eventOrder.length-1 && sessionFullDate[i].getDate()==sessionFullDate[i+1].getDate() && sessionFullDate[i].getMonth()==sessionFullDate[i+1].getMonth())
			{
				i++;
				markup+=eventOrder[i];
			}
		
			markup+="</table><br><br>";
		}
	}
  //open new window, MAKE SURE POP UP WINDOW IS NOT BLOCKED
	newwindow=window.open();
	newdocument=newwindow.document;
	newdocument.write(markup);
	newdocument.close();
}  

//This function fires when the query fails  
function onFailedCallback(sender, args) {  
  //Display the details  
  alert('Query failed');
}

function ampmAttach(Hour){
	var tempObject=new Object();
	if (Hour>NOON)
	{
		tempObject.hour=Hour-NOON;
		tempObject.ampmString=" p.m.";
	}
	else if (Hour==NOON)
	{
		tempObject.hour=Hour;
		tempObject.ampmString=" p.m.";
	}
	else if (Hour==0)
	{
		tempObject.hour=Hour+NOON;
		tempObject.ampmString=" a.m.";
	}
	else
	{
		tempObject.hour=Hour;
		tempObject.ampmString=" a.m.";
	}
	return tempObject;
}

function updateEvent()
{	
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
   
function eventCallback(sender, args) 
{ 
	var enumerator3 = returnedItems3.getEnumerator();  
	while (enumerator3.moveNext()) //for each session possible
	{  
		listItem3 = enumerator3.get_current();
		var option = document.createElement("option");
		eventList.push(listItem3.get_item('Title'));
		option.value     = listItem3.get_item('Title');
		option.innerHTML = listItem3.get_item('Title');

		var selectOption = document.getElementById("listEvents");
		selectOption.appendChild(option);
	}
}
	
function displayNotNullData(preString, stringInput){
	if (stringInput!=null)
	{
		return preString+stringInput+"<br>";
	}
	else
	{
		return "";
	}
}

function generateReport()
{
	querySpeaker ();
	queryListItems();
}	 

//The following code runs as soon as the page is loaded
  $(document).ready( function() {
	var selectHtml="";
	selectHtml+="";
	
	//Get the current date, attach 0 in front of month and day as needed
	currentDate=new Date(Date.now());
	var monthString=currentDate.getMonth()+1;
	if (monthString<10)
	{
		monthString="0"+monthString;
	}
	var dayString=currentDate.getDate();
	if (dayString<10)
	{
		dayString="0"+dayString;
	}
	currentDate=currentDate.getFullYear()+"-"+monthString+"-"+dayString;
	
	//Update the startRange to the current date
	//document.getElementById("startRange").value = currentDate;
	//UNCOMMENT when finished if needed
	
	//Slightly different display below if browser is not Chrome
	/*if( navigator.userAgent.indexOf("Chrome") == -1 ) 
	{
		document.getElementById("startRange").value = "01/01/2016";
		document.getElementById("endRange").value = "01/01/2020";
	}*/
	updateEvent();
	});