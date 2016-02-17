/*!
 * SARA interface
 *
 * Copyright(c) 2016 Fanyo Siliadin
 * Released under the MIT license
 */

/* Here are most of the "client side back end" functions of the profile management pluging.
 They have been implemented for a specific bioreactor. But since this application is generic
 you can adapt these functions to your own bioreactor/greenhouse */

var nbOfFieldsInTask=10; //[RED,IR,WHITE,BLUE,T_AIR,H_GROUND,WATER,N,P,K]

var open_profile = function (profil_model){
	document.getElementById("profile_name").value= profil_model.get("name");
	document.getElementById("profile_description").value= profil_model.get("description");
	document.getElementById("execution_step").value= profil_model.get("execution_step");
	var profile_csv= JSON.parse(profil_model.get("data"));

	fill_table(profile_csv);
	profile_header_access(false);
	profile_data_access(false);
}

var profile_task_field_checking = function(profile){
	/* Check if the profile csv loaded file contains all of the fields of the profile csv pattern.
	 In my case the fields are [RED,IR,WHITE,BLUE,T_AIR,H_GROUND,WATER,N,P,K] if you have other fields
	 change the code accordingly */
	 
	var a=-1, b=-1, c=-1, d=-1, e=-1, f=-1, g=-1, h=-1, k=-1, m=-1;
	a=JSON.stringify(profile).search("RED"); 
	b=JSON.stringify(profile).search("IR");
	c=JSON.stringify(profile).search("WHITE");
	d=JSON.stringify(profile).search("BLUE");
	e=JSON.stringify(profile).search("T_AIR");
	f=JSON.stringify(profile).search("H_GROUND");
	g=JSON.stringify(profile).search("WATER");
	h=JSON.stringify(profile).search("N");
	k=JSON.stringify(profile).search("P");
	m=JSON.stringify(profile).search("K");
	
	if(a==-1||b==-1||c==-1||d==-1||e==-1||f==-1||g==-1||h==-1||k==-1||m==-1) // check if the header of the csv file is complete
	{	alert("some columns are missing in the file. \n\n\n status: FAILED TO LOAD"); return false; }
	
	
	for (i=0; i<profile.length-1; i++){ // check if the cells values are numeric
		var l=i+2;
		if( !$.isNumeric(profile[i].RED)||!$.isNumeric(profile[i].IR)||!$.isNumeric(profile[i].WHITE)||!$.isNumeric(profile[i].T_AIR)||!$.isNumeric(profile[i].H_GROUND)||!$.isNumeric(profile[i].BLUE)||!$.isNumeric(profile[i].WATER)||!$.isNumeric(profile[i].N)||!$.isNumeric(profile[i].P)||!$.isNumeric(profile[i].K))
		{ alert("Line "+l+": some fields are not numeric. \n\n\n status: FAILED TO LOAD");	return false;}
	}
	for (i=0; i<profile.length-1; i++){ 
		var l=i+2;
		//check if the percentage values are between 0 and 100
		if(parseFloat(profile[i].RED)<0 || parseFloat(profile[i].RED)>100 || parseFloat(profile[i].IR)<0 || parseFloat(profile[i].IR)>100 || parseFloat(profile[i].WHITE)<0 || parseFloat(profile[i].WHITE)>100 || parseFloat(profile[i].BLUE) <0 || parseFloat(profile[i].BLUE)>100 || parseFloat(profile[i].H_GROUND)<0 || parseFloat(profile[i].H_GROUND>100)|| parseFloat(profile[i].WATER)<0 || parseFloat(profile[i].WATER>100)|| parseFloat(profile[i].N)<0 || parseFloat(profile[i].N>100)|| parseFloat(profile[i].P)<0 || parseFloat(profile[i].P>100)|| parseFloat(profile[i].K)<0 || parseFloat(profile[i].K>100))
		{ alert("Line "+l+": certain percentage values ​​are greater than 100 or negative. \n\n\n status: FAILED TO LOAD");	return false;}
		if(parseFloat(profile[i].WATER)+ parseFloat(profile[i].N)+ parseFloat(profile[i].P)+parseFloat(profile[i].K)!=100)// check if the mixture composition is coherent
		{ alert("Line "+l+": percentage of N, P, K and WATER are incoherent. \n\n\n status: FAILED TO LOAD"); return false;}
	}
	
	return true;
}

var insert_line= function(l, profile, empty_task){ //inserts a new task in the profile past in argument. This function requires the index of the row and a boolean saying either or not the new task should be empty
	
	var table, row, cell0, cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9, cell10, cell11, id, line_index;
	table= document.getElementById("profile_table");
	row= table.insertRow(l); //inserts a line and the cells
		cell0= row.insertCell(0);
		cell1= row.insertCell(1);
		cell2= row.insertCell(2);
		cell3= row.insertCell(3);
		cell4= row.insertCell(4);
		cell5= row.insertCell(5);
		cell6= row.insertCell(6);
		cell7= row.insertCell(7);
		cell8= row.insertCell(8);
		cell9= row.insertCell(9);
		cell10= row.insertCell(10);
		cell11= row.insertCell(11);
		
		line_index=l+1;
		id= nbOfFieldsInTask*l-nbOfFieldsInTask+1; //determines the id of the first cell of the row
		
		if(!empty_task){ //if the task should not remain empty, then fill the cells with the corresponding values of the profile
						//this case is used during the display of an existing profile
			
			cell0.innerHTML= '<input id='+id+' type="text" class="RED" readonly  value='+profile[l-1].RED+'>';id++;
			cell1.innerHTML= '<input id='+id+' type="text" class="IR" readonly  value='+profile[l-1].IR+'>';id++;
			cell2.innerHTML= '<input id='+id+' type="text" class="WHITE" readonly  value='+profile[l-1].WHITE+'>';id++;
			cell3.innerHTML= '<input id='+id+' type="text" class="BLUE" readonly  value='+profile[l-1].BLUE+'>';id++;
			cell4.innerHTML= '<input id='+id+' type="text" class="T_AIR" readonly  value='+profile[l-1].T_AIR+'>';id++;
			cell5.innerHTML= '<input id='+id+' type="text" class="H_GROUND" readonly  value='+profile[l-1].H_GROUND+'>';id++;
			cell6.innerHTML= '<input id='+id+' type="text" class="WATER" readonly  value='+profile[l-1].WATER+'>';id++;
			cell7.innerHTML= '<input id='+id+' type="text" class="N" readonly  value='+profile[l-1].N+'>';id++;
			cell8.innerHTML= '<input id='+id+' type="text" class="P"readonly  value='+profile[l-1].P+'>';id++;
			cell9.innerHTML= '<input id='+id+' type="text" class="K"readonly  value='+profile[l-1].K+'>';
			
		cell10.innerHTML= '<span class="ligne">l. '+line_index+'</span>';
		
		var id2=id+1;
		cell11.innerHTML= '<button  disabled onclick= \'delete_line('+l+')\'>x</button><button id= disabled onclick=\'add_line('+l+')\'>+</button>';
		
		}
		else{ //if the task should remain empty
				// this case is used when the user wants to insert himself a new task
				
			update_ID(l+1, "adding"); // updates the ids of the cells below the current one
			
			cell0.innerHTML= '<input id='+id+' type="text"   value="RED">';id++;
			cell1.innerHTML= '<input id='+id+' type="text"   value="IR">';id++;
			cell2.innerHTML= '<input id='+id+' type="text"   value="WHITE">';id++;
			cell3.innerHTML= '<input id='+id+' type="text"   value="BLUE">';id++;
			cell4.innerHTML= '<input id='+id+' type="text"   value="T_AIR">';id++;
			cell5.innerHTML= '<input id='+id+' type="text"   value="H_GROUND">';id++;
			cell6.innerHTML= '<input id='+id+' type="text"   value="WATER">';id++;
			cell7.innerHTML= '<input id='+id+' type="text"   value="N">';id++;
			cell8.innerHTML= '<input id='+id+' type="text"   value="P">';id++;
			cell9.innerHTML= '<input id='+id+' type="text"   value="K">';
			
			cell10.innerHTML= '<span class="ligne">l. '+line_index+'</span>';
		
			var id2=id+1;
			cell11.innerHTML= '<button  onclick= \'delete_line('+l+')\'>x</button><button  onclick=\'add_line('+l+')\'>+</button>';
	
			
		}
}

var update_ID= function(first_line, action ){ //updates the id of the cells below the indicated line "first_line", also precise if the update is done after a line adding or a line removing with the variable "action"
	
	var table, new_id, former_id, id;
	table= document.getElementById("profile_table");
	
	if(action=="adding")
	{
		for (var i=table.rows.length-1;i>=first_line; i--)
		{
			for( var j=1; j<=nbOfFieldsInTask; j++){
				new_id= nbOfFieldsInTask*i-nbOfFieldsInTask+j;
				former_id= new_id-nbOfFieldsInTask;
				document.getElementById(former_id).id=new_id;
			}
		}
	}
	else if(action=="removing")
	{
		for(var i=first_line; i<table.rows.length; i++)
		{
			for( var j=1; j<=nbOfFieldsInTask; j++){
				new_id= nbOfFieldsInTask*i-nbOfFieldsInTask+j;
				former_id= nbOfFieldsInTask*(i+1)-nbOfFieldsInTask+j;
				document.getElementById(former_id).id=new_id;
			}
		}
	}
	
}


var fill_table= function(profile){
    
	$("#profile_table").find("tr:not(:first)").remove(); //empty the table
	
	
	for(i=0; i<profile.length-1;i++)
	{ //inserts the profile's tasks one by one 
		var l=i+1;
		insert_line(l,profile, false);
	}
}

var read_profile_array= function(){ //reads the values of the table and saves it as an array 
	
	var Task= function(){
		this.RED, this.IR, this.WHITE, this.BLUE, this.T_AIR, this.H_GROUND, this.N, this.P, this.K;
	}
	var Profile_Array_instance= new Array();
	
	for(i=1;i<=document.getElementById("profile_table").rows.length;i++) 
	{
		var id  = nbOfFieldsInTask*i-nbOfFieldsInTask+1;
		
		Profile_Array_instance[i-1]= new Task();
		try{
		Profile_Array_instance[i-1].RED= document.getElementById(id).value;id++;
		Profile_Array_instance[i-1].IR= document.getElementById(id).value;id++;
		Profile_Array_instance[i-1].WHITE= document.getElementById(id).value;id++;
		Profile_Array_instance[i-1].BLUE= document.getElementById(id).value;id++;
		Profile_Array_instance[i-1].T_AIR= document.getElementById(id).value;id++;
		Profile_Array_instance[i-1].H_GROUND= document.getElementById(id).value;id++;
		Profile_Array_instance[i-1].WATER= document.getElementById(id).value;id++;
		Profile_Array_instance[i-1].N= document.getElementById(id).value;id++;
		Profile_Array_instance[i-1].P= document.getElementById(id).value;id++;
		Profile_Array_instance[i-1].K= document.getElementById(id).value;id++;
		

		}catch(e){}	
	}
	return Profile_Array_instance;
	
}

var profile_header_access= function(accessible){ //disable or enable the access to the header of a profil in the editor
	
	header= document.getElementById("profil_header");
	var header_inputs= header.getElementsByTagName("input");
	var header_textarea= header.getElementsByTagName("textarea");
	switch (accessible){
		case true: 
			for(i=0; i<header_inputs.length;i++)
				header_inputs[i].readOnly=false;
			for(i=0; i<header_textarea.length; i++)
				header_textarea[i].readOnly=false;
			break;
		case false:
			for(i=0; i<header_inputs.length;i++)
				header_inputs[i].readOnly=true;
			for(i=0; i<header_textarea.length; i++)
				header_textarea[i].readOnly=true;
			break;
	}
}

var profile_data_access= function(accessible){ //disable or enable the access to the data of a profil in the editor
	
	table= document.getElementById("profile_table");
	var inputs =table.getElementsByTagName("input");
	var action =table.getElementsByTagName("button");
	
	switch (accessible){
		case true: 
			for(i=0;i<inputs.length;i++)
				inputs[i].readOnly=false;
			for(i=0;i<action.length;i++)
				action[i].disabled=false;
			break;
		case false:
			for(i=0;i<inputs.length;i++)
				inputs[i].readOnly=true;
			for(i=0;i<action.length;i++)
				action[i].disabled=true;
			break;
	}
}

