const yammerkvs = require('./index');

console.log(yammerkvs.config.set({Prefix: 'MODIFY_'}));

async function test() {
  // const data = await yammerkvs.update.single({
  //   'TEST': 'OK'
  // });

  // const data = await yammerkvs.read.single('TEST');

  // const data = await yammerkvs.read.multiple([
  //   'TEST',
  //   'TEST2'
  // ]);

  const data = await yammerkvs.update.multiple({
    TEST: 'OK3',
    TEST2: 'OK3'
  })
  console.log(data);
}

test()