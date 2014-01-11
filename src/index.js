var Stream = require('stream');
var util = require('util');

// Inherit of Readable stream
util.inherits(StreamQueue, Stream.PassThrough);

// Constructor
function StreamQueue(options) {

  // Ensure new were used
  if (!(this instanceof StreamQueue)) {
    throw Error('Please use the "new" operator to instanciate a StreamQueue.');
  }

  // Parent constructor
  Stream.PassThrough.call(this, options);

  // Prepare streams queue
  this._streams = [];
  this._running = false;
  this._ending = false;
}

// Queue each stream given in argument
StreamQueue.prototype.queue = function() {
  var streams = [].slice.call(arguments,0);

  this._streams = this._streams.length ? this._streams.concat(streams) : streams;

  if(!this._running) {
    this._running = true;
    this._pipeNextStream();
  }

  return this;

};

// Pipe the next available stream
StreamQueue.prototype._pipeNextStream = function() {
  if(!this._streams.length) {
    if(this._ending) {
        Stream.PassThrough.prototype.end.call(this);
    } else {
      this._running = false;
    }
    return;
  }
  var stream = this._streams.shift();
  stream.on('end', this._pipeNextStream.bind(this));
  stream.pipe(this, {end: false});
};

// Queue each stream given in argument
StreamQueue.prototype.end = function() {
  this._ending = true;
  if(!this._running) {
    Stream.PassThrough.prototype.end.call(this);
  }
  return this;
}

// Length 
Object.defineProperty(StreamQueue.prototype, 'length', {
  get: function() {
    return this._streams.length;
  }
});

module.exports = StreamQueue;
