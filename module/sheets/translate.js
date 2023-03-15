
/**
 * 
 * @param {*} type 
 * @param {*} data 
 * @param {*} items 
 */
export function translate(type, data, items){
    switch(type){
        case 'character':
            translate_abilities(data);
            translate_initiatives(data);
            break;
        case 'spirit':
            translate_abilities(data);
            translate_initiatives(data);
            break;
        case 'vehicule':
            translate_initiatives(data);
            break;
        case 'avatar':
            break;
        default:break;
    }
    translate_items(items);
}

/**
 * 
 * @param {*} items 
 */
export function translate_items(items){
    for(var i = 0; i < items.length; i++){
        switch(items[i].type){
            case 'rangedweapon':
                translate_weapon_type(items[i].system);
                break;
            case 'ammo':
                translate_ammo_type(items[i].system);
                translate_weapon_type(items[i].system);
                break;
            case 'spell': case 'spiritpower':
                translate_magic_item(items[i].system);
            break;
            case 'foci':
                translate_foci(items[i].system);
                break; 
            
        default:break;
        }
    }
}
/**
 * Translates the focus name to display in the character sheet
 * @param {*} item 
 */
function translate_foci(item){
    item.typelabel.value = game.i18n.localize('SR3.item.foci.'+item.type.value);
}
/**
 * Translates attribute names
 * @param {*} data 
 */
export function translate_abilities(data){
    var abilities = data.abilities;
    for(let [key, ability] of Object.entries(abilities)){
        ability.label = game.i18n.localize('SR3.actor.ability.'+key);
    }
}
/**
 * Translates different initiatives
 * @param {*} data 
 */
export function translate_initiatives(data){
    var initiatives = data.initiatives;
    for(let [key, init] of Object.entries(initiatives)){
        init.label = game.i18n.localize('SR3.actor.init.'+key);
    }
}
/**
 * Translates the different components of a spell to display in the character sheet
 * @param {*} item 
 */
function translate_magic_item(item){
    item.typelabel.value = game.i18n.localize('SR3.item.magic.type.'+item.type.value);
    item.actionlabel.value = game.i18n.localize('SR3.item.magic.action.'+item.action.value);
    item.rangelabel.value = game.i18n.localize('SR3.item.magic.range.'+item.range.value);
    item.durationlabel.value = game.i18n.localize('SR3.item.magic.duration.'+item.duration.value);
}
/**
 * Translates ammunition types to display in character sheet
 * @param {*} item 
 */
function translate_ammo_type(item){
    item.ammotypelabel.value = game.i18n.localize('SR3.item.ammo.type.'+item.ammotype);
    
}
/**
 * Translates weapon types to display in character sheet
 * @param {*} item 
 */
function translate_weapon_type(item){
    item.weapontypelabel.value = game.i18n.localize('SR3.item.weapon.type.'+item.weapontype);
}