
// 2015 Dato, Inc.
// Predictive Service Client - Javascript
// Licensed under BSD-3

(function (root, factory) {
  if(typeof define === "function" && define.amd) {
    define([], factory);
  } else if(typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PredictiveServiceClient = factory();
  }
}(this, function() {

  var request = function(options) {
    var url = options.url;
    var method = options.method || "GET";
    var callback = options.callback || function() {};
    var data = options.data;
    var timeout = options.timeout || 10000;

    var response = "";

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open(method,  url, true);

    //set headers
    xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    if (options.headers && Object.keys(options.headers).length) {
      for (var header in options.headers) {
        xmlhttp.setRequestHeader(header, options.headers[header]);
      }
    }

    //set timeout
    xmlhttp.timeout = timeout;
    xmlhttp.ontimeout = function () { callback(new Error('Request timeout'), null); };

    //setup callback
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        try {
          response = {'statusCode': response.status, 'data': JSON.parse(responseText)};
        }
        catch (err) {
          callback(new Error('Invalid response: ' + err.message), null);
          return;
        }
        callback(null, response);
      }
    };

    //send data in body
    if (Object.keys(data).length > 0) {
       xmlhttp.send(data);
       return;
    }

    //send empty request
    xmlhttp.send();
  };

  var PredictiveServiceClient = function(end_point, api_key) {
    if ( !(this instanceof PredictiveServiceClient) ) {
      return new PredictiveServiceClient(end_point, api_key);
    }
    this.end_point = endpoint;
    this.api_key = api_key;
    this.timeout = 10000; // default to 10 seconds timeout
  };

  PredictiveServiceClient.prototype.setEndpoint = function(endpoint) {
    this.endpoint = endpoint;
  };

  PredictiveServiceClient.prototype.setApikey = function(api_key) {
    this.api_key = api_key;
  };

  PredictiveServiceClient.prototype.setTimeout = function(timeout) {
    this.timeout = timeout;
  };

  PredictiveServiceClient.prototype.__constructRequestData = function(request_data, request_id) {
    var postData = { "api key": this.api_key };
    if ('method' in request_data) {
      postData.method = request_data.method;
    }
    if ('data' in request_data) {
      postData.data = request_data.data;
    }
    if (request_id !== null) {
      postData.id = request_id;
    }

    return postData;
  };

  PredictiveServiceClient.prototype.query = function(po_name, data, callback) {
    var postData = this.__constructRequestData(data);

    var options = {
      url: this.end_point + '/query/' + po_name,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: postData,
      callback: callback
    };
    request(options);
  };

  PredictiveServiceClient.prototype.feedback = function(request_id, data, callback) {
    var postData = this.__constructRequestData(data, request_id);

    var options = {
      url: this.end_point + '/feedback',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: postData,
      callback: callback
    };
    request(options);
  };

  return PredictiveServiceClient;
}));
