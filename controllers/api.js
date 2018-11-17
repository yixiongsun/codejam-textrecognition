const { promisify } = require('util');
const request = require('request');
const cheerio = require('cheerio');
const graph = require('fbgraph');
const { LastFmNode } = require('lastfm');
const tumblr = require('tumblr.js');
const GitHub = require('@octokit/rest');
const Twit = require('twit');
const stripe = require('stripe')(process.env.STRIPE_SKEY);
const Linkedin = require('node-linkedin')(process.env.LINKEDIN_ID, process.env.LINKEDIN_SECRET, process.env.LINKEDIN_CALLBACK_URL);
const paypal = require('paypal-rest-sdk');
const lob = require('lob')(process.env.LOB_KEY);
const ig = require('instagram-node').instagram();
const Python = require('../libraries/pythonshell')
const RequestManager = require('../libraries/requestmanager')




/**
 * GET /api
 * List of API examples.
 */
exports.getApi = (req, res) => {
  res.render('api/index', {
    title: 'API Examples'
  });
};




/**
 * GET /api/upload
 * File Upload API example.
 */

exports.getFileUpload = (req, res) => {
  res.render('api/upload', {
    title: 'File Upload'
  });
};

exports.postFileUpload = (req, res) => {
  let python = new Python(req.file.path, "upload")
  let requestmanager = new RequestManager()
  python.extract(function(finished, frame, image) {
    if (finished) {
      requestmanager.finish()
      return
    }
    requestmanager.add(frame, image, function(finished) {
      if (finished, response) {
        console.log(this.response)

        res.redirect('/api/upload');

      }
    })
  })
};
exports.getRealTime = (req, res) => {
  res.render('api/realtime', {
    title: 'Real Time video'
  });
}

exports.postRealTime = (req, res) => {
  console.log(req)
}
