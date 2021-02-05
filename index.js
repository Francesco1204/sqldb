const express = require('express')
const app = new express()
const BodyParser = require('body-parser')

const port = 8080

const sqlite3 = require('sqlite3').verbose()
const db3 = new sqlite3.Database('./data.db3')

app.use(BodyParser.json())




db3.serialize(() => {
	db3.run("CREATE TABLE IF NOT EXISTS users (user TEXT, password TEXT)")
	const stmt = db3.prepare("INSERT INTO users VALUES (?, ?)")
	for (let i = 0; i < 10; i++){
		stmt.run("User"+i, "Pass"+i)
	}
	stmt.finalize()
})

app.post("/login", (req, res) => {
	const us = req.body.u
	const pass = req.body.p
	db3.get("SELECT * FROM users WHERE user = ? AND password = ?", [us, pass], (err, row) => {
		if (err){
			res.json({error: err.message})
		} else {
			if (row !== undefined){
				res.json({ok: true})		
			} else {
				res.status(401).send({ok: false})
			}	
		}
	})
})

app.listen(port, () => console.log(`App listening to port ` + port));