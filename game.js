var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var aster = [];
var fire = [];
var expl = [];
var bexpl = [];
var bonus = [];
var timer = 0;
var ship = {
    x: 425,
    y: 250,
    animx: 0,
    animy: 0
};

// Переменная для подсчета жизней и ее свойства.
var hp=2;
// Переменная для подсчета астероидов, которые нанесли ущерб планете.
var harm = 0;
// Переменная для подсчета разрушенных астероидов.
var vicpoints = 0;

// Загрузка ресурсов.
var asterimg = new Image();
asterimg.src = 'astero.png';

var shipimg = new Image();
shipimg.src = 'ship.png';

var explimg = new Image();
explimg.src = 'expl.png';

var bexplimg = new Image();
bexplimg.src = 'bexpl.png';

var shieldimg = new Image();
shieldimg.src = 'shield.png';

var fonimg = new Image();
fonimg.src = 'fon.png';

var fireimg = new Image();
fireimg.src = 'fire.png';

var bonusimg = new Image();
bonusimg.src = 'bonus.png';

// Считываем координаты курсора мыши и присваиваем их кораблю.
canvas.addEventListener('mousemove', function(event) {
    ship.x = event.offsetX - 25;
    ship.y = event.offsetY - 13;
});

// Запускаем функцию game после того, как подгрузилась картинка.
fonimg.onload = function() {
    game();
}

// Основной игровой цикл.
function game() {
    update();
    render();
    // Браузерная примочка, чтобы он вызывал game с необходимой частотой.
    requestAnimFrame(game); 
}

//функция обновления состояния игры.
function update() {
    timer++;

    // Спавн бонусов. Для них те же процедуры, что и для астероидов.
    if (timer % 250 == 0) {
        bonus.push({
            y: Math.random() * 500,
            x: 860,
            dx: Math.random() * 2 + 7,
            dy: Math.random() * 2 - 1,
            del: 0
        });
    }
    // Движение бонусов.
    for (f in bonus) {
        bonus[f].x = bonus[f].x - bonus[f].dx;
        bonus[f].y = bonus[f].y + bonus[f].dy;
        // когда бонус выходит за границы, удаляем его
        if (bonus[f].y >= 500 || bonus[f].y < 0) bonus[f].dy = -bonus[f].dy;
        if (bonus[f].x <= -50) {
            bonus[f].del = 1;
        }
        // Перебираем бонусы на столкновение с пулями.
        for (j in fire) {
            if (Math.abs(bonus[f].x + 20 - fire[j].x - 15) < 40 && Math.abs(bonus[f].y - fire[j].y) < 20) {
                // Спавн взрыва бонуса.
                bexpl.push({
                    x: bonus[f].x - 20,
                    y: bonus[f].y - 20,
                    animx: 0,
                    animy: 0
                });
                // Помечаем бонус на удаление, затем удаляем пулю.
                bonus[f].del = 1;
                fire.splice(j, 1);
                break;
            }
        }
        // Перебираем бонусы на столкновение с кораблем.
        if (Math.abs(bonus[f].x + 20 - ship.x - 15) < 40 && Math.abs(bonus[f].y - ship.y) < 20) {
            // Удаляем бонус и увеличиваем жизни.
            bonus.splice(f, 1);
            hp++;
            // Ограничиваем значение hp до 2.
            if (hp >2) {
                hp=2;
            }
            break;
        }
        // Удаляем помеченные бонусы.
        if (bonus[f].del == 1) {
            bonus.splice(f, 1);
        }
    }


    // Спавн астероидов. Работает как периодический таймер-триггер, это математика и оператор %, работа с остатком.
    if (timer % 15 == 0) {
        aster.push({
            y: Math.random() * 500,
            x: 860,
            dx: Math.random() * 2 + 5,
            dy: Math.random() * 2 - 1,
            del: 0
        });
    }
    // Движение астероидов.
    for (i in aster) {
        aster[i].x = aster[i].x - aster[i].dx;
        aster[i].y = aster[i].y + aster[i].dy;
        // когда астероид выходит за границы, удаляем его
        if (aster[i].y >= 500 || aster[i].y < 0) aster[i].dy = -aster[i].dy;
        if (aster[i].x <= -50) {
            harm++;
            aster.splice(i, 1);
        }    
        // Перебираем астероиды на столкновение с пулями.
        for (j in fire) {
            if (Math.abs(aster[i].x + 30 - fire[j].x - 15) < 60 && Math.abs(aster[i].y - fire[j].y) < 30) {
                // Спавн взрыва.
                expl.push({
                    x: aster[i].x - 30,
                    y: aster[i].y - 30,
                    animx: 0,
                    animy: 0
                });
                // Помечаем астероид на удаление, затем удаляем пулю.
                aster[i].del = 1;
                fire.splice(j, 1);
                break;
            }
        }
        // Перебираем астероиды на столкновение с кораблем.
        if (Math.abs(aster[i].x + 30 - ship.x - 15) < 60 && Math.abs(aster[i].y - ship.y) < 30) {
            // Удаляем астероид и уменьшаем жизни.
            aster[i].del = 1;
            if (aster[i].del == 1) {
                aster.splice(i, 1);
                hp--;
                break;
            }
        }
        // Удаляем астероиды.
        if (aster[i].del == 1) {
            aster.splice(i, 1);
            vicpoints ++;
        }
    }
    // Спавн пули.
    if (timer % 10 == 0) {
        fire.push({
            x: ship.x,
            y: ship.y + 10,
            dx: 5.2,
            dy: 0
        });
    }
    // Движение пули.
    for (i in fire) {
        fire[i].x = fire[i].x + fire[i].dx;
        fire[i].y = fire[i].y + fire[i].dy;
        // Удаляем пулю, которая вышла за границы.
        if (fire[i].x > 950) fire.splice(i, 1);
    }
    //Анимация взрывов.
    for (i in expl) {
        expl[i].animx = expl[i].animx + 0.4;
        if (expl[i].animx > 3) {
            expl[i].animy++;
            expl[i].animx = 0
        }
        if (expl[i].animy > 3)
            expl.splice(i, 1);
    }
        //Анимация взрывов.
        for (i in bexpl) {
        bexpl[i].animx = bexpl[i].animx + 0.4;
        if (bexpl[i].animx > 3) {
            bexpl[i].animy++;
            bexpl[i].animx = 0
        }
        if (bexpl[i].animy > 3)
            bexpl.splice(i, 1);
    }
    // Анимация щита.
    ship.animx = ship.animx + 1;
    if (ship.animx > 4) {
        ship.animy++;
        ship.animx = 0
    }
    if (ship.animy > 3) {
        ship.animx = 0;
        ship.animy = 0;
    }

    // Подсчет нанесенного ущерба планете.
    if (harm>15) {
        alert ('Gameover! Asteroids made too much harm to your planet!. You gain '+vicpoints+' points for destroying asteroids.');
    }
    // Проверяем корабль на жизнеспособность.
    if (hp <= 0) {
       alert ('Gameover! You are exploded! You gain '+vicpoints+' points for destroying asteroids.');
    }
}

// Завершающий элемент простого игрового цикла. Отрисовка элементов на холсте. Последовательность важна, слой за слоем.
function render() {
    // Рисуем фон.
    context.drawImage(fonimg, 0, 0, 850, 500);
    // Рисуем пули.
    for (i in fire) context.drawImage(fireimg, fire[i].x, fire[i].y, 40, 30);
    // Рисуем корабль.
    context.drawImage(shipimg, ship.x, ship.y, 63, 45);
    // Рисуем щит.
    if (hp < 2) {
        // Ничего не рисуем.
    } else {
        context.drawImage(shieldimg, 
        192 * Math.floor(ship.animx), 
        192 * Math.floor(ship.animy), 
        192, 
        192, 
        ship.x - 25, 
        ship.y - 25, 
        120, 
        120);
    }

    // Рисуем бонус.
    for (f in bonus) context.drawImage(bonusimg, bonus[f].x, bonus[f].y, 40, 40);
    // Рисуем астероид.
    for (i in aster) context.drawImage(asterimg, aster[i].x, aster[i].y, 60, 60);
    // Анимации взрыва отрисовавыем последними.
    for (i in expl) {
        context.drawImage(explimg, 
        128 * Math.floor(expl[i].animx), 
        128 * Math.floor(expl[i].animy), 
        128, 
        128, 
        expl[i].x, 
        expl[i].y, 
        100, 
        100);
    }
    for (i in bexpl) {
        context.drawImage(bexplimg, 
        128 * Math.floor(bexpl[i].animx), 
        128 * Math.floor(bexpl[i].animy), 
        128, 
        128, 
        bexpl[i].x, 
        bexpl[i].y, 
        80, 
        80);
    }
}

// Браузерная примочка, чтобы игра вызывалась с необходимой частотой и запускалась на всех браузерах.
var requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 20);
        };
})();