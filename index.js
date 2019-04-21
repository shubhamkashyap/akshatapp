const express = require('express')
const app = express()
const port = 4000
var bodyParser = require("body-parser");
var cors = require('cors');
var mysql      = require('mysql');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config/secret');
//var datetime = require('node-datetime');
var connection = mysql.createConnection({
  host     : 'db' ,
  user     : 'root',
  password : 'Aks@253854',
  database : "SwacchIITB"
});
console.log("here");
connection.connect(); 
app.use(cors());
app.use(bodyParser.json());
console.log("here");
app.get('/', (req, res) => res.send('Hello World!'))

app.post('/authenticatelogin', function (req, res) {
   	
	connection.query('SELECT * FROM `student` WHERE `Password`="'+md5(req.body.Password)+'" and `RollNo`="'+req.body.RollNo+'"', function (error, results, fields)  {
	  if (error) throw error;
	  if(results.length==1)
	  {
	  	var token = jwt.sign({ id:results[0]['room_no'] }, config.secret, {
	      expiresIn: 86400 // expires in 24 hours
	    });
	    res.status(200).send({ auth: true, token: token, msg:'logged in successfully'});
	  }
	  else if(results.length==0)
	  {
	  	res.status(200).send({ auth: false, msg: 'Credentials are not valid' });
	  }
	  
	}); 
})

app.get('/getusers', function (req, res) {
   	
   	var token = req.headers['x-access-token'];
  	if (!token) 
  	{
  		return res.status(401).send({ auth: false, message: 'No token provided.' });
  	}
  
  	jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    {
    	return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    else
    {
    	id=decoded.id;
    	connection.query('SELECT * FROM `list_members` WHERE `fk_mem`="'+id+'" and `active`=1', function (error, results, fields) {
		  if (error) throw error;
		  if(results.length>0)
		  {
		    res.status(200).send({ auth: true, count:results.length, data:results});
		  }
		  else
		  {
		  	res.status(200).send({ auth: true, count:results.length ,data:results});
		  }
		  
		});
    }
    
    
	})

})


// My functions starts from here

app.post('/login', function (req, res) {
   	

	connection.query('SELECT * FROM `student` WHERE `Password`="'+md5(req.body.Password)+'" and `RollNo`="'+req.body.RollNo+'"', function (error, results, fields) {
		  if (error) throw error;
		  if(results.length==1)
		  {
		    res.status(200).send({msg:'Valid',room_no:results[0]['room_no']});
		    //res.status(200).send({ auth: true, token: token, msg:'logged in successfully',results:results});
		  }
		  else if(results.length==0)
		  {
		  	//res.status(200).send({ auth: false, msg: 'Credentials are not valid' });
		  	res.status(200).send({msg:'Not Valid',room_no:'-1'});
		  }
		  
		});

   	/*var token = req.headers['x-access-token'];
  	if (!token) 
  	{
  		return res.status(401).send({ auth: false, message: 'No token provided.' });
  	}
  
  	jwt.verify(token, config.secret, function(err, decoded) {
	    if (err)
	    {
	    	return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
	    }
	    
	      id=decoded.id;
		  

		
    })*/

})



app.post('/signup', function (req, res) {
   	
	connection.query('SELECT * FROM `student` WHERE `Email`="'+(req.body.email)+'" or `RollNo`="'+req.body.rollno+'"', function (error, results, fields) {
		  if (error) throw error;
		  if(results.length==1)
		  {
		   // res.status(200).send({ auth: false, msg: 'Either email or roll no is repeated' });
		   res.status(200).send('1');
		  }
		  else if(results.length==0)
		  {
		  	//res.status(200).send({ auth: false, msg: 'Credentials are not valid' });


		  	connection.query('INSERT INTO `student`(`Email`, `RollNo`, `Password`, `room_no`) VALUES ("'+req.body.email+'","'+req.body.rollno+'","'+md5(req.body.password)+'","'+req.body.room_no+'" )', function (error, results, fields) {
		  if (error) throw error;
		
		  if(results.affectedRows)
		  {
		  	res.status(200).send('2');
		  }
		  else
		  {
		  	res.status(200).send('3');
		  }
		  
		});

		  }
		  
		});   	

})

app.post('/cleaning', function (req, res) {

	connection.query('SELECT * FROM `student` WHERE `RollNo`="'+(req.body.roll_no)+'"', function (error, results2, fields){
		  if (error) throw error;
		  if(results2.length==0)
		  {
		   res.status(200).send('-1');
		  }

		  else{
   	
	connection.query('SELECT * FROM `cleaning` WHERE `room_number`="'+(req.body.room_no)+'" and `date`="'+req.body.date+'"and `type`="'+req.body.sweep_mop+'"', function (error, results1, fields){
		  if (error) throw error;
		  if(results1.length==1)
		  {
		   res.status(200).send('3');
		  }
		  else if(results1.length==0)
		  {
		  
		  	connection.query('SELECT * FROM `worker_details` WHERE `worker_id`="'+(req.body.work_id)+'"' , function (error, results, fields) {
		  		if (error) throw error;
			  if(results.length==0)
			  {
			   res.status(200).send('2');
			  }
			  else{
			 	connection.query('INSERT INTO `cleaning`(`room_number`, `time`, `performance`, `date`, `type`, `worker_id`) VALUES ("'+req.body.room_no+'","'+req.body.currenttime+'","'+req.body.rates+'","'+req.body.date+'","'+req.body.sweep_mop+'","'+results[0]['worker_id']+'")', function (error, results9, fields) {
				  if (error) throw error;
				
				  if(results9.affectedRows)
				  {
				  	res.status(200).send('5');
				  }
				  else
				  {
				  	res.status(200).send('6');
				  }
				  
				}); 	
			  }
		  	});
		  }
		  
		}); 	  	


		  }






		  });

  	

})





// Admin APIs start

app.post('/adminLogin', function (req, res) {
   	console.log('hjhg',req);

	connection.query('SELECT * FROM `admin` WHERE `password`="'+md5(req.body.password)+'" and `email`="'+req.body.email+'"', function (error, results, fields) {
		  if (error) throw error;
		  if(results.length==1)
		  {
		    res.status(200).send({ auth: true, msg:"successfull"});
		    //res.status(200).send({ auth: true, token: token, msg:'logged in successfully',results:results});
		  }
		  else if(results.length==0)
		  {
		  	//res.status(200).send({ auth: false, msg: 'Credentials are not valid' });
		  	res.status(200).send("fail");
		  }
		  
		});

})


app.post('/workerDetails', function (req, res) {
   //	console.log('hjhg',req);

	connection.query('SELECT * FROM `worker_details` WHERE `worker_id`="'+(req.body.id)+'"', function (error, results, fields) {
		  if (error) throw error;
		  if(results.length==1)
		  {
		   // res.status(200).send({ auth: true, msg:"successfull"});
		    connection.query('SELECT `date`, COUNT(*) as rooms FROM `cleaning` where `worker_id`="'+(req.body.id)+'" GROUP BY `date`',function(error2,results2,fields){
				if (error2) throw error2;
				  if(results2.length>=1)
				  {
				    res.status(200).send({ auth: true, msg:"successfull",counts:'1',data:results2,name:results[0]['name']});
				  }
				  else if(results2.length==0)
				  {
				  	res.status(200).send({ auth: true, msg:"successfull",counts:'0'});
				  }
			});
		  }
		  else if(results.length==0)
		  {
		  	res.status(200).send({ auth: false, msg:"unsuccessfull"});
		  }
		  
		});

	

})



app.post('/roomDetails', function (req, res) {
   //	console.log('hjhg',req);

	connection.query('SELECT `Email`,`room_no` FROM `student` WHERE `RollNo`="'+(req.body.id)+'"', function (error, results, fields) {
		  if (error) throw error;
		  if(results.length==1)
		  {
		   // res.status(200).send({ auth: true, msg:"successfull"});
		    connection.query('SELECT `date`,`type` FROM `cleaning` where `room_number`="'+(results[0]['room_no'])+'" order by `date` desc LIMIT 10',function(error2,results2,fields){
				if (error2) throw error2;
				  if(results2.length>=1)
				  {
				    res.status(200).send({ auth: true, msg:"successfull",counts:'1',data:results2,email:results[0]['Email']});
				  }
				  else if(results2.length==0)
				  {
				  	res.status(200).send({ auth: true, msg:"successfull",counts:'0'});
				  }
			});
		  }
		  else if(results.length==0)
		  {
		  	res.status(200).send({ auth: false, msg:"unsuccessfull"});
		  }
		  
		});

	

})




app.post('/dateFetch', function (req, res) {
   //	console.log('hjhg',req);

	connection.query('SELECT COUNT(*) as mop FROM `cleaning` WHERE `date`="'+(req.body.id)+'" and `type` = 1', function (error, results, fields) {
		  if (error) throw error;
		   // res.status(200).send({ auth: true, msg:"successfull"});
		    connection.query('SELECT COUNT(*) as sweep FROM `cleaning` WHERE `date`="'+(req.body.id)+'" and `type` = 0',function(error2,results2,fields){
				if (error2) throw error2;
				  
				    res.status(200).send({ auth: true, msg:"successfull",counts:results[0]['mop'],counts2:results2[0]['sweep']});
				  
				  
			});
		  
		  
		  
		});

	

})





app.get('/verifytoken', function (req, res) {
   	
   	var token = req.headers['x-access-token'];
  	if (!token) 
  	{
  		return res.status(401).send({ auth: false, message: 'No token provided.' });
  	}
  
  	jwt.verify(token, config.secret, function(err, decoded) {
	    if (err)
	    {
	    	return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
	    }
	    else
	    {
	    	id=decoded.id;
			res.status(200).send({ auth: true, id:id});
		}
    })

})

app.post('/createusers', function (req, res) {
   	
   	var token = req.headers['x-access-token'];
  	if (!token) 
  	{
  		return res.status(401).send({ auth: false, message: 'No token provided.' });
  	}
  
  	jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    {
    	return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    else
    {
    	id=decoded.id;
    	connection.query('INSERT INTO `list_members`(`fname`, `mname`, `lname`, `email`, `description`, `fk_mem`) VALUES ("'+req.body.fname+'","'+req.body.mname+'","'+req.body.lname+'","'+req.body.email+'","'+req.body.description+'","'+id+'") ON DUPLICATE KEY UPDATE `fname`="'+req.body.fname+'",`mname`="'+req.body.mname+'",`lname`="'+req.body.lname+'",`description`="'+req.body.description+'",`fk_mem`="'+id+'"', function (error, results, fields) {
		  if (error) throw error;
		
		  if(results.affectedRows)
		  {
		  	res.status(200).send({ auth: true, msg:"Operation successfull, redirecting to list"});
		  }
		  else
		  {
		  	res.status(200).send({ auth: false, msg:"Cannot create user ,some error occurred"});
		  }
		  
		});
    }
    
    
	})

})


app.post('/updateusers', function (req, res) {
   	
   	var token = req.headers['x-access-token'];
  	if (!token) 
  	{
  		return res.status(401).send({ auth: false, message: 'No token provided.' });
  	}
  
  	jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    {
    	return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    else
    {
    	id=decoded.id;
    	connection.query('INSERT INTO `list_members`(`id_ls_mem`,`fname`, `mname`, `lname`, `email`, `description`, `fk_mem`) VALUES ("'+req.body.id_ls_mem+'","'+req.body.fname+'","'+req.body.mname+'","'+req.body.lname+'","'+req.body.email+'","'+req.body.description+'","'+id+'") ON DUPLICATE KEY UPDATE `fname`="'+req.body.fname+'",`mname`="'+req.body.mname+'",`lname`="'+req.body.lname+'",`email`="'+req.body.email+'",`description`="'+req.body.description+'",`fk_mem`="'+id+'"', function (error, results, fields) {
		  if (error) throw error;
		
		  if(results.affectedRows)
		  {
		  	res.status(200).send({ auth: true, msg:"Operation successfull, redirecting to list"});
		  }
		  else
		  {
		  	res.status(200).send({ auth: false, msg:"Cannot create user ,some error occurred"});
		  }
		  
		});
    }
    
    
	})

})

app.get('/getUser/:id_ls_mem', function (req, res) {
   	
   	var token = req.headers['x-access-token'];
  	if (!token) 
  	{
  		return res.status(401).send({ auth: false, message: 'No token provided.' });
  	}
  
  	jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    {
    	return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    else
    {
    	
    	id=decoded.id;
    	connection.query('SELECT * from `list_members` WHERE `id_ls_mem`="'+req.params.id_ls_mem+'" AND `fk_mem`="'+id+'"', function (error, results, fields) {
		  if (error) throw error;
		
		  if(results.length)
		  {
		  	res.status(200).send({ auth: true, msg:"Operation successfull, redirecting to list",data:results[0]});
		  }
		  else
		  {
		  	res.status(200).send({ auth: false, msg:"Cannot create user ,some error occurred"});
		  }
		  
		});
    }
    
    
	})

})

app.get('/deleteuser/:id_ls_mem', function (req, res) {
   	
   	var token = req.headers['x-access-token'];
  	if (!token) 
  	{
  		return res.status(401).send({ auth: false, message: 'No token provided.' });
  	}
  
  	jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    {
    	return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    else
    {
    	
    	id=decoded.id;
    	connection.query('UPDATE `list_members` SET `active`=0 WHERE `id_ls_mem`="'+req.params.id_ls_mem+'" and `fk_mem`="'+id+'"', function (error, results, fields) {
		  if (error) throw error;
		
		  if(results.affectedRows)
		  {
		  	  connection.query('SELECT * FROM `list_members` WHERE `fk_mem`="'+id+'" and `active`=1', function (error, results, fields) {
			  if (error) throw error;
			  if(results.length>0)
			  {
			    res.status(200).send({ auth: true, count:results.length, data:results});
			  }
			  else
			  {
			  	res.status(200).send({ auth: true, count:results.length ,data:results});
			  }
			  
			});
		  }
		  else
		  {
		  	res.status(200).send({ auth: false, msg:"Cannot delete user ,some error occurred"});
		  }
		  
		});
    }
    
    
	})

})

app.post('/createikigai', function (req, res) {
   	
   	var token = req.headers['x-access-token'];
  	if (!token) 
  	{
  		return res.status(401).send({ auth: false, message: 'No token provided.' });
  	}
  
  	jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    {
    	return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    else
    {
    	id=decoded.id;
    	if(req.body.setid==undefined)
    	{
          connection.query('INSERT INTO `ikigaiSet`(`createdBy`) VALUES ("'+id+'")', function (error, results, fields) {
		  if (error) throw error;
		  if(results.affectedRows)
		  {
		  	let setid=results.insertId;
		  	let str='';
		  	req.body.response.map((currElement, index) => {
		  	if(currElement!=''){
				str+='("'+currElement+'","'+req.body.type+'","'+setid+'")';
				if(index!=req.params.length)
				{
					str+=',';
				}
			}	
			});
			console.log('INSERT INTO `ikigaiResponse`(`response`, `type`, `idSet`) VALUES '+removeLastComma(str)+'');
		  	connection.query('INSERT INTO `ikigaiResponse`(`response`, `type`, `idSet`) VALUES '+removeLastComma(str)+'', function (error, results, fields) {
		  		if (error) throw error;
		  		if(results.affectedRows)
		  		{
		  			res.status(200).send({ auth: true, msg:"Operation successfull, redirecting to list",id:setid});
		  		}
		  		else
		  		{
		  			res.status(200).send({ auth: false, msg:"Cannot create ,some error occurred"});
		  		}
		  	})
		  	
		  }
		  else
		  {
		  	
		  }
		  
		});	
    	}
    	else
    	{
    	 	connection.query('DELETE FROM `ikigaiResponse` WHERE `type`="'+req.body.type+'" AND `idSet`="'+req.body.setid+'"', function (error, results, fields) {
		  	let setid=req.body.setid;
		  	let str='';
		  	req.body.response.map((currElement, index) => {
		  	if(currElement!=''){
				str+='("'+currElement+'","'+req.body.type+'","'+setid+'")';
				if(index!=req.params.length)
				{
					str+=',';
				}
			}	
			});
			console.log('INSERT INTO `ikigaiResponse`(`response`, `type`, `idSet`) VALUES '+removeLastComma(str)+'');
		  	connection.query('INSERT INTO `ikigaiResponse`(`response`, `type`, `idSet`) VALUES '+removeLastComma(str)+'', function (error, results, fields) {
		  		if (error) throw error;
		  		if(results.affectedRows)
		  		{
		  			res.status(200).send({ auth: true, msg:"Operation successfull, redirecting to list",id:setid});
		  		}
		  		else
		  		{
		  			res.status(200).send({ auth: false, msg:"Cannot create ,some error occurred"});
		  		}
		  	})
		  	
		 
		  
			})
		}
    	}
        
	})

})

app.get('/getikigaibyid/:type/:id', function (req, res) {
   	
   	var token = req.headers['x-access-token'];
  	if (!token) 
  	{
  		return res.status(401).send({ auth: false, message: 'No token provided.' });
  	}
  
  	jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    {
    	return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    else
    {
		connection.query('SELECT * FROM `ikigaiResponse` WHERE `type`="'+req.params.type+'" and `idSet`="'+req.params.id+'"', function (error, results, fields) {
			if (error) throw error;
			if(results.length>0)
			{
				res.status(200).send({ auth: true, count:results.length, data:results});
			}
			else
			{
				res.status(200).send({ auth: true, count:results.length ,data:results});
			}

		});
		  
		}
	})

})

app.get('/getikigaidata', function (req, res) {
   	
   	var token = req.headers['x-access-token'];
  	if (!token) 
  	{
  		return res.status(401).send({ auth: false, message: 'No token provided.' });
  	}
  
  	jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    {
    	return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    else
    {
    	id=decoded.id;
    	connection.query("SELECT * ,UNIX_TIMESTAMP(createdAt) as ddate,(SELECT GROUP_CONCAT(' ',response) from ikigaiResponse where type=1 and idset=ikigaiSet.id) as love,(SELECT GROUP_CONCAT(' ',response) from ikigaiResponse where type=2 and idset=ikigaiSet.id) as passion,(SELECT GROUP_CONCAT(' ',response) from ikigaiResponse where type=3 and idset=ikigaiSet.id) as vocation,(SELECT GROUP_CONCAT(' ',response) from ikigaiResponse where type=4 and idset=ikigaiSet.id) as profession FROM ikigaiSet where createdBy='"+id+"'", function (error, results, fields) {
		  if (error) throw error;
		  if(results.length>0)
		  {
		    res.status(200).send({ auth: true, count:results.length, data:results});
		  }
		  else
		  {
		  	res.status(200).send({ auth: true, count:results.length ,data:results});
		  }
		  
		});
    }
    
    
	})

})


app.delete('/deleteikigai/:id', function (req, res) {
   	
   	var token = req.headers['x-access-token'];
  	if (!token) 
  	{
  		return res.status(401).send({ auth: false, message: 'No token provided.' });
  	}
  
  	jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    {
    	return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    else
    {
    	userid=decoded.id;
		connection.query('DELETE FROM `ikigaiSet` WHERE `createdBy`="'+userid+'" and `id`="'+req.params.id+'"', function (error, results, fields) {
			if (error) throw error;
			if(results.length>0)
			{
				res.status(200).send({ auth: true, count:results.length,flag:true});
			}
			else
			{
				res.status(200).send({ auth: true, count:results.length,flag:false});
			}

		});
		  
		}
	})

})

app.get('/getikigaidata/:id', function (req, res) {
   	
   	var token = req.headers['x-access-token'];
  	if (!token) 
  	{
  		return res.status(401).send({ auth: false, message: 'No token provided.' });
  	}
  
  	jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    {
    	return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    else
    {
		id=decoded.id;
		setid=req.params.id;
    	connection.query("SELECT *,ikigaiResponse.id as setid FROM ikigaiSet INNER JOIN ikigaiResponse ON ikigaiResponse.idSet = ikigaiSet.id where ikigaiSet.createdBy='"+id+"' AND ikigaiSet.id='"+setid+"'", function (error, results, fields) {
		  if (error) throw error;
		  if(results.length>0)
		  {
		    res.status(200).send({ auth: true, count:results.length, data:results});
		  }
		  else
		  {
		  	res.status(200).send({ auth: true, count:results.length ,data:results});
		  }
		  
		});
		  
		}
	})

})

app.get('/updateikigaidata/:type/:id', function (req, res) {
   	
   	var token = req.headers['x-access-token'];
  	if (!token) 
  	{
  		return res.status(401).send({ auth: false, message: 'No token provided.' });
  	}
  
  	jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    {
    	return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    else
    {
		id=decoded.id;
		setid=req.params.id;
    	connection.query("UPDATE `ikigaiResponse` SET `type`='"+req.params.type+"' WHERE `id`='"+req.params.id+"'", function (error, results, fields) {
		  if (error) throw error;
		  if(results.length>0)
		  {
		    res.status(200).send({ auth: true, count:results.length});
		  }
		  else
		  {
		  	res.status(200).send({ auth: true, count:results.length});
		  }
		  
		});
		  
		}
	})

})


function removeLastComma(strng){        
    var n=strng.lastIndexOf(",");
    var a=strng.substring(0,n) 
    return a;
}


app.listen(port, () => console.log(`Example app listening on port ${port}!`))


