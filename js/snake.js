class Snake{
    constructor(head, board_elem){
        this.head = head;
        this.tail = [];
        this.tail_dirs = [];
        this.direction = Direction.UP;
        this.previous_direction = this.direction;
        this.length_to_add = 2;
        this.board_elem = board_elem;
        this.head_elem = board_elem.querySelector('.head');
        this.tail_elems = [];
        this.tail_piece_elem = board_elem.querySelector('#tail-piece').content.firstElementChild.cloneNode(true);
        this.alive = true;
        this.direction_buffer = [];
    }

    add_dir_to_buffer(new_direction){
        this.direction_buffer.push(new_direction);
    }

    draw(cell_size){
        this.head_elem.style.left = (this.head.x * cell_size.x).toString() + 'px';
        this.head_elem.style.top = (this.head.y * cell_size.y).toString() + 'px';
        this.head_elem.classList.remove('looking-up');
        this.head_elem.classList.remove('looking-down');
        this.head_elem.classList.remove('looking-left');
        this.head_elem.classList.remove('looking-right');
        switch(this.direction){
            case Direction.UP:
                this.head_elem.classList.add('looking-up');
                break;
            case Direction.DOWN:
                this.head_elem.classList.add('looking-down');
                break;
            case Direction.LEFT:
                this.head_elem.classList.add('looking-left');
                break;
            case Direction.RIGHT:
                this.head_elem.classList.add('looking-right');
                break;
        };
        let prev_dir = null
        for(let i = this.tail.length - 1; i >= 0; i--){
            let el = this.tail_elems[i];
            let dir = this.tail_dirs[i];
            el.style.left = (this.tail[i].x * cell_size.x).toString() + 'px';
            el.style.top = (this.tail[i].y * cell_size.y).toString() + 'px';
            el.classList.remove('turn');
            el.classList.remove('straight-vert');
            el.classList.remove('straight-horiz');
            el.classList.remove('connect-upa');
            el.classList.remove('connect-downa');
            el.classList.remove('connect-lefta');
            el.classList.remove('connect-righta');
            el.classList.remove('connect-upb');
            el.classList.remove('connect-downb');
            el.classList.remove('connect-leftb');
            el.classList.remove('connect-rightb');
            if(prev_dir !== null && prev_dir !== dir){
                el.classList.add('turn');
                if(
                    (prev_dir === Direction.RIGHT && dir === Direction.DOWN) ||
                    (prev_dir === Direction.UP && dir === Direction.LEFT)
                ){
                    el.classList.add('connect-lefta');
                    el.classList.add('connect-downb');
                }else if(
                    (prev_dir === Direction.RIGHT && dir === Direction.UP) ||
                    (prev_dir === Direction.DOWN && dir === Direction.LEFT)
                ){
                    el.classList.add('connect-lefta');
                    el.classList.add('connect-upb');
                }else if(
                    (prev_dir === Direction.LEFT && dir === Direction.DOWN) ||
                    (prev_dir === Direction.UP && dir === Direction.RIGHT)
                ){
                    el.classList.add('connect-righta');
                    el.classList.add('connect-downb');
                }else if(
                    (prev_dir === Direction.LEFT && dir === Direction.UP) ||
                    (prev_dir === Direction.DOWN && dir === Direction.RIGHT)
                ){
                    el.classList.add('connect-righta');
                    el.classList.add('connect-upb');
                }
            } else {
                switch(dir){
                    case Direction.LEFT:
                    case Direction.RIGHT:
                        el.classList.add('straight-horiz');
                        break;
                    case Direction.UP:
                    case Direction.DOWN:
                        el.classList.add('straight-vert');
                        break;
                }
            }
            prev_dir = dir;
        }
    }

    update(board_size, loopable_walls = false){
        let new_head = this.head.clone();
        if(this.direction_buffer.length){
            let new_dir = this.direction_buffer.shift();
            if(get_opposite_direction(new_dir) !== this.direction){
                this.direction = new_dir;
            }
        }
        this.previous_direction = this.direction;
        // move
        switch(this.direction){
            case Direction.UP:
                new_head.y -= 1
                break;
            case Direction.DOWN:
                new_head.y += 1
                break;
            case Direction.LEFT:
                new_head.x -= 1
                break;
            case Direction.RIGHT:
                new_head.x += 1
                break;
        }

        //check if out of bounds
        let out_of_bounds = new_head.x < 0
            || new_head.y < 0
            || new_head.x >= board_size.x
            || new_head.y >= board_size.y;
        if(out_of_bounds && loopable_walls){
            if(new_head.y < 0){
                new_head.y = board_size.y - 1;
            }else if(new_head.y >= board_size.y){
                new_head.y = 0;
            }
            if(new_head.x < 0){
                new_head.x = board_size.x - 1;
            }else if(new_head.x >= board_size.x){
                new_head.x = 0;
            }
            out_of_bounds = false;
        }

        //check if new head overlaps
        if(new_head.in_list(this.tail) || out_of_bounds){
            this.alive = false;
            return;
        }

        // update tail
        this.tail.unshift(this.head.clone());
        this.tail_dirs.unshift(this.direction);
        if(this.length_to_add < 1){
            this.tail.pop();
            this.tail_dirs.pop();
        }else{
            this.length_to_add--;
            let el = this.tail_piece_elem.cloneNode(true);
            this.board_elem.appendChild(el);
            this.tail_elems.push(el);
        }

        this.head = new_head;
    }

    reset(board_size){
        this.tail = [];
        this.tail_dirs = [];
        for(let child of this.tail_elems)
            this.board_elem.removeChild(child);
        this.tail_elems = [];
        this.head = board_size
            .scalar_mul(0.5)
            .floor();
        this.length_to_add = 2;
        this.alive = true;
        this.direction = Direction.UP
    }

    collides_with(pos){
        if(this.head.equals(pos))
            return true;
        for(let cell of this.tail)
            if(cell.equals(pos))
                return true;
        return false;
    }
}
