//canvas and context
var canvas = document.getElementById('pokemon1');
var context = canvas.getContext("2d");
context.font = "20px Georgia";

//array of randomized team
var team = new Array();

var listOfRegions = {'kanto':kanto, 'johto':johto, 'hoenn': hoenn, 'sinnoh': sinnoh, 'unova1': unova1, 'unova2': unova2, 'kalos': kalos};

//boolean options
var includeStarter = false;
var includeLegendarys = false;
var onlyFinals = false;
var allowDuplicates = true;

//the region that was selected
var region;

//the ID of the first starter of the selected region
var firstStarterID;

//get the IDs of the team, draw their images, and draw their names
function getTeam()
{
    getRegion();
    createTeam();
    setTeamImages();
    setTeamNames();
}

function getRegion()
{
    var menu = document.getElementById("menu");
    var regionName = menu.options[menu.selectedIndex].value;
    region = listOfRegions[regionName];
    firstStarterID = region.starter;
}

//returns an int that is valid in the region
function getRandPokemonID()
{
    var ID = Math.floor(Math.random() * 721) + 1;
    while (true)
    {
        if (region[ID] != undefined)
            break;
        else
            ID = Math.floor(Math.random() * 721) + 1;
    }
    return ID;
}


//get the IDs of the team
function createTeam()
{
    var teamIndex = 0;

    //include a starter if checked
    if (includeStarter)
    {
        starterID = Math.floor((Math.random() * 3) + 1);
        var x = 0;

        //checks if the starter is to be in its final form
        if (onlyFinals)
            x = 2;
        if (starterID == 1)
            team[0] = (firstStarterID) + x;
        else if (starterID == 2)
            team[0] = (firstStarterID + 3) + x;
        else
            team[0] = (firstStarterID + 6) + x;
        teamIndex = 1;
    }
    for (teamIndex = teamIndex; teamIndex < 6; teamIndex++)
    {
        var currentID = 0;
        var keepLooking = true;
        while (keepLooking)
        {
            currentID = getRandPokemonID();
            if (!includeLegendarys)
            {
                var isLegendary = true;

                //if not including legendarys, keep generating an ID until it is a pokemon that isn't a legendary
                while (isLegendary)
                {
                    if (region[currentID].indexOf("+") == -1)
                        isLegendary = false;
                    else
                        currentID = getRandPokemonID();
                }
            }
            else
                currentID = getRandPokemonID();

            //only allow final evolutions if checked
            if (onlyFinals)
            {
                var noFinal = true;
                while (noFinal)
                {
                    //final evolutions and not legendary
                    if (region[currentID].indexOf("*") == -1 && !includeLegendarys && region[currentID].indexOf("+") == -1)
                        noFinal = false;

                    //final evolutions and normal OR legendary
                    else if (region[currentID].indexOf("*") == -1 && includeLegendarys)
                        noFinal = false;
                    else
                        currentID = getRandPokemonID();
                }
            }

            //checks for duplicates
            if (allowDuplicates)
                keepLooking = false;
            else if (!allowDuplicates)
                if (!checkDuplicates(currentID))
                    keepLooking = false;
        }
        team[teamIndex] = currentID;
    }
}


//true if duplicate exist, false otherwise
function checkDuplicates(ID)
{
    for (i = 0; i < team.length; i++)
        if (team[i] == ID)
            return true;
    return false;
}

//get the names of the pokemons in the team
function setTeamNames()
{
    //legend
    context.fillText("** = Two stages from final evolution",150,430);
    context.fillText("* = One stage from final evolution",150,450);
    context.fillText("+ = legendary",150,470);



    var teamIndex = 0;
    var xPos;
    var yPos;

    //first row of names
    for (var i = 0; i < 3; i++)
    {
        xPos = i * 255;
        yPos = 180;
        context.fillText(region[team[teamIndex]],xPos,yPos);
        teamIndex++;
    }

    //second row of names
    for (var i = 0; i < 3; i++)
    {
        xPos = i * 255;
        yPos = 390;
        context.fillText(region[team[teamIndex]],xPos,yPos);
        teamIndex++;
    }
}

//get the images of the pokemons in the team
function setTeamImages()
{
    //clear the canvas to get new set of images
    context.clearRect(0,0,canvas.width,canvas.height);

    var teamIndex = 0;

    //first row of pokemon images
    for(i = 0; i < 3; i++)
    {
        var imageObj = new Image();
        imageObj.src = 'img/All/' + team[teamIndex] + '.png';
        imageObj.setAtX = i * 255;
        imageObj.setAtY = 50;
        imageObj.onload = function()
        {
            context.drawImage(this, this.setAtX, this.setAtY);
        };
        teamIndex++;
    }

    //second row of pokemon images
    for(i = 0; i < 3; i++)
    {
        var imageObj = new Image();
        imageObj.src = 'img/All/' + team[teamIndex] + '.png';
        imageObj.setAtX = i * 255;
        imageObj.setAtY = 250;
        imageObj.onload = function()
        {
            context.drawImage(this, this.setAtX, this.setAtY);
        };
        teamIndex++;
    }
}



/* Functions to reverse the booleans of the check boxes */

function starter(){includeStarter = !includeStarter;}

function legendary(){includeLegendarys = !includeLegendarys;}

function final(){onlyFinals = !onlyFinals;}

function duplicates(){allowDuplicates = !allowDuplicates;}
