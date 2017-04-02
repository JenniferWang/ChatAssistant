/*
 * @flow
 */

'use strict';

const co = require('co');
const MongoClient = require('mongodb').MongoClient;

const { MONGODB_HOST } = require('./Config');
const NOTE = 'note';

export type ID = number;
export type Note = {
  key: string,
  content: string,
  tags: Array<string>,
};
export type NoteDoc = Note & {
  _id: ID,
  timeStamp: number,
};

function writeNote(key: string, note: string, tags: Array<string>): Promise<void> {
  return co.wrap(function* () {
    try {
      const db = yield MongoClient.connect(MONGODB_HOST);
      const r = yield db.collection(NOTE).insertOne({
        content: note,
        key,
        tags,
        timeStamp: Date.now(),
      });
      db.close();
    } catch (e) {
      yield Promise.reject(e);
    }
  })();
}

// TODO: find a way to distinguish different groups
function searchNoteByTag(key: string, tag: string): Promise<Array<NoteDoc>> {
  return co.wrap(function* () {
    try {
      const db = yield MongoClient.connect(MONGODB_HOST);
      const docs = yield db.collection(NOTE)
        .find({tags: tag, key: key})
        .sort({timeStamp: 1})
        .toArray();
      db.close();
      return yield Promise.resolve(docs);
    } catch (e) {
      return yield Promise.reject(e);
    }
  })();
}

function findAllTags(key: string): Promise<Iterator<string>> {
  return co.wrap(function* () {
    try {
      const db = yield MongoClient.connect(MONGODB_HOST);
      const tagsCollection = new Set();
      const cursor = db.collection(NOTE).find({key: key}, {_id: 0, tags: 1});
      while (yield cursor.hasNext()) {
        const doc = yield cursor.next();
        doc.tags.map(tag => tagsCollection.add(tag));
      }
      db.close();
      return yield Promise.resolve(tagsCollection.values());
    } catch (e) {
      return yield Promise.reject(e);
    }
  })();
}

// TODO: schedule cleaning for notes without tags;
function clearTag(key:string, tag: string): Promise<void> {
  return co.wrap(function* () {
    try {
      const db = yield MongoClient.connect(MONGODB_HOST);
      yield db.collection(NOTE).update(
        {key: key, tags: tag},
        {$pull: {tags: tag}},
        {multi: true}
      );
      db.close();
    } catch (e) {
      return yield Promise.reject(e);
    }
  })();
}

module.exports = {
  clearTag,
  findAllTags,
  searchNoteByTag,
  writeNote,
};
