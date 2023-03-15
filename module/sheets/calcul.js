/**
 * 
 */
export function calcul(type, data, items){
    switch(type){
        case 'character':
            calcul_ammo_weight(items);
            calcul_equipped_item_weight(items, data);
            calcul_weapon_damage(items);
            calcul_weapon_range(items);
            calcul_essence_loose(data, items);
            break;
        case 'spirit':
            break;
        case 'vehicule':
            calcul_ammo_weight(items);
            calcul_weapon_damage(items);
            calcul_weapon_range(items);
            break;
        case 'avatar':
            calcul_free_memory(data, items);
            break;
        default:break;
    }
}

function calcul_essence_loose(data, items){
    let cost = 0;
    for(var i = 0; i < items.length; i++){
        if(items[i].type == 'cyberware'){
            cost += items[i].system.cost.value;
        }
    }
    let essence = Math.round((6 - cost) *100)/100;
    data.essence.value = essence;
}
function calcul_free_memory(data, items){
    console.log(data);
    var free_memory = data.ram.value;
    for(var i = 0; i < items.length; i++){
        if(items[i].type == 'software'){
            if(items[i].system.equipped == true){
                free_memory-= items[i].system.size.value;
            }
            
        }
    }
    data.freeram.value = free_memory;
 }

 function calcul_ammo_weight(items){
    for(var i = 0; i < items.length; i++){
        if(items[i].type == 'ammo'){
            let atype = items[i].system.ammotype;
            let wtype = items[i].system.weapontype;
            let atypes = items[i].system.ammotypes;
            let wtypes = items[i].system.weapontypes;
            let base = 0;
            let multi = 0;
            let label_ammo = "";
            let label_weapon = "";
            for(var a in atypes){
                if(a == atype){
                    base = atypes[a].weight;
                    label_ammo = atypes[a].label;
                    for(var w in wtypes){
                        if(w == wtype){
                            multi = wtypes[w].value;
                            label_weapon = wtypes[w].label;
                        }
                    }
                }
            }
            let base_weight = parseFloat(base * multi);
            let weight = parseFloat(base_weight * items[i].system.qty);
            weight = Math.round(weight *100)/100;
            items[i].system.weight.value = weight;
        }
    }
}

function calcul_equipped_item_weight(items, data){
    let sum = 0;
    for(var i = 0; i < items.length; i++){
        if(items[i].type == 'rangedweapon' || items[i].type == 'meleeweapon' || items[i].type == 'armor' || items[i].type == 'ammo' || items[i].type == 'foci'){
            if(items[i].system.equipped){
                sum+= items[i].system.weight.value;
            }
        }
    }
    sum = Math.round(sum * 100) / 100;
    data.currentweight = sum;
    data.maxweight = parseInt(data.abilities["str"].total * 5);
}

function calcul_weapon_damage(items){
    for(var i = 0; i < items.length; i++){
        if(items[i].type == 'rangedweapon'){
            var str_dmg = "";
            var int_dmg = items[i].system.base.value;
            var wtype = items[i].system.weapontype.value;
            var atype = items[i].system.ammotype.value;
            var atypes = items[i].system.ammotypes;
            for (var a in atypes){
                if(a == atype){
                    int_dmg += parseInt(atypes[a].dmg);
                    str_dmg+= String(int_dmg)+items[i].system.code.value;
                    if(a == 'flechette'){
                        str_dmg+="(f)";
                    }else if(a == 'gel'){
                        str_dmg+="(S)";
                    }
                }
            }
            items[i].system.dmg.value = str_dmg;
        }
    }
}

function calcul_weapon_range(items){
    for(var i = 0; i < items.length; i++){
        if(items[i].type == 'rangedweapon'){
            var types = items[i].system.weapontypes;
            var type = items[i].system.weapontype.value;
            var str_range = "";
            for(var t in types){
                if(t == type){
                    str_range = String(types[t].range["s"])+"/"+String(types[t].range["m"])+"/"+String(types[t].range["l"])+"/"+String(types[t].range["xl"]);
                }
            }
            items[i].system.range.value = str_range;
        }
    }
}