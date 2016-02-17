/*!
 * SARA interface
 *
 * Copyright(c) 2016 Fanyo Siliadin
 * Released under the MIT license
 */
 
 
/* The user is able to directly influence the greenhouse/bioreactor by heating, spraying, cooling, or changing the lighting 
	Here are the views allowing the user to those actions */		
	
		var Lighting_Order_View= Backbone.View.extend({
			el:"#lighting_button",
			events:{
				"click":"Clicked"
			},
			Clicked: function(){
			// I picture the light composition at the moment of the click
			var red= illumination.get("red");
			var infrared= illumination.get("infrared");
			var white= illumination.get("white");
			var blue= illumination.get("blue");
			
			// I update the slidebars with the lighting values pictured 
			$("#red_intensity").val(red);
			$("#red_intensity").slider('refresh');
			$("#infrared_intensity").val(infrared);
			$("#infrared_intensity").slider('refresh');
			$("#white_intensity").val(white);
			$("#white_intensity").slider('refresh');
			$("#blue_intensity").val(blue);
			$("#blue_intensity").slider('refresh');
			}
		});
		
		var Lighting_Order_Validation= Backbone.View.extend({
			el: "#validate_lighting_order",
			events:{
			"click":"Clicked"
			},
			initialize: function(){},
			Clicked: function(){
				var red_order= document.getElementById("red_intensity").value;
				var infrared_order= document.getElementById("infrared_intensity").value;
				var white_order= document.getElementById("white_intensity").value;
				var blue_order= document.getElementById("blue_intensity").value;
				// POST request to send the lighting order
				alert("action performed");
			}
		});
		
		var Mixture_list_view2= Backbone.View.extend({ // this select menu contains all the existing mixtures, the user can choose one 
												// and build the mixture to spray from it.
			el: "#Mixture_list2",
			events:{
			"change": "onSelect"
			},
			initialize: function(){},
			onSelect: function(){
				var selected_mixture = My_Mixture_Collection.get($("#Mixture_list2").val()); 
				//fill the inputs with the values of the selected mixture
				document.getElementById("WaterToSpray").value= selected_mixture.get("water_volume");
				document.getElementById("NitrogenToSpray").value= selected_mixture.get("nitrogen_volume");
				document.getElementById("PhosphoreToSpray").value= selected_mixture.get("phosphore_volume");
				document.getElementById("PotassiumToSpray").value= selected_mixture.get("potassium_volume");
				
			},
			render: function(){
				$('#Mixture_list2 option[value!="0"]').remove();
				My_Mixture_Collection.forEach(function(model){
					$("#Mixture_list2").append("<option value='" + model.get("id")+ "'>" + model.get("name") + "</option>");

				});
			}
			
		});
		
		var Spray_Order_View= Backbone.View.extend({
			el: "#spray_button",
			events:{
				"click":"Clicked"
			},
			initialize: function(){},
			Clicked: function(){
				document.getElementById("WaterToSpray").value="";
				document.getElementById("NitrogenToSpray").value="";
				document.getElementById("PhosphoreToSpray").value="";
				document.getElementById("PotassiumToSpray").value="";
				this.Mixture_list_view2_instance= new Mixture_list_view2();
				this.Mixture_list_view2_instance.render();
			}
		});
		
		var Spray_Order_Validation= Backbone.View.extend({
			el:"#validate_spray_order",
			events:{
				"click":"Clicked"
			},
			initialize: function(){
				
			},
			Clicked: function(){
				var water= $('#WaterToSpray').val();
				var nitrogen= $('#NitrogenToSpray').val();
				var phosphore= $('#PhosphoreToSpray').val();
				var potassium= $('#PotassiumToSpray').val();
				// POST request to send the spray order
				alert("action performed");
			}
		});
		
		var Heating_Order_Validation= Backbone.View.extend({
			el: "#validate_heating_order",
			events:{
				"click": "Clicked"
			},
			initialize: function(){},
			Clicked: function(){
				var temperature_increment= document.getElementById("heat").value;
				// POST request to send the heating order
				alert("action performed");
			}
		});
		
		var Refreshing_Order_Validation= Backbone.View.extend({
			el: "#validate_refreshing_order",
			events:{
				"click": "Clicked"
			},
			initialize: function(){},
			Clicked: function(){
				var wind_intensity= $("#WindIntensity").val();
				// POST request to send the heating order
				alert("action performed");
			}
		});
		
		
		var Lighting_Order_View_instance= new Lighting_Order_View();
		var Lighting_Order_Validation_instance= new Lighting_Order_Validation();
		var Spray_Order_Validation_instance= new Spray_Order_Validation();
		var Heating_Order_Validation_instance= new Heating_Order_Validation();
		var Refreshing_Order_Validation_instance= new Refreshing_Order_Validation();
		var Spray_Order_View_instance= new Spray_Order_View();
