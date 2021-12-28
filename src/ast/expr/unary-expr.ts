import type { Expr, ExprBase } from '../expr';
import { NodeKind } from '../node-kind';
import { Position } from '../position';
import { UnaryOperatorToken } from '../token';

export class UnaryExpr implements ExprBase<NodeKind.UnaryExpr> {
  readonly kind = NodeKind.UnaryExpr;
  readonly start: Position;
  readonly end: Position;

  constructor(readonly operator: UnaryOperatorToken, readonly operand: Expr) {
    this.start = operator.start;
    this.end = operand.end;
  }
}

