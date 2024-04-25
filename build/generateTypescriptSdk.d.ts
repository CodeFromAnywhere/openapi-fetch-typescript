export declare const generateTypescriptSdk: {
    (context: {
        openapiUrlOrPath: string;
        cwd?: string;
    }): Promise<{
        isSuccessful: boolean;
        message: string;
        result?: undefined;
    } | {
        isSuccessful: boolean;
        message: string;
        result: string;
    }>;
    config: {
        isPublic: boolean;
    };
};
//# sourceMappingURL=generateTypescriptSdk.d.ts.map