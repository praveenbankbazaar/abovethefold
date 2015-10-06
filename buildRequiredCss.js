/*
  This script loads the url in a phantom browser, queries the dom for the css included. reads the contents of each css file and writes to a
  single output css file
*/

var args = require('system').args;
var page = require('webpage').create();
var url = args[1];
var outputFile = args[2];

page.open(url,function(status){
	
	page.onConsoleMessage = function (msg) { console.log(msg); };
        if(status=='success'){
		var fs = require('fs');
		var targetFile = fs.workingDirectory+"/output/"+outputFile;
		var cssFileList = page.evaluate(function() {
			var cssNodeList = document.querySelectorAll("link[type='text/css']");
			var fileList="";
			var cssTitle="";
			for(var i=0;i<cssNodeList.length;i++){
				cssTitle = cssNodeList.item(i).getAttribute("href");
				cssTitle = cssTitle.substring(cssTitle.indexOf("/"),cssTitle.indexOf("?"));
				if(i!=cssNodeList.length-1){
					cssTitle = cssTitle + "#";
				}
				fileList = fileList + cssTitle;
			}
			return fileList;
    		});
		var cssFileArray = cssFileList.split("#");
		//concatenate the contents of all the source css
		for(var i=0;i<cssFileArray.length;i++){
			var fileName = cssFileArray[i];
			var filePath = fs.workingDirectory+fileName;
			//console.log("Current file is"+" "+filePath);
                        try{
				var content = fs.read(filePath);
				fs.write(targetFile,content,'a');
			}
			catch(e){
				console.log("I/O while generating source css for"+" "+url);
				fs.removeDirectory(targetFile);	
				phantom.exit();
			}
		}
	}
	else{
		console.log("Error while opening the url"+" "+url);
	}
	phantom.exit();
});

