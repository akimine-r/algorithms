/**
 * ACO for TSP (lang: Javascript)
 * Author: Akimine(akimine-r)
 * License: MIT License
 * Data of CITIES: http://elib.zib.de/pub/mp-testdata/tsp/tsplib/tsp/a280.tsp
 **/
// 都市の座標を設定（a280.tspを利用）
const CITIES = [[288,149],[288,129],[270,133],[256,141],[256,157],[246,157],[236,169],[228,169],[228,161],[220,169],[212,169],[204,169],[196,169],[188,169],[196,161],[188,145],[172,145],[164,145],[156,145],[148,145],[140,145],[148,169],[164,169],[172,169],[156,169],[140,169],[132,169],[124,169],[116,161],[104,153],[104,161],[104,169],[90,165],[80,157],[64,157],[64,165],[56,169],[56,161],[56,153],[56,145],[56,137],[56,129],[56,121],[40,121],[40,129],[40,137],[40,145],[40,153],[40,161],[40,169],[32,169],[32,161],[32,153],[32,145],[32,137],[32,129],[32,121],[32,113],[40,113],[56,113],[56,105],[48,99],[40,99],[32,97],[32,89],[24,89],[16,97],[16,109],[8,109],[8,97],[8,89],[8,81],[8,73],[8,65],[8,57],[16,57],[8,49],[8,41],[24,45],[32,41],[32,49],[32,57],[32,65],[32,73],[32,81],[40,83],[40,73],[40,63],[40,51],[44,43],[44,35],[44,27],[32,25],[24,25],[16,25],[16,17],[24,17],[32,17],[44,11],[56,9],[56,17],[56,25],[56,33],[56,41],[64,41],[72,41],[72,49],[56,49],[48,51],[56,57],[56,65],[48,63],[48,73],[56,73],[56,81],[48,83],[56,89],[56,97],[104,97],[104,105],[104,113],[104,121],[104,129],[104,137],[104,145],[116,145],[124,145],[132,145],[132,137],[140,137],[148,137],[156,137],[164,137],[172,125],[172,117],[172,109],[172,101],[172,93],[172,85],[180,85],[180,77],[180,69],[180,61],[180,53],[172,53],[172,61],[172,69],[172,77],[164,81],[148,85],[124,85],[124,93],[124,109],[124,125],[124,117],[124,101],[104,89],[104,81],[104,73],[104,65],[104,49],[104,41],[104,33],[104,25],[104,17],[92,9],[80,9],[72,9],[64,21],[72,25],[80,25],[80,25],[80,41],[88,49],[104,57],[124,69],[124,77],[132,81],[140,65],[132,61],[124,61],[124,53],[124,45],[124,37],[124,29],[132,21],[124,21],[120,9],[128,9],[136,9],[148,9],[162,9],[156,25],[172,21],[180,21],[180,29],[172,29],[172,37],[172,45],[180,45],[180,37],[188,41],[196,49],[204,57],[212,65],[220,73],[228,69],[228,77],[236,77],[236,69],[236,61],[228,61],[228,53],[236,53],[236,45],[228,45],[228,37],[236,37],[236,29],[228,29],[228,21],[236,21],[252,21],[260,29],[260,37],[260,45],[260,53],[260,61],[260,69],[260,77],[276,77],[276,69],[276,61],[276,53],[284,53],[284,61],[284,69],[284,77],[284,85],[284,93],[284,101],[288,109],[280,109],[276,101],[276,93],[276,85],[268,97],[260,109],[252,101],[260,93],[260,85],[236,85],[228,85],[228,93],[236,93],[236,101],[228,101],[228,109],[228,117],[228,125],[220,125],[212,117],[204,109],[196,101],[188,93],[180,93],[180,101],[180,109],[180,117],[180,125],[196,145],[204,145],[212,145],[220,145],[228,145],[236,145],[246,141],[252,125],[260,129],[280,133]];

// 都市間の距離を計算
const DISTANCE_CITIES = calcCitiesDistance(CITIES); 

// スタート地点
const START_CITY = 0;

// 蟻の数
const NUMBER_ANT = 100;
// 蟻の代の数
const LOOP_MAX_COUNT = 100;

// フェロモン計算に使う距離とフェロモンの重みの設定
const WEIGHT_DISTANCE = 3;
const WEIGHT_PHEROMONE = 2;

// フェロモンの量と1代ごとの蒸発度合い
const QUANT_PHEROMONE = 1;
const QUANT_EVAPORATION = 0.8;


function runACO(cities){
    // 代ごとのルート情報を一時保存する配列
    let routes =[];
    // 空のルート配列を作る
    let routeCount =  new Array(CITIES.length);
    routeCount = initArray(routeCount, CITIES.length);

    // 全ての代に使うフェロモンの初期設定
    let colonyPheromone = new Array(CITIES.length);
    colonyPheromone = initArray(colonyPheromone, CITIES.length);
    let tmpArr = new Array(CITIES.length);
    tmpArr = initArray(tmpArr, CITIES.length);
    colonyPheromone = updatePheromone(colonyPheromone, tmpArr);

    // 全代分の結果
    let result = [];

    // 設定した代の数だけループ
    for(let loopCount = 0; loopCount < LOOP_MAX_COUNT; loopCount++){(function(){
        console.log('loopCount', loopCount); //今は何代目？

        // 蟻コロニーを作る
        let ants = [];

        // この代のフェロモンの初期設定
        let newPheromone = new Array(CITIES.length);
        newPheromone = initArray(newPheromone, CITIES.length);

        // 設定した蟻の数だけループ
        for(let i=0; i<NUMBER_ANT; i++){(function(){
            // 新しい蟻を一匹作る
            let ant = new InitAnt(START_CITY, colonyPheromone);
            // ルート探索をさせる
            ant.searchRoute(cities);
            // この代のフェロモンを更新
            newPheromone = ant.updatePheromone(newPheromone, cities);
            // ルート計算と保存
            routeCount = ant.countRoute(routeCount);
            if(routes.includes(ant.route) == false){
                routes.push(ant.route);
            }
        }())}

        //全体のフェロモンの更新
        colonyPheromone = updatePheromone(colonyPheromone, newPheromone);
        // console.log('colonyPheromone:', colonyPheromone);
        // console.log('this colony\'s routes:', routes);

        //この代の全てのルートの総距離を計算して結果配列に保存
        result.push(calcRoutesDistance(routes));

        //この代の全てのルート情報をリセット
        routes = [];

    }());
    }

    // 全ての結果を出力
    console.log('Log:', result);

    // 最適解を返す
    return getTheBest(result[result.length-1]);
}


function calcRoutesDistance(routes){
    let result = [];
    for(let i=0;i<routes.length;i++){(function(){
        result[i] = {routes:[],distance:0}
        let distance = calcRouteDistance(routes[i]);
        result[i].routes = routes[i];
        result[i].distance = distance;
//         console.log('Route: ', routes[i],', Distance: ', distance);
    }())
    }
    return result;
}

function calcRouteDistance(route){
    let result = 0;
    for(let i=0;i<route.length-1;i++){(function(){
        let thisCity = route[i];
        let nextCity = route[i+1];
        result+= DISTANCE_CITIES[thisCity][nextCity];
    }())
    }
    return result;
}

function getTheBest(routes){
    let min = routes.sort(function(a, b){
        return a.distance - b.distance
    })[0];
    let minCount = routes.filter(function(route){
        return route.distance == min.distance;
    });
    if(minCount.length == routes.length){
        console.log('All routes has same result:', min);
    }else{
        console.log('The minest result is:', min);
    }
    return min
}

function InitAnt(cityNumber, pheromone){
    this.route = [cityNumber];
    this.colonyPheromone = pheromone;
    this.selfPheromone = Array.from(pheromone);
    this.updatePheromone = function(newPheromone, cities){
            for(let i=0;i<this.route.length -1 ;i++){(function(route){
                let thisCity = route[i];
                let nextCity = route[i+1];
                let length = DISTANCE_CITIES[thisCity][nextCity];
                let delta = QUANT_PHEROMONE / length;
                if(isNaN(newPheromone[thisCity][nextCity])){
                    newPheromone[thisCity][nextCity] = delta;
                }else{
                    newPheromone[thisCity][nextCity] += delta;
                }
            }(this.route));
            }
            return newPheromone;        
    };
    this.searchRoute = function(cities){
        let route = this.route;
        let colonyPheromone = this.colonyPheromone;
        for(let i=0;i<cities.length;i++){(function(){
            if(i == cities.length-1){
                route.push(route[0]);
            }else{
                let nextCitiesProbabilities = calcCitiesProbability(route, cities, DISTANCE_CITIES, colonyPheromone);
                let nextCity = Number(selectNextCity(nextCitiesProbabilities));
                route.push(nextCity);
            }
            // console.log(i, route);
        }())
        }
        this.route = route;
        // console.log('this ant\'s route: ', this.route);
    }
    this.countRoute = function(routeCount){
        for(let i=0;i<this.route.length -1 ;i++){(function(){
            let thisCity = i;
            let nextCity = i+1;
            if(routeCount[thisCity][nextCity] == undefined){
                routeCount[thisCity][nextCity] = 1;
            }else{
                routeCount[thisCity][nextCity] += 1;
            }
        }())
        }
        return routeCount;
    }
}

function selectNextCity(probabilities){
    let cities = Object.keys(probabilities);
    let cumulative = cumulativeSum(Object.values(probabilities));
    let total = cumulative.reduce(function (accumulator, currentValue){return accumulator + currentValue;});
    let random = Math.random() * cumulative[cumulative.length-1];
    let result;
    cumulative.some(function(cumul, index){
        if(cumul > random){
            result = cities[index];
            return true;
        }
    })
    if(isNaN(result)){
        debugger;
    }
    return result;
}

function cumulativeSum(values){
    let result = [];
    for(let i=0; i<values.length; i++){(function(){
        if(i == 0){
            result.push(values[i]);
        }else{
            result.push(result[i-1]+values[i]);
        }
        }())
    }
    return result;
}

function calcCitiesProbability(selfRoute, cities, citiesDistance, colonyPheromone){
    let thisCity = selfRoute[selfRoute.length -1];
    if(isNaN(thisCity)){
        console.log('debugger', selfRoute, selfRoute.length, cities, cities.length);
        debugger;
    }
    let numerators = {};
    let probabilities = {};
    let denominator = 0;
    for(let i = 0; i<cities.length; i++){(function(colonyPheromone, citiesDistance, selfRoute){
        if(selfRoute.includes(i) == false){
            // console.log(colonyPheromone.length, citiesDistance.length)
            let thisPheromone = colonyPheromone[thisCity][i];
            let thisDistance = citiesDistance[thisCity][i];
            let numerator = Math.pow(thisPheromone, WEIGHT_PHEROMONE) * (1 / thisDistance);
            numerators[String(i)] = numerator;
            denominator += numerator;
        }
    }(colonyPheromone, citiesDistance, selfRoute));
    }
    Object.keys(numerators).forEach(function(key){
        if(numerators[key] == 0 || denominator == 0){
            probabilities[key] = 0.001;
        }else{
            probabilities[key] = numerators[key] / denominator;
        }
        if(isNaN(probabilities[key])){
            probabilities[key] = 0.001;
        }
    });
    return probabilities;
}
 
function eucDistance(cityA, cityB){
    return Math.sqrt(Math.pow(cityA[0] - cityB[0], 2) + Math.pow(cityA[1] - cityB[1], 2))
}

function updatePheromone(colonyPheromone, newPheromone){
    for(let i=0; i<Math.max(colonyPheromone.length, newPheromone.length); i++){(function(){
        for(let j=0; j<Math.max(colonyPheromone.length, newPheromone.length); j++){(function(){
                    colonyPheromone[i][j] = QUANT_EVAPORATION * colonyPheromone[i][j] + newPheromone[i][j]
        }())
        }
    }())
    }
    return colonyPheromone;
}

function calcCitiesDistance(cities){
    let citiesDistance = new Array(cities.length);
    for(let i=0; i<cities.length; i++){(function(){
        citiesDistance[i] = new Array(cities.length);
        for(let j=0;j<cities.length;j++){(function(){
            citiesDistance[i][j] = eucDistance(cities[i],cities[j]);
            }())
        }
        }())
    }
    return citiesDistance;
}

function initArray(array, length){
    for(let i=0; i<array.length; i++){(function(){
        array[i] = new Array(length);
        array[i].fill(0);
        }())
    }
    return array;
}

function main(){
    let bestRoute = runACO(CITIES);
    console.log('The Best Route is:', bestRoute);
}

main();