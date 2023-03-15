import SR3ActorSheet from "./sheets/SR3actorsheet.js";
import SR3ItemSheet from "./sheets/SR3itemsheet.js";

/**
 * Method to load partial views.
 * The paths are relative to the directory system of foundryVTT
 * @returns 
 */
async function preloadHandlebarsTemplates(){
    const templatePaths = [
        // List of paths to subpart html views
        "systems/SR3/templates/actors/parts/actor-condition.html",
        "systems/SR3/templates/actors/parts/actor-monitor-physic.html",
        "systems/SR3/templates/actors/parts/actor-monitor-stun.html",
        "systems/SR3/templates/actors/parts/actor-abilitites-cardridge.html",
        "systems/SR3/templates/actors/parts/actor-rollmanager.html",
        "systems/SR3/templates/actors/parts/character/character-skills.html",
        "systems/SR3/templates/actors/parts/character/character-abilitites.html",
        "systems/SR3/templates/actors/parts/character/character-fight.html",
        "systems/SR3/templates/actors/parts/character/character-weapons.html",
        "systems/SR3/templates/actors/parts/character/character-magic.html",
        "systems/SR3/templates/actors/parts/character/character-cyberware.html",
        "systems/SR3/templates/actors/parts/character/character-equipement.html",
        "systems/SR3/templates/actors/parts/character/character-identity.html",
        "systems/SR3/templates/actors/parts/spirit/spirit-identity.html",
        "systems/SR3/templates/actors/parts/vehicule/vehicule-stats.html",
        "systems/SR3/templates/actors/parts/vehicule/vehicule-equipement.html",
        "systems/SR3/templates/actors/parts/avatar/avatar-stats.html",
        "systems/SR3/templates/actors/parts/avatar/avatar-software.html",
      ];
      // Load the template parts
      return loadTemplates(templatePaths);
};

Hooks.once("init", async function(){
    console.log("Shadowrun System | system initialisation");
    //register / unregister Item
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("shadowrun", SR3ItemSheet, {makeDefault: true});
    //register / unregister Actor
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("shadowrun", SR3ActorSheet, {makeDefault: true});
    preloadHandlebarsTemplates();
    /**
     * Set an initiative formula for the system
     */
    CONFIG.Combat.initiative = {
        formula:"@initiative.value",
        decimals:2
    };
});