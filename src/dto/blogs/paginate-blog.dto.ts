import { BlogsModel } from 'src/entity/posts/blog.entity';
import { BasePaginateDto } from '../base-paginate.dto';

export class PaginateBlogDto extends BasePaginateDto<BlogsModel> {}
