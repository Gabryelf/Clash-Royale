//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// AI - противник team AI: @Eridan6935 (Эридан), @prosto73 (Рома), @sofya-svishch13 (София), @vikakilka91-dev (Вика)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function runAITests() {
    console.log('🧪 Running AI Module Tests...');
    
    // Тест 1: AI существует
    if (typeof AI !== 'undefined' && AI.init) {
        console.log('  ✅ AI module exists');
    } else {
        console.log('  ❌ AI module not found');
    }
    
    // Тест 2: Balance существует
    if (typeof Balance !== 'undefined' && Balance.units) {
        console.log('  ✅ Balance module exists');
        console.log(`  📊 Unit stats: Knight ${Balance.units.knight.hp} HP, ${Balance.units.knight.damage} DMG`);
    } else {
        console.log('  ❌ Balance module not found');
    }
    
    // Тест 3: AI может спавнить
    if (AI && AI.tryDeployUnit) {
        const beforeUnits = GameState.units.length;
        const beforeElixir = GameState.elixir;
        
        // Временно увеличиваем эликсир для теста
        GameState.elixir = 10;
        AI.tryDeployUnit(Date.now() / 1000);
        
        if (GameState.units.length > beforeUnits && GameState.elixir < beforeElixir) {
            console.log('  ✅ AI can deploy units');
        } else {
            console.log('  ⚠️ AI deployment test - check manually');
        }
    }
    
    // Тест 4: Проверка стоимости юнитов
    const costs = { knight: 3, archer: 3, mage: 4 };
    let costCheck = true;
    for (let type in costs) {
        if (AI.getUnitCost(type) !== costs[type]) {
            costCheck = false;
        }
    }
    console.log(`  ${costCheck ? '✅' : '❌'} Unit costs correct`);
    
    console.log('🏁 AI Tests Completed');
}

// Запуск тестов
setTimeout(() => {
    if (GameState && AI) {
        runAITests();
    }
}, 500);
