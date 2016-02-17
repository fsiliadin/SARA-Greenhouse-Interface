/*!
 * SARA interface
 *
 * Copyright(c) 2016 Fanyo Siliadin
 * Released under the MIT license
 */ 
  
  var illumination;
  window.onload= function(){ 
	var GAP= 10;
	
/* Declaration of Models and Collections*/	
	var Measure = Backbone.Model.extend({ //Model representing a measure of temperature or humidity, this model has only 4 instances: temperature and humidity of the air, and temperature and humidity of the ground 
			defaults: {
				id:"",
				variable:"",
				unit: "",
				value:""
			}, 
			validate: function(attributes){
				if(attributes.value===""){
					return "error in the received data";
					}
			},
			initialize: function(){
				this.on("invalid", function(model, error){
					alert(error);
				})
			}
		});
	var Measure_collection= Backbone.Collection.extend({
		model: Measure,
		//url:// the place to find the Measure collection in database. Depends on your Rest API implementation
		
		initialize: function(){
			this.on("change:value", function (model){
		
			switch(model.get("variable")){
				case "Air_temperature": raw_data_view1.render();break;
				case "Ground_temperature": raw_data_view2.render();break;
				case "Air_humidity": raw_data_view3.render();break;
				case "Ground_humidity": raw_data_view4.render();break;
				default:break;
				}
			})
		}
	});
	var luminosity = Backbone.Model.extend({	// represents the composition of the lighting
		 defaults: {  
			red:0, 			//proportion of red
			infrared:0,		//proportion of infrared
			white:0,		//proportion of white
			blue:0			//proportion of blue
		 },
		 initialize: function(){
		 this.on("change:value", function(){
			raw_data_view5.render();
		 });
		 
		 this.on("change:red", function(){
			this.set({value:type_luminosite()});
			raw_data_view5.render();
		 });
		 this.on("change:infrared", function(){
			this.set({value:type_luminosite()});
			raw_data_view5.render();
		 });
		 this.on("change:white", function(){
			this.set({value:type_luminosite()});
			raw_data_view5.render();
		 });
		 this.on("change:blue", function(){
			this.set({value:type_luminosite()});
			raw_data_view5.render();
		 });
		 
		 }
	 });	
	 
	//here are the declarations of the four measured variables
	var air_temperature= new Measure({unit:"°C", variable:"Air_temperature", id:1});
	var ground_temperature= new Measure({unit:"°C", variable:"Ground_temperature", id:2});
	var air_humidity= new Measure({unit:"%", variable:"Air_humidity", id:3});
	var ground_humidity= new Measure({unit:"%", variable:"Ground_humidity", id:4});
	//they belong to the collection "measure_data"
	var measure_data= new Measure_collection([air_temperature, ground_temperature, air_humidity, ground_humidity]);
	
	//here are the declarations of the reference values that the bioreactor should meet
	var order_T_air= new Measure({unit:"°C", variable:"Air_temperature", id:1});
	var order_T_ground= new Measure({unit:"°C", variable:"Ground_temperature", id:2});
	var order_H_air= new Measure({unit:"%", variable:"Air_humidity", id:3});
	var order_H_ground= new Measure({unit:"%", variable:"Air_humidity", id:4});
	//they belong to the collection "reference_data"
	var reference_data= new Measure_collection([order_T_air, order_T_ground, order_H_air, order_H_ground]);
	
	illumination= new luminosity(); //declaration of luminosity instance
	
/* End of declaration of Models and Collections*/	


var i=1;
	var update_data= function(){ //updates the measures
		
		/* the idea here is to update all the variable fetching their value in database
		   you can do it several way, by using Backbone collection API to sync, or fetching 
		   every variable one by one. Since it depends on how you have implemented your back end APIs
		   I have been agnostic here and have just simulated some values. Of course your have to replace
		   the simulated values with the real values using GET requests */
		   
		/* simulated values*/
		
		valueTair= Math.round(20* Math.cos(360*1/40+i/100)*100)/100;       
		valueTair_reference= Math.round(20* Math.sin(360*1/20+i/100)*100)/100;
		valueTground= Math.round(5* Math.cos(360*1/120+i/100)*100)/100;
		valueTground_reference= Math.round(5* Math.sin(360*1/100+i/100)*100)/100;
		valueHair= Math.round(100* Math.cos(360*1/40+i/100)*Math.cos(360*1/40+i/100)*100)/100;
		valueHair_reference= Math.round(100* Math.cos(360*1/10+i/100)*Math.cos(360*1/10+i/100)*100)/100;
		valueHground= Math.round(100* Math.cos(360*3+i/100)*Math.cos(360*3+i/100)*100)/100;
		valueHground_reference= Math.round(90* Math.cos(360*3+i/100)*Math.cos(360*3+i/100)*100)/100;
		value_blue= Math.round(100*Math.sin(Math.log(2*i))*Math.sin(Math.log(2*i))*100)/100;
		value_white= Math.round(100*Math.cos(Math.log(i))*Math.cos(Math.log(i))*100)/100;
		value_infrared= Math.round(value_white*value_blue)/100;
		value_red= Math.round(Math.cos(360+i/100)*Math.cos(360+i/100)*100);
		
		
		/* end of simulated values */
		
		air_temperature.set({value:valueTair});
		order_T_air.set({value:valueTair_reference});
		ground_temperature.set({value:valueTground});
		order_T_ground.set({value:valueTground_reference});
		air_humidity.set({value:valueHair});
		order_H_air.set({value:valueHair_reference});
		ground_humidity.set({value:valueHground});
		order_H_ground.set({value:valueHground_reference});
		illumination.set({red:value_red, infrared:value_infrared, blue:value_blue, white:value_white});
		i++;
	};
	setInterval(function(){update_data()}, 250); //updates the measures every 250 ms
	
	
/* charts */
		var measureTair = [];
		var referenceTair = [];
		var measureTground = [];
		var referenceTground =[];
		var measureHair = [];
		var referenceHair= [];
		var measureHground =[];
		var referenceHground= [];
		var measureRed=[];
		var measureInfrared=[];
		var measureBlue=[];
		var measureWhite=[];
		
		var chartTair = new CanvasJS.Chart("chartContainer",{  // chart of temperature of the air
			exportEnabled: true,
			exportFileName: "Chart of the temperature of the air",
			zoomEnabled: true,
			toolTip: {
				shared: true
			},
			legend: {
				verticalAlign: "top",
				horizontalAlign: "center",
                fontSize: 14,
				fontWeight: "bold",
				fontFamily: "calibri",
				fontColor: "#00b300"
			},
			axisY:{
				prefix: '°C ',
				 includeZero: true
			}, 
			data: [{ 
				// Measure
				type: "spline",
				xValueType: "dateTime",
				showInLegend: true,
				name: "Measure",
				dataPoints: measureTair,
				color:"#ff9933"
			},
			{				
				// Reference
				type: "spline",
				xValueType: "dateTime",
				showInLegend: true,
				name: "Reference" ,
				dataPoints: referenceTair,
				color:"#00b300"
			}],
          legend:{
            cursor:"pointer",
            itemclick : function(e) {
              if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
              }
              else {
                e.dataSeries.visible = true;
              }
              chartTair.render();
            },
			fontColor: "#d9d9d9"
			
          },
		  backgroundColor: "rgba(0,0,0,0.5)"
		});

		var chartTground = new CanvasJS.Chart("chartContainer2",{ // chart of temperature of the ground
			exportEnabled: true,
			exportFileName: "Chart of the temperature of the ground",
			zoomEnabled: true,
			toolTip: {
				shared: true
			},
			legend: {
				verticalAlign: "top",
				horizontalAlign: "center",
                fontSize: 14,
				fontWeight: "bold",
				fontFamily: "calibri",
				fontColor: "#00b300"
			},
			axisY:{
				prefix: '°C ',
				 includeZero: true
			}, 
			data: [{ 
				// Measure
				type: "spline",
				xValueType: "dateTime",
				showInLegend: true,
				name: "Measure",
				dataPoints: measureTground,
				color:"#e62e00"
			},
			{				
				// Reference
				type: "spline",
				xValueType: "dateTime",
				showInLegend: true,
				name: "Reference" ,
				dataPoints: referenceTground,
				color:"#00b300"
			}],
          legend:{
            cursor:"pointer",
            itemclick : function(e) {
              if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
              }
              else {
                e.dataSeries.visible = true;
              }
              chartTground.render();
            },
			fontColor: "#d9d9d9"
			
          },
		  backgroundColor: "rgba(0,0,0,0.5)"
		});

		var chartHair = new CanvasJS.Chart("chartContainer3",{ // chart of humidity of the air
			exportEnabled: true,
			exportFileName: "Chart of humidity of the air",
			zoomEnabled: true,
			toolTip: {
				shared: true
			},
			legend: {
				verticalAlign: "top",
				horizontalAlign: "center",
                fontSize: 14,
				fontWeight: "bold",
				fontFamily: "calibri",
				fontColor: "#00b300"
			},
			axisY:{
				prefix: '% ',
				 includeZero: true,
				 maximum:100, //percentage
				 minimum:0
			}, 
			data: [{ 
				// Measure
				type: "spline",
				xValueType: "dateTime",
				showInLegend: true,
				name: "Measure",
				dataPoints: measureHair,
				color:"#33bbff"
			},
			{				
				// Reference
				type: "spline",
				xValueType: "dateTime",
				showInLegend: true,
				name: "Reference" ,
				dataPoints: referenceHair,
				color:"#00b300"
			}],
          legend:{
            cursor:"pointer",
            itemclick : function(e) {
              if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
              }
              else {
                e.dataSeries.visible = true;
              }
              chartHair.render();
            },
			fontColor: "#d9d9d9"
			
          },
		  backgroundColor: "rgba(0,0,0,0.5)"
		});

		var chartHground = new CanvasJS.Chart("chartContainer4",{ // chart of humidity of the ground
			exportEnabled: true,
			exportFileName: "Chart of humidity of the ground",
			zoomEnabled: true,
			toolTip: {
				shared: true
			},
			legend: {
				verticalAlign: "top",
				horizontalAlign: "center",
                fontSize: 14,
				fontWeight: "bold",
				fontFamily: "calibri",
				fontColor: "#00b300"
			},
			axisY:{
				prefix: '% ',
				 includeZero: true,
				 maximum: 100, //percentage
				 minimum: 0
			}, 
			data: [{ 
				// Measure
				type: "spline",
				xValueType: "dateTime",
				showInLegend: true,
				name: "Measure",
				dataPoints: measureHground,
				color:"#9933ff "
			},
			{				
				// Reference
				type: "spline",
				xValueType: "dateTime",
				showInLegend: true,
				name: "Reference" ,
				dataPoints: referenceHground,
				color:"#00b300"
			}],
          legend:{
            cursor:"pointer",
            itemclick : function(e) {
              if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
              }
              else {
                e.dataSeries.visible = true;
              }
              chartHground.render();
            },
			fontColor: "#d9d9d9"
			
          },
		  backgroundColor: "rgba(0,0,0,0.5)"
		});
		
		var chartLighting = new CanvasJS.Chart("chartContainer5",{ // chart of luminosity
			exportEnabled: true,
			exportFileName: "Chart of luminosity",
			zoomEnabled: true,
			toolTip: {
				shared: true
			},
			 
			legend: {
				verticalAlign: "top",
				horizontalAlign: "center",
                fontSize: 14,
				fontWeight: "bold",
				fontFamily: "calibri",
				fontColor: "#00b300"
			},
			axisY:{
				prefix: '% ',
				includeZero: true,
				maximum: 100, //percentage
				minimum: 0
			}, 
			data: [{ 
				// Measure red
				type: "spline",
				xValueType: "dateTime",
				showInLegend: true,
				name: "red",
				dataPoints: measureRed,
				color:"#cc0000"
			},
			{				
				// Measure infrared
				type: "spline",
				xValueType: "dateTime",
				showInLegend: true,
				name: "infrared" ,
				dataPoints: measureInfrared,
				color:"#ff6666"
			},
			{				
				// Measure blue
				type: "spline",
				xValueType: "dateTime",
				showInLegend: true,
				name: "blue" ,
				dataPoints: measureBlue,
				color:"#00aaff"
			},
			{				
				// Measure white
				type: "spline",
				xValueType: "dateTime",
				showInLegend: true,
				name: "white" ,
				dataPoints: measureWhite,
				color:"#ffffff"
			}],
          legend:{
            cursor:"pointer",
            itemclick : function(e) {
              if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
              }
              else {
                e.dataSeries.visible = true;
              }
              chartHground.render();
            },
			fontColor: "#d9d9d9"
			
          },
		  backgroundColor: "rgba(0,0,0,0.5)"
		});

		var updateInterval = parseInt($("#display_period").val());
		var time = new Date;
		time.getHours();
		time.getMinutes();
		time.getSeconds();
		time.getMilliseconds();

		var updateChart = function () { //update the charts
			
 				time.setTime(time.getTime()+ updateInterval);
 
 				var valTair = air_temperature.get("value");
 				var refTair = order_T_air.get("value");
 				var valTground = ground_temperature.get("value");
				var refTground = order_T_ground.get("value");
				var valHair = air_humidity.get("value");
				var refHair = order_H_air.get("value");
				var valHground = ground_humidity.get("value");
				var refHground = order_H_ground.get("value");
				var valRed = illumination.get("red");
				var valInfrared = illumination.get("infrared");
				var valBlue = illumination.get("blue");
				var valWhite = illumination.get("white");
				
 				measureTair.push({
 					x: time.getTime(),
 					y: valTair
 				});
 				referenceTair.push({
 					x: time.getTime(),
 					y: refTair
 				});
				measureTground.push({
					x: time.getTime(),
					y: valTground
				});
				referenceTground.push({
					x: time.getTime(),
					y: refTground
				});
				measureHair.push({
 					x: time.getTime(),
 					y: valHair
 				});
 				referenceHair.push({
 					x: time.getTime(),
 					y: refHair
 				});
				measureHground.push({
					x: time.getTime(),
					y: valHground
				});
				referenceHground.push({
					x: time.getTime(),
					y: refHground
				});
				measureRed.push({
					x: time.getTime(),
					y: valRed
				});
				measureInfrared.push({
					x: time.getTime(),
					y: valInfrared
				});
				measureBlue.push({
					x: time.getTime(),
					y: valBlue
				});
				measureWhite.push({
					x: time.getTime(),
					y: valWhite
				});
				
 			// Update the legend
 			chartTair.options.data[0].legendText = " Measure  " + valTair+" °C";
 			chartTair.options.data[1].legendText = " Reference " + refTair+" °C"; 
			chartTground.options.data[0].legendText = " Measure  " + valTground+" °C";
 			chartTground.options.data[1].legendText = " Reference " + refTground+" °C";
			chartHair.options.data[0].legendText = " Measure  " + valHair+" %";
 			chartHair.options.data[1].legendText = " Reference " + refHair+" %";
			chartHground.options.data[0].legendText = " Measure  " + valHground+" %";
 			chartHground.options.data[1].legendText = " Reference " + refHground+" %";
			chartLighting.options.data[0].legendText = " Red "+valRed+" %";
			chartLighting.options.data[1].legendText = " Infra red "+valInfrared+" %";
			chartLighting.options.data[2].legendText = " Blue "+valBlue+" %";
			chartLighting.options.data[3].legendText = " White "+valWhite+" %";
			
			//rendering of all the charts
 			chartTair.render();
			chartTground.render();
			chartHair.render();
			chartHground.render();
			chartLighting.render();
 
 		};
		
		updateChart(updateInterval);
		var delay=setInterval(function(){updateChart()}, updateInterval);
		
		// I hide all the chart and display only those which is selected by the user 
 		document.getElementById("chartContainer").style.display='none';
 		document.getElementById("chartContainer2").style.display='none';
 		document.getElementById("chartContainer3").style.display='none';
 		document.getElementById("chartContainer4").style.display='none';
		document.getElementById("chartContainer5").style.display='none';
		
		
		switch($("#chart_variable").val()){ //this switch will read the value of the select menu (which lists the chart to display) as soon as the page loads as to know which chart to display by default
			case "TempAir":document.getElementById("chartContainer").style.display='block';break;
			case "TempGround":document.getElementById("chartContainer2").style.display='block';break;
			case "HumAir":document.getElementById("chartContainer3").style.display='block';break;
			case "HumGround":document.getElementById("chartContainer4").style.display='block';break;
			case "Light":document.getElementById("chartContainer5").style.display='block';break;
			
		}
		
		
		var display_period_view= Backbone.View.extend({ //this view listens to the select menu with which the user determines the display period of charts
			el: "#display_period",
			events:{
				'change':'Onchange'
			},
			Onchange: function(){
				updateInterval =parseInt($("#display_period").val());  //reads the new period
				clearInterval(delay);									// clears the former period
				delay=setInterval(function(){updateChart()}, updateInterval); // sets the new period
			}
		});
		
		var tempAirChart_template_View= Backbone.View.extend({ //the view which displays the chart of the temperature of the air
			initialize: function(){
			 },
			render: function(){
				document.getElementById("chartContainer").style.display='none';
				document.getElementById("chartContainer2").style.display='none';
				document.getElementById("chartContainer3").style.display='none';
				document.getElementById("chartContainer4").style.display='none';
				document.getElementById("chartContainer5").style.display='none';
				document.getElementById("chartContainer").style.display='block';
			}
		});
		var tempGroundChart_template_View= Backbone.View.extend({ //the view which displays the chart of the temperature of the ground
			initialize: function(){
			 },
			render: function(){
				document.getElementById("chartContainer").style.display='none';
				document.getElementById("chartContainer2").style.display='none';
				document.getElementById("chartContainer3").style.display='none';
				document.getElementById("chartContainer4").style.display='none';
				document.getElementById("chartContainer5").style.display='none';
				document.getElementById("chartContainer2").style.display='block';
			}
		});
		var humAirChart_template_View= Backbone.View.extend({ //the view which displays the chart of the humidity of the air
			initialize: function(){
			 },
			render: function(){				
				document.getElementById("chartContainer").style.display='none';
				document.getElementById("chartContainer2").style.display='none';
				document.getElementById("chartContainer3").style.display='none';
				document.getElementById("chartContainer4").style.display='none';
				document.getElementById("chartContainer5").style.display='none';
				document.getElementById("chartContainer3").style.display='block';
			}
			
		});
		var humGroundChart_template_View= Backbone.View.extend({ //the view which displays the chart of the humidity of the ground
			initialize: function(){
			 },
			render: function(){
				
				document.getElementById("chartContainer").style.display='none';
				document.getElementById("chartContainer2").style.display='none';
				document.getElementById("chartContainer3").style.display='none';
				document.getElementById("chartContainer4").style.display='none';				
				document.getElementById("chartContainer5").style.display='none';				
				document.getElementById("chartContainer4").style.display='block';
			}
		});
		var lightChart_template_View= Backbone.View.extend({ // the view which displays the chart of the lighting
			initialize: function(){
			 },
			render: function(){
				
				document.getElementById("chartContainer").style.display='none';
				document.getElementById("chartContainer2").style.display='none';
				document.getElementById("chartContainer3").style.display='none';
				document.getElementById("chartContainer4").style.display='none';
				document.getElementById("chartContainer5").style.display='none';
				document.getElementById("chartContainer5").style.display='block';
			}
		})
		var chartToRender = Backbone.View.extend({  // the view which listens to the changes on the select menu with which the user selects the chart to render
			el: "#chart_variable",
			events:{
				'change':'Onselect'
			},
			Onselect: function(){
				switch($("#chart_variable").val()){ // according to the choice of the user, this switch renders the proper chart
					
					case "TempAir": this.tempairchart= new tempAirChart_template_View();
									this.tempairchart.render();
									break;
					case "TempGround": this.tempgroundchart= new tempGroundChart_template_View();
									this.tempgroundchart.render();
									break;
					case "HumAir":  this.humairchart= new humAirChart_template_View();
									this.humairchart.render();
									break;
					case "HumGround":  this.humgroundchart= new humGroundChart_template_View();
									this.humgroundchart.render();
									break;
					case "Light": this.lightchart= new lightChart_template_View();
									this.lightchart.render();
									break;
					}
			
			}
		});
	
		var chartToRender_instance= new chartToRender();
		var display_period_instance= new display_period_view();
		
/* end of charts */

/*Information zone views*/	
	
		var temperature_air_View= Backbone.View.extend({

			view_template: _.template($('#temp_air_rendering').html()),
			
			initialize: function(){
				this.$el= $('#Temperature-air');
				this.render();
			},
			render: function(){
				this.$el.html(this.view_template(this.model.attributes));
				return this;
			}
		});

		var temperature_ground_View= Backbone.View.extend({

			view_template: _.template($('#temp_ground_rendering').html()),
			initialize: function(){
				this.$el=$('#Temperature-ground');
				this.render();
			},
			render: function(){
				this.$el.html(this.view_template(this.model.attributes));
				return this;
			}
		});

		var humidity_air_View= Backbone.View.extend({
			
			view_template: _.template($('#hum_air_rendering').html()),
			initialize: function(){
				this.$el=$('#humidity-air');
				this.render();
			},
			render: function(){
				this.$el.html(this.view_template(this.model.attributes));
				return this;
			}
		});

		var humidity_ground_View= Backbone.View.extend({

			view_template: _.template($('#hum_ground_rendering').html()),
			initialize: function(){
				this.$el=$('#Humidity-ground');
				this.render();
			},
			render: function(){
				this.$el.html(this.view_template(this.model.attributes));
				return this;
			}
		});
		
		var lighting_View= Backbone.View.extend({

			view_template: _.template($('#lighting_rendering').html()),
			initialize: function(){
				this.$el= $('#lighting');
				},
			render: function(){
				this.$el.html(this.view_template(this.model.attributes));
				return this;
			}
		});

		// here are instanciated the views to render the data in the information area 
		var raw_data_view1= new temperature_air_View({model:air_temperature});
		var raw_data_view2= new temperature_ground_View({model:ground_temperature});
		var raw_data_view3= new humidity_air_View({model:air_humidity});
		var raw_data_view4= new humidity_ground_View({model:ground_humidity});
		var raw_data_view5= new lighting_View({model:illumination});
	
/* End of information area view*/		 


/* Luminosity is composed of 4 colors, I thought it would be easier to the user to have a summary of the lighting (in the information area) 
   instead of detailing every single value since the purpose of the information area is to give a quick look of the variables. */
   
	// so here are the functions which interpret the lighting and construct a sentence to sum it
   
		var type_luminosite= function(){ // determines the global intensity of the lighting
			var lighting="";
			var red= illumination.get("red");
			var infrared= illumination.get("infrared");
			var white= illumination.get("white");
			var blue= illumination.get("blue");
			
			var intensity= (red+infrared+white+blue)/4;
			if( intensity==0)
			{
				lighting+="gloomy";
				return lighting;
				}
			if( intensity>0 && intensity<=10)
				lighting+="very soft";
			if( intensity>10 && intensity <=35)
				lighting+= "soft";
			if( intensity>35 && intensity <=65)
				lighting+= "medium";
			if( intensity>65 && intensity <=85)
				lighting+= "intense";
			if( intensity>85 && intensity <100)
				lighting+= "very intense";
			if( intensity==100)
				lighting+= "absolute";
			
			var red_proportion= red/(red+infrared+white+blue)*100;
			var infrared_proportion= infrared/(red+infrared+white+blue)*100;
			var white_proportion= white/(red+infrared+white+blue)*100;
			var blue_proportion= blue/(red+infrared+white+blue)*100;
			
			lighting+= dominant_colors(red_proportion,infrared_proportion,white_proportion,blue_proportion);
			luminosity+= " lighting";
			return lighting;
			
		}
		
		var dominant_colors= function(red_proportion,infrared_proportion,white_proportion,blue_proportion) // determines the dominant(s) color(s)
		{
			var max= get_maxValue(red_proportion,infrared_proportion,white_proportion,blue_proportion); 
			if (max== red_proportion)
			{
				if(red_proportion-white_proportion<=GAP && red_proportion-infrared_proportion<=GAP && red_proportion-blue_proportion<=GAP)
					return " balanced colors";
				else if(red_proportion-white_proportion<=GAP && red_proportion-infrared_proportion<=GAP && red_proportion-blue_proportion>GAP)
					return " predominantly red - white - infra red";
				else if(red_proportion-white_proportion<=GAP && red_proportion-infrared_proportion>GAP && red_proportion-blue_proportion<=GAP)
					return " predominantly red - white - blue";
				else if(red_proportion-white_proportion>GAP && red_proportion-infrared_proportion<=GAP && red_proportion-blue_proportion<=GAP)
					return " predominantly red - infra red - blue";
				else if(red_proportion-white_proportion>GAP && red_proportion-infrared_proportion<=GAP && red_proportion-blue_proportion>GAP)
					return " predominantly red - infra red";
				else if(red_proportion-white_proportion>GAP && red_proportion-infrared_proportion>GAP && red_proportion-blue_proportion<=GAP)
					return " predominantly red - blue";
				else if (red_proportion-white_proportion>GAP && red_proportion-infrared_proportion>GAP && red_proportion-blue_proportion>GAP)
					return " predominantly red";
				else if(red_proportion-white_proportion<=GAP && red_proportion-infrared_proportion>GAP && red_proportion-blue_proportion>GAP)
					return " predominantly red - white";
			}
			else if (max== infrared_proportion)
			{
				if(infrared_proportion-red_proportion<=GAP && infrared_proportion-white_proportion<=GAP && infrared_proportion-blue_proportion<=GAP)
					return " balanced colors";
				else if(infrared_proportion-red_proportion<=GAP && infrared_proportion-white_proportion<=GAP && infrared_proportion-blue_proportion>GAP)
					return " predominantly infra red - red - white";
				else if(infrared_proportion-red_proportion<=GAP && infrared_proportion-white_proportion>GAP && infrared_proportion-blue_proportion<=GAP)
					return " predominantly infra red - red - blue";
				else if(infrared_proportion-red_proportion>GAP && infrared_proportion-white_proportion<=GAP && infrared_proportion-blue_proportion<=GAP)
					return " predominantly infra red - white - blue";
				else if(infrared_proportion-red_proportion>GAP && infrared_proportion-white_proportion<=GAP && infrared_proportion-blue_proportion>GAP)
					return " predominantly infra red - white";
				else if(infrared_proportion-red_proportion>GAP && infrared_proportion-white_proportion>GAP && infrared_proportion-blue_proportion<=GAP)
					return " predominantly infra red - blue";
				else if (infrared_proportion-red_proportion>GAP && infrared_proportion-white_proportion>GAP && infrared_proportion-blue_proportion>GAP)
					return " predominantly infra red";
				else if(infrared_proportion-red_proportion<=GAP && infrared_proportion-white_proportion>GAP && infrared_proportion-blue_proportion>GAP)
					return " predominantly infra red - red";
			}
			
			else if (max== white_proportion)
			{
				if(white_proportion-red_proportion<=GAP && white_proportion-infrared_proportion<=GAP && white_proportion-blue_proportion<=GAP)
					return " balanced colors";
				else if(white_proportion-red_proportion<=GAP && white_proportion-infrared_proportion<=GAP && white_proportion-blue_proportion>GAP)
					return " predominantly white - red - infra red";
				else if(white_proportion-red_proportion<=GAP && white_proportion-infrared_proportion>GAP && white_proportion-blue_proportion<=GAP)
					return " predominantly white - red - blue";
				else if(white_proportion-red_proportion>GAP && white_proportion-infrared_proportion<=GAP && white_proportion-blue_proportion<=GAP)
					return " predominantly white - infra red - blue";
				else if(white_proportion-red_proportion>GAP && white_proportion-infrared_proportion<=GAP && white_proportion-blue_proportion>GAP)
					return " predominantly white - infra red";
				else if(white_proportion-red_proportion>GAP && white_proportion-infrared_proportion>GAP && white_proportion-blue_proportion<=GAP)
					return " predominantly white - blue";
				else if (white_proportion-red_proportion>GAP && white_proportion-infrared_proportion>GAP && white_proportion-blue_proportion>GAP)
					return " predominantly white";
				else if(white_proportion-red_proportion<=GAP && white_proportion-infrared_proportion>GAP && white_proportion-blue_proportion>GAP)
					return " predominantly white - red";
			}
			
			else if (max= blue_proportion)
			{
				if(blue_proportion-red_proportion<=GAP && blue_proportion-infrared_proportion<=GAP && blue_proportion-white_proportion<=GAP)
					return " balanced colors";
				else if(blue_proportion-red_proportion<=GAP && blue_proportion-infrared_proportion<=GAP && blue_proportion-white_proportion>GAP)
					return " predominantly blue - red - infra red";
				else if(blue_proportion-red_proportion<=GAP && blue_proportion-infrared_proportion>GAP && blue_proportion-white_proportion<=GAP)
					return " predominantly blue - red - white";
				else if(blue_proportion-red_proportion>GAP && blue_proportion-infrared_proportion<=GAP && blue_proportion-white_proportion<=GAP)
					return " predominantly blue - infra red - white";
				else if(blue_proportion-red_proportion>GAP && blue_proportion-infrared_proportion<=GAP && blue_proportion-white_proportion>GAP)
					return " predominantly blue - infra red";
				else if(blue_proportion-red_proportion>GAP && blue_proportion-infrared_proportion>GAP && blue_proportion-white_proportion<=GAP)
					return " predominantly blue - white";
				else if (blue_proportion-red_proportion>GAP && blue_proportion-infrared_proportion>GAP && blue_proportion-white_proportion>GAP)
					return " predominantly blue";
				else if(blue_proportion-red_proportion<=GAP && blue_proportion-infrared_proportion>GAP && blue_proportion-white_proportion>GAP)
					return " predominantly blue - red";
				
			}
		}
		
		var get_maxValue= function(red_proportion,infrared_proportion,white_proportion,blue_proportion) //determines the most dominant color
		{
			if (red_proportion>=infrared_proportion&&red_proportion>=white_proportion &&red_proportion>=blue_proportion)
				return red_proportion;
			else if (infrared_proportion>=red_proportion&&infrared_proportion>=white_proportion &&infrared_proportion>=blue_proportion)
				return infrared_proportion;
			else if (white_proportion>=red_proportion&&white_proportion>=infrared_proportion &&white_proportion>=blue_proportion)
				return white_proportion;
			else if (blue_proportion>=red_proportion&&blue_proportion>=white_proportion &&blue_proportion>=infrared_proportion)
				return blue_proportion;	
			
		}
  }