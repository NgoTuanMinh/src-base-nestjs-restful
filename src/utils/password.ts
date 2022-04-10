import { hashSync, genSaltSync, compareSync } from 'bcryptjs';
import { SALT_ROUND } from 'src/common/constant';

export class PasswordUtil {
  /**
   * genarate password with bcrypt
   * @param orgPassword
   * @returns
   */
  static hashPassword(orgPassword: string) {
    if (orgPassword === '') {
      throw Error('IDとパスポートは必ずご入力ください。');
    }
    const password = hashSync(orgPassword, genSaltSync(SALT_ROUND));
    return password;
  }

  /**
   * compare input password with hash password
   * @param orgPassword
   * @param hashPassword
   * @returns
   */
  static comparePassword(orgPassword: string, hashPassword: string) {
    if (orgPassword === '' || hashPassword === '') {
      console.log('not compare');
    }
    return compareSync(orgPassword, hashPassword);
  }

  /**
   * validate email by regix
   * @param email
   * @param regex
   * @returns
   */
  static validateEmail(email: string, regex: string): boolean {
    let rs = false;
    if (email.match(regex)) {
      rs = true;
    }
    return rs;
  }

  /**
   *
   * @param len
   * @returns
   */
  static generatePassword(len: number): string {
    const length = len > 0 ? len : 6;
    const alphabetString = 'abcdefghijklmnopqrstuvwxyz';
    const numberString = '0123456789';
    let password = '';
    let character = '';
    while (password.length < length) {
      const index1 =
        Math.ceil(alphabetString.length * Math.random()) * Math.random();
      const index2 =
        Math.ceil(numberString.length * Math.random()) * Math.random();
      const hole = alphabetString.charCodeAt(index1);
      character += String.fromCharCode(hole);
      character += numberString.charCodeAt(index2);
      password = character;
    }
    password = password
      .split('')
      .sort(() => {
        return 0.5 - Math.random();
      })
      .join('');
    return password.substring(0, length);
  }
}
