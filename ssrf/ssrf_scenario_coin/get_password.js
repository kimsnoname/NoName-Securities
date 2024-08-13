var AWS = require('aws-sdk');
var fs = require('fs');
var ursa = require('ursa');

var pem = fs.readFileSync('adminKey.pem');
var pkey = ursa.createPrivateKey(pem);

var ec2 = new AWS.EC2();
ec2.getPasswordData({InstanceId: 'i-013f5ae34d62a5df4'}, function (err, data) {
  if (data) {
    var password = pkey.decrypt(data.PasswordData, 'base64', 'utf8', ursa.RSA_PKCS1_PADDING);
    console.log("Password is", password);
  } else {
    console.log("Could not get the encrypted password");
  }
});