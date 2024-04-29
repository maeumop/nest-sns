import { ValidationArguments } from 'class-validator';

export class Util {
  static validatorMsg(args: ValidationArguments) {
    const { object, property } = args;
    return `${property} 필드는 ${object} 타입만 수신 가능합니다.`;
  }

  static validatorLen(args: ValidationArguments) {
    const { value, constraints, property } = args;
    const [min, max] = constraints;

    let message = `${property} 필드는`;

    if (min >= 1 && !value.length) {
      message = `${message} 필수 입력 항목입니다.`;
    } else if (max > 0) {
      message = `${message} ${min} ~ ${max} 자리 입력가능합니다`;
    } else {
      message = `${message} 최소 ${min}자 이상 입력하여야 합니다.`;
    }

    return message;
  }
}
