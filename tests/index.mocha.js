/* eslint max-nested-callbacks: 0 */

'use strict';

const assert = require('assert');
const StreamTest = require('streamtest');
const StreamQueue = require('../src');

// Tests
describe('StreamQueue', () => {
  // Iterating through versions
  StreamTest.versions.forEach(version => {
    describe('for ' + version + ' streams', () => {
      describe('in binary mode', () => {
        describe('and with async streams', () => {
          it('should work with functionnal API', done => {
            const createStreamQueue = StreamQueue;

            createStreamQueue(
              StreamTest[version].fromChunks(['wa', 'dup']),
              StreamTest[version].fromChunks(['pl', 'op']),
              StreamTest[version].fromChunks(['ki', 'koo', 'lol'])
            ).pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'wadupplopkikoolol');
                done();
              })
            );
          });

          it('should work with functionnal API and options', done => {
            const createStreamQueue = StreamQueue;

            createStreamQueue(
              {},
              StreamTest[version].fromChunks(['wa', 'dup']),
              StreamTest[version].fromChunks(['pl', 'op']),
              StreamTest[version].fromChunks(['ki', 'koo', 'lol'])
            ).pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'wadupplopkikoolol');
                done();
              })
            );
          });

          it('should work with POO API', done => {
            const queue = new StreamQueue();

            queue.queue(StreamTest[version].fromChunks(['wa', 'dup']));
            queue.queue(StreamTest[version].fromChunks(['pl', 'op']));
            queue.queue(StreamTest[version].fromChunks(['ki', 'koo', 'lol']));
            assert.equal(queue.length, 3);
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'wadupplopkikoolol');
                done();
              })
            );
            queue.done();
          });

          it('should pause streams in flowing mode', done => {
            const queue = new StreamQueue({
              pauseFlowingStream: true,
              resumeFlowingStream: true,
            });
            const flowingStream = StreamTest[version].fromChunks(['pl', 'op']);

            flowingStream.on('data', () => {});
            queue.queue(StreamTest[version].fromChunks(['wa', 'dup']));
            queue.queue(flowingStream);
            queue.queue(StreamTest[version].fromChunks(['ki', 'koo', 'lol']));
            assert.equal(queue.length, 3);
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'wadupplopkikoolol');
                done();
              })
            );
            queue.done();
          });

          it('should work with POO API and options', done => {
            const queue = new StreamQueue({
              pauseFlowingStream: true,
              resumeFlowingStream: true,
            });

            queue.queue(StreamTest[version].fromChunks(['wa', 'dup']));
            queue.queue(StreamTest[version].fromChunks(['pl', 'op']));
            queue.queue(StreamTest[version].fromChunks(['ki', 'koo', 'lol']));
            assert.equal(queue.length, 3);
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'wadupplopkikoolol');
                done();
              })
            );
            queue.done();
          });

          it('should work with POO API and a late done call', done => {
            const queue = new StreamQueue();

            queue.queue(StreamTest[version].fromChunks(['wa', 'dup']));
            queue.queue(StreamTest[version].fromChunks(['pl', 'op']));
            queue.queue(StreamTest[version].fromChunks(['ki', 'koo', 'lol']));
            assert.equal(queue.length, 3);
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'wadupplopkikoolol');
                done();
              })
            );
            setTimeout(() => {
              queue.done();
            }, 100);
          });

          it('should work with POO API and no stream plus sync done', done => {
            const queue = new StreamQueue();

            assert.equal(queue.length, 0);
            queue.queue();
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, '');
                done();
              })
            );
            queue.done();
          });

          it('should work with POO API and no stream plus async done', done => {
            const queue = new StreamQueue();

            assert.equal(queue.length, 0);
            queue.queue();
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, '');
                done();
              })
            );
            setTimeout(() => {
              queue.done();
            }, 100);
          });

          it('should work with POO API and a streamqueue stream plus async done', done => {
            const queue = new StreamQueue();
            const child = new StreamQueue();

            queue.queue(child);
            assert.equal(queue.length, 1);
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, '');
                done();
              })
            );
            child.done();
            setTimeout(() => {
              queue.done();
            }, 100);
          });

          it('should work with POO API and a streamqueue stream plus async done', done => {
            const queue = new StreamQueue();
            const child = new StreamQueue();

            queue.queue(child);
            assert.equal(queue.length, 1);
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, '');
                done();
              })
            );
            child.done();
            queue.done();
          });

          it('should work with POO API and a streamqueue ended stream plus async done', done => {
            const queue = new StreamQueue();
            const child = new StreamQueue();

            queue.queue(child);
            child.done();
            assert.equal(queue.length, 1);
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, '');
                done();
              })
            );
            setTimeout(() => {
              queue.done();
            }, 100);
          });

          it('should fire end asynchronously with streams', done => {
            const queue = new StreamQueue();
            let ended = false;

            queue.queue(
              StreamTest[version].fromChunks(['wa', 'dup']).on('end', () => {
                assert.equal(ended, false);
              })
            );
            queue.queue(
              StreamTest[version].fromChunks(['pl', 'op']).on('end', () => {
                assert.equal(ended, false);
              })
            );
            queue.queue(
              StreamTest[version]
                .fromChunks(['ki', 'koo', 'lol'])
                .on('end', () => {
                  assert.equal(ended, false);
                })
            );
            assert.equal(queue.length, 3);
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'wadupplopkikoolol');
                done();
              })
            );
            queue.on('end', () => {
              ended = true;
            });
            queue.done();
            assert.equal(ended, false);
          });

          it('should fire end asynchronously when empty', done => {
            const queue = new StreamQueue();
            let ended = false;

            assert.equal(queue.length, 0);
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, '');
                done();
              })
            );
            queue.on('end', () => {
              ended = true;
            });
            queue.done();
            assert.equal(ended, false);
          });

          it('should work with POO API and a streamqueue ended stream plus sync done', done => {
            const queue = new StreamQueue();
            const child = new StreamQueue();

            queue.queue(child);
            child.done();
            assert.equal(queue.length, 1);
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, '');
                done();
              })
            );
            queue.done();
          });

          it('should work with POO API and a streamqueue ended stream plus async done', done => {
            const queue = new StreamQueue();
            const child = new StreamQueue();

            child.done();
            queue.queue(child);
            assert.equal(queue.length, 1);
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, '');
                done();
              })
            );
            setTimeout(() => {
              queue.done();
            }, 100);
          });

          it('should work with POO API and a streamqueue ended stream plus sync done', done => {
            const queue = new StreamQueue();
            const child = new StreamQueue();

            child.done();
            queue.queue(child);
            assert.equal(queue.length, 1);
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, '');
                done();
              })
            );
            queue.done();
          });

          if ('v2' === version) {
            it('should reemit errors', done => {
              let _err;
              const queue = new StreamQueue();

              queue.queue(
                StreamTest[version].fromErroredChunks(new Error('Aouch!'), [])
              );
              queue.queue(StreamTest[version].fromChunks(['wa', 'dup']));
              queue.queue(StreamTest[version].fromChunks(['pl', 'op']));
              queue.queue(StreamTest[version].fromChunks(['ki', 'koo', 'lol']));
              assert.equal(queue.length, 4);
              queue.on('error', err => {
                _err = err;
              });
              queue.pipe(
                StreamTest[version].toText((err, text) => {
                  if (err) {
                    done(err);
                    return;
                  }
                  assert(_err);
                  assert.equal(_err.message, 'Aouch!');
                  assert.equal(text, 'wadupplopkikoolol');
                  done();
                })
              );
              queue.done();
            });
          }

          if ('v2' === version) {
            it('should reemit errors elsewhere', done => {
              let _err;
              const queue = new StreamQueue();

              queue.queue(StreamTest[version].fromChunks(['wa', 'dup']));
              queue.queue(StreamTest[version].fromChunks(['pl', 'op']));
              queue.queue(
                StreamTest[version].fromErroredChunks(new Error('Aouch!'), [])
              );
              queue.queue(StreamTest[version].fromChunks(['ki', 'koo', 'lol']));
              assert.equal(queue.length, 4);
              queue.on('error', err => {
                _err = err;
              });
              queue.pipe(
                StreamTest[version].toText((err, text) => {
                  if (err) {
                    done(err);
                    return;
                  }
                  assert(_err);
                  assert.equal(_err.message, 'Aouch!');
                  assert.equal(text, 'wadupplopkikoolol');
                  done();
                })
              );
              queue.done();
            });
          }
        });

        describe('and with sync streams', () => {
          it('should work with functionnal API', done => {
            const stream1 = StreamTest[version].syncReadableChunks();
            const stream2 = StreamTest[version].syncReadableChunks();
            const stream3 = StreamTest[version].syncReadableChunks();
            const createStreamQueue = StreamQueue;

            createStreamQueue(stream1, stream2, stream3).pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'wadupplopkikoolol');
                done();
              })
            );
            StreamTest[version].syncWrite(stream1, ['wa', 'dup']);
            StreamTest[version].syncWrite(stream2, ['pl', 'op']);
            StreamTest[version].syncWrite(stream3, ['ki', 'koo', 'lol']);
          });

          it('should work with POO API', done => {
            const queue = new StreamQueue();
            const stream1 = StreamTest[version].syncReadableChunks();
            const stream2 = StreamTest[version].syncReadableChunks();
            const stream3 = StreamTest[version].syncReadableChunks();

            queue.queue(stream1);
            queue.queue(stream2);
            queue.queue(stream3);
            StreamTest[version].syncWrite(stream1, ['wa', 'dup']);
            StreamTest[version].syncWrite(stream2, ['pl', 'op']);
            StreamTest[version].syncWrite(stream3, ['ki', 'koo', 'lol']);
            assert.equal(queue.length, 3);
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'wadupplopkikoolol');
                done();
              })
            );
            queue.done();
          });

          it('should emit an error when calling done twice', done => {
            const queue = new StreamQueue();
            const stream1 = StreamTest[version].syncReadableChunks();
            const stream2 = StreamTest[version].syncReadableChunks();
            const stream3 = StreamTest[version].syncReadableChunks();

            queue.queue(stream1);
            queue.queue(stream2);
            queue.queue(stream3);
            StreamTest[version].syncWrite(stream1, ['wa', 'dup']);
            StreamTest[version].syncWrite(stream2, ['pl', 'op']);
            StreamTest[version].syncWrite(stream3, ['ki', 'koo', 'lol']);
            assert.equal(queue.length, 3);
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'wadupplopkikoolol');
                done();
              })
            );
            queue.done();
            assert.throws(() => {
              queue.done();
            });
          });

          it('should emit an error when queueing after done was called', done => {
            const queue = new StreamQueue();
            const stream1 = StreamTest[version].syncReadableChunks();
            const stream2 = StreamTest[version].syncReadableChunks();
            const stream3 = StreamTest[version].syncReadableChunks();

            queue.queue(stream1);
            queue.queue(stream2);
            queue.queue(stream3);
            StreamTest[version].syncWrite(stream1, ['wa', 'dup']);
            StreamTest[version].syncWrite(stream2, ['pl', 'op']);
            StreamTest[version].syncWrite(stream3, ['ki', 'koo', 'lol']);
            assert.equal(queue.length, 3);
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'wadupplopkikoolol');
                done();
              })
            );
            queue.done();
            assert.throws(() => {
              queue.queue(StreamTest[version].syncReadableChunks());
            });
          });

          if ('v2' === version) {
            it('should reemit errors', done => {
              let _err;
              const queue = new StreamQueue();
              const stream1 = StreamTest[version].syncReadableChunks();
              const stream2 = StreamTest[version].syncReadableChunks();
              const stream3 = StreamTest[version].syncReadableChunks();
              const stream4 = StreamTest[version].syncReadableChunks();

              queue.queue(stream1);
              queue.queue(stream2);
              queue.queue(stream3);
              queue.queue(stream4);
              queue.on('error', err => {
                _err = err;
              });
              StreamTest[version].syncError(stream1, new Error('Aouch!'));
              StreamTest[version].syncWrite(stream2, ['wa', 'dup']);
              StreamTest[version].syncWrite(stream3, ['pl', 'op']);
              StreamTest[version].syncWrite(stream4, ['ki', 'koo', 'lol']);
              assert.equal(queue.length, 4);
              queue.pipe(
                StreamTest[version].toText((err, text) => {
                  if (err) {
                    done(err);
                    return;
                  }
                  assert(_err);
                  assert.equal(_err.message, 'Aouch!');
                  assert.equal(text, 'wadupplopkikoolol');
                  done();
                })
              );
              queue.done();
            });
          }
        });

        describe('and with functions returning streams', () => {
          it('should work with functionnal API', done => {
            const createStreamQueue = StreamQueue;

            createStreamQueue(
              StreamTest[version].fromChunks.bind(null, ['wa', 'dup']),
              StreamTest[version].fromChunks.bind(null, ['pl', 'op']),
              StreamTest[version].fromChunks.bind(null, ['ki', 'koo', 'lol'])
            ).pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'wadupplopkikoolol');
                done();
              })
            );
          });

          it('should work with functionnal API and options', done => {
            const createStreamQueue = StreamQueue;

            createStreamQueue(
              StreamTest[version].fromChunks.bind(null, ['wa', 'dup']),
              StreamTest[version].fromChunks.bind(null, ['pl', 'op']),
              StreamTest[version].fromChunks.bind(null, ['ki', 'koo', 'lol'])
            ).pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'wadupplopkikoolol');
                done();
              })
            );
          });

          it('should work with POO API', done => {
            const queue = new StreamQueue();

            queue.queue(
              StreamTest[version].fromChunks.bind(null, ['wa', 'dup'])
            );
            queue.queue(
              StreamTest[version].fromChunks.bind(null, ['pl', 'op'])
            );
            queue.queue(
              StreamTest[version].fromChunks.bind(null, ['ki', 'koo', 'lol'])
            );
            assert.equal(queue.length, 3);
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'wadupplopkikoolol');
                done();
              })
            );
            queue.done();
          });

          it('should pause streams in flowing mode', done => {
            const queue = new StreamQueue({
              pauseFlowingStream: true,
              resumeFlowingStream: true,
            });

            queue.queue(
              StreamTest[version].fromChunks.bind(null, ['wa', 'dup'])
            );
            queue.queue(() => {
              const stream = StreamTest[version].fromChunks(['pl', 'op']);

              stream.on('data', () => {});
              return stream;
            });
            queue.queue(
              StreamTest[version].fromChunks.bind(null, ['ki', 'koo', 'lol'])
            );
            assert.equal(queue.length, 3);
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'wadupplopkikoolol');
                done();
              })
            );
            queue.done();
          });

          it('should work with POO API and options', done => {
            const queue = new StreamQueue({
              pauseFlowingStream: true,
              resumeFlowingStream: true,
            });

            queue.queue(
              StreamTest[version].fromChunks.bind(null, ['wa', 'dup'])
            );
            queue.queue(
              StreamTest[version].fromChunks.bind(null, ['pl', 'op'])
            );
            queue.queue(
              StreamTest[version].fromChunks.bind(null, ['ki', 'koo', 'lol'])
            );
            assert.equal(queue.length, 3);
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'wadupplopkikoolol');
                done();
              })
            );
            queue.done();
          });

          it('should work with POO API and a late done call', done => {
            const queue = new StreamQueue();

            queue.queue(
              StreamTest[version].fromChunks.bind(null, ['wa', 'dup'])
            );
            queue.queue(
              StreamTest[version].fromChunks.bind(null, ['pl', 'op'])
            );
            queue.queue(
              StreamTest[version].fromChunks.bind(null, ['ki', 'koo', 'lol'])
            );
            assert.equal(queue.length, 3);
            queue.pipe(
              StreamTest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'wadupplopkikoolol');
                done();
              })
            );
            setTimeout(() => {
              queue.done();
            }, 100);
          });

          if ('v2' === version) {
            it('should reemit errors', done => {
              let _err;
              const queue = new StreamQueue();

              queue.queue(
                StreamTest[version].fromErroredChunks.bind(
                  null,
                  new Error('Aouch!'),
                  []
                )
              );
              queue.queue(
                StreamTest[version].fromChunks.bind(null, ['wa', 'dup'])
              );
              queue.queue(
                StreamTest[version].fromChunks.bind(null, ['pl', 'op'])
              );
              queue.queue(
                StreamTest[version].fromChunks.bind(null, ['ki', 'koo', 'lol'])
              );
              assert.equal(queue.length, 4);
              queue.on('error', err => {
                _err = err;
              });
              queue.pipe(
                StreamTest[version].toText((err, text) => {
                  if (err) {
                    done(err);
                    return;
                  }
                  assert(_err);
                  assert.equal(_err.message, 'Aouch!');
                  assert.equal(text, 'wadupplopkikoolol');
                  done();
                })
              );
              queue.done();
            });
          }

          if ('v2' === version) {
            it('should reemit errors elsewhere', done => {
              let _err;
              const queue = new StreamQueue();

              queue.queue(
                StreamTest[version].fromChunks.bind(null, ['wa', 'dup'])
              );
              queue.queue(
                StreamTest[version].fromChunks.bind(null, ['pl', 'op'])
              );
              queue.queue(
                StreamTest[version].fromErroredChunks.bind(
                  null,
                  new Error('Aouch!'),
                  []
                )
              );
              queue.queue(
                StreamTest[version].fromChunks.bind(null, ['ki', 'koo', 'lol'])
              );
              assert.equal(queue.length, 4);
              queue.on('error', err => {
                _err = err;
              });
              queue.pipe(
                StreamTest[version].toText((err, text) => {
                  if (err) {
                    done(err);
                    return;
                  }
                  assert(_err);
                  assert.equal(_err.message, 'Aouch!');
                  assert.equal(text, 'wadupplopkikoolol');
                  done();
                })
              );
              queue.done();
            });
          }
        });
      });

      describe('in object mode', () => {
        it('should work', done => {
          const queue = new StreamQueue({ objectMode: true });

          queue.queue(
            StreamTest[version].fromObjects([{ s: 'wa' }, { s: 'dup' }])
          );
          queue.queue(
            StreamTest[version].fromObjects([{ s: 'pl' }, { s: 'op' }])
          );
          queue.queue(
            StreamTest[version].fromObjects([
              { s: 'ki' },
              { s: 'koo' },
              { s: 'lol' },
            ])
          );
          queue.pipe(
            StreamTest[version].toObjects((err, objs) => {
              if (err) {
                done(err);
                return;
              }
              assert.deepEqual(objs, [
                { s: 'wa' },
                { s: 'dup' },
                { s: 'pl' },
                { s: 'op' },
                { s: 'ki' },
                { s: 'koo' },
                { s: 'lol' },
              ]);
              done();
            })
          );
          queue.done();
        });
      });

      describe('in object mode with the .obj() shortcut', () => {
        it('should work without options', done => {
          StreamQueue.obj(
            StreamTest[version].fromObjects([{ s: 'wa' }, { s: 'dup' }]),
            StreamTest[version].fromObjects([{ s: 'pl' }, { s: 'op' }]),
            StreamTest[version].fromObjects([
              { s: 'ki' },
              { s: 'koo' },
              { s: 'lol' },
            ])
          ).pipe(
            StreamTest[version].toObjects((err, objs) => {
              if (err) {
                done(err);
                return;
              }
              assert.deepEqual(objs, [
                { s: 'wa' },
                { s: 'dup' },
                { s: 'pl' },
                { s: 'op' },
                { s: 'ki' },
                { s: 'koo' },
                { s: 'lol' },
              ]);
              done();
            })
          );
        });

        it('should work with options', done => {
          StreamQueue.obj(
            {},
            StreamTest[version].fromObjects([{ s: 'wa' }, { s: 'dup' }]),
            StreamTest[version].fromObjects([{ s: 'pl' }, { s: 'op' }]),
            StreamTest[version].fromObjects([
              { s: 'ki' },
              { s: 'koo' },
              { s: 'lol' },
            ])
          ).pipe(
            StreamTest[version].toObjects((err, objs) => {
              if (err) {
                done(err);
                return;
              }
              assert.deepEqual(objs, [
                { s: 'wa' },
                { s: 'dup' },
                { s: 'pl' },
                { s: 'op' },
                { s: 'ki' },
                { s: 'koo' },
                { s: 'lol' },
              ]);
              done();
            })
          );
        });

        it('should work without options nor streams', done => {
          const queue = StreamQueue.obj();

          queue.queue(
            StreamTest[version].fromObjects([{ s: 'wa' }, { s: 'dup' }])
          );
          queue.queue(
            StreamTest[version].fromObjects([{ s: 'pl' }, { s: 'op' }])
          );
          queue.queue(
            StreamTest[version].fromObjects([
              { s: 'ki' },
              { s: 'koo' },
              { s: 'lol' },
            ])
          );
          queue.done();
          queue.pipe(
            StreamTest[version].toObjects((err, objs) => {
              if (err) {
                done(err);
                return;
              }
              assert.deepEqual(objs, [
                { s: 'wa' },
                { s: 'dup' },
                { s: 'pl' },
                { s: 'op' },
                { s: 'ki' },
                { s: 'koo' },
                { s: 'lol' },
              ]);
              done();
            })
          );
        });

        it('should work with options and no streams', done => {
          const queue = StreamQueue.obj({});

          queue.queue(
            StreamTest[version].fromObjects([{ s: 'wa' }, { s: 'dup' }])
          );
          queue.queue(
            StreamTest[version].fromObjects([{ s: 'pl' }, { s: 'op' }])
          );
          queue.queue(
            StreamTest[version].fromObjects([
              { s: 'ki' },
              { s: 'koo' },
              { s: 'lol' },
            ])
          );
          queue.done();
          queue.pipe(
            StreamTest[version].toObjects((err, objs) => {
              if (err) {
                done(err);
                return;
              }
              assert.deepEqual(objs, [
                { s: 'wa' },
                { s: 'dup' },
                { s: 'pl' },
                { s: 'op' },
                { s: 'ki' },
                { s: 'koo' },
                { s: 'lol' },
              ]);
              done();
            })
          );
        });
      });
    });
  });
});
