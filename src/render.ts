import { Cell, Renderer, Sprite, SpriteMap } from './models';
import fs from 'fs';
import {
  loadDungeon,
  multiplyDungeonSize,
  contract,
  expandDungeon,
  randomize,
  seed,
} from './utils';
import {
  processWalls,
  processSurround,
  processPlateau,
  processInset,
  processGround,
} from './operations';
import { processBoulders } from './operations/processBoulders';
import { randomInt } from 'crypto';
import Web3 from 'web3';
import abi from './abi.json';
import FormData from 'form-data';
import dungeonsAbi from './dungeonsAbi.json';
import infuraUrl from './infura.ignore.js';
import upload from './upload';

seed(6969);

const spriteMap = new SpriteMap({
  floor: {
    v0: [1, 7],
    v1: [2, 7],
    v2: [1, 8],
    v3: [2, 8],
    v4: [1, 5],
    v5: [1, 4],
  },
  insetFill: {
    v0: [5, 8],
  },
  inset: {
    v0: [1, 6],
    t: [1, 6],
    tr: [3, 6],
    r: [3, 7],
    br: [3, 9],
    b: [1, 9],
    bl: [0, 9],
    l: [0, 7],
    tl: [0, 6],
    ctr: [3, 5],
    ctl: [2, 5],
    cbr: [2, 4],
    cbl: [3, 4],
  },
  ground: {
    v0: [0, 21],
    v1: [1, 21],
    v2: [2, 21],
    v3: [0, 22],
    v4: [1, 22],
    v5: [2, 22],
    v6: [0, 23],
    v7: [1, 23],
    v8: [2, 23],
  },
  surround: {
    v0: [4, 22],
    v1: [3, 19],
    v2: [3, 20],
    v3: [4, 20],
    v4: [5, 19],
    t: [4, 21],
    tr: [5, 21],
    r: [5, 22],
    br: [5, 23],
    b: [4, 23],
    bl: [3, 23],
    l: [3, 22],
    tl: [3, 21],
  },
  wall: {
    XXXX: [1, 10],
    TXXX: [6, 13],
    XTXX: [5, 12],
    XXTX: [6, 11],
    XXXT: [7, 12],
    XXTT: [2, 12],
    XTXT: [1, 12],
    XTTX: [0, 12],
    TXXT: [2, 14],
    TXTX: [2, 13],
    TTXX: [0, 13],
    XTTT: [4, 10],
    TXTT: [5, 11],
    TTXT: [4, 11],
    TTTX: [5, 10],
    TTTT: [6, 12],
  },
  point: { v0: [0, 11] },
  door: {
    v0: [2, 15],
    v1: [3, 15],
    v2: [8, 13],
    v3: [9, 13],
  },
  rock: {
    v0: [9, 21],
    v1: [9, 22],
    v2: [9, 23],
  },
  plateau: {
    v0: [1, 19],
    v1: [0, 16],
    v2: [0, 17],
    v3: [1, 16],
    v4: [1, 17],
    v5: [4, 16],
    t: [1, 18],
    tr: [2, 18],
    r: [2, 19],
    br: [2, 20],
    b: [1, 20],
    bl: [0, 20],
    l: [0, 19],
    tl: [0, 18],
    ctr: [3, 17],
    ctl: [2, 17],
    cbr: [2, 16],
    cbl: [3, 16],
  },
  boulder: {
    v0: [11, 20],
    v0_2x2_tl: [10, 20],
    v0_2x2_tr: [11, 20],
    v0_2x2_br: [11, 21],
    v0_2x2_bl: [10, 21],
    v1_2x2_tl: [10, 22],
    v1_2x2_tr: [11, 22],
    v1_2x2_br: [11, 23],
    v1_2x2_bl: [10, 23],
    v0_h_tl: [8, 14],
    v0_h_bl: [8, 15],
    v0_h_t0: [9, 14],
    v0_h_b0: [9, 15],
    v0_h_t1: [10, 14],
    v0_h_b1: [10, 15],
    v0_h_tr: [11, 14],
    v0_h_br: [11, 15],

    v0_v_tl: [10, 16],
    v0_v_tr: [11, 16],
    v0_v_l0: [10, 17],
    v0_v_r0: [11, 17],
    v0_v_l1: [10, 18],
    v0_v_r1: [11, 18],
    v0_v_bl: [10, 19],
    v0_v_br: [11, 19],
  },
});


const web3 = new Web3(
  new Web3.providers.HttpProvider(
    infuraUrl
  ),
);

/**
 *
        "Desert Oasis",
        "Stone Temple",
        "Forest Ruins",
        "Mountain Deep",
        "Underwater Keep",
        "Ember's Glow"
 *
 * */

const mapEnvToName = {
  0: 'Desert Oasis',
  1: 'Stone Temple',
  2: 'Forest Ruins',
  3: 'Mountain Deep',
  4: 'Underwater Keep',
  5: "Ember's Glow",
  6: 'Ghoul Underworld',
};

const dungeonsAddress = '0x86f7692569914B5060Ef39aAb99e62eC96A6Ed45';
const dungeons = new web3.eth.Contract(abi as any, dungeonsAddress);

const heroDungeons = {
  rinkeby: '0xb47Bb43Ceab0f1c6B15b7b9E4ff0A4488F0B79E7',
  mainnet: '0xAc9E2e3914cC86E026fDBc94074E82914FD468a9',
};

async function run() {
  // load dungeon from scraped text file and process, print as ASCII
  const heroesContract = new web3.eth.Contract(
    dungeonsAbi as any,
    heroDungeons['mainnet'],
  );
  const balance = await heroesContract.methods.totalSupply().call();
  console.log(`
    Creating images for ${balance.toString()} dungeons
  `);
  for (let i = 56; i <= +balance; i++) {
    const tokenId = await heroesContract.methods
      .getValidDungeon(await heroesContract.methods.seeds(i).call())
      .call();
    console.log('rendering', i);
    // Methods switched in contract
    const doors = await dungeons.methods.getNumPoints(tokenId).call();
    const points = await dungeons.methods.getNumDoors(tokenId).call();
    const mapName = await heroesContract.methods.getName(i).call();
    let env = await heroesContract.methods.getEnvironment(i).call();

    const name = mapEnvToName[env];
    const base = loadDungeon(tokenId);
    const dungeon = base.process(
      multiplyDungeonSize(3),
      contract('door', new Cell(new Sprite('floor'))),
      contract('point', new Cell(new Sprite('floor'))),
      expandDungeon(Math.ceil(base.width / 2)),
      processWalls,
      processSurround,
      processPlateau,
      processInset,
      processBoulders,
      processGround,
      randomize('floor', 3),
      randomize('door', 3),
    );

    // render dungeon to png
    const renderer = new Renderer(dungeon, spriteMap, env);
    const data = await renderer.render(`tmp/${i}.png`);
    const formData = new FormData();

    formData.append('file', data, {
      contentType: 'image/png',
    });
    const res = await upload(formData);

    const image = `ipfs://${res.Hash}`;

    fs.writeFileSync(
      `tmp/${i}.json`,
      JSON.stringify(
        {
          name: `#${i} - ${mapName}`,
          image,
          description: `Play your Hero in the Dungeons! Fight Rats, Skeletons, and the Hordes! Get Gold, Experience, and Loot! Beat Merlin's Challenge ...and later... Save the kingdom!\n\nDungeons are a set of 3,333 programatically generated dungeon maps based on the on-chain data from Crypts and Caverns to be played in the Heroes universe.\n\nThis Dungeon is based on Crypts and Caverns #${tokenId}.`,
          attributes: [
            { trait_type: 'Doors', value: `${doors}` },
            { trait_type: 'Points of Interest', value: `${points}` },
            { trait_type: 'Environment', value: name },
          ],
        },
        void 0,
        2,
      ),
    );
  }
}

run()
  .then(() => {
    console.log('DONE');
  })
  .catch(e => {
    console.log(e);
  });
