import { BlogsModel } from 'src/entity/blogs/blog.entity';
import { BasePaginateDto } from '../base-paginate.dto';

export class PaginateBlogDto extends BasePaginateDto<BlogsModel> {}
