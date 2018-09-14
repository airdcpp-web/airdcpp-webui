declare namespace API {
  interface WebUserBase {
    username: string;
    permissions: string[];
  }

  export interface WebUserInput extends WebUserBase, Partial<UI.FormValueMap> {
    password: string;
  }

  export interface WebUser extends WebUserBase {
    active_sessions: number;
    last_login: number;
  }
}
