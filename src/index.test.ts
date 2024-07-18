import { describe, expect, test } from '@jest/globals';
import { YError } from 'yerror';
import { PassThrough } from 'node:stream';
import StreamTest from 'streamtest';
import { StreamQueue, queueStreams, queueObjectStreams } from './index.js';

// Tests
describe('StreamQueue', () => {
  describe('in binary mode', () => {
    describe('and with async streams', () => {
      test('should work with functionnal API', async () => {
        const [stream, result] = StreamTest.toText();

        queueStreams(
          StreamTest.fromChunks([Buffer.from('wa'), Buffer.from('dup')]),
          StreamTest.fromChunks([Buffer.from('pl'), Buffer.from('op')]),
          StreamTest.fromChunks([
            Buffer.from('ki'),
            Buffer.from('koo'),
            Buffer.from('lol'),
          ]),
        ).pipe(stream);
        expect(await result).toEqual('wadupplopkikoolol');
      });

      test('should work with functionnal API and options', async () => {
        const [stream, result] = StreamTest.toText();

        queueStreams(
          {},
          StreamTest.fromChunks([Buffer.from('wa'), Buffer.from('dup')]),
          StreamTest.fromChunks([Buffer.from('pl'), Buffer.from('op')]),
          StreamTest.fromChunks([
            Buffer.from('ki'),
            Buffer.from('koo'),
            Buffer.from('lol'),
          ]),
        ).pipe(stream);
        expect(await result).toEqual('wadupplopkikoolol');
      });

      test('should work with POO API', async () => {
        const queue = new StreamQueue();
        const [stream, result] = StreamTest.toText();

        queue.queue(
          StreamTest.fromChunks([Buffer.from('wa'), Buffer.from('dup')]),
        );
        queue.queue(
          StreamTest.fromChunks([Buffer.from('pl'), Buffer.from('op')]),
        );
        queue.queue(
          StreamTest.fromChunks([
            Buffer.from('ki'),
            Buffer.from('koo'),
            Buffer.from('lol'),
          ]),
        );
        expect(queue.length).toEqual(3);
        queue.pipe(stream);
        queue.done();
        expect(await result).toEqual('wadupplopkikoolol');
      });

      test('should pause streams in flowing mode', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue({
          pauseFlowingStream: true,
          resumeFlowingStream: true,
        });
        const flowingStream = StreamTest.fromChunks([
          Buffer.from('pl'),
          Buffer.from('op'),
        ]);

        flowingStream.on('data', () => {});
        queue.queue(
          StreamTest.fromChunks([Buffer.from('wa'), Buffer.from('dup')]),
        );
        queue.queue(flowingStream);
        queue.queue(
          StreamTest.fromChunks([
            Buffer.from('ki'),
            Buffer.from('koo'),
            Buffer.from('lol'),
          ]),
        );
        expect(queue.length).toEqual(3);
        queue.pipe(stream);
        queue.done();
        expect(await result).toEqual('wadupplopkikoolol');
      });

      test('should work with POO API and options', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue({
          pauseFlowingStream: true,
          resumeFlowingStream: true,
        });

        queue.queue(
          StreamTest.fromChunks([Buffer.from('wa'), Buffer.from('dup')]),
        );
        queue.queue(
          StreamTest.fromChunks([Buffer.from('pl'), Buffer.from('op')]),
        );
        queue.queue(
          StreamTest.fromChunks([
            Buffer.from('ki'),
            Buffer.from('koo'),
            Buffer.from('lol'),
          ]),
        );
        expect(queue.length).toEqual(3);
        queue.pipe(stream);
        queue.done();
        expect(await result).toEqual('wadupplopkikoolol');
      });

      test('should work with POO API and a late done call', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue();

        queue.queue(
          StreamTest.fromChunks([Buffer.from('wa'), Buffer.from('dup')]),
        );
        queue.queue(
          StreamTest.fromChunks([Buffer.from('pl'), Buffer.from('op')]),
        );
        queue.queue(
          StreamTest.fromChunks([
            Buffer.from('ki'),
            Buffer.from('koo'),
            Buffer.from('lol'),
          ]),
        );
        expect(queue.length).toEqual(3);
        queue.pipe(stream);
        setTimeout(() => {
          queue.done();
        }, 100);
        expect(await result).toEqual('wadupplopkikoolol');
      });

      test('should work with POO API and no stream plus sync done', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue();

        expect(queue.length).toEqual(0);
        queue.queue();
        queue.pipe(stream);
        queue.done();
        expect(await result).toEqual('');
      });

      test('should work with POO API and no stream plus async done', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue();

        expect(queue.length).toEqual(0);
        queue.queue();
        queue.pipe(stream);
        setTimeout(() => {
          queue.done();
        }, 100);
        expect(await result).toEqual('');
      });

      test('should work with POO API and a streamqueue stream plus async done', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue();
        const child = new StreamQueue();

        queue.queue(child);
        expect(queue.length).toEqual(1);
        queue.pipe(stream);
        child.done();
        setTimeout(() => {
          queue.done();
        }, 100);
        expect(await result).toEqual('');
      });

      test('should work with POO API and a streamqueue stream plus async done', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue();
        const child = new StreamQueue();

        queue.queue(child);
        expect(queue.length).toEqual(1);
        queue.pipe(stream);
        child.done();
        queue.done();
        expect(await result).toEqual('');
      });

      test('should work with POO API and a streamqueue ended stream plus async done', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue();
        const child = new StreamQueue();

        queue.queue(child);
        child.done();
        expect(queue.length).toEqual(1);
        queue.pipe(stream);
        setTimeout(() => {
          queue.done();
        }, 100);
        expect(await result).toEqual('');
      });

      test('should fire end asynchronously with streams', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue();
        let ended = false;

        queue.queue(
          StreamTest.fromChunks([Buffer.from('wa'), Buffer.from('dup')]).on(
            'end',
            () => {
              expect(ended).toEqual(false);
            },
          ),
        );
        queue.queue(
          StreamTest.fromChunks([Buffer.from('pl'), Buffer.from('op')]).on(
            'end',
            () => {
              expect(ended).toEqual(false);
            },
          ),
        );
        queue.queue(
          StreamTest.fromChunks([
            Buffer.from('ki'),
            Buffer.from('koo'),
            Buffer.from('lol'),
          ]).on('end', () => {
            expect(ended).toEqual(false);
          }),
        );
        expect(queue.length).toEqual(3);
        queue.pipe(stream);
        queue.on('end', () => {
          ended = true;
        });
        queue.done();
        expect(ended).toEqual(false);
        expect(await result).toEqual('wadupplopkikoolol');
      });

      test('should fire end asynchronously when empty', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue();
        let ended = false;

        expect(queue.length).toEqual(0);
        queue.pipe(stream);
        queue.on('end', () => {
          ended = true;
        });
        queue.done();
        expect(ended).toEqual(false);
        expect(await result).toEqual('');
      });

      test('should work with POO API and a streamqueue ended stream plus sync done', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue();
        const child = new StreamQueue();

        queue.queue(child);
        child.done();
        expect(queue.length).toEqual(1);
        queue.pipe(stream);
        queue.done();
        expect(await result).toEqual('');
      });

      test('should work with POO API and a streamqueue ended stream plus async done', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue();
        const child = new StreamQueue();

        child.done();
        queue.queue(child);
        expect(queue.length).toEqual(1);
        queue.pipe(stream);
        setTimeout(() => {
          queue.done();
        }, 100);
        expect(await result).toEqual('');
      });

      test('should work with POO API and a streamqueue ended stream plus sync done', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue();
        const child = new StreamQueue();

        child.done();
        queue.queue(child);
        expect(queue.length).toEqual(1);
        queue.pipe(stream);
        queue.done();
        expect(await result).toEqual('');
      });

      test('should reemit errors', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue();
        let _err;

        queue.queue(StreamTest.fromErroredChunks(new YError('E_ERROR'), []));
        queue.queue(
          StreamTest.fromChunks([Buffer.from('wa'), Buffer.from('dup')]),
        );
        queue.queue(
          StreamTest.fromChunks([Buffer.from('pl'), Buffer.from('op')]),
        );
        queue.queue(
          StreamTest.fromChunks([
            Buffer.from('ki'),
            Buffer.from('koo'),
            Buffer.from('lol'),
          ]),
        );
        expect(queue.length).toEqual(4);
        queue.on('error', (err) => {
          _err = err;
        });
        queue.pipe(stream);
        queue.done();
        expect(await result).toEqual('wadupplopkikoolol');
        expect(_err).toBeTruthy();
        expect(_err.message).toEqual('E_ERROR');
      });

      test('should reemit errors elsewhere', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue();
        let _err;

        queue.queue(
          StreamTest.fromChunks([Buffer.from('wa'), Buffer.from('dup')]),
        );
        queue.queue(
          StreamTest.fromChunks([Buffer.from('pl'), Buffer.from('op')]),
        );
        queue.queue(StreamTest.fromErroredChunks(new YError('E_ERROR'), []));
        queue.queue(
          StreamTest.fromChunks([
            Buffer.from('ki'),
            Buffer.from('koo'),
            Buffer.from('lol'),
          ]),
        );
        expect(queue.length).toEqual(4);
        queue.on('error', (err) => {
          _err = err;
        });
        queue.pipe(stream);
        queue.done();
        expect(await result).toEqual('wadupplopkikoolol');
        expect(_err).toBeTruthy();
        expect(_err.message).toEqual('E_ERROR');
      });
    });

    describe('and with sync streams', () => {
      test('should work with functionnal API', async () => {
        const [stream, result] = StreamTest.toText();
        const stream1 = new PassThrough();
        const stream2 = new PassThrough();
        const stream3 = new PassThrough();

        queueStreams({}, stream1, stream2, stream3).pipe(stream);

        for (const buffer of [Buffer.from('wa'), Buffer.from('dup')]) {
          stream1.write(buffer);
        }
        stream1.end();
        for (const buffer of [Buffer.from('pl'), Buffer.from('op')]) {
          stream2.write(buffer);
        }
        stream2.end();
        for (const buffer of [
          Buffer.from('ki'),
          Buffer.from('koo'),
          Buffer.from('lol'),
        ]) {
          stream3.write(buffer);
        }
        stream3.end();

        expect(await result).toEqual('wadupplopkikoolol');
      });

      test('should work with POO API', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue();
        const stream1 = new PassThrough();
        const stream2 = new PassThrough();
        const stream3 = new PassThrough();

        queue.queue(stream1);
        queue.queue(stream2);
        queue.queue(stream3);

        for (const buffer of [Buffer.from('wa'), Buffer.from('dup')]) {
          stream1.write(buffer);
        }
        stream1.end();
        for (const buffer of [Buffer.from('pl'), Buffer.from('op')]) {
          stream2.write(buffer);
        }
        stream2.end();
        for (const buffer of [
          Buffer.from('ki'),
          Buffer.from('koo'),
          Buffer.from('lol'),
        ]) {
          stream3.write(buffer);
        }
        stream3.end();

        expect(queue.length).toEqual(3);
        queue.pipe(stream);
        queue.done();
        expect(await result).toEqual('wadupplopkikoolol');
      });

      test('should emit an error when calling done twice', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue();
        const stream1 = new PassThrough();
        const stream2 = new PassThrough();
        const stream3 = new PassThrough();

        queue.queue(stream1);
        queue.queue(stream2);
        queue.queue(stream3);

        for (const buffer of [Buffer.from('wa'), Buffer.from('dup')]) {
          stream1.write(buffer);
        }
        stream1.end();
        for (const buffer of [Buffer.from('pl'), Buffer.from('op')]) {
          stream2.write(buffer);
        }
        stream2.end();
        for (const buffer of [
          Buffer.from('ki'),
          Buffer.from('koo'),
          Buffer.from('lol'),
        ]) {
          stream3.write(buffer);
        }
        stream3.end();

        expect(queue.length).toEqual(3);
        queue.pipe(stream);
        queue.done();
        try {
          queue.done();
          throw new YError('E_UNEXPECTED_SUCCESS');
        } catch (err) {
          expect((err as YError).code).toEqual('E_QUEUE_ALREADY_ENDED');
        }
        expect(await result).toEqual('wadupplopkikoolol');
      });

      test('should emit an error when queueing after done was called', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue();
        const stream1 = new PassThrough();
        const stream2 = new PassThrough();
        const stream3 = new PassThrough();

        queue.queue(stream1);
        queue.queue(stream2);
        queue.queue(stream3);

        for (const buffer of [Buffer.from('wa'), Buffer.from('dup')]) {
          stream1.write(buffer);
        }
        stream1.end();
        for (const buffer of [Buffer.from('pl'), Buffer.from('op')]) {
          stream2.write(buffer);
        }
        stream2.end();
        for (const buffer of [
          Buffer.from('ki'),
          Buffer.from('koo'),
          Buffer.from('lol'),
        ]) {
          stream3.write(buffer);
        }
        stream3.end();

        expect(queue.length).toEqual(3);
        queue.pipe(stream);
        queue.done();
        try {
          queue.queue(new PassThrough());
          throw new YError('E_UNEXPECTED_SUCCESS');
        } catch (err) {
          expect((err as YError).code).toEqual('E_QUEUE_ALREADY_ENDED');
        }
        expect(await result).toEqual('wadupplopkikoolol');
      });

      test('should reemit errors', async () => {
        const [stream, result] = StreamTest.toText();
        let _err;
        const queue = new StreamQueue();
        const stream1 = new PassThrough();
        const stream2 = new PassThrough();
        const stream3 = new PassThrough();
        const stream4 = new PassThrough();

        queue.queue(stream1);
        queue.queue(stream2);
        queue.queue(stream3);
        queue.queue(stream4);
        queue.on('error', (err) => {
          _err = err;
        });

        stream1.emit('error', new YError('E_ERROR'));
        stream1.end();

        for (const buffer of [Buffer.from('wa'), Buffer.from('dup')]) {
          stream2.write(buffer);
        }
        stream2.end();
        for (const buffer of [Buffer.from('pl'), Buffer.from('op')]) {
          stream3.write(buffer);
        }
        stream3.end();
        for (const buffer of [
          Buffer.from('ki'),
          Buffer.from('koo'),
          Buffer.from('lol'),
        ]) {
          stream4.write(buffer);
        }
        stream4.end();

        expect(queue.length).toEqual(4);
        queue.pipe(stream);
        queue.done();
        expect(await result).toEqual('wadupplopkikoolol');
        expect(_err).toBeTruthy();
        expect(_err.message).toEqual('E_ERROR');
      });
    });

    describe('and with functions returning streams', () => {
      test('should work with functionnal API', async () => {
        const [stream, result] = StreamTest.toText();

        queueStreams(
          {},
          StreamTest.fromChunks.bind(null, [
            Buffer.from('wa'),
            Buffer.from('dup'),
          ]),
          StreamTest.fromChunks.bind(null, [
            Buffer.from('pl'),
            Buffer.from('op'),
          ]),
          StreamTest.fromChunks.bind(null, [
            Buffer.from('ki'),
            Buffer.from('koo'),
            Buffer.from('lol'),
          ]),
        ).pipe(stream);
        expect(await result).toEqual('wadupplopkikoolol');
      });

      test('should work with functionnal API and options', async () => {
        const [stream, result] = StreamTest.toText();

        queueStreams(
          StreamTest.fromChunks.bind(null, [
            Buffer.from('wa'),
            Buffer.from('dup'),
          ]),
          StreamTest.fromChunks.bind(null, [
            Buffer.from('pl'),
            Buffer.from('op'),
          ]),
          StreamTest.fromChunks.bind(null, [
            Buffer.from('ki'),
            Buffer.from('koo'),
            Buffer.from('lol'),
          ]),
        ).pipe(stream);
        expect(await result).toEqual('wadupplopkikoolol');
      });

      test('should work with POO API', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue();

        queue.queue(
          StreamTest.fromChunks.bind(null, [
            Buffer.from('wa'),
            Buffer.from('dup'),
          ]),
        );
        queue.queue(
          StreamTest.fromChunks.bind(null, [
            Buffer.from('pl'),
            Buffer.from('op'),
          ]),
        );
        queue.queue(
          StreamTest.fromChunks.bind(null, [
            Buffer.from('ki'),
            Buffer.from('koo'),
            Buffer.from('lol'),
          ]),
        );
        expect(queue.length).toEqual(3);
        queue.pipe(stream);
        queue.done();
        expect(await result).toEqual('wadupplopkikoolol');
      });

      test('should pause streams in flowing mode', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue({
          pauseFlowingStream: true,
          resumeFlowingStream: true,
        });

        queue.queue(
          StreamTest.fromChunks.bind(null, [
            Buffer.from('wa'),
            Buffer.from('dup'),
          ]),
        );
        queue.queue(() => {
          const stream = StreamTest.fromChunks([
            Buffer.from('pl'),
            Buffer.from('op'),
          ]);

          stream.on('data', () => {});
          return stream;
        });
        queue.queue(
          StreamTest.fromChunks.bind(null, [
            Buffer.from('ki'),
            Buffer.from('koo'),
            Buffer.from('lol'),
          ]),
        );
        expect(queue.length).toEqual(3);
        queue.pipe(stream);
        queue.done();
        expect(await result).toEqual('wadupplopkikoolol');
      });

      test('should work with POO API and options', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue({
          pauseFlowingStream: true,
          resumeFlowingStream: true,
        });

        queue.queue(
          StreamTest.fromChunks.bind(null, [
            Buffer.from('wa'),
            Buffer.from('dup'),
          ]),
        );
        queue.queue(
          StreamTest.fromChunks.bind(null, [
            Buffer.from('pl'),
            Buffer.from('op'),
          ]),
        );
        queue.queue(
          StreamTest.fromChunks.bind(null, [
            Buffer.from('ki'),
            Buffer.from('koo'),
            Buffer.from('lol'),
          ]),
        );
        expect(queue.length).toEqual(3);
        queue.pipe(stream);
        queue.done();
        expect(await result).toEqual('wadupplopkikoolol');
      });

      test('should work with POO API and a late done call', async () => {
        const [stream, result] = StreamTest.toText();
        const queue = new StreamQueue();

        queue.queue(
          StreamTest.fromChunks.bind(null, [
            Buffer.from('wa'),
            Buffer.from('dup'),
          ]),
        );
        queue.queue(
          StreamTest.fromChunks.bind(null, [
            Buffer.from('pl'),
            Buffer.from('op'),
          ]),
        );
        queue.queue(
          StreamTest.fromChunks.bind(null, [
            Buffer.from('ki'),
            Buffer.from('koo'),
            Buffer.from('lol'),
          ]),
        );
        expect(queue.length).toEqual(3);
        queue.pipe(stream);
        setTimeout(() => {
          queue.done();
        }, 100);
        expect(await result).toEqual('wadupplopkikoolol');
      });

      test('should reemit errors', async () => {
        const [stream, result] = StreamTest.toText();
        let _err;
        const queue = new StreamQueue();

        queue.queue(
          StreamTest.fromErroredChunks.bind(null, new YError('E_ERROR'), []),
        );
        queue.queue(
          StreamTest.fromChunks.bind(null, [
            Buffer.from('wa'),
            Buffer.from('dup'),
          ]),
        );
        queue.queue(
          StreamTest.fromChunks.bind(null, [
            Buffer.from('pl'),
            Buffer.from('op'),
          ]),
        );
        queue.queue(
          StreamTest.fromChunks.bind(null, [
            Buffer.from('ki'),
            Buffer.from('koo'),
            Buffer.from('lol'),
          ]),
        );
        expect(queue.length).toEqual(4);
        queue.on('error', (err) => {
          _err = err;
        });
        queue.pipe(stream);
        queue.done();
        expect(await result).toEqual('wadupplopkikoolol');
        expect(_err).toBeTruthy();
        expect(_err.message).toEqual('E_ERROR');
      });

      test('should reemit errors elsewhere', async () => {
        const [stream, result] = StreamTest.toText();
        let _err;
        const queue = new StreamQueue();

        queue.queue(
          StreamTest.fromChunks.bind(null, [
            Buffer.from('wa'),
            Buffer.from('dup'),
          ]),
        );
        queue.queue(
          StreamTest.fromChunks.bind(null, [
            Buffer.from('pl'),
            Buffer.from('op'),
          ]),
        );
        queue.queue(
          StreamTest.fromErroredChunks.bind(null, new YError('E_ERROR'), []),
        );
        queue.queue(
          StreamTest.fromChunks.bind(null, [
            Buffer.from('ki'),
            Buffer.from('koo'),
            Buffer.from('lol'),
          ]),
        );
        expect(queue.length).toEqual(4);
        queue.on('error', (err) => {
          _err = err;
        });
        queue.pipe(stream);
        queue.done();
        expect(await result).toEqual('wadupplopkikoolol');
        expect(_err).toBeTruthy();
        expect(_err.message).toEqual('E_ERROR');
      });
    });
  });

  describe('in object mode', () => {
    test('should work', async () => {
      const [stream, result] = StreamTest.toObjects();
      const queue = new StreamQueue({ objectMode: true });

      queue.queue(StreamTest.fromObjects([{ s: 'wa' }, { s: 'dup' }]));
      queue.queue(StreamTest.fromObjects([{ s: 'pl' }, { s: 'op' }]));
      queue.queue(
        StreamTest.fromObjects([{ s: 'ki' }, { s: 'koo' }, { s: 'lol' }]),
      );
      queue.pipe(stream);
      queue.done();
      expect(await result).toEqual([
        { s: 'wa' },
        { s: 'dup' },
        { s: 'pl' },
        { s: 'op' },
        { s: 'ki' },
        { s: 'koo' },
        { s: 'lol' },
      ]);
    });
  });

  describe('in object mode with the object mode shortcut', () => {
    test('should work without options', async () => {
      const [stream, result] = StreamTest.toObjects();
      queueObjectStreams(
        StreamTest.fromObjects([{ s: 'wa' }, { s: 'dup' }]),
        StreamTest.fromObjects([{ s: 'pl' }, { s: 'op' }]),
        StreamTest.fromObjects([{ s: 'ki' }, { s: 'koo' }, { s: 'lol' }]),
      ).pipe(stream);
      expect(await result).toEqual([
        { s: 'wa' },
        { s: 'dup' },
        { s: 'pl' },
        { s: 'op' },
        { s: 'ki' },
        { s: 'koo' },
        { s: 'lol' },
      ]);
    });

    test('should work with options', async () => {
      const [stream, result] = StreamTest.toObjects();
      queueObjectStreams(
        {},
        StreamTest.fromObjects([{ s: 'wa' }, { s: 'dup' }]),
        StreamTest.fromObjects([{ s: 'pl' }, { s: 'op' }]),
        StreamTest.fromObjects([{ s: 'ki' }, { s: 'koo' }, { s: 'lol' }]),
      ).pipe(stream);
      expect(await result).toEqual([
        { s: 'wa' },
        { s: 'dup' },
        { s: 'pl' },
        { s: 'op' },
        { s: 'ki' },
        { s: 'koo' },
        { s: 'lol' },
      ]);
    });

    test('should work without options nor streams', async () => {
      const [stream, result] = StreamTest.toObjects();
      const queue = queueObjectStreams();

      queue.queue(StreamTest.fromObjects([{ s: 'wa' }, { s: 'dup' }]));
      queue.queue(StreamTest.fromObjects([{ s: 'pl' }, { s: 'op' }]));
      queue.queue(
        StreamTest.fromObjects([{ s: 'ki' }, { s: 'koo' }, { s: 'lol' }]),
      );
      queue.done();
      queue.pipe(stream);
      expect(await result).toEqual([
        { s: 'wa' },
        { s: 'dup' },
        { s: 'pl' },
        { s: 'op' },
        { s: 'ki' },
        { s: 'koo' },
        { s: 'lol' },
      ]);
    });

    test('should work with options and no streams', async () => {
      const [stream, result] = StreamTest.toObjects();
      const queue = queueObjectStreams({});

      queue.queue(StreamTest.fromObjects([{ s: 'wa' }, { s: 'dup' }]));
      queue.queue(StreamTest.fromObjects([{ s: 'pl' }, { s: 'op' }]));
      queue.queue(
        StreamTest.fromObjects([{ s: 'ki' }, { s: 'koo' }, { s: 'lol' }]),
      );
      queue.done();
      queue.pipe(stream);
      expect(await result).toEqual([
        { s: 'wa' },
        { s: 'dup' },
        { s: 'pl' },
        { s: 'op' },
        { s: 'ki' },
        { s: 'koo' },
        { s: 'lol' },
      ]);
    });
  });
});
