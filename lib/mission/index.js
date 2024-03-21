"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = void 0;
const core = __importStar(require("@actions/core"));
const fs_1 = require("fs");
const path_1 = require("path");
const _2_1 = require("./versions/2");
const _3_1 = require("./versions/3");
function check(name) {
    // Construct the path to the mission's description file
    const description_path = (0, path_1.join)('missions', name, 'do_not_edit/description.ext');
    // If the description file doesn't exist, return a report with an error
    if (!(0, fs_1.existsSync)(description_path)) {
        core.info(`${name} - Not using template`);
        return {
            name,
            warnings: [],
            errors: [
                '[Not using template](https://github.com/A3SOG/MissionTemplate)'
            ],
            inPR: false
        };
    }
    // Read the description file and extract the template version
    const description = (0, fs_1.readFileSync)(description_path, 'utf8');
    const version_exec = /^sog_template = (\d+);/m.exec(description);
    let version = 2;
    if (version_exec !== null) {
        version = parseInt(version_exec[1]);
    }
    console.log(`${name} - Using template: v${version}`);
    // Depending on the version, call the appropriate check function
    switch (version) {
        case 2:
            let report = (0, _2_1.check2)(name);
            report.warnings.push('`Using old template: v2`');
            return report;
        case 3:
            return (0, _3_1.check3)(name);
        default:
            // If the version is unknown, return a report with an error
            return {
                name,
                warnings: [],
                errors: [`Unknown version: ${version}`],
                inPR: false
            };
    }
}
exports.check = check;
