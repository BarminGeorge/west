import Card from './Card.js';
import Game from './Game.js';
import TaskQueue from './TaskQueue.js';
import SpeedRate from './SpeedRate.js';

class Duck extends Card {
    constructor(name = 'Мирная Утка', power = 2) {
        super(name, power);
    }
    quacks() {
        console.log('quack');
    }
    swims() {
        console.log('float: both;');
    }
}

class Dog extends Card {
    constructor(name = 'Пес-Бандит', power = 3) {
        super(name, power);
    }
}

// Функции проверки (единственная версия)
function isDuck(card) {
    // Утка, если есть методы quacks/swims или это экземпляр Duck
    return card && (card.quacks && card.swims || card instanceof Duck);
}

function isDog(card) {
    return card instanceof Dog;
}

// Описание существа
function getCreatureDescription(card) {
    if (isDuck(card) && isDog(card)) {
        return 'Утка-Собака';
    }
    if (isDuck(card)) {
        return 'Утка';
    }
    if (isDog(card)) {
        return 'Собака';
    }
    return 'Существо';
}

// Колоды
const seriffStartDeck = [
    new Duck(),
    new Duck(),
];

const banditStartDeck = [
    new Dog(),
    new Dog(),
];

// Создание и запуск игры
const game = new Game(seriffStartDeck, banditStartDeck);
SpeedRate.set(1);
game.play(false, (winner) => {
    alert('Победил ' + winner.name);
});