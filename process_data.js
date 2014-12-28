// Parse command line arguments

if (process.argv.length !== 3) {
	console.error('Usage: node <this-file.js> <data-file.json>');
	process.exit(code=-1);
}

try {
	fs = require('fs')
	fs.readFile(process.argv[2], 'utf8', function (err, data) {
		if (err) {
			return console.error(err);
		}

		var content = JSON.parse(data);
		var dataList = content['data'];
		var outputDict = {};
		for (var i = dataList.length - 1; i >= 0; i--) {
			var response = dataList[i];
			if (response['retCode'] !== 200) {
				console.error('Bad data response!');
				continue;
			}

			var payload = response['payload'];
			var timeList = payload["time"];
			var priceLastList = payload["priceLast"];
			var amountList = payload["amount"];
			var volumeList = payload["volume"];
			var countList = payload["count"];
			for (var n = payload['time'].length - 1; n >= 0; n --) {
				var time = timeList[n];
				if (time in outputDict) {
					console.error('Duplicate record!');
					continue;
				}

				outputDict[time] = [
					priceLastList[n],
					amountList[n],
					volumeList[n],
					countList[n]
				];
			}
		}

		var sorted = [];
		for (var key in outputDict) {
			sorted[sorted.length] = key;
		}

		sorted.sort();

		var outputList = [];
		for (var index in sorted) {
			var time = sorted[index];
			var timeData = outputDict[time];
			outputList.push([
				time, timeData[0], timeData[1], timeData[2], timeData[3]
			].join());
		}

		var outputContent = outputList.join('\n');
		fs.writeFile("output.txt", outputContent, function(err) {
			if(err) {
				console.error(err);
			} else {
				console.error("The file was saved!");
			}
		}); 
	});
} catch (e) {
	console.error('Invalid data file.');
	process.exit(code=-1);
}
