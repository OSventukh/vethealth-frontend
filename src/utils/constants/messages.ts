export const SUCCESS_MESSAGE = {};

export const ERROR_MESSAGE = {
  TITLE_MUST_BE_UNIQUE: 'Такий заголовок вже існує',
  TITLE_SHOULD_BE_NOT_EMPTY: 'Заголовок не повинен бути пустим',
  SLUG_SHOULD_BE_UNIQUE: 'URL адреса повина бути унікальною',
  PASSWORD_IS_NOT_MATCH: 'Пароль повинен містити від 8 до 20 символів і щонайменше одну велику літеру та одну цифру',
} as const;
