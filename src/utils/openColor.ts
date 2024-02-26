import Color from 'color';

const gray = [
  Color('#f8f9fa'),
  Color('#f1f3f5'),
  Color('#e9ecef'),
  Color('#dee2e6'),
  Color('#ced4da'),
  Color('#adb5bd'),
  Color('#868e96'),
  Color('#495057'),
  Color('#343a40'),
  Color('#212529'),
];

const red = [
  Color('#fff5f5'),
  Color('#ffe3e3'),
  Color('#ffc9c9'),
  Color('#ffa8a8'),
  Color('#ff8787'),
  Color('#ff6b6b'),
  Color('#fa5252'),
  Color('#f03e3e'),
  Color('#e03131'),
  Color('#c92a2a'),
];

const pink = [
  Color('#fff0f6'),
  Color('#ffdeeb'),
  Color('#fcc2d7'),
  Color('#faa2c1'),
  Color('#f783ac'),
  Color('#f06595'),
  Color('#e64980'),
  Color('#d6336c'),
  Color('#c2255c'),
  Color('#a61e4d'),
];

const grape = [
  Color('#f8f0fc'),
  Color('#f3d9fa'),
  Color('#eebefa'),
  Color('#e599f7'),
  Color('#da77f2'),
  Color('#cc5de8'),
  Color('#be4bdb'),
  Color('#ae3ec9'),
  Color('#9c36b5'),
  Color('#862e9c'),
];

const violet = [
  Color('#f3f0ff'),
  Color('#e5dbff'),
  Color('#d0bfff'),
  Color('#b197fc'),
  Color('#9775fa'),
  Color('#845ef7'),
  Color('#7950f2'),
  Color('#7048e8'),
  Color('#6741d9'),
  Color('#5f3dc4'),
];

const indigo = [
  Color('#edf2ff'),
  Color('#dbe4ff'),
  Color('#bac8ff'),
  Color('#91a7ff'),
  Color('#748ffc'),
  Color('#5c7cfa'),
  Color('#4c6ef5'),
  Color('#4263eb'),
  Color('#3b5bdb'),
  Color('#364fc7'),
];

const blue = [
  Color('#e7f5ff'),
  Color('#d0ebff'),
  Color('#a5d8ff'),
  Color('#74c0fc'),
  Color('#4dabf7'),
  Color('#339af0'),
  Color('#228be6'),
  Color('#1c7ed6'),
  Color('#1971c2'),
  Color('#1864ab'),
];

const cyan = [
  Color('#e3fafc'),
  Color('#c5f6fa'),
  Color('#99e9f2'),
  Color('#66d9e8'),
  Color('#3bc9db'),
  Color('#22b8cf'),
  Color('#15aabf'),
  Color('#1098ad'),
  Color('#0c8599'),
  Color('#0b7285'),
];

const teal = [
  Color('#e6fcf5'),
  Color('#c3fae8'),
  Color('#96f2d7'),
  Color('#63e6be'),
  Color('#38d9a9'),
  Color('#20c997'),
  Color('#12b886'),
  Color('#0ca678'),
  Color('#099268'),
  Color('#087f5b'),
];

const green = [
  Color('#ebfbee'),
  Color('#d3f9d8'),
  Color('#b2f2bb'),
  Color('#8ce99a'),
  Color('#69db7c'),
  Color('#51cf66'),
  Color('#40c057'),
  Color('#37b24d'),
  Color('#2f9e44'),
  Color('#2b8a3e'),
];

const lime = [
  Color('#f4fce3'),
  Color('#e9fac8'),
  Color('#d8f5a2'),
  Color('#c0eb75'),
  Color('#a9e34b'),
  Color('#94d82d'),
  Color('#82c91e'),
  Color('#74b816'),
  Color('#66a80f'),
  Color('#5c940d'),
];

const yellow = [
  Color('#fff9db'),
  Color('#fff3bf'),
  Color('#ffec99'),
  Color('#ffe066'),
  Color('#ffd43b'),
  Color('#fcc419'),
  Color('#fab005'),
  Color('#f59f00'),
  Color('#f08c00'),
  Color('#e67700'),
];

const orange = [
  Color('#fff4e6'),
  Color('#ffe8cc'),
  Color('#ffd8a8'),
  Color('#ffc078'),
  Color('#ffa94d'),
  Color('#ff922b'),
  Color('#fd7e14'),
  Color('#f76707'),
  Color('#e8590c'),
  Color('#d9480f'),
];

export const openColor = {
  gray,
  red,
  pink,
  grape,
  violet,
  indigo,
  blue,
  cyan,
  teal,
  green,
  lime,
  yellow,
  orange,
};

export const txColor = {
  gray: [openColor.gray[1], openColor.gray[3], openColor.gray[5], openColor.gray[7], openColor.gray[9]],
  red: [openColor.red[1], openColor.red[3], openColor.red[5], openColor.red[7], openColor.red[9]],
  pink: [openColor.pink[1], openColor.pink[3], openColor.pink[5], openColor.pink[7], openColor.pink[9]],
  grape: [openColor.grape[1], openColor.grape[3], openColor.grape[5], openColor.grape[7], openColor.grape[9]],
  violet: [openColor.violet[1], openColor.violet[3], openColor.violet[5], openColor.violet[7], openColor.violet[9]],
  indigo: [openColor.indigo[1], openColor.indigo[3], openColor.indigo[5], openColor.indigo[7], openColor.indigo[9]],
  blue: [openColor.blue[1], openColor.blue[3], openColor.blue[5], openColor.blue[7], openColor.blue[9]],
  cyan: [openColor.cyan[1], openColor.cyan[3], openColor.cyan[5], openColor.cyan[7], openColor.cyan[9]],
  teal: [openColor.teal[1], openColor.teal[3], openColor.teal[5], openColor.teal[7], openColor.teal[9]],
  green: [openColor.green[1], openColor.green[3], openColor.green[5], openColor.green[7], openColor.green[9]],
  lime: [openColor.lime[1], openColor.lime[3], openColor.lime[5], openColor.lime[7], openColor.lime[9]],
  yellow: [openColor.yellow[1], openColor.yellow[3], openColor.yellow[5], openColor.yellow[7], openColor.yellow[9]],
  orange: [openColor.orange[1], openColor.orange[3], openColor.orange[5], openColor.orange[7], openColor.orange[9]],
};

export const bgColor = {
  gray: [openColor.gray[0], openColor.gray[2], openColor.gray[4], openColor.gray[6], openColor.gray[8]],
  red: [openColor.red[0], openColor.red[2], openColor.red[4], openColor.red[6], openColor.red[8]],
  pink: [openColor.pink[0], openColor.pink[2], openColor.pink[4], openColor.pink[6], openColor.pink[8]],
  grape: [openColor.grape[0], openColor.grape[2], openColor.grape[4], openColor.grape[6], openColor.grape[8]],
  violet: [openColor.violet[0], openColor.violet[2], openColor.violet[4], openColor.violet[6], openColor.violet[8]],
  indigo: [openColor.indigo[0], openColor.indigo[2], openColor.indigo[4], openColor.indigo[6], openColor.indigo[8]],
  blue: [openColor.blue[0], openColor.blue[2], openColor.blue[4], openColor.blue[6], openColor.blue[8]],
  cyan: [openColor.cyan[0], openColor.cyan[2], openColor.cyan[4], openColor.cyan[6], openColor.cyan[8]],
  teal: [openColor.teal[0], openColor.teal[2], openColor.teal[4], openColor.teal[6], openColor.teal[8]],
  green: [openColor.green[0], openColor.green[2], openColor.green[4], openColor.green[6], openColor.green[8]],
  lime: [openColor.lime[0], openColor.lime[2], openColor.lime[4], openColor.lime[6], openColor.lime[8]],
  yellow: [openColor.yellow[0], openColor.yellow[2], openColor.yellow[4], openColor.yellow[6], openColor.yellow[8]],
  orange: [openColor.orange[0], openColor.orange[2], openColor.orange[4], openColor.orange[6], openColor.orange[8]],
};
