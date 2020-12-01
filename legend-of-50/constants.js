export const GAME_WIDTH = 384;
export const GAME_HEIGHT = 216;

/**
 * Tile constants
 */

export const TILE_WIDTH = 16;
export const TILE_HEIGHT = 16;

export const TILE_TOP_LEFT_CORNER = 3
export const TILE_TOP_RIGHT_CORNER = 4
export const TILE_BOTTOM_LEFT_CORNER = 22
export const TILE_BOTTOM_RIGHT_CORNER = 23

export const TILE_EMPTY = 18

export const TILE_FLOORS = [
    6, 7, 8, 9, 10, 11, 12,
    25, 26, 27, 28, 29, 30, 31,
    44, 45, 46, 47, 48, 49, 50,
    63, 64, 65, 66, 67, 68, 69,
    87, 88, 106, 107
]

export const TILE_TOP_WALLS = [57, 58, 59]
export const TILE_BOTTOM_WALLS = [78, 79, 80]
export const TILE_LEFT_WALLS = [76, 95, 114]
export const TILE_RIGHT_WALLS = [77, 96, 115]

export const DOOR_TOP_CLOSED = [133, 134, 152, 153];
export const DOOR_TOP_OPEN = [97, 98, 116, 117];
export const DOOR_BOTTOM_CLOSED = [215, 216, 234, 235];
export const DOOR_BOTTOM_OPEN = [140, 141, 159, 160];
export const DOOR_LEFT_CLOSED = [218, 219, 237, 238];
export const DOOR_LEFT_OPEN = [180, 181, 199, 200];
export const DOOR_RIGHT_CLOSED = [173, 174, 192, 193];
export const DOOR_RIGHT_OPEN = [171, 172, 190, 191];

/**
 * Map constants
 */

export const MAP_WIDTH = (GAME_WIDTH / TILE_WIDTH) - 2;
export const MAP_HEIGHT = Math.floor(GAME_HEIGHT / TILE_HEIGHT) - 2;

export const MAP_RENDER_OFFSET_X = (GAME_WIDTH - (MAP_WIDTH * TILE_WIDTH)) / 2
export const MAP_RENDER_OFFSET_Y = (GAME_HEIGHT - (MAP_HEIGHT * TILE_HEIGHT)) / 2

/**
 * Direction constants
 */

 export const LEFT = 'left';
 export const RIGHT = 'right';
 export const UP = 'up';
 export const DOWN = 'down';

 /**
  * Player constants
  */

export const PLAYER_PADDING = 5;

export const HEART_WIDTH = 16;
export const FULL_HEART_FRAME_ID = 4;
export const HALF_HEART_FRAME_ID = 2;
export const EMPTY_HEART_FRAME_ID = 0;

/**
 * Common constants
 */

export const SECOND = 1000;