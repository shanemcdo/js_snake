// https://stackoverflow.com/questions/53192433/how-to-detect-swipe-in-javascript

let mouse_pos = [null, null];
let swipe_direction = null;

function start_touch(event){
    mouse_pos[0] = event.touches[0].clientX;
    mouse_pos[1] = event.touches[0].clientY;
}

function move_touch(event){
    if(mouse_pos.includes(null)) return;
    let diff = [
        mouse_pos[0] - event.touches[0].clientX,
        mouse_pos[1] - event.touches[0].clientY,
    ];
    if(Math.abs(diff[0]) > Math.abs(diff[1])){
        if(diff[0] < 0){ // right
            swipe_direction = Direction.RIGHT;
        }else{ // left
            swipe_direction = Direction.LEFT;
        }
    }else{
        if(diff[1] < 0){ // down
            swipe_direction = Direction.DOWN;
        }else{ // up
            swipe_direction = Direction.UP;
        }
    }
}

document.addEventListener("touchstart", start_touch, false);
document.addEventListener("touchmove", move_touch, false);
