const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const Promise = require('bluebird');
const counter = require('./counter');
var rd = Promise.promisify(fs.readdir);
var rf = Promise.promisify(fs.readFile);

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
  
  return rd(exports.dataDir)
    .then((files) => {
      _.each(files, (file) => {
        arr.push(rf(path.join(exports.dataDir, file),'utf8')
          .then((content) => {
            var obj = {};
            obj.id = file.slice(0,5);
            obj.text = content;
            return obj;
          }));
      });
      return Promise.all(arr);
    }).then((values) => {
      callback(null, values);
    });   
}
      

  
  
// read dir => db.fs.readdir(exports.dataDir)
  // return files
// itterate over files => _.each
  // read indiv files => cb.fs.readfile() 
  // while reading, put body content into obj.text and put name into obj.id
    // push obj into array
// invoke callback on array 

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, id+'.txt'), (err, content) => {
    if (err) {
      callback(err);
    } else {
      content = content.toString('utf8');
      callback(null, { id, text: content});
    }
  });
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  this.readAll((err, files) => {
    for (var i = 0; i < files.length; i++) {
      if (files[i].id === id) {
        fs.writeFile(path.join(exports.dataDir, id+'.txt'), text, (err) => {
          callback(null, { id, text });
        });  
      } else {
        callback(new Error(`No item with id: ${id}`));
      }
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, id+'.txt'), (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
