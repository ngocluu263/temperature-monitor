'use strict';

var cluster = require('cluster')
  , zmq = require('zmq');

var NBR_WORKERS = 3;

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomString() {
  var source = 'abcdefghijklmnopqrstuvwxyz'
    , target = [];

  for (var i = 0; i < 20; i++) {
    target.push(source[randomBetween(0, source.length)]);
  }
  return target.join('');
}

function workerTask() {
  var dealer = zmq.socket('dealer');
  dealer.identity = randomString();

  dealer.connect('tcp://127.0.0.1:5671');

  var total = 0;

  var sendMessage = function () {
    dealer.send(['AAA', {'Hi Boss':'aaa','ssss':'fff'}]);
  };

  //  Get workload from broker, until finished
  dealer.on('message', function onMessage() {
    var args = Array.apply(null, arguments);

    var workload = args[1].toString('utf8');
    var workload2 = args.toString('utf8');

    console.log(workload2);

    if (workload === 'Fired!') {
      console.log('Completed: '+total+' tasks ('+dealer.identity+')');
      dealer.removeListener('message', onMessage);
      dealer.close();
      return;
    }
    total++;
    console.log(sendMessage);
    setTimeout(sendMessage, randomBetween(0, 500));
  });

  //  Tell the broker we're ready for work
  sendMessage();
}

// function main() {
//   var broker = zmq.socket('router');
//   broker.bindSync('tcp://*:5671');
//
//   var endTime = Date.now() + 5000
//     , workersFired = 0;
//
//   broker.on('message', function () {
//     var args = Array.apply(null, arguments)
//       , identity = args[0]
//       , now = Date.now();
//
//     if (now < endTime) {
//       broker.send([identity, '', 'Work harder']);
//     } else {
//       broker.send([identity, '', 'Fired!']);
//       workersFired++;
//       if (workersFired === NBR_WORKERS) {
//         setImmediate(function () {
//           broker.close();
//           cluster.disconnect();
//         });
//       }
//     }
//   });
//
//   for (var i=0;i<NBR_WORKERS;i++) {
//     cluster.fork();
//   }
// }

// if (cluster.isMaster) {
//   main();
// } else  {
//   workerTask();
// }

workerTask();
