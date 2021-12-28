import { NodeKind } from '../ast/node-kind';
import { Position } from '../ast/position';
import { Token, TokenKind } from '../ast/token';
import { match } from './utils';

const isWhitespace = match(/\s/);
const isDigit = match(/[0-9]/);
const isIdHead = match(/[A-Za-z_]/);
const isIdBody = match(/[0-9A-Za-z_]/);

const punctuation: Record<string, TokenKind> = {
  '{': NodeKind.LeftCurlyToken,
  '}': NodeKind.RightCurlyToken,
  '(': NodeKind.LeftParenToken,
  ')': NodeKind.RightParenToken,

  '+': NodeKind.PlusToken,
  '-': NodeKind.MinusToken,
  '*': NodeKind.StarToken,
  '/': NodeKind.SlashToken,

  '<': NodeKind.LeftAngleToken,
  '>': NodeKind.RightAngleToken,
  '!=': NodeKind.BangEqualsToken,
  '==': NodeKind.EqualsEqualsToken,
  '<=': NodeKind.LeftAngleEqualsToken,
  '>=': NodeKind.RightAngleEqualsToken,

  '!': NodeKind.BangToken,
  '=': NodeKind.EqualsToken,
};

const keywords: Record<string, TokenKind> = {
  true: NodeKind.TrueToken,
  false: NodeKind.FalseToken,
  if: NodeKind.IfToken,
  else: NodeKind.ElseToken,
};

export function* tokenise(src: string): Generator<Token, Token> {
  let idx = 0;
  let colIdx = 0;
  let ln = 1;

  function atEnd() {
    return idx >= src.length;
  }

  function collectNums(): string {
    let buf = '';
    do {
      buf += src[idx++];
    } while (!atEnd() && isDigit(src[idx]));
    return buf;
  }

  function lastPos(): Position {
    return new Position(ln, idx - colIdx - 1, idx);
  }

  function nextToken(): Token {
    // Skip whitespace.
    while (!atEnd() && isWhitespace(src[idx])) {
      if (src[idx] === '\n') {
        ln++;
        colIdx = idx;
      }
      idx++;
    }

    // EOF.
    if (atEnd()) {
      return new Token(
        NodeKind.EndOfFileToken,
        '',
        new Position(ln, idx - colIdx, idx),
        new Position(ln, idx - colIdx, idx),
      );
    }

    // Numbers.
    if (isDigit(src[idx])) {
      // Get the integral part.
      const start = new Position(ln, idx - colIdx, idx);
      let buf = collectNums();
      // Check if there is a dot and then more numbers.
      if (src[idx] === '.' && isDigit(src[idx + 1])) {
        // Don't forget to add the dot.
        buf += src[idx++];
        buf += collectNums();
      }
      return new Token(NodeKind.NumToken, buf, start, lastPos());
    }

    // Identifiers and keywords.
    if (isIdHead(src[idx])) {
      let buf = '';
      const start = new Position(ln, idx - colIdx, idx);
      do {
        buf += src[idx++];
      } while (!atEnd() && isIdBody(src[idx]));

      let type = keywords[buf];
      if (type === undefined) {
        type = NodeKind.NameToken;
      }
      return new Token(type, buf, start, lastPos());
    }

    // Punctuation.
    const start = idx;
    let buf = src[idx++]!;
    let type = punctuation[buf];
    if (type === undefined) {
      type = NodeKind.UnknownToken;
    }
    // Check if a 2 char operator is possible.
    if (!atEnd() && punctuation[buf + src[idx]!] !== undefined) {
      buf += src[idx++]!;
      type = punctuation[buf]!;
    }
    return new Token(type, buf, new Position(ln, start - colIdx, start), lastPos());
  }

  let token = nextToken();
  while (token.kind !== NodeKind.EndOfFileToken) {
    yield token;
    token = nextToken();
  }
  return token;
}
