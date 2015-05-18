Dato-Predictive-Service-Client-JS
=================================

The purpose of the Dato Predictive Service Javascript Client is to allow client-side applications to easily query Dato Predictive Services.

Installation
------------

To install Dato Predictive Service Javascript Client, simply install with:

```no-highlight
npm install dato-predictive-service-client-js
```

Requirements
------------

- Dato Predictive Service, launched by GraphLab-Create >= 1.4 installation

Import
------

### Global Import
```html
<script src="ps-client.js" type="text/javascript"></script>
```

### CommonJS

```js
var PredictiveServiceClient = require('./ps-client');
```

### AMD

```js
define('your_script' ['ps-client'], function( PredictiveServiceClient ) {
  ...
});
```

Usage
-----

#### Construct Client

To use the Dato Predictive Service Javascript Client, first you need to obtain the
following information from a running Dato Predictive Service:
* Predictive Service CNAME or DNS name (endpoint)
* API key from the Predictive Service

Once you have imported the client object, instantiate a new client using the endpoint and API key:
```js
//replace these values with your endpoint configuration
var endpoint = "https://your-predictive-service-endpoint.com"
var api_key = "AN_API_KEY_STRING_GOES_HERE";

// create client
var client = new PredictiveServiceClient(endpoint, api_key);

```

#### Query

To query a model that is deployed on the Predictive Service, you will need:

* model name
* method to query (recommend, predict, query, etc.)
* data used to query against the model
* your callback function

For example, the code below demonstrates how to query a recommender model, named
``rec``, for recommendations for user ```Jacob Smith```:

```js
// construct data
var data = {'users': ['Jacob Smith'] };

// construct query
var request_data = {"method": "recommend", "data": data};

// query
client.query('rec', request_data, function(err, resp) {
  console.log(resp.statusCode); // status code of the response
  console.log(resp.data); // response data
});
```

**Notes**

- Different models could support different query methods (recommend, predict, query, etc.)
  and different syntax and format for **data**. You will need to know the
  supported methods and query data format before querying the model.


#### Set timeout

To change the request timeout when querying the Predictive Service, use the following:

```js
client.setTimeout(500); // 500ms
```

The default timeout is 10 seconds.


#### Results

If query is successful, the response data contains the following:

* model response
* uuid for this query
* version of the model


```js
client.query('rec', request_data, function(err, resp) {
  console.log(resp.statusCode); // status code of the response
  console.log(resp.data); // response data

  // parse respose data
  var model_response = resp.data.response;
  var uuid = resp.data.uuid;
  var version = resp.data.version;
});
```

``model_response`` contains the actual model output from your query.

#### Send feedback

Once you get the query result, you can submit feedback data corresponding to this query
back to the Predictive Service. This feedback data can be used for evaluating your
current model and training future models.

To submit feedback data corresponding to a particular query, you will need the UUID
of the query. The UUID can be easily obtained from the query response data.

```js
client.query('rec', request_data, function(err, resp) {
  // parse query respose data
  var model_response = resp.data.response;
  var uuid = resp.data.uuid; //uuid
});
```

For the feedback data, you can use any attributes or value pairs that you like.

Example:
```js
feedback_data = { "searched_terms" : "acoommodations",
                  "num_of_clicks"  : 3 };
```
Now we can send this feedback data to the Predictive
Service to associate this feedback with this particular query.

```js
client.feedback(uuid, feedback_data, function(err, resp) {
  console.log(resp);
});
```

### Optional Setters

Setter functions are provided for modification of the PredictiveServiceClient instance

```js
// set a new endpoint
client.setEndpoint('https://new-predictive-service-endpoint.com');

// set a new API key
client.setApikey('A_NEW_API_KEY_STRING');

// set a different timeout (default is 10 seconds)
client.setTimeout(4000); //in milliseconds

```

More Info
---------

For more information about the Dato Predictive Service, please read
the [API docs](https://dato.com/products/create/docs/generated/graphlab.deploy.PredictiveService.html)
and [userguide](https://dato.com/learn/userguide/deployment/pred-getting-started.html).

License
-------

The Dato Predictive Service Javascript Client is provided under the 3-clause BSD [license](LICENSE).
