import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  Max,
  MaxLength,
  IsOptional,
  Min,
  IsString,
} from 'class-validator';

export class SetGoalTimeDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: '목표 시간 설정',
    example: 30,
    required: true,
  })
  readonly goalTime: number;
}