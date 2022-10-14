class Bot {
    constructor(game){
        this.game = game;
    }

    move(){
        this.chase_fruit()
        if(this.will_die()) {
            this.go_first_living_direction();
        }
    }

    go_first_living_direction(){
        const dirs = shuffle([
            Direction.UP,
            Direction.DOWN,
            Direction.LEFT,
            Direction.RIGHT,
        ]);
        for(let dir of dirs){
            console.log(dir);
            this.game.snake.direction = dir;
            if(!this.will_die()) return;
        }
    }

    chase_fruit(){
        let diff = new Point(
            this.game.fruit.x - this.game.snake.head.x,
            this.game.fruit.y - this.game.snake.head.y,
        );
        if(Math.abs(diff.x) > Math.abs(diff.y)){
            this.move_x(diff.x);
        } else {
            this.move_y(diff.y);
        }
    }

    move_x(diff_x){
        if(diff_x < 0 && this.game.snake.direction != Direction.RIGHT){
            this.game.snake.direction = Direction.LEFT;
        } else if(diff_x >= 0 && this.game.snake.direction != Direction.LEFT){
            this.game.snake.direction = Direction.RIGHT;
        }
    }

    move_y(diff_y){
        if(diff_y < 0 && this.game.snake.direction != Direction.DOWN){
            this.game.snake.direction = Direction.UP;
        } else if(diff_y >= 0 && this.game.snake.direction != Direction.UP){
            this.game.snake.direction = Direction.DOWN;
        }
    }

    // check if the snake will die if it moves the current direction
    will_die(){
        let snake = this.game.snake.clone();
        snake.update(this.game.board_size_cells, this.game.loopable_walls);
        return !snake.alive;
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
