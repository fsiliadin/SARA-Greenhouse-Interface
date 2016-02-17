/*!
 * SARA interface
 *
 * Copyright(c) 2016 Fanyo Siliadin
 * Released under the MIT license
 */
	var Mixture_Collection_MaxLength=0;
  
	var Mixture_Model = Backbone.Model.extend({

	defaults:{
		id:0,
		water_volume:0,
		nitrogen_volume:0,
		potassium_volume:0,
		phosphore_volume:0,
		name:"enter a name",
		description:"A description is required"
		},


	validate: function(attributes){
	  
		if(attributes.name === ""||attributes.name === "enter a name")
			return "You must name your mixture\n";
		
		if(attributes.description===""||attributes.description==="A description is required")
			return "You should add a description\n";
		
		if((isNaN(attributes.water_volume) || isNaN(attributes.nitrogen_volume) || isNaN(attributes.potassium_volume) || isNaN(attributes.phosphore_volume)) ||(attributes.water_volume<0|| attributes.nitrogen_volume<0 || attributes.potassium_volume<0 || attributes.phosphore_volume<0))
			return "the quantities are not valid \n";
		
		if(attributes.water_volume===0 && attributes.nitrogen_volume===0 && attributes.potassium_volume===0 && attributes.phosphore_volume===0)
			return "the mixture cannot be empty\n";
		
	  },

	  initialize: function(){
			this.on("invalid", function(model, error){
				alert(error);
			})
		}
	});
	var Mixture_Collection = Backbone.Collection.extend({ // Backbone Collection which gathers all the mixtures
			model: Mixture_Model,
			//url:// the place to find the Mixture collection in database. Depends on your Rest API implementation
			initialize: function(){
				this.on("add", function(model){
					Mixture_Collection_MaxLength++;
					// POST request to sync the collection with database
				});
				this.on("remove", function(model){
					// POST request to sync the collection with database
				});
			}
	});
	
	var My_Mixture_Collection = new Mixture_Collection();
	var DefaultMixture= new Mixture_Model({},{validate:false});	
	
	var Add_Mixture= Backbone.View.extend({ //on click on "add mixture" button
		el: "#add_mixture_button",
		events:{
		"click": "Clicked"
		},
		initialize: function(){
		},
		Clicked: function(){
			var nameToDisplay;
			
			My_Mixture_Collection.forEach(function(model){
				
				if (model.get("name")==$("#mixture_name").val()) //if the added mixture name corresponds to another one in the collection
					My_Mixture_Collection.remove(model); // the former mixture is removed

			});
			
			My_Mixture_Collection.add(new Mixture_Model({water_volume:$("#mixture_water").val(), nitrogen_volume:$("#mixture_nitrogen").val(), potassium_volume:$("#mixture_potassium").val(), phosphore_volume:$("#mixture_phosphore").val(), name: $("#mixture_name").val(), description: $("#mixture_description").val(), id:Mixture_Collection_MaxLength+1 },{validate:true}));
			this.Mixture_list= new mixture_list_view();
			this.Mixture_list.render();
			alert("Mixture successfully added");
				
		}
		
	});
	
	var Edit_Mixture= Backbone.View.extend({  //on click on "edit mixture" button
		el: "#edit_mixture_button",
		events:{
			"click" : "Clicked"
			},
		initialize: function(){
		},
		Clicked: function(){
			var selected_mixture= $("#Mixture_list").val();
			this.panelView= new Mixture_PanelView({model:My_Mixture_Collection.get(selected_mixture)});
			this.panelView.render();
			}
	});
	
	var delete_mixture= Backbone.View.extend({//on click on "delete mixture" button
		el: "#delete_mixture_button",
		events:{
			"click": "Clicked"
			},
		initialize: function(){},
		Clicked: function(){
			var selected_mixture= $("#Mixture_list").val();
			var nameToDisplay=My_Mixture_Collection.get(selected_mixture).get("name");
			My_Mixture_Collection.remove(My_Mixture_Collection.get(selected_mixture));
			$("#choice").text("Choose");
			this.Mixture_list= new mixture_list_view();
			this.Mixture_list.render();
			this.mixtureview= new Mixture_PanelView({model:DefaultMixture});
			this.mixtureview.render();
			alert("the mixture \""+nameToDisplay+"\" has been deleted");
			}
	
	});		
	
	var mixture_list_view= Backbone.View.extend({
		el: "#Mixture_list",
		events:{
		"change": "onSelect"
		},
		initialize: function(){},
		onSelect: function(){
			var selected_mixture= $("#Mixture_list").val();
			var nameToDisplay= My_Mixture_Collection.get(selected_mixture).get("name");
			$("#choice").text(nameToDisplay);
		},
		render: function(){
			$('#Mixture_list option[value!="0"]').remove();
			My_Mixture_Collection.forEach(function(model){
				$("#Mixture_list").append("<option value='" + model.get("id")+ "'>" + model.get("name") + "</option>");
			});
		}
		
	});
	
	var Mixture_PanelView= Backbone.View.extend({ //contains all the views above 
		view_template: _.template($("#mixture_template").html() ),
		
		initialize: function(){
			this.$el=$('#mixturePanel');
			this.add= new Add_Mixture();
			this.edit= new Edit_Mixture();
			this.remove = new delete_mixture();
			this.list= new mixture_list_view();
		},
		
		render: function(){
			this.$el.html(this.view_template(this.model.attributes));
			this.add.setElement("#add_mixture_button");
			this.edit.setElement("#edit_mixture_button");
			this.remove.setElement("#delete_mixture_button");
			this.list.setElement("#Mixture_list").render();
			return this;
		}
	});

	var MyPanel_view= new Mixture_PanelView({model:DefaultMixture});
	
	var Compostion_of_mixture= Backbone.View.extend({ //on click on "Compose mixture" button
		el: "#radio-choice-h-2b",
		events:{
		"click":"Clicked"
		},
		initialize: function(){
		
		},
		Clicked: function(){
						MyPanel_view.render();
						}
	});
	
	var Composition_mixture_Clicked_view_instance= new Compostion_of_mixture();	

