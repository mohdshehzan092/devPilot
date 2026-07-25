import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';

import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { HistoryService } from '../services/history.service';

@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllHistory(@CurrentUser() user: any) {
    return this.historyService.getAllHistory(new Types.ObjectId(user._id));
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getHistoryById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.historyService.getHistoryById(id, new Types.ObjectId(user._id));
  }
  @Delete('delete-history/:id')
  @UseGuards(JwtAuthGuard)
  deleteHistory(@Param('id') id: string, @CurrentUser() user: any) {
    return this.historyService.deleteHistory(id, new Types.ObjectId(user._id));
  }
}
