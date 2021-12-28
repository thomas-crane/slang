import { OperatorToken, Token, TokenKind, UnaryOperatorToken } from '../ast/token';
import { BufferedIterator } from './buffered-iter';
import { NodeKind } from '../ast/node-kind';
import { Expr } from '../ast/expr';
import { BinaryExpr } from '../ast/expr/binary-expr';
import { UnaryExpr } from '../ast/expr/unary-expr';
import { NumExpr } from '../ast/expr/num-expr';
import { BoolExpr } from '../ast/expr/bool-expr';

const LOOKAHEAD = 1;

function binaryPrecedence(kind: TokenKind): number {
  switch (kind) {
    case NodeKind.StarToken:
    case NodeKind.SlashToken:
      return 5;
    case NodeKind.PlusToken:
    case NodeKind.MinusToken:
      return 4;
    case NodeKind.LeftAngleToken:
    case NodeKind.RightAngleToken:
    case NodeKind.LeftAngleEqualsToken:
    case NodeKind.RightAngleEqualsToken:
    case NodeKind.EqualsEqualsToken:
      return 3;
    default:
      return 0;
  }
}

function isUnaryOperator(token: Token): token is UnaryOperatorToken {
  switch (token.kind) {
    case NodeKind.BangToken:
    case NodeKind.PlusToken:
    case NodeKind.MinusToken:
      return true;
    default:
      return false;
  }
}

export class Parser {
  private readonly tokens: BufferedIterator<Token, Token>;

  constructor(tokens: Iterator<Token, Token>) {
    // needs to have one more than the specified lookahead so that the current token is buffered.
    this.tokens = new BufferedIterator(tokens, LOOKAHEAD + 1);
  }

  consume<T extends TokenKind>(kind: T): Token<T> {
    const current = this.tokens.peek(0).value;
    if (current.kind === kind) {
      return this.tokens.next().value as Token<T>;
    }
    // TODO: report diagnostic.
    return new Token(kind, current.value, current.start, current.end);
  }

  parseExpression(): Expr | undefined {
    while (!this.tokens.peek(0).done) {
      const expr = this.parseBinaryExpression();
      if (expr) {
        return expr;
      }
    }
    return undefined;
  }

  parseBinaryExpression(parentPrecedence = 0): Expr | undefined {
    let left = this.parsePrimaryExpression();
    if (left === undefined) {
      return undefined;
    }

    while (!this.tokens.peek(0).done) {
      // get the precedence of (possibly) the next binary operator.
      const precedence = binaryPrecedence(this.tokens.peek(0).value.kind);
      // if it has no precedence, or its precedence is less than that of its parent, then this bit of the tree is done.
      if (precedence === 0 || precedence <= parentPrecedence) {
        break;
      } else {
        // the token is definitely an operator at this point so blindly consuming is ok.
        const operator = this.consume(this.tokens.peek(0).value.kind);
        // get the right half of the tree.
        const right = this.parseBinaryExpression(precedence);
        if (right === undefined) {
          return undefined;
        }

        left = new BinaryExpr(left, operator as OperatorToken, right);
      }
    }
    return left;
  }

  parseUnaryExpression(): Expr | undefined {
    if (isUnaryOperator(this.tokens.peek(0).value)) {
      const operator = this.consume(this.tokens.peek(0).value.kind);
      const operand = this.parseUnaryExpression();
      if (operand === undefined) {
        return undefined;
      }
      return new UnaryExpr(operator as UnaryOperatorToken, operand);
    } else {
      return this.parsePrimaryExpression();
    }
  }

  parsePrimaryExpression(): Expr | undefined {
    let expr = this.parseTerminalExpression();
    while (!this.tokens.peek(0).done) {
      if (expr === undefined) {
        return undefined;
      }
      switch (this.tokens.peek(0).value.kind) {
        // things like fn call, member access, index expression will go here.
        default:
          return expr;
      }
    }
    return expr;
  }

  parseTerminalExpression(): Expr | undefined {
    // A "terminal" expression is one which is not made up of any smaller sub expressions.
    while (!this.tokens.peek(0).done) {
      switch (this.tokens.peek(0).value.kind) {
        case NodeKind.NumToken:
          return this.parseNumExpr();
        case NodeKind.TrueToken:
        case NodeKind.FalseToken:
          return this.parseBoolExpr();
        default:
          // TODO: report diagnostic.
          this.tokens.next();
      }
    }
    return undefined;
  }

  parseNumExpr(): NumExpr {
    const current = this.consume(NodeKind.NumToken);
    return new NumExpr(current);
  }

  parseBoolExpr(): BoolExpr | undefined {
    const current = this.tokens.peek(0).value;
    if (current.kind === NodeKind.TrueToken || current.kind === NodeKind.FalseToken) {
      const token = this.consume(current.kind);
      return new BoolExpr(token);
    }
    return undefined;
  }
}
