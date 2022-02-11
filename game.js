class Game{
    cell_size = new Point(20, 20);

    constructor(board_elem){
        this.board_elem = board_elem;
        this.fruit_elem = board_elem.querySelector('.fruit');
        this.pause_elem = board_elem.querySelector('#pause-menu');
        this.death_elem = board_elem.querySelector('#death-menu');
        this.score_elem = board_elem.querySelector('.score');
        document.body.onresize = ()=> this.update_window_size(); // arrow function is needed
        this.update_window_size();
        this.snake = new Snake(
            this.board_size_cells
                .scalar_mul(0.5)
                .floor(), // center
            board_elem,
        );
        this.new_fruit();
        this.finished = false;
        this.paused = false;
        this.score = 0;
    }

    toggle_pause(){
        this.paused = !this.paused;
        this.pause_elem.classList.toggle('hidden');
    }

    update_window_size(){
        this.window_size = this.get_window_size();
        this.board_size_pixels = this.get_board_size_pixels();
        this.board_size_cells = this.get_board_size_cells();
        this.board_elem.style.width = this.board_size_pixels.x.toString() + "px";
        this.board_elem.style.height = this.board_size_pixels.y.toString() + "px";
        this.new_fruit();
    }

    get_window_size(){
        return new Point(
            window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
            window.innerHeight || document.documentElement.clientHeight || body.clientHeight,
        );
    }

    get_board_size_pixels(){
        return new Point(
            this.window_size.x - this.window_size.x % this.cell_size.x,
            this.window_size.y - this.window_size.y % this.cell_size.y,
        );
    }

    get_board_size_cells(){
        return new Point(
            Math.floor(this.board_size_pixels.x / this.cell_size.x),
            Math.floor(this.board_size_pixels.y / this.cell_size.y),
        );
    }

    new_fruit(){
        let possibilities = [];
        for(let i = 0; i < this.board_size_cells.y; i++){
            for(let j = 0; j < this.board_size_cells.x; j++){
                let new_pos = new Point(j, i);
                if(!this.snake?.collides_with(new_pos))
                    possibilities.push(new_pos);
            }
        }
        this.fruit = possibilities[Math.floor(Math.random() * possibilities.length)];
    }

    draw_fruit(){
        this.fruit_elem.style.left = (this.fruit.x * this.cell_size.x).toString() + 'px';
        this.fruit_elem.style.top = (this.fruit.y * this.cell_size.y).toString() + 'px';
    }

    draw(){
        this.snake.draw(this.cell_size);
        this.draw_fruit();
    }

    update(){
        this.snake.update(this.board_size_cells);
        if(this.snake.head.equals(this.fruit)){
            this.snake.length_to_add += 2;
            this.score += 1;
            this.score_elem.innerHTML = this.score.toString();
            this.new_fruit();
        }
    }
    
    kbin(event){
        switch(event.key.toLowerCase()){
            case 'w':
            case 'arrowup':
                this.snake.set_direction(Direction.UP);
                break;
            case 'a':
            case 'arrowleft':
                this.snake.set_direction(Direction.LEFT);
                break;
            case 's':
            case 'arrowdown':
                this.snake.set_direction(Direction.DOWN);
                break;
            case 'd':
            case 'arrowright':
                this.snake.set_direction(Direction.RIGHT);
                break;
            case 'p':
            case 'escape':
                this.toggle_pause();
                break;
        }
    }
    
    run(){
        this.running = true;
        document.addEventListener('keydown', event=>this.kbin(event));
        let interval = setInterval(()=>{
            if(this.paused)
                return;
            if(!this.snake.alive){ // if the snake died
                this.running = false;
                this.finished = true;
                this.death_elem.classList.toggle('hidden');
                this.score_elem.innerHTML = this.score.toString();
                clearInterval(interval); // exit interval
            }
            this.draw();
            this.update();
        }, 100);
    }
    
    reset(){
        this.new_fruit();
        this.snake.reset(this.board_size_cells)
        this.draw();
        this.score = 0;
        this.score_elem.innerHTML = this.score.toString();
    }
}

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
        this.loopable_walls = true;
    }

    set_direction(new_direction){
        if(get_opposite_direction(new_direction) != this.previous_direction)
            this.direction = new_direction;
    }

    draw(cell_size){
        this.head_elem.style.left = (this.head.x * cell_size.x).toString() + 'px';
        this.head_elem.style.top = (this.head.y * cell_size.y).toString() + 'px';
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

    update(board_size){
        let new_head = this.head.clone();
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
        if(out_of_bounds && this.loopable_walls){
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
