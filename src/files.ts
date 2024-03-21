import { getOctokit, context } from '@actions/github';
import * as core from '@actions/core';

export class FileService {
  private readonly token: string;

  // Constructor initializes the class with a GitHub token
  constructor(token: string) {
    this.token = token;
  }

  // This method returns a list of files that have been added or modified in the current PR
  async getFiles(): Promise<string[]> {
    let base: string;
    let head: string;

    // Determine the event type
    switch (context.eventName) {
      case 'pull_request':
        // For pull_request events, get the base and head SHAs from the pull request payload
        base = context.payload.pull_request?.base?.sha;
        head = context.payload.pull_request?.head?.sha;
        break;
      case 'push':
        // For push events, get the base and head SHAs from the payload
        base = context.payload.before;
        head = context.payload.after;

        // special case for initial creation of branch
        if (+base === 0) {
          // If the base SHA is 0, set the base to the base ref or default branch
          base = context.payload.base_ref
            ? context.payload.base_ref
            : context.payload.repository?.default_branch;
          core.info(`Switched Base to (${base}) for initial check-in.`);
        }
        break;
      default:
        throw new Error(
          'action must be used within a pull_request or push event'
        );
    }

    // Log the base and head SHAs
    core.info(`Head SHA: ${head}`);
    core.info(`Base SHA: ${base}`);

    // Compare the comments between the base and head SHAs
    const response = await getOctokit(this.token).rest.repos.compareCommits({
      base,
      head,
      owner: context.repo.owner,
      repo: context.repo.repo
    });

    // Filter the response to only include added and modified files
    let files = response.data.files?.filter(x =>
      ['added', 'modified'].includes(x.status)
    );

    // log the number of files found
    core.info(
      `Found (${files?.length}) ${files?.length === 1 ? 'File' : 'Files'}`
    );

    // Return the filenames
    return files?.map(x => `"${x.filename}"`) || [];
  }
}
