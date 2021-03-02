const fs = require('fs');
const m2m = require('m2m');
const sinon = require('sinon');
const assert = require('assert');
const { m2mTest } = require('../lib/client.js');

let dl = 100;
let clientTotal = 0;
let clientPassed = 0;
let clientFailed = 0;


describe('\nset test stats ...', function() {
before(function() {
  // runs once before the first test in this block
  sinon.stub(console, 'log'); 
  sinon.stub(console, 'info'); 
  sinon.stub(console, 'warn');
  sinon.stub(console, 'error'); 
});

after(function() {
  // runs once after the last test in this block
});

beforeEach(function() {
  // runs before each test in this block
  clientTotal++;
});

afterEach(function() {
  // runs after each test in this block
  if (this.currentTest.state === 'passed') {
    clientPassed++;
  }
  if (this.currentTest.state === 'failed') {
    clientFailed++;
  }
});

describe('\nQuick m2m object test ...', function () {
  describe('requiring m2m module', function () {
    it('should return an object with 4 methods', function () {

      m2mTest.enable();

      assert.strictEqual( m2m instanceof Object, true);
      assert.strictEqual( typeof m2m, 'object');
      assert.strictEqual( typeof m2m.Server, 'function');
      assert.strictEqual( typeof m2m.Device, 'function');
      assert.strictEqual( typeof m2m.Client, 'function');
      assert.strictEqual( typeof m2m.connect, 'function');
      

      setTimeout(() => {
        process.exit();
      }, 10000);

    });
  });
});

describe('\nClient object test ...', function () {
  describe('create a client object w/o an argument', function () {
    it('should return an object with a property id of type string', function () {
      const client = new m2m.Client();
      id1 = client.id;

      assert.strictEqual( typeof client, 'object' );
      assert.strictEqual( client.client, true );
      assert.strictEqual( typeof client.id, 'string' );
      assert.strictEqual( client.id.length, 8 );
      

    });
  });
  describe('create a device object using a single argument device id', function () {
    it('should return an object if argument type is an integer', function () {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);

      assert.strictEqual( typeof device, 'object' );
      assert.strictEqual( Number.isInteger(device.id), true );
      assert.strictEqual( device.id, 100 );
      

    });
    it('create a device object if the argument provided is an array w/ a single element', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      client.accessDevice([100], function (err, device){
				if(err) throw err;
        assert.strictEqual( typeof device, 'object' );
        assert.strictEqual( device.id, 100 );
        assert.notStrictEqual( Array.isArray(device), true );
        done();
      });
    });
  });
  describe('create an array device object using an array argument w/ getDevices', function () {
    it('should return an array object with a length equal to argument.length', function () {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let arg = [100, 200, 300];
      let device = client.accessDevice(arg);
      
      assert.strictEqual( Array.isArray(device), true );
      assert.strictEqual( device instanceof Array, true );
      assert.strictEqual( arg.length, device.length );
      

    });
    it('should throw an error if argument is not an array', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      try{
      	let device = client.accessDevice(100, 200, 300);
      }
      catch(e){
				assert.strictEqual( e.message, 'access id more than 1 must be contained in an array');
        done();
      }
    });
    it('create an array object if a callback argument is provided', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let arg = [100, 200, 300];
      client.accessDevice(arg, function (err, device){

        assert.strictEqual( err, null );
        assert.strictEqual( typeof device, 'object' );
        assert.strictEqual( Array.isArray(device), true );
        assert.strictEqual( device instanceof Array, true );
        assert.strictEqual( arg.length, device.length );
        assert.strictEqual( device[0].id, 100 );
        assert.strictEqual( device[1].id, 200 );
        assert.strictEqual( device[2].id, 300 );
        done();

      });
    });
    it('Callback should return w/ an error object', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      try{
      	client.accessDevice(100, 200, 300, function (err, device){});
      }
			catch(e){
				assert.strictEqual( e.message, 'access id more than 1 must be contained in an array');
        done();
      }
    });
    it('Callback should return w/ a device object', function (done) {

      const client = new m2m.Client({client:{}});
      assert.strictEqual( typeof client, 'object' );

     	client.accessDevice(100, function (err, device){
        if(err) throw err;
        console.log('device', device);
        assert.strictEqual( device._index, 0);
        assert.strictEqual( device.id, 100);
        done();
      });
    });
  });
  describe('Test a local device object property - device.getData()', function () {
    it('should throw an error if a callback argument is not provided', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(300);
      assert.strictEqual( typeof device, 'object' );

      try{
        device.getData('test1');
      }
      catch(e){
        assert.strictEqual( e.message, 'callback argument is required');
        done();
      }
      
    });
    it('should throw an error if channel argument is not a string', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(110);
      assert.strictEqual( typeof device, 'object' );

      try{
        device.getData(120, function(err, data){});
      }
      catch(e){
        assert.strictEqual( e.message, 'invalid arguments');
				done();
      }
    });
  });
  describe('Test a local device object property - device.watch()', function () {
		it('should throw an error if channel argument is invalid', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(210);
      assert.strictEqual( typeof device, 'object' );

      try{
		    device.watch(125, function(err, result){});
      }
      catch(e){
        assert.strictEqual( e.message, 'invalid arguments');
        done();
      }

    });
    it('should execute the callback if channel string argument is valid', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(220);
      assert.strictEqual( typeof device, 'object' );

      let channelName = 'watch-test1', event = true, watch = true;
      let eventName = device.id + channelName + event + watch;

      device.watch(channelName, function(err, result){ 
				if(err) throw err;
        assert.strictEqual( err, null );
        done();
      });
      
    });
    it('should execute the callback if a channel object argument is valid', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(210);
      assert.strictEqual( typeof device, 'object' );

      let channelName = 'watch-test1', event = true, watch = true;
      let eventName = device.id + channelName + event + watch;

      device.watch({name:channelName}, function(err, result){ 
				if(err) throw err;
        assert.strictEqual( err, null );
        done();
      });
      
    });
    it('should execute the callback if a channel object argument is valid w/ interval', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(232);
      assert.strictEqual( typeof device, 'object' );

      let channelName = 'watch-test1', event = true, watch = true;
      let eventName = device.id + channelName + event + watch;

      device.watch({name:channelName, interval:6000}, function(err, result){ 
				if(err) throw err;
        assert.strictEqual( err, null );
        done();
      });
      
    });
		it('should execute the callback if a channel object argument is valid w/ poll', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(233);
      assert.strictEqual( typeof device, 'object' );

      let channelName = 'watch-test1', event = true, watch = true;
      let eventName = device.id + channelName + event + watch;

      device.watch({name:channelName, poll:6000}, function(err, result){ 
				if(err) throw err;
        assert.strictEqual( err, null );
        done();
      });
      
    });
    it('should throw an error if a callback argument is not provided', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );

      try{
        device.unwatch('watch-test1');
      }
      catch(e){
        assert.strictEqual( e.message, 'invalid arguments');
        done();
      }
       
    });
  });
  describe('Test a local device object property - channel().watch()', function () {
    it('should not throw an error using .watch() if a callback argument is not provided', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );

      try{
        device.channel('test').watch();
      }
      catch(e){
        throw new Error('invalid test');
      }
      done();
    });
    it('should throw an error using .getData() if a callback argument is not provided', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );

      try{
        device.channel('test').getData();
      }
      catch(e){
        assert.strictEqual( e.message, 'callback argument is required' );    
        done();
      }
     
    });
    it('should execute the callback if a valid data is available', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(300);
      assert.strictEqual( typeof device, 'object' );

      let channelName = 'watch-test', event = true, watch = true;
      let eventName = device.id + channelName + event + watch;

      device.channel(channelName).watch(function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result.test, 'passed');
				done();
      });
      
    });
    it('should execute the callback if a valid argument w/ interval data is provided', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(350);
      assert.strictEqual( typeof device, 'object' );

      let channelName = 'watch-test-1', event = true, watch = true;
      let eventName = device.id + channelName + event + watch;

      device.channel(channelName).watch(100, function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result.test, 'passed');
				done();
      });
      
    });
    it('should execute the callback if a valid object argument w/ interval property is provided', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(300);
      assert.strictEqual( typeof device, 'object' );

      let channelName = 'watch-test1', event = true, watch = true;
      let eventName = device.id + channelName + event + watch;

      device.channel(channelName).watch({interval:100}, function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result.test, 'passed');
        done();
      });

    });
    it('should execute the callback if a valid object argument w/ poll property is provided', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(300);
      assert.strictEqual( typeof device, 'object' );

      let channelName = 'watch-test2', event = true, watch = true;
      let eventName = device.id + channelName + event + watch;

      device.channel(channelName).watch({poll:100}, function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result.test, 'passed');
				done();
      });

    });
    it('should throw an eror if an invalid argument is provided', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(300);
      assert.strictEqual( typeof device, 'object' );

      let channelName = 'watch-test3', event = true, watch = true;
      let eventName = device.id + channelName + event + watch;

      try{
		    device.channel(channelName).watch('100', function(err, result){});
      }
			catch(e){
				assert.strictEqual( e.message, 'invalid arguments');
        done();
      }

    });
    it('should execute callback if a valid data with error is returned', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(200);
      assert.strictEqual( typeof device, 'object' );

      let channelName = 'test-fail', event = true, watch = true;

      device.channel(channelName).watch(function(err, result){ 
        assert.strictEqual( result, null);
        assert.strictEqual( err.message, 'fail');
        done();
      });

    });
    it('should not throw an error if a callback argument is provided', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(245);
      assert.strictEqual( typeof device, 'object' );

      let channelName = 'watch-test', event = true, watch = true;
      let eventName = device.id + channelName + event + watch;

      device.channel(channelName).watch(function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result.test, 'passed');
       	done();
      });

    });
  });
  describe('Test a local device object property - channel().unwatch()', function () {
    it('should return the result as true if watch channel name is valid', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(350);
      assert.strictEqual( typeof device, 'object' );

      let channelName = 'watch-test', event = false, watch = 'undefined';
      let eventName = device.id + channelName + event + watch + true;

      device.channel(channelName).unwatch(function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result, true);
        done();
      });
    });
    it('should throw an error if watch channel name is invalid', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(300);
      assert.strictEqual( typeof device, 'object' );

      let channelName = 'test-fail', event = false, watch = 'undefined';

      device.channel(channelName).unwatch(function(err, result){ 
        assert.strictEqual( err.message, 'fail');
        assert.strictEqual( result, null);
        done();
      });

    });
		it('should return a valid result if a valid argument is provided', function (done) {

      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(150);
      assert.strictEqual( typeof device, 'object' );

      let channelName = 'getData-test', event = false, watch = false;
      let eventName = device.id + channelName + event + watch;

      try{
		    device.channel(channelName).getData(function(err, result){ 
		      assert.strictEqual( err, null);
		      assert.strictEqual( result.test, 'passed');
		      done();
		    });
      }
      catch(e){
				throw 'invalid test';
      }

    });
    it('should return a valid result if the recvd data is a valid data (value property)', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(200);
      assert.strictEqual( typeof device, 'object' );

      let channelName = 'test-value', event = false, watch = false;
      let eventName = device.id + channelName + event + watch;

      try{  
		    device.channel(channelName).getData(function(err, result){ 
		      assert.strictEqual( err, null);
          assert.strictEqual( result.test, 'passed');
		      done();
		    });
      }
      catch(e){
				throw 'invalid test';
      }
    });
    it('should an error object if the rcvd data has an error', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(200);
      assert.strictEqual( typeof device, 'object' );

      let channelName = 'test-fail', event = false, watch = false;
      let eventName = device.id + channelName + event + watch;

      device.channel(channelName).getData(function(err, result){ 
        assert.strictEqual( result, null);
        assert.strictEqual( err.message, 'fail');
        done();
      });

    });
  });
  describe('Test a local device object property - channel().sendData()', function () {
    it('should throw an error if the payload argument is not provided', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(150);

      assert.strictEqual( typeof device, 'object' );
      try{
        device.channel('test').sendData();
      }
      catch(e){
        assert.strictEqual( e.message, 'invalid arguments');
        done();
      }
    });
    it('should send the data if no callback argument is provided', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );

			let channelName = 'test-channel-no-cb', event = false, watch = false;
      let eventName = device.id + channelName + event + watch;

      try{
        device.channel(channelName).sendData('test');
      }
      catch(e){
				throw 'invalid test';
      }
      
      done();

    });
    it('should create an object if all arguments are provided', function (done) {

      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );
       
      device.channel('sendData-test').sendData({payload:'test'},function(err, result){
        assert.strictEqual( err, null);
        assert.strictEqual( result.test, 'passed');
        done();
      });

    });
    it('should execute callback if a valid data with error is returned', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(200);
      assert.strictEqual( typeof device, 'object' );

      let channelName = 'error', event = false, watch = false;
      let eventName = device.id + channelName + event + watch;

      device.channel(channelName).sendData('test', function(err, result){ 
        assert.strictEqual( result, null);
        assert.strictEqual( err.message, 'fail');
        done();
      });

    });
  });
  describe('Test a local device object property - api().get()', function () {
    it('should throw an error if a callback argument is not provided', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );
      try{
        device.api('/get-api').get();
      }
      catch(e){
        assert.strictEqual( e.message, 'callback argument is required');
        done();
      }

    });
    it('should create an object if callback argument is provided', function (done) {

      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(200);
      assert.strictEqual( typeof device, 'object' );

      let api = '/get-test', event = false, watch = false;
      let eventName = device.id + api + event + watch;

      device.api(api).get(function(err, result){
        assert.strictEqual( err, null);
        assert.strictEqual( result.test, 'passed');
        done();
      });

    });
    it('should execute callback if a valid data with error is returned', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(300);
      assert.strictEqual( typeof device, 'object' );

      let api = 'test-fail', event = false, watch = false;
      let eventName = device.id + api + event + watch;

      device.channel(api).get(function(err, result){ 
        assert.strictEqual( result, null);
        assert.strictEqual( err.message, 'fail');
        done();
      });

    });
  });
  describe('Test a local device object property - api().post()', function () {
    it('should throw an error if post payload is not provided', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );
      try{
        device.channel('/post-api').post();
      }
      catch(e){
        assert.strictEqual( e.message, 'invalid arguments');
        done();
      }
    });
    it('should create an object if all arguments are provided', function (done) {

      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );

      let api = '/post-test', event = false, watch = false;
      let eventName = device.id + api + event + watch;

      device.channel(api).post({body:'test'},function(err, result){
        assert.notStrictEqual( result, null);
        assert.strictEqual( result.test, 'passed');
        done();
      });

    });
    it('should execute callback if a valid data with error is returned', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(200);
      assert.strictEqual( typeof device, 'object' );

      let api = 'fail', event = false, watch = false;
      let eventName = device.id + api + event + watch;

      device.api(api).post({body:'test'}, function(err, result){ 
        assert.strictEqual( result, null);
        assert.strictEqual( err.message, 'fail');
        done();
      });

    });
    it('should post payload even w/o a callback argument', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );

      try{
        device.channel('/post-api').post('test');
      }
      catch(e){
        throw 'invalid test';
      }
      done();
    });
  });
  describe('Test a local device object property - gpio()', function () {
    it('should throw an error if .gpio() argument type is a string', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );
      try{
        device.gpio('33').on(0);
      }
      catch(e){
        assert.strictEqual( e.message, 'invalid arguments');
        done();
      }
    });
    it('should throw an error if .gpio().on() argument is missing a mode property', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );
      try{
        device.gpio({pin:33}).on(0);
      }
      catch(e){
        assert.strictEqual( e.message, 'invalid arguments');
        done();
      }
    });
    it('should throw an error if .gpio() argument mode property is invalid', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );
      try{
        device.gpio({mode:'watch', pin:33}).on();
      }
      catch(e){
        assert.strictEqual( e.message, 'invalid arguments');
        done();
      }
    });
    it('should throw an error if .gpio().on() argument is missing a pin property', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );
      try{
        device.gpio({mode:'output'}).on();
      }
      catch(e){
        assert.strictEqual( e.message, 'invalid arguments');
        done();
      }
    });
    it('should process .gpio().on() if argument is valid', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );

      try{
        device.gpio({mode:'output', pin:33}).on(0);
      }
      catch(e){
        throw 'invalid test';
      }
      done();
    });
    it('should throw an error if .gpio().off() argument is missing a mode property', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );
      try{
        device.gpio({pin:33}).off();
      }
      catch(e){
        assert.strictEqual( e.message, 'invalid arguments');
        done();
      }
    });
    it('should throw an error if .gpio().off() argument is missing a pin property', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );
      try{
        device.gpio({mode:'output'}).off();
      }
      catch(e){
        assert.strictEqual( e.message, 'invalid arguments');
        done();
      }
    });
    it('should process .gpio().off() if argument is valid', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );

      try{
        device.gpio({mode:'output', pin:33}).off(1);
      }
      catch(e){
        throw new Error('invalid test');
      }
      done();
    });
    it('should process output .gpio().state(cb) if argument is valid', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );

      let callback = function(err, result){
        assert.notStrictEqual( result, null);
      }

      try{
        device.gpio({mode:'output', pin:33}).state(callback);
      }
      catch(e){
        throw new Error('invalid test');
      }
      done();
    });
    it('should execute output .gpio().on() callback if a valid data with error is returned', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );

      let pin = 13; _pid = 'gpio-output-on';
      let eventName = device.id + _pid + pin + false + false;

      device.gpio({mode:'output', pin:pin}).on(function(err, result){ 
        assert.strictEqual( result, null);
        assert.strictEqual( err.message, 'fail');
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin, _pid:_pid, output:true, error:'fail' });
    });
    it('should execute output .gpio().on() callback if gpio output state is true or ON', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(200);
      assert.strictEqual( typeof device, 'object' );

      let pin = 13; _pid = 'gpio-output-on';
      let eventName = device.id + _pid + pin + false + false;

      device.gpio({mode:'output', pin:pin}).on(function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result, true);
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin, _pid:_pid,  output:true, state:true });
    });
    it('should execute output .gpio().off() callback if gpio output state is false or OFF', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(300);
      assert.strictEqual( typeof device, 'object' );

      let pin = 15; _pid = 'gpio-output-off';
      let eventName = device.id + _pid + pin + false + false;

      device.gpio({mode:'output', pin:pin}).off(function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result, false);
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin, _pid:_pid,  output:true, state:false });
    });
    it('should execute output .gpio().state() callback if a valid data with error is returned', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );

      let pin = 13; _pid = 'gpio-output-state';
      let eventName = device.id + _pid + pin + false + false;

      device.gpio({mode:'output', pin:pin}).state(function(err, result){ 
        assert.strictEqual( result, null);
        assert.strictEqual( err.message, 'fail');
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin, _pid:_pid, output:true, error:'fail' });
    });
    it('should execute output .gpio().state() callback if a valid data is rcvd', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(200);
      assert.strictEqual( typeof device, 'object' );

      let pin = 13; _pid = 'gpio-output-state';
      let eventName = device.id + _pid + pin + false + false;

      device.gpio({mode:'output', pin:pin}).state(function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result, true);
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin, _pid:_pid,  output:true, state:true });
    });
    it('should execute output gpio().getState() callback and return the passed error argument', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(300);
      assert.strictEqual( typeof device, 'object' );

      let pin = 15; _pid = 'gpio-output-state';
      let eventName = device.id + _pid + pin + false + false;

      device.gpio({mode:'output', pin:pin}).getState(function(err, result){ 
        assert.strictEqual( result, null);
        assert.strictEqual( err.message, 'fail');
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin, _pid:_pid, output:true, error:'fail' });

    });
    it('execute output gpio().getState() callback for valid data', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(400);
      assert.strictEqual( typeof device, 'object' );

      let pin = 13; _pid = 'gpio-output-state';
      let eventName = device.id + _pid + pin + false + false;

      device.gpio({mode:'output', pin:pin}).getState(function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result, true);
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin, _pid:_pid,  output:true, state:true });
    });

    it('process input.gpio().state() if argument is valid', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(150);
      assert.strictEqual( typeof device, 'object' );

      let callback = function(err, state){
        assert.strictEqual(err, null);
        assert.strictEqual(state, true);
        done();
      }
      let pin = 33; _pid = 'gpio-input-state';
      let eventName = device.id + _pid + pin + false + false;
      try{
        device.gpio({mode:'input', pin:33}).state(callback);
      }
      catch(e){
        throw new Error('invalid test');
      }
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin, _pid:_pid, input:'state', state:true });

    });
    it('should execute input .gpio().state() callback if a valid data with error is returned', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(200);
      assert.strictEqual( typeof device, 'object' );

      let pin = 13; _pid = 'gpio-input-state';
      let eventName = device.id + _pid + pin + false + false;

      device.gpio({mode:'input', pin:pin}).state(function(err, result){ 
        assert.strictEqual( result, null);
        assert.strictEqual( err.message, 'fail');
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin, _pid:_pid, input:true, error:'fail' });
    });
    it('execute input .gpio().state() callback for valid data', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(300);
      assert.strictEqual( typeof device, 'object' );

      let pin = 13; _pid = 'gpio-input-state';
      let eventName = device.id + _pid + pin + false + false;

      device.gpio({mode:'input', pin:pin}).state(function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result, true);
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin, _pid:_pid, input:true, state:true });
    });
    it('execute input gpio().getState() callback and return an error argument for invalid data', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(400);
      assert.strictEqual( typeof device, 'object' );

      let pin = 13; _pid = 'gpio-input-state';
      let eventName = device.id + _pid + pin + false + false;

      device.gpio({mode:'input', pin:pin}).getState(function(err, result){ 
        assert.strictEqual( result, null);
        assert.strictEqual( err.message, 'test-fail');
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin,  _pid:_pid, input:true, error:'test-fail' });
    });
    it('execute input gpio().getState() callback if returned data is valid', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(500);
      assert.strictEqual( typeof device, 'object' );

      let pin = 13; _pid = 'gpio-input-state';
      let eventName = device.id + _pid + pin + false + false;

      device.gpio({mode:'input', pin:pin}).getState(function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result, true);
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin,  _pid:_pid, input:true, state:true });
    });

    it('execute input gpio().watch() callback for valid returned data', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );

      let pin = 11, _pid = 'gpio-input';
      let eventName = device.id + _pid + pin + true + true;

      device.gpio({mode:'input', pin:pin}).watch(function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result, false);
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin,  _pid:_pid, input:true, state:false });
    });

    it('execute input gpio().unwatch() callback and return the result argument as true for valid watch pin', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );

      let pin = 11, _pid = 'gpio-input';
      let eventName = device.id + _pid + pin + false + 'undefined';

      device.gpio({mode:'input', pin:pin}).unwatch(function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result, true);
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin, unwatch:true, _pid:_pid, input:true, state:true });
    });
    it('execute input gpio().unwatch() callback and return the error argument as "invalid pin" for invalid watch pin', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );

      let pin = 11, _pid = 'gpio-input';
      let eventName = device.id + _pid + pin + false + 'undefined';

      device.gpio({mode:'input', pin:pin}).unwatch(function(err, result){ 
        assert.strictEqual( err.message, 'invalid input');
        assert.strictEqual( result, null);
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin, unwatch:true, _pid:_pid, error:'invalid input', input:true, state:false });
    });
  });
  describe('Test a local device object property - device.in()', function () {
    it('should throw an error if in().state() callback argument is missing', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );
      try{
        device.in(13).state();
      }
      catch(e){
        assert.strictEqual( e.message, 'callback argument is required');
        done();
      }
    });
    it('execute in().getState() callback if gpio input state is valid', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(200);
      assert.strictEqual( typeof device, 'object' );

      let pin = 11; _pid = 'gpio-input-state';
      let eventName = device.id + _pid + pin + false + false;

      device.in(pin).getState(function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result, true);
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin,  _pid:_pid, input:true, state:true });
    });
    it('execute in().watch() callback if gpio input pin is valid pin', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(300);
      assert.strictEqual( typeof device, 'object' );

      let pin = 15, _pid = 'gpio-input';
      let eventName = device.id + _pid + pin + true + true;

      device.in(pin).watch(function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result, false);
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin,  _pid:_pid, input:true, state:false });
    });
    it('execute in().watch(i) callback if gpio input watch interval is provided', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(300);
      assert.strictEqual( typeof device, 'object' );

      let pin = 13, _pid = 'gpio-input';
      let eventName = device.id + _pid + pin + true + true;

      device.in(pin).watch(100, function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result, false);
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin,  _pid:_pid, input:true, state:false });
    });
    it('execute in().watch(i) callback if gpio input watch argument is an object w/ property interval', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(300);
      assert.strictEqual( typeof device, 'object' );

      let pin = 19, _pid = 'gpio-input';
      let eventName = device.id + _pid + pin + true + true;

      device.in(pin).watch({interval:100}, function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result, false);
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin,  _pid:_pid, input:true, state:false });
    });
    it('execute in().watch(i) callback if gpio input watch argument is an object w/ property poll', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(300);
      assert.strictEqual( typeof device, 'object' );

      let pin = 11, _pid = 'gpio-input';
      let eventName = device.id + _pid + pin + true + true;

      device.in(pin).watch({poll:100}, function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result, false);
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin,  _pid:_pid, input:true, state:false });
    });
    it('execute in().watch(i) callback w/ error if argument{string) is invalid', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(200);
      assert.strictEqual( typeof device, 'object' );

      let pin = 13, _pid = 'gpio-input';
      let eventName = device.id + _pid + pin + true + true;

      try{
        device.in(pin).watch('100', function(err, result){}); 
      }
			catch(e){
				assert.strictEqual(e.message, 'invalid arguments');
				done();
      }
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin,  _pid:_pid, input:true, state:false });

    });
    it('execute in().unwatch() callback and return the result argument as true if watch pin is valid', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(300);
      assert.strictEqual( typeof device, 'object' );

      let pin = 15, _pid = 'gpio-input';
      let eventName = device.id + _pid + pin + false + 'undefined';

      device.in(pin).unwatch(function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result, true);
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin, unwatch:true, _pid:_pid, input:true, state:false });
    });
    it('execute in().unwatch() callback and return the error argument as "invalid pin" for invalid watch pin', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(300);
      assert.strictEqual( typeof device, 'object' );

      let pin = 15, _pid = 'gpio-input';
      let eventName = device.id + _pid + pin + false + 'undefined';

      device.in(pin).unwatch(function(err, result){ 
        assert.strictEqual( err.message, 'invalid input');
        assert.strictEqual( result, null);
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin, unwatch:true, _pid:_pid, error:'invalid input', input:true, state:false });
    });
  });
  describe('Test a local device object property - device.out()', function () {
    it('should throw an error if out().state() callback argument is missing', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(200);
      assert.strictEqual( typeof device, 'object' );
      try{
        device.out(33).state();
      }
      catch(e){
        assert.strictEqual( e.message, 'callback argument is required');
        done();
      }
    });
    it('should throw an error if out().getState() callback argument is missing', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(200);
      assert.strictEqual( typeof device, 'object' );
      try{
        device.out(33).getState();
      }
      catch(e){
        assert.strictEqual( e.message, 'callback argument is required');
        done();
      }
    });
    it('process out().on() if pin argument is valid', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );

      try{
        device.out(33).on();
      }
      catch(e){
        throw new Error('invalid test');
      }
      done();
    });
    it('process out().off() if pin argument is valid', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );

      try{
        device.out(33).off();
      }
      catch(e){
        throw new Error('invalid test');
      }
      done();
    });
    it('execute out().on() callback if a valid data with error is returned', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );

      let pin = 13; _pid = 'gpio-output-on';
      let eventName = device.id + _pid + pin + false + false;

      device.out(pin).on(function(err, result){ 
        assert.strictEqual( result, null);
        assert.strictEqual( err.message, 'fail');
        done();
      });
      
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin, _pid:_pid, output:true, error:'fail' });
    });
    it('execute out().on() callback if a gpio output is true or ON', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(200);
      assert.strictEqual( typeof device, 'object' );

      let pin = 13; _pid = 'gpio-output-on';
      let eventName = device.id + _pid + pin + false + false;

      device.out(pin).on(function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result, true);
        done();
      });
      
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin, _pid:_pid,  output:true, state:true });
    });
    it('execute out().off() callback if a gpio output is false or OFF', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );

      let pin = 35; _pid = 'gpio-output-off';
      let eventName = device.id + _pid + pin + false + false;

      device.out(pin).off(function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result, false);
        done();
      });
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin, _pid:_pid,  output:true, state:false });
    });
    it('execute out().on(t) callback if a delay time is provided and a gpio output is true or ON', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(200);
      assert.strictEqual( typeof device, 'object' );

      let pin = 13; _pid = 'gpio-output-on';
      let eventName = device.id + _pid + pin + false + false;

      device.out(pin).on(100, function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result, true);
        done();
      });
      
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin, _pid:_pid,  output:true, state:true });
    });
    it('execute out().off(t) callback if a delay time is provided and gpio output is false or OFF', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      let device = client.accessDevice(100);
      assert.strictEqual( typeof device, 'object' );

      let pin = 35; _pid = 'gpio-output-off';
      let eventName = device.id + _pid + pin + false + false;

      device.out(pin).off(100, function(err, result){ 
        assert.strictEqual( err, null);
        assert.strictEqual( result, false);
        done();
      });
      
      m2mTest.testEmitter.emit(eventName, { id:device.id, pin:pin, _pid:_pid,  output:true, state:false });
    });
  });
  describe('Connecting to remote server', function () {
    it('should throw an error if arguments provided is invalid', function () {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );

      try{
        client.connect(function(){}); 
      	client.accessDevice(100, 200);
      }
			catch(e){
        assert.strictEqual( e.message, 'access id more than 1 must be contained in an array' );
        
      }
    });
    // no test coverage improvement
    it('should throw an error if argument is not an integer', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );
			client.connect(function(err, result){});

      let count = 0;
	    try{
	      let device = client.accessDevice(100.5);
	    }
			catch(e){
				assert.strictEqual( e.message, 'server id must be an integer number' );
        if(count === 0){
	      	done();count++;
        }
	    }
    });
    it('should throw an error if 1st argument is a string w/o a callback', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );
      try{
        client.connect('https://www.node-m2m.com');
      }
      catch(e){
        assert.strictEqual( e.message, 'invalid arguments');
        done();
      }
    });
    it('should throw an error if 1st argument is an object w/o a callback', function (done) {
      const client = new m2m.Client();
      assert.strictEqual( typeof client, 'object' );
      try{
        client.connect({server:'https://www.node-m2m.com'});
      }
      catch(e){
        assert.strictEqual( e.message, 'invalid arguments');
        done();
      }
    });
    it('start connecting if the connect method 1st argument is a string w/ a callback', function (done) {
      const client = new m2m.Client();
      let count = 0;
      assert.strictEqual( typeof client, 'object' );
      let callback = function(err, result){
        if(count === 0 && result === 'success'){
					done(); count++;
        }
      }
      client.connect('https://www.node-m2m.com', callback);
    });
    it('start connecting if the connect meyhod 1st argument is an object and a callback is provided', function (done) {
      const client = new m2m.Client();

      assert.strictEqual( typeof client, 'object' );
      let callback = function(err, result){
        assert.strictEqual( err, null );
        assert.strictEqual( result, 'success' );
				done();
      }
      client.connect({server:'https://www.node-m2m.com'}, callback);
    });
    it('start connecting if connect has only a callback argument is provided', function (done) {
      const client = new m2m.Client();

      assert.strictEqual( typeof client, 'object' );
      let callback = function(err, result){
        assert.strictEqual( err, null );
        assert.strictEqual( result, 'success' );
				done();
      }
      client.connect(callback);
    });
  });
  describe('create a device object w/ setupInfo() w/o an error', function () {
    it('should return w/o an error object', function (done) {

      let spl = {id:'12ab8c92', appId:'12ab8c92', _pid:'r-a', m2mTest:true, app:true, src:'client', reg:true};
      m2mTest.enable(spl);

      const client = new m2m.Client();

      client.connect(function(err, result){

		    let device = client.accessDevice(200);

        device.setupInfo(function(err, data){
          if(err) throw err;
          assert.strictEqual(data, true);
          done();
    		});
  
      	try{
		    	m2mTest.testEmitter.emit(device.id + 'setupData', {id:device.id, _pid:'setupData', setupData:true});
				}
				catch(e){
					throw 'invalid test';
		    }

    	});
  	});
 	});
  describe('create a device object w/ setupInfo() w/ error', function () {
    it('should return w/ an error object', function (done) {

      const client = new m2m.Client();

      client.connect(function(err, result){

		    let device = client.accessDevice(200);

        device.setupInfo(function(err, data){
          if(err){
            assert.strictEqual(data, null);
            assert.strictEqual(err.message, 'invalid devices');
           	done();
          }
    		});
  
      	try{
		    	m2mTest.testEmitter.emit(device.id + 'setupData', {id:device.id, error:'invalid devices', _pid:'setupData', setupData:true, devices:[100, 200]});
				}
				catch(e){
					throw 'invalid test';
		    }

    	});
  	});
 	});
  describe('create a device object invoking device.setupInfo() w/o a callback', function () {
    it('should throw an error since callback is required', function (done) {

      const client = new m2m.Client();

      client.connect(function(err, result){

		    let device = client.accessDevice(200);
  
      	try{
          device.setupInfo();
				}
				catch(e){
          assert.strictEqual(e.message, 'callback is required');
					done();
		    }
    	});
  	});
 	});
  describe('create a client object invoking .getDevices() method', function () {
    it('should return the available devices', function (done) {
      let id = '12ab8c';
      let spl = {id:id, appId:id, _pid:'r-a', app:true, src:'client', reg:true};
      m2mTest.enable(spl);

      const client = new m2m.Client();

      client.connect(function(err, result){
        client.getDevices(function(err, devices){
    	    if(err) return console.error('getDevices err:', err);
    	    console.log('devices', devices);
          assert.strictEqual(Array.isArray(devices), true);
          done();
        });

        let eventName = id + 'getDevices';
        m2mTest.testEmitter.emit(eventName, {_pid:'getDevices', id:id, devices:[100, 200]});
    	});
   	});
 	});
  describe('create a client object invoking internal .getRegisteredDevices() method', function () { //Array.isArray([1, 2, 3])
    it('should return the available devices', function (done) {

      const { client } = require('../lib/client.js');
      const c1 = new m2m.Client();

      c1.connect(function(err, result){
        setTimeout(function(){
		    client.getRegisteredDevices(function(devices){
    	    console.log('devices', devices);
          assert.strictEqual(Array.isArray(devices), true);
          done();
        });
        }, dl);
    	});
  	});
 	});
  describe('create a client object invoking internal .setGetDeviceIdListener() method w/ valid data', function () {
    it('should accept the data internally if data is an integer or array', function () {
      const { client } = require('../lib/client.js');
      const c1 = new m2m.Client();

      c1.connect(function(err, result){
        assert.strictEqual( err, null );
        let eventName = 'getDeviceId';
        m2mTest.testEmitter.emit(eventName, [100, 200]);
        m2mTest.testEmitter.emit(eventName, 200);
        
    	});
   	});
 	});
  describe('create a client object invoking internal .getRemoteDevices() method w/ valid array data', function () {
    it('should return a valid id internally if array data is valid', function (done) {
      const { client } = require('../lib/client.js');
      const c1 = new m2m.Client();

      let count = 0;
      let rxd = {devices:[{id:100}, {id:200}, {id:300}]};
      c1.connect(function(err, result){
		    client.getRemoteDevices(rxd, function(id){
    	    console.log('id', id);
          assert.strictEqual(typeof id, 'number');
          setTimeout(function(){
            if(count === 0){
              done();count++;clientPassed++;
              exports.clientTotal = clientTotal;
              exports.clientPassed = clientPassed;
              exports.clientFailed = clientFailed;
            }
          }, dl + 25);
        });
    	});
   	});
 	});
});

});







