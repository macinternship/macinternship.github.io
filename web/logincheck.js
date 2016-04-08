if(localStorage.username == undefined){
	window.location.replace("login.html");
}
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}