/*
 * A fixed sized buffer to store messages
 * @flow
 */

'use strict';

class Buffer<T> {
  _buffer: Array<T>;
  _size: number;

  constructor(size: number) {
    this._size = size;
    this._buffer = [];
  }

  clear(): void {
    this._buffer = [];
  }

  push(value: T): void {
    if (this._buffer.length + 1 > this._size) {
      this._buffer.shift();
    }
    this._buffer.push(value);
  }
  get(): Array<T> {
    return this._buffer;
  }
}

module.exports = Buffer;
