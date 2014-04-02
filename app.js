
/**
 * Module dependencies.
 */

var express = require('express')
  , routes 	= require('./routes')
  , user 	= require('./routes/user')
  , http 	= require('http')
  , path 	= require('path')
  , ejs 	= require('ejs')
  , io 		= require('socket.io')
  , fs 		= require('fs')
  , ytdl 	= require('ytdl')
  , mongodb	= require('mongodb')
  , app		= express()
  , server
  , db
  , io;

/* Change default EJS opening an closing tags (These ones makes us feel like coding in Django) */
ejs.open = '{{';
ejs.close = '}}';

/* Config the server */

app.configure(function(){
  app.set('port', process.env.PORT || 24861);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('ajlfjowief&%jhddwidj*+dkjfsomebulshitslkjdsjdiojdfioejfidj'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/* Define the routes */
app.get('/', routes.index);
app.get('/users', user.list);

/* Up the server */
server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

/* Up mongodb */
db = new mongodb.Db('social-listening', new mongodb.Server('oceanic.mongohq.com', 10016, {auto_reconnect:true}), {});

/* Socket.io must be listening */
io = io.listen(server)

io.sockets.on('connection', function (socket) {
  
  socket.on('sendUrl', function(data){
  	
  	/* Do something with the fucking url */
  	
  	ytdl.getInfo(data.url, function(error, info){
  		
  		if(error) return done(error)
  		
  		/**
  		 * TODO: En info tenemos la duración del video, podemos tener un timer que calcule
  		 * ese tiempo, y una vez finalice reproduzca el siguiente video
  		 */
  		
		db.open(function(err, p_client) {
		  db.authenticate('testing', 'testing', function(err) {
		   //Change error handler when going into production 
		   if (err) console.log(err);
		    
		    var collection = new mongodb.Collection(db, 'playlists');
		    
		    collection.insert({url: data.url, title: info.title, 
		    	thumb: info.thumbnail_url, duration: info.length_seconds, videoId: info.video_id })
		   	
		   	db.close()
		   	 
		  });
		});

		
	  	/* Send the result back to the client */	  	
	  	socket.emit('urlBack', { url: data.url, title: info.title, videoId: info.video_id })
	  	socket.broadcast.emit('urlBack', { url: data.url, title: info.title, videoId: info.video_id })
			
  	})
  	
  })
  
});
