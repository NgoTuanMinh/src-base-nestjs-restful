/* eslint-disable max-classes-per-file */
export class RegexUtils {
  static RegexConstants = class {
    static REGEX_EMAIL = '^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$';

    static REGEX_NUMBER_SEVEN_DIGIT = /(?:^|\D)(\d{7})(?!\d)/gm;
  };

  static isEmail(input: string): boolean {
    const re = new RegExp(RegexUtils.RegexConstants.REGEX_EMAIL);
    return re.test(input);
  }

  static checkNumberSevenDigit(input: string): boolean {
    const re = new RegExp(RegexUtils.RegexConstants.REGEX_NUMBER_SEVEN_DIGIT);
    return re.test(input);
  }
}
