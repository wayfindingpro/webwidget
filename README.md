# webwidget
###Wayfinding Pro Web Widget Source### 
####[View Demo](http://maps.wayfindingpro.com/?key=hJDHjDB2)####

This widget is a jumpstart for a web based system using the Wayfinding Pro API.  

A subscription to [Wayfinding Pro](http://www.wayfindingpro.com) is required.  A free trial is available.
Once you have a project set up in Wayfinding Pro, a Project Key will be assigned.  This key will be used to load your project into the widget.

Currently, this is setup to accept a GET variable named "key" with your project id as the value. 

The widget utilizes the following libraries (all of which are included):  
> From [CreateJS](http://createjs.com/Home):  
>  > [EaselJS](http://createjs.com/easeljs)  
>  > [PreloadJS](http://createjs.com/preloadjs)  
>
> [Jquery Mobile] (http://jquerymobile.com)  
> [Jquery] (http://jquery.com)  
> [IScroll] (http://iscrolljs.com)  

The following files contain the code to connect to the API:

> **wfpLibrary.js** - This contains all of the API calls.  An object named "wfp" is defined.  When using in your own application, create a new 'wfp' object using your project id.  The assigned object is used to make additional function calls. (see line 46 of wfpFunctions.js for the creation of the wfp object, and line 410 to see how the getMapImageUrls is called).
   
> **helperFunctions.js** - This contains functions that are not specific to wayfinding.  They include URL encoding, getting variables from the URL String, a function to check if an object is empty and distance between points.
   
> **wfpFunctions.js** -  This is the meat of the project.  It defines all necessary variables, makes the API calls, draws the maps, lines, etc.  

For more information regarding the Wayfinding Pro API, visit http://www.wayfindingpro.com/sdk/using-apis/
