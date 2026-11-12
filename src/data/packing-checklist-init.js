(function(){
'use strict';

var SEASONS = ['spring','summer','monsoon','postmonsoon','autumn','winter'];
var DESTS = ['spiti','kashmir','rajasthan','malvan'];
var SEASON_LABELS = {all:'All seasons', spring:'Spring', summer:'Summer', monsoon:'Monsoon', postmonsoon:'Post Monsoon', autumn:'Autumn', winter:'Winter'};
var DEST_LABELS = {spiti:'Spiti', kashmir:'Kashmir', rajasthan:'Rajasthan', malvan:'Malvan'};
var SECTIONS = [
  ['clothing','Clothing (Upper and Lower Body)'],
  ['footwear','Footwear'],
  ['gear','Accessories and Gear'],
  ['toiletries','Toiletries and Hygiene'],
  ['firstaid','First Aid and Medical Kit'],
  ['docs','Documents and Cash'],
  ['misc','Food and Other Items']
];

function I(t, req, tags, rent){ return {t:t, req:req || '', tags:tags || [], rent:!!rent}; }

function medNote(who){
  return 'Take only medicines that suit you. Check with your doctor first if you have an allergy or a health condition, and tell your ' + who + ' about any medicine you take.';
}

function meds(o){
  var a = [];
  if (o.diamox) a.push(I('Diamox, for altitude sickness. Take it only as your doctor advises'));
  a.push(I('Dolo 650, 5 tablets. This is paracetamol. It helps with fever and mild pain'));
  a.push(I('Avomine, 4 tablets. Carry it especially if you are prone to motion sickness. Take one half an hour before your road journey starts'));
  a.push(I('Combiflam, 5 tablets. A pain reliever that also contains paracetamol. Take one for a sudden twist of the leg or a muscle strain'));
  a.push(I('Digene, 4 tablets. Take one if the food you have eaten feels undigested'));
  a.push(I('Cetirizine, 4 tablets. Take one if you have a cold'));
  if (o.trek) a.push(I('ORS, 6 packs. Have one pack a day, usually at midday when you are in the middle of the trek. It replaces the salts you lose while trekking. Tip: it also makes cold water easier to drink'));
  else a.push(I('ORS, 6 packs. Have at least one pack a day. It replaces the salts you lose while travelling. Tip: it also makes cold water easier to drink'));
  if (o.pan) a.push(I('PAN 40, 4 tablets. For acid related stomach problems such as heartburn and acid reflux'));
  return a;
}

var REC = 'recommended';
var OPT = 'optional';

var DATA = {
  weekend: {
    label: 'Weekend Treks',
    seasons: ['summer','monsoon','postmonsoon','winter'],
    seasonLabels: {summer:'Summer and Pre Monsoon'},
    monthGuide: 'Summer and Pre Monsoon is March, April, May and early June. Monsoon is mid June, July, August and September. Post Monsoon is October and November. Winter is December, January and February. If your dates fall between two seasons, ask us before you buy anything.',
    sub: 'Sahyadri and Central India treks',
    leader: 'trek leader',
    facts: [['Trek length','2 to 3 days, plus 1 to 2 days of travel'],['Bags','A rucksack, and a small backpack for the trail'],['What matters most','Grip, water and rain protection']],
    intro: 'This is the list we send to everyone who registers for a Sahyadri or Central India trek. Short treks mean light bags, so carry what you need and not everything you have.',
    seasonNotes: {
      summer: 'These treks are hot and the sun is strong. Start early, drink water often and keep your Electral or glucose handy. A sun cap and sunscreen are good to have. Sudden showers are possible towards the end of the season.',
      monsoon: 'Trails are wet and slippery. A raincoat or poncho is required on monsoon treks, and shoes with a tractor grip are preferable. Keep your spare clothes and phone dry.',
      postmonsoon: 'The rains are over, but trails can still be damp and slippery early in the season. Days are warm and nights begin to cool, especially in November. Keep your jacket or windcheater handy.',
      winter: 'Mornings and nights get cold on hill tops, and overnight camps get the coldest. Our list asks for a jacket or windcheater. A warm jacket is the better choice, and the items marked recommended in winter will keep you comfortable.'
    },
    secNotes: {
      toiletries: 'These are not on the list we send, but most trekkers are glad to have them.',
      firstaid: 'Your personal medical kit must include the medicines below. ' + medNote('trek leader')
    },
    sections: {
      clothing: [
        I('Pairs of clothes, minimum 4'),
        I('Bandana'),
        I('Socks, 3 pairs'),
        I('Jacket or windcheater'),
        I('Raincoat or poncho','required for monsoon treks',['monsoon']),
        I('Fleece jacket or sweater, 1',REC + ' in winter',['winter']),
        I('Thermal inners, top and bottom, 1 set',REC + ' in winter',['winter']),
        I('Woollen cap that covers the ears',REC + ' in winter',['winter']),
        I('Gloves, 1 pair',REC + ' in winter',['winter']),
        I('Sun cap or hat',REC + ' in summer and pre monsoon',['summer'])
      ],
      footwear: [
        I('Trekking shoes. Tractor grip is preferable'),
        I('Slippers','must'),
        I('Leech socks, if your trek leader suggests them',REC + ' in monsoon',['monsoon'])
      ],
      gear: [
        I('2 litre water bottle'),
        I('Torch','must'),
        I('Rucksack'),
        I('Backpack, a small bag to carry on the trek'),
        I('Thick bed sheet'),
        I('Carry bags to keep your used clothes'),
        I('Zip lock pouch to carry your mobile phone',OPT),
        I('Sunglasses',OPT),
        I('Rain cover for your rucksack',REC + ' in monsoon',['monsoon']),
        I('Sunscreen',REC + ' in summer and pre monsoon',['summer'])
      ],
      toiletries: [
        I('Toothbrush and toothpaste',REC),
        I('Small towel',REC),
        I('Toilet paper and hand sanitiser',REC),
        I('Menstrual products, with a zip bag to carry used items back',REC)
      ],
      firstaid: [I('Personal medications, if any')].concat(meds({pan:true, trek:true})),
      docs: [
        I('ID proof, hard copy'),
        I('Cash, as per your need'),
        I('Declaration form and medical form, filled and signed as we ask')
      ],
      misc: [
        I('Electral or glucose'),
        I('Plum cakes, chocolates or energy bars'),
        I('Small bag for your own waste. Carry everything back down',REC),
        I('Spirit of adventure. The most important item of all')
      ]
    },
    avoid: [
      'Suitcases and heavy duffel bags. Soft bags are easier to carry',
      'Glass bottles and single use plastic',
      'Slippers or smooth sole shoes on the trail. Keep slippers for the camp or stay',
      'Speakers and loud music. Noise disturbs wildlife and other trekkers',
      'Jewellery and expensive items that can break or get lost',
      'Alcohol and other intoxicants. They are unsafe in the outdoors'
    ]
  },

  weeklong: {
    label: 'Weeklong Treks',
    seasons: ['spring','summer','monsoon','postmonsoon','autumn','winter'],
    monthGuide: 'Spring is March and April. Summer is May and June. Monsoon is July, August and mid September. Post Monsoon is mid September to mid October. Autumn is mid October to November. Winter is December, January and February. If your dates fall between two seasons, ask us before you buy anything.',
    sub: 'Himalayan treks',
    leader: 'trek leader',
    facts: [['Trek length','5 to 6 days, plus 2 to 3 days of travel'],['Bags','A rucksack for main luggage, and a daypack'],['On rent from us','Insulated jacket, long pants, trekking shoes, trekking pole, head torch, waterproof gloves']],
    intro: 'Himalayan treks go higher and get colder, so the list is longer and the warm layers matter. Items tagged Available on rent can be rented from us, so you do not have to buy them for one trek.',
    seasonNotes: {
      summer: 'Days are warm and the sun is strong, but nights at higher camps are still cold. The warm layers stay on the list. Sunscreen, sunglasses and a sun cap matter a lot.',
      monsoon: 'Expect rain, wet trails and slippery ground. Your rain jacket or poncho does the most work this season. A rain cover for your rucksack helps keep spare clothes dry.',
      postmonsoon: 'The rains are ending, but showers can still come and trails may be damp. Skies are often clear, and nights get colder as the season goes on. The warm layers stay on the list, and your rain jacket or poncho stays handy.',
      autumn: 'Days are mostly clear and the sun is still strong, but mornings and nights are cold, and it gets colder as November goes on. The warm layers stay on the list.',
      spring: 'Mornings and nights are cold, and some trails may still have snow. The sun is strong at midday. The warm layers stay on the list, along with sunscreen and sunglasses.',
      winter: 'This is the coldest season, with snow and freezing nights. The warm layers are required: thermal inners, insulated jacket, fleece, gloves, woollen cap and balaclava.'
    },
    secNotes: {
      clothing: 'Items tagged Available on rent can be rented from us. Ask us on WhatsApp if you want to rent them.',
      toiletries: 'Lip balm and moisturiser are not on our list, but cold dry air is hard on lips and skin.',
      firstaid: medNote('trek leader')
    },
    sections: {
      clothing: [
        I('Thermal innerwear, top and bottom, 1 set',{winter:'required'}),
        I('Insulated jacket, down or synthetic, 1 piece',{winter:'required'},[],true),
        I('Fleece jacket or sweater, 1 piece',{winter:'required'}),
        I('Cotton or quick dry T shirts, full sleeves recommended, 3 pieces'),
        I('Long pants, trekking pants or cargo pants, 2 pieces',null,[],true),
        I('Undergarments, 4 sets'),
        I('Woollen socks, 3 to 4 pairs'),
        I('Woollen gloves or waterproof gloves, 1 to 2 pairs',{winter:'required'},[],true),
        I('Woollen cap, 1 piece',{winter:'required'}),
        I('Small towel, 1 piece'),
        I('Balaclava or neck gaiter, 1 piece',{winter:'required'}),
        I('Rain jacket or poncho, 1 piece')
      ],
      footwear: [
        I('Waterproof trekking shoes, above the ankle with good grip, 1 pair',null,[],true),
        I('Flip flops or sandals, 1 pair')
      ],
      gear: [
        I('Rucksack, for main luggage, 1 piece'),
        I('Daypack, for a short outing'),
        I('Thermal flask, 1 litre, 1 piece'),
        I('Water bottle, 1 litre, 1 piece'),
        I('Sunglasses with UV protection, 1 pair'),
        I('Sun cap, 1 piece'),
        I('Sunscreen, SPF 50+, 1 bottle'),
        I('Torch with extra batteries, 1 piece',null,[],true),
        I('Trekking pole',OPT,[],true),
        I('Rain cover for your rucksack',REC + ' in monsoon and post monsoon',['monsoon','postmonsoon']),
        I('Power bank',OPT)
      ],
      toiletries: [
        I('Essential toiletries: toothbrush, toothpaste, soap and so on'),
        I('Toilet paper'),
        I('Lip balm and moisturiser',REC),
        I('Menstrual products, with a zip bag to carry used items back',REC)
      ],
      firstaid: [
        I('First aid kit, with basic medicines and bandages'),
        I('Personal medicines, if any, enough for the whole trip',REC)
      ].concat(meds({diamox:true, trek:true})),
      docs: [
        I('ID proof, original and a photocopy',REC),
        I('Cash in small notes',REC),
        I('Declaration form and medical form, filled and signed as we ask')
      ],
      misc: [
        I('Snacks such as dry fruits, chocolates and energy bars',REC),
        I('Small bag for your own waste. Carry everything back down',REC)
      ]
    },
    avoid: [
      'Hard suitcases and heavy duffel bags. A rucksack is easier on the trail',
      'Glass bottles and single use plastic',
      'Heavy extras. Every item is weight you carry at altitude',
      'Speakers and loud music. Noise disturbs wildlife and other trekkers',
      'Jewellery and expensive items that can break or get lost',
      'Alcohol and other intoxicants. They are unsafe at altitude'
    ]
  },

  backpacking: {
    label: 'Backpacking Trips',
    seasons: ['summer','spring','winter'],
    monthGuide: 'Going between November and February? Pick Winter. March and April? Pick Spring. May and June? Pick Summer. October falls in between. If you are not sure which to pick, ask us before you buy anything.',
    sub: 'Multiday trips, usually a week long',
    leader: 'trip captain',
    variants: {
      spiti: {
        facts: [['Trip length','Varies by trip. Your booking details have the dates'],['Bags','A rucksack for main luggage, and a daypack'],['What matters most','Warm layers, sun protection and your medical kit']],
        intro: 'This is the list we send for the Spiti backpacking trip. It is the same for Summer and Winter, so the warm layers stay on it in every season.',
        seasonNotes: {
          summer: 'Days can be warm and the sun is strong at altitude, but nights are cold. The warm layers stay on the list.',
          spring: 'Mornings and nights are cold, and the sun is strong in the day. The warm layers stay on the list.',
          winter: 'This is the coldest season, with freezing nights. The warm layers are required: thermal inners, insulated jacket, fleece, gloves, woollen cap and balaclava.'
        },
        secNotes: {
          toiletries: 'Lip balm and moisturiser are not on our list, but cold dry air is hard on lips and skin.',
          firstaid: medNote('trip captain')
        },
        sections: {
          clothing: [
            I('Thermal innerwear, top and bottom, 1 set',{winter:'required'}),
            I('Insulated jacket, down or synthetic, 1 piece',{winter:'required'}),
            I('Fleece jacket or sweater, 1 piece',{winter:'required'}),
            I('Cotton or quick dry T shirts, full sleeves recommended, 4 pieces'),
            I('Long pants, travel pants or cargo pants, 2 pieces'),
            I('Undergarments, 4 sets'),
            I('Woollen socks, 3 to 4 pairs'),
            I('Woollen gloves or waterproof gloves, 1 to 2 pairs',{winter:'required'}),
            I('Woollen cap, 1 piece',{winter:'required'}),
            I('Small towel, 1 piece'),
            I('Balaclava or neck gaiter, 1 piece',{winter:'required'}),
            I('Rain jacket or poncho, 1 piece')
          ],
          footwear: [
            I('Waterproof travel shoes, above the ankle with good grip, 1 pair'),
            I('Flip flops or sandals, 1 pair')
          ],
          gear: [
            I('Rucksack, for main luggage, 1 piece'),
            I('Daypack, for short outings, 1 piece'),
            I('Thermal flask, 1 litre, 1 piece'),
            I('Water bottle, 1 litre, 1 piece'),
            I('Sunglasses with UV protection, 1 pair'),
            I('Sun cap, 1 piece'),
            I('Sunscreen, SPF 50+, 1 bottle'),
            I('Torch with extra batteries, 1 piece'),
            I('Power bank',OPT)
          ],
          toiletries: [
            I('Essential toiletries: toothbrush, toothpaste, soap and so on'),
            I('Toilet paper'),
            I('Lip balm and moisturiser',REC),
            I('Menstrual products, with a zip bag to carry used items back',REC)
          ],
          firstaid: [
            I('First aid kit, with basic medicines and bandages'),
            I('Personal medicines, if any, enough for the whole trip',REC)
          ].concat(meds({diamox:true, pan:true})),
          docs: [
            I('ID proof, original and a photocopy',REC),
            I('Cash in small notes, along with UPI. ATMs and network can be limited in remote areas',REC),
            I('Declaration form and medical form, filled and signed as we ask')
          ],
          misc: [
            I('Snacks such as dry fruits, chocolates and energy bars',REC),
            I('Small bag for your own waste. Carry everything back with you',REC)
          ]
        },
        avoid: [
          'Hard suitcases. A rucksack is easier on mountain roads and stays',
          'Single use plastic bottles. Refill your own bottle',
          'Heavy extras. Every item is weight you carry at altitude',
          'Jewellery and large amounts of cash',
          'Alcohol and other intoxicants. They are unsafe at altitude'
        ]
      },

      rajasthan: {
        facts: [['Trip length','Varies by trip. Your booking details have the dates'],['Bags','A rucksack for main luggage, and a daypack'],['What matters most','Sun, dust and chilly nights']],
        intro: 'This is the list we send for the Rajasthan backpacking trip. Days are hot and dry, and nights can turn chilly, so it is about sun protection first and one warm layer second.',
        seasonNotes: {
          summer: 'Expect strong heat and sun. Light, loose clothes, a cap, sunscreen and plenty of water matter most. You do not need warm layers.',
          spring: 'Days are warm and nights can still be chilly. Carry a warm jacket or sweater, plus the sun protection on the list.',
          winter: 'Days are pleasant but nights can be chilly. A warm jacket or sweater is required. A light woollen cap is optional for cooler desert nights.'
        },
        secNotes: {
          toiletries: 'Toilet paper and hand sanitiser are not on our list, but they are handy on long road stretches.',
          firstaid: medNote('trip captain')
        },
        sections: {
          clothing: [
            I('Light cotton or quick dry T shirts, 3 to 4 pieces'),
            I('Full sleeve shirts or tops, to protect from sun and wind, 2 pieces'),
            I('Comfortable pants, jeans or travel trousers, 2 to 3 pieces'),
            I('Warm jacket or sweater, because nights can be chilly, 1 to 2 pieces',{winter:'required', spring:'required'},['winter','spring']),
            I('Innerwear, 5 sets'),
            I('Lightweight scarf or bandana, useful for dust and sun, 1 piece'),
            I('Cap or hat, for daytime sun protection, 1 piece'),
            I('Small towel, 1 piece'),
            I('Light woollen cap, for cooler desert nights',OPT,['winter','spring'])
          ],
          footwear: [
            I('Comfortable walking shoes or sports shoes, 1 pair'),
            I('Flip flops or sandals, 1 pair')
          ],
          gear: [
            I('Rucksack, for main luggage, 1 piece'),
            I('Daypack, for local sightseeing, 1 piece'),
            I('Sunglasses with UV protection'),
            I('Sunscreen, SPF 50+, 1 bottle'),
            I('Lip balm, to prevent dryness, 1 piece'),
            I('Reusable water bottle, minimum 1 litre, 1 piece'),
            I('Power bank, 1 piece')
          ],
          toiletries: [
            I('Personal toiletries and hygiene kit'),
            I('Toilet paper and hand sanitiser',REC),
            I('Menstrual products, with a zip bag to carry used items back',REC)
          ],
          firstaid: [I('Personal medicines, as prescribed')].concat(meds({})),
          docs: [
            I('ID proof, original and a photocopy',REC),
            I('Cash in small notes, along with UPI',REC),
            I('Declaration form and medical form, filled and signed as we ask')
          ],
          misc: [
            I('Snacks such as dry fruits, chocolates and energy bars',REC),
            I('Small bag for your own waste. Carry everything back with you',REC)
          ]
        },
        avoid: [
          'Hard suitcases. Soft bags fit vehicles and stays better',
          'Single use plastic bottles. Refill your own bottle',
          'Heavy jewellery and large amounts of cash',
          'Several items that do the same job',
          'Alcohol and other intoxicants during activities and travel'
        ]
      },

      malvan: {
        facts: [['Trip length','Varies by trip. Your booking details have the dates'],['Bags','One small backpack for everything'],['What matters most','Sun protection, water and light packing']],
        intro: 'This is the list we send for the Malvan backpacking trip. Pack light. The days are warm and humid, and most of your time is spent outdoors.',
        seasonNotes: {
          summer: 'It is hot and humid. Wear light clothes, use sunscreen and drink water often. Take your Electral or glucose.',
          spring: 'Days are warm and the sun is strong. A cap, sunglasses and sunscreen matter most.',
          winter: 'Days are pleasant and evenings can feel cool by the sea. A light jacket is optional.'
        },
        secNotes: {
          toiletries: 'These are not on the list we send, but most travellers are glad to have them.',
          firstaid: medNote('trip captain')
        },
        sections: {
          clothing: [
            I('Pairs of clothes, minimum 4'),
            I('Sun cap or hat'),
            I('Swimwear',REC),
            I('Light jacket for cool evenings',OPT + ' in winter',['winter'])
          ],
          footwear: [
            I('Sleepers, sandals or shoes')
          ],
          gear: [
            I('2 litre water bottle'),
            I('Sunglasses'),
            I('Sunscreen'),
            I('Bedsheet, if you need one in the train'),
            I('Carry bags to keep your used clothes'),
            I('Zip lock pouch to carry your mobile phone',OPT),
            I('Backpack, a small bag to carry all of the above items'),
            I('Quick dry towel',REC)
          ],
          toiletries: [
            I('Toothbrush and toothpaste',REC),
            I('Toilet paper and hand sanitiser',REC),
            I('Menstrual products, with a zip bag to carry used items back',REC)
          ],
          firstaid: [I('Personal medications, if any')].concat(meds({})),
          docs: [
            I('ID proof, hard copy'),
            I('Cash, as per your need'),
            I('Declaration form and medical form, filled and signed as we ask')
          ],
          misc: [
            I('Electral or glucose'),
            I('Plum cakes, chocolates or energy bars'),
            I('Small bag for your own waste. Carry everything back with you',REC),
            I('Spirit of adventure. The most important item of all')
          ]
        },
        avoid: [
          'Hard suitcases. One small backpack is easier to manage',
          'Single use plastic bottles and bags. Refill your own bottle',
          'Heavy jewellery and expensive items near the water',
          'Leaving litter on beaches. Carry your waste back',
          'Alcohol and other intoxicants during activities and travel'
        ]
      }
    }
  }
};
(function(){
  var v = DATA.backpacking.variants;
  var k = JSON.parse(JSON.stringify(v.spiti));
  k.intro = 'This is the list for the Kashmir backpacking trip. It follows the same items as our Spiti list.';
  k.seasonNotes = {
    summer: 'Days are pleasant to warm and the sun is strong, while nights turn cool and higher places stay cold. The warm layers stay on the list.',
    spring: 'Mornings and nights are cold, and higher places can still have snow. The sun is strong in the day. The warm layers stay on the list.',
    winter: 'This is the coldest season, with snow and freezing nights. The warm layers are required: thermal inners, insulated jacket, fleece, gloves, woollen cap and balaclava.'
  };
  v.kashmir = k;
})();

var state = {cat:'weekend', season:'all', dest:'spiti'};
var store = {};
var STORE_KEY = 'alphaPackingV4';
try { store = JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {}; } catch(e) { store = {}; }
function save(){ try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch(e) {} }

function $(id){ return document.getElementById(id); }
function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

function current(){
  var top = DATA[state.cat];
  if (state.cat === 'backpacking') return {top:top, d:top.variants[state.dest], key:'backpacking-' + state.dest};
  return {top:top, d:top, key:state.cat};
}

function isVisible(item){
  if (!item.tags.length) return true;
  if (state.season === 'all') {
    var offered = DATA[state.cat].seasons;
    return item.tags.some(function(t){ return offered.indexOf(t) !== -1; });
  }
  return item.tags.indexOf(state.season) !== -1;
}

function joinAnd(a){
  if (a.length < 2) return a.join('');
  return a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
}

function labelFor(item){
  var r = item.req;
  if (!r) return '';
  if (typeof r === 'string') return r;
  if (state.season !== 'all') {
    var one = r[state.season] || r.def;
    return one ? one + ' in ' + seasonLabel(state.season).toLowerCase() : '';
  }
  var groups = {}, order = [];
  SEASONS.forEach(function(s){
    if (!r[s]) return;
    if (!groups[r[s]]) { groups[r[s]] = []; order.push(r[s]); }
    groups[r[s]].push(seasonLabel(s).toLowerCase());
  });
  var parts = order.map(function(v){ return v + ' in ' + joinAnd(groups[v]); });
  if (r.def) parts.push(r.def + ' in other seasons');
  return parts.join(', ');
}

function seasonLabel(key){
  var o = DATA[state.cat].seasonLabels;
  return (o && o[key]) || SEASON_LABELS[key];
}

var chipSig = '';
function buildSeasonChips(list){
  var sig = state.cat + ':' + list.join(',');
  if (sig === chipSig) return;
  chipSig = sig;
  var sc = $('seasonChips'); sc.innerHTML = '';
  ['all'].concat(list).forEach(function(k){
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'ag-chip'; b.dataset.k = k; b.textContent = seasonLabel(k);
    b.addEventListener('click', function(){ state.season = k; render(); });
    sc.appendChild(b);
  });
}

function buildControls(){
  var tabs = $('tabs'); tabs.innerHTML = '';
  Object.keys(DATA).forEach(function(k){
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'ag-tab'; b.dataset.k = k;
    b.innerHTML = '<span class="t1"></span><span class="t2"></span>';
    b.querySelector('.t1').textContent = DATA[k].label;
    b.querySelector('.t2').textContent = DATA[k].sub;
    b.addEventListener('click', function(){ state.cat = k; render(); });
    tabs.appendChild(b);
  });
  var tc = $('terrainChips'); tc.innerHTML = '';
  DESTS.forEach(function(k){
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'ag-chip'; b.dataset.k = k; b.textContent = DEST_LABELS[k];
    b.addEventListener('click', function(){ state.dest = k; render(); });
    tc.appendChild(b);
  });
}

function setPressed(containerId, key){
  var els = $(containerId).children;
  for (var i = 0; i < els.length; i++) els[i].setAttribute('aria-pressed', els[i].dataset.k === key ? 'true' : 'false');
}

function render(){
  var cur = current(), d = cur.d, top = cur.top;
  var offered = top.seasons;
  if (state.season !== 'all' && offered.indexOf(state.season) === -1) state.season = 'all';
  buildSeasonChips(offered);
  $('seasonHelp').textContent = top.monthGuide;
  setPressed('tabs', state.cat);
  setPressed('seasonChips', state.season);
  setPressed('terrainChips', state.dest);
  $('terrainWrap').hidden = state.cat !== 'backpacking';

  var sn = $('seasonNote');
  sn.hidden = false;
  if (state.season === 'all') {
    sn.textContent = 'Showing items for every season. Items that apply only in some seasons say so in brackets. Choose a season above to see only what applies to you.';
  } else {
    sn.textContent = d.seasonNotes[state.season];
  }

  var facts = $('facts'); facts.innerHTML = '';
  d.facts.forEach(function(f){
    var div = document.createElement('div'); div.className = 'ag-fact';
    var k = document.createElement('span'); k.className = 'k'; k.textContent = f[0];
    var v = document.createElement('span'); v.className = 'v'; v.textContent = f[1];
    div.appendChild(k); div.appendChild(v); facts.appendChild(div);
  });
  $('catIntro').textContent = d.intro;

  var lists = $('lists'); lists.innerHTML = '';
  SECTIONS.forEach(function(sec){
    var items = d.sections[sec[0]] || [];
    var shown = [];
    items.forEach(function(it, idx){ if (isVisible(it)) shown.push({it:it, id:cur.key + '.' + sec[0] + '.' + idx}); });
    if (!shown.length) return;
    var wrap = document.createElement('section'); wrap.className = 'ag-sec'; wrap.dataset.sec = sec[0];
    var head = document.createElement('div'); head.className = 'ag-sec-row';
    var h = document.createElement('h3'); h.textContent = sec[1];
    var c = document.createElement('span'); c.className = 'c'; c.dataset.count = '1';
    head.appendChild(h); head.appendChild(c); wrap.appendChild(head);
    if (d.secNotes && d.secNotes[sec[0]]) {
      var n = document.createElement('p'); n.className = 'ag-sec-note'; n.textContent = d.secNotes[sec[0]]; wrap.appendChild(n);
    }
    var ul = document.createElement('ul'); ul.className = 'ag-items';
    shown.forEach(function(o){
      var li = document.createElement('li');
      var lab = document.createElement('label'); lab.className = 'ag-item';
      var cb = document.createElement('input'); cb.type = 'checkbox'; cb.dataset.id = o.id; cb.checked = !!store[o.id];
      var box = document.createElement('span'); box.className = 'ag-box'; box.setAttribute('aria-hidden', 'true');
      var txt = document.createElement('span'); txt.className = 'txt';
      txt.appendChild(document.createTextNode(o.it.t));
      var lbl = labelFor(o.it);
      if (lbl) {
        var r = document.createElement('span');
        r.className = 'ag-req' + (/^(required|must)/i.test(lbl) ? '' : ' opt');
        r.textContent = ' (' + cap(lbl) + ')';
        txt.appendChild(r);
      }
      if (o.it.rent) {
        var rt = document.createElement('span'); rt.className = 'ag-rent'; rt.textContent = 'Available on rent';
        txt.appendChild(rt);
      }
      cb.addEventListener('change', function(){
        if (cb.checked) store[o.id] = 1; else delete store[o.id];
        save(); updateCounts();
      });
      lab.appendChild(cb); lab.appendChild(box); lab.appendChild(txt);
      li.appendChild(lab); ul.appendChild(li);
    });
    wrap.appendChild(ul); lists.appendChild(wrap);
  });

  var av = $('avoid'); av.innerHTML = '';
  var ah = document.createElement('h3'); ah.textContent = 'Please leave these at home';
  var ap = document.createElement('p'); ap.textContent = 'They add weight, cause harm to the places we visit, or are not allowed.';
  var au = document.createElement('ul');
  d.avoid.forEach(function(x){ var li = document.createElement('li'); li.textContent = x; au.appendChild(li); });
  av.appendChild(ah); av.appendChild(ap); av.appendChild(au);

  updateCounts();
  updatePrintHead();
}

function updateCounts(){
  var total = 0, done = 0;
  var secs = document.querySelectorAll('#lists .ag-sec');
  for (var i = 0; i < secs.length; i++) {
    var boxes = secs[i].querySelectorAll('input[type=checkbox]');
    var t = boxes.length, dn = 0;
    for (var j = 0; j < boxes.length; j++) if (boxes[j].checked) dn++;
    secs[i].querySelector('[data-count]').textContent = dn + '/' + t;
    total += t; done += dn;
  }
  var pct = total ? Math.round(done * 100 / total) : 0;
  $('pct').textContent = pct + '%';
  $('cnt').textContent = done + ' of ' + total + ' packed';
  $('fill').style.width = pct + '%';
}

function updatePrintHead(){
  var top = DATA[state.cat];
  var bits = [top.label + ' (' + top.sub + ')', 'Season: ' + seasonLabel(state.season)];
  if (state.cat === 'backpacking') bits.push('Backpacking trip: ' + DEST_LABELS[state.dest]);
  $('phType').textContent = bits.join('   |   ');
  var who = [];
  if ($('fName').value) who.push('Trekker: ' + $('fName').value);
  if ($('fTrip').value) who.push('Trip: ' + $('fTrip').value);
  if ($('fDate').value) who.push('Departure: ' + $('fDate').value);
  $('phWho').textContent = who.join('   |   ');
}

['fName','fTrip','fDate'].forEach(function(id){ $(id).addEventListener('input', updatePrintHead); });
$('btnPrint').addEventListener('click', function(){ updatePrintHead(); window.print(); });
$('btnReset').addEventListener('click', function(){
  var prefix = current().key + '.';
  Object.keys(store).forEach(function(k){ if (k.indexOf(prefix) === 0) delete store[k]; });
  save(); render();
});

buildControls();
render();
})();
