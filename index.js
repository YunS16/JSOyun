const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const cellSize = 55;  //karelerin boyutu
const rightSectionX = canvasWidth * 0.78;

// Resim yükleme fonksiyonu
function createImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}

// Projeye konulucak resimlerin oluşturulması
let backgroundimg = createImage("./img/background.png");
let softgunimg = createImage("./img/softgun.jpeg");
let sniperimg  = createImage("./img/sniper.jpg");
let rpgimg  = createImage("./img/rpg.png");
let bombimg = createImage("./img/bomba.jpeg");
let soldierimg = createImage("./img/soldier.png");
let terroristimg = createImage("./img/terrorist.jpg");
let coinimg = createImage("./img/coin.png");
let nextRoundimg = createImage("./img/next.png");










const Music = new Audio("./sounds/backgroundmusic.mp3");  //arka plan müziğinin koyulması
Music.loop = true;  //arka plan müziğinin oyun boyunca loop olarak çalması
Music.volume = 0.3;



//arka plan müziğinin oyuna başla butonuna basıldığında başlaması 
document.getElementById("startGameBtn").addEventListener("click", () => {
    Music.play();
    document.getElementById("startContainer").style.display = "none";

    draw();
    nextRound();//oyuna başl butonuna basıldığı gibi ilk düşmanın ortaya çıkması için
});


//Silah Sesleri
const softgunshot = new Audio("./sounds/softgunshot.mp3");
softgunshot.volume = 0.5;
const snipershot = new Audio("./sounds/snipershot.mp3");
snipershot.volume = 0.5;
const bombshot = new Audio("./sounds/bombshot.mp3");
bombshot.volume = 0.5;
const rpgshot = new Audio("./sounds/bombshot.mp3");
rpgshot.volume = 0.5;

//Silahlar 
const softgun ={ 

    name: "softgun",
    img: softgunimg,
    cost:1

};

const sniper = {
    name: "sniper",
    img: sniperimg,
    cost:3

};

const bomb = {
    name:"bomb",
    img:bombimg,
    cost:5
};

const rpg = {

    name:"Rpg",
    img: rpgimg,
    cost:7 
};


//Düşman sınıfı 
class Enemy {
    constructor(row) {
        this.col = 0; // en sol sütun
        this.row = row; // rastgele satır
        this.width = cellSize;
        this.height = cellSize;
    }

    get x() {
        return 3 * cellSize + this.col * cellSize;
    }

    get y() {
        return this.row * cellSize;
    }

    draw() {
        ctx.drawImage(terroristimg, this.x, this.y, this.width, this.height);
    }
}





let money = 5 ;  //baslangictaki oyuncunun parasi
let selectedweapon =null;
let weaponIcons = [];

const weapons = [softgun,sniper,bomb,rpg];
let enemies = [];





function drawGrid() {
    // Sol taraf (Düşman) alanı
    ctx.strokeStyle = "#444";
    const adjustedRightX = rightSectionX - 1 * cellSize;
    for (let x = 3*cellSize ; x < adjustedRightX; x += cellSize) {
        for (let y = 0; y < canvasHeight; y += cellSize) {
            ctx.strokeRect(x, y, cellSize, cellSize);
        }
    }

    
    
}


function draw() {
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    // 1. Arka plan resmi
    ctx.drawImage(backgroundimg, 0, 0, canvasWidth, canvasHeight);//Arka Plan resminin çizimi
     
    drawGrid();//karelerin çizimi 
    drawSoldier(); //askerin çizimi
    drawWeapons(); //silahların çizimi
    drawGold();  //paranın çizimi
    drawNextButton(); //sonraki raunt btn çizimi
    drawEnemies();  //düşman çizimi
}


//Resimlerin çizim fonksiyonları
function drawSoldier(){
    ctx.drawImage(soldierimg,canvasWidth - 220,canvasHeight /2-45,110,110);
}


function drawWeapons() {
    weaponIcons = [];
    const spacing = 112;  //iki silah arasındaki dikey boşluk
    const startY = 50;   //silahların y kordinatı 
    const baseX = canvasWidth - 70;  //yatay kordinatı



    //forEach ile tüm silahların yerleştirilmesi
    weapons.forEach((weapon, index) => {
        const x = baseX;
        const y = startY + index * spacing;

        // Seçili silahı üstüne geldiği zaman renk değiştir 
        ctx.fillStyle = (selectedweapon == weapon.name) ? "#cfc" : "#fff";  // eer silah seçildiyse silah resminin arka planı yeşil olur
        ctx.fillRect(x - 5, y - 5, 60, 60);   //silah ikonunun arka plan kutusu
        ctx.strokeStyle = "#000";   //kutunun dış hatlarının siyah olması
        ctx.strokeRect(x - 5, y - 5, 60, 60);

        // 
        ctx.drawImage(weapon.img, x, y, 50, 50);
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(`${weapon.cost} altın`, x, y + 85);  //her silah resminin altında kaç altın olduğunun yazılması

        // Tıklama için kayıt
        weaponIcons.push({
            name: weapon.name,
            x: x -5,
            y: y -5 ,
            width: 60,
            height: 60,
            cost: weapon.cost
        });
    });
}


function drawNextButton() {
    ctx.drawImage(nextRoundimg, canvasWidth-70 , 495 , 60 , 40);
    ctx.strokeStyle = "red"; 
    ctx.strokeRect(canvasWidth - 70, 495, 60, 40);//resmin kırmızı çerçeve içinde olması için

}



function drawEnemies() {
    enemies.forEach(enemy => enemy.draw());
}


//Para resmi ve kaç miktarda para olduğunun gösterimi
function drawGold(){
  ctx.drawImage(coinimg,canvasWidth - 850,canvasHeight-550,50,50);
  ctx.fillStyle = "black";
  ctx.font = "35px Arial";
  ctx.fillText(money,canvasWidth-790,canvasHeight-512);

}

function nextRound() {
    // Yeni düşman üretmek , math.random ile rastgele satırda düşman üretilmesi
    const rowCount = Math.floor(canvasHeight / cellSize); //ekrana kaç tane satır çizildiğini hesaplar
    
    const dusmanSayisi = 3;


    for (let i = 0; i < dusmanSayisi; i++) {
    const newRow = Math.floor(Math.random() * rowCount);
    enemies.push(new Enemy(newRow));
    }

    

    // next raunt butonuna basılınca düşmanların bir kare sağa kayması 
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.col += 1;

        // Son kareye gelince Oyunun bitmesi
        const maxCol = Math.floor((rightSectionX - 3 * cellSize) / cellSize) - 1;
        if (enemy.col > maxCol) {
            alert("Kaybettiniz Düşman üssünüze ulaşti !");
            enemies = [];
            return;
        }
    }

    draw();

    if (money >=50){
        alert("Tebrikler Oyunu Kazandiniz Tekrar oynamak için sayfayı yenileyiniz...");
    }

    money +=1;

    

}



canvas.addEventListener("click", function(event) {
    
    //farenin tıklama kordinatları X ve Y için
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    // Silah ikonlarına tıklama kontrolü
    for (let i = 0; i < weaponIcons.length; i++) {
        const w = weaponIcons[i];
        if (
            mouseX >= w.x &&
            mouseX <= w.x + w.width &&
            mouseY >= w.y &&
            mouseY <= w.y + w.height
        ) {
            if (money >= w.cost) {
                selectedweapon = w.name;
                money -= w.cost;
                draw();
            }
            return;
        }
    }

    // Next Round butonuna tıklama 
    if (mouseX >= canvasWidth - 70 &&  mouseX <= canvasWidth - 10  &&   mouseY >= 495 &&  mouseY <= 535) {
        nextRound();
        return;
    }




    // Düşmana tıklama ve silah etkisi
   for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    const isClicked =  mouseX >= enemy.x && mouseX <= enemy.x + enemy.width   &&   mouseY >= enemy.y && mouseY <= enemy.y + enemy.height;

    if (isClicked && selectedweapon) {
        const col = enemy.col;
        const row = enemy.row;

        if (selectedweapon === "softgun") {
            enemies.splice(i, 1);
            softgunshot.play();
            money += 1;
        }

        else if (selectedweapon === "sniper") {
             snipershot.play();
             enemies = enemies.filter(e => {
            if (e.row === row) {
            money += 1;
            return false; 
                }
            return true;
         });
      }


       else if (selectedweapon === "bomb") {
           bombshot.play();
           enemies = enemies.filter(e => {
           const dx = e.col - col;
           const dy = e.row - row;
          if (dx >= 0 && dx <= 1 && dy >= 0 && dy <= 1) {
               money += 1;
               return false;
             }
        return true;
    });
}


        else if (selectedweapon === "Rpg") {
            rpgshot.play();
            enemies = enemies.filter(e => {
                const dx = Math.abs(e.col - col);
                const dy = Math.abs(e.row - row);
                if (dx <= 1 && dy <= 1) {  
                    money += 1;
                    return false;
                }
                return true;
            });
        }

        selectedweapon = null;  //silah tek kullanımlık olduğundan seçim sıfırlanır 
        draw();
        return;
    }
}

});


//oyun bitimi para 50 den fazla olunca oyun biter











