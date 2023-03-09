var COUNT_SHIP_BUTTON = 20;
var SIZE = 10;
const direction = {left: 0, top: 1 ,right: 2, bottom: 3, center: -1};

var ships = [
    { type_ship: '1', x: 0, y: 0, position: direction.left},
    { type_ship: '1', x: 2, y: 0, position: direction.left},
    { type_ship: '1', x: 7, y: 3, position: direction.left},
    { type_ship: '1', x: 6, y: 0, position: direction.left},

    { type_ship: '2', x: 9, y: 1, position: direction.top},
    { type_ship: '2', x: 0, y: 3, position: direction.right},
    { type_ship: '2', x: 4, y: 3, position: direction.bottom},

    { type_ship: '3', x: 7, y: 6, position: direction.left},
    { type_ship: '3', x: 2, y: 6, position: direction.bottom},

    { type_ship: '4', x: 6, y: 8, position: direction.right},
]


function start() {

    if(document.querySelector('TABLE') === null){
        button_start = document.querySelector('button');
        button_start.style.top = 20 + "px";
        button_start.innerHTML = "Перезапустить";

        bd = document.querySelector('div');
        table = document.createElement('TABLE');
        table.setAttribute('id', 'tb');

        for (var i = 0; i < SIZE; ++i) {
          var tr = document.createElement('TR');
          for (var j = 0; j < SIZE; ++j) {
            var but = document.createElement('BUTTON');
            but.setAttribute('class', 'button_bout');
            but.setAttribute('id', i*10+j);
            but.setAttribute('onClick', 'shot(this.id);');
            but.append('O');
            tr.append(but);
          }
          table.append(tr);
        }

        bd.append(table);

        tb = document.querySelector('#tb');
    }
    else{
        location.reload();
    }
    spavn_ships();
}


function spavn_ships(){
    var obj;
    var coordinates=0;
    var x,y;

    for (let i = 0, count = 10; count > 0; i++) {
        i %= 10;
        obj = document.getElementById(ships[i].y*10 + ships[i].x);
        
        if(ships[i].type_ship === '1'){
            coordinates = obj.id;
            obj.id = 'ship_1_' + coordinates;
            count--;
        }
        else if(ships[i].type_ship === '2'){
            coordinates = obj.id;
            obj.id = 'ship_2_head_' + ships[i].position + '_' + coordinates;

            obj = position_ships(ships[i].position, ships[i].y, ships[i].x);
            coordinates = obj.id;
            obj.id = 'ship_2_' + ships[i].position + '_' + coordinates;

            count--;
        }
        else if(ships[i].type_ship === '3'){
            coordinates = obj.id;
            obj.id = 'ship_3_head_'+ ships[i].position + '_' + coordinates;

            obj = position_ships(ships[i].position, ships[i].y, ships[i].x);
            coordinates = obj.id;
            obj.id = 'ship_3_'+ ships[i].position + '_'+ coordinates;

            obj = position_ships(ships[i].position, Math.floor(coordinates/10), coordinates%10);
            coordinates = obj.id;
            obj.id = 'ship_3_'+ ships[i].position + '_' + coordinates;

            count--;
        }
        else if(ships[i].type_ship === '4'){
            coordinates = obj.id;
            obj.id = 'ship_4_head_'+ ships[i].position + '_' + coordinates;
            obj = position_ships(ships[i].position, ships[i].y, ships[i].x);
            coordinates = obj.id;
            obj.id = 'ship_4_' + ships[i].position + '_'+ coordinates;

            obj = position_ships(ships[i].position, Math.floor(coordinates/10), coordinates%10);
            coordinates = obj.id;
            obj.id = 'ship_4_'+ ships[i].position + '_' + coordinates;

            obj = position_ships(ships[i].position, Math.floor(coordinates/10), coordinates%10);
            coordinates = obj.id;
            obj.id = 'ship_4_' + ships[i].position + '_'+ coordinates;

            count--;
        }
    }
}

function position_ships(position,y,x){

    switch(position){
        case direction.left:
            if(x === 0) x++;
            obj = document.getElementById(y*10 + x-1);
            break;
        case direction.top:
            if(y===0)y++;
            obj = document.getElementById((y-1)*10 + x);
            break;
        case direction.right:
            if(x === 9)x--;
            obj = document.getElementById(y*10 + x+1);
            break;
        case direction.bottom:
            if(y === 9) y--;
            obj = document.getElementById((y+1)*10 + x);
            break;
        default:
            break;
    }
    return obj;
}

function shot(val){
    var obj = document.getElementById(val); /*индекс кнопки*/
    var type_ship = val.substr(5,1);
    var head_ship = obj;
    var dir_ship = Number(obj.id.substr(7,1));
    obj.innerHTML = "X";

    if('ship' === val.substr(0, 4)) {
        COUNT_SHIP_BUTTON--;
        obj.style.background = "red";

        let x = Number(obj.id.substr(-1,1)), y = Number(obj.id.substr(-2,1));
        if(obj.id.substr(-2,1) === '_') y = 0;
        let type = obj.id.substr(0,5);
        obj.id = obj.id.replace(type, 'kill_');
        var isHead = obj.id;
        if(val.substr(5,1) === '1'){
            kill_ship(obj);
        }
        else if(val.substr(5,1) === '2'){
            let hit;

            while(!(isHead.includes('head'))) {
                head_ship = find_head(x, y, dir_ship, 2);
                isHead = head_ship.id;
            }

            dir_ship = Number(head_ship.id.substr(12,1));

            hit = count_hit(head_ship, dir_ship, 2);

            if(hit !== null && isHead.substr(0,4) ==='kill') {
 
                kill_ship(head_ship);
                kill_ship(hit);
            }

        }
        else if(val.substr(5,1) === '3'){
            let hit_1 = null, hit_2 = null;
            let i = 0;
            while(!(isHead.includes('head'))) {
                   switch(dir_ship){
                        case direction.left:
                            head_ship = find_head(x+i, y, dir_ship, 3);
                            break;
                        case direction.top:
                            head_ship = find_head(x, y+i, dir_ship, 3);
                            break;
                        case direction.right:
                            head_ship = find_head(x-i, y, dir_ship, 3);
                            break;
                        case direction.bottom:
                            head_ship = find_head(x, y-i, dir_ship, 3);
                            break;
                    }
                i++;
                if(head_ship !== null)isHead = head_ship.id;
            }

            dir_ship = Number(head_ship.id.substr(12,1));

            hit_1 = count_hit(head_ship, dir_ship, 3);
            if(hit_1 !== null)hit_2 = count_hit(hit_1, dir_ship, 3);

            if(hit_1 !== null && hit_2 !== null && isHead.substr(0,4) ==='kill') {
                kill_ship(head_ship);
                kill_ship(hit_1);
                kill_ship(hit_2);
            }

        }
        else{
            let hit_1 = null, hit_2 = null, hit_3 = null;
            let i = 0;
            while(!(isHead.includes('head'))) {
                   switch(dir_ship){
                        case direction.left:
                            head_ship = find_head(x+i, y, dir_ship, 4);
                            break;
                        case direction.top:
                            head_ship = find_head(x, y+i, dir_ship, 4);
                            break;
                        case direction.right:
                            head_ship = find_head(x-i, y, dir_ship, 4);
                            break;
                        case direction.bottom:
                            head_ship = find_head(x, y-i, dir_ship, 4);
                            break;
                    }
                i++;
                if(head_ship !== null)isHead = head_ship.id;
            }

            dir_ship = Number(head_ship.id.substr(12,1));

            hit_1 = count_hit(head_ship, dir_ship, 4);
            if(hit_1 !== null)hit_2 = count_hit(hit_1, dir_ship, 4);
            if(hit_2 !== null)hit_3 = count_hit(hit_2, dir_ship, 4);

            if(hit_1 !== null && hit_2 !== null && hit_3 !== null && isHead.substr(0,4) ==='kill') {
                kill_ship(head_ship);
                kill_ship(hit_1);
                kill_ship(hit_2);
                kill_ship(hit_3);
            }
        }
    }
    if(COUNT_SHIP_BUTTON === 0) {
        alert("ПОБЕДА!!!");
        location.reload();
    }
}

function find_head(x, y, position, type){/*invesion*/
    var obj_head;
    switch(position){
        case direction.left:
            if(x === 9) x--;
            obj_head = document.getElementById('kill_' + type + '_head_' + position +'_' + Number(y*10 + x+1));
            if(obj_head === null) obj_head = document.getElementById('ship_' + type + '_head_' + position +'_' + Number(y*10 + x+1));
            break;
        case direction.top:
            if(y === 9) y--;
            obj_head = document.getElementById('kill_' + type + '_head_' + position + '_' + Number((y+1)*10 + x));
            if(obj_head === null) obj_head = document.getElementById('ship_' + type + '_head_' + position +'_' + Number((y+1)*10 + x));
            break;
        case direction.right:
            if(x === 0) x++;
            obj_head = document.getElementById('kill_' + type + '_head_' + position +'_' + Number(y*10 + x-1));
            if(obj_head === null) obj_head = document.getElementById('ship_' + type + '_head_' + position +'_' + Number(y*10 + x-1));
            break;
        case direction.bottom:
            if(y === 0) y++;
            obj_head = document.getElementById('kill_' + type + '_head_' + position +'_' + Number((y-1)*10 + x));
            if(obj_head === null) obj_head = document.getElementById('ship_' + type + '_head_' + position +'_' + Number((y-1)*10 + x));
            break;
        default:
            obj_head = null;
            break;
    }

    return obj_head;
}

function count_hit(obj, position, type){
    let x = Number(obj.id.substr(-1,1)), y = Number(obj.id.substr(-2,1));
    if(obj.id.substr(-2,1) === '_') y = 0;

    switch(position){
        case direction.left:
            if(x === 0) x++;
            return document.getElementById('kill_' + type + '_' + position +'_' + Number(y*10 + x-1));
            break;
        case direction.top:
            if(y === 0) y++;
            return document.getElementById('kill_' + type + '_' + position + '_' + Number((y-1)*10 + x));
            break;
        case direction.right:
            if(x === 9) x--;
            return document.getElementById('kill_' + type + '_' + position +'_' + Number(y*10 + x+1));
            break;
        case direction.bottom:
            if(y === 9) y--;
            return document.getElementById('kill_' + type + '_' + position +'_' + Number((y+1)*10 + x));
            break;
        default:
            return null;
            break;
    }
}

function kill_ship(obj){
    coordinates = obj.id;
    let x = Number(obj.id.substr(-1,1)), y = Number(obj.id.substr(-2,1));
    if(obj.id.substr(-2,1) === '_') y = 0;

    obj = position_ships(direction.left, y, x);
    if(obj !== null && Math.abs(x-Number(obj.id.substr(-1,1))) <= 1)obj.innerHTML = 'X';
    obj = position_ships(direction.left, y-1, x);
    if(obj !== null && Math.abs(x-Number(obj.id.substr(-1,1))) <= 1)obj.innerHTML = 'X';            

    obj = position_ships(direction.top, y, x);
    if(obj !== null && Math.abs(x-Number(obj.id.substr(-1,1))) <= 1)obj.innerHTML = 'X';
    obj = position_ships(direction.top, y, x+1);
    if(obj !== null && Math.abs(x-Number(obj.id.substr(-1,1))) <= 1)obj.innerHTML = 'X';

    obj = position_ships(direction.right, y, x);
    if(obj !== null && Math.abs(x-Number(obj.id.substr(-1,1))) <= 1)obj.innerHTML = 'X';
    obj = position_ships(direction.right, y+1, x);
    if(obj !== null && Math.abs(x-Number(obj.id.substr(-1,1))) <= 1)obj.innerHTML = 'X';

    obj = position_ships(direction.bottom, y, x);
    if(obj !== null && Math.abs(x-Number(obj.id.substr(-1,1))) <= 1)obj.innerHTML = 'X';
    obj = position_ships(direction.bottom, y, x-1);
    if(obj !== null && Math.abs(x-Number(obj.id.substr(-1,1))) <= 1)obj.innerHTML = 'X';
}

function getIndexShip(){
    return Math.floor(Math.random()*10);
}