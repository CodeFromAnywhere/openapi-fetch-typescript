import { OpenAPI3 } from "openapi-typescript";
export declare const parseOpenapiFromFile: (absoluteOrRelativePath: string, cwd?: string) => Promise<{
    isSuccessful: boolean;
    message: string;
    result?: undefined;
} | {
    isSuccessful: boolean;
    message: string;
    result: OpenAPI3;
}>;
//# sourceMappingURL=parseOpenapiFromFile.d.ts.map