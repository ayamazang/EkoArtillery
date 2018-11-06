'use strict';

module.exports = {
  // generateRandomData,
  // generateDuedate,
  // generateCardData,
  mockCardData,
  mockCardComponentDatas,
  mockCardDueDate,
  mockCardComponentDataAllFiles,
  mockCardComponentDataBulkFiles,
  mockCardComponentDataBulkImages,
  mockCardShareUsers
};

// Make sure to "npm install faker" first.
const Faker = require('faker');
const moment = require('moment');
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');

const FILES = JSON.parse(
  fs.readFileSync(path.join('prerequisite-data', 'local02', 'files.json'), { encoding: 'utf8' })
); // array
const IMAGES = JSON.parse(
  fs.readFileSync(path.join('prerequisite-data', 'local02', 'images.json'), { encoding: 'utf8' })
); // array

const SHARE_USERS = JSON.parse(
  fs.readFileSync(path.join('prerequisite-data', 'local02', 'share-user.json'), { encoding: 'utf8' })
); // array

function mockCardData(context, events, done) {
  const dueDate = Faker.helpers.randomize([
    null,
    null,
    null,
    null,
    null,
    moment().add(-1, 'years').toISOString(),
    moment().add(-1, 'months').toISOString(),
    moment().add(-1, 'days').toISOString(),
    moment().toISOString(),
    moment().add(1, 'days').toISOString(),
    moment().add(1, 'months').toISOString(),
    moment().add(1, 'years').toISOString(),
  ]);
  const status = Faker.helpers.randomize(['Open', 'Closed']);
  const priority = Faker.helpers.randomize([ 0, 0, 0, 0, 0, 0, 0, 1, 2, 3]);
  const isFavorited = Faker.helpers.randomize([true, false]);
  // const componentData = Faker.lorem.sentence(10);

  // console.warn(`${dueDate}\t${status}\t${priority}\t${isFavorited}\t${componentData}`)

  context.vars.isFavorited = isFavorited;
  context.vars.priority = priority;
  context.vars.dueDate = dueDate;
  context.vars.status = status;
  // context.vars.componentData = componentData;
  return done();
}

function mockCardDueDate(context, events, done) {
  const dueDate = Faker.helpers.randomize([
    null,
    null,
    null,
    null,
    null,
    moment().add(-1, 'years').toISOString(),
    moment().add(-1, 'months').toISOString(),
    moment().add(-1, 'days').toISOString(),
    moment().toISOString(),
    moment().add(1, 'days').toISOString(),
    moment().add(1, 'months').toISOString(),
    moment().add(1, 'years').toISOString(),
  ]);

  context.vars.dueDate = dueDate;
  return done();
}

function mockCardComponentDatas(context, events, done) {
  const imageComponents = _generateComponentDataImages(2, IMAGES);
  const fileComponents = _generateComponentDataFiles(2, FILES);
  const shortTextComponents = _generateComponentDataTexts(1, { includeHashtag: true, type: 'sentence' });
  const longTextComponents = _generateComponentDataTexts(1, { includeHashtag: true, type: 'paragraph' });
  const components = _.concat(shortTextComponents, imageComponents, fileComponents, longTextComponents)
  context.vars.components = _.shuffle(components);
  return done();
}

function mockCardComponentDataAllFiles(context, events, done) {
  const num = FILES.length;
  const titleComponent = [{
    type: 'text',
    data: {
      value: `Case all files ${num} type.`,
    }
  }];
  const components = _generateComponentDataFiles(num, FILES);
  context.vars.components = _.concat(titleComponent, components);
  return done();
}

function mockCardComponentDataBulkFiles(context, events, done) {
  const num = 100;
  const titleComponent = [{
    type: 'text',
    data: {
      value: `Case ${num} files.`,
    }
  }];
  const components = _generateComponentDataFiles(num, FILES);
  context.vars.components = _.concat(titleComponent, components);
  return done();
}

function mockCardComponentDataBulkImages(context, events, done) {
  const num = 100;
  const titleComponent = [{
    type: 'text',
    data: {
      value: `Case ${num} images.`,
    }
  }];
  const components = _generateComponentDataImages(num, IMAGES);
  context.vars.components = _.concat(titleComponent, components);
  return done();
}

function mockCardShareUsers(context, events, done) {
  const maxShareUser = SHARE_USERS.length;
  const copySharedUsers = _.cloneDeep(SHARE_USERS);
  const selectedShareUsers = _.slice(copySharedUsers, _.random(1, maxShareUser));

  const sharedUserIds = selectedShareUsers.map(u => u._id);
  sharedUserIds.push(copySharedUsers[0]._id);
  context.vars.sharedUserIds = sharedUserIds;
  return done();
}

// function generateCardComponentData(context, events, done) {
//   const componentData = Faker.lorem.sentence(10);
//   context.vars.componentData = componentData;
//   return done();
// }

// function generateRandomData(userContext, events, done) {
//   // generate data with Faker:
//   const name = `${Faker.name.firstName()} ${Faker.name.lastName()}`;
//   const email = Faker.internet.exampleEmail();
//   const password = Faker.internet.password();
//   // add variables to virtual user's context:
//   userContext.vars.name = name;
//   userContext.vars.email = email;
//   userContext.vars.password = password;
//   // continue with executing the scenario:
//   return done();
// }

function _generateComponentDataTexts(num, options = { includeHashtag: false, type: 'sentence' }) {
  let result = [];
  let hashtags = '';
  let value = '';
  for (let i = 0; i < num; i++) {
    switch (options.type) {
      case 'sentence':
        value = Faker.lorem.sentence(10);
        break;
      case 'paragraph':
        value = Faker.lorem.paragraph(1);
        break;
      default:
        value = Faker.lorem.sentence(10);
    }
    if (options.includeHashtag) {
      hashtags = Faker.lorem.words(5);
      hashtags = ` #${_.chain(hashtags).split(' ').join(' #').value()}`;
    }
    result.push({
      type: 'text',
      data: {
        value: `${value}${hashtags}`,
      }
    });
  }
  return result;
}

function _generateComponentDataImages(num, images) {
  let result = [];
  for (let i = 0; i < num; i++) {
    const { key, meta } = Faker.helpers.randomize(images);
    result.push({
      type: 'picture',
      data: {
        value: key,
        meta: meta
      }
    });
  }
  return result;
}

function _generateComponentDataFiles(num, files) {
  let result = [];
  for (let i = 0; i < num; i++) {
    const file = files.length > i ? files[i] : Faker.helpers.randomize(files);
    const { key, meta } = file;
    result.push({
      type: 'file',
      data: {
        value: key,
        meta: meta
      }
    });
  }
  return result;
}
