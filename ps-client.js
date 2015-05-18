
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
    var method = options.method;
    var callback = options.callback;
    var data = options.data;
    var timeout = options.timeout;

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

    xmlhttp.ontimeout = function () { callback(new Error('Request timeout'), null); };

    xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      try {
        response = {'statusCode': response.status, 'data': responseText};
      }
      catch (err) {
        callback(new Error('Invalid response: ' + err.message), null);
        return;
      }
      callback(null, response);

      if (Object.keys(data).length > 0) {
         xmlhttp.send(data);
         return;
      }

      xmlhttp.send();
      }
    };
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

  PredictiveServiceClient.prototype.query = function(po_name, data, callback) {
    var postData = JSON.stringify({"api_key": this.api_key, "data": data});
    var options = {
      url: this.end_point + '/query/' + po_name,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };
    request(postData, options, callback);
  };

  PredictiveServiceClient.prototype.feedback = function(request_id, data, callback) {
    var postData = JSON.stringify({"id": request_id, "api_key": this.api_key, "data": data});
    var options = {
      url: this.end_point + '/feedback',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };
    request(postData, options, callback);
  };

  return PredictiveServiceClient;
}));
