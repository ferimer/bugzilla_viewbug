#!/usr/bin/env node

var https = require('https');

if (process.argv.length >= 3) {
  queryBug(process.argv[2]);
} else {
  require('child_process').exec('git branch | grep "*" | tail -c 7', function(error, stdout, stderr) {
    queryBug(stdout);
  });
}

function queryBug(bugNumber) {
  console.log('Looking for bug ' + bugNumber);

  req = https.request('https://bugzilla.mozilla.org/rest/bug/' + bugNumber, function(res) {
    var bugData = '';
    res.on('data', function(d) {
      bugData = bugData + d;
    });
    res.on('end', function(d) {
      if (d) {
        bugData = bugData + d;
      }
      try {
        bugData = JSON.parse(bugData);
        showBug(bugData);
      } catch(e) {
        console.log('Error: ' + e);
      }
    });
  });
  req.on('error', function(e) {
    console.log('Error: ' + e);
  });
  req.end();
}

function showBug(bugData) {
  if (process.argv[3] === '-d') {
    console.log(JSON.stringify(bugData.bugs[0],true,' ') + '\n\n');
  }
  console.log('Bug number: ' + bugData.bugs[0].id);
  console.log('Summary: ' + bugData.bugs[0].summary);
  console.log('Status: ' + bugData.bugs[0].status + ' ' + bugData.bugs[0].resolution);
  console.log('Assigned to: ' + bugData.bugs[0].assigned_to);
  console.log('Created on: ' + bugData.bugs[0].creation_time);
  console.log('Changed on: ' + bugData.bugs[0].last_change_time);
}
