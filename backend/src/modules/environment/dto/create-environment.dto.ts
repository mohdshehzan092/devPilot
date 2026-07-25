import {
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

class VariableDto {
  @IsString()
  @IsNotEmpty()
  key!: string;

  @IsString()
  value!: string;
}

export class CreateEnvironmentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  workspaceId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariableDto)
  variables!: VariableDto[];
}