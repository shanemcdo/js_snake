class Game{
    cell_size = new Point(20, 20);

    constructor(board_elem){
        this.board_elem = board_elem;
        this.fruit_elem = board_elem.querySelector('.fruit');
        this.pause_elem = board_elem.querySelector('#pause-menu');
        this.death_elem = board_elem.querySelector('#death-menu');
        this.update_window_size();
        document.body.onresize = ()=> this.update_window_size(); // arrow function is needed
        this.snake = new Snake(
            this.board_size_cells
                .scalar_mul(0.5)
                .floor(),
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
        this.fruit = Point.random_between(
            new Point(0, 0),
            this.board_size_cells,
        );
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
    }
}

class Snake{
    constructor(head, board_elem){
        this.head = head;
        this.tail = [];
        this.direction = Direction.UP;
        this.previous_direction = this.direction;
        this.length_to_add = 2;
        this.board_elem = board_elem;
        this.head_elem = board_elem.querySelector('.head');
        this.tail_elems = [];
        this.tail_piece_elem = board_elem.querySelector('#tail-piece').content.firstElementChild.cloneNode(true);
        this.alive = true;
    }

    set_direction(new_direction){
        if(get_opposite_direction(new_direction) != this.previous_direction)
            this.direction = new_direction;
    }

    draw(cell_size){
        this.head_elem.style.left = (this.head.x * cell_size.x).toString() + 'px';
        this.head_elem.style.top = (this.head.y * cell_size.y).toString() + 'px';
        for(let i = 0; i < this.tail.length; i++){
            this.tail_elems[i].style.left = (this.tail[i].x * cell_size.x).toString() + 'px';
            this.tail_elems[i].style.top = (this.tail[i].y * cell_size.y).toString() + 'px';
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

        //check if new head overlaps
        if(new_head.in_list(this.tail)
            || new_head.x < 0 || new_head.y < 0
            || new_head.x >= board_size.x
            || new_head.y >= board_size.y
        ){
            this.alive = false;
            return;
        }

        // update tail
        this.tail.unshift(this.head.clone());
        if(this.length_to_add < 1)
            this.tail.pop();
        else{
            this.length_to_add--;
            let el = this.tail_piece_elem.cloneNode(true);
            this.board_elem.appendChild(el);
            this.tail_elems.push(el);
        }

        this.head = new_head;
    }

    reset(board_size){
        this.tail = [];
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
}
