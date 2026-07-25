import { Body, Controller, Post } from '@nestjs/common';

import { AutocompleteDto } from '../dto/autocomplete.dto';
import { AiService } from '../services/ai.service';
import { GenerateBodyDto } from '../dto/generate-body.dto';
import { SummarizeResponseDto } from '../dto/summarize-response.dto';
import { GenerateTestsDto } from '../dto/generate-tests.dto';
import { ModifyBodyDto } from '../dto/modify-body.dto';
import { ExplainErrorDto } from '../dto/explain-error.dto';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
  ) {}

  @Post('generate-body')
  generateBody(
    @Body() dto: GenerateBodyDto,
  ) {
    return this.aiService.generateBody(
      dto.prompt,
    );
  }
  @Post('summarize')
summarize(
  @Body() dto: SummarizeResponseDto,
) {
  return this.aiService.summarize(
    dto.response,
  );
}
@Post('generate-tests')
generateTests(
  @Body() dto: GenerateTestsDto,
) {
  return this.aiService.generateTests(
    dto.response,
  );
}
@Post('autocomplete')
autocomplete(
  @Body() dto: AutocompleteDto,
) {
  return this.aiService.autocomplete(dto.text);
}
@Post('modify-body')
modifyBody(
  @Body() dto: ModifyBodyDto,
) {
  return this.aiService.modifyBody(
    dto.body,
    dto.instruction,
  );
}
@Post('explain-error')
explainError(
  @Body() dto: ExplainErrorDto,
) {
  return this.aiService.explainError(
    dto.error,
  );
}
}