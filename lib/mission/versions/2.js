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
exports.check2 = void 0;
const core = __importStar(require("@actions/core"));
const fs_1 = require("fs");
const path_1 = require("path");
const regex_desc_name = /^OnLoadName = "(.+?)";$/m;
const regex_desc_summary = /^OnLoadMission = "(.+?)";$/m;
const regex_desc_author = /^author = "(.+?)";$/m;
function check2(name) {
    const report = {
        name,
        warnings: [],
        errors: [],
        inPR: false
    };
    const description_path = (0, path_1.join)('contracts', name, 'edit_me/description.ext');
    if (!(0, fs_1.existsSync)(description_path)) {
        core.info(`${name} - Not using template`);
        report.errors.push('[Not using template](https://github.com/SynixeContractors/MissionTemplate)');
        return report;
    }
    const description = (0, fs_1.readFileSync)(description_path, 'utf8');
    // Description - Check Name
    if (regex_desc_name.exec(description) === null) {
        core.error(`${name} - Description: Name not set (OnLoadName)`);
        report.errors.push(`[description.ext: Name not set (OnLoadName)](https://github.com/SynixeContractors/MissionTemplate#mission-details)`);
    }
    // Description - Check Summary
    if (regex_desc_summary.exec(description) === null) {
        core.error(`${name} - Description: Summary not set (OnLoadMission)`);
        report.errors.push(`[description.ext: Summary not set (OnLoadMission)](https://github.com/SynixeContractors/MissionTemplate#mission-details)`);
    }
    // Description - Check Author
    if (regex_desc_author.exec(description) === null) {
        core.error(`${name} - Description: Author not set (author)`);
        report.errors.push(`[description.ext: Author not set (author)](https://github.com/SynixeContractors/MissionTemplate#mission-details)`);
    }
    // Check mission.sqm
    const mission_path = (0, path_1.join)('contracts', name, 'mission.sqm');
    if (!(0, fs_1.existsSync)(mission_path)) {
        core.error(`${name} - mission.sqm not found`);
    }
    if ((0, fs_1.existsSync)(mission_path)) {
        const mission = (0, fs_1.readFileSync)(mission_path, 'utf8');
        if (mission.startsWith('version')) {
            // Mission - Spectator Screen
            if (!mission.includes('type="synixe_spectator_screen"')) {
                core.error(`${name} - mission.sqm: Spectator Screen not found`);
                report.errors.push(`[Spectator Screen not found](https://github.com/SynixeContractors/MissionTemplate#setup-base)`);
            }
            // Mission - Check Respawn
            if (!mission.includes('name="respawn"')) {
                core.error(`${name} - mission.sqm: Respawn not found`);
                report.errors.push(`[Respawn not found](https://github.com/SynixeContractors/MissionTemplate#setup-base)`);
            }
            // Mission - Check Shop
            if (!mission.includes('property="crate_client_gear_attribute_shop"')) {
                core.error(`${name} - mission.sqm: Shop not found`);
                report.errors.push(`[Shop not found](https://github.com/SynixeContractors/MissionTemplate#setup-shops)`);
            }
            // Mission - Has Contractors
            if (!mission.includes('description="Contractor"')) {
                core.error(`${name} - mission.sqm: No "Contractor" units found`);
                report.errors.push(`[No "Contractor" units found](https://github.com/SynixeContractors/MissionTemplate#setup-the-players)`);
            }
            // Mission - Uses Synixe Unit Class
            if (!mission.includes('type="synixe_contractors_Unit_I_Contractor"')) {
                core.error(`${name} - mission.sqm: No "synixe_contractors_Unit_I_Contractor" units found`);
                report.errors.push(`[No "synixe_contractors_Unit_I_Contractor" units found](https://github.com/SynixeContractors/MissionTemplate#setup-the-players)`);
            }
            // Mission - Playable Units
            if (!mission.includes('isPlayable=1')) {
                core.error(`${name} - mission.sqm: No playable units found`);
                report.errors.push(`[No playable units found](https://github.com/SynixeContractors/MissionTemplate#setup-the-players)`);
            }
            // Mission - Check spawn_land
            if (!mission.includes('name="spawn_land"')) {
                core.error(`${name} - mission.sqm: \`spawn_land\` not found`);
                report.errors.push(`[spawn_land not found](https://github.com/SynixeContractors/MissionTemplate#setup-vehicle-spawns)`);
            }
            // Mission - Check spawn_thing
            if (!mission.includes('name="spawn_thing"')) {
                core.error(`${name} - mission.sqm: \`spawn_thing\` not found`);
                report.errors.push(`[spawn_thing not found](https://github.com/SynixeContractors/MissionTemplate#setup-vehicle-spawns)`);
            }
        }
        else {
            core.error(`${name} - mission.sqm: Binarized`);
            report.errors.push('[mission.sqm: Binarized](https://github.com/SynixeContractors/Missions#create-a-new-mission)');
        }
    }
    // Check briefing.sqf
    const briefing_path = (0, path_1.join)('contracts', name, 'edit_me', 'briefing.sqf');
    if (!(0, fs_1.existsSync)(briefing_path)) {
        core.error(`${name} - briefing.sqf not found`);
    }
    if ((0, fs_1.existsSync)(briefing_path)) {
        const briefing = (0, fs_1.readFileSync)(briefing_path, 'utf8');
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
exports.check2 = check2;
