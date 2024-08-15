var Entity = require('../entity');

function Mode() {
    this.ID = -1;
    this.name = "Blank";
    this.decayMod = 1.0; // Modifier for decay rate (Multiplier)
    this.packetLB = 49; // Packet id for leaderboard packet (48 = Text List, 49 = List, 50 = Pie chart)
    this.haveTeams = false; // True = gamemode uses teams, false = gamemode doesnt use teams

    this.specByLeaderboard = false; // false = spectate from player list instead of leaderboard
}

module.exports = Mode;

// Override these

Mode.prototype.onServerInit = function(gameServer) {
    // Called when the server starts
    gameServer.run = true;
};

Mode.prototype.onTick = function(gameServer) {
    // Called on every game tick
};

Mode.prototype.onChange = function(gameServer) {
    // Called when someone changes the gamemode via console commands
};

Mode.prototype.onPlayerInit = function(player) {
    // Called after a player object is constructed
};

Mode.prototype.onPlayerSpawn = function(gameServer, player) {
    // Called when a player is spawned
    player.color = gameServer.getRandomColor(); // Random color
    gameServer.spawnPlayer(player);
};

Mode.prototype.pressQ = function(gameServer, player) {
    // Called when the Q key is pressed
    if (player.spectate) {
        if (!player.freeRoam) player.freeRoam = true;
        else player.freeRoam = false;
        return;
    }

    switch(gameServer.config.power) {
        case 1: // spawn virus
            var v = new Entity.Virus(gameServer.getNextNodeId(), null, player.mouse, 100);
            gameServer.addNode(v);
            break;
        case 2: // teleport
            player.cells.sort(function(a, b) {
                if(a.mass < b.mass) return 1;
                if(a.mass > b.mass) return -1;
                return 0;
            })

            for(var i in player.cells) {
                player.cells[i].position = player.mouse.clone();
            }
            break;
        case 3: // food
            for(let i = 0; i < 100; i++) {
                var f = new Entity.Food(gameServer.getNextNodeId(), null, player.mouse, 50, gameServer);
                f.setColor(gameServer.getRandomColor());
                gameServer.currentFood++;
                gameServer.addNode(f);
            }
            break;
        case 4: // mass
            for (var i in player.cells) {
                player.cells[i].mass += 50;
            }
            break;
        case 5: // merge
            const set = NaN;
            var state;
            if (set == "true" || set == "yes" || set == "1") {
                player.mergeOverride = true;
                state = true;
            } else if (set == "false" || set == "no" || set == "0") {
                player.mergeOverride = false;
                state = false;
            } else {
                if (player.cells.length == 1) {
                    break;
                }
                if (player.mergeOverride) {
                    player.mergeOverride = false;
                } else {
                    player.mergeOverride = true;
                }

                state = player.mergeOverride;
            }
            break;
    }
};

Mode.prototype.pressW = function(gameServer, player) {
    // Called when the W key is pressed

    gameServer.nodeHandler.ejectMass(player);
};

Mode.prototype.pressSpace = function(gameServer, player) {
    // Called when the Space bar is pressed
    gameServer.nodeHandler.splitCells(player);
};

Mode.prototype.onCellAdd = function(cell) {
    // Called when a player cell is added
};

Mode.prototype.onCellRemove = function(cell) {
    // Called when a player cell is removed
};

Mode.prototype.onCellMove = function(x1, y1, cell) {
    // Called when a player cell is moved
};

Mode.prototype.updateLB = function(gameServer) {
    // Called when the leaderboard update function is called
};
