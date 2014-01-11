# StreamQueue [![NPM version](https://badge.fury.io/js/StreamQueue.png)](https://npmjs.org/package/StreamQueue) [![Build Status](https://travis-ci.org/nfroidure/StreamQueue.png?branch=master)](https://travis-ci.org/nfroidure/StreamQueue)

StreamQueue pipe the queued streams one by one in order to preserve their content
 order.

## Usage
Install the [npm module](https://npmjs.org/package/StreamQueue):
```sh
npm install StreamQueue --save
```
Then, in your scripts:
```js
var StreamQueue = require('StreamQueue');

var queue = new StreamQueue();
queue.queue(
  Fs.createReadStream('input.txt'),
  Fs.createReadStream('input2.txt'),
  Fs.createReadStream('input3.txt')
);
queue.end();

queue.pipe(process.stdout);
```
You can also chain QueueStream methods like that:
```js
var StreamQueue = require('StreamQueue');

new StreamQueue()
  .queue(Fs.createReadStream('input.txt'))
  .queue(Fs.createReadStream('input2.txt'))
  .queue(Fs.createReadStream('input3.txt'))
  .end()
  .pipe(process.stdout);
```

## Contributing
Feel free to pull your code if you agree with publishing it under the MIT license.

