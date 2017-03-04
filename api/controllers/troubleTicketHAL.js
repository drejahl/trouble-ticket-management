'use strict';

var config = require( './config.json' );

var util = require('util');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */

module.exports = { troubleTicketFindHAL, troubleTicketGetHAL };


  // Find a troubleTicket: GET /v2/hal/troubleTicket/

  function troubleTicketFindHAL(req, res) {

  // Use connect method to connect to the server
  MongoClient.connect(config.db_url, function(err, db) {
    assert.equal(null, err);

    // Get the documents collection
 
    var collection = db.collection('troubleTicket');
  
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        res.json( docs );
        });
    })
  }

  // Get one troubleTicket by Id: GET /v2/hal/troubleTicket/{id}

  function troubleTicketGetHAL(req, res) {

  var troubleTicketId = parseInt(req.swagger.params.troubleTicketId.value);

  // Use connect method to connect to the server
  MongoClient.connect(config.db_url, function(err, db) {
    assert.equal(null, err);

    // Get the documents collection
 
    var collection = db.collection('troubleTicket');

    const query = { id: troubleTicketId.toString() }

    // Find one document
    collection.findOne( query, function(err, doc) {
      // delete the mongodb _id attribute from the JSON document
      delete doc["_id"]

      // create _links

      doc._links= {
                self: {
                    href: req.url
                    }
                }

      assert.equal(err, null);

      res.json( doc );
      });
    })
  }
