<br>
<p align="center">
	<h1 align="center">
		Auth System - Express.js Application
	</h1>
<br/>

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/T6T01APGOO)

![xng4ud](https://github.com/user-attachments/assets/d246c09f-2c1f-4707-82f7-664631ab1136)

![b9e9a1](https://github.com/user-attachments/assets/b40920d5-62ee-47a1-9bb7-e220632088e4)

## Examples

```
Lua
PerformHttpRequest("http://127.0.0.1/validate-ip", function(result, data)
    if (data:gsub("%\"", "") == "SUCCESS_200_OK ") then 
        print("^2License Activated!")
    else
        print("^1License Deactivated ^0")
    end
end)
PHP
<?php
$url = "http://127.0.0.1/validate-ip"; 
$options = [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/x-www-form-urlencoded'
    ]];
$ch = curl_init();
curl_setopt_array($ch, $options);
$response = curl_exec($ch);
curl_close($ch);
if (trim($response) === 'SUCCESS_200_OK') {
    echo "License Activated!";
} else {
    echo "License Deactivated!";
}
?>
Javascript
const url = "http://127.0.0.1/validate-ip"; // Your validation endpoint
fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json' }})
.then(response => response.text())  // Expecting text response (not JSON)
.then(data => {
    if (data.trim() === 'SUCCESS_200_OK') {
        console.log("License Activated!");
    } else {
        console.log("License Deactivated!"); }})
.catch(error => console.error("Error:", error));
C#
using System;
using System.Net.Http;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        string url = "http://127.0.0.1/validate-ip"; // Your validation endpoint

        using (HttpClient client = new HttpClient())
        {
            HttpResponseMessage response = await client.PostAsync(url, null);

            string responseString = await response.Content.ReadAsStringAsync();

            if (responseString.Trim() == "SUCCESS_200_OK")
            {
                Console.WriteLine("License Activated!");
            }
            else
            {
                Console.WriteLine("License Deactivated!");}}}}
```

## Setup

Edit ``secret_API`` inside of ``config.json`` then go to ``http://localhost/add-ip?KEY=YOURKEY``

## Reqirements

- Node.js **v16** or **Higher** is required.

