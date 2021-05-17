const board_element = document.querySelector('.board');
const start_menu = board_element.querySelector('#start-menu');
const game = new Game(board_element);

function start(){
    start_menu.classList.add('hidden');
    game.death_elem.classList.add('hidden');
    if(game.finished)
        game.reset();
    game.run();
}
