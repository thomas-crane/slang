import type { Expr, ExprBase } from '../expr';
import { NodeKind } from '../node-kind';
import { Position } from '../position';
import { OperatorToken } from '../token';

export class BinaryExpr implements ExprBase<NodeKind.BinaryExpr> {
  readonly kind = NodeKind.BinaryExpr;
  readonly start: Position;
  readonly end: Position;

  constructor(readonly left: Expr, readonly operator: OperatorToken, readonly right: Expr) {
    this.start = left.start;
    this.end = right.end;
  }
}
