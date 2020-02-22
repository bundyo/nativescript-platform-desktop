import { LoginResult, PromptResult } from "@nativescript/core/ui/dialogs";
export * from "@nativescript/core/ui/dialogs/dialogs-common";
export declare function alert(arg: any): Promise<void>;
export declare function confirm(arg: any): Promise<boolean>;
export declare function prompt(arg: any): Promise<PromptResult>;
export declare function login(...args: any[]): Promise<LoginResult>;
export declare function action(arg: any): Promise<string>;
