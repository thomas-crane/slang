import type { ExprBase } from '../expr';
import { NodeKind } from '../node-kind';
import { Position } from '../position';
import { Token } from '../token';

export class BoolExpr implements ExprBase<NodeKind.BoolExpr> {
  readonly kind = NodeKind.BoolExpr;
  readonly start: Position;
  readonly end: Position;
  readonly value: boolean;

  constructor(bool: Token<NodeKind.TrueToken | NodeKind.FalseToken>) {
    this.start = bool.start;
    this.end = bool.end;
    this.value = bool.kind === NodeKind.TrueToken;
  }
}
