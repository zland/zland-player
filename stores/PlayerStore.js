/*!
 * Copyright 2015 Florian Biewald
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @filedescription PlayerStore provides player data.
 *
 * 
 * TODO: check the functions and delete them in favor of PlayerService
 */

'use strict';

var ChangeEventEmitter = require('core/ChangeEventEmitter');
var assign = require('object-assign');
var _ = require('underscore');
var Immutable = require('immutable');
var Dispatcher = require('core/Dispatcher');
var Constants = require('player/Constants');
var PlayerService = require('player/services/PlayerService');
var CoreConstants = require('core/Constants');
var CrosshairConstants = require('crosshair/Constants');
var HudConstants = require('hud/Constants');
var WeaponConstants = require('weapon/Constants');
var MapStore = require('map/stores/MapStore');
var mapCalculate = require('core/mapCalculate');
var AuthService = require('core/services/AuthService');
var math = require('core/math');
var KnifeBulletStructure = require('core/datastructures/KnifeBulletStructure');

var _$player;
var _isAuthenticated = false;
var _isWeaponRecharging = false;
var _showWeaponPicker = false;

var _runningBulletId = 0;

function auth() {
  return AuthService.auth(PlayerService.getPlayer())
  .then(function(response) {
    _isAuthenticated = true;
    PlayerStore.emitChange();
  })
  .catch(function(e) {
    console.error('cannot authenticate: ' + e.stack);
  });
}

function generateBullet(sourcePoint, targetPoint) {
  var distance, distanceSteps, xunits, yunits;
  var radians, radiansRotation, rect, rotationDivergence, sourcePoint, targetPoint, xcosRotated, ysinRotated;


  radians = Math.atan2(targetPoint.y - sourcePoint.y, targetPoint.x - sourcePoint.x);
  rotationDivergence = (Math.PI / 180) * (MapStore.getMapHeading());
  // radiansRotation = radians + rotationDivergence;
  radiansRotation = radians;

  // if (radiansRotation < 0) {
  //   radiansRotation += 2 * Math.PI;
  // }
  //
  // if (radians < 0) {
  //   radians += 2 * Math.PI;
  // }

  xcosRotated = Math.cos(radiansRotation);
  ysinRotated = Math.sin(radiansRotation);
  // xcos = Math.cos(radians);
  // ysin = Math.sin(radians);

  // take greatest range so that player can't see the bullet vanish
  // var endPosition = {
  //   x: mapCalculate.getHeight(),
  //   y: mapCalculate.getHeight()
  // };
  //
  // distance = math.distance(sourcePoint, endPosition).distance;

  var knifeBullet = KnifeBulletStructure();

  return Immutable.fromJS(_.extend(knifeBullet, {
    xunits: xcosRotated * PlayerStore.getWeapon().get('speed'),
    yunits: ysinRotated * PlayerStore.getWeapon().get('speed'),
    xcos: xcosRotated,
    ysin: ysinRotated,
    sourcePoint: sourcePoint,
    distanceSteps: PlayerStore.getWeapon().get('speed'),
    id: _runningBulletId++,
    charge: PlayerStore.getWeapon().get('charge'),
    distance: PlayerStore.getWeapon().get('distance')
  }));
}

function createPlayer() {
  if (!PlayerService.playerExistsInStorage()) {
    PlayerService.createNewPlayer();
  } else {
    PlayerService.retrievePlayer();
  }
}

var PlayerStore = assign({}, ChangeEventEmitter, {
  /**
   * get items from item picker
   * @return {Immutable.List}
   */
  getItemPickerItems: function() {
    return [];
  },
  /**
   * get weapons from picker
   * @return {Immutable.List}
   */
  getWeaponPickerItems: function() {
    return this.getPlayer().get('weapons').map(function(weapon) {
      return {id: weapon.get('name'), image: weapon.get('hudImage')};
    });
  },
  /**
   * boolean if weapon picker is open or not
   * @return {Boolean}
   */
  showWeaponPicker: function() {
    return _showWeaponPicker;
  },
  /**
   * whether player is authenticated or not
   * @return {Boolean}
   */
  isAuthenticated: function() {
    return _isAuthenticated;
  },
  /**
   * gets the player
   * a I see its already using player service, awesome
   * @return {Immutable.Map}
   */
  getPlayer: function() {
    return PlayerService.getPlayer();
  },
  /**
   * gets the player element wrapped into a jquery object
   * @return {Object}
   */
  getPlayerElement: function() {
    return _$player;
  },
  /**
   * player position in the screen
   * @return {{x: {Number}, y: {Number}}}
   */
  getPlayerPosition: function() {
    if (!_$player) {
      return null;
    }
    var rect = _$player.get(0).getBoundingClientRect();
    return {
      x: rect.left - (_$player.width() / 2),
      y: rect.top - (_$player.height() / 2),
    };
  },
  /**
   * get bullet by bullet id
   * TODO: maybe this is written to complicated. Check if bullets is a Map or List
   * @param  {Number} id
   * @return {Immuable.Map}
   */
  getBulletById: function(id) {
    var bullets = PlayerStore.getWeapon().get('bullets');
    var bullet = null;
    bullets.forEach(function(value) {
      if (value.get('id') === id) {
        bullet = value;
        return false;
      }
    });
    return bullet;
  },
  /**
   * get weapon using selected weapon index
   *
   * @return {Immutable.Map}
   */
  getWeapon: function() {
    return this.getPlayer().get('weapons').get(this.getPlayer().get('selectedWeaponIndex'));
  },
  /**
   * bullet array index
   * @param  {Number} id
   * @return {Number}
   */
  getBulletIndexById: function(id) {
    var bullets = PlayerStore.getWeapon().get('bullets');
    var bulletIndex = null;
    bullets.forEach(function(value, i) {
      if (value.get('id') === id) {
        bulletIndex = i;
        return false;
      }
    });
    return bulletIndex;
  },
  /**
   * gets weapon position in the screen
   * @return {{x: {Number}, y: {Number}}}
   */
  getWeaponPosition: function() {
    // hacky, very hacky
    var rect = _$player.find('.weapon').get(0).getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top
    }
  }
});

PlayerStore.dispatchToken = Dispatcher.register(function(action) {
  switch (action.type) {
    case WeaponConstants.WEAPON_BULLET_FLIGHT:
      var bullet = PlayerStore.getBulletById(action.id);
      var bulletIndex = PlayerStore.getBulletIndexById(bullet.get('id'));
      if (action.distance > bullet.get('distance') || bullet.get('charge') <= 0) {
        PlayerService.updatePlayer(
          PlayerService.getPlayer().updateIn(['weapons', PlayerService.getPlayer().get('selectedWeaponIndex'), 'bullets'], function(bullets) {
            return bullets.splice(bulletIndex, 1);
          })
        );
      } else {
        if (bullet.get('name') === 'knifebullet') {
          PlayerService.updatePlayer(
            PlayerService.getPlayer().updateIn(['weapons', PlayerService.getPlayer().get('selectedWeaponIndex'), 'bullets', bulletIndex, 'rotation'], function(rotation) {
              return rotation - bullet.get('rotationAdd');
            })
          );
        }
      }
      PlayerStore.emitChange();
      break;
    case CrosshairConstants.CROSSHAIR_SHOOT:
      if (_isWeaponRecharging) {
        return;
      }
      var targetPoint = action.center;
      var sourcePoint = PlayerStore.getWeaponPosition();

      PlayerService.updatePlayer(
        PlayerService.getPlayer().updateIn(['weapons', PlayerService.getPlayer().get('selectedWeaponIndex'), 'bullets'], function(bullets) {
          return bullets.push(generateBullet(sourcePoint, targetPoint));
        })
      );

      PlayerStore.emitChange();
      _isWeaponRecharging = true;

      // initiate recharging
      setTimeout(function() {
        _isWeaponRecharging = false;
      }, PlayerStore.getWeapon().get('rechargeTime'));
      break;
    case Constants.PLAYER_PLACED:
      _$player = action.$el;
      break;
    case Constants.PLAYER_DIED:
      PlayerService.updatePlayer(PlayerService.getPlayer().set('dead', true));
      PlayerStore.emitChange();
      break;
    case CoreConstants.CORE_CONTINUE:
      PlayerService.updatePlayer(PlayerService.getPlayer().set('dead', false));
      PlayerStore.emitChange();
      break;
    case HudConstants.HUD_CHANGE:
      console.log(action);
      break;
    case HudConstants.HUD_TOGGLE_WEAPON_PICKER:
      _showWeaponPicker = action.toggle;
      PlayerStore.emitChange();
      break;
  }
});

createPlayer();
auth();

setInterval(function() {
  PlayerService.savePlayer()
}, 10000);

module.exports = PlayerStore;
