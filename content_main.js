$(document).ready(function(){
	$(document).on("click", ".charSelFilter a", function() {
		const filterRace = $(this).attr("id").replace("filter_","");
		if(filterRace == "all"){
			$(".character-selector .character").show();
		}else{
			$(".character-selector .character").hide();
			$(".character-selector .character.race_"+filterRace).show();
		}
		$(".charSelFilter a").removeClass("blumActive");
		$(this).addClass("blumActive");
	});
	$("body").append('<div id="blumIcon" class="toggleBlumMenu"><img src="'+chrome.runtime.getURL("images/logo48.png")+'" /></div>');
	$("body").append(`<div id="blumMenu"><ul>
	<li><a href="https://etherorcs.com/dapp">Terminal</a></li>
	<li><a href="https://dungeons.etherorcs.com/?start">Dungeons</a></li>
	<li><a href="https://etherorcs.com/town/emporium">Open Chests</a></li>
	<li><a href="https://etherorcs.com/town/crafting">Blacksmith</a></li>
	<li><a class="toggleBlumMenu" href="#">[close]</a></li>
	</ul></div>`);
	$(".toggleBlumMenu").click(function(e){e.preventDefault(); $("#blumMenu").toggle();});
});

let charSelTimer;
let charSelLock = false;
$(document).on('DOMSubtreeModified', function(){
	if($(".character-select-dialog").length > 0 && !charSelLock){
		charSelLock = true;
		if(charSelTimer) clearTimeout(charSelTimer);
		charSelTimer = setTimeout(addCharSelFilter, 1500);
	}
	if(charSelLock && $(".character-select-dialog").length < 1){
		charSelLock = false;
		if(charSelTimer) clearTimeout(charSelTimer);
	}
});

function addCharSelFilter(){
	if($(".character-select-dialog").length < 1 || $(".charSelFilter").length > 0) return;
	$(".character-selector-inner").prepend('<div class="charSelFilter">Filter: <a class="blumActive" id="filter_all">All</a> <a id="filter_orc">Orc</a> <a id="filter_shaman">Shaman</a> <a id="filter_ogre">Ogre</a> <a id="filter_rogue">Rogue</a></div>');
	$(".character-selector .character").each(function(){
		const orcNumber = $(this).find(".MuiListItemText-primary").text().replace(/\D/g,'');
		const orcLevel =  parseInt($(this).find(".MuiListItemText-secondary").text().replace(/\D/g,''))-($(this).hasClass("disabled")?100000:0);
		let race = "orc";
		if(orcNumber > 5050) race = "shaman";
		if(orcNumber > 8050) race = "ogre";
		if(orcNumber > 11050) race = "rogue";
		if(orcNumber > 14050) race = "mage";
		
		if(!$(this).hasClass("race_"+race))$(this).addClass("race_"+race);
		$(this).attr("data-sort",orcLevel);
	});
	$(".character-selector-inner .character").sort(function (a, b) {
		const contentA = parseInt( $(a).data('sort'));
		const contentB = parseInt( $(b).data('sort'));
		return (contentA > contentB) ? -1 : (contentA > contentB) ? 1 : 0;
	}).appendTo(".character-selector-inner");
}

