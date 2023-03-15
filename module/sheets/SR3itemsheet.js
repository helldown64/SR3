export default class SR3ItemSheet extends ItemSheet{

    /**
     * Get html template for Item - skill
     */
     get template(){
        console.log(`SR3 | get file html ${this.item.type}-sheet.`);
        return `systems/SR3/templates/items/item-${this.item.type}-sheet.html`;
    }
    /**
     * Get data from item
     */
         getData(){
            const data = super.getData();
            //console.log(data);
            switch(data.data.type){
                case 'ammo':
                    this.translate_ammo_type(data.data.system);
                    this.translate_weapon_type(data.data.system);
                    this.calcul_ammo_weight(data.data.system);
                    break;
                case 'rangedweapon':
                    this.translate_weapon_type(data.data.system);
                    this.calcul_range(data.data.system);
                    break;
                case 'spell': case 'spiritpower':
                    this.translate_magic(data.data.system);
                    break;
                case 'foci':
                    this.translate_foci(data.data.system);
                    break;
                default:break;
            }
            return data;
        }
    
        /**
         * Calculating ammunition weight based on ammunition type, weapon type and quantity
         * @param {*} data 
         */
        calcul_ammo_weight(data){
            var weight = parseFloat(data.ammotypes[data.ammotype].weight)
                        *parseFloat(data.weapontypes[data.weapontype].value)
                        *parseInt(data.qty);
            weight = Math.round(weight * 100) / 100
            data.weight = weight;
        }
        /**
         * Recovers different ranges from a remote weapon depending on the type of weapon
         * @param {*} data 
         */
        calcul_range(data){
            var range = data.weapontypes[data.weapontype.value].range;
            var str_range = String(range["s"])+"/"+String(range["m"])+"/"+String(range["l"])+"/"+String(range["xl"]);
            data.range.value = str_range;
        }
        /**
         * Translates the names of the different types of focus
         * @param {*} data 
         */
        translate_foci(data){
            let types = data.types;
            for(let [key, type] of Object.entries(types)){
                type.value = game.i18n.localize('SR3.item.foci.'+key);
            }
        }
        /**
         * Translates the names of the different types of weapons
         * @param {*} data 
         */
        translate_weapon_type(data){
            let types = data.weapontypes;
            for(let [key, type] of Object.entries(types)){
                type.label = game.i18n.localize('SR3.item.weapon.type.'+key);
            }
        }
        /**
         * Translates the names of the different types of ammo
         * @param {*} data 
         */
        translate_ammo_type(data){
            let types = data.ammotypes;
            for(let [key, type] of Object.entries(types)){
                type.label = game.i18n.localize('SR3.item.ammo.type.'+key);
            }
        }
        /**
         * Translates the different components of a spell
         * @param {*} data 
         */
        translate_magic(data){
            //Type
                let types = data.types;
                for(let [key, type] of Object.entries(types)){
                    type.value = game.i18n.localize('SR3.item.magic.type.'+key);
                }
            //Range
                let ranges = data.ranges;
                for(let [key, type] of Object.entries(ranges)){
                    type.value = game.i18n.localize('SR3.item.magic.range.'+key);
                }
            //Action
                let actions = data.actions;
                for(let [key, type] of Object.entries(actions)){
                    type.value = game.i18n.localize('SR3.item.magic.action.'+key);
                }
            //Duration
                let durations = data.durations;
                for(let [key, type] of Object.entries(durations)){
                    type.value = game.i18n.localize('SR3.item.magic.duration.'+key);
                }
        }
}