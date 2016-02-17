/*!
 * SARA interface
 *
 * Copyright(c) 2016 Fanyo Siliadin
 * Released under the MIT license
 */ 
 
 
var nb_click_on_tree=0;
var Profile_Collection_MaxLength=0;

var Profile_Model = Backbone.Model.extend({ //Backbone Model describing a profile
	defaults:{
		id:0,
		data:'', 			// a parsed csv file which contains all the tasks the bioreactor has to perform
		execution_step:5, 	// defines the frequency of task execution
		name:"",
		description:"",
		executing:false		/* since there may be several profiles and you can execute only one at a time
							   this boolean tells you either or not a profile is being executed */
	},
	validate: function(attributes){
		if(attributes.name==="" || attributes.data!="")
			return "A profile needs a name and the data area cannot be empty";
		if(attributes.execution_step<1)
			return "The execution step cannot be less than 1";
	},
	initialize: function(){
		this.on("invalid", function(model, error){console.log(error);});
		}
	
});

var Profile_Collection= Backbone.Collection.extend({ // Backbone Collection which gathers all the profiles
	model: Profile_Model,
	//url:// the place to find the Mixture collection in database. Depends on your Rest API implementation
	initialize: function(){
			this.on("change:executing", function (model){
				if(model.get("executing")==true){
					this.executing_profile_display= new Current_profile_view({model:model});
					this.executing_profile_display.render();
				}
				
			});
			this.on("add", function(model){
				Profile_Collection_MaxLength++;
				this.tree_view_instance= new tree_View();
				this.tree_view_instance.render();
				// POST request to sync the collection with database
			});
			this.on("remove", function(model){
				this.tree_view_instance= new tree_View();
				this.tree_view_instance.render();
				// POST request to sync the collection with database
			});
				
	}
});
var My_Profile_Collection= new Profile_Collection();
// here send the GET request to load the profile collection from the server 

var Current_profile_view= Backbone.View.extend({ //display the profile being executed name
	template: _.template($("#executing_profile").html()),
	initialize: function(){
		this.$el= $("#executing_profile_display");
	},
	render: function(){
		this.$el.html(this.template(this.model.attributes));
	}
});

var Execute_profile_view= Backbone.View.extend({ //on click of "execute" button
	el:"#apply_profile",
	events:{
		"click":"Clicked"
	},
	Clicked: function(){
			var selected_profile= $("#profiles_list").val();
			if(selected_profile!=0)
			{
				My_Profile_Collection.forEach(function(model){
					if(model.get("id")==selected_profile)
					{	
						update_executing_profile(model);
						/* here send the POST request to execute model */
					}
						
				});
			}	
		
		}
});
var Execute_profil_view_instance= new Execute_profile_view();

var help_button_View= Backbone.View.extend({   // on click on "help" button

	el: "#help",
	events:{
	"click": "Clicked"
	},
	Clicked: function(){
		alert("This session is for advanced users\n You can be directly managing your profiles:\n\t -execute \n\t -view \n\t -modify \n\t -add \n\t -delete \n keep in mind that these actions affect the growth of your plant ");
	}
});
var help_button_View_instance= new help_button_View();

var tree_View= Backbone.View.extend({     // on click on sara logo
	
		el: "#tree_img",
			events:{
			'click':'Clicked'
			},
		Clicked: function(){
			
			if(nb_click_on_tree%2==0)
			{	
				document.getElementById('profile_management_panel').style.display='block';
			 	this.render();
			}
			else
				document.getElementById('profile_management_panel').style.display='none';
			nb_click_on_tree++;
		},
		render: function(){
			$('#profiles_list option[value!="0"]').remove();
			My_Profile_Collection.forEach(function(model){
				$("#profiles_list").append("<option value='" + model.get("id")+ "'>" + model.get("name") + "</option>");
				
				if(model.get("executing")==true)
				{
					this.Current_profile_view_instance= new Current_profile_view({model:model});
					this.Current_profile_view_instance.render();
				}
			});
		}
		
});
var tree_View_instance= new tree_View();

var Delete_profile_view= Backbone.View.extend({  // on click on "delete" button
	el:"#delete_profile",
	events:{
		"click":"Onclick"
	},
	Onclick: function(){
		var selected_profile= $("#profiles_list").val();
		var profile_to_delete= My_Profile_Collection.get(selected_profile);
		
		if (profile_to_delete.get("executing"))
			alert("You cannot delete a profile while it is being executed");
		else
		{
			My_Profile_Collection.remove(profile_to_delete);
			alert("The profile \""+profile_to_delete.get("name")+"\" has been deleted");
		}
		
		
	}
});
var Delete_profile_view_instance= new Delete_profile_view();
											 
var Create_profil_view= Backbone.View.extend({ //on click on "create profile" button
	el:"#create_profile",
	events:{
		"click":"Onclick"
		},
	Onclick: function(){
		var Task= function(){ /*a task class, a task is a setpoint of luminosity, spray and temperature that you want your 
								bioreactor/greenhouse to perform at time t.
								In my implementation the light is composed of red, infrared, white and blue. My spray is a mix of
								nitrogen, potassium, phosphorus and water. And I choose to handle the temperature of the air and
								the humidity of the ground. Obviously the task depends on what your bioreactor/greenhouse is able to do.
								Even if this interface has been designed for a very complex bioreactor you can easily change the code to stick with your needs */
								
		this.RED, this.IR, this.WHITE, this.BLUE, this.T_AIR, this.H_GROUND, this.WATER, this.N, this.P, this.K;
		}
		var Profile_Array_instance= new Array();
		for(var i=0;i<2;i++){
		Profile_Array_instance[i]= new Task();
		Profile_Array_instance[i].RED= "";
		Profile_Array_instance[i].IR="";
		Profile_Array_instance[i].WHITE="";
		Profile_Array_instance[i].BLUE="";
		Profile_Array_instance[i].T_AIR="";
		Profile_Array_instance[i].H_GROUND="";
		Profile_Array_instance[i].WATER="";
		Profile_Array_instance[i].N="";
		Profile_Array_instance[i].P="";
		Profile_Array_instance[i].K="";
		}
		this.profile= new Profile_Model({id:Profile_Collection_MaxLength+1, execution_step:5, name:"new profile", description:"new profile", data: JSON.stringify(Profile_Array_instance), executing:false},{validate:false});
		open_profile(this.profile);
		$( "#profile_frame" ).popup( "open" );
	}	
});
Create_profil_view_instance= new Create_profil_view();
/*fonction de mise à jour de la collection de profile*/
 var update_executing_profile= function(Executing_profil){
	 My_Profile_Collection.forEach(function(model){
		 
		 if(model===Executing_profil)
		 	model.set({executing:true});
		 else
		 	model.set({executing:false});
 		});
	}
/*fin de la fonction de mise à jour de la collection de profile*/

var Open_profile_View = Backbone.View.extend({ // on click on "open" button
	el:"#open_profile",
	events:{
		"click":"onClick"
	},
	onClick: function(){
		var selected_profile= $("#profiles_list").val();
		if(selected_profile!=0)
		{
			$( "#profile_frame" ).popup( "open" );
			var profile_to_display= My_Profile_Collection.get(selected_profile);
			open_profile(profile_to_display);
			
		}
	}
	
});
var Open_profile_View_instance= new Open_profile_View();

var Profile_loaded_View= Backbone.View.extend({ // once a csv file is loaded
	el: "#uploaded_profile",
	events:{
		'change':'onSelect'
	},
	onSelect: function(){
		
		var file= document.getElementById("uploaded_profile").files[0];
			Papa.parse(file, { //parsing the csv file 
			  header: true,
			  dynamicTyping: true,
			  complete: function(results) {
				var	profile =results.data;
				
				if(profile_task_field_checking(profile)==true) // if the file matches the profile pattern
				{
					
					var id= Profile_Collection_MaxLength+1;
					var d= new Date();
					var month= d.getMonth()+1;
					var creation= d.getFullYear()+"/"+month+"/"+d.getDate()+" at "+d.getHours()+"h"+d.getMinutes();
					My_Profile_Collection.forEach(function(model){
						if (model.get("name")==file.name)
							My_Profile_Collection.remove(model);
					});
					My_Profile_Collection.add({id:id, name:file.name, description:"created on :"+creation, data:JSON.stringify(profile)});
					
				}
			  }
			});
		
	}
});
var Profile_loaded_View_instance= new Profile_loaded_View(); 

var Edit_profile_View = Backbone.View.extend({ // on click on "edit" button
	el:"#edit_profile",
	events:{
		"click":"onClick"
	},
	onClick: function(){
		profile_header_access(true);
		profile_data_access(true);
			
	}
	
});
Edit_profile_View_instance= new Edit_profile_View();

var Save_profile_View = Backbone.View.extend({ // on click on "save" button
	el:"#save_profile",
	events:{
		"click":"onClick"
	},
	onClick: function(){

		var Profile_Array_to_save_instance= read_profile_array();
		if(profile_task_field_checking(Profile_Array_to_save_instance))
		{	
			My_Profile_Collection.forEach(function(model){
				if (model.get("name")==$("#profile_name").val())
					My_Profile_Collection.remove(model); //if another profile with the same name exists the new one override it
					});
			My_Profile_Collection.add({id:Profile_Collection_MaxLength+1, name:$("#profile_name").val(), description:$("#profile_description").val(), execution_step:$("execution_step").value, data:JSON.stringify(Profile_Array_to_save_instance)},{validate:false});
			alert("Profile saved");
		
		}
			
	}
});
var Save_profile_View_instance= new Save_profile_View();

var Leave_profile_View= Backbone.View.extend({  //on click on "quit" button
	el: "#quit_profile_panel",
	events:{
		'click':'Onclick'
	},
	Onclick: function(){
		$( "#profile_frame" ).popup( "close" );
	}
});
var Leave_profile_View_instance= new Leave_profile_View();
  