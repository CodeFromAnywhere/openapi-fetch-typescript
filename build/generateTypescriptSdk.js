import openapiTS, { astToString, } from "openapi-typescript";
import { fetchOpenapi } from "./fetchOpenapi.js";
import { parseOpenapiFromFile } from "./parseOpenapiFromFile.js";
const httpMethods = [
    "post",
    "get",
    "put",
    "patch",
    "delete",
    "options",
    "head",
    "trace",
];
//Create my own codegen function wrapping `typescript-openapi` and make it accessible as api ``
export const generateTypescriptSdk = async (context) => {
    const { openapiUrlOrPath, cwd } = context;
    const isUrl = URL.canParse(openapiUrlOrPath);
    const fetchResult = isUrl ? await fetchOpenapi(openapiUrlOrPath) : undefined;
    const openapiResult = isUrl
        ? fetchResult
            ? {
                isSuccessful: true,
                message: "Fetched",
                result: fetchResult,
            }
            : { isSuccessful: false, message: "Fetch failed" }
        : await parseOpenapiFromFile(openapiUrlOrPath, cwd);
    if (!openapiResult.result) {
        return { isSuccessful: false, message: openapiResult.message };
    }
    const openapi = openapiResult.result;
    const schemaKeys = openapi.components?.schemas
        ? Object.keys(openapi.components.schemas)
        : undefined;
    const ast = await openapiTS(openapi, {});
    const contents = astToString(ast);
    const pathKeys = openapi?.paths ? Object.keys(openapi.paths) : [];
    const operationIds = pathKeys
        .map((path) => {
        const methods = !!openapi?.paths?.[path]
            ? Object.keys(openapi.paths[path]).filter((method) => [...httpMethods].includes(method))
            : [];
        const operationIds = methods.map((method) => {
            // 1) Get the operation Id
            const pathItemObject = openapi?.paths?.[path];
            const operationObject = pathItemObject?.[method];
            const operationId = operationObject?.operationId || `${method}:${path}`;
            return { path, method, operationId };
        });
        return operationIds;
    })
        .flat();
    const operationUrlObject = operationIds
        .map(({ method, operationId, path }) => ({
        [operationId]: { method, path },
    }))
        .reduce((previous, current) => {
        return { ...previous, ...current };
    }, {});
    // console.log({ operationUrlObject });
    const result = `${contents}

${schemaKeys
        ?.map((key) => {
        return `export type ${key} = components["schemas"]["${key}"]`;
    })
        .join("\n")}
  
export const operationUrlObject = ${JSON.stringify(operationUrlObject, undefined, 2)}
export const operationKeys = Object.keys(operationUrlObject);`;
    return { isSuccessful: true, message: "Made script", result };
};
generateTypescriptSdk.config = {
    isPublic: true,
};
//# sourceMappingURL=generateTypescriptSdk.js.map