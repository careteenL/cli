export interface IAction {
  [key: string]: {
    alias: string;
    description: string;
    examples: string[];
  };
}

export type TAction = 'get' | 'set' | 'remove';

export interface IRC {
  [key: string]: string | number;
}

export type WithFalse<T> = {
  [P in keyof T]?: T[P] | false;
};

export interface IGenerateRule {
  [key: string]: any;
}

export interface VersionInfo {
  latest: string;
  current: string;
}
