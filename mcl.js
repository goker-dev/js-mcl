/*
 * 
 * MCL (Monte Carlo Localization)
 * 
 * Version: 1.0.0 
 * Date (d/m/y): 05/12/13
 * Author: @goker 
 * Licensed under the MIT license
 * Demo: http://gokercebeci.com/demos/js-mcl/
 * 
 */

var robot, sensor, map;

// ROBOT
// =============================================================================
var Robot = new Class({
    x: 0,
    y: 0,
    noise: 0, // movement noise
    motion: [0, 0],
    html: '<div class="robot"></div>',
    init: function(x, y, noise) {
        this.x = x;
        this.y = y;
        this.noise = noise;
    },
    update: function() {
        $('#map .robot').remove();
        $('#R' + this.y + 'C' + this.x).append(this.html);

        MCL.motion_update(this.motion);
        MCL.sensor_update(sensor.measure(map.matrix[this.y][this.x]));

        var log = '';
        map.iterator(function(cell, r, c, i) {
            $('#R' + r + 'C' + c + ' p')
                    .html('<b title="' + (cell.probability)
                            + '"><i style="height:'
                            + (cell.probability * 100) + '%"></i></b>');
            log += cell.probability + (((i + 1) % map.c) ? ', ' : "\n");
        });
        $('#log').val(log + "\n" + $('#log').val());
    }
});
// SENSOR
// =============================================================================
var Sensor = new Class({
    noise: 0,
    color: '',
    init: function(noise) {
        this.noise = noise;
    },
    measure: function(cell) {
        this.color = cell.color;
        return this;
    }
});
// MAP
// =============================================================================
var Cell = new Class({
    id: '',
    color: '',
    probability: 1,
    html: '',
    init: function(r, c, color) {
        this.id = 'R' + r + 'C' + c;
        this.color = color;
        this.probability = 1;
        this.html = '<div id="' + this.id + '" class="cell" style="background: '
                + this.color + '"><span>[' + r + '][' + c + ']</span><p></p></div>';
    }
});
var Map = new Class({
    r: 0, // row
    c: 0, // column
    html: '',
    matrix: [],
    iteration: 0,
    colors: {r: '#CD0013', g: '#6EB70E', b: '#0072FF', y: '#F3C520'},
    init: function(map) {
        var mapRows = map.split("\n");
        $('#map').empty();
        for (var r in mapRows) {
            this.matrix[r] = [];
            var mapColumns = mapRows[r].split(",");
            for (var c in mapColumns) {
                this.matrix[r][c] = new Cell(r, c, this.colors[mapColumns[c].replace(/ /, '')]);
                $('#map').append(this.matrix[r][c].html);
            }
            //$('#map').append('<div class="clear"></div>');
        }
        this.r = this.matrix.length;
        this.c = this.matrix[0].length;
        this.iteration = this.r * this.c;
            
        $('#map .cell').css({
            'width': Math.floor(100 / this.c) + '%',
            'height': Math.floor(100 / this.r) + '%'
        });
    },
    iterator: function(f) {
        for (var i = 0; i < this.iteration; i++) {
            var r = Math.floor(i / this.c);
            var c = i % this.c;
            var cell = this.matrix[r][c];
            f(cell, r, c, i);
        }
    }
});

// MCL
// =============================================================================
var MCL = {
    motion_update: function(motion) {
        var q = [];
        map.iterator(function(cell, r, c, i) {
            // before step
            var x = ((map.c + c - motion[1]) % map.c);
            var y = ((map.r + r - motion[0]) % map.r);
            var before = map.matrix[y][x];
            var moved = before.probability * (1 - robot.noise);
            var nomove = cell.probability * robot.noise;
            q[i] = (moved + nomove);
        });
        map.iterator(function(cell, r, c, i) {
            cell.probability = q[i];
        });
    },
    sensor_update: function(sensor) {
        map.iterator(function(cell) {
            // Adjust sensor error
            cell.probability = sensor.color === cell.color
                    ? (cell.probability * (1 - sensor.noise))
                    : cell.probability = (cell.probability * sensor.noise);
        });
        // Count # terms for normalizing
        numTerms = 0;
        map.iterator(function(cell) {
            numTerms = numTerms + cell.probability;
        });
        // Normalize        
        map.iterator(function(cell) {
            cell.probability = cell.probability / numTerms;
        });
    }
};

// GENERATE & KIDNAP FUCTIONS
// =============================================================================
function generate() {
    $('nav .simulator').trigger('click');
    map = new Map($('textarea[name=map]').val());
    sensor = new Sensor($('input[name="sensor[noise]"]').val() * 1);
    robot = new Robot(
            $('input[name="robot[x]"]').val() * 1,
            $('input[name="robot[y]"]').val() * 1,
            $('input[name="robot[noise]"]').val() * 1
            );
    robot.update();
}
$('#generate').on('click', generate);
function kidnap() {
    $('nav .simulator').trigger('click');
    robot.x = $('input[name="kidnap[x]"]').val() * 1;
    robot.y = $('input[name="kidnap[y]"]').val() * 1;
    robot.motion = [0, 0];
    robot.update();
}
$('#kidnap').on('click', kidnap);
// auto generate
generate();
// ROBOT CONTROL with KEYBOARD
// =============================================================================
var keyMap = {32: 'space', 37: 'left', 38: 'up', 39: 'right', 40: 'down'};
$(document).keydown(function(e) {
    switch (keyMap[e.keyCode]) {
        case 'up':
            robot.y = ((map.r + robot.y - 1) % map.r);
            robot.motion = [-1, 0];
            robot.update();
            break;
        case 'down':
            robot.y = ((robot.y + 1) % map.r);
            robot.motion = [1, 0];
            robot.update();
            break;
        case 'left':
            robot.x = ((map.c + robot.x - 1) % map.c);
            robot.motion = [0, -1];
            robot.update();
            break;
        case 'right':
            robot.x = ((robot.x + 1) % map.c);
            robot.motion = [0, 1];
            robot.update();
            break;
    }
});