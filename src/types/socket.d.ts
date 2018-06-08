declare namespace APISocket {
  type ErrorType = 'missing_field' | 'invalid' | 'already_exists';

  interface ErrorFull {
    message: string;
    field: string;
    code: ErrorType;
  }

  interface Error {
    code: number;
    message: string;
    json: ErrorFull;
  }
}