import { Module } from '@nestjs/common';

import { TestScriptService } from './services/test-script.service';

@Module({
  providers: [TestScriptService],
  exports: [TestScriptService],
})
export class TestScriptModule {}