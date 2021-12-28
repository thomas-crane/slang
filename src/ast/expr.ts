import { BinaryExpr } from './expr/binary-expr';
import { BoolExpr } from './expr/bool-expr';
import { NumExpr } from './expr/num-expr';
import { UnaryExpr } from './expr/unary-expr';
import { NodeBase, NodeKind } from './node-kind';

export type ExprKind =
  | NodeKind.NameExpr
  | NodeKind.NumExpr
  | NodeKind.BoolExpr
  | NodeKind.BinaryExpr
  | NodeKind.UnaryExpr;

export interface ExprBase<T extends ExprKind = ExprKind> extends NodeBase {
  readonly kind: T;
}

export type Expr = 
  | NumExpr
  | BoolExpr
  | BinaryExpr
  | UnaryExpr;
