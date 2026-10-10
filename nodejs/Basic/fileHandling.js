import fs from 'fs';

/* FS MODULE */

/* ============================================================= */
// CREATE AND REWRITE - OR - OVERRIDE

// Syncronasly
// fs.writeFileSync('./test.txt', 'hey hello from backend')

/* ========== */

// Asyncronasly
// fs.writeFile('./test.txt', 'hey are free to watch movie', () => {})

/* ============================================================= */

// READ FILE

// Syncronasly
// const result = fs.readFileSync('./testCases.txt', 'utf-8')
// console.log("result : ", result) 

/* ========== */

// Asyncronasly
// fs.readFile('./testCases.txt',  'utf-8', (error, result) => {
//     if(error) {
//         console.log("ERROR DURING READING A FILE: " , error)
//     } else {
//       console.log("RESULT : ", result)
//     }
// })

/* ============================================================= */

// UPPEND DATA ON FILE

//SYNCRONSALY

// const result = fs.appendFileSync('./testCases.txt', `he new user id :  ${ Math.floor( (Math.random() * 100) +10) } on time was ${  Date.now() } \n`, )
// if(result) console.log("result : ", result)

/* ========== */

//ASYNCRONSALY
// fs.appendFile('./testCases.txt', `he new user id :  ${ Math.floor( (Math.random() * 100) +10) } on time was ${  Date.now() } \n`,(error,result)=>{
//   if(error)  console.log("ERROR : ", error)
//   if(result)   console.log("RESULT : ", result)
// } )

/* ============================================================= */

//  COPY THE FILE

// SYNCRONSALY

// const result = fs.cpSync('./testCases.txt', './copy.txt')
// if(result) console.log("result : ", result)

/* ========== */

// ASYNCRONSALY

// fs.copyFile('./testCases.txt', './copy.txt', (error, result)=> {
//     if( error) console.log("ERROR :", error)
//       if(result) console.log("RESULT :", result)
// })

/* ============================================================= */

//  DELETE THE FILE

// SYNCRONSALY
// const result = fs.unlinkSync("./copy.txt")
// if(result) console.log("RESULT : ", result)

/* ========== */

// ASYNCRONSALY
// fs.unlinkSync('./copy.txt',(error, result)=>{
//     if(error) console.log("ERROR : ",error)
//     if(result) console.log("RESULT :", result)
// })

/* ============================================================= */
