import { CreateEnvironmentDto } from './create-environment.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateEnvironmentDto extends PartialType(
  CreateEnvironmentDto,
) {}