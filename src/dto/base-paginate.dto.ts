import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { BaseModel } from 'src/entity/base.entity';
import { FindOptionsOrderValue } from 'typeorm/find-options/FindOptionsOrder';

export class BasePaginateDto<T extends BaseModel> {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  lastId?: number;

  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  @IsOptional()
  order?: FindOptionsOrderValue = 'DESC';

  @IsOptional()
  orderField: keyof T = 'id';

  @IsNumber()
  @IsOptional()
  take?: number = 20;
}
