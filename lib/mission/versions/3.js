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
exports.check3 = void 0;
const core = __importStar(require("@actions/core"));
const fs_1 = require("fs");
const path_1 = require("path");
// Regular expressions to match different parts of the description.ext file
const regex_desc_name = /^onLoadName = "(.+?)";$/m;
const regex_desc_summary = /^onLoadMission = "(.+?)";$/m;
const regex_desc_author = /^author = "(.+?)";$/m;
// Function to check a mission using the 3rd version of the template
function check3(name) {
    // Initialize the report
    const report = {
        name,
        warnings: [],
        errors: [],
        inPR: false
    };
    // Construct the path to the mission's description file
    const description_path = (0, path_1.join)('missions', name, 'edit_me/description.ext');
    // If the description file doesn't exist, add an error to the report and return it
    if (!(0, fs_1.existsSync)(description_path)) {
        core.info(`${name} - Not using template`);
        report.errors.push('[Not using template](https://github.com/A3SOG/MissionTemplate)');
        return report;
    }
    // Read the description file
    const description = (0, fs_1.readFileSync)(description_path, 'utf8');
    // Check the name, summary, and author in the description
    if (regex_desc_name.exec(description) === null) {
        core.error(`${name} - description: Name not set (onLoadName)`);
        report.errors.push(`[description.ext: Name not set (onLoadName)](https://a3sog.github.io/knowledgebase/#/missions/mission-details)`);
    }
    if (regex_desc_summary.exec(description) === null) {
        core.error(`${name} - description: Summary not set (onLoadMission)`);
        report.errors.push(`[description.ext: Summary not set (onLoadMission)](https://a3sog.github.io/knowledgebase/#/missions/mission-details)`);
    }
    if (regex_desc_author.exec(description) === null) {
        core.error(`${name} - description: Author not set (author)`);
        report.errors.push(`[description.ext: Author not set (author)](https://a3sog.github.io/knowledgebase/#/missions/mission-details)`);
    }
    // Construct the path to the mission file
    const mission_path = (0, path_1.join)('missions', name, 'mission.sqm');
    // If the mission file doesn't exist, add an error to the report
    if (!(0, fs_1.existsSync)(mission_path)) {
        core.error(`${name} - mission.sqm not found`);
    }
    // If the mission file exists, read it
    if ((0, fs_1.existsSync)(mission_path)) {
        const mission = (0, fs_1.readFileSync)(mission_path, 'utf8');
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
                report.errors.push(`[No playable units found](https://a3sog.github.io/knowledgebase/#/missions/setup-the-players)`);
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
        }
        else {
            // If the mission is binarized, add an error to the report
            core.error(`${name} - mission.sqm: Binarized`);
            report.errors.push('[mission.sqm: Binarized](https://a3sog.github.io/knowledgebase/#/missions/create-a-new-mission)');
        }
    }
    // Check various briefing files
    // For each file, if it doesn't exist or contains the string 'INSERT', add an error to the report
    ['employer', 'mission', 'objectives', 'situation'].forEach(title => {
        const briefing_path = (0, path_1.join)('missions', name, 'edit_me/briefing', `${title}.html`);
        if (!(0, fs_1.existsSync)(briefing_path)) {
            core.error(`${name} - ${title}.html not found`);
        }
        if ((0, fs_1.existsSync)(briefing_path)) {
            const briefing = (0, fs_1.readFileSync)(briefing_path, 'utf8');
            if (briefing.includes('INSERT')) {
                core.error(`${name} - ${title}.html: Not edited`);
                report.errors.push(`${title}.html: Not edited`);
            }
        }
    });
    // Check various config files
    // For each file, if it doesn't exist or contains the string 'INSERT', add an error to the report
    ['banks', 'cpofs', 'garages', 'lockers', 'paygrades', 'stores'].forEach(title => {
        const config_path = (0, path_1.join)('missions', name, 'configs', `${title}.h`);
        if (!(0, fs_1.existsSync)(config_path)) {
            core.error(`${name} - ${title}.h not found`);
        }
        if ((0, fs_1.existsSync)(config_path)) {
            const config = (0, fs_1.readFileSync)(config_path, 'utf8');
            if (config.includes('INSERT')) {
                core.error(`${name} - ${title}.h: Not edited`);
                report.errors.push(`${title}.h: Not edited`);
            }
        }
    });
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
        const param_path = (0, path_1.join)('missions', name, 'params', `${title}.h`);
        if (!(0, fs_1.existsSync)(param_path)) {
            core.error(`${name} - ${title}.h not found`);
        }
        if ((0, fs_1.existsSync)(param_path)) {
            const config = (0, fs_1.readFileSync)(param_path, 'utf8');
            if (config.includes('INSERT')) {
                core.error(`${name} - ${title}.h: Not edited`);
                report.errors.push(`${title}.h: Not edited`);
            }
        }
    });
    // Return the report
    return report;
}
exports.check3 = check3;
