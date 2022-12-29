// @ts-check

const { throws } = require('assert');

// 클래스
/* class Car1 {
  constructor(brand, color) {
    this.brand = brand;
    this.color = color;
  }

  drive() {
    console.log(`${this.brand}의 차 색은 ${this.color} `);
  }

  showSpec() {
    console.log(
      `이 차의 브랜드는 ${this.brand}이고 색상은 ${this.color}입니다.`
    );
  }
}

class ElecCar extends Car1 {
  constructor(brand, color, fuel) {
    super(brand, color);
    this.fuel = fuel;
  }

  // car1의 drive() 메소드를 재정의 해서 사용
  dirve() {
    console.log(
      `${this.brand}의 차 색은 ${this.color} 이고 ${this.fuel}의 힘으로 주행합니다.`
    );
  }

  //overriding
  showSpec() {
    super.showSpec();
    console.log(`그리고 이 차는  ${this.fuel}의 힘으로 주행합니다.`);
  }
}

const hyundai = new Car1('Hyundai', 'black');
// const matiz = new Car1('matiz', 'gold');
// const toyota = new Car1('toyota', 'silver');

const tesla = new ElecCar('tesla', 'red', 'electricity');

// hyundai.drive();
// tesla.dirve();

hyundai.showSpec();
tesla.showSpec(); */
// 생성자
/* function Car2(brand, color) {
  this.brand = brand;
  this.color = color;
  this.drive = function () {
    console.log(`${this.brand}의 차 색은 ${this.color} `);
  };
}
const hyundai2 = new Car2('Hyundai', 'white');
const matiz2 = new Car2('matiz', 'pink');
const toyota2 = new Car2('toyota', 'gray');

console.log(matiz2.color, matiz2.brand);
toyota2.drive();
matiz2.drive();
hyundai2.drive();
 */

/* function Car(brand, color) {
  this.brand = brand;
  this.color = color;

  this.drive = function () {
    console.log(`brand : ${this.brand} \n color: ${this.color}`);
  };
}

function ElecCar(brand, color, fuel) {
  Car.call(this, brand, color);
  this.fuel = fuel;

  this.drive = function () {
    console.log(`brand : ${brand} \ncolor: ${color} \nfuel : ${this.fuel}`);
  };
}

// 생성자 상속은 이렇게.. 몬소린지 모르갯음.;
ElecCar.prototype = Object.create(Car.prototype);
ElecCar.prototype.constructor = ElecCar;

const tesla = new ElecCar('tesla', 'red', 'elec');
tesla.drive();
 */

class Shape {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  getArea() {
    console.log(this.width * this.height);
  }
}
class Rectangle extends Shape {
  constructor(width, height) {
    super(width, height);
  }
}

class Triangle extends Shape {
  constructor(width, height) {
    super(width, height);
  }
  getArea() {
    console.log((this.width * this.height) / 2);
  }
}

class Circle extends Shape {
  constructor(width, height, radius) {
    super(width, height);
    this.radius = radius;
  }
  getArea() {
    console.log(`width:${this.width} height:${this.height} 는 안쓸거지만..`);
    console.log(this.radius * this.radius * Math.PI);
  }
}

const shape = new Shape(3, 3);
const rectangular1 = new Rectangle(5, 5);
const tri1 = new Triangle(4, 4);
const circle1 = new Circle(5, 5, 2);

shape.getArea();
rectangular1.getArea();
tri1.getArea();
circle1.getArea();
