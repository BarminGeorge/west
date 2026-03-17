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

class PseudoDuck extends Dog {
    constructor(name = "PsevdoDuck", power = 3){
        super(name, power);
    }
    quacks() {
        console.log('quack');
    }
    swims() {
        console.log('float: both;');
    }
}

class Brewer extends Duck {
    constructor(name = 'Пивовар', power = 2) {
        super(name, power);
    }

    doBeforeAttack(gameContext, continuation) {
        const { currentPlayer, oppositePlayer } = gameContext;
        const allCards = currentPlayer.table.concat(oppositePlayer.table);
        const ducks = allCards.filter(card => isDuck(card));

        if (ducks.length === 0) {
            continuation();
            return;
        }

        const taskQueue = new TaskQueue();

        ducks.forEach(card => {
            taskQueue.push(onDone => {
                card.maxPower += 1;
                card.currentPower += 2;
                card.updateView();
                card.view.signalHeal(onDone);
            });
        });

        taskQueue.continueWith(continuation);
    }
}


class Lad extends Dog {
    constructor(name = 'Браток', power = 2) {
        super(name, power);
    }

    static getInGameCount() {
        return this.inGameCount || 0;
    }

    static setInGameCount(value) {
        this.inGameCount = value;
    }

    static getBonus() {
        const count = this.getInGameCount();
        return (count * (count + 1)) / 2;
    }


    doAfterComingIntoPlay(gameContext, continuation) {
        Lad.setInGameCount(Lad.getInGameCount() + 1);
        super.doAfterComingIntoPlay(gameContext, continuation);
    }

    doBeforeRemoving(continuation) {
        Lad.setInGameCount(Lad.getInGameCount() - 1);
        super.doBeforeRemoving(continuation);
    }


    modifyDealedDamageToCreature(value, toCard, gameContext, continuation) {
        continuation(value + Lad.getBonus());
    }

    modifyTakenDamage(value, fromCard, gameContext, continuation) {
        continuation(value - Lad.getBonus());
    }


    getDescriptions() {
        const descriptions = super.getDescriptions();
        
        if (Lad.prototype.hasOwnProperty('modifyDealedDamageToCreature') || 
            Lad.prototype.hasOwnProperty('modifyTakenDamage')) {
            descriptions.push('Чем их больше, тем они сильнее');
        }
        
        return descriptions;
    }
}

class Trasher extends Dog {
    constructor(name = 'Громила', power = 5) {
        super(name, power);
    }

    modifyTakenDamage(value, fromCard, gameContext, continuation) {
        this.view.signalAbility(() => {
            continuation(value - 1);
        });
    }

    getDescriptions() {
        const descriptions = super.getDescriptions();
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
    new Brewer(),
    new Duck(),
    new Duck(),
];
const banditStartDeck = [
    new PseudoDuck(),
    new Dog(),
    new Dog(),
    new Duck(),
    new Duck(),
];

const game = new Game(seriffStartDeck, banditStartDeck);
SpeedRate.set(1);
game.play(false, (winner) => {
    alert('Победил ' + winner.name);
});