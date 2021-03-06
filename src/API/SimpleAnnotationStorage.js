"use strict";

/*
	The MIT License (MIT)

	Copyright (c) Microsoft Corporation

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.

	PS.API.SimpleAnnotationStorage:
	-------------------------------
	This class is a basic client to the experimental node.js/mongodb annotation storage

*/

PS.API.SimpleAnnotationStorage = new function() {

	var _nodeUrl = "";
	var _that = this;

	var _errorMessage = "You need to initialize the SimpleAnnotationStorage to be able to use it!\nYou need to add PS.API.SimpleAnnotationStorage.init(_annotationStorageURL, _annotationStoragePort);";

	this.init = function(url, port, onInit) {

		if (url && port) {
			_nodeUrl = "http://" + url + ":" + port + "/";

			//test if the node service is running
			new PS.Utils.Request(_nodeUrl+"status", {
				onComplete: function(xhr) {
					console.log("Node.js MongoDB running: " + xhr.responseText);
					if (onInit) {
						onInit(_that);
					}
				},
				onError: function() {
					console.warn("You need to run the fake node.js/mongodb storage");
					if (onInit) {
						onInit();
					}
				}
			});
		}
		else {
			console.warn(_errorMessage);
		}
	};

	this.load = function(guid, callback) {

		if (_nodeUrl) {

			new PS.Utils.Request(_nodeUrl+"synths/"+guid, {
				method: 'GET',
				onComplete: function(xhr) {
					var json = JSON.parse(xhr.responseText);
					callback(json);
				},
				onError: function() {
					callback([]);
				}
			});
		}
		else {
			console.warn(_errorMessage);
		}
	};

	this.insert = function(guid, annotation, thumbInfo, callback) {

		if (_nodeUrl) {

			//ignoring thumbInfo for now

			new PS.Utils.Request(_nodeUrl+"synths/"+guid, {
				method: 'POST',
				content: JSON.stringify(annotation),
				onComplete: function(xhr) {
					var json = JSON.parse(xhr.responseText);
					callback(json.dbid);
				}
			});
		}
		else {
			console.warn(_errorMessage);
		}
	};

	this.update = function(guid, annotation, callback) {

		if (_nodeUrl) {

			new PS.Utils.Request(_nodeUrl+"synths/"+guid, {
				method: 'PUT',
				content: JSON.stringify(annotation),
				onComplete: function(xhr) {
					var json = JSON.parse(xhr.responseText);
					callback(json.dbid);
				}
			});
		}
		else {
			console.warn(_errorMessage);
		}
	};

	this.remove = function(guid, annotation) {

		if (_nodeUrl) {

			if (annotation.dbid) {
				new PS.Utils.Request(_nodeUrl+"synths/"+guid, {
					method: 'DELETE',
					content: JSON.stringify({dbid: annotation.dbid})
				});
			}
		}
		else {
			console.warn(_errorMessage);
		}
	};
};
