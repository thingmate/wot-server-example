const $path = require('path');
const $fs = require('fs/promises');
const { spawn } = require('child_process');

const ROOT_PATH = $path.join(__dirname, './');
const NODE_MODULES_PATH = $path.join(ROOT_PATH, 'node_modules');

function readPackageJSON(
  directoryPath,
) {
  return $fs.readFile($path.join(directoryPath, 'package.json'), { encoding: 'utf8' })
    .then((content) => {
      return JSON.parse(content);
    });
}

function writePackageJSON(
  directoryPath,
  content,
) {
  return $fs.writeFile($path.join(directoryPath, 'package.json'), JSON.stringify(content, null, 2), { encoding: 'utf8' });
}

function span$(
  file,
  args,
) {
  return new Promise((
    resolve,
    reject,
  ) => {
    console.log(`\x1b[32m${file}\x1b[33m ${args.join(' ')}\x1b[0m`);
    const cmd = spawn(file, args);

    cmd.stdout.pipe(process.stdout);
    cmd.stderr.pipe(process.stderr);

    cmd.on('error', reject);

    cmd.on('close', resolve);
  });
}

async function link(
  packageName,
  forceUpdate = false,
) {
  const localPath = ROOT_PATH;
  const localPackageJSON = await readPackageJSON(localPath);

  const linkedDependencies = new Set(localPackageJSON.linkedDependencies ?? []);

  if (!linkedDependencies.has(packageName) || forceUpdate) {
    const packagePath = $path.join(NODE_MODULES_PATH, packageName);

    await span$('yarn', ['link', packageName]);

    const realPath = await $fs.realpath(packagePath);

    await span$('rm', [packagePath]);
    await span$('cp', ['--recursive', '--dereference', realPath, packagePath]);


    const packageJSON = await readPackageJSON(packagePath);

    linkedDependencies.add(packageName);

    const newLocalPackageJSON = {
      ...localPackageJSON,
      // dependencies: {
      //   ...localPackageJSON.dependencies,
      //   [packageName]: packageJSON.version,
      // },
      linkedDependencies: [
        ...linkedDependencies,
      ],
    };

    await writePackageJSON(localPath, newLocalPackageJSON);
  }
}

async function unlink(
  packageName,
  forceUpdate = false,
) {
  const localPath = ROOT_PATH;
  const localPackageJSON = await readPackageJSON(localPath);

  const linkedDependencies = new Set(localPackageJSON.linkedDependencies ?? []);

  if (linkedDependencies.has(packageName) || forceUpdate) {
    const packagePath = $path.join(NODE_MODULES_PATH, packageName);
    await span$('rm', [packagePath]);

    linkedDependencies.delete(packageName);

    // delete localPackageJSON.dependencies[packageName];

    const newLocalPackageJSON = {
      ...localPackageJSON,
      linkedDependencies: [
        ...linkedDependencies,
      ],
    };

    await writePackageJSON(localPath, newLocalPackageJSON);
  }
}


async function update() {
  const localPath = ROOT_PATH;
  const localPackageJSON = await readPackageJSON(localPath);

  const linkedDependencies = Array.from(new Set(localPackageJSON.linkedDependencies ?? []));

  for (let i = 0; i < linkedDependencies.length; i++) {
    if (i > 0) {
      console.log(' ');
    }
    await link(linkedDependencies[i], true);
  }
}


async function run() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (cmd === 'link') {
    await link(args[1], args[2] === '--force');
  } else if (cmd === 'unlink') {
    await unlink(args[1], args[2] === '--force');
  } else if (cmd === 'update') {
    await update();
  } else {
    throw new Error(`Invalid command: ${cmd}`);
  }
}


run();
