
export function set_specs(type,data){
    switch(type){
        case 'character':
            set_character_abilities_sum(data);
            break;
        case 'spirit':
            set_spirit_abilities(data);
            break;
        default:break;
    }
}

/**
 * Calcul character abilities total and apply racial bonus to each abilities
 * @param {*} data 
 */
 function set_character_abilities_sum(data){
    var abilities = data.abilities;
    var race = data.races[data.race.value];
    for(var bonus in race.bonus){
        abilities[bonus].Bracial = race.bonus[bonus].value;
    }
    for(var a in abilities){
        abilities[a].total = parseInt(abilities[a].base)
        + parseInt(abilities[a].xp)
        + parseInt(abilities[a].Bracial)
        + parseInt(abilities[a].Bcyber)
        + parseInt(abilities[a].Bmagic);
    }
}
/**
 * Calculating the attributes of a spirit according to its category and force
 * @param {*} data 
 */
function set_spirit_abilities(data){
    var abilities = data.abilities;
     var category = data.categories[data.category];
     let force = data.force;
     abilities.str.total = parseInt(force) + parseInt(category.bonus.str.value);
     abilities.spe.total = parseInt(force) + parseInt(category.bonus.spe.value);
     abilities.con.total = parseInt(force) + parseInt(category.bonus.con.value);
     abilities.cha.total = parseInt(force);
     abilities.int.total = parseInt(force);
     abilities.wil.total = parseInt(force);
     abilities.rea.total = parseInt(force) + parseInt(category.bonus.rea.value);
     data.essence.value = parseInt(force);
     data.magic.value = parseInt(force);
     data.initiatives.street.value = "1d6+"+(parseInt(category.bonus.init.value) + parseInt(force))+"";
     data.initiatives.astral.value = "1d6+"+(20+parseInt(force))+"";
     var dmg = parseInt(force) + parseInt(category.bonus.atk.value);
     if(dmg < 0){
       dmg = 0;
     }
     var str_dmg = String(dmg)+category.bonus.dmg.value;
     data.dmg = str_dmg;
     data.mvt = category.bonus.mvt;
  }