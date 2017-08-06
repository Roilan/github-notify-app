import storage from 'electron-json-storage';

const promisify = (func) => new Promise((resolve, reject) => {
  func((error, data) => (
    error ? reject(error) : resolve(data)
  ))
});

const get = key => promisify(storage.get.bind(null, key))
const getAll = () => promisify(storage.getAll);
const set = (key, json) => promisify(storage.set.bind(null, key, json));

export default {
  get,
  getAll,
  set
}
