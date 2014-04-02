var socket = io.connect();

window.addEvent('domready', function() {
	
	var urlform = $('getvideourl')
	
	if( urlform ) {
		
		urlform.addEvent('submit', function(event) {
			
			event.stop()
			
			var videoUrl = $('url_input').value
		
			socket.emit('sendUrl', { url: videoUrl } )
		})
			
	}
	
	socket.on('urlBack', function(data){
		
		/* Añado al playlist */
		
		var playlist = $('playlist')		
		listElement = new Element('li', { html: data.title })		
		listElement.inject(playlist)
		
		/* Añado el video para reproducir */
		
		var videoContainer = $('video')
		var providerUrl = 'http://www.youtube.com/embed/'
		var params =  '?rel=0&amp;autoplay=1#t=120s'
		video = new Element('iframe', { width: 420, height: 315, frameborder: 0, src: providerUrl + data.videoId + params })
		
		video.inject(videoContainer)
		
	})
	
})