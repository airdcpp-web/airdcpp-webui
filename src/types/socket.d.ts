declare namespace APISocket {
  type ErrorType = 'missing_field' | 'invalid' | 'already_exists';

  interface ErrorFull {
    message: string;
    field: string;
    code: ErrorType;
  }

  interface ErrorBase {
    code: number;
    message: string;
  }

  interface Error extends ErrorBase {
    json: ErrorFull;
  }
}