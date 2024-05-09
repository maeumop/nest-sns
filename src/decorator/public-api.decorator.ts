import { SetMetadata } from '@nestjs/common';

export const PUBLIC_API_KEY = 'public';

// 해당 사용자 데코레이터를 통해 Global로 설정된 AccessTokenGuard를 통과 하여
// 로그인 하지 않은 사용자도 API에 접근이 가능하도록 설정
// true는 별다른 의미 없음
export const PublicAPI = () => SetMetadata(PUBLIC_API_KEY, true);
