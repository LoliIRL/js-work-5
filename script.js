// =====================================================================
//      ЛАБОРАТОРНАЯ РАБОТА 5: PROMISE, ASYNC/AWAIT
//      ПОЛНОЕ РЕШЕНИЕ ВСЕХ ЗАДАНИЙ
// =====================================================================

// Ждем полной загрузки страницы
window.addEventListener('load', function() {
    console.log("%c✅ Лабораторная работа 5 загружена", "color: green; font-size: 16px; font-weight: bold;");
    console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "color: blue;");
    
    // =================================================================
    // ЗАДАНИЕ 1: Анализ кода с Promise
    // =================================================================
    
    function task1() {
        let output = "▶ АНАЛИЗ КОДА С PROMISE\n";
        output += "═══════════════════════\n\n";
        output += "Код:\n";
        output += "let promise = new Promise(function(resolve, reject) {\n";
        output += "    resolve(1);\n";
        output += "    setTimeout(() => resolve(2), 1000);\n";
        output += "});\n";
        output += "promise.then(console.log);\n\n";
        
        output += "РЕЗУЛЬТАТ ВЫПОЛНЕНИЯ:\n";
        output += "────────────────────\n";
        output += "Выведется: 1\n\n";
        
        output += "ОБЪЯСНЕНИЕ:\n";
        output += "───────────\n";
        output += "1. Промис может быть разрешён (resolve) только один раз.\n";
        output += "2. Первый вызов resolve(1) сразу же устанавливает значение промиса.\n";
        output += "3. Все последующие вызовы resolve или reject игнорируются.\n";
        output += "4. Поэтому setTimeout с resolve(2) никогда не выполнится.\n";
        output += "5. В консоль выведется только 1.\n";
        
        return output;
    }
    
    document.getElementById('result1').innerHTML = task1();
    
    // =================================================================
    // ЗАДАНИЕ 2: Промисификация функций из ЛР4
    // =================================================================
    
    // Исходные асинхронные функции (имитация)
    function readConfig(name, callback) {
        setTimeout(() => {
            let msg = '(1) config from ' + name + ' loaded';
            console.log(msg);
            callback(null, msg);
        }, Math.floor(Math.random() * 1000));
    }
    
    function doQuery(statement, callback) {
        setTimeout(() => {
            let msg = '(2) SQL query executed: ' + statement;
            console.log(msg);
            callback(null, msg);
        }, Math.floor(Math.random() * 1000));
    }
    
    function httpGet(url, callback) {
        setTimeout(() => {
            let msg = '(3) Page retrieved: ' + url;
            console.log(msg);
            callback(null, msg);
        }, Math.floor(Math.random() * 1000));
    }
    
    function readFile(path, callback) {
        setTimeout(() => {
            let msg = '(4) Readme file from ' + path + ' loaded';
            console.log(msg);
            callback(null, msg);
        }, Math.floor(Math.random() * 1000));
    }
    
    // Промисификация
    function promisify(fn) {
        return function(...args) {
            return new Promise((resolve, reject) => {
                fn(...args, (err, result) => {
                    if(err) reject(err);
                    else resolve(result);
                });
            });
        };
    }
    
    // Создаем промис-версии функций
    const readConfigPromise = promisify(readConfig);
    const doQueryPromise = promisify(doQuery);
    const httpGetPromise = promisify(httpGet);
    const readFilePromise = promisify(readFile);
    
    function task2() {
        let output = "▶ ПРОМИСИФИКАЦИЯ ФУНКЦИЙ\n";
        output += "═════════════════════════\n\n";
        
        output += "Созданы промис-версии функций:\n";
        output += "• readConfigPromise\n";
        output += "• doQueryPromise\n";
        output += "• httpGetPromise\n";
        output += "• readFilePromise\n\n";
        
        output += "ВЫПОЛНЕНИЕ ПОСЛЕДОВАТЕЛЬНОСТИ ЧЕРЕЗ ПРОМИСЫ:\n";
        output += "────────────────────────────────────────────\n\n";
        
        // Выполняем последовательно через промисы
        return readConfigPromise('myConfig')
            .then(result => {
                output += result + '\n';
                return doQueryPromise('select * from cities');
            })
            .then(result => {
                output += result + '\n';
                return httpGetPromise('http://google.com');
            })
            .then(result => {
                output += result + '\n';
                return readFilePromise('README.md');
            })
            .then(result => {
                output += result + '\n';
                output += '✓ Все функции выполнены последовательно!\n';
                document.getElementById('result2').innerHTML = output;
                return result;
            })
            .catch(error => {
                output += '❌ Ошибка: ' + error + '\n';
                document.getElementById('result2').innerHTML = output;
            });
    }
    
    task2();
    
    // =================================================================
    // ЗАДАНИЕ 3: Вычисление F(x) с промисами
    // =================================================================
    
    // Асинхронные функции f_i
    function createAsyncFunction(i) {
        return function(x) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    let result;
                    if(i === 1) result = x * x;           // x²
                    else if(i === 2) result = 2 * x;       // 2x
                    else if(i === 3) result = -2;          // -2
                    else if(i === 4) result = x + 5;       // x + 5
                    else result = 3 * x - 1;               // 3x - 1
                    
                    console.log(`f${i}(${x}) = ${result}`);
                    resolve(result);
                }, Math.random() * 500);
            });
        };
    }
    
    // Вычисление F(x) через промисы
    async function calculateFPromise(x, n) {
        let result = 0;
        let output = `Вычисление F(${x}) для n = ${n}\n`;
        output += '══════════════════════════════\n\n';
        
        for(let i = 1; i <= n; i++) {
            let f = createAsyncFunction(i);
            output += `Шаг ${i}: вычисляем f${i}(${x})...\n`;
            let value = await f(x);
            result += value;
            output += `   f${i}(${x}) = ${value}, промежуточная сумма = ${result}\n`;
        }
        
        output += `\n✅ Финальный результат F(${x}) = ${result}\n`;
        return output;
    }
    
    function task3() {
        let x = 3;
        
        // Для n = 3
        calculateFPromise(x, 3).then(output => {
            document.getElementById('result3_n3').innerHTML = output;
        });
        
        // Для n = 5
        calculateFPromise(x, 5).then(output => {
            document.getElementById('result3_n5').innerHTML = output;
        });
    }
    
    task3();
    
    // =================================================================
    // ЗАДАНИЕ 4: Отложенное суммирование
    // =================================================================
    
    function delayedSum(initial, step) {
        return new Promise((resolve, reject) => {
            // Проверка типов
            if(typeof initial !== 'number' || typeof step !== 'number' || 
               isNaN(initial) || isNaN(step)) {
                reject(new Error('Оба аргумента должны быть числами'));
                return;
            }
            
            let current = initial;
            let count = 0;
            let output = '';
            
            output += `Начальное значение: ${initial}, шаг: ${step}\n`;
            output += '══════════════════════════════════\n\n';
            
            let interval = setInterval(() => {
                count++;
                current += step;
                output += `Итерация ${count}: сумма = ${current}\n`;
                console.log(`Итерация ${count}: сумма = ${current}`);
                
                if(count >= 5) {
                    clearInterval(interval);
                    output += `\n✅ Завершено после 5 итераций. Финальная сумма: ${current}\n`;
                    resolve({ result: current, log: output });
                }
            }, 2000);
        });
    }
    
    function task4() {
        // Успешный случай
        delayedSum(10, 5)
            .then(({log}) => {
                document.getElementById('result4_success').innerHTML = 
                    "▶ УСПЕШНОЕ ВЫПОЛНЕНИЕ\n" + log;
            })
            .catch(error => {
                document.getElementById('result4_success').innerHTML = 
                    "▶ УСПЕШНОЕ ВЫПОЛНЕНИЕ\n❌ Ошибка: " + error.message;
            });
        
        // Случай с ошибкой
        delayedSum(10, 'not a number')
            .then(({log}) => {
                document.getElementById('result4_error').innerHTML = 
                    "▶ ВЫПОЛНЕНИЕ С ОШИБКОЙ\n" + log;
            })
            .catch(error => {
                document.getElementById('result4_error').innerHTML = 
                    "▶ ВЫПОЛНЕНИЕ С ОШИБКОЙ\n❌ Ошибка: " + error.message;
            });
    }
    
    task4();
    
    // =================================================================
    // ЗАДАНИЕ 5: Переписывание через async/await
    // =================================================================
    
    // 5.1 Задание 2 через async/await
    async function task5_2() {
        let output = "▶ ЗАДАНИЕ 2 ЧЕРЕЗ ASYNC/AWAIT\n";
        output += "══════════════════════════════\n\n";
        
        try {
            let result1 = await readConfigPromise('myConfig');
            output += result1 + '\n';
            
            let result2 = await doQueryPromise('select * from cities');
            output += result2 + '\n';
            
            let result3 = await httpGetPromise('http://google.com');
            output += result3 + '\n';
            
            let result4 = await readFilePromise('README.md');
            output += result4 + '\n';
            
            output += '✓ Все функции выполнены последовательно через async/await!\n';
        } catch(error) {
            output += '❌ Ошибка: ' + error + '\n';
        }
        
        document.getElementById('result5_2').innerHTML = output;
    }
    
    // 5.2 Задание 3 через async/await
    async function calculateFAsync(x, n) {
        let result = 0;
        let output = `Вычисление F(${x}) для n = ${n} (async/await)\n`;
        output += '══════════════════════════════════════════\n\n';
        
        for(let i = 1; i <= n; i++) {
            let f = createAsyncFunction(i);
            output += `Шаг ${i}: вычисляем f${i}(${x})...\n`;
            let value = await f(x);
            result += value;
            output += `   f${i}(${x}) = ${value}, промежуточная сумма = ${result}\n`;
        }
        
        output += `\n✅ Финальный результат F(${x}) = ${result}\n`;
        return output;
    }
    
    async function task5_3() {
        let output = await calculateFAsync(3, 4);
        document.getElementById('result5_3').innerHTML = output;
    }
    
    // 5.3 Задание 4 через async/await
    async function delayedSumAsync(initial, step) {
        if(typeof initial !== 'number' || typeof step !== 'number' || 
           isNaN(initial) || isNaN(step)) {
            throw new Error('Оба аргумента должны быть числами');
        }
        
        let current = initial;
        let count = 0;
        let output = '';
        
        output += `Начальное значение: ${initial}, шаг: ${step}\n`;
        output += '══════════════════════════════════\n\n';
        
        while(count < 5) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            count++;
            current += step;
            output += `Итерация ${count}: сумма = ${current}\n`;
            console.log(`Итерация ${count}: сумма = ${current}`);
        }
        
        output += `\n✅ Завершено после 5 итераций. Финальная сумма: ${current}\n`;
        return output;
    }
    
    async function task5_4() {
        try {
            let output = await delayedSumAsync(10, 5);
            document.getElementById('result5_4').innerHTML = 
                "▶ УСПЕШНОЕ ВЫПОЛНЕНИЕ (async/await)\n" + output;
        } catch(error) {
            document.getElementById('result5_4').innerHTML = 
                "▶ ОШИБКА (async/await)\n❌ " + error.message;
        }
    }
    
    // Запускаем все async функции
    setTimeout(() => {
        task5_2();
        task5_3();
        task5_4();
    }, 3000);
    
    // =================================================================
    // ЗАДАНИЕ 6: Вызов async-функции из обычной
    // =================================================================
    
    async function wait() {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return 10;
    }
    
    function f() {
        // Способ 1: через then
        wait().then(result => {
            console.log('Результат из f (then):', result);
            document.getElementById('result6').innerHTML += 
                `then: получили результат ${result}\n`;
        });
        
        // Способ 2: через callback
        wait().then(result => {
            (function callback(value) {
                console.log('Результат из f (callback):', value);
                document.getElementById('result6').innerHTML += 
                    `callback: получили результат ${value}\n`;
            })(result);
        });
        
        return "f() вызвана, результат будет асинхронно";
    }
    
    function task6() {
        let output = "▶ ВЫЗОВ ASYNC-ФУНКЦИИ ИЗ ОБЫЧНОЙ\n";
        output += "═══════════════════════════════════\n\n";
        
        output += "async function wait() {\n";
        output += "    await new Promise(resolve => setTimeout(resolve, 1000));\n";
        output += "    return 10;\n";
        output += "}\n\n";
        
        output += "function f() {\n";
        output += "    // Способ 1: через then\n";
        output += "    wait().then(result => {\n";
        output += "        console.log('Результат:', result);\n";
        output += "    });\n\n";
        
        output += "    // Способ 2: через callback\n";
        output += "    wait().then(result => {\n";
        output += "        (function callback(value) {\n";
        output += "            console.log('Результат через callback:', value);\n";
        output += "        })(result);\n";
        output += "    });\n";
        output += "}\n\n";
        
        output += "ОБЪЯСНЕНИЕ:\n";
        output += "───────────\n";
        output += "В обычной функции нельзя использовать await, но можно:\n";
        output += "1. Использовать .then() для получения результата\n";
        output += "2. Передать коллбэк для обработки результата\n";
        output += "3. Вернуть промис и обработать снаружи\n\n";
        
        output += "РЕЗУЛЬТАТ ВЫПОЛНЕНИЯ f():\n";
        output += "────────────────────────\n";
        
        document.getElementById('result6').innerHTML = output;
        
        // Вызываем f и добавляем результаты
        f();
    }
    
    task6();
    
    // =================================================================
    // ЗАДАНИЕ 7: Моделирование собеседования
    // =================================================================
    
    async function interview(candidate) {
        let [name, prep1, defense1, prep2, defense2] = candidate;
        let output = '';
        
        // Задание 1
        output += `${name} started the 1 task.\n`;
        await new Promise(resolve => setTimeout(resolve, prep1 * 100));
        output += `${name} moved on to the defense of the 1 task.\n`;
        await new Promise(resolve => setTimeout(resolve, defense1 * 100));
        output += `${name} completed the 1 task.\n`;
        
        // Отдых перед вторым заданием
        output += `${name} is resting.\n`;
        await new Promise(resolve => setTimeout(resolve, 500)); // 5 единиц времени
        
        // Задание 2
        output += `${name} started the 2 task.\n`;
        await new Promise(resolve => setTimeout(resolve, prep2 * 100));
        output += `${name} moved on to the defense of the 2 task.\n`;
        await new Promise(resolve => setTimeout(resolve, defense2 * 100));
        output += `${name} completed the 2 task.\n`;
        
        return output;
    }
    
    async function interviews(candidates) {
        let fullOutput = '';
        
        // Запускаем всех кандидатов параллельно
        let promises = candidates.map(candidate => interview(candidate));
        let results = await Promise.all(promises);
        
        fullOutput = results.join('');
        return fullOutput;
    }
    
    async function task7() {
        let candidates = [
            ['Ivan', 5, 2, 7, 2],
            ['John', 3, 4, 5, 1],
            ['Sophia', 4, 2, 5, 1]
        ];
        
        let output = "▶ МОДЕЛИРОВАНИЕ СОБЕСЕДОВАНИЯ\n";
        output += "═══════════════════════════════\n\n";
        output += "Кандидаты:\n";
        output += "• Ivan: подготовка1=5, защита1=2, подготовка2=7, защита2=2\n";
        output += "• John: подготовка1=3, защита1=4, подготовка2=5, защита2=1\n";
        output += "• Sophia: подготовка1=4, защита1=2, подготовка2=5, защита2=1\n\n";
        output += "РЕЗУЛЬТАТ:\n";
        output += "──────────\n\n";
        
        let result = await interviews(candidates);
        document.getElementById('result7').innerHTML = output + result;
    }
    
    task7();
    
    console.log("%c✅ Все задания лабораторной работы 5 выполнены!", "color: green; font-size: 18px; font-weight: bold;");
});