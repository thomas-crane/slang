export class BufferedIterator<TRet, TNext> implements Iterator<TRet, TNext>, Iterable<TRet | TNext> {
  private readonly inner: Iterator<TRet, TNext>;
  private buf: IteratorResult<TRet, TNext>[];

  constructor(iter: Iterator<TRet, TNext>, bufSize: number) {
    if (bufSize < 1) {
      throw new Error('bufSize must be greater than zero.');
    }
    this.inner = iter;
    this.buf = [];
    for (let i = 0; i < bufSize; i++) {
      this.buf.push(this.inner.next());
    }
  }

  next() {
    const current = this.buf.shift()!;
    this.buf.push(this.inner.next());
    return current;
  }

  peek(at: number): IteratorResult<TRet, TNext> {
    if (at >= this.buf.length) {
      throw new Error(`Cannot peek at ${at} because the size of the buffer is ${this.buf.length}`);
    }
    return this.buf[at]!;
  }

  [Symbol.iterator]() {
    return this;
  }
}

