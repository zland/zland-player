

<!-- Start services/PlayerService.js -->

# [PlayerService.js](PlayerService.js)

PlayerService handles saving and retrieving player data from localStorage to localStorage TODO: put this file into zland-core

## playerExistsInStorage()

Does player exists in localStorage?

### Return:

* **Boolean** 

## retrievePlayer()

loads player from local storage and updates object properties

## getPlayer()

for getting player data

### Return:

* **Immutable.Map** 

## updatePlayer(player)

update the player

### Params:

* **Immutable.Map** *player* 

## savePlayer()

save the player to local storage

## createNewPlayer()

creates a new player (usually done if the game starts the first time)

### Return:

* **Immutable.Map** player

<!-- End services/PlayerService.js -->

