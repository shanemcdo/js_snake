const DIRS = [
    Direction.UP,
    Direction.DOWN,
    Direction.LEFT,
    Direction.RIGHT,
];

const DIR_POSNS = DIRS.map(dir => {
    switch(dir){
        case Direction.UP: return new Point(0, -1);
        case Direction.DOWN: return new Point(0, 1);
        case Direction.LEFT: return new Point(-1, 0);
        case Direction.RIGHT: return new Point(1, 0);
    }
})

class Bot {
    constructor(game){
        this.game = game;
    }

    move(){
        this.move_weighted()
        // this.chase_fruit()
        if(this.will_die()) {
            this.go_first_living_direction();
        }
    }

    move_weighted(){
        const biggest = DIR_POSNS.map(pos => {
            return { pos, dist: this.path_dist(pos) }
        }).reduce((x, y) => x.dist < y.dist ? x : y);
        console.log(biggest);
    }

    // A*
    path_dist(pos){
        const open = [{ pos, fscore: 0 }];
        const closed = [];
        while(open.length > 0){
            let smallest = {
                index: 0,
                value: open[0]
            };
            for(let i = 1; i < open.length; i++){
                if(open[i].pos.dist(this.game.fruit) < smallest.value.pos.dist(this.game.fruit)){
                    smallest = {
                        index: i,
                        value: open[i]
                    };
                }
            }
            open[smallest.index] = open[open.length - 1];
            open.pop();
            closed.push(smallest.value.pos);
            if(open.length > 1000){
                console.log("Too long!");
                break;
            }
            if(smallest.value.pos.equals(this.game.fruit))
                return smallest.value.fscore;
            DIR_POSNS.map(p => new Point(
                smallest.value.pos.x + p.x,
                smallest.value.pos.y + p.y,
            )).map(p => {
                let x = p.x % this.game.board_size_cells.x;
                if(x < 0) x += this.game.board_size_cells.x;
                let y = p.y % this.game.board_size_cells.y;
                if(y < 0) y += this.game.board_size_cells.y;
                // console.log({x, y});
                return new Point(x, y);
            }).forEach(p => {
                // check if vistited
                if(p.in_list(closed) || p.in_list(open))
                    return;
                open.push({
                    pos: p,
                    fscore: smallest.value.fscore + 1,
                });
            });
        }
        return Infinity;
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
