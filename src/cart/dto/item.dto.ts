import { IsString, IsInt, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsString()
  readonly productId: string;

  @IsInt()
  @Min(1)
  readonly quantity: number;
}
