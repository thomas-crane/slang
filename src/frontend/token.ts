import { NodeBase, NodeKind } from './node-kind';
import { Position } from './position';

export type TokenKind =
  | NodeKind.EndOfFileToken
  | NodeKind.NameToken
  | NodeKind.NumToken
  | NodeKind.TrueToken
  | NodeKind.FalseToken
  | NodeKind.LeftCurlyToken
  | NodeKind.RightCurlyToken
  | NodeKind.LeftParenToken
  | NodeKind.RightParenToken
  | NodeKind.PlusToken
  | NodeKind.MinusToken
  | NodeKind.StarToken
  | NodeKind.SlashToken
  | NodeKind.LeftAngleToken
  | NodeKind.RightAngleToken
  | NodeKind.BangEqualsToken
  | NodeKind.EqualsEqualsToken
  | NodeKind.LeftAngleEqualsToken
  | NodeKind.RightAngleEqualsToken
  | NodeKind.BangToken
  | NodeKind.EqualsToken
  | NodeKind.IfToken
  | NodeKind.ElseToken
  | NodeKind.UnknownToken;

export type OperatorToken =
  | Token<NodeKind.PlusToken>
  | Token<NodeKind.MinusToken>
  | Token<NodeKind.StarToken>
  | Token<NodeKind.SlashToken>
  | Token<NodeKind.LeftAngleToken>
  | Token<NodeKind.RightAngleToken>
  | Token<NodeKind.BangEqualsToken>
  | Token<NodeKind.EqualsEqualsToken>
  | Token<NodeKind.LeftAngleEqualsToken>
  | Token<NodeKind.RightAngleEqualsToken>;

export type UnaryOperatorToken = Token<NodeKind.BangToken> | Token<NodeKind.PlusToken> | Token<NodeKind.MinusToken>;

export class Token<T extends TokenKind = TokenKind> implements NodeBase {
  constructor(
    readonly kind: T,
    readonly value: string,
    readonly start: Position,
    readonly end: Position,
  ) {}
}
