import * as core from '@actions/core';

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import { MissionReport } from '..';

// Regular expressions to match different parts of the description.ext file
const regex_desc_name = /^onLoadName = "(.+?)";$/m;
const regex_desc_summary = /^onLoadMission = "(.+?)";$/m;
const regex_desc_author = /^author = "(.+?)";$/m;

// Function to check a mission using the 3rd version of the template
export function check3(name: string): MissionReport {
  // Initialize the report
  const report: MissionReport = {
    name,
    warnings: [],
    errors: [],
    inPR: false
  };

  // Construct the path to the mission's description file
  const description_path = join('missions', name, 'edit_me/description.ext');
  // If the description file doesn't exist, add an error to the report and return it
  if (!existsSync(description_path)) {
    core.info(`${name} - Not using template`);
    report.errors.push(
      '[Not using template](https://github.com/A3SOG/MissionTemplate)'
    );
    return report;
  }
  // Read the description file
  const description = readFileSync(description_path, 'utf8');

  // Check the name, summary, and author in the description
  if (regex_desc_name.exec(description) === null) {
    core.error(`${name} - description: Name not set (onLoadName)`);
    report.errors.push(
      `[description.ext: Name not set (onLoadName)](https://a3sog.github.io/knowledgebase/#/missions/mission-details)`
    );
  }
  if (regex_desc_summary.exec(description) === null) {
    core.error(`${name} - description: Summary not set (onLoadMission)`);
    report.errors.push(
      `[description.ext: Summary not set (onLoadMission)](https://a3sog.github.io/knowledgebase/#/missions/mission-details)`
    );
  }
  if (regex_desc_author.exec(description) === null) {
    core.error(`${name} - description: Author not set (author)`);
    report.errors.push(
      `[description.ext: Author not set (author)](https://a3sog.github.io/knowledgebase/#/missions/mission-details)`
    );
  }

  // Construct the path to the mission file
  const mission_path = join('missions', name, 'mission.sqm');
  // If the mission file doesn't exist, add an error to the report
  if (!existsSync(mission_path)) {
    core.error(`${name} - mission.sqm not found`);
  }
  // If the mission file exists, read it
  if (existsSync(mission_path)) {
    const mission = readFileSync(mission_path, 'utf8');
    if (mission.startsWith('version')) {
      // Mission - Spectator Screen
      // if (!mission.includes('type="synixe_spectator_screen"')) {
      //   core.error(`${name} - mission.sqm: Spectator Screen not found`);
      //   report.errors.push(
      //     `[Spectator Screen not found](https://a3sog.github.io/knowledgebase/#/missions/setup-base)`
      //   );
      // }

      // Mission - Check Respawn
      // if (!mission.includes('name="respawn"')) {
      //   core.error(`${name} - mission.sqm: Respawn not found`);
      //   report.errors.push(
      //     `[Respawn not found](https://a3sog.github.io/knowledgebase/#/missions/setup-base)`
      //   );
      // }

      // Mission - Check Shop
      // if (!mission.includes('property="crate_client_gear_attribute_shop"')) {
      //   core.error(`${name} - mission.sqm: Shop not found`);
      //   report.errors.push(
      //     `[Shop not found](https://a3sog.github.io/knowledgebase/#/missions/setup-shops)`
      //   );
      // }

      // Mission - Has Contractors
      // if (!mission.includes('description="Contractor"')) {
      //   core.error(`${name} - mission.sqm: No "Contractor" units found`);
      //   report.errors.push(
      //     `[No "Contractor" units found](https://a3sog.github.io/knowledgebase/#/missions/setup-the-players)`
      //   );
      // }

      // Mission - Uses Synixe Unit Class
      // if (!mission.includes('type="synixe_contractors_Unit_I_Contractor"')) {
      //   core.error(
      //     `${name} - mission.sqm: No "synixe_contractors_Unit_I_Contractor" units found`
      //   );
      //   report.errors.push(
      //     `[No "synixe_contractors_Unit_I_Contractor" units found](https://a3sog.github.io/knowledgebase/#/missions/setup-the-players)`
      //   );
      // }

      // Mission - Playable Units
      if (!mission.includes('isPlayable=1')) {
        core.error(`${name} - mission.sqm: No playable units found`);
        report.errors.push(
          `[No playable units found](https://a3sog.github.io/knowledgebase/#/missions/setup-the-players)`
        );
      }

      // Mission - Check spawn_air
      // if (!mission.includes('name="spawn_air"')) {
      //   core.error(`${name} - mission.sqm: \`spawn_air\` not found`);
      //   report.errors.push(
      //     `[spawn_air not found](https://a3sog.github.io/knowledgebase/#/missions/setup-vehicle-spawns)`
      //   );
      // }

      // Mission - Check spawn_armor
      // if (!mission.includes('name="spawn_armor"')) {
      //   core.error(`${name} - mission.sqm: \`spawn_armor\` not found`);
      //   report.errors.push(
      //     `[spawn_armor not found](https://a3sog.github.io/knowledgebase/#/missions/setup-vehicle-spawns)`
      //   );
      // }

      // Mission - Check spawn_helo
      // if (!mission.includes('name="spawn_helo"')) {
      //   core.error(`${name} - mission.sqm: \`spawn_helo\` not found`);
      //   report.errors.push(
      //     `[spawn_helo not found](https://a3sog.github.io/knowledgebase/#/missions/setup-vehicle-spawns)`
      //   );
      // }

      // Mission - Check spawn_boat
      // if (!mission.includes('name="spawn_boat"')) {
      //   core.error(`${name} - mission.sqm: \`spawn_boat\` not found`);
      //   report.errors.push(
      //     `[spawn_boat not found](https://a3sog.github.io/knowledgebase/#/missions/setup-vehicle-spawns)`
      //   );
      // }

      // Mission - Check spawn_static
      // if (!mission.includes('name="spawn_static"')) {
      //   core.error(`${name} - mission.sqm: \`spawn_static\` not found`);
      //   report.errors.push(
      //     `[spawn_static not found](https://a3sog.github.io/knowledgebase/#/missions/setup-vehicle-spawns)`
      //   );
      // }

      // Mission - Check spawn_uav
      // if (!mission.includes('name="spawn_uav"')) {
      //   core.error(`${name} - mission.sqm: \`spawn_uav\` not found`);
      //   report.errors.push(
      //     `[spawn_uav not found](https://a3sog.github.io/knowledgebase/#/missions/setup-vehicle-spawns)`
      //   );
      // }

      // Mission - Check spawn_ugv
      // if (!mission.includes('name="spawn_ugv"')) {
      //   core.error(`${name} - mission.sqm: \`spawn_ugv\` not found`);
      //   report.errors.push(
      //     `[spawn_ugv not found](https://a3sog.github.io/knowledgebase/#/missions/setup-vehicle-spawns)`
      //   );
      // }

      // Mission - Check spawn_car
      // if (!mission.includes('name="spawn_car"')) {
      //   core.error(`${name} - mission.sqm: \`spawn_car\` not found`);
      //   report.errors.push(
      //     `[spawn_car not found](https://a3sog.github.io/knowledgebase/#/missions/setup-vehicle-spawns)`
      //   );
      // }
    } else {
      // If the mission is binarized, add an error to the report
      core.error(`${name} - mission.sqm: Binarized`);
      report.errors.push(
        '[mission.sqm: Binarized](https://a3sog.github.io/knowledgebase/#/missions/create-a-new-mission)'
      );
    }
  }

  // Check various briefing files
  // For each file, if it doesn't exist or contains the string 'INSERT', add an error to the report
  ['employer', 'mission', 'objectives', 'situation'].forEach(title => {
    const briefing_path = join(
      'missions',
      name,
      'edit_me/briefing',
      `${title}.html`
    );
    if (!existsSync(briefing_path)) {
      core.error(`${name} - ${title}.html not found`);
    }
    if (existsSync(briefing_path)) {
      const briefing = readFileSync(briefing_path, 'utf8');
      if (briefing.includes('INSERT')) {
        core.error(`${name} - ${title}.html: Not edited`);
        report.errors.push(`${title}.html: Not edited`);
      }
    }
  });
  // Check various config files
  // For each file, if it doesn't exist or contains the string 'INSERT', add an error to the report
  ['banks', 'cpofs', 'garages', 'lockers', 'paygrades', 'stores'].forEach(
    title => {
      const config_path = join('missions', name, 'configs', `${title}.h`);
      if (!existsSync(config_path)) {
        core.error(`${name} - ${title}.h not found`);
      }
      if (existsSync(config_path)) {
        const config = readFileSync(config_path, 'utf8');
        if (config.includes('INSERT')) {
          core.error(`${name} - ${title}.h: Not edited`);
          report.errors.push(`${title}.h: Not edited`);
        }
      }
    }
  );
  // Check various param files
  // For each file, if it doesn't exist or contains the string 'INSERT', add an error to the report
  [
    'paramarstype',
    'paramdt',
    'paramfuelcost',
    'paraminsdeduct',
    'parammultiplyr',
    'paramopbudget',
    'paramoprating',
    'parampdbmode',
    'paramrepaircost',
    'paramteamcoord',
    'paramvaenable'
  ].forEach(title => {
    const param_path = join('missions', name, 'params', `${title}.h`);
    if (!existsSync(param_path)) {
      core.error(`${name} - ${title}.h not found`);
    }
    if (existsSync(param_path)) {
      const config = readFileSync(param_path, 'utf8');
      if (config.includes('INSERT')) {
        core.error(`${name} - ${title}.h: Not edited`);
        report.errors.push(`${title}.h: Not edited`);
      }
    }
  });

  // Return the report
  return report;
}
