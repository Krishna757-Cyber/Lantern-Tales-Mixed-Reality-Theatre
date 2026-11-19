/* ================================================================
   LANTERN TALES — RAMAYANA KATHA SCRIPT (src/story/ramayanaScript.js)
   A complete data-driven Kathputli performance of the Ramayana in 7 Kands
   Bilingual: Hindi (Devanagari) & English
   Traditional Rajasthani string-puppet storytelling
   Note: Regional and folk tellings across India contain diverse traditions.
   This presentation draws upon Valmiki Ramayana and Tulsidas's Ramcharitmanas.
================================================================ */

export const RAMAYANA_KANDS = [
  { id: 1, nameEn: 'Bal Kand', nameHi: 'बाल काण्ड', descEn: 'Divine birth, sage Vishwamitra, and the wedding in Mithila', descHi: 'प्रभु का अवतरण, विश्वामित्र यज्ञ रक्षा व सीता स्वयंवर' },
  { id: 2, nameEn: 'Ayodhya Kand', nameHi: 'अयोध्या काण्ड', descEn: 'The boons of Kaikeyi, departure for exile, and Bharat’s devotion', descHi: 'कैकेयी के दो वरदान, श्रीराम का वनगमन व भरत का पावन प्रेम' },
  { id: 3, nameEn: 'Aranya Kand', nameHi: 'अरण्य काण्ड', descEn: 'Panchavati hermitage, the golden deer, and Sita’s abduction', descHi: 'पंचवटी कुटी, स्वर्ण मृग, सीता हरण व जटायु का बलिदान' },
  { id: 4, nameEn: 'Kishkindha Kand', nameHi: 'किष्किन्धा काण्ड', descEn: 'Devotee Shabari, friendship with Sugriv, and Vali’s deliverance', descHi: 'शबरी के बेर, राम-सुग्रीव मित्रता व बालि मोक्ष' },
  { id: 5, nameEn: 'Sundar Kand', nameHi: 'सुन्दर काण्ड', descEn: 'Hanuman’s leap across the ocean, Ashok Vatika, and Lanka Dahan', descHi: 'हनुमान जी की सागर छलांग, अशोक वाटिका व लंका दहन' },
  { id: 6, nameEn: 'Yuddha Kand', nameHi: 'युद्ध काण्ड', descEn: 'Ram Setu bridge, Sanjeevani hill, and the defeat of Ravan', descHi: 'राम सेतु निर्माण, संजीवनी बूटी व दशानन रावण वध' },
  { id: 7, nameEn: 'Uttara & Return', nameHi: 'उत्तर व राज्याभिषेक', descEn: 'Pushpak Viman journey, Ayodhya Deepotsav, and the Coronation', descHi: 'पुष्पक विमान से अयोध्या वापसी, दीपदान व भव्य राज्याभिषेक' }
];

export const RAMAYANA_SCENES = [
  // ==================== 1. BAL KAND ====================
  {
    id: 'bal_1_yagya',
    kand: 'Bal Kand',
    kandIndex: 1,
    titleEn: 'King Dasharath & The Sacred Yagya',
    titleHi: 'राजा दशरथ व पुत्रकामेष्टि यज्ञ',
    narrationEn: 'In ancient Ayodhya on the sacred banks of Sarayu, Maharaja Dasharath performs a divine yagya to bless his kingdom with heirs.',
    narrationHi: 'सरयू के पावन तट पर अयोध्या नरेश महाराजा दशरथ ने वंश वृद्धि हेतु ऋषि वशिष्ठ के मार्गदर्शन में पुत्रकामेष्टि यज्ञ सम्पन्न किया।',
    backdrop: 'ayodhya-palace',
    actors: [
      { puppet: 'sutradhar', enterFrom: 'left', x: -0.65, pose: 'bow', action: 'narrate' },
      { puppet: 'dasharath', enterFrom: 'right', x: 0.15, pose: 'bless', action: 'yagya' }
    ],
    dialogue: [
      { puppet: 'sutradhar', textEn: 'Hearken, noble audience, to the sacred tale of Ayodhya!', textHi: 'सुनो सुनो हे श्रोतागण, अयोध्या नगरी की पावन कथा!' }
    ],
    sfx: 'yagya_chant',
    music: { taal: 'rupak', tempo: 74, mood: 'devotional' },
    durationMs: 16000
  },
  {
    id: 'bal_2_birth',
    kand: 'Bal Kand',
    kandIndex: 1,
    titleEn: 'Divine Birth of the Four Princes',
    titleHi: 'चारों राजकुमारों का अवतरण',
    narrationEn: 'On auspicious Chaitra Navami, Shri Ram takes birth to Mata Kaushalya, alongside Lakshman, Bharat, and Shatrughna. The entire city rejoices!',
    narrationHi: 'चैत्र शुक्ल नवमी के मंगल दिन कौशल्या नंदन प्रभु श्रीराम, लक्ष्मण, भरत व शत्रुघ्न का जन्म हुआ। अयोध्या में आनंद की लहर दौड़ गई!',
    backdrop: 'ayodhya-palace',
    actors: [
      { puppet: 'dasharath', enterFrom: 'left', x: -0.3, pose: 'celebrate', action: 'bless' },
      { puppet: 'ram', enterFrom: 'right', x: 0.25, pose: 'bless', action: 'kindle' }
    ],
    dialogue: [
      { puppet: 'dasharath', textEn: 'Bheye Pragat Kripala, Deen Dayala!', textHi: 'भये प्रगट कृपाला, दीनदयाला, कौशल्या हितकारी!' }
    ],
    sfx: 'temple_bells',
    music: { taal: 'kaharwa', tempo: 88, mood: 'festive' },
    durationMs: 16000
  },
  {
    id: 'bal_3_vishwamitra',
    kand: 'Bal Kand',
    kandIndex: 1,
    titleEn: 'Sage Vishwamitra & Tadka Vadh',
    titleHi: 'ऋषि विश्वामित्र व ताड़का उद्धार',
    narrationEn: 'Sage Vishwamitra brings young Ram and Lakshman to the deep Dandaka forest. With steady bows, they vanquish the demons disrupting holy penance.',
    narrationHi: 'ऋषि विश्वामित्र दोनों भाइयों राम-लक्ष्मण को वन ले गए। प्रभु ने ताड़का और सुबाहु के उपद्रव से ऋषियों के यज्ञ की रक्षा की।',
    backdrop: 'panchavati',
    actors: [
      { puppet: 'ram', enterFrom: 'left', x: -0.2, pose: 'aim-bow', action: 'shoot' },
      { puppet: 'lakshman', enterFrom: 'left', x: -0.45, pose: 'walk', action: 'guard' }
    ],
    dialogue: [
      { puppet: 'ram', textEn: 'No darkness shall taint this sacred forest.', textHi: 'ऋषियों का तपोवन अब निर्भय रहेगा।' }
    ],
    sfx: 'arrow_whoosh',
    music: { taal: 'teentaal', tempo: 92, mood: 'calm' },
    durationMs: 15000
  },
  {
    id: 'bal_4_mithila_swayamvar',
    kand: 'Bal Kand',
    kandIndex: 1,
    titleEn: 'Arrival in Mithila & Sita Swayamvar',
    titleHi: 'मिथिला आगमन व सीता स्वयंवर',
    narrationEn: 'King Janak convenes the grand Swayamvar in Mithila. The condition is absolute: whoever strings the massive celestial Pinaka bow of Lord Shiva shall wed Princess Sita.',
    narrationHi: 'राजा जनक की मिथिलापुरी में सीता स्वयंवर सजा। शर्त थी कि जो भी भगवान शिव के पिनाक धनुष पर प्रत्यंचा चढ़ाएगा, राजकुमारी सीता उसी को वरेंगी।',
    backdrop: 'swayamvar-hall',
    actors: [
      { puppet: 'sita', enterFrom: 'right', x: 0.45, pose: 'idle', action: 'garland' },
      { puppet: 'ram', enterFrom: 'left', x: -0.15, pose: 'bow', action: 'salute' }
    ],
    dialogue: [
      { puppet: 'sita', textEn: 'May Lord Shiva bless the worthy soul who respects all living beings.', textHi: 'शिव धनुष को वही उठा सकेंगे जो धर्म के सच्चे रक्षक हैं।' }
    ],
    sfx: 'shehnai',
    music: { taal: 'rupak', tempo: 76, mood: 'devotional' },
    durationMs: 17000
  },
  {
    id: 'bal_5_bow_break',
    kand: 'Bal Kand',
    kandIndex: 1,
    titleEn: 'Ram Lifts & Breaks the Pinaka Bow',
    titleHi: 'श्रीराम द्वारा शिव धनुष भंजन',
    narrationEn: 'With the blessings of his Guru, Shri Ram effortlessly lifts the immense bow. As he pulls the string, it snaps like lightning with a thunderous echo!',
    narrationHi: 'गुरु विश्वामित्र की आज्ञा पाकर प्रभु श्रीराम ने सहजता से धनुष उठाया। ज्यों ही डोरी खींची, वह प्रचंड गर्जना के साथ टूट गया!',
    backdrop: 'swayamvar-hall',
    actors: [
      { puppet: 'ram', enterFrom: 'center', x: 0.0, pose: 'aim-bow', action: 'break-bow' }
    ],
    dialogue: [
      { puppet: 'sutradhar', textEn: 'The heavens shower fragrant marigolds and celestial blossoms!', textHi: 'आकाश से देवगणों ने पुष्प वृष्टि की! जय श्री राम!' }
    ],
    sfx: 'thunder_bow',
    music: { taal: 'teentaal', tempo: 104, mood: 'victory' },
    durationMs: 16000
  },
  {
    id: 'bal_6_wedding',
    kand: 'Bal Kand',
    kandIndex: 1,
    titleEn: 'Divine Wedding of Ram & Sita',
    titleHi: 'श्री सिया-राम पावन विवाहोत्सव',
    narrationEn: 'Princess Sita places the fragrant Jaimala garland around Shri Ram’s neck. Festivities erupt across Mithila and Ayodhya with shehnai and dholak.',
    narrationHi: 'माता सीता ने प्रभु श्रीराम के गले में वरमाला डाली। मिथिला और अवध में मंगल दीप जले और मंगल गान गूंज उठे।',
    backdrop: 'swayamvar-hall',
    actors: [
      { puppet: 'ram', enterFrom: 'left', x: -0.15, pose: 'bless', action: 'stand' },
      { puppet: 'sita', enterFrom: 'right', x: 0.2, pose: 'bow', action: 'jaimala' }
    ],
    dialogue: [
      { puppet: 'ram', textEn: 'Together on the path of dharma forever.', textHi: 'धर्म और सत्य के मार्ग पर हम सदा साथ रहेंगे।' }
    ],
    sfx: 'temple_bells',
    music: { taal: 'kaharwa', tempo: 94, mood: 'festive' },
    durationMs: 17000
  },

  // ==================== 2. AYODHYA KAND ====================
  {
    id: 'ayo_7_rajyabhishek_plan',
    kand: 'Ayodhya Kand',
    kandIndex: 2,
    titleEn: 'Glad Tidings of Rajyabhishek',
    titleHi: 'श्रीराम राज्याभिषेक की घोषणा',
    narrationEn: 'King Dasharath resolves to crown virtuous Ram as the new king of Ayodhya. The citizens dance in the streets, decorating doors with mango leaves.',
    narrationHi: 'महाराजा दशरथ ने धर्मप्रिय श्रीराम को युवराज बनाने का निर्णय लिया। समस्त प्रजा झूम उठी और नगर तोरणों से सज गया।',
    backdrop: 'ayodhya-palace',
    actors: [
      { puppet: 'dasharath', enterFrom: 'left', x: -0.25, pose: 'bless', action: 'crown' },
      { puppet: 'ram', enterFrom: 'right', x: 0.2, pose: 'bow', action: 'salute' }
    ],
    dialogue: [
      { puppet: 'dasharath', textEn: 'Ram, the welfare of all people rests in your noble hands.', textHi: 'पुत्र राम, प्रजा का स्नेह और धर्म ही तुम्हारा साम्राज्य है।' }
    ],
    sfx: 'nagara_triumphant',
    music: { taal: 'teentaal', tempo: 90, mood: 'festive' },
    durationMs: 16000
  },
  {
    id: 'ayo_8_manthara',
    kand: 'Ayodhya Kand',
    kandIndex: 2,
    titleEn: 'Manthara Poisons Kaikeyi’s Mind',
    titleHi: 'मंथरा का कुटिल षड्यंत्र',
    narrationEn: 'Seeing Ayodhya celebrate, the maid Manthara whispers bitter deceit into Queen Kaikeyi’s ear, igniting fear for her son Bharat’s future.',
    narrationHi: 'दासी मंथरा ने रानी कैकेयी के मन में ईर्ष्या का विष घोला और भरत के भविष्य का भय दिखाकर उन्हें भड़काया।',
    backdrop: 'ayodhya-palace',
    actors: [
      { puppet: 'manthara', enterFrom: 'left', x: -0.35, pose: 'walk', action: 'whisper' },
      { puppet: 'kaikeyi', enterFrom: 'right', x: 0.15, pose: 'idle', action: 'listen' }
    ],
    dialogue: [
      { puppet: 'manthara', textEn: 'Wake up, Queen! Claim the two boons promised to you in battle!', textHi: 'जाग रानी! राजा से अपने दो वरदान मांगने का यही सही अवसर है!' }
    ],
    sfx: 'tense_drone',
    music: { taal: 'dadra', tempo: 68, mood: 'tense' },
    durationMs: 16000
  },
  {
    id: 'ayo_9_two_boons',
    kand: 'Ayodhya Kand',
    kandIndex: 2,
    titleEn: 'The Two Boons of Queen Kaikeyi',
    titleHi: 'कैकेयी के दो कठोर वरदान',
    narrationEn: 'In Kop Bhavan, Kaikeyi invokes Dasharath’s ancient vows: Crown Bharat as King, and exile Ram to Dandaka forest for fourteen long years.',
    narrationHi: 'कोपदवन में कैकेयी ने राजा दशरथ से दो वर मांगे: भरत को राजगद्दी और राम को चौदह वर्ष का वनवास। राजा मूर्छित हो गिरे।',
    backdrop: 'ayodhya-palace',
    actors: [
      { puppet: 'kaikeyi', enterFrom: 'left', x: -0.2, pose: 'aim-bow', action: 'demand' },
      { puppet: 'dasharath', enterFrom: 'right', x: 0.25, pose: 'mourn', action: 'weep' }
    ],
    dialogue: [
      { puppet: 'kaikeyi', textEn: 'A king’s word must never fail!', textHi: 'रघुकुल रीति सदा चलि आई, प्राण जाहुं बरु बचनु न जाई!' }
    ],
    sfx: 'heartbreak_strike',
    music: { taal: 'rupak', tempo: 60, mood: 'tense' },
    durationMs: 18000
  },
  {
    id: 'ayo_10_departure',
    kand: 'Ayodhya Kand',
    kandIndex: 2,
    titleEn: 'Departure for Fourteen Years of Exile',
    titleHi: 'श्रीराम-सीता-लक्ष्मण का वनगमन',
    narrationEn: 'Without a whisper of sorrow, Ram gladly accepts father’s vow. Devoted Sita and faithful brother Lakshman put on ascetic bark robes and follow.',
    narrationHi: 'बिना किसी संकोच के श्रीराम ने पिता की आज्ञा स्वीकार की। सीता और लक्ष्मण ने भी राजसी वस्त्र त्याग कर प्रभु का अनुसरण किया।',
    backdrop: 'panchavati',
    actors: [
      { puppet: 'ram', enterFrom: 'center', x: -0.1, pose: 'walk', action: 'vanvas' },
      { puppet: 'sita', enterFrom: 'center', x: 0.15, pose: 'walk', action: 'follow' },
      { puppet: 'lakshman', enterFrom: 'left', x: -0.4, pose: 'walk', action: 'guard' }
    ],
    dialogue: [
      { puppet: 'ram', textEn: 'Father’s honor is our greatest duty.', textHi: 'पिता के वचनों की रक्षा ही हमारा परम धर्म है।' }
    ],
    sfx: 'wind_whisper',
    music: { taal: 'rupak', tempo: 66, mood: 'calm' },
    durationMs: 17000
  },
  {
    id: 'ayo_11_dasharath_passing',
    kand: 'Ayodhya Kand',
    kandIndex: 2,
    titleEn: 'Grief of King Dasharath',
    titleHi: 'महाराजा दशरथ का देहावसान',
    narrationEn: 'Unable to bear the agony of separation from beloved Ram, King Dasharath breathes his last, calling out "He Ram! He Ram!".',
    narrationHi: 'प्रिय राम के वियोग की वेदना सह न पाकर महाराजा दशरथ "हे राम! हे राम!" पुकारते हुए परमधाम सिधार गए।',
    backdrop: 'ayodhya-palace',
    actors: [
      { puppet: 'dasharath', enterFrom: 'center', x: 0.0, pose: 'mourn', action: 'pass' }
    ],
    dialogue: [
      { puppet: 'sutradhar', textEn: 'Ayodhya weeps in inconsolable silence.', textHi: 'सम्पूर्ण अयोध्या शोक सागर में डूब गई।' }
    ],
    sfx: 'grief_chime',
    music: { taal: 'rupak', tempo: 56, mood: 'tense' },
    durationMs: 15000
  },
  {
    id: 'ayo_12_bharat_paduka',
    kand: 'Ayodhya Kand',
    kandIndex: 2,
    titleEn: 'Bharat Receives Ram’s Sacred Paduka',
    titleHi: 'भरत मिलाप व चरण पादुका अर्पण',
    narrationEn: 'Bharat refuses the crown and rushes to Chitrakoot. Unable to persuade Ram to return, he reverently takes Ram’s wooden sandals to rule as regent from Nandigram.',
    narrationHi: 'भरत ने राजपद ठुकरा दिया और चित्रकूट पहुंचे। राम के न लौटने पर उनकी चरण पादुकाएं शीश पर रखकर नंदीग्राम से राजकाज संभाला।',
    backdrop: 'panchavati',
    actors: [
      { puppet: 'bharat', enterFrom: 'left', x: -0.25, pose: 'bow', action: 'kneel' },
      { puppet: 'ram', enterFrom: 'right', x: 0.2, pose: 'bless', action: 'give-paduka' }
    ],
    dialogue: [
      { puppet: 'bharat', textEn: 'Your sacred sandals alone shall sit upon the royal throne.', textHi: 'प्रभु! यह सिंहासन आपका है, आपकी पादुकाएं ही अयोध्या का शासन करेंगी।' }
    ],
    sfx: 'paduka_reverence',
    music: { taal: 'kaharwa', tempo: 72, mood: 'devotional' },
    durationMs: 18000
  },

  // ==================== 3. ARANYA KAND ====================
  {
    id: 'ara_13_panchavati',
    kand: 'Aranya Kand',
    kandIndex: 3,
    titleEn: 'Peaceful Hermitage at Panchavati',
    titleHi: 'पंचवटी में शांत तपोवन जीवन',
    narrationEn: 'Amidst five sacred banyan trees beside the sparkling Godavari, Lakshman builds a leaf hut. Ram and Sita dwell in serene harmony with nature.',
    narrationHi: 'गोदावरी के सुरम्य तट पर पांच वटवृक्षों के बीच लक्ष्मण जी ने सुंदर पर्णकुटी बनाई। प्रभु राम और जानकी प्रकृति के बीच शांति से रहने लगे।',
    backdrop: 'panchavati',
    actors: [
      { puppet: 'ram', enterFrom: 'left', x: -0.15, pose: 'bless', action: 'dwell' },
      { puppet: 'sita', enterFrom: 'center', x: 0.15, pose: 'idle', action: 'flowers' }
    ],
    dialogue: [
      { puppet: 'sita', textEn: 'How gentle is this river breeze, my Lord.', textHi: 'गोदावरी की यह मंद बयार कितनी पावन और शांत है।' }
    ],
    sfx: 'river_birds',
    music: { taal: 'kaharwa', tempo: 78, mood: 'calm' },
    durationMs: 16000
  },
  {
    id: 'ara_14_shurpanakha',
    kand: 'Aranya Kand',
    kandIndex: 3,
    titleEn: 'Shurpanakha’s Disguise & Warning',
    titleHi: 'शूर्पणखा का छल व लक्ष्मण की चेतावनी',
    narrationEn: 'The demoness Shurpanakha arrives in seductive disguise. Rebuffed by Ram and mocked by Lakshman, she lunges at Sita and is swiftly disarmed.',
    narrationHi: 'राक्षसी शूर्पणखा रूप बदलकर आई और सीता पर झपटी। लक्ष्मण जी ने तत्परता से उसके कुटिल इरादों को विफल कर दिया।',
    backdrop: 'panchavati',
    actors: [
      { puppet: 'shurpanakha', enterFrom: 'right', x: 0.35, pose: 'fight', action: 'intrude' },
      { puppet: 'lakshman', enterFrom: 'left', x: -0.2, pose: 'aim-bow', action: 'defend' }
    ],
    dialogue: [
      { puppet: 'lakshman', textEn: 'Touch not the embodiment of virtue, demoness!', textHi: 'सावधान दुराचारिणी! माता जानकी की ओर दृष्टि भी मत उठाना!' }
    ],
    sfx: 'sword_clash',
    music: { taal: 'teentaal', tempo: 100, mood: 'battle' },
    durationMs: 15000
  },
  {
    id: 'ara_15_golden_deer',
    kand: 'Aranya Kand',
    kandIndex: 3,
    titleEn: 'The Illusion of the Golden Deer',
    titleHi: 'स्वर्ण मृग मारीच की माया',
    narrationEn: 'Demon Maricha takes the form of an irresistible golden spotted deer. Enchanted, Sita requests Ram to bring its fleece, drawing Ram into the deep forest.',
    narrationHi: 'मारीच ने सोने का मृग बनकर माया रची। सीता जी के आग्रह पर प्रभु राम उस चमकीले मृग के पीछे वन में चले गए।',
    backdrop: 'panchavati',
    actors: [
      { puppet: 'maricha', enterFrom: 'right', x: 0.35, pose: 'leap', action: 'prance' },
      { puppet: 'ram', enterFrom: 'left', x: -0.25, pose: 'walk', action: 'pursue' }
    ],
    dialogue: [
      { puppet: 'ram', textEn: 'This golden deer carries the deceit of demons.', textHi: 'यह सामान्य मृग नहीं, किसी निशाचर की माया है।' }
    ],
    sfx: 'deer_bells',
    music: { taal: 'dadra', tempo: 96, mood: 'tense' },
    durationMs: 16000
  },
  {
    id: 'ara_16_lakshman_rekha',
    kand: 'Aranya Kand',
    kandIndex: 3,
    titleEn: 'The Protective Lakshman Rekha',
    titleHi: 'लक्ष्मण रेखा व भिक्षुक रावण',
    narrationEn: 'Hearing cries echoing Ram’s voice, Sita urges Lakshman to follow. Before leaving, Lakshman carves an enchanted protective boundary around the hermitage.',
    narrationHi: 'मायावी पुकार सुनकर सीता जी व्याकुल हुईं। जाने से पूर्व लक्ष्मण ने कुटिया के चारों ओर अभेद्य लक्ष्मण रेखा खींच दी।',
    backdrop: 'panchavati',
    actors: [
      { puppet: 'lakshman', enterFrom: 'center', x: -0.15, pose: 'aim-bow', action: 'draw-line' },
      { puppet: 'sita', enterFrom: 'right', x: 0.25, pose: 'mourn', action: 'anxious' }
    ],
    dialogue: [
      { puppet: 'lakshman', textEn: 'Mother, step not beyond this line until we return.', textHi: 'माते, जब तक हम न लौटें, इस रेखा के बाहर कदापि न पग धरें।' }
    ],
    sfx: 'mystic_hum',
    music: { taal: 'rupak', tempo: 64, mood: 'tense' },
    durationMs: 16000
  },
  {
    id: 'ara_17_sita_haran',
    kand: 'Aranya Kand',
    kandIndex: 3,
    titleEn: 'Ravan’s Deceit & The Abduction of Sita',
    titleHi: 'छली रावण द्वारा सीता हरण',
    narrationEn: 'Disguised as a hungry ascetic sage, King Ravan tricks Sita into stepping past the line to offer alms, then violently abducts her in his flying chariot.',
    narrationHi: 'साधु वेश में आकर रावण ने भिक्षा के बहाने छल किया और रेखा पार कराते ही माता सीता का अपहरण कर आकाश मार्ग से उड़ा ले गया।',
    backdrop: 'panchavati',
    actors: [
      { puppet: 'ravan', enterFrom: 'left', x: -0.2, pose: 'fight', action: 'abduct' },
      { puppet: 'sita', enterFrom: 'right', x: 0.25, pose: 'mourn', action: 'cry' }
    ],
    dialogue: [
      { puppet: 'sita', textEn: 'He Ram! Protect me, O Lord of Dharma!', textHi: 'हे राम! रक्षा करो प्रभु! हे रघुनंदन!' }
    ],
    sfx: 'chariot_thunder',
    music: { taal: 'teentaal', tempo: 108, mood: 'battle' },
    durationMs: 17000
  },
  {
    id: 'ara_18_jatayu_sacrifice',
    kand: 'Aranya Kand',
    kandIndex: 3,
    titleEn: 'Jatayu’s Valorous Sacrifice',
    titleHi: 'वीर जटायु का आत्मोत्सर्ग',
    narrationEn: 'Hearing Sita’s cries, the aged eagle king Jatayu attacks Ravan mid-air. Though his wings are severed by Chandrahas sword, he clings to life to inform Ram.',
    narrationHi: 'माता की पुकार सुन वृद्ध जटायु ने रावण के रथ पर भीषण प्रहार किया। पंख कट जाने पर भी अंतिम सांस तक प्रभु को सूचना देने हेतु जीवित रहे।',
    backdrop: 'panchavati',
    actors: [
      { puppet: 'jatayu', enterFrom: 'right', x: 0.2, pose: 'fight', action: 'clash' },
      { puppet: 'ram', enterFrom: 'left', x: -0.3, pose: 'mourn', action: 'cradle' }
    ],
    dialogue: [
      { puppet: 'jatayu', textEn: 'O Ram, Lanka’s king has taken Sita southward...', textHi: 'प्रभु... दशानन रावण माता जानकी को दक्षिण दिशा की ओर ले गया है...' }
    ],
    sfx: 'eagle_cry',
    music: { taal: 'rupak', tempo: 60, mood: 'tense' },
    durationMs: 17000
  },

  // ==================== 4. KISHKINDHA KAND ====================
  {
    id: 'kis_19_shabari',
    kand: 'Kishkindha Kand',
    kandIndex: 4,
    titleEn: 'Shabari’s Devotion & The Sweet Ber',
    titleHi: 'भक्तिमति शबरी के मीठे बेर',
    narrationEn: 'Searching through the wilderness, Ram visits the humble hermitage of aged ascetic Shabari. Pleased by her pure love, he tastes the sweet berries she tasted first.',
    narrationHi: 'शबरी माता ने प्रभु का वर्षों इंतजार किया था। श्रीराम ने उनके प्रेम को देख प्रेमपूर्वक उनके जूठे मीठे बेर ग्रहण किए।',
    backdrop: 'kishkindha',
    actors: [
      { puppet: 'shabari', enterFrom: 'left', x: -0.25, pose: 'bow', action: 'offer-ber' },
      { puppet: 'ram', enterFrom: 'right', x: 0.2, pose: 'bless', action: 'eat-ber' }
    ],
    dialogue: [
      { puppet: 'shabari', textEn: 'My wait of a lifetime has borne fruit today, Ram!', textHi: 'मेरे प्रभु राम आ गए! मेरे जीवन की तपस्या सफल हुई!' }
    ],
    sfx: 'devotional_flute',
    music: { taal: 'kaharwa', tempo: 70, mood: 'devotional' },
    durationMs: 17000
  },
  {
    id: 'kis_20_ram_hanuman_meet',
    kand: 'Kishkindha Kand',
    kandIndex: 4,
    titleEn: 'Ram Meets Hanuman at Pampa Lake',
    titleHi: 'पंपा सरोवर पर राम-हनुमान मिलन',
    narrationEn: 'Near Rishyamukha mountain, Hanuman approaches in the guise of a Brahmin scholar. Recognizing his eternal Lord, he falls at Ram’s lotus feet with tearful reverence.',
    narrationHi: 'ऋष्यमूक पर्वत के निकट हनुमान जी विप्र वेश में आए। अपने इष्ट प्रभु को पहचान कर वे अश्रुपूर्ण नयनों से चरणों में गिर पड़े।',
    backdrop: 'kishkindha',
    actors: [
      { puppet: 'hanuman', enterFrom: 'left', x: -0.25, pose: 'bow', action: 'charan-vandana' },
      { puppet: 'ram', enterFrom: 'right', x: 0.2, pose: 'bless', action: 'embrace' }
    ],
    dialogue: [
      { puppet: 'hanuman', textEn: 'I am your humble servant, O Lord of Raghus!', textHi: 'मैं आपका दास हूं प्रभु, पहचानिए अपने अनन्य सेवक को!' }
    ],
    sfx: 'shankh_divine',
    music: { taal: 'rupak', tempo: 75, mood: 'devotional' },
    durationMs: 18000
  },
  {
    id: 'kis_21_sugriv_friendship',
    kand: 'Kishkindha Kand',
    kandIndex: 4,
    titleEn: 'Sacred Alliance with King Sugriv',
    titleHi: 'अग्नि साक्षी: राम-सुग्रीव मित्रता',
    narrationEn: 'Before the holy fire, Ram and exile King Sugriv pledge eternal friendship. Ram vows to restore Sugriv’s kingdom, and Sugriv pledges his vanar army to find Sita.',
    narrationHi: 'अग्नि को साक्षी मानकर प्रभु राम और सुग्रीव में मित्रता हुई। राम ने सुग्रीव का मान लौटाने और सुग्रीव ने वानर सेना से सीता खोज का प्रण लिया।',
    backdrop: 'kishkindha',
    actors: [
      { puppet: 'ram', enterFrom: 'left', x: -0.2, pose: 'bless', action: 'handshake' },
      { puppet: 'sugriv', enterFrom: 'right', x: 0.25, pose: 'bow', action: 'pledge' }
    ],
    dialogue: [
      { puppet: 'sugriv', textEn: 'Millions of brave vanars shall search every corner of earth!', textHi: 'प्रभु, समस्त दिशाओं में वानर दल जानकी माता की खोज करेंगे।' }
    ],
    sfx: 'sacred_fire',
    music: { taal: 'kaharwa', tempo: 84, mood: 'festive' },
    durationMs: 16000
  },
  {
    id: 'kis_22_vali_vadh',
    kand: 'Kishkindha Kand',
    kandIndex: 4,
    titleEn: 'Vali’s Deliverance & Sugriv’s Coronation',
    titleHi: 'बालि मोक्ष व सुग्रीव का राज्याभिषेक',
    narrationEn: 'Upholding justice, Ram frees Kishkindha from Vali’s tyranny. Granting Vali moksha, Sugriv is crowned king and the rains recede.',
    narrationHi: 'अधर्म पर धर्म की विजय हुई, बालि को प्रभु के दर्शन से मोक्ष प्राप्त हुआ और सुग्रीव को किष्किन्धा का राज्य सौंपा गया।',
    backdrop: 'kishkindha',
    actors: [
      { puppet: 'ram', enterFrom: 'left', x: -0.2, pose: 'aim-bow', action: 'justice' },
      { puppet: 'bali', enterFrom: 'center', x: 0.15, pose: 'bow', action: 'moksha' }
    ],
    dialogue: [
      { puppet: 'ram', textEn: 'True strength lies in protecting the rightful, not oppressing.', textHi: 'बल का सदुपयोग निर्बल की रक्षा में है, उत्पीड़न में नहीं।' }
    ],
    sfx: 'arrow_divine',
    music: { taal: 'teentaal', tempo: 92, mood: 'calm' },
    durationMs: 16000
  },
  {
    id: 'kis_23_search_parties',
    kand: 'Kishkindha Kand',
    kandIndex: 4,
    titleEn: 'Vanar Search Parties Sent Across Earth',
    titleHi: 'चारों दिशाओं में वानर दलों का प्रस्थान',
    narrationEn: 'Sugriv marshals fearless vanars. To Hanuman heading south, Ram entrusts his inscribed signet ring as proof of identity for Sita.',
    narrationHi: 'सुग्रीव ने वानरों को चारों दिशाओं में भेजा। दक्षिण दिशा जाने वाले पवनपुत्र हनुमान को श्रीराम ने अपनी मुद्रिका सौंपी।',
    backdrop: 'ocean-setu',
    actors: [
      { puppet: 'ram', enterFrom: 'left', x: -0.25, pose: 'bless', action: 'give-ring' },
      { puppet: 'hanuman', enterFrom: 'right', x: 0.2, pose: 'bow', action: 'receive-ring' }
    ],
    dialogue: [
      { puppet: 'ram', textEn: 'Give this ring to Janaki, Hanuman. Tell her Ram is coming.', textHi: 'यह मुद्रिका सीता को देना हनुमान, कहना उनका राम आ रहा है।' }
    ],
    sfx: 'ring_gleam',
    music: { taal: 'kaharwa', tempo: 86, mood: 'devotional' },
    durationMs: 17000
  },

  // ==================== 5. SUNDAR KAND ====================
  {
    id: 'sun_24_ocean_leap',
    kand: 'Sundar Kand',
    kandIndex: 5,
    titleEn: 'Hanuman’s Leap Across the Ocean',
    titleHi: 'पवनपुत्र हनुमान की सागर छलांग',
    narrationEn: 'Awakened to his boundless divine powers by Jambavan, Hanuman expands to mountain size and leaps across the roaring ocean towards Lanka!',
    narrationHi: 'जाम्बवंत द्वारा शक्ति का स्मरण कराते ही वीर हनुमान विशाल रूप धरकर "जय श्री राम" का घोष करते हुए सागर पार कूद पड़े!',
    backdrop: 'ocean-setu',
    actors: [
      { puppet: 'hanuman', enterFrom: 'left', x: 0.0, pose: 'leap', action: 'fly-ocean' }
    ],
    dialogue: [
      { puppet: 'hanuman', textEn: 'Jai Shri Ram! No ocean can stay the messenger of dharma!', textHi: 'जय श्री राम! प्रभु काज कीन्हें बिनु मोहि कहाँ विश्राम!' }
    ],
    sfx: 'ocean_wind_leap',
    music: { taal: 'teentaal', tempo: 110, mood: 'victory' },
    durationMs: 17000
  },
  {
    id: 'sun_25_ashok_vatika',
    kand: 'Sundar Kand',
    kandIndex: 5,
    titleEn: 'Mata Sita in Ashok Vatika',
    titleHi: 'अशोक वाटिका में माता सीता',
    narrationEn: 'Hanuman penetrates the golden fortress of Lanka and finds Mother Sita seated beneath an Ashoka tree, emaciated but radiant in unbroken contemplation of Ram.',
    narrationHi: 'लंका में प्रवेश कर हनुमान जी ने अशोक वाटिका में शोकग्रस्त माता जानकी को देखा, जो निरंतर प्रभु राम के ध्यान में लीन थीं।',
    backdrop: 'ashok-vatika',
    actors: [
      { puppet: 'sita', enterFrom: 'center', x: 0.15, pose: 'mourn', action: 'prayer' },
      { puppet: 'hanuman', enterFrom: 'left', x: -0.45, pose: 'idle', action: 'tree-watch' }
    ],
    dialogue: [
      { puppet: 'sita', textEn: 'O Lord Ram, each passing second feels like an age of waiting.', textHi: 'हे प्राणनाथ! आपके बिना यह विरह काल युगों समान बीत रहा है।' }
    ],
    sfx: 'night_crickets',
    music: { taal: 'rupak', tempo: 58, mood: 'devotional' },
    durationMs: 17000
  },
  {
    id: 'sun_26_ring_delivered',
    kand: 'Sundar Kand',
    kandIndex: 5,
    titleEn: 'Delivering the Signet Ring of Shri Ram',
    titleHi: 'श्रीराम मुद्रिका अर्पण',
    narrationEn: 'Dropping the ring into Sita’s lap from above, Hanuman sings the glories of Ram. Descending in humility, he dispels her doubts and brings tears of joy.',
    narrationHi: 'हनुमान जी ने ऊपर से प्रभु की मुद्रिका गिराई। फिर विनीत भाव से सामने आकर रामकथा सुनाई और माता के समस्त संशय मिटा दिए।',
    backdrop: 'ashok-vatika',
    actors: [
      { puppet: 'hanuman', enterFrom: 'left', x: -0.2, pose: 'bow', action: 'ring-present' },
      { puppet: 'sita', enterFrom: 'right', x: 0.25, pose: 'bless', action: 'choodamani' }
    ],
    dialogue: [
      { puppet: 'hanuman', textEn: 'Ram Doot Main Maatu Janki! Satya Shapath Karunanidhi Ki!', textHi: 'राम दूत मैं मातु जानकी! सत्य शपथ करुनानिधान की!' }
    ],
    sfx: 'choodamani_sparkle',
    music: { taal: 'kaharwa', tempo: 76, mood: 'devotional' },
    durationMs: 18000
  },
  {
    id: 'sun_27_ravan_court',
    kand: 'Sundar Kand',
    kandIndex: 5,
    titleEn: 'Confrontation in the Court of Ravan',
    titleHi: 'रावण की राजसभा में हनुमान',
    narrationEn: 'Captured willingly, Hanuman stands fearless in Ravan’s glittering court. He warns the 10-headed king to return Sita with honour or face total doom.',
    narrationHi: 'रावण की भव्य सभा में हनुमान जी निर्भय खड़े हुए और चेतावनी दी: "माता सीता को सम्मान सहित लौटा दो, अन्यथा लंका का विनाश निश्चित है।"',
    backdrop: 'golden-lanka',
    actors: [
      { puppet: 'hanuman', enterFrom: 'left', x: -0.25, pose: 'fight', action: 'stand-firm' },
      { puppet: 'ravan', enterFrom: 'right', x: 0.25, pose: 'aim-bow', action: 'rage' }
    ],
    dialogue: [
      { puppet: 'ravan', textEn: 'Wrap this monkey’s tail in cloth, soak it in oil, and set it ablaze!', textHi: 'इस वानर की पूंछ में कपड़ा लपेटकर घी डालकर आग लगा दो!' }
    ],
    sfx: 'gong_dramatic',
    music: { taal: 'teentaal', tempo: 104, mood: 'tense' },
    durationMs: 17000
  },
  {
    id: 'sun_28_lanka_dahan',
    kand: 'Sundar Kand',
    kandIndex: 5,
    titleEn: 'Lanka Dahan — Burning of the Golden Citadel',
    titleHi: 'लंका दहन: स्वर्ण लंका में अग्नि लीला',
    narrationEn: 'Using the fire on his tail, Hanuman leaps from palace to palace, reducing Ravan’s pride and the golden towers to ashes, leaving Ashok Vatika untouched.',
    narrationHi: 'पूंछ की अग्नि से हनुमान जी ने एक महल से दूसरे महल छलांग लगाई और रावण का अहंकार भस्म कर पूरी लंका को अग्नि की भेंट चढ़ा दिया।',
    backdrop: 'golden-lanka',
    actors: [
      { puppet: 'hanuman', enterFrom: 'center', x: 0.0, pose: 'leap', action: 'lanka-fire' }
    ],
    dialogue: [
      { puppet: 'sutradhar', textEn: 'Hari Ichha! The pride of tyranny turns to cinder!', textHi: 'अहंकार की स्वर्ण लंका धू-धू कर जल उठी!' }
    ],
    sfx: 'fire_roaring',
    music: { taal: 'teentaal', tempo: 116, mood: 'battle' },
    durationMs: 17000
  },

  // ==================== 6. YUDDHA KAND ====================
  {
    id: 'yud_29_ram_setu',
    kand: 'Yuddha Kand',
    kandIndex: 6,
    titleEn: 'Construction of the Ram Setu Bridge',
    titleHi: 'राम सेतु का अद्भुत निर्माण',
    narrationEn: 'Led by engineers Nal and Neel, the vanar army inscribes the name "RAM" upon heavy rocks. By divine grace, the massive boulders float across the roaring sea!',
    narrationHi: 'नल और नील के नेतृत्व में वानरों ने पत्थरों पर "राम" नाम लिखा। प्रभु नाम के प्रताप से विशाल शिलाएं समुद्र पर तैरने लगीं!',
    backdrop: 'ocean-setu',
    actors: [
      { puppet: 'ram', enterFrom: 'left', x: -0.3, pose: 'bless', action: 'setu-bless' },
      { puppet: 'hanuman', enterFrom: 'center', x: 0.0, pose: 'leap', action: 'carry-rock' },
      { puppet: 'lakshman', enterFrom: 'left', x: -0.5, pose: 'walk', action: 'guard' }
    ],
    dialogue: [
      { puppet: 'hanuman', textEn: 'Write His Name, and even stone floats with devotion!', textHi: 'जिनके नाम से भवसागर तर जाते हैं, उनके नाम से यह पाषाण क्यों न तैरें!' }
    ],
    sfx: 'ocean_waves_stones',
    music: { taal: 'kaharwa', tempo: 86, mood: 'devotional' },
    durationMs: 18000
  },
  {
    id: 'yud_30_vibhishan_sharan',
    kand: 'Yuddha Kand',
    kandIndex: 6,
    titleEn: 'Vibhishan Seeks Refuge & Is Crowned',
    titleHi: 'विभीषण शरणागति व राजतिलक',
    narrationEn: 'Cast out by Ravan for advocating righteousness, noble Vibhishan seeks Ram’s shelter. Ram immediately embraces him, declaring him the rightful king of Lanka.',
    narrationHi: 'धर्म की बात कहने पर रावण द्वारा निष्कासित विभीषण प्रभु की शरण में आए। श्रीराम ने उन्हें गले लगाकर लंका का भावी राजा घोषित किया।',
    backdrop: 'ocean-setu',
    actors: [
      { puppet: 'vibhishan', enterFrom: 'right', x: 0.2, pose: 'bow', action: 'sharan' },
      { puppet: 'ram', enterFrom: 'left', x: -0.15, pose: 'bless', action: 'tilak' }
    ],
    dialogue: [
      { puppet: 'ram', textEn: 'Whoever comes to my shelter with a pure heart is dearer than my own life.', textHi: 'शरणागत कहूं जे तजहीं, निज अनहित अनुमानि। ते नर पांवर पापमय, तिन्हहि बिलोकत हानि।' }
    ],
    sfx: 'shankh_reverence',
    music: { taal: 'rupak', tempo: 74, mood: 'devotional' },
    durationMs: 17000
  },
  {
    id: 'yud_31_sanjeevani',
    kand: 'Yuddha Kand',
    kandIndex: 6,
    titleEn: 'Sanjeevani Hill for Lakshman',
    titleHi: 'लक्ष्मण मूर्छा व संजीवनी बूटी',
    narrationEn: 'Meghnad strikes Lakshman with the deadly Shakti spear. Before sunrise, Hanuman flies across continents and carries the entire Dronagiri herb mountain back!',
    narrationHi: 'मेघनाद की शक्ति से लक्ष्मण मूर्छित हुए। सूर्योदय से पहले हनुमान जी पूरा द्रोणागिरि पर्वत उठाकर ले आए और लक्ष्मण के प्राण बचाए!',
    backdrop: 'battlefield',
    actors: [
      { puppet: 'lakshman', enterFrom: 'center', x: -0.1, pose: 'mourn', action: 'murchha' },
      { puppet: 'hanuman', enterFrom: 'right', x: 0.25, pose: 'leap', action: 'mountain-lift' },
      { puppet: 'ram', enterFrom: 'left', x: -0.4, pose: 'bless', action: 'grief-relief' }
    ],
    dialogue: [
      { puppet: 'ram', textEn: 'You saved my brother’s life, Hanuman. You are dear to me as Bharat!', textHi: 'तुम मम प्रिय भरतहि सम भाई! हनुमान, तुमने मेरे कुल के प्राण बचा लिए!' }
    ],
    sfx: 'mountain_soar',
    music: { taal: 'teentaal', tempo: 96, mood: 'tense' },
    durationMs: 18000
  },
  {
    id: 'yud_32_kumbhkarna',
    kand: 'Yuddha Kand',
    kandIndex: 6,
    titleEn: 'The Awakening & Fall of Giant Kumbhkarna',
    titleHi: 'कुंभकर्ण का अंत',
    narrationEn: 'Ravan awakens his gargantuan brother Kumbhkarna. Despite knowing Ram is the Supreme Lord, Kumbhkarna fights to honor fraternal loyalty and finds liberation.',
    narrationHi: 'रावण ने विशालकाय कुंभकर्ण को जगाया। धर्म को जानते हुए भी उसने भ्रातृ प्रेम में युद्ध किया और प्रभु के हाथों वीरगति पाई।',
    backdrop: 'battlefield',
    actors: [
      { puppet: 'kumbhkarna', enterFrom: 'right', x: 0.25, pose: 'fight', action: 'roar' },
      { puppet: 'ram', enterFrom: 'left', x: -0.25, pose: 'aim-bow', action: 'liberate' }
    ],
    dialogue: [
      { puppet: 'kumbhkarna', textEn: 'Blessed am I to behold the divine face of Ram at my final hour.', textHi: 'धन्य हुआ मैं, जो अंत समय में प्रभु श्रीराम के दिव्य दर्शन हुए।' }
    ],
    sfx: 'giant_footstep',
    music: { taal: 'teentaal', tempo: 104, mood: 'battle' },
    durationMs: 16000
  },
  {
    id: 'yud_33_meghnad_vadh',
    kand: 'Yuddha Kand',
    kandIndex: 6,
    titleEn: 'Lakshman Defeats Meghnad (Indrajit)',
    titleHi: 'लक्ष्मण द्वारा मेघनाद का उद्धार',
    narrationEn: 'In a fierce clash of cosmic astras, Lakshman disrupts Meghnad’s invincibility sacrifice and defeats the conqueror of Indra with supreme valor.',
    narrationHi: 'लक्ष्मण जी ने मेघनाद के गुप्त यज्ञ को भंग कर दिया और अद्वितीय वीरता से इंद्रजीत का वध कर लंका की सबसे बड़ी शक्ति को समाप्त किया।',
    backdrop: 'battlefield',
    actors: [
      { puppet: 'lakshman', enterFrom: 'left', x: -0.2, pose: 'aim-bow', action: 'astra-shoot' },
      { puppet: 'meghnad', enterFrom: 'right', x: 0.25, pose: 'fight', action: 'fall' }
    ],
    dialogue: [
      { puppet: 'lakshman', textEn: 'Righteousness alone triumphs, never illusion!', textHi: 'मायावी अस्त्रों से धर्म का तेज कभी नहीं ढकता!' }
    ],
    sfx: 'thunder_clash',
    music: { taal: 'teentaal', tempo: 108, mood: 'battle' },
    durationMs: 16000
  },
  {
    id: 'yud_34_ravan_vadh',
    kand: 'Yuddha Kand',
    kandIndex: 6,
    titleEn: 'The Final Battle — Defeat of Ravan',
    titleHi: 'महायज्ञ समापन: रावण वध व अधर्म का अंत',
    narrationEn: 'Invoking the sacred Brahmastra with Sun God Aditya Hridayam prayer, Shri Ram releases the luminous arrow into Ravan’s navel, ending the age of fear.',
    narrationHi: 'आदित्य हृदय स्तोत्र का स्मरण कर प्रभु श्रीराम ने ब्रह्मास्त्र संधान किया। दशानन रावण का अंत हुआ और धरा भयमुक्त हुई!',
    backdrop: 'battlefield',
    actors: [
      { puppet: 'ram', enterFrom: 'left', x: -0.25, pose: 'aim-bow', action: 'brahmastra' },
      { puppet: 'ravan', enterFrom: 'right', x: 0.25, pose: 'fight', action: 'defeat-light' }
    ],
    dialogue: [
      { puppet: 'sutradhar', textEn: 'Truth has prevailed over untruth! Light over darkness!', textHi: 'असत्य पर सत्य की विजय! अंधकार पर प्रकाश का विजय!' }
    ],
    sfx: 'brahmastra_burst',
    music: { taal: 'teentaal', tempo: 112, mood: 'victory' },
    durationMs: 18000
  },

  // ==================== 7. UTTARA & RETURN ====================
  {
    id: 'utt_35_reunion',
    kand: 'Uttara & Return',
    kandIndex: 7,
    titleEn: 'Divine Reunion of Ram & Sita',
    titleHi: 'प्रभु श्रीराम व माता सीता का पावन पुनर्मिलन',
    narrationEn: 'Agni Dev witnesses the unblemished purity of Mata Sita. With Vibhishan, Sugriv, and the vanar host, the victorious company prepares to return.',
    narrationHi: 'अग्निदेव ने स्वयं माता सीता की परम पवित्रता की साक्षी दी। विभीषण, सुग्रीव और वानर वीरों के साथ विजय दल अयोध्या वापसी को तत्पर हुआ।',
    backdrop: 'golden-lanka',
    actors: [
      { puppet: 'ram', enterFrom: 'left', x: -0.15, pose: 'bless', action: 'reunite' },
      { puppet: 'sita', enterFrom: 'right', x: 0.2, pose: 'bow', action: 'reunite' }
    ],
    dialogue: [
      { puppet: 'sita', textEn: 'The long night has ended. Dharma shines once more.', textHi: 'विरह की काली रात समाप्त हुई प्रभु, धर्म का सूर्य उदित हुआ।' }
    ],
    sfx: 'celestial_bells',
    music: { taal: 'kaharwa', tempo: 80, mood: 'devotional' },
    durationMs: 17000
  },
  {
    id: 'utt_36_pushpak_viman',
    kand: 'Uttara & Return',
    kandIndex: 7,
    titleEn: 'Homecoming on the Pushpak Viman',
    titleHi: 'पुष्पक विमान द्वारा आकाश गमन',
    narrationEn: 'Boarding the magical floral aerial chariot Pushpak Viman, Ram points out to Sita the Setu, Kishkindha, and the holy confluence at Prayagraj.',
    narrationHi: 'पुष्पक विमान पर सवार होकर प्रभु ने सीता को सेतु, किष्किन्धा और प्रयागराज त्रिवेणी के दर्शन कराते हुए अयोध्या की ओर प्रस्थान किया।',
    backdrop: 'panchavati',
    actors: [
      { puppet: 'ram', enterFrom: 'center', x: -0.1, pose: 'bless', action: 'viman-fly' },
      { puppet: 'sita', enterFrom: 'center', x: 0.15, pose: 'idle', action: 'viman-fly' }
    ],
    dialogue: [
      { puppet: 'ram', textEn: 'Behold, Janaki, the holy land of Avadh awaits us!', textHi: 'देखो सीते, वो हमारी जन्मभूमि अवधपुरी के दर्शन हो रहे हैं।' }
    ],
    sfx: 'celestial_drone',
    music: { taal: 'rupak', tempo: 76, mood: 'festive' },
    durationMs: 16000
  },
  {
    id: 'utt_37_deepotsav',
    kand: 'Uttara & Return',
    kandIndex: 7,
    titleEn: 'Deepotsav — Ayodhya Shines with Diyas',
    titleHi: 'अयोध्या दीपोत्सव: प्रथम दीपावली',
    narrationEn: 'Ayodhya explodes in ecstatic joy! Every home, ghat, and rooftop kindles clay oil lamps to welcome their rightful King. The festival of Diwali is born!',
    narrationHi: 'चौदह वर्ष का वनवास पूरा कर प्रभु लौटे! हर घर, घाट और महल में दीप जलाए गए। जगमगाती पहली दीपावली का उल्लास छा गया!',
    backdrop: 'diya-ayodhya',
    actors: [
      { puppet: 'ram', enterFrom: 'center', x: -0.1, pose: 'celebrate', action: 'diya-light' },
      { puppet: 'sita', enterFrom: 'right', x: 0.2, pose: 'celebrate', action: 'diya-light' },
      { puppet: 'bharat', enterFrom: 'left', x: -0.4, pose: 'bow', action: 'paduka-return' }
    ],
    dialogue: [
      { puppet: 'bharat', textEn: 'Our Lord has returned! Avadh lives again!', textHi: 'प्रभु लौट आए! हमारे राम लौट आए!' }
    ],
    sfx: 'festive_cheers',
    music: { taal: 'kaharwa', tempo: 98, mood: 'festive' },
    durationMs: 18000
  },
  {
    id: 'utt_38_rajyabhishek',
    kand: 'Uttara & Return',
    kandIndex: 7,
    titleEn: 'Grand Rajyabhishek & Universal Blessing',
    titleHi: 'भव्य श्रीराम राज्याभिषेक व मंगल आरती',
    narrationEn: 'Seated upon the golden throne of Ayodhya with Sita, Ram is anointed king amidst Vedic chants. May the reign of truth, love, and compassion bless all beings: Siyavar Ramchandra ki Jai!',
    narrationHi: 'रत्नजड़ित सिंहासन पर प्रभु श्रीराम और माता सीता का भव्य राज्याभिषेक हुआ। रामराज्य की स्थापना हुई जहां सब सुखी और निरोगी हैं। सियवर रामचंद्र की जय!',
    backdrop: 'ayodhya-palace',
    actors: [
      { puppet: 'ram', enterFrom: 'center', x: -0.1, pose: 'bless', action: 'coronation' },
      { puppet: 'sita', enterFrom: 'center', x: 0.15, pose: 'bless', action: 'coronation' },
      { puppet: 'hanuman', enterFrom: 'left', x: -0.45, pose: 'bow', action: 'bhakti' },
      { puppet: 'lakshman', enterFrom: 'right', x: 0.45, pose: 'walk', action: 'chhatra' }
    ],
    dialogue: [
      { puppet: 'sutradhar', textEn: 'Siyavar Ramchandra ki Jai! Pawanputra Hanuman ki Jai!', textHi: 'सियवर रामचंद्र की जय! पवनसुत हनुमान की जय! बोलो अवधपति रामचंद्र की जय!' }
    ],
    sfx: 'shankh_maha_aarti',
    music: { taal: 'teentaal', tempo: 104, mood: 'victory' },
    durationMs: 20000
  }
];
