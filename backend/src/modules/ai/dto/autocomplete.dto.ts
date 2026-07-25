import { IsString } from 'class-validator';

export class AutocompleteDto {
  @IsString()
  text!: string;
}