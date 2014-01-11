var assert = require('assert')
  , es = require('event-stream')
  , StreamQueue = require('../src')
  , Stream = require('stream')
;

// Helpers
function writeToStream(stream, chunks) {
  if(!chunks.length) {
    stream.end();
  } else {
    stream.write(chunks.shift());
    setTimeout(function() {
      writeToStream(stream, chunks);
    }, Math.random()*300);
  }
  return stream;
}

// Tests
describe('StreamQueue', function() {

  describe('in binary mode', function() {

    it('should work', function(done) {
      var queue = new StreamQueue();
      queue.queue(writeToStream(new Stream.PassThrough(), ['wa','dup']));
      queue.queue(writeToStream(new Stream.PassThrough(), ['pl','op']));
      queue.queue(writeToStream(new Stream.PassThrough(), ['ki','koo','lol']));
      queue.pipe(es.wait(function(err, data) {
        assert.equal(err, null);
        assert.equal(data, 'wadupplopkikoolol');
        done();
      }));
      queue.done();
    });

    it('should reemit errors', function(done) {
      var erroredStream = new Stream.PassThrough();
      var gotError = false;
      var queue = new StreamQueue();
      queue.queue(erroredStream);
      queue.queue(writeToStream(new Stream.PassThrough(), ['wa','dup']));
      queue.queue(writeToStream(new Stream.PassThrough(), ['pl','op']));
      queue.queue(writeToStream(new Stream.PassThrough(), ['ki','koo','lol']));
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
