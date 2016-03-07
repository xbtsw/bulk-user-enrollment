var stringify = require('csv-stringify');
var chance = require('chance').Chance();
var fs = require('fs');
var argv = require('yargs')
  .usage('Usage: $0 [options]')
  .demand('t')
  .alias('t', 'total')
  .nargs('t', 1)
  .describe('t', 'Number of Students to generate')

  .demand('o')
  .alias('o', 'orgUnit')
  .nargs('o', 1)
  .describe('o', 'Target OrgUnit code')

  .demand('r')
  .alias('r', 'role')
  .nargs('r', 1)
  .describe('r', 'Enrolled role name')

  .help('h')
  .alias('h', 'help')
  .argv;

var existing = {};
var count = 0;
var create_data = [];
var enroll_data = [];

while (count < parseInt(argv.t)) {
  var first = chance.first();
  var last = chance.last();
  var key = first + last;
  if(existing.hasOwnProperty(key)){
    continue;
  }
  var email = key + '@test.com';
  existing[key] = 1;
  count ++;

  create_data.push(['CREATE', key, '', first, last, '', argv.r, '1', email]);
  enroll_data.push(['ENROLL', key, '', argv.r, argv.o]);
}

stringify(create_data, function(err, output){
  fs.writeFile('create.csv', output, function(){
    stringify(enroll_data, function(err, output){
      fs.writeFile('enroll.csv', output, function(){
        process.exit(0);
      });
    });
  });
});
