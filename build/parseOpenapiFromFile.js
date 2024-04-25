import fs from "node:fs";
import { tryParseJson } from "./tryParseJson.js";
import { tryParseYamlToJson } from "./tryParseYamlToJson.js";
import { getAbsolutePath } from "./getAbsolutePath.js";
export const parseOpenapiFromFile = async (absoluteOrRelativePath, cwd) => {
    const absolutePath = getAbsolutePath(absoluteOrRelativePath, cwd);
    if (!absolutePath) {
        return { isSuccessful: false, message: "Couldn't find file" };
    }
    const yamlOrJson = fs.readFileSync(absolutePath, "utf8");
    const json = tryParseJson(yamlOrJson) ||
        tryParseYamlToJson(yamlOrJson);
    if (!json) {
        return { isSuccessful: false, message: "File could not be parsed" };
    }
    return { isSuccessful: true, message: "Parsed file", result: json };
};
//# sourceMappingURL=parseOpenapiFromFile.js.map