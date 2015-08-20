/*!
* Wayfinding Pro Widget Functions
* http://www.wayfindingpro.com/sdk
* Copyright 2015 Rivendell Technologies, LLC
*
*/

function btnIOSClick(){
	if($('#scroller').css('background-color') == 'rgb(255, 255, 0)'){
		$('#scroller').css('background-color','rgba(0, 0, 0, 0)');
	}
	else{
		$('#scroller').css('background-color','rgb(255, 255, 0)');
	}
	
	if($('#mapHolder').css('background-color') == 'rgb(0, 0, 255)'){
		$('#mapHolder').css('background-color','rgba(0, 0, 0, 0)');
	}
	else{
		$('#mapHolder').css('background-color','rgb(0, 0, 255)');
	}
	
	var fakePoint = {BuildingID:"0",Category:"",Description:"",FloorNumber:"0",IsAltDestName:"False",IsKiosk:"True",ParentType:"floor",isWayPoint:"True",name:"Kiosk",visible:"true",x:"0",y:"0"};
	centerOnPoint(fakePoint);
	
}

var currentLanguage = getUrlVars('lang').length > 0 ? getUrlVars("lang") :"en";
var currentDictionary;
var projectId = getUrlVars('key').length > 0 ? getUrlVars("key") :"";
var ShowOnlyRelevantFloors = getUrlVars('rf').length > 0 ? getUrlVars("rf") :true;
if(ShowOnlyRelevantFloors == 0 || ShowOnlyRelevantFloors == 'no')
	ShowOnlyRelevantFloors = false;
else
	ShowOnlyRelevantFloors = true;
var DefaultStartLoc = getUrlVars('dsp').length > 0 ? getUrlVars("dsp") :null;
DefaultStartLoc=urldecode(DefaultStartLoc);
var DefaultEndLoc = getUrlVars('dep').length > 0 ? getUrlVars("dep") :null;
DefaultEndLoc=urldecode(DefaultEndLoc);
var DefaultFloor = getUrlVars('df').length > 0 ? getUrlVars("df") :null;
var ThemeColor = getUrlVars('tc').length > 0 ? getUrlVars("tc") :'#006335';
if(gotNum(ThemeColor)){
	if(ThemeColor.length > 6){ThemeColor = ThemeColor.substr(2,6);}
	if(ThemeColor.indexOf('#') != 0){ ThemeColor = '#'+ThemeColor; }
}
var h2t = new wfp(projectId);
var baseUrl = "//api.wayfindingpro.com";
/* Style Variables */
var pnts = new Array();
var pathWidth = 10;
var strokeWidth = 2;
var lastDist = 0;
var flagTextPad = 25;
var flagTextRad = 15;
var sBoxHPos = "center";
var sBoxVPos = "top";
var eBoxHPos = "center";
var eBoxVPos = "top";
var strokeColor = "#000";
var strokeCap = 1;
var strokeJoin = 2;
var textColor = "#000";
var pathColor = "#ee3f37";
var pathStroke = "black"
var flagFill = "rgba(255,255,255,.75)"
var fontStyle = 'bold 32px sans-serif';
/* End Style Variables */
var pathLoaded = false;
var initStartUiPanel = 0;
var initEndUiPanel = 0;
var FilledDestLists = [];
var destLinkPrevClickTap_TimeStamp;
var destinationList = [];
var physicianList = [];
var itemsList = [];
var categoryList = [];
var sortedDestList;
var parentDestinations = [];
var mapList = [];
var floorNames = [];
var floorsToShow = [];
var e = getUrlVars('e').length > 0 ? $.base64_decode(getUrlVars("e")).split(';') : [];
var s = getUrlVars('s').length > 0 ? $.base64_decode(getUrlVars("s")).split(';') : [];
var startPoint = "";
var endPoint = "";
var pathLoaded = false;
var sGroup;
var eGroup;
var currentStageHeight = 0;
var currentStageWidth = 0;
var stage;
var mapContainer;
var mapLayer;
var myScroll;
var DirectoryScroll;
var deptScroll;
var otherScroll;
var DirectionsScroll;
var pathLayer;
var scale = 1;
var doloadpath = false;
/* Mouse/Touch Info */
var mdPos;
/* Marker images */
var yah = new Image();
var goh = new Image();
var ele = new Image();
yah.src = "./images/MapMarker_Ball_Green.png";
goh.src = "./images/MapMarker_Ball_Red.png";
ele.src = "./images/elevators.gif"

var curFloor = null;
var curPathFloorIdx = 0;
var curPathFloors = [];

var visibleMaps = [];
var miMaps = [];
function FindVisibleMaps(){
	visibleMaps = [];

	var trueScrollerYOffset = Math.abs(myScroll.y) / myScroll.scale;
	var trueScrollerXOffset = Math.abs(myScroll.x) / myScroll.scale;
	var scrollVisAreaHeight = $('#scroller').height();
	var scrollVisAreaWidth = $('#scroller').width();
	
	var ScrollRect = {
	  left:   trueScrollerXOffset,
	  top:    trueScrollerYOffset,
	  right:  trueScrollerXOffset + scrollVisAreaWidth,
	  bottom: trueScrollerYOffset + scrollVisAreaHeight
	};
	
	for(var i=0;i<pathLayer.children.length;i++){
		var mi = pathLayer.getChildAt(i);
		if(mi){
			if(mi.name.indexOf('fl') == 0){
				var mapRect = {
				  left:   mi.x,
				  top:    mi.y,
				  right:  mi.x + mi.width,
				  bottom: mi.y + mi.height
				};
				var rectsIntersect = intersectRect(mapRect, ScrollRect);
				if(rectsIntersect)
					visibleMaps.push(mi);
			}
		}
	}
}

function GetMostVisibleMap(){
	var trueScrollerYOffset = Math.abs(myScroll.y) / myScroll.scale;
	var shortestDist = Number.MAX_VALUE;
	var MostVisibleMap = null;
	for(var i=0;i<visibleMaps.length;i++){
		var dist = Math.abs(trueScrollerYOffset - visibleMaps[i].y);
		if(dist < shortestDist){
			shortestDist = dist;
			MostVisibleMap = visibleMaps[i];
		}
	}
	return MostVisibleMap;
}

function intersectRect(r1, r2) {
  return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}

function FinalNextPrevBtnToggleCheck(){
	if(curPathFloorIdx == 0){
		$('#btnPrevStep')[0].disabled=true;
		$('#btnPrevStep').css('opacity',0.4);
		$('#btnNextStep')[0].disabled=false;
		$('#btnNextStep').css('opacity',1);
		centerOnPoint(startPoint,true);
	}
	if(curPathFloorIdx == curPathFloors.length-1){
		$('#btnNextStep')[0].disabled=true;
		$('#btnNextStep').css('opacity',0.4);
		$('#btnPrevStep')[0].disabled=false;
		$('#btnPrevStep').css('opacity',1);
		centerOnPoint(endPoint,true);
	}
	FindVisibleMaps();
}

function showNextFloor(prevIdx,nextIdx){
	if(prevIdx == nextIdx)
		curPathFloorIdx = nextIdx + 1 >= curPathFloors.length ? nextIdx : nextIdx + 1;
	else
		curPathFloorIdx = nextIdx;
	ShowFloor(curPathFloors[curPathFloorIdx]);
}

function showPreviousFloor(prevIdx,nextIdx){
	if(prevIdx == nextIdx)
		curPathFloorIdx = nextIdx - 1 < 0 ? nextIdx : nextIdx - 1;
	else
		curPathFloorIdx = nextIdx;
	ShowFloor(curPathFloors[curPathFloorIdx]);
}

/* Event Handlers */
$(document).ready(function()
	{
		$('#btnIOS').off("click").on("click",function() {
			btnIOSClick();
		});
		
		$("#btnPrevStep").off("vclick").on("vclick",function() {
			if($('#btnPrevStep')[0].disabled)
				return;
			var prevIdx = curPathFloorIdx;
			var nextIdx = curPathFloorIdx;
			myScroll.zoom(InitialAndMinScales[0] < 1 ? InitialAndMinScales[0] : 1);
			var mostVisibleMap = GetMostVisibleMap();
			if(!mostVisibleMap){
				FindVisibleMaps();
				mostVisibleMap = GetMostVisibleMap();
			}
			var mvpFN = mostVisibleMap.name.replace('fl','');
			if(curPathFloors.indexOf(mvpFN) < 0){
				if((curPathFloors[0] < curPathFloors[curPathFloors.length-1] && mvpFN < curPathFloors[0]) || (curPathFloors[0] > curPathFloors[curPathFloors.length-1] && mvpFN > curPathFloors[0]))
					nextIdx = 0;
				else if((curPathFloors[curPathFloors.length-1] < curPathFloors[0] && mvpFN < curPathFloors[curPathFloors.length-1]) || (curPathFloors[curPathFloors.length-1] > curPathFloors[0] && mvpFN > curPathFloors[curPathFloors.length-1]))
					nextIdx = curPathFloors.length-1;
				showPreviousFloor(prevIdx,nextIdx)

				if(curPathFloorIdx != 0){
					$('#btnNextStep')[0].disabled=false;
					$('#btnNextStep').css('opacity',1);
				}
				if(curPathFloorIdx == 0){
					$('#btnPrevStep')[0].disabled=true;
					$('#btnPrevStep').css('opacity',0.4);
				}
				FinalNextPrevBtnToggleCheck();
				return;
			}
			else{
				var cf = curPathFloors[curPathFloorIdx];
				if(cf != mvpFN){
					for(var i=0;i<curPathFloors.length;i++){
						if(curPathFloors[i] == mvpFN){
							nextIdx = i;
							break;
						}
					}
				}
			}
			nextIdx -= 1;
			if(nextIdx < 0)
				nextIdx = 0;
			showPreviousFloor(prevIdx,nextIdx)
			
			if(curPathFloorIdx != 0){
				$('#btnNextStep')[0].disabled=false;
				$('#btnNextStep').css('opacity',1);
			}
			if(curPathFloorIdx == 0){
				$('#btnPrevStep')[0].disabled=true;
				$('#btnPrevStep').css('opacity',0.4);
			}
			FinalNextPrevBtnToggleCheck();
		});
		$("#btnNextStep").off("vclick").on("vclick",function() {
			if($('#btnNextStep')[0].disabled)
				return;
			var prevIdx = curPathFloorIdx;
			var nextIdx = curPathFloorIdx;
			myScroll.zoom(InitialAndMinScales[0] < 1 ? InitialAndMinScales[0] : 1);
			var mostVisibleMap = GetMostVisibleMap();
			if(!mostVisibleMap){
				FindVisibleMaps();
				mostVisibleMap = GetMostVisibleMap();
			}
			var mvpFN = mostVisibleMap.name.replace('fl','');
			if(curPathFloors.indexOf(mvpFN) < 0){
				if((curPathFloors[0] < curPathFloors[curPathFloors.length-1] && mvpFN < curPathFloors[0]) || (curPathFloors[0] > curPathFloors[curPathFloors.length-1] && mvpFN > curPathFloors[0]))
					nextIdx = 0;
				else if((curPathFloors[curPathFloors.length-1] < curPathFloors[0] && mvpFN < curPathFloors[curPathFloors.length-1]) || (curPathFloors[curPathFloors.length-1] > curPathFloors[0] && mvpFN > curPathFloors[curPathFloors.length-1]))
					nextIdx = curPathFloors.length-1;
				showNextFloor(prevIdx,nextIdx)
				if(curPathFloorIdx != curPathFloors.length-1){
					$('#btnPrevStep')[0].disabled=false;
					$('#btnPrevStep').css('opacity',1);
				}
				if(curPathFloorIdx == curPathFloors.length-1){
					$('#btnNextStep')[0].disabled=true;
					$('#btnNextStep').css('opacity',0.4);
				}
				FinalNextPrevBtnToggleCheck();
				return;
			}
			else{
				var cf = curPathFloors[curPathFloorIdx];
				if(cf != mvpFN){
					for(var i=0;i<curPathFloors.length;i++){
						if(curPathFloors[i] == mvpFN){
							nextIdx = i;
							break;
						}
					}
				}
			}
			nextIdx += 1;
			if(nextIdx >= curPathFloors.length)
				nextIdx = curPathFloors.length-1;
			showNextFloor(prevIdx,nextIdx)
			
			if(curPathFloorIdx != curPathFloors.length-1){
				$('#btnPrevStep')[0].disabled=false;
				$('#btnPrevStep').css('opacity',1);
			}
			if(curPathFloorIdx == curPathFloors.length-1){
				$('#btnNextStep')[0].disabled=true;
				$('#btnNextStep').css('opacity',0.4);
			}
			FinalNextPrevBtnToggleCheck();
		});
	
		$( "#main-popup, #floors-popup" ).popup({
			corners: false,
			transition: "slidedown",
			tolerance: 0
			});
		$("#main-menu, #floors-menu").listview();
		$( "#dest-popup" ).popup({
			corners: false,
			transition: "slidedown",
			tolerance: 0,
			afterclose: function() {
				$('#dest-popup .ui-collapsible').collapsible("collapse");
			},
			afteropen: function(evt) {
			}
			});
		$("#clearMap").off("vclick").on("vclick",function() {
			$("main-menu").popup("close");
			$('#Directions').hide();
			$("#scroller").show();
			$("#mnu-dir").hide();
			clearPathData();
			DefaultStartLoc = undefined;
			DefaultEndLoc = undefined;
			setStartAndEnd();
			$('#btnFloorsMenu').show();
			$("#txtbtn").prop("disabled",true);
			$("#txtbtn").html(translatePhrase("Text Directions"));
			$("#Directions").text('');
			
			});
		$("#dest-menu").listview();
		$("#map-start-btn").off("vclick").on("vclick",function() {
			openDestinations(true,this)
			});
		$("#map-end-btn").off("vclick").on("vclick",function() {
			openDestinations(false,this)
			});
		$("#txtbtn").off("vclick").on("vclick",function() {
			  var directsShown = $("#Directions:visible").length == 0 ? false : true;
			  toggleText(this);
			  if(directsShown){
				centerOnPoint(startPoint);
				$('#pathStepBtns').show();
				$('#btnFloorsMenu').show();
			  }
			  else{
				$('#pathStepBtns').hide();
				$('#btnFloorsMenu').hide();
			  }
			});
		$("#dest-popup").css("max-height", $(window).height());
		stage = new createjs.Stage('mapHolder');
		
		
		mapLayer = new createjs.Container().set({
			x:0,
			y:0
			});
		pathLayer =  new createjs.Container().set({
			x:0,
			y:0
			});
		sGroup =  new createjs.Container().set({
			x:0,
			y:0
			});
		eGroup  = new createjs.Container().set({
			x:0,
			y:0
			});
		stage.addChild(mapLayer);
		stage.addChild(pathLayer);
		
		
		if (currentLanguage == "en") {
		$.browserLanguage(function(language,acceptHeader) {
			currentLanguage = language;
			if (currentLanguage != "en") {
				loadDictionary(currentLanguage);
			}
		})
		} else {
			loadDictionary(currentLanguage);
		}
		h2t.getMapImageUrls(setMapImageUrls);
		h2t.getDestinations(setDestinations);
		$("#btnMapIt02").off("vclick").on("vclick",function() {
			if(event.timeStamp == destLinkPrevClickTap_TimeStamp){
				return;
			}
			destLinkPrevClickTap_TimeStamp = event.timeStamp;
				$(':mobile-pagecontainer').pagecontainer("change","#page2");
		});
		var startPage = $(':mobile-pagecontainer').pagecontainer("getActivePage").attr('id');
		if (startPage == "page1") {
			
		} else {
			if (e.length == 0 && s.length == 0) {
				} 
		}
		
		ApplyThemeColor();
	});
$(document).on( 'pagebeforeshow',"#page1", function(event) {
		$("#mnu-map").show();
		$("#mnu-home").hide();
		$("#mnu-clear").hide();
		$("#mnu-start").hide();
		$("#mnu-end").hide();
		$("#mnu-dir").hide();
	});
$(document).on( 'pagebeforeshow',"#page2", function(event) {
	    doNotFill = false;
	    $("#mnu-mapit").hide();       
	    $("#mnu-map").hide();
		$("#mnu-home").show();
		$("#mnu-clear").show();
		$("#mnu-start").show();
		$("#mnu-end").show();
		$("#mnu-dir").hide();
		if (!is_empty(startPoint) || !is_empty(endPoint)) {
			h2t.getPath(startPoint,endPoint,setPath);
		} 
    });
$(document).on('pageshow','#page2', function(event) {
		UpdateMap_iScroll();
		if (is_empty(startPoint) && is_empty(endPoint)) {
			toggleText() ;
			}
	});
	
function openMenu() {
	$("#main-popup").popup("open",{
		x: 0,
		y: 0
		});
	}
function openFloorsMenu(sender) {
	$("#floors-popup").popup("open", {positionTo:sender});
}
function closeMenu() {
	$("#main-popup").popup("close");
	$("#floors-popup").popup("close");
	}
/* Generic Functions */
function findLivePageWidth()
{
	return window.innerWidth != null? window.innerWidth: document.documentElement.clientWidth != null? document.documentElement.clientWidth:null;
}
/* Map images */
var MapsLoaded = false;
function setMapImageUrls(data) {
    var xml = $($.parseXML(data));
    var mapUrls = xml.find('GetMapImageUrlsResult').text();
    mapList = $.parseJSON(mapUrls);
    mapList.sort(function(a, b) {
			return (a.FloorNumber > b.FloorNumber) ? -1 : ((b.FloorNumber > a.FloorNumber) ? 1 : 0);
	});
	LoadMapImages()
}

function QueueCompleted_DrawMap(abc){
	DrawMap();
	MapsLoaded = true;
	if(DestsLoaded){
		setStartAndEnd();
	}
}

function LoadMapImages() {
    isPathDrawn = false;
	mapsShown = false;
    var now = new Date();
    var reloadImgs = true;
	var eNode = '';
	var manifest = [];

    if (reloadImgs) {
		 var imgBaseUrl = baseUrl;
         var queue = new createjs.LoadQueue(false,baseUrl,true);
           queue.on("fileload",AddMap,this)
           queue.on("complete",QueueCompleted_DrawMap);
           queue.on("error",function (e) {
           	alert(e.type+"\n\n"+e.text+"\n\n"+e.item.src);
           	});
        for (var i = 0; i < mapList.length; i++) {
            manifest.push($.parseJSON('{"id":"fl' + mapList[i].FloorNumber + '","src":"' +imgBaseUrl + mapList[i].Url+'","type":"'+createjs.LoadQueue.IMAGE+'","data":"'+i+'"}'));
            floorNames[mapList[i].FloorNumber] = mapList[i].FloorName;
            floorsToShow[mapList[i].FloorNumber] = true;
        }
        
        queue.loadManifest(manifest);
        
    } else {
			if ($(':mobile-pagecontainer').pagecontainer("getActivePage").attr('id') != 'page1') {
	      DrawMap()
			}
    }
	
	$('#floors-menu > li').slice(1,-1).remove();
	for(var i = 0; i < mapList.length; i++){
		$('#floors-menu > li').last().before('<li><a data-floor="'+mapList[i].FloorNumber+'" class="ui-btn floorBtn">'+mapList[i].FloorName+'</a></li>');
	}
	$('.floorBtn').on('vclick',function(ev){
		var fNum = $(this).data('floor');
		ShowFloor(fNum);
		$("#floors-popup").popup("close");
	});
}
function AddMap(event) {
	var bmp = new createjs.Bitmap().set({
		id:event.item.data,
		name:event.item.id + "_img",
		x:0,
		y:currentStageHeight,
		height:event.result.height,
		width:event.result.width,
		image: event.result
	});
	
	var lyr = new createjs.Container().set({
		height: event.result.height,
		width : event.result.width,
		x : bmp.x,
		y : bmp.y,
		name:event.item.id,
		fill:"transparent",
		stroke:"transparent"
	});
	
	mapLayer.addChild(bmp);
	pathLayer.addChild(lyr);
	currentStageHeight += bmp.height;
	currentStageWidth = bmp.width;
	}
function DrawMap() {
	scale = $( window ).width()/currentStageWidth;
	var scaleH = $( window ).height()/currentStageHeight;
	if(scaleH < scale){
		scale = scaleH;
	}
	$("#mapHolder").attr('height',currentStageHeight).attr('width',currentStageWidth);
	mapLayer.height = currentStageHeight;
	mapLayer.width = currentStageWidth;
	pathLayer.height = currentStageHeight;
	pathLayer.width = currentStageWidth;
	
	stage.height = currentStageHeight;
	stage.width = currentStageWidth;
	stage.update();
	UpdateMap_iScroll();
	resetZoom();
	}
function showFloors(floors) {
	if(floors && !ShowOnlyRelevantFloors){
		for(var ii=0;ii<mapList.length;ii++){
			floors['fl'+mapList[ii].FloorNumber] = true;
		}
	}
	var tStageHeight = 0;
	var curY = 0;
	if (Object.size(floors) == 0) {
		for (i=0;i < mapLayer.getNumChildren();i++) {
		var fl = mapLayer.getChildAt(i);
		var pl = pathLayer.getChildAt(i);

		var bounds = fl.getBounds();
			fl.set({visible:true,y:curY});
			pl.set({visible:true,y:curY});
			tStageHeight += bounds.height;
			curY = tStageHeight;
		}
		} else {
	for (i=0;i < mapLayer.getNumChildren();i++) {
		var fl = mapLayer.getChildAt(i);
		var pl = pathLayer.getChildByName(fl.name.replace("_img",""));
		var bounds = fl.getBounds();
		
		if (floors[fl.name.replace("_img","")]) {
			fl.set({visible:true,y:curY});
			pl.set({visible:true,y:curY});
			tStageHeight += bounds.height;
			curY = tStageHeight;
		} else {
			fl.set({visible:false});
			pl.set({visible:false});
			}
		}
		}
	currentStageHeight = tStageHeight;
	DrawMap();
	}
function resetZoom() {
	if (myScroll.minZoom == undefined) {
	var scales = GetInitialAndMinScales();
	scales[0] < 1 ? scales[0] : 1
	myScroll = new IScroll('#scroller', {
			zoom: true,
			zoomMin: scales[0] < 1 ? scales[0] : 1,
			scrollbars:false,
			startZoom:scales[0] < 1 ? scales[0] : 1,
			mouseWheel: true,
			wheelAction: 'zoom',
			scrollX: true,
			scrollY: true,
			freeScroll: true,
			onZoomStart: mapOnZoomStart,
			onZoom: mapOnZoom,
			onZoomEnd: mapOnZoomEnd
		});
		myScroll.on('scrollEnd', MyScroll_ScrollEnd);
		myScroll.on('zoomEnd', MyScroll_ZoomEnd);
	} 
	myScroll.refresh();
	}
function MyScroll_ScrollEnd(){
	FindVisibleMaps();
}
function MyScroll_ZoomEnd(){
	FindVisibleMaps();
}
function UpdateMap_iScroll(){
	$("#scroller").height($(window).height() - $("#p2head").height() - $("#foot-menu").height());
   if (myScroll == null) {
		var scales = GetInitialAndMinScales();
		if  (scales[0] == undefined) return;
		
		if  (scales[0] == Infinity) scales[0] = 1;
		if  (scales[1] == Infinity) scales[1] = 1;
		
		myScroll = new IScroll('#scroller', {
			zoom: true,
			zoomMin: scales[0] < 1 ? scales[0] : 1,
			scrollbars:false,
			startZoom:scales[0] < 1 ? scales[0] : 1,
			mouseWheel: true,
			wheelAction: 'zoom',
			scrollX: true,
			scrollY: true,
			freeScroll: true,
			onZoomStart: mapOnZoomStart,
			onZoom: mapOnZoom,
			onZoomEnd: mapOnZoomEnd
		});
		myScroll.on('scrollEnd', MyScroll_ScrollEnd);
		myScroll.on('zoomEnd', MyScroll_ZoomEnd);
	}
	var maxScrollY = myScroll.maxScrollY;
	myScroll.refresh();
}
var InitialAndMinScales = null;
function GetInitialAndMinScales(){
	var retScale, retMinScale;
	var origHeight =currentStageHeight;
	var origWidth =currentStageWidth;
	
	var AvailableWidth = $.mobile.activePage.width();
	var AvailableHeight = $.mobile.activePage.height();
	var imgW = AvailableWidth / origWidth;
	var imgH = AvailableHeight / origHeight;

	var isImgWider = false;
	var isImgTaller = false;
	var msg = "";
	if(origWidth > AvailableWidth){
		isImgWider = true;
		msg = msg+"Image is *Too* Wide!\n";
	}
	if(origHeight > AvailableHeight){
		isImgTaller = true;
		msg = msg+"Image is *Too* Tall!\n";
	}
	
	/* Force Map to Scale to fit width */
	isImgWider = true;
	
	if(isImgWider && isImgTaller){
		retScale = imgW;
		retMinScale = imgH;
	}
	else if(isImgWider && !isImgTaller){
		retScale = imgW;
		retMinScale = imgH;
	}
	else if(!isImgWider && isImgTaller){
		retScale = imgH;
		retMinScale = imgW;
	}
	else{
		msg = msg+"Image is *Smaller* than the canvas!\n";
		retScale = (imgW > imgH) ? imgW : imgH;
		retMinScale = (imgW < imgH) ? imgW : imgH;
	}
	
	if(retMinScale > retScale){
		if(InitialAndMinScales[0] != Infinity)
			retScale = InitialAndMinScales[0];
		if(InitialAndMinScales[1] != Infinity)
			retMinScale = InitialAndMinScales[1];
	}
	
	InitialAndMinScales = [retScale, retMinScale];
	return [retScale, retMinScale];
}

var ZoomStarted = false;
function mapOnZoomStart(){
	if(ZoomStarted)
		return;
	ZoomStarted = true;

}
function mapOnZoom(){


	if (myScroll.scale * currentStageWidth < myScroll.width) {
		var offset =( myScroll.width - (myScroll.scale * currentStageWidth))/2
		$("#mapHolder").css("margin-left",offset)
	} else {
		$("#mapHolder").css("margin-left",0)
	}
}
function mapOnZoomEnd(){
	ZoomStarted = false;

}

/* Destination Lists */
var DestsLoaded = false;
function setDestinations(data)
{

	data = data.replace(/\\","/g, "\\\\\",\"");
	
	data = data.replace(/" /g, "\\\" ");
	data = data.replace(".0\\\" encoding", ".0\" encoding");
	data = data.replace(/\\\" xmlns/g, "\" xmlns");

	var xml = $($.parseXML(data));
	destinationList = [];
	physicianList = [];
	categoryList = [];
	parentDestinations = [];
	xml.find('string').each(function()
		{
			var thisText = $(this).text();
			try{
				var val = $.parseJSON($(this).text());
				if (val.Category.length == 0) {
					destinationList[val.name]=val;
				} else {
					if (categoryList[val.Category] == undefined) {
						categoryList[val.Category] = [];
					}
					categoryList[val.Category].push(val);
				}
				if (val.IsAltDestName == "False") {
					parentDestinations[val.name.replace('*','')] = val;
				}

			}
			catch(err){
			}
		});
	destinationsLoaded = true;
	PopulateLists();
	if ((!is_empty(startPoint) && !is_empty(endPoint)))
	{
		if ($(':mobile-pagecontainer').pagecontainer("getActivePage").attr('id') != 'page1')
		{
			h2t.getPath(startPoint,endPoint,setPath);
		}
	}
	DestsLoaded = true;
	if(MapsLoaded){
		setStartAndEnd();
	}
	
}
function PopulateLists()
{
	var names = new Array();

	var x = 0;

	var ListItems = '';
	var node = destinationList
	var dcount = 0;
	if(typeof node != "undefined" && node != null)
	{
		for (var l in node)
		{
			if(!node[l].name || node[l].name.trim().length == 0) continue;
			ListItems += '<li title="'+node[l].name+'"><a class="destLink" data-type="destination" data-id="clinic' + dcount + '" data-name="'+node[l].name+'">'+node[l].name+'</a></li>\n\r';
			
			dcount++;
		}

		itemsList["Directory"] = ListItems;
	}
	var node = categoryList;
	var ccount = 0;
	ListItems = '';
	if(typeof node != "undefined" && node != null)
	{
	for (var l in node) {
		if(!node[l][0].name || node[l][0].name.trim().length == 0) continue;
		if (node[l].length == 1) {
			ListItems += '<li title="'+node[l][0].name+'"><a class="destLink" data-type="other" data-id="other' + ccount + '" data-cat="' + l + '" data-catid=0 data-name="'+node[l][0].name.replace('*','')+'">'+node[l][0].name.replace('*','')+'</a></li>\n\r';
			ccount++
		} else {
			ListItems += '<li class="multiDoc" data-role="collapsible" data-iconpos="right" data-corners="false" data-shadow="false" data-inset="true" title="'+l+'" >\n\r';
			ListItems += '<h2 class="subDoc" >' + l +  '</h2>\n\r';
			ListItems += '<ul data-inset="true" data-corners="false" data-shadow="false" data-role="listview">\n\r';
			for (c in node[l]) {
				
				
				ListItems += '<li data-icon="location" data-iconpos="left"><a  class="destLink ui-btn ui-icon-location ui-btn-icon-left" data-type="other" data-id="other' + ccount + '" data-cat="' + l + '" data-catid="' + c + '" data-name="'+node[l][c].name+'">'+node[l][c].name+'</a></li>\n\r';
				}
				ListItems += '</ul>\n\r';
				ListItems += '</li>\n\r';
			ccount++
			}
		
		}
		itemsList["Other"] = ListItems;
	}
	sortedDestList = $("<li data-role='collapsible' data-iconpos='right'>");
	var outerDiv = $('<div>');
	for (n in itemsList)
	{
		
		var tempList = $("<ul>").html(itemsList[n]);
		var tempDiv = $('<div class="' + n + '-coll" data-role="collapsible" data-inset="false">\n\r<h2 class="' +n + '-head" class="col-head">' + urldecode(n ==  "Other"?"Points of Interest":n) + '</h2><div class="' + n + '-scroll" style="overflow:hidden; position:relative;"><ul  data-role="listview" data-theme="a" data-divider-theme="a" data-icon="false" data-inset="false"  data-autodividers="true" data-filter="true"></ul></div></div>\n\r');
		
		$(tempDiv).find('ul').append($(tempList).children('li').sort(function(x, y)
				{
					var xt = $(x).attr('title').charAt(0).toUpperCase() + $(x).attr('title').slice(1) ;
					var yt = $(y).attr('title').charAt(0).toUpperCase() + $(y).attr('title').slice(1)
					return xt < yt ? -1 : 1;
				}));
		$(outerDiv).append(tempDiv);
	}

	sortedDestList = '<div data-role="collapsible-set" data-inset="false" class="nodesAccordian">'+$(outerDiv).html()+'</div>';
	addDestinations();
	$('a[href="#"]').removeAttr('href');
	ApplyThemeColor();
}
function addDestinations(pg) {
	if (sortedDestList) {
		$( "#dest-popup ul" ).after(sortedDestList);
		$('#dest-popup .nodesAccordian').collapsibleset({defaults: true});
		$('#dest-popup .nodesAccordian > div ul').listview();
		$("#dest-menu").listview("refresh");
		$('.multiDoc').off("vclick").on("vclick",function(ev) {
			if ($(this).collapsible("option","collapsed")) {
				$(this).collapsible("expand");
				} else {
				$(this).collapsible("collapse");	
			}
			DirectoryScroll.refresh();
			});
		$('.col-head').off("vclick","a").on("vclick","a",function(ev) {
			if(event.timeStamp == destLinkPrevClickTap_TimeStamp){
				return;
			}
			destLinkPrevClickTap_TimeStamp = event.timeStamp;
			if (DirectoryScroll != undefined) {
				DirectoryScroll.destroy();
			}
			var scrollHeight = $(window).height() - $("#dest-menu").height();
			var scroller = "";
			for (n in itemsList) {
				scrollHeight -= $("." + n + "-head").height();
				if ((n + "-head") == ev.currentTarget.parentNode.id) {
						scroller = n + "-scroll";
						DirectoryScroll = new IScroll('.' + n + '-scroll', {
						zoom: false,
						momentum: true,
						scrollbars:false,
						mouseWheel: true,
						scrollX: false,
						scrollY: true,
						tap: true
							
					});
					setTimeout(function() {
				        DirectoryScroll.refresh();
				     }, 100);
				}
			}
			$("#" + scroller).height(scrollHeight);
			DirectoryScroll.refresh();
		});
	}
	translatePage();
}
function endAsStart() {
	startPoint = endPoint;
		h2t.getPath(startPoint,endPoint,setPath);
	}
function reverseDirections() {
	var temp = startPoint;
	startPoint = endPoint;
	endPoint = temp;
	h2t.getPath(startPoint,endPoint,setPath);
	
	}
function openDestinations(isStart,sender) {
	closeMenu()
	setTimeout(popupDestinations,500,isStart,sender);
	$('a[href="#"]').removeAttr('href');
}
function popupDestinations(isStart,sender) {
	if (isStart) {
		$("#dest-header").text("Select Starting Point");
		$("#dest-popup").off("vclick","a.destLink").on("vclick","a.destLink", function(event) {
			if(event.timeStamp == destLinkPrevClickTap_TimeStamp){
				return;
			}
			destLinkPrevClickTap_TimeStamp = event.timeStamp;
				if ($(this).data("val") == -1) {
					if (startPoint == endPoint) {
						endPoint = "";
						}
					startPoint = "";
					$('#Directions').hide();
					$("#txtbtn").prop("disabled",true);
					$("#txtbtn").html(translatePhrase("Text Directions"));
					$("#Directions").text('');
					setPath({success:false,sp:startPoint,ep:endPoint});
					return;
					}
				doDrawPath = true;
				var pnt = [];
				pnt["id"] = $(this).data("id");
				pnt["name"] = $(this).data("name");
				pnt["point"] = $(this).data("type");
				if ($(this).data("type") == "other") {
					pnt["cat"] = $(this).data("cat");
					pnt["catid"] = $(this).data("catid");
					}
				$("#dest-popup").popup("close");
				setStart(pnt);
		});
		} else {
			$("#dest-header").text("Select Destination");
			$("#dest-popup").off('vclick',"a.destLink").on("vclick","a.destLink", function(event) {
			if(event.timeStamp == destLinkPrevClickTap_TimeStamp){
				return;
			}
			if ($(this).data("val") == -1) {
					if (startPoint == endPoint) {
						startPoint = "";
						}
					endPoint = "";
					$('#Directions').hide();
					$("#txtbtn").prop("disabled",true);
					$("#txtbtn").html(translatePhrase("Text Directions"));
					$("#Directions").text('');
					setPath({success:false,sp:startPoint,ep:endPoint});
					return;
					}
			destLinkPrevClickTap_TimeStamp = event.timeStamp;
				
				doDrawPath = true;
				var pnt = [];
				pnt["id"] = $(this).data("id");
				pnt["name"] = $(this).data("name");
				pnt["point"] = $(this).data("type");
				if ($(this).data("type") == "other") {
					pnt["cat"] = $(this).data("cat");
					pnt["catid"] = $(this).data("catid");
					}
				$("#dest-popup").popup("close");
				setEnd(pnt);
		});
		}
		$("#dest-popup").popup("open",{x: 0,y: 0});
		var scrollHeight=$(window).height();
		if (initStartUiPanel == 0) {
			initStartUiPanel = $("#dest-popup").height();
		}
		scrollHeight -= initStartUiPanel
		for (var n in itemsList)
	{
		$('#dest-popup .' + n + '-scroll').height(scrollHeight);
		switch (n) {
			case "Directory":
			$( "#dest-popup ." + n + "-coll" ).off( "collapsibleexpand").on( "collapsibleexpand", function( event, ui ) {
				DirectoryScroll.refresh();
			} );
		DirectoryScroll = new IScroll('#dest-popup .' + n + '-scroll', {
			zoom: false,
			
			scrollbars:true,
			mouseWheel: true,
			tap: true,
			scrollX: false,
			scrollY: true
		});
		break;
		default:
		$( "#dest-popup ." + n + "-coll" ).off( "collapsibleexpand").on( "collapsibleexpand", function( event, ui ) {
				otherScroll.refresh();
			} );
		otherScroll = new IScroll('#dest-popup .' + n + '-scroll', {
			zoom: false,
			
			scrollbars:true,
			mouseWheel: true,
			tap: true,
			scrollX: false,
			scrollY: true
		});
		
	}
	}
	}
function closeDest() {
	$("#dest-popup").popup("close");
	}
/* Flag Functions */
function clearMap() {
	closeMenu('#popupMenu');
	clearPathData();
	if($("#Directions:visible").length > 0) {
		toggleText();
		}
	$("#Directions").empty();
	$("#spText").text("");
	$("#epText").text("");
	$("#routeInfo").hide();
	showFloors();
	startPoint = "";
	endPoint = "";
	stage.update();
	UpdateMap_iScroll();
	}
function setFlag(se) {
	var flagPoint;
	var boxVPos = "top";
	var boxHPos = "center";
	if (se == "start") {
		flagPoint = startPoint
		sGroup.removeAllChildren()
		} else {
		flagPoint = endPoint
		eGroup.removeAllChildren()
		}
	
	var pointDescription = "";
	var isPntDescAnImg = null;
	try{
		pointDescription = Encoder.htmlDecode(translatePhrase($.base64_decode(flagPoint.Description).trim()));
		isPntDescAnImg = pointDescription.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|tiff)$/);
		if (isPntDescAnImg){
			pointDescription = "";
		}
	}
	catch(pdErr){console.log(pdErr);}
	var yahText = new createjs.Text().set({
            color:textColor,
            font:fontStyle,
            text:Encoder.htmlDecode(flagPoint.name.replace('*','').trim()) + (pointDescription.length > 0 ? '\n' + pointDescription : ''),
            
            x:flagTextPad/2,
            y:flagTextPad/2,
            textAlign:'center'
        });
    var txtSize = yahText.getBounds();
    yahText.set({
    	x:txtSize.width/2 + flagTextPad/2
    	});
    if (parseInt(flagPoint.y) -(txtSize.height+flagTextPad+20) < 0) {
    	boxVPos = "bottom"
    }
    if (parseInt(flagPoint.x) - ((txtSize.width+flagTextPad)/2) < 0) {
    	boxHPos = "left";
    	}
     
    if (((txtSize.width+flagTextPad)/2 + parseInt(flagPoint.x)) > stage.width) {
    	boxHPos="right"
    	}
    if (endPoint != undefined && startPoint != undefined) {
    if (endPoint.FloorNumber == startPoint.FloorNumber && se == "end") {
    	if ((sFlag.width/2 + parseInt(startPoint.x)) > (endPoint.x - ((txtSize.width+flagTextPad)/2))) {
    		
    		boxVPos = "bottom";
    		}
    }
    }
    var boxheight=txtSize.height + flagTextPad;
	var boxwidth=txtSize.width + flagTextPad
	var context = new createjs.Graphics()
		context.setStrokeStyle(strokeWidth,strokeCap,strokeJoin);
		context.s(strokeColor);
		context.beginFill(flagFill)
            	switch (boxVPos) {
            		case "top":
            		switch(boxHPos) {
				 		case "left":
				 			
							context.moveTo(0,flagTextRad)
							context.lineTo(0,boxheight+20);
							context.lineTo(20,boxheight);
							context.lineTo(boxwidth-flagTextRad,boxheight);
							context.quadraticCurveTo(boxwidth,boxheight,boxwidth,boxheight-flagTextRad)
							context.lineTo(boxwidth,flagTextRad);
							context.quadraticCurveTo(boxwidth,0,boxwidth-flagTextRad,0)
							context.lineTo(flagTextRad,0);
							context.quadraticCurveTo(0,0,0,flagTextRad)
							
				 		break;
				 		case "center":
				 			
						   
							context.moveTo(0,flagTextRad)
							context.lineTo(0,boxheight-flagTextRad);
							context.quadraticCurveTo(0,boxheight,flagTextRad,boxheight);
							context.lineTo(boxwidth/2-flagTextRad,boxheight);
							context.lineTo(boxwidth/2,boxheight+20);
							context.lineTo(boxwidth/2+flagTextRad,boxheight);
							context.lineTo(boxwidth-flagTextRad,boxheight);
							context.quadraticCurveTo(boxwidth,boxheight,boxwidth,boxheight-flagTextRad)
							context.lineTo(boxwidth,flagTextRad);
							context.quadraticCurveTo(boxwidth,0,boxwidth-flagTextRad,0)
							context.lineTo(flagTextRad,0);
							context.quadraticCurveTo(0,0,0,flagTextRad)
							
				 		break;
				 		case "right":
				 			
							context.moveTo(0,flagTextRad)
							context.lineTo(0,boxheight-flagTextRad);
							context.quadraticCurveTo(0,boxheight,flagTextRad,boxheight);
							context.lineTo(boxwidth-20,boxheight);
							context.lineTo(boxwidth,boxheight+20);
							context.lineTo(boxwidth,flagTextRad);
							context.quadraticCurveTo(boxwidth,0,boxwidth-flagTextRad,0)
							context.lineTo(flagTextRad,0);
							context.quadraticCurveTo(0,0,0,flagTextRad)
							
				 		break;
				 	}
				
				break;
				 	case "bottom":
				 	boxheight =txtSize.height + flagTextPad+ 20;
				 	switch(boxHPos) {
				 		
				 		case "left":
				 		
							context.moveTo(0,0);
							context.lineTo(0,boxheight-flagTextRad);
							context.quadraticCurveTo(0,boxheight,flagTextRad,boxheight);
							context.lineTo(boxwidth-flagTextRad,boxheight);
							context.quadraticCurveTo(boxwidth,boxheight,boxwidth,boxheight-flagTextRad)
							context.lineTo(boxwidth,flagTextRad+20);
							context.quadraticCurveTo(boxwidth,20,boxwidth-flagTextRad,20)
							context.lineTo(20,20);
							context.lineTo(0,0);
							
				 		break;
				 		case "center":
				 		
							context.moveTo(0,flagTextRad+20)
							context.lineTo(0,boxheight-flagTextRad);
							context.quadraticCurveTo(0,boxheight,flagTextRad,boxheight);
							
							context.lineTo(boxwidth-flagTextRad,boxheight);
							context.quadraticCurveTo(boxwidth,boxheight,boxwidth,boxheight-flagTextRad)
							context.lineTo(boxwidth,flagTextRad+20);
							context.quadraticCurveTo(boxwidth,20,boxwidth-flagTextRad,20)
							context.lineTo(boxwidth/2+10,20);
							context.lineTo(boxwidth/2,0);
							context.lineTo(boxwidth/2-10,20);
							context.lineTo(flagTextRad,20);
							context.quadraticCurveTo(0,20,0,20+flagTextRad)
							
				 		break;
				 		case "right":
				 			
							context.moveTo(0,20+flagTextRad)
							context.lineTo(0,boxheight-flagTextRad);
							context.quadraticCurveTo(0,boxheight,flagTextRad,boxheight);

							context.lineTo(boxwidth-flagTextRad,boxheight);
							context.quadraticCurveTo(boxwidth,boxheight,boxwidth,boxheight-flagTextRad)
							context.lineTo(boxwidth,0);
							context.lineTo(boxwidth-20,20);
							context.lineTo(flagTextRad,20);
							context.quadraticCurveTo(0,20,0,flagTextRad+20)
							
				 		break;
				 	}
				 	}
		context.es().endFill();
		var yahPoly = new createjs.Shape(context).set ({
            x:0,
            y:0
        });
		
    var sX = (txtSize.width + flagTextPad) / 2;
    var sY = txtSize.height+flagTextPad+20
    sFlag = new createjs.Bitmap(yah).set({
            x: sX - ((yah.width*0.25)/2),
            y:sY - ((yah.height*0.25)/2),
            scaleX: 0.25,
            scaleY: 0.25
        });
       eFlag = new createjs.Bitmap(goh).set({
            x: sX - ((yah.width*0.25)/2),
            y:sY - ((yah.height*0.25)/2),
            scaleX: 0.25,
            scaleY: 0.25,
        });
       switch (boxHPos) {
       		case "left":
       			sFlag.set({x:0-((yah.width*.25)/2),y:sFlag.x});
       			
       			break;
       		case "right":
       			sFlag.set({x:boxwidth-((yah.width*.25)/2),y:sFlag.x});
       			break;
       		}
       	switch (boxVPos) {
       		case "top":
       			sFlag.set({x:sFlag.x,y:sY - ((yah.height*0.25)/2)})
       			yahText.set({x:yahText.x,y:flagTextPad/2});
       			break;
       		case "bottom":
       			sFlag.set({x:sFlag.x,y:0 - ((yah.height*0.25)/2)})
       			yahText.set({x:yahText.x,y:20+flagTextPad/2});
       			break;
       		}
        eFlag.set({x:sFlag.x,y:sFlag.y});
        if (se == "start") {
        sGroup.addChild(sFlag);
    	sGroup.addChild(yahPoly);
    	sGroup.addChild(yahText);
    	sBoxHPos = boxHPos;
    	sBoxVPos = boxVPos;
    	sGroup.set({width:txtSize.width+flagTextPad,height:txtSize.height + flagTextPad + 20,x:parseFloat(flagPoint.x) - (txtSize.width+flagTextPad)/2,y:parseFloat(flagPoint.y) -(txtSize.height + flagTextPad + 20)});
    	
    	} else {
    	eGroup.addChild(eFlag);
    	eGroup.addChild(yahPoly);
    	eGroup.addChild(yahText);
    	eBoxHPos = boxHPos;
    	eBoxVPos = boxVPos;	
    	eGroup.set({width:txtSize.width+flagTextPad,height:txtSize.height + flagTextPad + 20 ,x:parseFloat(flagPoint.x) - (txtSize.width+flagTextPad)/2,y:parseFloat(flagPoint.y) - (txtSize.height + flagTextPad + 20)});
    	
    	}
    	
   
}
function positionFlag(se) {
	var boxHPos = "center";
	var boxVPos = "top";
	if (se == "start") {
		boxHPos = sBoxHPos;
		boxVPos = sBoxVPos;
		if (boxHPos == "left") {
               	sGroup.set({x:parseFloat(startPoint.x),y:sGroup.y});
               } else if (boxHPos == "right") {
               	sGroup.set({x:parseFloat(startPoint.x) - sGroup.width,y:sGroup.y});
               	} else {
                sGroup.set({x:parseFloat(startPoint.x) - sGroup.width/2,y:sGroup.y});
               }

               if (boxVPos == "top") {
                sGroup.set({x:sGroup.x,y:parseFloat(startPoint.y) - sGroup.height});
                } else {
                sGroup.set({x:sGroup.x,y:parseFloat(startPoint.y)});
                }
	} else {
		boxHPos = eBoxHPos;
		boxVPos = eBoxVPos;
		if (boxHPos == "left") {
               	eGroup.set({x:parseFloat(endPoint.x),y:eGroup.y});
               } else if (boxHPos == "right") {
               	eGroup.set({x:parseFloat(endPoint.x) - eGroup.width,y:eGroup.y});
               	} else {
                eGroup.set({x:parseFloat(endPoint.x) - eGroup.width/2,y:eGroup.y});
               }

               if (boxVPos == "top") {
                eGroup.set({x:eGroup.x,y:parseFloat(endPoint.y) - eGroup.height});
                } else {
                eGroup.set({x:eGroup.x,y:parseFloat(endPoint.y)});
                }			
	}
}
/* Start Point & End Point Info */
function setStart(sp) {
	sp.name = sp.name.toString(); /* Prevent errors when name is just a number */
    var cp = $(':mobile-pagecontainer').pagecontainer("getActivePage").attr('id').replace('page','');
	if(cp != '1' && !is_empty(endPoint)){
		$.mobile.loading('show');
		$('#graph').css('opacity',0);
	}	
	if (sp.name.indexOf('Select') > -1) {
		$("#cboDepart").changeButtonText(sp.name);
		startPoint = [];	
		return;
		}
		if (sp.point == "destination") {
			startPoint = destinationList[sp.name];
			}
			else if (sp.point == "other") {
				startPoint = categoryList[sp.cat][sp.catid];
			}
			else {
				alert('looking into "physicianList"');
				if (sp.id.indexOf("-") != -1) {
					var idx = sp.id.substr(sp.id.indexOf("-")+1);
					if (parseInt(idx) > 1) {
					startPoint = physicianList[sp.name]["loc"+idx]
					} else {
						startPoint = physicianList[sp.name];
						}
				} else {
					startPoint = physicianList[sp.name];
				}
				startPoint.name = startPoint.name.replace('*','');
			}
		startPoint.name = translatePhrase(startPoint.name);
	if ($(':mobile-pagecontainer').pagecontainer("getActivePage").attr('id') != "page1") {
		h2t.getPath(startPoint,endPoint,setPath);
		
		
	} else {
		$("#cboDepart").changeButtonText(startPoint.name);	
	} 
}
function setEnd(ep) {
	ep.name = ep.name.toString(); /* Prevent errors when name is just a number */
    var cp = $(':mobile-pagecontainer').pagecontainer("getActivePage").attr('id').replace('page','');
	if(cp != '1' && !is_empty(startPoint)){
		$.mobile.loading('show');
		$('#graph').css('opacity',0);
	}
	
	if (ep.name.indexOf('Select') > -1) {
		$("#cboArrive").changeButtonText(ep.name);	
		endPoint = [];
		return;
		}
	if (ep.point == "destination") {
		endPoint = destinationList[ep.name];
		} else if (ep.point == "other") {
				endPoint = categoryList[ep.cat][ep.catid];
		} else {
			alert('looking into "physicianList"');
			if (ep.id.indexOf("-") != -1) {
					var idx = ep.id.substr(ep.id.indexOf("-")+1);
					if (parseInt(idx) > 1) {
					endPoint = physicianList[ep.name]["loc"+idx]
					} else {
						endPoint = physicianList[ep.name];
						}
				} else {
					endPoint = physicianList[ep.name];
				}
				endPoint.name = endPoint.name.replace('*','');
			
			
		}
		endPoint.name = translatePhrase(endPoint.name);
	if ($(':mobile-pagecontainer').pagecontainer("getActivePage").attr('id') != "page1") {
		h2t.getPath(startPoint,endPoint,setPath);
	}else {
		$("#cboArrive").changeButtonText(endPoint.name);	
	} 
}
function setStartAndEnd() {
	startPoint = "";
	endPoint = "";
	if(DefaultStartLoc && DefaultStartLoc != 'null'){
		var tmp = CaseInsensitiveDestGetter(DefaultStartLoc);
		if(tmp){
			$("#cboDepart").changeButtonText(startPoint.name);
			startPoint = tmp;
			doDrawPath = true;
			setFlag("start");
			centerOnPoint(startPoint);
			var tc = pathLayer.getChildByName("fl" + startPoint.FloorNumber);
			tc.addChild(sGroup)
			positionFlag("start");
			stage.update();
			curFloor = startPoint.FloorNumber;
			
			if(DefaultEndLoc){
				var tmp2 = CaseInsensitiveDestGetter(DefaultEndLoc);
				if(tmp2){
					endPoint = tmp2;
					$.mobile.loading('show');
					h2t.getPath(startPoint,endPoint,setPath);
				}
			}
		}
	}
	else if(DefaultFloor){
		ShowFloor(DefaultFloor);
		curFloor = DefaultFloor;
	}
}

function CaseInsensitiveDestGetter(_destName){
	var tmpDest = undefined;
	for (var i in destinationList){
		if(i.toString().toLowerCase() == _destName.toString().toLowerCase()){
			tmpDest = destinationList[i];
			break;
		}
	}
	if(!tmpDest){
		for (var i in parentDestinations){
			if(i.toString().toLowerCase() == _destName.toString().toLowerCase()){
				tmpDest = parentDestinations[i];
				break;
			}
		}
	}
	return tmpDest
}

function ShowFloor(fNum){
	doDrawPath = true;
	var itm = mapLayer.getChildByName("fl" + fNum + "_img");
	if(itm){
		var pnt = [];
		pnt["x"] = 0;
		pnt["y"] = itm.height/2;
		pnt["FloorNumber"] = fNum;
		centerOnPoint(pnt);
	}
}

/* Elevator Functions */
function DrawElevators(paths) {
    var SP = null;
    var EP = null;
	curPathFloors = [];
    $.each(paths, function(index, value) {
		curPathFloors[this[2]] = true;
		curPathFloors[this[3]] = true;
            SP =this[0];
            SP['fl'] = this[2]
            EP = this[1];
            EP['fl'] = this[3]
            if (SP != undefined && EP != undefined) {
                var sd = 'u';
                var ed = 'd';
                if (parseInt(this[2]) > parseInt(this[3])) {
                    sd = 'd';
                    ed = 'u';
                }
                var newx = (parseInt(SP['x']) + parseInt(EP['x'])) /2;
                SP['x'] = newx;
                EP['x']= newx;
                SP.y = parseInt(SP.y);
                EP.y = parseInt(EP.y);
                AddElevatorLine(SP,sd);
				
				if(!ShowOnlyRelevantFloors){
					var sf = parseInt(SP['fl']);
					var ef = parseInt(EP['fl']);
					if(Math.abs(sf - ef) > 1){
						var p1,p2;
						if(sf > ef){
							f1 = sf;
							f2 = ef;
						}
						else{
							f1 = ef;
							f2 = sf;
						}
						for(var i=f1-1;i>f2;i--){
							var _mi = pathLayer.getChildByName('fl' + i);
							if(_mi){
								curPathFloors[i] = true;
								AddExtraElevatorLine(parseInt(SP['x']),i)
							}
						}
					}
				}
                AddElevatorLine(EP,ed);
                SP = null;
                EP = null;
            }
        });
	var cpfs = [];
	for(var key in curPathFloors){
		cpfs.push(key);
	}
	curPathFloors = cpfs;
	if(curPathFloors[0] != startFloor)
		curPathFloors.reverse();
	curPathFloorIdx = 0;
}

function AddExtraElevatorLine(x,fNum){
	var mi = pathLayer.getChildByName('fl' + fNum);
	var startY = mi.height;
	var endY = 0;
	var context = new createjs.Graphics();
	context.setStrokeStyle(pathWidth,strokeCap,strokeJoin);
	context.s(pathColor).mt(x,startY).lt(x,0).es();
	var solidLine = new createjs.Shape(context).set({alpha:0.75});
	mi.addChild(solidLine);
	context = new createjs.Graphics();
	context.setStrokeStyle(pathWidth,"butt",strokeJoin);
	context.s(pathStroke)
	while (startY > endY) {
		context.mt(x,startY);
		if ((startY - 20) < endY) {
			context.lt(x,endY);
		} else {
			context.lt(x,startY-10);
		}
		startY -= 20;
	}
	context.es();
	var dotLine = new createjs.Shape(context).set({alpha:0.75});
	mi.addChild(dotLine);
}

function AddElevatorLine(point, dir) {
    var flnum = point['fl'];
    var mi = pathLayer.getChildByName('fl' + flnum);
    var y;
    var startY = parseInt(point['y']);
    var startX = parseInt(point['x']);
    var endY =  parseInt(0);
    if (dir != 'u') {
        endY = mi.height;
        }
        var context = new createjs.Graphics();
        context.setStrokeStyle(pathWidth,strokeCap,strokeJoin);
		context.s(pathColor).mt(startX,startY).lt(startX,endY).es();
        var solidLine = new createjs.Shape(context).set({alpha:0.75});
            mi.addChild(solidLine);
            
        context = new createjs.Graphics();
        context.setStrokeStyle(pathWidth,"butt",strokeJoin);
		context.s(pathStroke)
		if (dir == 'u') {
			while (startY > endY) {
			context.mt(startX,startY);
			if ((startY - 20) < endY) {
				context.lt(startX,endY);
			} else {
				context.lt(startX,startY-10);
			}
			startY -= 20;
			}
			
		} else {
    while (startY < endY) {
        context.mt(startX,startY);
			if ((startY + 20) > endY) {
				context.lt(startX,endY);
			} else {
				context.lt(startX,startY+10);
			}
		
        startY += 20;
        }
		
        }
        context.es();
        var dotLine = new createjs.Shape(context).set({alpha:0.75});
        mi.addChild(dotLine);
        var myEle = new createjs.Bitmap(ele).set({
        	x:parseInt(point['x'])-(ele.width/2),
        	y:parseInt(point['y'])-(ele.height/2)
        	});
        mi.addChild(myEle);
    }
/* GetPath Callback  */
function setPath(data) {
	var floors = [];
	$.mobile.loading('hide');
	if (data.success != undefined) {
		if(typeof data.success != "boolean"){
			if(data.success == "Path Not Found!"){
				alert("Path from \""+data.sp.name+"\" to \""+data.ep.name+"\" not found!");
			}
			else{
				alert(data.success);
			}
		}
		startPoint = data.sp;
		endPoint = data.ep;
		clearPathData();
		if (startPoint.length == 0 && endPoint.length == 0) {
			return;
			};
		setFlag("start");
		centerOnPoint(startPoint);
		var tc = pathLayer.getChildByName("fl" + startPoint.FloorNumber);
		tc.addChild(sGroup)
		positionFlag("start");
		floors["fl"+startPoint.FloorNumber] = true;
		showFloors(floors);
		stage.update();
		centerOnPoint(startPoint);
		return;
	}  else {
		 FloorPathDataList = new Array();
    ElevatorDataList = new Array();
    FloorOffsetList = new Array();
    var pathArcsCnt = 0;
    var directionsTxt = new Array();
    isSingleElevatorPathUsed = true;
    var xml = $($.parseXML(data));
    xml.find('anyType').each(function() {
			
            if (typeof $(this).attr('xsi:type') != "undefined") {
                if ($(this).attr('xsi:type') == "FloorPathInfo") {
                    if ($(this).find("string").length >= 1) {
                        var floorNum = parseInt($(this).find("FloorNumber").text());
                        
                        var _FloorPathData = new FloorPathData(floorNum);
                        $(this).find("string").each(function() {
                                _FloorPathData.addPoint($(this).text());
                            });
                         if (_FloorPathData.pointList.length > 1) {
                         	floors["fl"+floorNum] = true;
                         }
                        FloorPathDataList.push(_FloorPathData);
                    }

                } else if ($(this).attr('xsi:type') == "xsd:string") {
                    var dataVal = $(this).text();
                    dataVal = dataVal.replace(/\{/gi, "");
                    dataVal = dataVal.replace(/\}/gi, "");
                    var arcParts = dataVal.split(",");
                    var parts = arcParts[0].split(";");
                    var n1 = $.parseJSON('{"x":"' + parts[0] + '","y":"' + parts[1] + '"}');
                    parts = arcParts[1].split(";");
                    var n2 = $.parseJSON('{"x":"' + parts[0] + '","y":"' + parts[1] + '"}');
                    var sFloor = arcParts[2].replace(/\[/gi, "").replace(/\]/gi, "");
                    var eFloor = arcParts[3].replace(/\[/gi, "").replace(/\]/gi, "");
                    ElevatorDataList.push([n1,n2,parseInt(sFloor),parseInt(eFloor)]);
                } else if ($(this).attr('xsi:type') == "Directions") {
                    directionsTxt.push($(this).find("Text").text());
                    if ($(this).find("isSingleElevatorPathUsed").text() != "true") {
                        isSingleElevatorPathUsed = false;
                    }
                }
            }
        });
        
		
    if (directionsTxt.length > 0) {
        if (directionsTxt.length == 1) {
            setDirections(directionsTxt[0]);
        } else {
            var _directionsTxt = "";
            if (FloorPathDataList.length > 1) {
                for (var i = 0; i < directionsTxt.length; i++) {
                    _directionsTxt = _directionsTxt + directionsTxt[i];
                    if (i < directionsTxt.length - 1) {
                        _directionsTxt = _directionsTxt + ";";
                    }
                }
            } else {
                _directionsTxt = directionsTxt[1];
            }
            setDirections(_directionsTxt);
        }
    }
    DrawPath();
    showFloors(floors);
    pathLoaded = true;
		$('#btnPrevStep')[0].disabled=true;
		$('#btnPrevStep').css('opacity',0.4);
	}
	}
function DrawPath() {
	 var startSet = false;
    FloorOffsetList = new Array();
    var lastMapHeight = 0;
    var lastMapWidth = 0;
    var imgOffsetY = 0;
    clearPathData();
    var sPnt = null;
    $.each(FloorPathDataList, function(index, value) {
            var flnum = this.FloorNumber;
            var curLayer = pathLayer.getChildByName("fl"+ flnum);
            var pntArr = this.pointList;
            if (sPnt == null) sPnt = pntArr[0];
            imgOffsetY = FloorOffsetList[this.FloorNumber];
            
			var context = new createjs.Graphics();
			context.setStrokeStyle(pathWidth,strokeCap,strokeJoin);
			context.s(pathColor);
			context.mt(parseInt(pntArr[0].x),parseInt(pntArr[0].y));
            for (p = 1; p < pntArr.length; p++) {
            	context.lt(parseInt(pntArr[p].x),parseInt(pntArr[p].y));
                
                   
            }
            context.es();
            var sp=new createjs.Shape(context);
            
            curLayer.addChildAt(sp,0);
           
        });
    DrawElevators(ElevatorDataList);
   	 setFlag("start");
   	 var tc;
	 if (endPoint != startPoint) {
	 	setFlag("end");
	 	tc = pathLayer.getChildByName("fl" + endPoint.FloorNumber);

		tc.addChild(eGroup);	    
		eGroup.set({visible:true});
		positionFlag("end");
		}
	tc = pathLayer.getChildByName("fl" + startPoint.FloorNumber);
		tc.addChild(sGroup);
		positionFlag("start");
		
	$('#mnu-dir').show();
	
	
     stage.update();
	}
function clearPathData() {
    for (c in pathLayer.children) {
    	pathLayer.children[c].removeAllChildren();
    }
    showFloors();
	curPathFloors = [];
	$('#pathStepBtns').hide();
	$('#btnPrevStep')[0].disabled=false;
	$('#btnPrevStep').css('opacity',1);
	$('#btnNextStep')[0].disabled=false;
	$('#btnNextStep').css('opacity',1);
}

function getParent(child) {
	var parentName = ""
	
	for (l in parentDestinations) {
		if (child.x == parentDestinations[l].x && child.y == parentDestinations[l].y && child.BuildingID == parentDestinations[l].BuildingID && child.FloorNumber == parentDestinations[l].FloorNumber) {
			parentName = parentDestinations[l].name;
			break;
			}
		}
		return parentName;
}

function setDirections(dText) {
    dirArr = dText.split(";");
    dirString = "<ul data-role='listview' id='turn-by-turn' class='departures'>\n";
	var stepCount = 1;
	var pos = 'up';
	var hasExited = false;
	
	var epParent = getParent(endPoint);
	var spParent = getParent(startPoint);
	
	var lastDir = '';
	var curDir = '';
	var lastExit = '';
	var cFloor = startPoint.FloorNumber;
	var eFloor = ''
    for (dir = 0; dir < dirArr.length; dir++) {
		curDir = dirArr[dir];
		if (/^Exit/g.test(curDir)) {
			var td = dir+1;
			while (/^Continue/gi.test(dirArr[td])) {
				if (dirArr[td].indexOf("Continue past") > -1) break;
				dirArr[td] = '';
				td++;
				}
			curDir += ' and ' + dirArr[td];
		 	dirArr[td] = '';
		}
		if (curDir.length == 0) continue;
		if (epParent.length > 0 ) curDir = curDir.replace(epParent,endPoint.name);
		if (spParent.length > 0 ) curDir = curDir.replace(spParent,startPoint.name);
		if (curDir.indexOf("Continue on elevator") > -1) {
			continue;
			}
		curDir = curDir.replace(/through\W[0-9]*\Wintersections/g,'');
		eFloor = curDir.substr(curDir.indexOf('#')+1,1);
		if (curDir.toLowerCase().indexOf('left') > -1) {
			pos = 'left';
			}
		if (curDir.toLowerCase().indexOf('right') > -1) {
			pos = 'right';
			}
		if (!isNaN(parseInt(eFloor))) {
			if (parseInt(cFloor) > parseInt(eFloor)) {
				pos = 'down'
			} else {
				pos = 'up'
			}
			cFloor = eFloor;
		}
		var flnum = curDir.match(/\-?\d+/g);
		if(flnum != undefined) {
		curDir = curDir.replace(/(floor #)\-?[0-9]/g,floorNames[flnum]);
		}
		var patt = /^Arrive|^Departing/g;
		var showLine = patt.exec(curDir);
		if (!is_empty(showLine)) {
			patt = new RegExp(endPoint.name,'g');
			if (patt.test(curDir)) {
				showLine = null;
				curDir = curDir.replace('Turn','');
			}
		}
		patt = /^Continue on [\w]* passing floor/gi;
		if (patt.test(curDir)) continue;
		
		if (is_empty(showLine)) {

		curDir = curDir.replace(/Continue/g,"Go straight ahead");
		curDir = curDir.replace(/continue/g,"go straight ahead");
		curDir = curDir.replace("and go ","");
		
		if(curDir.indexOf(" will be on the Take a Slight Left") >= 0){
			curDir = "Take a slight left to arrive at " + curDir.replace(" will be on the Take a Slight Left","");
		}
		if(curDir.indexOf(" will be on the Take a Slight Right") >= 0){
			curDir = "Take a slight right to arrive at " + curDir.replace(" will be on the Take a Slight Right","");
		}
		
		if (curDir.indexOf(endPoint.name) != curDir.lastIndexOf(endPoint.name)) {
		curDir = curDir.replace('at ' + endPoint.name, '');
		}
		if (stepCount == 1) {
			}
		
			dirString += '<li><span class="ui-li-count spanDirStep">' + stepCount.toString() + '</span>\n';
			dirString += curDir + '</li>\n';
			stepCount++;
			lastDir = curDir;
			
		}
    }
    dirString += "</ul>";
    $("#Directions").html(dirString);
    $("#txtbtn").prop("disabled",false);
    $('#turn-by-turn').listview();
	
	ApplyThemeColor();
    if($("#Directions:visible").length == 0) {
		setTimeout(function(){
			centerOnPoint(startPoint);
		}, 100);
	}
	
	$("#Directions").height(($(window).height() - $("#p2head").height() - $("#foot-menu").height())-32); //**Note the "-32" accounts for the padding and is required to fix the iScroll thingy**
	$("#Directions").css('position','relative');
	try{
		if(DirectionsScroll){
			DirectionsScroll.destroy();
		}
	}
	catch(err){}
		DirectionsScroll = new IScroll('#Directions', {
			zoom: false,
			momentum: true,
			scrollbars:true,
			mouseWheel: true,
			scrollX: false,
			scrollY: true,
			tap: false
		});
	setTimeout(function() {
				        DirectionsScroll.refresh();
				     }, 100);
}

function centerOnPoint(point, vertOnly) {
	vertOnly = typeof vertOnly !== 'undefined' ? vertOnly : false;
	curFloor = point.FloorNumber;
	var centerX = ((parseInt(point.x) * myScroll.scale) - ($("#scroller").width() / 2));
	var itm = mapLayer.getChildByName("fl" + point.FloorNumber + "_img");
	if(itm){
		var centerY = (itm.y + parseInt(point.y)) * myScroll.scale - ($("#scroller").height()/2)
		if (centerX < 0) { centerX = 0; }
		if (centerY < 0) { centerY = 0; }
		if(vertOnly)
			centerX = 0;
			myScroll.scrollTo(-centerX,-centerY,1000,IScroll.utils.ease.quadratic);
	}
}
function toggleText(t) {
	if ($("#Directions").text().trim().length == 0 && $("#Directions:visible").length == 0) {
		$("#txtbtn").prop("disabled",true);
		return;
		} else {
			if(DirectionsScroll)
				DirectionsScroll.scrollTo(0,0);
		$("#Directions").fadeToggle({
			complete: function() {
				if ($("#Directions:visible").length == 0)  {
				$("#txtbtn").html(translatePhrase("Text Directions"))
				$('#btnFloorsMenu').show();
			} else {
				$("#txtbtn").html(translatePhrase("Show Map"));
				$('#btnFloorsMenu').hide();
			}
				}
			});
		$("#scroller").fadeToggle();
		
		
	}
}

function ApplyThemeColor(){
	var greenBgStuff = $('*').filter(function(){
		var color = $(this).css("background-color");
		return color === "#006335" || color === "rgb(0, 99, 53)" ;
	});
	greenBgStuff.css('background-color',ThemeColor);
	$('.spanDirStep').css('background-color',ThemeColor);

	var greenFgStuff = $('*').filter(function(){
		var color = $(this).css("color");
		return color === "#006335" || color === "rgb(0, 99, 53)" ;
	});
	greenFgStuff.css('color',ThemeColor);
}

function gotNum(str){
	return /\d/.test(str)
}