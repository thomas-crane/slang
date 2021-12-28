export class Position {
  /**
   * Creates an "empty" position which is good for testing.
   *
   * @static
   * @return The position.
   */
  static empty(): Position {
    return new Position(1, 1, 0);
  }

  constructor(
    /**
     * The 1-based line of this position.
     */
    readonly ln: number,
    /**
     * The 1-based col of this position.
     */
    readonly col: number,
    /**
     * The 0-based index at which this position appears.
     */
    readonly index: number,
  ) {}
}
