import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsString()
  @ApiProperty()
  readonly productId: string;

  @IsInt()
  @Min(1)
  @ApiProperty()
  readonly quantity: number;
}
