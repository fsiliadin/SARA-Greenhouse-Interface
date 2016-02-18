# SARA-Greenhouse-Interface

SARA Greenhouse Interface (SGI) is a Backbone/Jquery_mobile application firstly designed for a specific bioreactor named SARA (Serre Autonome à Rendement Accru)
SGI's purpose is to offer a simple, reliable and user friendly interface to manage connected greenhouses. With SGI you can have the variables of your 
greenhouse (temperature (air & ground), humidity (air & ground), lighting) displayed in charts (and export charts as png or jpg), you can concoct nutritive mixtures made of water, 
nitrogen, phosphore and potassium. You can also influence your connected greenhouse by spraying mixtures, heating or refreshing it and by changing its lighting.
As SARA follows growth profile for each type of plant, SGI also offers a profile management solution. Even though SGI is designed for SARA, it is 
very generic and simple to adapt to any connected greenhouse since the modules are independants and communication relies on HTTP/JSON APIs. As I am starting 
with backbone and jquery the code sources are very simple so you can easily add or modify features to stick to your needs.


Features

	Profile management: (to open the profile managment panel, click on the logo)
						A profile is a csv file whose rows are tasks. See an example of profile: "Tomato during day of summer.csv" 
						Each task is an instruction of lighting, irrigation, temperature and humidity of the ground and of the air
						in order to simulate a climatic and nutritional environment.
						Of course you can customize your profile, see profile_management_utils.js and profile_pluging.js
	
	Measures:
						concerns everything about the display of the greenhouse's variables. The measures are sum in an information area
						they are displayed in charts, and you can export the charts as jpg or png
						see Measures.js
						
	Mixtures:
						Create your mixtures made of water, nitrogen, phosphore and potassium, it could be something else. See Mixtures.js
						
	direct actions: 
						Spray, enlight, heat or ventilate from distance. See direct_actions.js
