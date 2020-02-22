import * as httpModule from "@nativescript/core/http";
export declare enum HttpResponseEncoding {
    UTF8 = 0,
    GBK = 1
}
export declare function request(options: httpModule.HttpRequestOptions): Promise<httpModule.HttpResponse>;
export declare function addHeader(headers: httpModule.Headers, key: string, value: string): void;
