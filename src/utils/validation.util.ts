import { HttpException, HttpStatus } from '@nestjs/common';

export const fullWidthRule =
  /^([^\x20-\x7eｦ-ﾝﾞﾟ｡｢｣､･]|[()&',-.・（）＆’，ー。・]|[0-9a-zA-Z ])+$/; //name,
export const hiraganaOnlyRule =
  /^([ぁ-ん　]|[()&',-.・（）＆’，ー。・]|[0-9a-zA-Z])+$/;
export const cityRule = /^[^\x20-\x7e]+$/;
export const characterRule =
  /^([^\x20-\x7e]|[0-9a-zA-Z ()&',-.・（）＆’，ー。・])+$/;
export const zipCodeRule = /^[0-9]{3}[0-9]{4}$/;
export const bankAccountNumberRule = /^\d+$/;
export const halfWidthKanaRule = /^[ｦ-ﾝﾞﾟ｡｢｣､･ ]+$/;
export const unionBankReceiverNameRule = /^[ｦ-ﾝﾞﾟ｡｢｣､･() ]+$/;
export const characterWithSomeSymbolRule =
  /^([^\x20-\x7e]|[0-9a-zA-Z ()&',-.・（）＆’，ー。・])+$/;
export const characterTypeRule = /^\w+$/;
export const unionCodeRule = /^[0-9]{4}$/;
export const companyNameRule =
  /^([^\x20-\x7eｦ-ﾝﾞﾟ｡｢｣､･ ]|[0-9a-zA-Z ]|[&',-.･()])+$/;
export const companyAddressRule = /^([^\x20-\x7e]|[&',-.･]|[0-9a-zA-Z ])+$/;
export const hiragaraAndNumberRule =
  /^([ぁ-ん　]|[()&',-.・（）＆’，ー。・]|[0-9a-zA-Z])+$/;
export const fullwidthAndNumberRule =
  /^([^\x20-\x7eｦ-ﾝﾞﾟ｡｢｣､･]|[()&',-.・]|[0-9a-zA-Z ])+$/;
export const characterWithFullSomeSymbolRule =
  /^([^\x20-\x7e]|[0-9a-zA-Z ()&',-.・~^*!"#$%+`/{}[:;,<>.@_=， ． ： ； ！ ？ ＂ ＇ ｀ ＾ ～ ￣ ＿ ＆ ＠ ＃ ％ ＋ － ＊ ＝ ＜ ＞ （ ） ［ ］ ｛ ｝ ｟ ｠ ｜ ￤ ／ ＼ ￢ ＄ ￡ ￠ ￦ ￥])+$/;
export const onlyNumber = /^[0-9]+$/;
export const passwordRule = /^(?=.*?\d)(?=.*?[a-z])[a-z\d]+$/;
