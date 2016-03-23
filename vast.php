<?php

$auid = (string) @$_GET['auid'];
$vars = (string) @$_GET['vars'];

$params = str_replace(',', '/', $vars);

$url = 'http://diwanee-d.openx.net/v/1.0/av?auid=' . $auid . base64_decode($params);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_AUTOREFERER, true);
curl_setopt($ch, CURLOPT_USERAGENT, isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '' );
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 20);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'X-Forwarded-For: ' . $_SERVER['REMOTE_ADDR'],
    'Expect:' // used to ignore "100 Continue Header" when using POST
));

$response = curl_exec($ch);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$body = substr($response, $header_size);
curl_close($ch);

header("Content-type: text/xml");
echo $body;
exit();
