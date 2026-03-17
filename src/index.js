import Card from './Card.js';
import Game from './Game.js';
import TaskQueue from './TaskQueue.js';
import SpeedRate from './SpeedRate.js';


class Creature extends Card {
    getDescriptions() {
        return [getCreatureDescription(this), ...super.getDescriptions()];
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

class Trasher extends Dog {
    constructor(name = 'Громила', power = 5) {
        super(name, power);
    }

    modifyTakenDamage(value, fromCard, gameContext, continuation) {
        // Мигаем белым цветом (способность)
        this.view.signalAbility(() => {
            // Уменьшаем урон на 1 и передаем дальше
            continuation(value - 1);
        });
    }

    getDescriptions() {
        // Получаем описания от родителя (цепочку прототипов)
        const descriptions = super.getDescriptions();
        // Добавляем описание способности Громилы
        descriptions.push('Получает на 1 меньше урона');
        return descriptions;
    }
}

function isDuck(card) {
    return card && (card.quacks && card.swims || card instanceof Duck);
}

function isDog(card) {
    return card instanceof Dog;
}

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
    new Duck(),
];

const banditStartDeck = [
    new Trasher(),
];

const game = new Game(seriffStartDeck, banditStartDeck);
SpeedRate.set(1);
game.play(false, (winner) => {
    alert('Победил ' + winner.name);
});