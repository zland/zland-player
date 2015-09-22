

<!-- Start stores/PlayerStore.js -->

# [PlayerStore.js](PlayerStore.js)

PlayerStore provides player data. 

TODO: check the functions and delete them in favor of PlayerService

## getItemPickerItems()

get items from item picker

### Return:

* **Immutable.List** 

## getWeaponPickerItems()

get weapons from picker

### Return:

* **Immutable.List** 

## showWeaponPicker()

boolean if weapon picker is open or not

### Return:

* **Boolean** 

## isAuthenticated()

whether player is authenticated or not

### Return:

* **Boolean** 

## getPlayer()

gets the player
a I see its already using player service, awesome

### Return:

* **Immutable.Map** 

## getPlayerElement()

gets the player element wrapped into a jquery object

### Return:

* **Object** 

## getPlayerPosition()

player position in the screen

### Return:

* **[object Object]** 

## getBulletById(id)

get bullet by bullet id
TODO: maybe this is written to complicated. Check if bullets is a Map or List

### Params:

* **Number** *id* 

### Return:

* **Immuable.Map** 

## getWeapon()

get weapon using selected weapon index

### Return:

* **Immutable.Map** 

## getBulletIndexById(id)

bullet array index

### Params:

* **Number** *id* 

### Return:

* **Number** 

## getWeaponPosition()

gets weapon position in the screen

### Return:

* **[object Object]** 

<!-- End stores/PlayerStore.js -->

