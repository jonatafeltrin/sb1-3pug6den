const { execSync } = require('child_process');

const versions = {
  production: [
    {
      name: 'Version 1.0.20',
      env: {
        VERSION: '1.0.20',
        VERSION_CODE: 20,
        BUILD_NUMBER: 20,
      },
    },
  ],
  preview: [
    { 
      name: 'Version ',
      env: {
        VERSION: '1.0.20',
        BUILD_NUMBER: '20',
        VERSION_CODE: 20,
      },
    },
  ],
};

const args = process.argv.slice(2);

const branch = args[0];
const message = args[1]?.replace(/\n/g, ' ') || 'Default update message';
const platform = 'all';

if (!branch) {
  console.error('É necessário informar uma branch');
  process.exit(1);
}

const versionsToUpdate = versions[branch];

if (!versionsToUpdate) {
  console.error(`Não foi possível encontrar as versões para atualizar a branch ${branch}`);
  process.exit(1);
}

versionsToUpdate.forEach((version) => {
  const { VERSION, BUILD_NUMBER, VERSION_CODE } = version.env;

  if (!VERSION || !BUILD_NUMBER || !VERSION_CODE) {
    console.error(`Não foi possível atualizar a versão pois faltam informações`);
    console.info('Informações recebidas: ');
    console.table({ VERSION, BUILD_NUMBER, VERSION_CODE });
    return;
  }

  console.log('=========== UPDATING ===========');
  console.table({
    branch,
    message,
    platform,
    VERSION,
    BUILD_NUMBER,
    VERSION_CODE,
  });
  console.log('==========================');
  execSync(`npx eas-cli update --branch ${branch} --message "${message}"`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      ...version.env,
      BRANCH: branch,
    },
  });
  console.log(
    `Updated successfully: branch: ${branch} | version: ${VERSION} | platform: ${platform}`,
  );
});
