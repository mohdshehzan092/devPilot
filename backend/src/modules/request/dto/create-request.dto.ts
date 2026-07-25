import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { RequestMethod } from '../../../common/enums/request-method.enum';
import { BodyType } from '../../../common/types/body-type.enum';
import { KeyValue } from '../../../common/types/key-value.type';
import type { RequestAuth } from 'src/common/types/auth.type';

export class CreateRequestDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(RequestMethod)
  method!: RequestMethod;

  @IsString()
  url!: string;

  @IsMongoId()
  workspaceId!: string;

  @IsMongoId()
  collectionId!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KeyValue)
  headers?: KeyValue[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KeyValue)
  queryParams?: KeyValue[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KeyValue)
  pathParams?: KeyValue[];

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsEnum(BodyType)
  bodyType?: BodyType;

  
  @IsOptional()
    auth?: any;

  @IsOptional()
  @IsString()
  aiPrompt?: string;

  @IsOptional()
  @IsString()
  environmentId?: string;

  @IsOptional()
  @IsString()
  testScript?: string;
}