var assert = require('assert')
  , es = require('event-stream')
  , StreamQueue = require('../src')
  , Stream = require('stream')
;

// Helpers
function writeToStream(stream, strings) {
  if(1 === arguments.length) {
    stream.end();
  } else {
    stream.write(strings.shift());
  }
  setTimeout(function() {
    writeToStream(stream, strings);
  }, Math.random()*1000);
}

// Tests
describe('StreamQueue', function() {

  describe('in binary mode', function() {

    it('should work', function() {
      var queue = new StreamQueue();
      queue.queue(new Stream.PassThrough(), ['wa','dup']);
      queue.queue(new Stream.PassThrough(), ['pl','op']);
      queue.queue(new Stream.PassThrough(), ['ki','koo','lol']);
      queue.pipe(es.wait(function(err, data) {
        assert.equal(err, null);
        assert.equal(data, 'wadupplopkikoolol');
        done();
      }));
      queue.end();
    });

  });

  describe('in object mode', function() {

    it('should work with no args', function() {
      var queue = new StreamQueue();
      queue.queue(new Stream.PassThrough(), [{s:'wa'},{s:'dup'}]);
      queue.queue(new Stream.PassThrough(), [{s:'pl'},{s:'op'}]);
      queue.queue(new Stream.PassThrough(), [{s:'ki'},{s:'koo'},{s:'lol'}]);
      queue.pipe(es.wait(function(err, data) {
        assert.equal(err, null);
        assert.deepEqual(data, [{s:'wa'},{s:'dup'},{s:'pl'},{s:'op'},{s:'ki'},{s:'koo'},{s:'lol'}]);
        done();
      }));
      queue.end();
    });

  });

});
