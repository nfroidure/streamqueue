# API
## Classes

<dl>
<dt><a href="#StreamQueue">StreamQueue</a></dt>
<dd><p>Pipe queued streams sequentially</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#queueObjectStreams">queueObjectStreams(options, ...streams)</a> ⇒</dt>
<dd><p>Create a new queue in object mode and pipe given streams and end if some</p>
</dd>
<dt><a href="#queueStreams">queueStreams(options, ...streams)</a> ⇒</dt>
<dd><p>Create a new queue and pipe given streams and end if some</p>
</dd>
</dl>

<a name="StreamQueue"></a>

## StreamQueue
Pipe queued streams sequentially

**Kind**: global class  

* [StreamQueue](#StreamQueue)
    * [new StreamQueue(options, ...streams)](#new_StreamQueue_new)
    * [.queue(...streams)](#StreamQueue+queue) ⇒
    * [.done(...streams)](#StreamQueue+done) ⇒

<a name="new_StreamQueue_new"></a>

### new StreamQueue(options, ...streams)
Create a new queue and pipe given streams and end if some

**Returns**: StreamQueue  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The queue options |
| options.objectMode | <code>boolean</code> | Operate in object mode |
| options.pauseFlowingStream | <code>boolean</code> | Pause given streams that are flowing |
| options.resumeFlowingStream | <code>boolean</code> | Resume given streams that are flowing |
| ...streams | <code>Readable</code> \| <code>function</code> | The stream or stream returning function to pipe in |

<a name="StreamQueue+queue"></a>

### streamQueue.queue(...streams) ⇒
Queue each stream given in argument

**Kind**: instance method of [<code>StreamQueue</code>](#StreamQueue)  
**Returns**: StreamQueue  

| Param | Type | Description |
| --- | --- | --- |
| ...streams | <code>Readable</code> \| <code>function</code> | The stream or stream returning function to pipe in |

<a name="StreamQueue+done"></a>

### streamQueue.done(...streams) ⇒
Queue each stream given in argument and end

**Kind**: instance method of [<code>StreamQueue</code>](#StreamQueue)  
**Returns**: StreamQueue  

| Param | Type | Description |
| --- | --- | --- |
| ...streams | <code>Readable</code> \| <code>function</code> | The stream or stream returning function to pipe in |

<a name="queueObjectStreams"></a>

## queueObjectStreams(options, ...streams) ⇒
Create a new queue in object mode and pipe given streams and end if some

**Kind**: global function  
**Returns**: StreamQueue  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The queue options |
| ...streams | <code>Readable</code> \| <code>function</code> | The stream or stream returning function to pipe in |

<a name="queueStreams"></a>

## queueStreams(options, ...streams) ⇒
Create a new queue and pipe given streams and end if some

**Kind**: global function  
**Returns**: StreamQueue  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The queue options |
| ...streams | <code>Readable</code> \| <code>function</code> | The stream or stream returning function to pipe in |

