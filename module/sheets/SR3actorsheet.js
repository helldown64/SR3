import { set_specs } from './set-specs.js';
import { translate } from './translate.js';
import { calcul } from './calcul.js';
import { roll_success } from './roll.js';
import { roll_max } from './roll.js';

export default class SR3ActorSheet extends ActorSheet{

    /**
     * Get html template for Actor
     */
     get template(){
        console.log(`SR3 | get file html ${this.actor.type}-sheet.`);
        return `systems/SR3/templates/actors/${this.actor.type}-sheet.html`;
    }

     /** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["SR3", "sheet", "actor"],
			width: 844,
			height: 915,
			tabs: [{
				navSelector: ".sheet-tabs",
				contentSelector: ".sheet-body",
				initial: "skills" //initial default tab
			}]
		});
    }

    /**
     * Get data from Actor
     */
     getData(){
        const data = super.getData();
        //console.log(data);
        this.prepare_data(data);
        //Sort all item by name
        data.items.sort(function (a,b ){
            var keyA = a.name;
            var keyB = b.name;
            return keyA.localeCompare(keyB);
        });
        this.setMonitor(data);
        return data;
    }

    /**
     * update the actor health depending on checkboxes checked
     * @param {} data 
     */
    setMonitor(data){
        var physic = data.actor.system.condition.physic;
        var stun = data.actor.system.condition.stun;
        var maxPhysic = 0;
        var maxStun = 0;
        for(var i = 1; i < 11; i++){
            if(physic[i].value){
                maxPhysic = i;
            }
            if(stun[i].value){
                maxStun = i;
            }
        }
        data.actor.system.wound.physic.value = 10-maxPhysic;
        data.actor.system.wound.stun.value = 10-maxStun;
    }
    /**
     * Formats the character sheet data before it is displayed
     * Translates the different labels from the template (actor and item)
     * Calculates attributes and weights of objects
     * @param {*} data 
     */
    prepare_data(data){
        translate(data.data.type, data.data.system, data.items);
        set_specs(data.data.type, data.data.system);
        calcul(data.data.type, data.data.system, data.items);
    }
    /**
     * Links sheet elements (html) to their functions by listening to click events
     * @param {*} html 
     */
    activateListeners(html){
        super.activateListeners(html);
        html.find('.edit-item').click(this.__onEditItem.bind(this));
        html.find('.delete-item').click(this.__onDeleteItem.bind(this));
        html.find('.roll-skill').click(this.__onRollSkill.bind(this));
        html.find('.roll-karma').click(this.__onRollKarma.bind(this));
    }
    /**
     * Returns the identifier of an object contained in an event.
     * @param {*} ev 
     * @returns 
     */
    getItemIdFromEvent = (ev) => {
        const parent = $(ev.currentTarget).parents(".item");
        return parent.data("itemId");
    }

    /**
     * Opens the object editing window by taking into account the object identifier contained in the event.
     * @param {*} event 
     */
     __onEditItem(event){
        const itemId = this.getItemIdFromEvent(event);
        const item = this.actor.items.get(itemId);
        item.sheet.render(true);
    }
    /**
     * Returns the value of the html attribute contained in the event named 'skill-name'
     * @param {*} ev 
     * @returns 
     */
    getSkillNameFromEvent = (ev) => {
        const target = $(ev.currentTarget);
        return target.data("skill-name");
    }
    /**
     * Returns the value of the html attribute contained in the event named 'skill-value'
     * @param {*} ev 
     * @returns 
     */
    getSkillValueFromEvent = (ev) => {
        const target = $(ev.currentTarget);
        return target.data("skill-value");
    }

    /**
     * Deletes the selected object.
     * A confirmation is requested to perform the deletion
     * @param {*} event 
     */
     __onDeleteItem(event){
        console.log("DELETE SKILL");
        const itemId = this.getItemIdFromEvent(event);
        const item = this.actor.items.get(itemId);
        let d = Dialog.confirm({
            title:"Confirmer suppression",
            content:"<p>Supprimer '" + item.name + "'</p>",
            yes: () => this.actor.items.get(itemId).delete(),
            no: () => {},
            defaultYess : false
        });
    }

    /**
     * Rolls the dice for a skill.
     * The name and value of the skill are extracted from the event.
     * Difficulty and modifier come from the character sheet.
     * Penalty is calculated based on injuries checked.
     * @param {*} event 
     */
     __onRollSkill(event){
        let skill = this.getSkillNameFromEvent(event);
        let value = this.getSkillValueFromEvent(event);
        let sr = this.actor.system.sr.value;
        let modif = this.actor.system.modif.value;
        let malus = 0;
        let nb_success = 0;
        if(this.actor.system.activewound){
            malus = this.getWondedMod();
        }
        let name = this.actor.name;
        sr = parseInt(sr);
        malus = parseInt(malus);
        if(sr == 0){
            roll_max(name,skill, value, modif, malus);
        }else {
            nb_success = roll_success(name,skill, value, modif, sr, malus);
        }
        this.actor.system.modif.value = 0;
        this.actor.system.skillreroll.value=skill;
        this.actor.system.poolreroll.value=value+modif-nb_success;
        this.actor.system.srreroll.value=sr;
        this.actor.system.malusreroll.value=malus;
        //Update actor sheet UI.
        this.actor.sheet.render(true);
    }

    /**
     * Relaunch the last roll of dice with as number of dice, the previous grouping less the successes obtained.
     * Remember the result obtained (number of successes) for a future relaunch.
     * @param {*} event 
     */
    __onRollKarma(event){
        let name = this.actor.name;
        let sr = this.actor.system.srreroll.value;
        let skill = this.actor.system.skillreroll.value;
        let pool = this.actor.system.poolreroll.value;
        let malus = this.actor.system.malusreroll.value;
        let skillKarma = skill +"(Karma)";
        let nb_success = 0;
        if(sr == 0){
            roll_max(name,skillKarma, pool, 0, malus);
        }else {
            nb_success = roll_success(name,skillKarma, pool, 0, sr, malus);
        }
        this.actor.system.skillreroll.value=skill;
        this.actor.system.poolreroll.value=pool-nb_success;
        this.actor.system.srreroll.value=sr;
        this.actor.system.malusreroll.value=malus;
    }

    /**
     * Returns the penalty to apply to the roll of the dice, the penalty depends on the type of actor.
     * For the matrix avatar and the vehicles only physical injuries are considered.
     * For characters and spirits only the highest malus between physics is stunning is retained
     * @returns 
     */
    getWondedMod(){
        if(this.actor.type == 'avatar' || this.actor.type == 'vehicule'){
            var wound = this.actor.system.wound.physic.value;
            return this.getWound(wound);
        }else if(this.actor.type == 'character' || this.actor.type == 'spirit'){
            var physicMalus = this.getWound(this.actor.system.wound.physic.value);
            var stunMalus = this.getWound(this.actor.system.wound.stun.value);
            if(physicMalus > stunMalus || physicMalus == stunMalus){
                return physicMalus;
            }else if(stunMalus > physicMalus){
                return stunMalus;
            }
        }
    }
    /**
     * returns the penalty to be applied according to the number of health points.
     * @param {*} wound 
     * @returns 
     */
    getWound(wound){
        if(wound > 9){
            return 0;
        }else if(wound > 7){
            return 1;
        }else if(wound > 4){
            return 2;
        }else {
            return 3;
        }
    }
}