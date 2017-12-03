'use strict';

const Stream = require('readable-stream');
const isStream = require('isstream');
const util = require('util');

// Inherit of Readable stream
util.inherits(StreamQueue, Stream.Readable);

// Constructor
function StreamQueue(options) {
  const _this = this;

  options = options || {};

  // Ensure new were used
  if (!(_this instanceof StreamQueue)) {
    return new (StreamQueue.bind.apply(
      StreamQueue, // eslint-disable-line
      [StreamQueue].concat([].slice.call(arguments, 0))
    ))();
  }

  // Set queue state object
  _this._queueState = {
    _pauseFlowingStream: true,
    _resumeFlowingStream: true,
    _objectMode: false,
    _streams: [],
    _running: false,
    _ending: false,
    _awaitDrain: null,
    _internalStream: null,
    _curStream: null,
  };

  // Options
  if (!(isStream(options) || 'function' === typeof options)) {
    if ('boolean' == typeof options.pauseFlowingStream) {
      _this._queueState._pauseFlowingStream = options.pauseFlowingStream;
      delete options.pauseFlowingStream;
    }
    if ('boolean' == typeof options.resumeFlowingStream) {
      _this._queueState._resumeFlowingStream = options.resumeFlowingStream;
      delete options.resumeFlowingStream;
    }
    if ('boolean' == typeof options.objectMode) {
      _this._queueState._objectMode = options.objectMode;
    }
  }

  // Prepare the stream to pipe in
  this._queueState._internalStream = new Stream.Writable(
    isStream(options) || 'function' === typeof options ? {}.undef : options
  );
  this._queueState._internalStream._write = (chunk, encoding, cb) => {
    if (_this.push(chunk)) {
      cb();
      return true;
    }
    _this._queueState._awaitDrain = cb;
    return false;
  };

  // Parent constructor
  Stream.Readable.call(
    this,
    isStream(options) || 'function' === typeof options ? {}.undef : options
  );

  // Queue given streams and ends
  if (
    1 < arguments.length ||
    isStream(options) ||
    'function' === typeof options
  ) {
    _this.done.apply(
      this,
      [].slice.call(
        arguments,
        isStream(options) || 'function' === typeof options ? 0 : 1
      )
    );
  }
}

// Queue each stream given in argument
StreamQueue.prototype.queue = function sqQueue() {
  let streams = [].slice.call(arguments, 0);
  const _this = this;

  if (_this._queueState._ending) {
    throw new Error('Cannot add more streams to the queue.');
  }

  streams = streams.map(stream => {
    function wrapper(stream) {
      stream.on('error', err => {
        _this.emit('error', err);
      });
      if ('undefined' == typeof stream._readableState) {
        stream = new Stream.Readable({
          objectMode: _this._queueState._objectMode,
        }).wrap(stream);
      }
      if (
        _this._queueState._pauseFlowingStream &&
        stream._readableState.flowing
      ) {
        stream.pause();
      }
      return stream;
    }
    if ('function' === typeof stream) {
      return () => wrapper(stream());
    }
    return wrapper(stream);
  });

  _this._queueState._streams = _this._queueState._streams.length
    ? _this._queueState._streams.concat(streams)
    : streams;

  if (!_this._queueState._running) {
    _this._pipeNextStream();
  }

  return _this;
};

// Pipe the next available stream
StreamQueue.prototype._read = function sqRead() {
  if (this._queueState._awaitDrain) {
    this._queueState._awaitDrain();
    this._queueState._awaitDrain = null;
    this._queueState._internalStream.emit('drain');
  }
};

// Pipe the next available stream
StreamQueue.prototype._pipeNextStream = function _sqPipe() {
  const _this = this;

  if (!_this._queueState._streams.length) {
    if (_this._queueState._ending) {
      _this.push(null);
    } else {
      _this._queueState._running = false;
    }
    return;
  }
  _this._queueState._running = true;
  if ('function' === typeof _this._queueState._streams[0]) {
    _this._queueState._curStream = _this._queueState._streams.shift()();
  } else {
    _this._queueState._curStream = _this._queueState._streams.shift();
  }
  _this._queueState._curStream.once('end', () => {
    _this._pipeNextStream();
  });
  if (
    _this._queueState._resumeFlowingStream &&
    _this._queueState._curStream._readableState.flowing
  ) {
    _this._queueState._curStream.resume();
  }
  _this._queueState._curStream.pipe(_this._queueState._internalStream, {
    end: false,
  });
};

// Queue each stream given in argument
StreamQueue.prototype.done = function sqDone() {
  const _this = this;

  if (_this._queueState._ending) {
    throw new Error('streamqueue: The queue is already ending.');
  }
  if (arguments.length) {
    _this.queue.apply(_this, arguments);
  }
  _this._queueState._ending = true;
  if (!_this._queueState._running) {
    _this.push(null);
  }
  return this;
};

// Length
Object.defineProperty(StreamQueue.prototype, 'length', {
  get() {
    return (
      this._queueState._streams.length + (this._queueState._running ? 1 : 0)
    );
  },
});

StreamQueue.obj = function streamQueueObj(options) {
  const firstArgumentIsAStream = !options || isStream(options);
  const streams = [].slice.call(arguments, firstArgumentIsAStream ? 0 : 1);

  options = firstArgumentIsAStream ? {} : options;
  options.objectMode = true;
  return StreamQueue.apply({}.undef, [options].concat(streams));
};

module.exports = StreamQueue;
