import * as core from '@actions/core';

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import { MissionReport } from '..';

const regex_desc_name = /^OnLoadName = "(.+?)";$/m;
const regex_desc_summary = /^OnLoadMission = "(.+?)";$/m;
const regex_desc_author = /^author = "(.+?)";$/m;

export function check2(name: string): MissionReport {
  const report: MissionReport = {
    name,
    warnings: [],
    errors: [],
    inPR: false
  };

  const description_path = join('contracts', name, 'edit_me/description.ext');
  if (!existsSync(description_path)) {
    core.info(`${name} - Not using template`);
    report.errors.push(
      '[Not using template](https://github.com/SynixeContractors/MissionTemplate)'
    );
    return report;
  }
  const description = readFileSync(description_path, 'utf8');

  // Description - Check Name
  if (regex_desc_name.exec(description) === null) {
    core.error(`${name} - Description: Name not set (OnLoadName)`);
    report.errors.push(
      `[description.ext: Name not set (OnLoadName)](https://github.com/SynixeContractors/MissionTemplate#mission-details)`
    );
  }
  // Description - Check Summary
  if (regex_desc_summary.exec(description) === null) {
    core.error(`${name} - Description: Summary not set (OnLoadMission)`);
    report.errors.push(
      `[description.ext: Summary not set (OnLoadMission)](https://github.com/SynixeContractors/MissionTemplate#mission-details)`
    );
  }
  // Description - Check Author
  if (regex_desc_author.exec(description) === null) {
    core.error(`${name} - Description: Author not set (author)`);
    report.errors.push(
      `[description.ext: Author not set (author)](https://github.com/SynixeContractors/MissionTemplate#mission-details)`
    );
  }

  // Check mission.sqm
  const mission_path = join('contracts', name, 'mission.sqm');
  if (!existsSync(mission_path)) {
    core.error(`${name} - mission.sqm not found`);
  }
  if (existsSync(mission_path)) {
    const mission = readFileSync(mission_path, 'utf8');
    if (mission.startsWith('version')) {
      // Mission - Spectator Screen
      if (!mission.includes('type="synixe_spectator_screen"')) {
        core.error(`${name} - mission.sqm: Spectator Screen not found`);
        report.errors.push(
          `[Spectator Screen not found](https://github.com/SynixeContractors/MissionTemplate#setup-base)`
        );
      }

      // Mission - Check Respawn
      if (!mission.includes('name="respawn"')) {
        core.error(`${name} - mission.sqm: Respawn not found`);
        report.errors.push(
          `[Respawn not found](https://github.com/SynixeContractors/MissionTemplate#setup-base)`
        );
      }

      // Mission - Check Shop
      if (!mission.includes('property="crate_client_gear_attribute_shop"')) {
        core.error(`${name} - mission.sqm: Shop not found`);
        report.errors.push(
          `[Shop not found](https://github.com/SynixeContractors/MissionTemplate#setup-shops)`
        );
      }

      // Mission - Has Contractors
      if (!mission.includes('description="Contractor"')) {
        core.error(`${name} - mission.sqm: No "Contractor" units found`);
        report.errors.push(
          `[No "Contractor" units found](https://github.com/SynixeContractors/MissionTemplate#setup-the-players)`
        );
      }

      // Mission - Uses Synixe Unit Class
      if (!mission.includes('type="synixe_contractors_Unit_I_Contractor"')) {
        core.error(
          `${name} - mission.sqm: No "synixe_contractors_Unit_I_Contractor" units found`
        );
        report.errors.push(
          `[No "synixe_contractors_Unit_I_Contractor" units found](https://github.com/SynixeContractors/MissionTemplate#setup-the-players)`
        );
      }

      // Mission - Playable Units
      if (!mission.includes('isPlayable=1')) {
        core.error(`${name} - mission.sqm: No playable units found`);
        report.errors.push(
          `[No playable units found](https://github.com/SynixeContractors/MissionTemplate#setup-the-players)`
        );
      }

      // Mission - Check spawn_land
      if (!mission.includes('name="spawn_land"')) {
        core.error(`${name} - mission.sqm: \`spawn_land\` not found`);
        report.errors.push(
          `[spawn_land not found](https://github.com/SynixeContractors/MissionTemplate#setup-vehicle-spawns)`
        );
      }

      // Mission - Check spawn_thing
      if (!mission.includes('name="spawn_thing"')) {
        core.error(`${name} - mission.sqm: \`spawn_thing\` not found`);
        report.errors.push(
          `[spawn_thing not found](https://github.com/SynixeContractors/MissionTemplate#setup-vehicle-spawns)`
        );
      }
    } else {
      core.error(`${name} - mission.sqm: Binarized`);
      report.errors.push(
        '[mission.sqm: Binarized](https://github.com/SynixeContractors/Missions#create-a-new-mission)'
      );
    }
  }

  // Check briefing.sqf
  const briefing_path = join('contracts', name, 'edit_me', 'briefing.sqf');
  if (!existsSync(briefing_path)) {
    core.error(`${name} - briefing.sqf not found`);
  }
  if (existsSync(briefing_path)) {
    const briefing = readFileSync(briefing_path, 'utf8');
    if (briefing.includes('INSERT NAME OF EMPLOYER HERE')) {
      core.error(`${name} - briefing.sqf: Employer not set`);
      report.errors.push(`briefing.sqf: Employer not set`);
    }
    if (briefing.includes('INSERT ENEMIES HERE')) {
      core.error(`${name} - briefing.sqf: Situation not set`);
      report.errors.push(`briefing.sqf: Situation not set`);
    }
    if (briefing.includes('YOU CAN WRITE YOUR MISSION DESCRIPTION HERE')) {
      core.error(`${name} - briefing.sqf: Mission not set`);
      report.errors.push(`briefing.sqf: Mission not set`);
    }
  }
  return report;
}
