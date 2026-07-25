import { IsObject } from 'class-validator';

export class GenerateTestsDto {
  @IsObject()
  response!: any;
}