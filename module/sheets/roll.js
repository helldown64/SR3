/**
 * Roll dice, cacluate the number of success and send message for result on the chat.
 * @param {*} skill_name 
 * @param {*} skill_value 
 * @param {*} modif 
 * @param {*} sr 
 */
 export function roll_success(actorName, skill_name, skill_value, modif, sr, malus){
    let results = get_result_array(skill_value+modif);
    let nb_success = get_nb_success(sr+malus, results);
    
    let rollName = actorName + " : "+ skill_name + " SR "+sr;
    let codeResult = "<h5 class='dice-total'>"+nb_success+" "+game.i18n.localize('SR3.success')+"</h5>";
    let codeDetails = getDetails_success(results, sr, malus);
    let rollContent = skill_name+"("+skill_value+"), "+game.i18n.localize('SR3.reserve')+"("+modif+")";
    let malusContent = "";
    if(malus > 0){
        malusContent = "<span>"+game.i18n.localize('SR3.conditionPenality')+" sr+"+malus+"</span>";
    }

    let msg = getMSG(codeDetails,codeResult,rollName,rollContent,malusContent);
    let data = {
        title:"display results",
        content:msg
        
    }
    ChatMessage.create(data);
    return nb_success;
}
/**
 * Roll dice, cacluate the maximum dice value and send message for result on the chat.
 * @param {*} skill_name 
 * @param {*} skill_value 
 * @param {*} modif 
 */
export function roll_max(actorName, skill_name, skill_value, modif, malus){
    let results = get_result_array(skill_value+modif);
    let max = get_max_dice(results, malus);
    let codeDetails = getDetails_max(results,max);

    max = (max-malus > 0)?max-malus:1;
    let codeResult = "<h5 class='dice-total'>"+game.i18n.localize('SR3.score')+" "+max+"</h5>";
    
    let malusContent = "";
    let rollName = actorName + " : "+ skill_name;
    let rollContent = skill_name+"("+skill_value+"), "+game.i18n.localize('SR3.reserve')+"("+modif+")";
    if(malus > 0){
        malusContent = "<span>"+game.i18n.localize('SR3.conditionPenality')+" score -"+malus+"</span>";
    }
    let msg = getMSG(codeDetails,codeResult,rollName,rollContent,malusContent);
    let data = {
        title:"display results",
        content:msg
        
    }
    ChatMessage.create(data);
}

/**
 * Counts the number of successes for the given threshold
 * @param {*} sr 
 * @param {*} results 
 * @returns 
 */
function get_nb_success(sr, results){
    console.log('get_nb_success sr ' + sr);
    var success = 0;
    for(let i = 0; i < results.length; i++){
        if(results[i] >= sr){
            success++;
        }
    }
    return success;
}
/**
 * Return the maximum values from a roll dice array
 * @param {*} results 
 * @returns 
 */
function get_max_dice(results){
    let max = 0;
    for(var i = 0; i < results.length; i++){
        max = (results[i] > max) ? results[i]:max;
    }
    return max;
}
/**
 * Return an array wich contains each dice roll
 * @param {*} nb 
 * @returns 
 */
function get_result_array(nb){
    var results = [nb];
    for(var i = 0; i < nb; i++){
        results[i] = get_dice_result();
    }
    return results;
}
/**
 * 
 */
function get_dice_result(){
    var result = 0;
        var dice;
        do {
            dice = getRandomIntInclusive(1,6);
            result+= dice;
        }
        while(dice == 6);
        return result;
}
/**
 * Return random int beween min and max
 * The maximum is inclusive and the minimum is inclusive
 * @param {*} min 
 * @param {*} max 
 */
function getRandomIntInclusive(min, max){
    min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min)
}

function getDetails_success(results, sr, malus){
    let msg ="<ol class='dice-rolls'>";
    for(let i = 0; i < results.length; i++){
        let dice = results[i];
        if(dice >= sr + malus){
            msg +="<li class='roll die d6 max'>"+ dice + "</li>";
        }else if(dice == 1){
            msg +="<li class='roll die d6 min'>"+ dice + "</li>";
        }else {
            msg +="<li class='roll die d6'>"+ dice + "</li>";
        }   
    }
    msg +="</ol>";
    return msg;
}

function getDetails_max(results, max){
    let msg ="<ol class='dice-rolls'>";
    for(let i = 0; i < results.length; i++){
        let dice = results[i];
        if(dice == max){
            msg +="<span class='roll die d6 max'>"+ dice + " </span>";
        }else {
            msg +="<span class='roll die d6'>"+ dice + " </span>";
        }
    }
    msg +="</ol>";
    return msg;
}

function getMSG(codeDetails, codeResult,rollName, rollContent, malusContent){
    let msg = "";
    msg +="<div class='dice-roll'>";
    msg +="     <div class='dice-result'>";
    msg +="         <div class='dice-formula'>"+rollName+"</div>";
    msg +="         <div class='dice-tooltip'>";
    msg +="             <section class='tooltip-part'>";
    msg +="                 <div class='dice'>";
    msg +="                     <header class='part-header flexcol'>";
    msg +="                         <span class='part-formula'>"+rollContent+"</span>";
    //msg +="                         <span class='part-total'>success</span>";
    msg +=malusContent;
    msg +="                     </header>";
    msg += codeDetails;
    msg +="                 </div>";
    msg +="             </section>";
    msg +="         </div>";
    msg +=codeResult;
    msg +="     </div>";
    msg +="</div>";
    return msg;
}