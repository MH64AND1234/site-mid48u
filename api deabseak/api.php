<?php
header("Content-Type: text/plain; charset=UTF-8");

$api_key = "DarkAI-DeepAI-EFF939A9130A0ABAE3A7414D";

if (!isset($_POST['message'])) {
    echo "No message";
    exit;
}

$text = $_POST['message'];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://sii3.top/api/deepseek/api.php");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, "key=$api_key&v3=" . urlencode($text));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);

$response = curl_exec($ch);

if(curl_errno($ch)){
    echo "Server connection error.";
}else{
    echo $response;
}

curl_close($ch);
?>