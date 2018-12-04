const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
    counter.getNextUniqueId((error, counterString) => {
      var id = counterString;
      items[id] = text;
      var dest = path.join(exports.dataDir, id+'.txt');
      fs.writeFile(dest, text, (err) => {
        if (err) {
          console.log('error');
        } else {
          callback(null, { id, text });
        }
    });
  });
};

exports.readAll = (callback) => {
  var arr = [];
  fs.readdir(exports.dataDir, (err, files) => {
    _.each(files, (file) => {
      var name = file.toString().slice(0,5);
      var obj = {"id": name, "text": name};
      arr.push(obj);
    });
    callback(null, arr);   
  });
};


exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
