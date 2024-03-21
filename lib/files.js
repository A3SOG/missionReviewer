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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const github_1 = require("@actions/github");
const core = __importStar(require("@actions/core"));
class FileService {
    // Constructor initializes the class with a GitHub token
    constructor(token) {
        this.token = token;
    }
    // This method returns a list of files that have been added or modified in the current PR
    getFiles() {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            let base;
            let head;
            // Determine the event type
            switch (github_1.context.eventName) {
                case 'pull_request':
                    // For pull_request events, get the base and head SHAs from the pull request payload
                    base = (_b = (_a = github_1.context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.base) === null || _b === void 0 ? void 0 : _b.sha;
                    head = (_d = (_c = github_1.context.payload.pull_request) === null || _c === void 0 ? void 0 : _c.head) === null || _d === void 0 ? void 0 : _d.sha;
                    break;
                case 'push':
                    // For push events, get the base and head SHAs from the payload
                    base = github_1.context.payload.before;
                    head = github_1.context.payload.after;
                    // special case for initial creation of branch
                    if (+base === 0) {
                        // If the base SHA is 0, set the base to the base ref or default branch
                        base = github_1.context.payload.base_ref
                            ? github_1.context.payload.base_ref
                            : (_e = github_1.context.payload.repository) === null || _e === void 0 ? void 0 : _e.default_branch;
                        core.info(`Switched Base to (${base}) for initial check-in.`);
                    }
                    break;
                default:
                    throw new Error('action must be used within a pull_request or push event');
            }
            // Log the base and head SHAs
            core.info(`Head SHA: ${head}`);
            core.info(`Base SHA: ${base}`);
            // Compare the comments between the base and head SHAs
            const response = yield (0, github_1.getOctokit)(this.token).rest.repos.compareCommits({
                base,
                head,
                owner: github_1.context.repo.owner,
                repo: github_1.context.repo.repo
            });
            // Filter the response to only include added and modified files
            let files = (_f = response.data.files) === null || _f === void 0 ? void 0 : _f.filter(x => ['added', 'modified'].includes(x.status));
            // log the number of files found
            core.info(`Found (${files === null || files === void 0 ? void 0 : files.length}) ${(files === null || files === void 0 ? void 0 : files.length) === 1 ? 'File' : 'Files'}`);
            // Return the filenames
            return (files === null || files === void 0 ? void 0 : files.map(x => `"${x.filename}"`)) || [];
        });
    }
}
exports.FileService = FileService;
