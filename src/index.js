import Card from './Card.js';
import Game from './Game.js';
import TaskQueue from './TaskQueue.js';
import SpeedRate from './SpeedRate.js';


class Creature extends Card {
    getDescriptions() {
        return [getCreatureDescription(this), ...super.getDescriptions()];
    }
}


class Gatling extends Creature {
    constructor(name = 'Гатлинг', power = 6){
        super(name, power);
    }

    attack(gameContext, continuation) {
        const taskQueue = new TaskQueue();
        const oppositeTable = gameContext.oppositePlayer.table;

        taskQueue.push(onDone => this.view.showAttack(onDone));

        for (let position = 0; position < oppositeTable.length; position++) {
            const card = oppositeTable[position];
            if (card) {
                taskQueue.push(onDone => {
                    this.dealDamageToCreature(this.currentPower, card, gameContext, onDone);
                });
            }
        }

        taskQueue.continueWith(continuation);
    }

}
class Duck extends Creature {
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

class Dog extends Creature {
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

const seriffStartDeck = [
    new Duck(),
    new Duck(),
    new Duck(),
    new Gatling(),
];
const banditStartDeck = [
    new Dog(),
    new Dog(),
    new Dog(),
    new Dog(),
];

// Создание и запуск игры
const game = new Game(seriffStartDeck, banditStartDeck);
SpeedRate.set(1);
game.play(false, (winner) => {
    alert('Победил ' + winner.name);
});