/*!
* wfpLibrary v0.1
* Wayfinding Pro Library
* http://www.wayfindingpro.com/sdk
* Copyright 2015 Rivendell Technologies, LLC
*
*/

//AJAX Variables
var hasOwnProperty = Object.prototype.hasOwnProperty;
//var domain = "wayfindingpro.net/api/";
var domain = "api.wayfindingpro.com/";
var wfp = function(projectId)
{
	this.webServiceURL = "//"+domain+"WebsiteApi.asmx";
	this.baseUrl = "http://"+domain;
	this.ProjectUniqueId = projectId;
	this.isAccessible = false;
	$.ajaxSetup(
	{
		url: this.webServiceURL,
		type: "POST",
		dataType: "text",
		processData: false,
		contentType: "application/soap+xml; charset=utf-8",
		crossDomain:true
	});

	this.createPostData = function(fName, dataArr)
	{
		var accStr = '';
		if (this.isAccessible)
		{
			accStr = '<LimitToAccessibleRoutes>True</LimitToAccessibleRoutes>';
		} else {
			accStr = '<LimitToAccessibleRoutes>False</LimitToAccessibleRoutes>';
		}
		if (fName != 'GetPath')
		{
			accStr = '';
		}
		var startString = "<?xml version=\"1.0\" encoding=\"utf-8\"?><soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">";
		startString += "<soap12:Header><AuthHeader xmlns=\"http://api.wayfindingpro.com\"></AuthHeader></soap12:Header>";
		startString += "<soap12:Body>";
		var endString = "</" + fName + "></soap12:Body></soap12:Envelope>";
		var functionString = "<" + fName + " xmlns=\"http://api.wayfindingpro.com\">";
		var bodyString = "";
		for (var n in dataArr)
		{
			bodyString += "<" + n + ">" + $.trim(dataArr[n]) + "</" + n + ">";
		}
		return $.parseXML(startString + functionString + bodyString + endString);
	}
	this.getPath = function(startPoint,endPoint, callback)
	{
		console.log("getPath");
		if (is_empty(endPoint) && is_empty(startPoint))
		{
			callback({success:false,sp:startPoint,ep:endPoint});
			return;
		}
		if (is_empty(endPoint) && !is_empty(startPoint))
		{
			
			callback({success:false,sp:startPoint,ep:endPoint});
			return;
		}
		if (!is_empty(endPoint) && is_empty(startPoint))
		{
			startPoint = endPoint;
			callback({success:false,sp:startPoint,ep:endPoint});
			return;
		}
		startFloor = startPoint.FloorNumber;
		endFloor = endPoint.FloorNumber
		$.ajax(
			{
				headers:
				{
					SOAPAction: "http://api.wayfindingpro.com/GetPath"
				},
				data: this.createPostData("GetPath",
					{
						ProjectUniqueId: this.ProjectUniqueId,
						BuildingIdNum: startPoint.BuildingIdNum,
						StartFloor: startFloor,
						StartLocation: startPoint.x + "," + startPoint.y,
						EndFloor: endFloor,
						EndLocation: endPoint.x + "," + endPoint.y,
						DoReturnOffsetNodes: false
					}),
				success: callback,
				error: function(data, xhr, error)
				{
					try{
						var xmlDoc = $.parseXML(data.responseText);
						var $xml = $(xmlDoc);
						var apiErrMsg = $xml.find("Text").text();
						apiErrMsg = apiErrMsg.replace('System.Web.Services.Protocols.SoapException: Server was unable to process request. ---> System.Exception: GetPath.ERROR:  ','');
						apiErrMsg = apiErrMsg.substr(0,apiErrMsg.indexOf('at WfpAPI')).trim()
						if(data.responseText.indexOf("Path Not Found") >= 0)
							apiErrMsg = "Path Not Found!";
						if(apiErrMsg.length == 0)
							apiErrMsg = data.responseText;

						callback({success:apiErrMsg,sp:startPoint,ep:endPoint});
					}
					catch(err){
						callback({success:data.responseText,sp:startPoint,ep:endPoint});
					}
				}
			});
	};
	this.getMapImageUrls = function(callback)
	{
		$.ajax(
			{
				headers:
				{
					SOAPAction: "http://api.wayfindingpro.com/GetMapImageUrls"
				},
				data: this.createPostData("GetMapImageUrls",
					{
						ProjectUniqueId: this.ProjectUniqueId
					}),
				success: callback,
				error: function(data, xhr, error)
				{
				}
			});
	};
	this.getDestinations = function(callback)
	{
		$.ajax(
			{
				headers:
				{
					SOAPAction: "http://api.wayfindingpro.com/GetDestinations"
				},
				data: this.createPostData("GetDestinations",
					{
						ProjectUniqueId: this.ProjectUniqueId
					}),
				success: callback,
				error: function(data, xhr, error)
				{
					console.log("error");
				},

			});
	};
	

}

var settings = function() {
	var lineColor;
	var lineOutline;
	var flagBackground;
	var flagStroke;
	}