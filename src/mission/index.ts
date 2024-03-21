import * as core from '@actions/core';

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { check2 } from './versions/2';
import { check3 } from './versions/3';

// Define the structure of a mission report
export type MissionReport = {
  name: string;
  warnings: string[];
  errors: string[];
  inPR: boolean;
};

export function check(name: string): MissionReport {
  // Construct the path to the mission's description file
  const description_path = join(
    'missions',
    name,
    'do_not_edit/description.ext'
  );

  // If the description file doesn't exist, return a report with an error
  if (!existsSync(description_path)) {
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
  const description = readFileSync(description_path, 'utf8');
  const version_exec = /^sog_template = (\d+);/m.exec(description);
  let version = 2;
  if (version_exec !== null) {
    version = parseInt(version_exec[1]);
  }
  console.log(`${name} - Using template: v${version}`);

  // Depending on the version, call the appropriate check function
  switch (version) {
    case 2:
      let report = check2(name);
      report.warnings.push('`Using old template: v2`');
      return report;
    case 3:
      return check3(name);
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
