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
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const files_1 = require("./files");
const promises_1 = require("fs/promises");
// import fetch from 'node-fetch';
const mission_1 = require("./mission");
// Main function to run the action
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const reports = [];
        try {
            // Read the 'missions' directory and get the names of all directories in it
            const missions = (yield (0, promises_1.readdir)('missions', { withFileTypes: true }))
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);
            let files = [];
            // If the action was triggered by a pull request, get the files changed in the PR
            if (github.context.payload.pull_request) {
                files = yield new files_1.FileService(core.getInput('GITHUB_TOKEN', { required: true })).getFiles();
                core.debug(files.toString());
            }
            // Check each file in the PR
            for (const file of files) {
                // If the file ends with '.pbo', add a report with an error
                if (file.endsWith('.pbo')) {
                    reports.push({
                        name: file,
                        warnings: [],
                        errors: [
                            '[PBOs are not accepted, only mission folders](https://a3sog.github.io/knowledgebase/#/missions/create-a-new-mission)'
                        ],
                        inPR: files.includes(file)
                    });
                }
            }
            // Check each mission
            for (const mission of missions) {
                core.info(`Checking ${mission}`);
                let report = (0, mission_1.check)(mission);
                // If the mission is in the PR, set inPR to true
                report.inPR = files.find(file => file.includes(mission)) !== undefined;
                reports.push(report);
            }
        }
        catch (error) {
            // If an error occurs, fail the action with the error message
            if (error instanceof Error)
                core.setFailed(error.message);
        }
        // If the action was triggered by a pull request, create a review
        if (github.context.payload.pull_request) {
            const body = [];
            // Check if any reports have errors
            const failed = reports.filter(report => report.inPR && report.errors.length > 0).length >
                0;
            core.debug('Sending comment');
            const octo = github.getOctokit(core.getInput('GITHUB_TOKEN'));
            let options = {
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                pull_number: github.context.payload.pull_request.number,
                body: '',
                event: 'COMMENT'
            };
            // If there are errors, request changes and add the errors to the review body
            if (failed) {
                reports.forEach(report => {
                    if (report.inPR) {
                        body.push(`### ${report.name}`);
                        body.push('');
                        body.push(...report.errors);
                        body.push('');
                    }
                });
                // If there are no errors, approve the PR
                options = Object.assign(Object.assign({}, options), { body: body.join('\n'), event: 'REQUEST_CHANGES' });
            }
            else {
                options = Object.assign(Object.assign({}, options), { body: '', event: 'APPROVE' });
                const comments = yield octo.rest.pulls.listReviews({
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    pull_number: github.context.payload.pull_request.number
                });
                console.log(comments);
            }
            // Create the review
            octo.rest.pulls.createReview(options);
        }
        else {
            core.debug('Not a pull request');
        }
    });
}
// Run the action
run();
