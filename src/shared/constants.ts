export const KEY = "VALUE"

export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
}

export const REGEX = {
  EMAIL: /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)+$/,
  PHONE: /((09|03|07|08|05)+([0-9]{8})\b)/g,
  USERNAME: /^[\p{L}\p{N}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー－\s]*$/u,
  USERNAME_MIN_LENGTH: 1,
  USERNAME_MAX_LENGTH: 50,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{6,30}$/,
  CARD_NUMBER: /^(\d{4}\s?){4}$/,
  EXPIRATION_DATE: /^(0[1-9]|1[0-2])\/\d{2}$/,
  SECURITY_CODE: /^[0-9]{3,4}$/,
  SECURITY_CODE_REPLACE: /\D/g,
  HOLDER_NAME: /^[A-Z\s]+$/,
  REPLACEMENT: {
      NUMBER: /\d/
  }
}

export const JWT_EXCEPTION_STATUS = {
  TokenInvalid: "TokenInvalid",
  TokenExpired: "TokenExpired",
  TokenRequired: "TokenRequired"
}


export const MASK = {
  CARD_NUMBER: "____ ____ ____ ____",
  EXPIRATION_DATE: "__/__",
  SECURITY_CODE: "___",
}

export const DATE_FORMAT = {
  DATETIME_FORMAT: "yyyy/MM/dd HH:mm:ss",
  DATETIME_FORMAT_DMYHM: "dd-MM-yyyy HH:mm",
  DATETIME_FORMAT_DMYHMS: "dd/MM/yyyy HH:mm:ss",
  DATETIME_FORMAT_DMYHHMM: "dd/MM/yyyy HH:mm",
  DATETIME_FORMAT_YMDHMS: "yyyy-MM-DD HH:mm:ss",
  DATETIME_FORMAT_YMDHM: "yyyy-MM-dd HH:mm",
  DATE_FORMAT_YMD: "yyyy-MM-dd",
  DATE_FORMAT_DMY: "dd-MM-yyyy",
  DATE_FORMAT_DMY_02: "dd/MM/yyyy",
  DATE_FORMAT_YM_01: "yyyyMM",
  HOUR_FORMAT: "HH:mm",
  YYYYMMDD_FORMAT: "yyyy/MM/DD",
  DATE_FORMAT_YMD_NEW: "yyyy.MM.DD",
  YYYYMMDDHHmmss: "YYYYMMDDHHmmss",
}

export const PUNCTUATION = {
  COMMA: ",",
  DOT: ".",
  COLON: ":",
  SEMICOLON: ";",
  HYPHEN: "-",
  UNDERSCORE: "_",
  SLASH: "/",
  BACKSLASH: "\\",
  PIPE: "|",
  PLUS: "+",
  MINUS: "-",
  ASTERISK: "*",
  TILDE: "~",
  EXCLAMATION: "!",
  AT: "@",
  HASH: "#",
  DOLLAR: "$",
  PERCENT: "%",
  CARET: "^",
  AMPERSAND: "&",
  AND: "and",
  LEFT_PARENTHESIS: "(",
  RIGHT_PARENTHESIS: ")",
  LEFT_BRACKET: "[",
  RIGHT_BRACKET: "]",
  LEFT_BRACE: "{",
  RIGHT_BRACE: "}",
  EQUAL: "=",
  QUOTE: "'",
  DOUBLE_QUOTE: "\"",
  QUESTION: "?",
  LESS_THAN: "<",
  GREATER_THAN: ">",
  GRAVE_ACCENT: "`",
  NEW_LINE: "\n",
  CARRIAGE_RETURN: "\r",
  TAB: "\t",
  SPACE: " ",
}


export const STEP = {
  EMAIL: 0,
  STEP_1: 1,
  STEP_2: 2,
  STEP_3: 3,
  STEP_4: 4,
  COMPLETE: 5
}

export const SHOP_ID = 'tshop00065639'

export const PAYMENT_METHOD = {
  CREDIT_CARD: 'credit_card',
}

export const USER_TYPE = {
  DEFAULT: "DEFAULT",
  PREMIUM: "PREMIUM"
}

export const EVENT_TYPE = {
  DEFAULT: "DEFAULT",
  PREMIUM: "PREMIUM"
}

export const STATUS_TOAST = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info"
}

export const GENDER = {
  MALE: '1',
  FEMALE: '2',
  OTHER: '3',
  DO_NOT_WANT_TO_ANSWER: '4'
}

export const ROLE = {
  ADMIN: "admin",
  USER: "user"
}


export const RESET_PASSWORD_MESSAGE = {
  EMAIL:{
      REQUIRED: "※メールアドレスを入力してください。",
      FORMAT: "メールアドレスを正しい形式で入力してください。",
      EXIST: "このメールアドレスは存在しないので、再度ご確認ください。"
  },
  NEW_PASSWORD: {
      REQUIRED: "※パスワードを入力してください。",
      FORMAT: "パスワードは半角英数字6〜30文字で入力してください。"
  },
  CONFIRM_PASSWORD: "パスワードが一致しません。ご確認の上、再度入力してください。",
  TOKEN_VALID : "TOKEN_IS_INVALID",
  FAILED: "RESET_PASSWORD_FAILED"
}
export const VALIDATION_LOGIN = {
  EMAIL:{
      REQUIRED: "※メールアドレスを入力してください",
      FORMAT: "メールアドレスを正しい形式で入力してください。"
  },
  PASSWORD: {
      REQUIRED: "※パスワードを入力してください",
      FORMAT: "パスワードは半角英数字6〜30文字で入力してください。"
  },
  FAILED: "メールアドレスまたはパスワードに誤りがあります。ご確認の上、再度入力してください。"
};

export const VALIDATION_REGISTER = {
  EMAIL: {
      REQUIRED: "メールアドレスを入力してください。",
      FORMAT: "メールアドレスを正しい形式で入力してください。",
      UNIQUE: "このメールアドレスは既に登録されているため、新規登録には使用できません。"
  },
  USERNAME: {
      REQUIRED: "ユーザー名を入力してください。",
      FORMAT: "ユーザー名は文字（特殊文字を除く）で入力してください。",
      UNIQUE: "ユーザー名は既に存在します",
      MIN_LENGTH: "ユーザー名は1〜50文字で入力してください。",
      MAX_LENGTH: "ユーザー名は1〜50文字で入力してください。"
  },
  PASSWORD: {
      REQUIRED: "パスワードを入力してください。",
      FORMAT: "パスワードは半角英数字6〜30文字で入力してください。",
      CONFIRM: "パスワードが一致しません。入力内容をご確認ください。"
  },
  DATE_OF_BIRTH: {
      REQUIRED: "生年月日を入力してください。",
  },
  GENDER: {
      REQUIRED: "性別を選択してください。",
  },
}