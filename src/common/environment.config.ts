import * as dotenv from 'dotenv';
import { VALIDATION_LANGUAGE } from '.';
const configEnv = dotenv.config();
const getConfigEnv = configEnv?.parsed;
const config = {
  expireTime: getConfigEnv.EXPRIE_TIME
    ? parseInt(getConfigEnv.EXPRIE_TIME, 10)
    : 3600,
  expireTimeRefreshToken: getConfigEnv.EXPRIRE_REFRESH_TOKEN_TIME
    ? parseInt(getConfigEnv.EXPRIRE_REFRESH_TOKEN_TIME, 10)
    : 86400,
  jwtSecretKey: getConfigEnv?.JWT_SECRET_KEY
    ? getConfigEnv.JWT_SECRET_KEY
    : 'sikatalk.com@copyright',
  validationLanguage: getConfigEnv?.VALIDATION_LANGUAGE
    ? getConfigEnv.VALIDATION_LANGUAGE.toLowerCase()
    : VALIDATION_LANGUAGE.JP,
  redisHost: getConfigEnv?.REDIS_HOST
    ? getConfigEnv.REDIS_HOST
    : 'prod-shika-redis.izxuhu.ng.0001.apne1.cache.amazonaws.com',
  redisPort: getConfigEnv?.REDIS_PORT
    ? parseInt(getConfigEnv.REDIS_PORT)
    : 6379,
};
export { config };
