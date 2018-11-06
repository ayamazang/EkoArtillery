'use strict';

// module.exports = {
//   generateRandomData
// };


const co = require('co');
const _ = require('lodash');
const Promise = require('bluebird');
const rq = require('request-promise');
const fs = require('fs-extra');
const path = require('path');
// Make sure to "npm install faker" first.
const Faker = require('faker');
const mime = require('mime-types');

const uploadFiles = co.wrap(function* (dir, url, destinationFolder) {
  const EXTENSIONS = {
    'default': ['*'],
    'error': ['error'],
    'doc': ['doc', 'docx'],
    'pdf': ['pdf'],
    'ppt': ['ppt', 'pptx'],
    'xls': ['xls', 'xlsx'],
    'html': ['htm', 'html'],
    'zip': ['zip', 'rar', 'tar'],
    'mp3': ['mp3'],
    'image': ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'svg'],
  };
  const files = yield cb => fs.readdir(dir, cb);
  const data = [];
  for (let index in files) {
    const file = files[index];
    console.log(`Uploading file => ${file}`);

    const ext = path.extname(file).replace(/^\./, '');
    const filename = path.basename(file, `.${ext}`).toLowerCase();

    const result = yield rq({
      method: 'POST',
      // uri: `http://localhost:5000/api/v1/auth/login`,
      // uri: `${Config.httpURL}/file/upload-file`,
      uri: `${url}`,
      formData: {
        file: {
          value: fs.createReadStream(path.join(dir, file)),
          options: {
            filename: path.basename(file),
          }
        },
        original: 'true'
      }
    });

    const key = JSON.parse(result).key;
    const extensions = EXTENSIONS[filename] || [ext];
    const mimetype = mime.lookup(path.join(dir, file));
    const size = fs.statSync(path.join(dir, file)).size

    // data[ext] =  { key, meta: { filename: file, size, mimetype } };
    data.push({ key, meta: { filename, size, mimetype } });
    // data.push({ key, filename, extensions, fullname: file, size: file.size, mimetype: file.mimetype });
  }
  if (!fs.existsSync(destinationFolder)) fs.mkdirSync(destinationFolder);
  fs.writeFileSync(path.join(destinationFolder, 'files.json'),JSON.stringify(data));

  return data;
});

const uploadImages = co.wrap(function* (dir, url, destinationFolder) {
  const files = yield cb => fs.readdir(dir, cb);
  const data = [];
  for (let index in files) {
    const file = files[index];
    console.log(`Uploading image => ${file}`);

    const ext = path.extname(file).replace(/^\./, '');
    const filename = path.basename(file, `.${ext}`).toLowerCase();

    const result = yield rq({
      method: 'POST',
      uri: `${url}`,
      formData: {
        file: {
          value: fs.createReadStream(path.join(dir, file)),
          options: {
            filename: path.basename(file),
          }
        },
        original: 'true'
      }
    });

    const key = JSON.parse(result).key;
    const mimetype = mime.lookup(path.join(dir, file));
    const size = fs.statSync(path.join(dir, file)).size

    // data[ext] =  { key, meta: { filename: file, size, mimetype } };
    data.push({ key, meta: { filename, size, mimetype } });
    // data.push({ key, filename, extensions, fullname: file, size: file.size, mimetype: file.mimetype });
  }
  if (!fs.existsSync(destinationFolder)) fs.mkdirSync(destinationFolder);
  fs.writeFileSync(path.join(destinationFolder, 'images.json'),JSON.stringify(data));

  return data;
});

const getEkoRPCToken = co.wrap(function* (httpURL, user) {
  user = {
    apiVersion: 0,
    appId: 'com.ekoaaapp.eko',
    deviceId: 'webapp2x0d724ffc9-6c91-48c4-934e-660c41d493db1525756917094',
    deviceModel: 'browser',
    deviceType: 'web',
    deviceVersion: '9.4.0',
    domain: '',
    username: user.username,
    password: user.password,
  }

  const options = {
    url: `${httpURL}/api/v1/auth/login`,
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(user)
  }

  const result = yield rq(options);
  return JSON.parse(result);

  // return new Promise((resolve, reject) => {
  //   request(options, (err, response, body) => {
  //     const bodyJson = JSON.parse(body)
  //     if (err) return reject(err)
  //     return resolve(bodyJson.accessToken)
  //   })
  // })
});


// Main
co(function * () {
  const destinationFolder = path.join(`prerequisite-data`, `local02`);
  // const httpURL = 'http://localhost:5000';
  const httpURL = 'http://h1.eko02.local';
  const { accessToken } = yield getEkoRPCToken(httpURL, { username: 'mockdata001', password: 'password'})
  // const { accessToken } = JSON.parse(result);
  const dirFiles = `./files_example`;
  const sourceFiles = `${httpURL}/file/upload-file?token=${accessToken}`;
  const files = yield uploadFiles(dirFiles, sourceFiles, destinationFolder);
  // console.log('files', files)

  const dirImages = `./images_example`;
  const sourceImages = `${httpURL}/file/upload-image?token=${accessToken}`;
  const images = yield uploadImages(dirImages, sourceImages, destinationFolder);
  // console.log('images', images)
  // process.exit(0);
})
.catch(error => {
  console.log(error)
  process.exit(0)
});