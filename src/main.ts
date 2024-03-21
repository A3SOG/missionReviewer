import * as core from '@actions/core';
import * as github from '@actions/github';

import { FileService } from './files';
import { readdir } from 'fs/promises';
// import fetch from 'node-fetch';
import { MissionReport, check } from './mission';

// Main function to run the action
async function run(): Promise<void> {
  const reports: MissionReport[] = [];

  try {
    // Read the 'missions' directory and get the names of all directories in it
    const missions = (await readdir('missions', { withFileTypes: true }))
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    let files: string[] = [];
    // If the action was triggered by a pull request, get the files changed in the PR
    if (github.context.payload.pull_request) {
      files = await new FileService(
        core.getInput('GITHUB_TOKEN', { required: true })
      ).getFiles();
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
      let report = check(mission);
      // If the mission is in the PR, set inPR to true
      report.inPR = files.find(file => file.includes(mission)) !== undefined;
      reports.push(report);
    }
  } catch (error) {
    // If an error occurs, fail the action with the error message
    if (error instanceof Error) core.setFailed(error.message);
  }

  // If the action was triggered by a pull request, create a review
  if (github.context.payload.pull_request) {
    const body: string[] = [];
    // Check if any reports have errors
    const failed =
      reports.filter(report => report.inPR && report.errors.length > 0).length >
      0;

    core.debug('Sending comment');
    const octo = github.getOctokit(core.getInput('GITHUB_TOKEN'));
    let options: {
      owner: string;
      repo: string;
      pull_number: number;
      body: string;
      event: 'COMMENT' | 'APPROVE' | 'REQUEST_CHANGES';
    } = {
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
      options = {
        ...options,
        body: body.join('\n'),
        event: 'REQUEST_CHANGES'
      };
    } else {
      options = {
        ...options,
        body: '',
        event: 'APPROVE'
      };
      const comments = await octo.rest.pulls.listReviews({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: github.context.payload.pull_request.number
      });
      console.log(comments);
    }
    // Create the review
    octo.rest.pulls.createReview(options);
  } else {
    core.debug('Not a pull request');
  }
}

// Run the action
run();
