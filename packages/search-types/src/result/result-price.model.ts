/**
 * @public
 * The result price
 */
export interface ResultPrice {
  /**
   * The old value
   */
  originalValue: number;
  /**
   * The current value
   */
  value: number;
  /**
   * Whether or not this result has discount
   */
  hasDiscount: boolean;
}
