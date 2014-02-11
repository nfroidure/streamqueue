var assert = require('assert')
  , es = require('event-stream')
  , StreamQueue = require('../src')
  , Stream = require('stream')
;

// Helpers
function writeToStreamSync(stream, chunks) {
  if(!chunks.length) {
    stream.end();
  } else {
    stream.write(chunks.shift());
    writeToStreamSync(stream, chunks);
  }
  return stream;
}
function writeToStream(stream, chunks) {
  if(!chunks.length) {
    stream.end();
  } else {
    setImmediate(function() {
      stream.write(chunks.shift());
      writeToStream(stream, chunks);
    });
  }
  return stream;
}
function readableStream(chunks) {
  var stream = new Stream.Readable();
  stream._read = function() {
    if(chunks.length) {
      setImmediate(function() {
        stream.push(chunks.shift());
        if(!chunks.length) {
          stream.push(null);
        }
      });
    }
  }
  stream.resume();
  return stream;
}

// Tests
describe('StreamQueue', function() {

  describe('in binary mode', function() {

    describe('and with async streams', function() {

      it('should work with functionnal API', function(done) {
        StreamQueue(
          writeToStream(new Stream.PassThrough(), ['wa','dup']),
          writeToStream(new Stream.PassThrough(), ['pl','op']),
          writeToStream(new Stream.PassThrough(), ['ki','koo','lol'])
        ).pipe(es.wait(function(err, data) {
          assert.equal(err, null);
          assert.equal(data, 'wadupplopkikoolol');
          done();
        }));
      });

      it('should work with functionnal API and options', function(done) {
        var stream1 = new Stream.PassThrough()
          , stream2 = new Stream.PassThrough()
          , stream3 = new Stream.PassThrough()
        ;
        StreamQueue({pause: true},
          writeToStream(stream1, ['wa','dup']),
          writeToStream(stream2, ['pl','op']),
          writeToStream(stream3, ['ki','koo','lol'])
        ).pipe(es.wait(function(err, data) {
          assert.equal(err, null);
          assert.equal(data, 'wadupplopkikoolol');
          done();
        }));
      });

      it('should work with POO API', function(done) {
        var queue = new StreamQueue();
        queue.queue(writeToStream(new Stream.PassThrough(), ['wa','dup']));
        queue.queue(writeToStream(new Stream.PassThrough(), ['pl','op']));
        queue.queue(writeToStream(new Stream.PassThrough(), ['ki','koo','lol']));
        assert.equal(queue.length, 3);
        queue.pipe(es.wait(function(err, data) {
          assert.equal(err, null);
          assert.equal(data, 'wadupplopkikoolol');
          done();
        }));
        queue.done();
      });

      it('should pause streams in flowing mode', function(done) {
        var queue = new StreamQueue({
          pauseFlowingStream: true,
          resumeFlowingStream: true
        });
        queue.queue(readableStream(['wa','dup']));
        queue.queue(writeToStream(new Stream.PassThrough(), ['pl','op']));
        queue.queue(writeToStream(new Stream.PassThrough(), ['ki','koo','lol']));
        assert.equal(queue.length, 3);
        queue.pipe(es.wait(function(err, data) {
          assert.equal(err, null);
          assert.equal(data, 'wadupplopkikoolol');
          done();
        }));
        queue.done();
      });

      it('should work with POO API and options', function(done) {
        var queue = new StreamQueue({
          pauseFlowingStream: true,
          resumeFlowingStream: true
        })
          , stream1 = new Stream.PassThrough()
          , stream2 = new Stream.PassThrough()
          , stream3 = new Stream.PassThrough()
        ;
        queue.queue(writeToStream(stream1, ['wa','dup']));
        queue.queue(writeToStream(stream2, ['pl','op']));
        queue.queue(writeToStream(stream3, ['ki','koo','lol']));
        assert.equal(queue.length, 3);
        queue.pipe(es.wait(function(err, data) {
          assert.equal(err, null);
          assert.equal(data, 'wadupplopkikoolol');
          done();
        }));
        queue.done();
      });

      it('should work with POO API and a late done call', function(done) {
        var queue = new StreamQueue()
          , stream1 = new Stream.PassThrough()
          , stream2 = new Stream.PassThrough()
          , stream3 = new Stream.PassThrough()
        ;
        queue.queue(writeToStream(stream1, ['wa','dup']));
        queue.queue(writeToStream(stream2, ['pl','op']));
        queue.queue(writeToStream(stream3, ['ki','koo','lol']));
        assert.equal(queue.length, 3);
        queue.pipe(es.wait(function(err, data) {
          assert.equal(err, null);
          assert.equal(data, 'wadupplopkikoolol');
          done();
        }));
        setTimeout(function() {
          queue.done();
        }, 100);
      });

      it('should reemit errors', function(done) {
        this.timeout(5000); // Try to fix node 0.11
        var erroredStream = new Stream.PassThrough();
        var gotError = false;
        var queue = new StreamQueue();
        queue.queue(erroredStream);
        queue.queue(writeToStream(new Stream.PassThrough(), ['wa','dup']));
        queue.queue(writeToStream(new Stream.PassThrough(), ['pl','op']));
        queue.queue(writeToStream(new Stream.PassThrough(), ['ki','koo','lol']));
        assert.equal(queue.length, 4);
        queue.on('error', function(err) {
          gotError = true;
        });
        queue.pipe(es.wait(function(err, data) {
          assert(gotError);
          assert.equal(err, null);
          assert.equal(data, 'wadupplopkikoolol');
          done();
        }));
        queue.done();
        process.nextTick(function() {
          erroredStream.emit('error', new Error('Aouch !'));
          erroredStream.end();
        });
      });

    });

    describe('and with sync streams', function() {

      it('should work with functionnal API', function(done) {
        StreamQueue(
          writeToStreamSync(new Stream.PassThrough(), ['wa','dup']),
          writeToStreamSync(new Stream.PassThrough(), ['pl','op']),
          writeToStreamSync(new Stream.PassThrough(), ['ki','koo','lol'])
        ).pipe(es.wait(function(err, data) {
          assert.equal(err, null);
          assert.equal(data, 'wadupplopkikoolol');
          done();
        }));
      });

      it('should work with POO API', function(done) {
        var queue = new StreamQueue();
        queue.queue(writeToStreamSync(new Stream.PassThrough(), ['wa','dup']));
        queue.queue(writeToStreamSync(new Stream.PassThrough(), ['pl','op']));
        queue.queue(writeToStreamSync(new Stream.PassThrough(), ['ki','koo','lol']));
        assert.equal(queue.length, 3);
        queue.pipe(es.wait(function(err, data) {
          assert.equal(err, null);
          assert.equal(data, 'wadupplopkikoolol');
          done();
        }));
        queue.done();
      });

      it('should emit an error when calling done twice', function(done) {
        var queue = new StreamQueue();
        queue.queue(writeToStreamSync(new Stream.PassThrough(), ['wa','dup']));
        queue.queue(writeToStreamSync(new Stream.PassThrough(), ['pl','op']));
        queue.queue(writeToStreamSync(new Stream.PassThrough(), ['ki','koo','lol']));
        assert.equal(queue.length, 3);
        queue.pipe(es.wait(function(err, data) {
          assert.equal(err, null);
          assert.equal(data, 'wadupplopkikoolol');
          done();
        }));
        queue.done();
        assert.throws(function() {
          queue.done();
        });
      });

      it('should emit an error when queueing after done was called', function(done) {
        var queue = new StreamQueue();
        queue.queue(writeToStreamSync(new Stream.PassThrough(), ['wa','dup']));
        queue.queue(writeToStreamSync(new Stream.PassThrough(), ['pl','op']));
        queue.queue(writeToStreamSync(new Stream.PassThrough(), ['ki','koo','lol']));
        assert.equal(queue.length, 3);
        queue.pipe(es.wait(function(err, data) {
          assert.equal(err, null);
          assert.equal(data, 'wadupplopkikoolol');
          done();
        }));
        queue.done();
        assert.throws(function() {
          queue.queue(new Stream.PassThrough());
        });
      });

      it('should reemit errors', function(done) {
        this.timeout(5000); // Try to fix node 0.11
        var erroredStream = new Stream.PassThrough();
        var gotError = false;
        var queue = new StreamQueue();
        queue.queue(erroredStream);
        queue.queue(writeToStreamSync(new Stream.PassThrough(), ['wa','dup']));
        queue.queue(writeToStreamSync(new Stream.PassThrough(), ['pl','op']));
        queue.queue(writeToStreamSync(new Stream.PassThrough(), ['ki','koo','lol']));
        assert.equal(queue.length, 4);
        queue.on('error', function(err) {
          gotError = true;
          assert.equal(err.message, 'Aouch!');
        });
        queue.pipe(es.wait(function(err, data) {
          assert(gotError);
          assert.equal(err, null);
          assert.equal(data, 'wadupplopkikoolol');
          done();
        }));
        queue.done();
        setImmediate(function() {
          erroredStream.emit('error', new Error('Aouch!'));
          erroredStream.end();
        });
      });

    });

  });

  describe('in object mode', function() {

    var objs = [];
    it('should work', function(done) {
      var queue = new StreamQueue({objectMode: true});
      queue.queue(writeToStream(new Stream.PassThrough({objectMode: true}), [{s:'wa'},{s:'dup'}]));
      queue.queue(writeToStream(new Stream.PassThrough({objectMode: true}), [{s:'pl'},{s:'op'}]));
      queue.queue(writeToStream(new Stream.PassThrough({objectMode: true}), [{s:'ki'},{s:'koo'},{s:'lol'}]));
      queue.on('data', objs.push.bind(objs));
      queue.pipe(es.wait(function(err, data) {
        assert.equal(err, null);
        assert.deepEqual(objs, [{s:'wa'},{s:'dup'},{s:'pl'},{s:'op'},{s:'ki'},{s:'koo'},{s:'lol'}]);
        done();
      }));
      queue.done();
    });

  });

});
