class Game{
    cell_size = new Point(20, 20);

    constructor(board_elem){
        this.board_elem = board_elem;
        this.fruit_elem = board_elem.querySelector('.fruit');
        this.pause_elem = board_elem.querySelector('#pause-menu');
        this.death_elem = board_elem.querySelector('#start-menu');
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
        this.loopable_walls = true;
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
        this.snake.update(this.board_size_cells, this.loopable_walls);
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
                this.snake.add_dir_to_buffer(Direction.UP);
                break;
            case 'a':
            case 'arrowleft':
                this.snake.add_dir_to_buffer(Direction.LEFT);
                break;
            case 's':
            case 'arrowdown':
                this.snake.add_dir_to_buffer(Direction.DOWN);
                break;
            case 'd':
            case 'arrowright':
                this.snake.add_dir_to_buffer(Direction.RIGHT);
                break;
            case 'p':
            case 'escape':
                this.toggle_pause();
                break;
        }
    }
    
    run(){
        this.running = true;
        let kbin = event=>this.kbin(event);
        document.addEventListener('keydown', kbin);
        let interval = setInterval(()=>{
            if(!this.snake.alive || !this.running){ // if the snake died
                this.running = false;
                this.finished = true;
                this.pause_elem.classList.add('hidden');
                this.death_elem.classList.remove('hidden');
                this.score_elem.innerHTML = this.score.toString();
                document.removeEventListener('keydown', kbin); // need to remove listener to not cause problems on next runs
                clearInterval(interval); // exit interval
            }
            if(this.paused){
                return;
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
        this.paused = false;
        this.score_elem.innerHTML = this.score.toString();
    }

    finish(){
        this.running = false;
    }
}
