import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CategoryDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;
}
