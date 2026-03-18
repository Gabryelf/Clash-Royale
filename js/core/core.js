function helloCore() {
   console.log("core mechanics ready");
}
// Функция для рисования башни игрока (синяя)
window.drawPlayerTower = function(ctx, 200, 300) {
    // TODO: Синяя башня с зубцами
    
    // Основание
    ctx.fillStyle = '#3a6ea5';
    ctx.fillRect(x - 20, y - 40, 40, 60);
    
    // Зубцы наверху
    ctx.fillStyle = '#2a4f7a';
    ctx.fillRect(x - 20, y - 50, 10, 10);
    ctx.fillRect(x - 5, y - 55, 10, 12);
    ctx.fillRect(x + 10, y - 50, 10, 10);
    
    // Флаг
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.moveTo(x + 15, y - 60);
    ctx.lineTo(x + 30, y - 55);
    ctx.lineTo(x + 15, y - 50);
    ctx.fill();
}
helloCore();


