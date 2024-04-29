import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PasswordPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.length > 8) {
      throw new BadRequestException('비밀번호는 8자 이하로 입력해주세요.');
    }

    return value.toString();
  }
}

@Injectable()
export class MaxLengthPipe implements PipeTransform {
  constructor(
    private readonly target: string,
    private readonly length: number,
  ) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value.length > this.length) {
      throw new BadRequestException(
        `${this.target} 최대 길이는 ${this.length}입니다`,
      );
    }

    return value.toString();
  }
}

@Injectable()
export class MinLengthPip implements PipeTransform {
  constructor(
    private readonly target: string,
    private readonly length: number,
  ) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value.length < this.length) {
      throw new BadRequestException(
        `${this.target} 최소 길이는 ${this.length}입니다`,
      );
    }

    return value.toString();
  }
}
