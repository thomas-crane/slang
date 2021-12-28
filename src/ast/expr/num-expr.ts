import type { ExprBase } from '../expr';
import { NodeKind } from '../node-kind';
import { Position } from '../position';
import { Token } from '../token';

export class NumExpr implements ExprBase<NodeKind.NumExpr> {
  readonly kind = NodeKind.NumExpr;
  readonly start: Position;
  readonly end: Position;
  readonly value: number;

  constructor(num: Token<NodeKind.NumToken>) {
    this.start = num.start;
    this.end = num.end;
    this.value = parseFloat(num.value);
  }
}
