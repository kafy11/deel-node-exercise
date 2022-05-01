import Sequelize from 'sequelize'

let storage = './database.sqlite3'
let logging = true 
if(process.env.NODE_ENV === 'test'){
  storage = ':memory:'
  logging = false
}

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging, 
});