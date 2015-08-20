<?php
	// error_reporting(E_ALL);
	// ini_set('display_errors', '1');
	
  header("Content-type: image/png");
  $url = "";
  if(isset($_GET['img'])){
	  $url = $_GET['img'];
  }
  // $url = "//api.wayfindingpro.com/UserData/User 73/Projects/PID 194/Sharp_DSE_Map.png";
  $url = str_replace(" ","%20",$url);
  $pos = strpos($url,"http");
  if($pos === false){
	  $url = "http:".$url;
  }
  readfile($url);
  exit(0);
?>