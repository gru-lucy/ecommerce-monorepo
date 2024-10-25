import { IsInt, Min } from 'class-validator';

/**
 * Data Transfer Object (DTO) for placing an order.
 *
 * This class validates the quantity of the order using class-validator decorators.
 * The quantity must be an integer and cannot be less than zero.
 */
export class OrderDto {
  @IsInt()
  @Min(0)
  quantity: number;

  /**
   * Constructs an instance of the OrderDto class.
   *
   * Initializes the quantity to 0 by default.
   */
  constructor() {
    this.quantity = 0;
  }
}
