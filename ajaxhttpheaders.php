<?php
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

	if(isset($_GET['callback'])){
		$headers = getallheaders();
		$callback = $_GET['callback'];
		header('Content-Type: application/javascript');
		$retVal = $callback."(".json_encode($headers).")";
		echo $retVal;
	}
	else{
		header('Content-Type: text/plain');
		echo "I need a callback=";
	}
?>