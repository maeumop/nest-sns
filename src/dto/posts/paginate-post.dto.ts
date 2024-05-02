import { PostsModel } from 'src/entity/posts/post.entity';
import { BasePaginateDto } from '../base-paginate.dto';

export class PaginatePostDto extends BasePaginateDto<PostsModel> {}
