import { Writable, Readable, Stream } from 'stream';
import { YError } from 'yerror';

export type StreamQueueOptions = {
  objectMode: boolean;
  pauseFlowingStream: boolean;
  resumeFlowingStream: boolean;
};
export type StreamQueueFunction = () => Readable;

const DEFAULT_OPTIONS: StreamQueueOptions = {
  objectMode: false,
  pauseFlowingStream: true,
  resumeFlowingStream: true,
};

/** Pipe queued streams sequentially */
class StreamQueue extends Readable {
  private _options: StreamQueueOptions;
  private _streams: Readable[] = [];
  private _running: boolean = false;
  private _ending: boolean = false;
  private _awaitDrain: null | ((error?: Error | null | undefined) => void) =
    null;
  private _internalStream: Writable;
  private _curStream: Readable | null = null;

  get length() {
    return this._streams.length + (this._running ? 1 : 0);
  }

  constructor(...streams: (Readable | StreamQueueFunction)[]);
  constructor(
    options: Partial<StreamQueueOptions>,
    ...streams: (Readable | StreamQueueFunction)[]
  );
  /**
   * Create a new queue and pipe given streams and end if some
   * @param options {Object} The queue options
   * @param options.objectMode {boolean} Operate in object mode
   * @param options.pauseFlowingStream {boolean} Pause given streams that are flowing
   * @param options.resumeFlowingStream {boolean} Resume given streams that are flowing
   * @param streams {...(Readable|Function)} The stream or stream returning function to pipe in
   * @returns StreamQueue
   */
  constructor(
    maybeOptions: Partial<StreamQueueOptions> | Readable | StreamQueueFunction,
    ...restStreams: (Readable | StreamQueueFunction)[]
  ) {
    const options = {
      ...DEFAULT_OPTIONS,
      ...(maybeOptions instanceof Stream || 'function' === typeof maybeOptions
        ? {}
        : maybeOptions || {}),
    };
    const streams =
      maybeOptions instanceof Stream || 'function' === typeof maybeOptions
        ? [maybeOptions, ...restStreams]
        : restStreams;
    const superOptions: Partial<StreamQueueOptions> = { ...options };

    delete superOptions.pauseFlowingStream;
    delete superOptions.resumeFlowingStream;

    super(superOptions);

    this._options = options;

    // Prepare the stream to pipe in
    this._internalStream = new Writable(options);
    this._internalStream._write = (chunk, encoding, cb) => {
      if (this.push(chunk)) {
        cb();
        return true;
      }
      this._awaitDrain = cb;
      return false;
    };

    if (streams.length) {
      this.done(...streams);
    }
  }

  /**
   * Queue each stream given in argument
   * @param streams {Readable|Function} The stream or stream returning function to pipe in
   * @returns StreamQueue
   */
  queue(...streams: (Readable | StreamQueueFunction)[]) {
    if (this._ending) {
      throw new YError('E_QUEUE_ALREADY_ENDED');
    }

    for (const maybeStream of streams) {
      const stream =
        'function' === typeof maybeStream ? maybeStream() : maybeStream;
      const wrapper = (stream) => {
        stream.on('error', (err) => {
          this.emit('error', err);
        });
        if ('undefined' == typeof stream._readableState) {
          stream = new Stream.Readable({
            objectMode: this._options.objectMode,
          }).wrap(stream);
        }
        if (this._options.pauseFlowingStream && stream._readableState.flowing) {
          stream.pause();
        }
        return stream;
      };

      this._streams.push(wrapper(stream));
    }

    if (!this._running) {
      this._pipeNextStream();
    }

    return this;
  }

  _read() {
    if (this._awaitDrain) {
      this._awaitDrain();
      this._awaitDrain = null;
      this._internalStream.emit('drain');
    }
  }

  private _pipeNextStream() {
    const nextStream = this._streams.shift();

    if (!nextStream) {
      if (this._ending) {
        this.push(null);
      } else {
        this._running = false;
      }
      return;
    }
    this._running = true;

    if ('function' === typeof nextStream) {
      this._curStream = (nextStream as StreamQueueFunction)();
    } else {
      this._curStream = nextStream;
    }

    (this._curStream as Readable).once('end', () => {
      this._pipeNextStream();
    });
    if (
      this._options.resumeFlowingStream &&
      (this._curStream as Readable).readableFlowing
    ) {
      (this._curStream as Readable).resume();
    }
    (this._curStream as Readable).pipe(this._internalStream, {
      end: false,
    });
  }

  /**
   * Queue each stream given in argument and end
   * @param streams {Readable|Function} The stream or stream returning function to pipe in
   * @returns StreamQueue
   */
  done(...streams: (Readable | StreamQueueFunction)[]) {
    if (this._ending) {
      throw new YError('E_QUEUE_ALREADY_ENDED');
    }
    if (streams.length) {
      this.queue(...streams);
    }

    this._ending = true;
    if (!this._running) {
      this.push(null);
    }
    return this;
  }
}

export function queueObjectStreams(
  ...streams: (Readable | StreamQueueFunction)[]
);
export function queueObjectStreams(
  options: Partial<Omit<StreamQueueOptions, 'objectMode'>>,
  ...streams: (Readable | StreamQueueFunction)[]
);
/**
 * Create a new queue in object mode and pipe given streams and end if some
 * @param options {Object} The queue options
 * @param streams {...(Readable|Function)} The stream or stream returning function to pipe in
 * @returns StreamQueue
 */
export function queueObjectStreams(
  maybeOptions:
    | Partial<Omit<StreamQueueOptions, 'objectMode'>>
    | Readable
    | StreamQueueFunction,
  ...restStreams: (Readable | StreamQueueFunction)[]
) {
  const options =
    maybeOptions instanceof Stream || 'function' === typeof maybeOptions
      ? {}
      : maybeOptions || {};
  const streams =
    maybeOptions instanceof Stream || 'function' === typeof maybeOptions
      ? [maybeOptions, ...restStreams]
      : restStreams;

  return new StreamQueue(
    {
      ...options,
      objectMode: true,
    },
    ...streams,
  );
}

export function queueStreams(...streams: (Readable | StreamQueueFunction)[]);
export function queueStreams(
  options: Partial<StreamQueueOptions>,
  ...streams: (Readable | StreamQueueFunction)[]
);
/**
 * Create a new queue and pipe given streams and end if some
 * @param options {Object} The queue options
 * @param streams {...(Readable|Function)} The stream or stream returning function to pipe in
 * @returns StreamQueue
 */
export function queueStreams(
  maybeOptions: Partial<StreamQueueOptions> | Readable | StreamQueueFunction,
  ...restStreams: (Readable | StreamQueueFunction)[]
) {
  const options =
    maybeOptions instanceof Stream || 'function' === typeof maybeOptions
      ? {}
      : maybeOptions || {};
  const streams =
    maybeOptions instanceof Stream || 'function' === typeof maybeOptions
      ? [maybeOptions, ...restStreams]
      : restStreams;
  return new StreamQueue(options, ...streams);
}

export { StreamQueue };
