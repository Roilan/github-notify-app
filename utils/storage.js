import Bluebird from 'bluebird';
import storage from 'electron-json-storage';

const promisifyStorage = Bluebird.promisifyAll(storage);

export default promisifyStorage;
