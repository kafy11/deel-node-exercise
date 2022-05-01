import express from 'express'
import bodyParser from 'body-parser'
import { sequelize } from './db'
import * as models from './model'
import contractsRouter from './routes/contracts'
import jobsRouter from './routes/jobs'
import balancesRouter from './routes/balances'
import adminRouter from './routes/admin'

const app = express();

app.use(bodyParser.json())
app.set('sequelize', sequelize)
app.set('models', models)

//set routes
app.use(contractsRouter)
app.use(jobsRouter)
app.use(balancesRouter)
app.use(adminRouter)

export default app
