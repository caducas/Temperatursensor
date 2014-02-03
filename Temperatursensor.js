var shellExecutor = require('child_process');

/**
* This method is used to execute a pi@home command concerning GPIO Ports.
*
* @method execute
* @param {opts} opts The options:
*	- 'direction' = 'in' or 'out'
*	- 'pin' = the pin number on RPi GPIOs
*	- 'value' = the value for direction 'out'
*/
function execute(opts) {
}


function listenEvent(eventId, opts) {

	var interval = opts.interval || 5000;

	shellExecutor.exec('cat /sys/bus/w1/devices/w1_bus_master1/w1_master_slaves', function(err, stdout, stderr){
		if(err !== null) {
			console.log('TEMPERATURSENSOR: Error initiating device - is the sensor installed correctly?');
			return;
		}

		var device = stdout;
		device = device.replace(/(\r\n|\n|\r)/gm,"");

		setInterval(function() {
			var command = 'cat /sys/bus/w1/devices/'+device+'/w1_slave';
			shellExecutor.exec(command, function(err, out, stderror) {
				out = out.replace(/(\r\n|\n|\r)/gm,"");
				var temperature = out.substring(out.length-5);
				temperature = temperature.substring(0,2) + '.'+temperature.substring(2,5);
				temperature = parseFloat(temperature);
				process.emit(eventId+'', eventId, temperature);
			});
		},interval);
	});
}

if(typeof exports !== 'undefined') {
	exports.execute = execute;
	exports.listenEvent = listenEvent;
}