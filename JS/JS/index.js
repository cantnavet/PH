// 全局变量声明
let f = Array.from({ length: 100000 }, () => [0, 0]); // {d,n}
let a = 0; // pointer to the current position
let w = 0; // index of the object used for comparison
let l = 0; // layer difference
let isequal = false;
let did = false;
var pr="";
var isauto = false;
var autospeed = 5;

// 主要设定 (可以改这里的东西)
const steps = true;
const sleeptime = 0; // in seconds
const skipsteps = 1;
const runtimes = 2060;
const defaultfsize = 40;
const layersizede = 1.35;    //内层大小衰减
const termsizede = 1.035;    //项大小衰减
let n = "1";
let d = "1";
var speed = parseInt(document.getElementById("speed").value);

const sleeptimems = sleeptime * 1000;
a = n.length - 1;

for (let i = 0; i < n.length; i++) {
    f[i] = [parseInt(d.charAt(i), 10), parseInt(n.charAt(i), 10)];
}   


// 初始化函数
function init() {


    printp();

    for (let i = 0; i < runtimes; i++) {
        a++; // move pointer

        // add a number to last term (唯二可以动的地方)
        f[a] = [2, 1];

        toNormal(); // main binary normalization method

        if (i % skipsteps === 0) printp();

        if (sleeptimems > 0) {
            sleep(sleeptimems).then(() => {
                // Continue with the next iteration after sleeping
            });
        }

        // Optional check to print and stop when certain condition is met
        // if (f[a][1] === 4) {
        //     printp();
        //     console.log(`i ${i}`);
        //     break;
        // }
    }
}

// 将一个展开的公式收缩
function toNormal() {
    equalpart();
    did = false;
    insidepart();
    while (did) {
        did = false;
        equalpart();
        insidepart();
    }
}

// pn(..+pn(..)) to pn(..+pn+1(0)) part
function insidepart() {
    let j;
    isequal = true;
    while (isequal) {
        isequal = false;
        for (w = a; w >= 0; w--) {
            j = w - (a - w) - 1;
            if (j < 0) break;
            if (f[j][0] < f[j + 1][0] && f[j][0] < f[w][0]) {
                l = f[w][0] - f[j][0];
                for (let k = 0; k < w - j; k++) {
                    if (f[j + k][0] + l !== f[w + k][0] || f[j + k][1] !== f[w + k][1] || f[j + k][1] < f[j][1]) {
                        break;
                    }
                    if (k === w - j - 1) {
                        if (steps) {
                            printp();
                            console.log(" = ");
                        }
                        f[w][1]++;
                        for (let l = w + 1; l <= a; l++) {
                            f[l] = [0, 0];
                        }
                        a = w;
                        isequal = true;
                        did = true;
                    }
                }
                if (isequal) break;
            }
        }
    }
}

// pnX+pnX to pn(X+p1) part
function equalpart() {
    isequal = true;
    while (isequal) {
        isequal = false;
        w = a;
        for (let j = a - 1; j >= 0; j--) {
            if (f[j][0] < f[w][0]) {
                w = j;
                continue;
            }
            if (f[j][0] === f[w][0]) {
                for (let k = 0; k < w - j; k++) {
                    if (f[j + k][0] !== f[w + k][0] || f[j + k][1] !== f[w + k][1]) {
                        break;
                    }
                    if (k === w - j - 1) {
                        if (steps) {
                            printp();
                            console.log(" = ");
                        }
                        f[w] = [f[w][0] + 1, 1];
                        for (let l = w + 1; l <= a; l++) {
                            f[l] = [0, 0];
                        }
                        a = w;
                        isequal = true;
                        did = true;
                    }
                }
                if (isequal) break;
            }
        }
    }
}

function printp() {
    pr="";
    for (let i = 0; i <= f.length; i++) {
        if (f[i][0] !== 0) {
            pr+="<span style='font-size: "+defaultfsize/(layersizede**f[i][0]*termsizede**(i))+"px;'>P"+f[i][1];
            if (f[i + 1] && f[i + 1][0] > f[i][0]) {
                pr+="(</span>";
            }
            if (f[i + 1] && f[i + 1][0] === f[i][0]) {
                pr+="+</span>"
            }
            if (f[i + 1] && f[i + 1][0] < f[i][0]) {
                for (let j = 0; j < f[i][0] - f[i + 1][0] - (f[i + 1][0] === 0 ? 1 : 0); j++) {
                    pr+="<span style='font-size: "+defaultfsize/(layersizede**(f[i][0]-j-1)*termsizede**(i))+"px;'>)</span>";
                }
                if (f[i + 1][0] !== 0) {
                    pr+="<span style='font-size: "+defaultfsize/(layersizede**(f[i+1][0])*termsizede**(i))+"px;'>+</span>";
                }
            }
        } else {
            break;
        }
    }
    //pr+="wad<span style='font-size: 15px;'>awdawd</span>"
    document.getElementById("maintext").innerHTML=pr
}

function addone(){
    a++; 
    f[a] = [1, 1];
    toNormal(); 
    printp();
}

function addinone(){
    a++; 
    f[a] = [2, 1];
    toNormal(); 
    printp();
}

function autoa1(){
    if(!isauto){
        isauto=true;
        var timer = setInterval(function(){
            var speed = parseInt(document.getElementById("speed").value);
            addone();
            if(!isauto){
                clearInterval(timer);
            }
        },parseInt(1000/autospeed))
    }else{
        isauto=false;
    }

}

function autoain1(){
    if(!isauto){
        isauto=true;
        var timer = setInterval(function(){
            addinone();
            if(!isauto){
                clearInterval(timer);
            }
        },parseInt(1000/autospeed))
    }else{
        isauto=false;
    }

}

// Utility function to sleep in async context
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// // 使用 DOMContentLoaded 确保 DOM 完全加载后再初始化
// document.addEventListener('DOMContentLoaded', (event) => {
//     init(); // 调用初始化函数
// });
