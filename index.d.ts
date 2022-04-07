declare module 'immersive' {
  import { Context } from 'node:vm';
  interface ImmersiveEnvironment extends Record<string, any> {}
  interface ImmersiveEnvironmentConfig extends ImmersiveEnvironment {
    name: string;
  }

  type Helper = (envConfig: ImmersiveEnvironmentConfig) => any;

  interface PromptConfiguration {
    user?: string;
    symbol?: string;
    colors?: {
      prompt?: string;
    };
  }

  interface ImmersiveConfiguration {
    projectName: string;
    displayName?: string;
    commandsDirectory: string;
    helpers: Record<string, Helper>;
    environments: Record<string, ImmersiveEnvironment>;
    defaultEnvironment?: string;
    defaultConfig?: PromptConfiguration;
    disableBanner?: boolean;
  }

  interface Arguments {
    /** Non-option arguments */
    _: string[];
    /** The script name or node command */
    $0: string;
    /** All remaining options */
    [argName: string]: any;
  }

  type ImmersiveLevelLoger = (...args: string[]) => void;

  interface ImmersiveLogger {
    error: ImmersiveLevelLoger;
    warn: ImmersiveLevelLoger;
    info: ImmersiveLevelLoger;
    debug: ImmersiveLevelLoger;
    log: ImmersiveLevelLoger;
    table: ImmersiveLevelLoger;
  }

  interface ImmersiveHistory {
    addEntry: (command: string) => void;
    getPreviousEntry: () => string;
    getNextEntry: () => string;
    clearHistory: () => void;
  }

  type ImmersiveActionInput<Helpers, EnvironmentNames = string, EnvironmentConfig = ImmersiveEnvironment> = Helpers & {
    args: Arguments;
    commands: Record<string, ImmersiveAction<Helpers, EnvironmentNames>>;
    logger: ImmersiveLogger;
    command: string;
    history: ImmersiveHistory;
    runCommand: (command: string, internal: boolean) => Promise<any | void>;
    immersiveConfig: ImmersiveConfiguration;
    config: PromptConfiguration;
    env: EnvironmentNames;
    envConfig: EnvironmentConfig;
  };

  type ImmersiveAction<Helpers, EnvironmentNames = string, EnvironmentConfig = ImmersiveEnvironment, ReturnType = any> = (
    actionInput: ImmersiveActionInput<Helpers, EnvironmentNames, EnvironmentConfig>,
  ) => ReturnType;

  export default function immersive(
    configuration: ImmersiveConfiguration,
  ): void;

  export function repl(context: Context, customEval: any): Promise<void>;
  export function mergeExport<
    T extends Record<string, any> | Function,
    U extends Record<string, any>
  >(mainExport: T): (exports: U) => T & U;
}
