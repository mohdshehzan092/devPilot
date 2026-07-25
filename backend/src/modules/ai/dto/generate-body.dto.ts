import { IsString } from 'class-validator';

export class GenerateBodyDto {
  @IsString()
  prompt!: string;
}