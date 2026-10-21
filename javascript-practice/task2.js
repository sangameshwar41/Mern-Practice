
// import { resolve } from "dns"
// import {add} from "./math.js"
// import { ok, rejects } from "assert"
// import { error } from "console"
// import { json } from "body-parser";

// const { loadavg } = require("node:os");

// // let
// let a=75;
// a=99
// console.log(a);

// // const

// const name="rahul"
// console.log(name);

// //data types
// // number
// let number=1;
// // string
// let names="harish"
// // array
// let aray=[1,2,3,4,"sam",true,null];
// // object
// let studentDetails={
// name:"sanga",
// age:16,
// class:9
// }
// // null
// const hullValue=null;

// // conditional statements

// let marks=88;
// if(marks>=90 && marks<=100){
//     console.log("A");
// }
// else if(marks>=80 && marks<=89){
//     console.log("B"); 
// }
// else if(marks>=70 && marks<=79){
//     console.log("B"); 
// }
// else if(marks>=60 && marks<=69){
//     console.log("B"); 
// }
// else{
//     console.log("fail");
// }

// // switch
// let grade ="b"
// switch(grade){
//     case "a":console.log("A grade");
//     break;
//     case "b":console.log("B grade");
//     break
//     case "c":console.log("C grade" );
//     ;break;
// }

// // for loop

// for(let i=0;i<=10;i++)
//     {
//     console.log(i);
// }

// // while

// let num=9;
// while(num>0){
//     console.log(num);
//     num--;
// }


// // do while

// let num1=55
// do{
//     console.log(num1);
//     num1++
// }while(num1>=55 && num1<=65);


// // functions

// function greet(name){
//     console.log(`hello mister/miss ${name} how are you`);
//     console.log("hello ",name);
//     console.log("hello "+name);
// }
// greet("shruthi")
// greet("kamal")
// greet("rathod")

// //arrow function

// let namee=(a,b)=>{
//       return a*b;   
// }
// console.log(namee(5,6));


// // for each method
// let arrayNumbers=[1,2,3,4,5,6,7,8,9];
// arrayNumbers.forEach((A)=>console.log(A));

// // objects

// let objects=[
//     {
//         name:"sam",
//         age:55,
//         addres:[{streat:"phas 1",gate:8}]
//     },
//     {
//         name:"sangeetha",
//         age:45,
//         addres:[{streat:"phase 4",gate:1}]
//     }
// ]
// console.log(objects[0].addres[0].streat);
// console.log(objects[1].age);

// for(let i=0;i<=objects.length-1;i++){
//     console.log(objects[i].addres[0].streat);
// }

// // Array methods
// // map

// let arrayNumbers1=[1,2,3,4,5,6,7,8,9];
// let newarr1=arrayNumbers1.map((a)=>a*2)
// console.log(newarr1);

// let sample=[7,5]
// let add5=sample.map((a)=>a+5)
// console.log(add5);


// let filter1=arrayNumbers1.filter((a)=>a>5)
// console.log(filter1);


// // finding find

// let find=arrayNumbers1.find((a)=>a>6)
// console.log(find);

// // somelet some

// let some=arrayNumbers1.some((a)=>a>9)
// console.log(some);

// // reduce

// let reduce=arrayNumbers1.reduce((sum,val)=>sum+=val,0)
// console.log(reduce);


// // array and object destruction
// let objdistruction={names:"jam",age:22}
// // useing normal way
// console.log(objdistruction.names);
// console.log(objdistruction.age);

// // witj distruction
// const{names,age}=objdistruction
// console.log(names);
// console.log(aage)

// spread[...] usein=g array

// let arr=[2,3]
// let newarr=[...arr,4]
// console.log(newarr);

// // spread using objects

// let obj={n:"saas",type:"dev"}
// let newobj={... obj,level:5}
// console.log(newobj);
// //rest syntacx[...]
// function allvalues(...marks){
//     console.log(marks);
// }
// allvalues(1,2,3,4,6)

// import
// console.log(add(5,7));

// promise

// let output = new Promise((resolve, reject) => {
//     let status = false;
    
//     if (status) {
//         resolve("completed");
//     } else {
//         reject("rejected");
//     }
// });

// output.then((msg) => {
//     console.log(msg);
// }).catch((msg) => {
//     console.log(msg);
// }).finally(()=>console.log("finally task done with an status")
// );

// ex-2

// function getStudent() {
//     let status = new Promise(function (resolve, reject) {
//         reject("ramesh");
//     });

//     return status;
// }

// // getStudent()
// //     .then(function (msg) {
// //         console.log(msg);
// //     })
// //     .catch(function (msg) {
// //         console.log(msg);
// //     });

// async function details() {
//     try {
//         let studentname = await getStudent();
//         console.log(studentname);
//         console.log("from async try");
//     }
//     catch (error) {
//         console.log(error);
//         console.log("from async catch");
//     }
// }

// details()

// fetch
// fetch("https://jsonplaceholder.typicode.com/users/1")
// .then((res)=>{
//     if(!res.ok){
//         throw new error("failed fetching")
//     }
//     else{
//     return res.json()
//     }
// }).then((res)=>{
//     console.log(res);
    
// }).catch((error)=>{
//     console.log("error while loading");
    
// })

// const student = {
//     name: "Ravi",
//     marks: 85
// };
// let studentdata=JSON.stringify(student)
// console.log(studentdata);
// let originalform=JSON.parse(studentdata);
// console.log(originalform);

// optional chaining

let student={name:"sam",age:33}
console.log(student.address?.city);

// nullish coaleschin
let studentname=null;
console.log(studentname ?? "admin" );

