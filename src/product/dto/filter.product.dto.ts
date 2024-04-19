import { ApiProperty } from "@nestjs/swagger";


export class FilterProductDTO {
    
    @ApiProperty()
    search: string;

    @ApiProperty()
    category: string;
  }