class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    equals(p){
        return this.x === p.x && this.y === p.y;
    }

    clone(){
        return new Point(this.x, this.y);
    }

    scalar_mul(scalar){
        return new Point(
            this.x * scalar,
            this.y * scalar,
        );
    }

    floor(){
        return new Point(
            Math.floor(this.x),
            Math.floor(this.y),
        );
    }

    in_list(list){
        for(let item of list)
            if(this.equals(item))
                return true;
        return false;
    }

    dist(pos){
        return Math.sqrt(Math.pow(pos.x - this.x, 2) + Math.pow(pos.y - this.y, 2));
    }

    static random_between(p0, p1){
        return new Point(
            Math.floor(Math.random() * (p1.x - p0.x) + p0.x),
            Math.floor(Math.random() * (p1.y - p0.y) + p0.y),
        );
    }

    static from_dir(dir) {
        switch(dir){
            case Direction.UP: return new Point(0, -1);
            case Direction.DOWN: return new Point(0, 1);
            case Direction.LEFT: return new Point(-1, 0);
            case Direction.RIGHT: return new Point(1, 0);
        }
    }
}
