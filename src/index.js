var Stream = require('readable-stream')
  , isStream = require('isstream')
  , util = require('util')
;

// Inherit of PassThrough stream
util.inherits(StreamQueue, Stream.PassThrough);

// Constructor
function StreamQueue(options) {

  options = options || {};

  // Ensure new were used
  if (!(this instanceof StreamQueue)) {
    return new (StreamQueue.bind.apply(StreamQueue,
      [StreamQueue].concat([].slice.call(arguments,0))));
  }

  // Set queue state object
  this._queueState = {
    _pauseFlowingStream: true,
    _resumeFlowingStream: true,
    _objectMode: false,
    _streams: [],
    _running: false,
    _ending: false
  };

  // Options
  if(!(isStream(options) || 'function' === typeof options)) {
    if('boolean' == typeof options.pauseFlowingStream) {
      this._queueState._pauseFlowingStream = options.pauseFlowingStream;
      delete options.pauseFlowingStream;
    }
    if('boolean' == typeof options.resumeFlowingStream) {
      this._queueState._resumeFlowingStream = options.resumeFlowingStream;
      delete options.resumeFlowingStream;
    }
    if('boolean' == typeof options.objectMode) {
      this._queueState._objectMode = options.objectMode;
    }
  }

  // Parent constructor
  Stream.PassThrough.call(this,
    isStream(options)  || 'function' === typeof options
      ? undefined
      : options
  );

  // Queue given streams and ends
  if(arguments.length > 1 || isStream(options)
    || 'function' === typeof options) {
    this.done.apply(this,
      [].slice.call(arguments,
        isStream(options) || 'function' === typeof options ? 0 : 1));
  }

}

// Queue each stream given in argument
StreamQueue.prototype.queue = function() {
  var streams = [].slice.call(arguments, 0)
    , _self = this;

  if(this._queueState._ending) {
    throw new Error('Cannot add more streams to the queue.');
  }

  streams = streams.map(function(stream) {
    function wrapper(stream) {
      stream.on('error', function(err) {
        _self.emit('error', err);
      });
      if('undefined' == typeof stream._readableState) {
        stream = (new Stream.Readable({objectMode: _self._queueState._objectMode}))
          .wrap(stream);
      }
      if(_self._queueState._pauseFlowingStream&&stream._readableState.flowing) {
        stream.pause();
      }
      if(_self._queueState._resumeFlowingStream&&stream._readableState.flowing) {
        stream.resume();
      }
      return stream;
    }
    if('function' === typeof stream) {
      return function() {
        return wrapper(stream());
      };
    }
    return wrapper(stream);
  });

  this._queueState._streams = this._queueState._streams.length ?
    this._queueState._streams.concat(streams) : streams;

  if(!this._queueState._running) {
    this._pipeNextStream();
  }

  return this;

};

// Pipe the next available stream
StreamQueue.prototype._pipeNextStream = function() {
  var stream;
  var _self = this;
  if(!this._queueState._streams.length) {
    if(this._queueState._ending) {
      setImmediate(function() {
        _self.end();
      });
    } else {
      this._queueState._running = false;
    }
    return;
  }
  this._queueState._running = true;
  stream = this._queueState._streams.shift();
  if('function' === typeof stream) {
    stream = stream();
  }
  stream.once('end', function() {
    _self.unpipe(stream);
    _self._pipeNextStream();
  });
  stream.pipe(this, {end: false});
};

// Queue each stream given in argument
StreamQueue.prototype.done = function() {
  var _self = this;
  if(this._queueState._ending) {
    throw new Error('streamqueue: The queue is already ending.');
  }
  if(arguments.length) {
    this.queue.apply(this, arguments);
  }
  this._queueState._ending = true;
  if(!this._queueState._running) {
    setImmediate(function() {
      _self.end();
    });
  }
  return this;
};

// Length
Object.defineProperty(StreamQueue.prototype, 'length', {
  get: function() {
    return this._queueState._streams.length + (this._queueState._running ? 1 : 0);
  }
});

module.exports = StreamQueue;

