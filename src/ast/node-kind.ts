import { Position } from './position';

export enum NodeKind {
  /* Tokens */
  EndOfFileToken,

  // Literals.
  NameToken,
  NumToken,
  TrueToken,
  FalseToken,

  // Parens.
  LeftCurlyToken,
  RightCurlyToken,
  LeftParenToken,
  RightParenToken,

  /* Operators. */
  // Arithmetic.
  PlusToken,
  MinusToken,
  StarToken,
  SlashToken,
  // Comparison.
  LeftAngleToken,
  RightAngleToken,
  BangEqualsToken,
  EqualsEqualsToken,
  LeftAngleEqualsToken,
  RightAngleEqualsToken,
  // Misc.
  BangToken,
  EqualsToken,

  // Keywords.
  IfToken,
  ElseToken,

  UnknownToken,
  /* ------ */

  /* Expressions */
  NameExpr,
  NumExpr,
  BoolExpr,

  BinaryExpr,
  UnaryExpr,
  /* ------------ */
}

export interface NodeBase {
  readonly kind: NodeKind;
  readonly start: Position;
  readonly end: Position;
}
