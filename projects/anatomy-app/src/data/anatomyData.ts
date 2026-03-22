export interface AnatomyTerm {
  id: string;
  term: string;
  pronunciation: string;
  definition: string;
  etymology: {
    roots: EtymologyRoot[];
    fullBreakdown: string;
    language: string;
    year?: string;
  };
  system: BodySystem;
  category: 'organ' | 'tissue' | 'process' | 'condition' | 'structure' | 'cell';
  relatedTerms: string[];
  conceptConnections: ConceptConnection[];
  emoji: string;
  color: string;
  funFact: string;
  mnemonic?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface EtymologyRoot {
  root: string;
  language: 'Greek' | 'Latin' | 'Old English' | 'Arabic' | 'French';
  meaning: string;
  examples: string[];
}

export interface ConceptConnection {
  termId: string;
  relationship: string;
  strength: 'strong' | 'moderate' | 'weak';
}

export type BodySystem =
  | 'cardiovascular'
  | 'respiratory'
  | 'nervous'
  | 'digestive'
  | 'musculoskeletal'
  | 'endocrine'
  | 'immune'
  | 'integumentary'
  | 'urinary'
  | 'reproductive';

export const SYSTEM_COLORS: Record<BodySystem, string> = {
  cardiovascular: '#e74c3c',
  respiratory: '#3498db',
  nervous: '#9b59b6',
  digestive: '#e67e22',
  musculoskeletal: '#1abc9c',
  endocrine: '#f39c12',
  immune: '#2ecc71',
  integumentary: '#e91e63',
  urinary: '#00bcd4',
  reproductive: '#ff6b9d',
};

export const SYSTEM_EMOJIS: Record<BodySystem, string> = {
  cardiovascular: '❤️',
  respiratory: '🫁',
  nervous: '🧠',
  digestive: '🫃',
  musculoskeletal: '💪',
  endocrine: '⚗️',
  immune: '🛡️',
  integumentary: '🧴',
  urinary: '💧',
  reproductive: '🌱',
};

export const ANATOMY_TERMS: AnatomyTerm[] = [
  // ─── CARDIOVASCULAR ────────────────────────────────────────────────────────
  {
    id: 'cardiac',
    term: 'Cardiac',
    pronunciation: 'KAR-dee-ak',
    definition: 'Relating to the heart and its function in pumping blood throughout the body.',
    etymology: {
      roots: [{ root: 'kardia', language: 'Greek', meaning: 'heart', examples: ['cardiology', 'pericardium', 'myocardium'] }],
      fullBreakdown: 'From Greek "kardia" (heart). The Greeks believed the heart was the seat of the soul and emotions.',
      language: 'Greek', year: '14th century',
    },
    system: 'cardiovascular', category: 'organ', difficulty: 'beginner',
    relatedTerms: ['myocardium', 'pericardium', 'tachycardia'],
    conceptConnections: [
      { termId: 'myocardium', relationship: 'is a layer of', strength: 'strong' },
      { termId: 'tachycardia', relationship: 'abnormal condition of', strength: 'strong' },
      { termId: 'aorta', relationship: 'pumps blood into', strength: 'strong' },
      { termId: 'hemoglobin', relationship: 'circulates via pumping', strength: 'moderate' },
    ],
    emoji: '❤️', color: '#e74c3c',
    funFact: 'The heart beats about 100,000 times per day and pumps roughly 2,000 gallons of blood!',
    mnemonic: 'CARDIAC = Can A Regular Doctor Identify All Chambers?',
  },
  {
    id: 'myocardium',
    term: 'Myocardium',
    pronunciation: 'my-oh-KAR-dee-um',
    definition: 'The muscular middle layer of the heart wall responsible for the heart\'s pumping action.',
    etymology: {
      roots: [
        { root: 'mys/myos', language: 'Greek', meaning: 'muscle', examples: ['myology', 'myalgia', 'myosin'] },
        { root: 'kardia', language: 'Greek', meaning: 'heart', examples: ['cardiac', 'cardiology', 'pericardium'] },
      ],
      fullBreakdown: '"Myo" (muscle) + "cardium" (heart) = the muscle of the heart.',
      language: 'Greek',
    },
    system: 'cardiovascular', category: 'tissue', difficulty: 'intermediate',
    relatedTerms: ['cardiac', 'pericardium', 'endocardium'],
    conceptConnections: [
      { termId: 'cardiac', relationship: 'makes up the wall of', strength: 'strong' },
      { termId: 'tachycardia', relationship: 'stressed during', strength: 'moderate' },
    ],
    emoji: '🫀', color: '#c0392b',
    funFact: 'Myocardium is unique — cardiac muscle is involuntary but striated, unlike any other muscle type.',
    mnemonic: 'MYO = MY Oh my, it\'s the muscle!',
  },
  {
    id: 'tachycardia',
    term: 'Tachycardia',
    pronunciation: 'tak-ee-KAR-dee-ah',
    definition: 'An abnormally rapid heart rate, typically defined as more than 100 beats per minute at rest.',
    etymology: {
      roots: [
        { root: 'tachys', language: 'Greek', meaning: 'swift, rapid', examples: ['tachometer', 'tachyon', 'tachypnea'] },
        { root: 'kardia', language: 'Greek', meaning: 'heart', examples: ['cardiac', 'myocardium', 'bradycardia'] },
      ],
      fullBreakdown: '"Tachy" (fast) + "cardia" (heart) = fast heart. Opposite: brady (slow) = bradycardia.',
      language: 'Greek',
    },
    system: 'cardiovascular', category: 'condition', difficulty: 'intermediate',
    relatedTerms: ['bradycardia', 'arrhythmia', 'cardiac'],
    conceptConnections: [
      { termId: 'cardiac', relationship: 'abnormal state of', strength: 'strong' },
      { termId: 'bradycardia', relationship: 'opposite of', strength: 'strong' },
      { termId: 'homeostasis', relationship: 'disrupts cardiovascular', strength: 'moderate' },
    ],
    emoji: '⚡', color: '#e74c3c',
    funFact: 'Coffee, stress, and exercise can all cause temporary tachycardia in healthy people.',
    mnemonic: 'TACHY = "Tackle" your racing heart — it\'s going too fast!',
  },
  {
    id: 'bradycardia',
    term: 'Bradycardia',
    pronunciation: 'brad-ee-KAR-dee-ah',
    definition: 'An abnormally slow heart rate, typically defined as fewer than 60 beats per minute at rest.',
    etymology: {
      roots: [
        { root: 'bradys', language: 'Greek', meaning: 'slow', examples: ['bradypus (sloth)', 'bradykinesia', 'bradypnea'] },
        { root: 'kardia', language: 'Greek', meaning: 'heart', examples: ['cardiac', 'tachycardia', 'myocardium'] },
      ],
      fullBreakdown: '"Brady" (slow) + "cardia" (heart) = slow heart. The sloth (Bradypus) literally means "slow foot"!',
      language: 'Greek',
    },
    system: 'cardiovascular', category: 'condition', difficulty: 'intermediate',
    relatedTerms: ['tachycardia', 'arrhythmia', 'cardiac'],
    conceptConnections: [
      { termId: 'tachycardia', relationship: 'opposite of', strength: 'strong' },
      { termId: 'cardiac', relationship: 'abnormal state of', strength: 'strong' },
    ],
    emoji: '🐢', color: '#c0392b',
    funFact: 'Elite athletes often have bradycardia naturally — their trained hearts pump so efficiently they beat less often.',
    mnemonic: 'BRADY = slow like Sunday traffic',
  },
  {
    id: 'aorta',
    term: 'Aorta',
    pronunciation: 'ay-OR-tah',
    definition: 'The largest artery in the body, arising from the left ventricle and distributing oxygenated blood to all body tissues.',
    etymology: {
      roots: [{ root: 'aorte', language: 'Greek', meaning: 'the great artery, to lift or carry', examples: ['aortic', 'aortitis'] }],
      fullBreakdown: 'From Greek "aorte" meaning to lift — it literally lifts and carries blood from the heart.',
      language: 'Greek', year: '16th century',
    },
    system: 'cardiovascular', category: 'structure', difficulty: 'beginner',
    relatedTerms: ['cardiac', 'ventricle', 'artery'],
    conceptConnections: [
      { termId: 'cardiac', relationship: 'receives blood from', strength: 'strong' },
      { termId: 'ventricle', relationship: 'originates from left', strength: 'strong' },
    ],
    emoji: '🩸', color: '#e74c3c',
    funFact: 'The aorta is about the diameter of a garden hose and withstands enormous pressure with every heartbeat.',
  },
  {
    id: 'ventricle',
    term: 'Ventricle',
    pronunciation: 'VEN-trih-kul',
    definition: 'One of the two lower chambers of the heart that pump blood out to the lungs (right) or the entire body (left).',
    etymology: {
      roots: [{ root: 'ventriculus', language: 'Latin', meaning: 'little belly, small cavity', examples: ['ventricular', 'ventriculitis'] }],
      fullBreakdown: 'From Latin "ventriculus" (little belly). Also applies to brain ventricles — fluid-filled brain cavities.',
      language: 'Latin',
    },
    system: 'cardiovascular', category: 'structure', difficulty: 'beginner',
    relatedTerms: ['atrium', 'aorta', 'cardiac'],
    conceptConnections: [
      { termId: 'aorta', relationship: 'left ventricle feeds', strength: 'strong' },
      { termId: 'cardiac', relationship: 'chamber of', strength: 'strong' },
      { termId: 'atrium', relationship: 'receives blood from', strength: 'strong' },
    ],
    emoji: '🔲', color: '#e74c3c',
    funFact: 'The left ventricle wall is three times thicker than the right, because it pumps blood to the whole body.',
    mnemonic: 'VENTRICLE = VENTs blood out (pumps out)',
  },
  {
    id: 'atrium',
    term: 'Atrium',
    pronunciation: 'AY-tree-um',
    definition: 'One of the two upper chambers of the heart that receive blood and pump it into the ventricles below.',
    etymology: {
      roots: [{ root: 'atrium', language: 'Latin', meaning: 'entrance hall, central room of a Roman house', examples: ['atrial', 'atrioventricular'] }],
      fullBreakdown: 'From Latin "atrium" — the open central hall of a Roman house. Blood enters the atria like guests entering a hall.',
      language: 'Latin',
    },
    system: 'cardiovascular', category: 'structure', difficulty: 'beginner',
    relatedTerms: ['ventricle', 'cardiac', 'sinoatrial'],
    conceptConnections: [
      { termId: 'ventricle', relationship: 'pumps blood into', strength: 'strong' },
      { termId: 'cardiac', relationship: 'upper chamber of', strength: 'strong' },
    ],
    emoji: '🏛️', color: '#e74c3c',
    funFact: 'The right atrium contains the sinoatrial (SA) node — the heart\'s natural pacemaker.',
    mnemonic: 'ATRIUM = ENTRY hall of the heart (like an atrium of a building)',
  },
  {
    id: 'capillary',
    term: 'Capillary',
    pronunciation: 'KAP-ih-lair-ee',
    definition: 'The tiniest blood vessels in the body, forming networks where oxygen, nutrients, and waste are exchanged between blood and tissues.',
    etymology: {
      roots: [{ root: 'capillaris', language: 'Latin', meaning: 'relating to hair', examples: ['capillary', 'capillarity'] }],
      fullBreakdown: 'From Latin "capillus" (hair) — capillaries are so thin they were named after a strand of hair.',
      language: 'Latin',
    },
    system: 'cardiovascular', category: 'structure', difficulty: 'beginner',
    relatedTerms: ['artery', 'vein', 'hemoglobin', 'alveoli'],
    conceptConnections: [
      { termId: 'hemoglobin', relationship: 'delivers oxygen through walls of', strength: 'strong' },
      { termId: 'alveoli', relationship: 'surrounds for gas exchange', strength: 'strong' },
      { termId: 'glomerulus', relationship: 'forms ball of in kidney', strength: 'strong' },
      { termId: 'villi', relationship: 'inside for nutrient absorption', strength: 'strong' },
    ],
    emoji: '🕸️', color: '#e74c3c',
    funFact: 'Capillary walls are only one cell thick — thin enough for a single red blood cell to squeeze through!',
    mnemonic: 'CAPILLARY = as thin as a CAPillary of hair',
  },

  // ─── RESPIRATORY ───────────────────────────────────────────────────────────
  {
    id: 'alveoli',
    term: 'Alveoli',
    pronunciation: 'al-VEE-oh-lye',
    definition: 'Tiny air sacs in the lungs where gas exchange occurs between inhaled air and the bloodstream.',
    etymology: {
      roots: [{ root: 'alveolus', language: 'Latin', meaning: 'small cavity, hollow, pit', examples: ['alveolar', 'alveolitis'] }],
      fullBreakdown: 'From Latin "alveolus" (small hollow), diminutive of "alveus" (hollow, trough).',
      language: 'Latin',
    },
    system: 'respiratory', category: 'structure', difficulty: 'beginner',
    relatedTerms: ['bronchiole', 'hemoglobin', 'capillary'],
    conceptConnections: [
      { termId: 'bronchiole', relationship: 'located at the end of', strength: 'strong' },
      { termId: 'hemoglobin', relationship: 'exchanges gas with', strength: 'strong' },
      { termId: 'capillary', relationship: 'surrounded by pulmonary', strength: 'strong' },
    ],
    emoji: '🫧', color: '#3498db',
    funFact: 'The total surface area of all alveoli is roughly the size of a tennis court — about 70 square meters!',
    mnemonic: 'ALVEOLI = A Little Vessel Every One Loaded with air Inside',
  },
  {
    id: 'bronchiole',
    term: 'Bronchiole',
    pronunciation: 'BRONG-kee-ole',
    definition: 'The smallest air-conducting tubes of the lungs, branching from the bronchi and leading to the alveoli.',
    etymology: {
      roots: [
        { root: 'bronkhos', language: 'Greek', meaning: 'windpipe, throat', examples: ['bronchitis', 'bronchoscopy', 'bronchiectasis'] },
        { root: '-ole', language: 'Latin', meaning: 'small (diminutive suffix)', examples: ['arteriole', 'bronchiole', 'venule'] },
      ],
      fullBreakdown: '"Bronkhos" (windpipe) + "-ole" (tiny) = tiny airway. Airways branch like a tree: trachea → bronchi → bronchioles → alveoli.',
      language: 'Greek/Latin',
    },
    system: 'respiratory', category: 'structure', difficulty: 'intermediate',
    relatedTerms: ['alveoli', 'bronchus', 'trachea'],
    conceptConnections: [
      { termId: 'alveoli', relationship: 'leads to', strength: 'strong' },
      { termId: 'trachea', relationship: 'branches from via bronchi', strength: 'moderate' },
      { termId: 'diaphragm', relationship: 'air driven through by', strength: 'moderate' },
    ],
    emoji: '🌿', color: '#2980b9',
    funFact: 'Each lung has about 30,000 bronchioles. During asthma, these passages narrow making breathing hard.',
    mnemonic: 'BRONCHIOLE = BRONCO + HOLE — tiny air hole',
  },
  {
    id: 'trachea',
    term: 'Trachea',
    pronunciation: 'TRAY-kee-ah',
    definition: 'The windpipe — a cartilage-reinforced tube connecting the larynx to the bronchi, conducting air to the lungs.',
    etymology: {
      roots: [{ root: 'tracheia arteria', language: 'Greek', meaning: 'rough artery', examples: ['tracheal', 'tracheotomy', 'tracheitis'] }],
      fullBreakdown: 'From Greek "tracheia" (rough) — early anatomists noted its bumpy ridged appearance from C-shaped cartilage rings.',
      language: 'Greek',
    },
    system: 'respiratory', category: 'structure', difficulty: 'beginner',
    relatedTerms: ['bronchiole', 'larynx', 'esophagus'],
    conceptConnections: [
      { termId: 'bronchiole', relationship: 'splits into bronchi leading to', strength: 'strong' },
      { termId: 'esophagus', relationship: 'runs parallel and anterior to', strength: 'moderate' },
      { termId: 'diaphragm', relationship: 'connected via airway to', strength: 'moderate' },
    ],
    emoji: '🫁', color: '#3498db',
    funFact: 'The trachea is kept open by 16-20 C-shaped rings of cartilage. When you swallow, the epiglottis covers it.',
    mnemonic: 'TRACHEA = TRACk for air (a track that carries air down)',
  },
  {
    id: 'diaphragm',
    term: 'Diaphragm',
    pronunciation: 'DY-ah-fram',
    definition: 'The dome-shaped muscle below the lungs that is the primary muscle of breathing, contracting to create inhalation.',
    etymology: {
      roots: [{ root: 'diaphragma', language: 'Greek', meaning: 'partition, fence across', examples: ['diaphragmatic', 'diaphragm'] }],
      fullBreakdown: '"Dia" (across) + "phragma" (fence/partition) = fence across the body. Divides chest from abdomen.',
      language: 'Greek',
    },
    system: 'respiratory', category: 'organ', difficulty: 'beginner',
    relatedTerms: ['trachea', 'bronchiole', 'alveoli'],
    conceptConnections: [
      { termId: 'alveoli', relationship: 'drives air into by contracting', strength: 'strong' },
      { termId: 'trachea', relationship: 'creates airflow through', strength: 'moderate' },
    ],
    emoji: '🎵', color: '#3498db',
    funFact: 'Hiccups are caused by involuntary spasms of the diaphragm. The world record for hiccuping is 68 years!',
    mnemonic: 'DIAPHRAGM = Draws In Air; PHysically Raises And Goes down More',
  },

  // ─── NERVOUS ────────────────────────────────────────────────────────────────
  {
    id: 'neuron',
    term: 'Neuron',
    pronunciation: 'NYOO-ron',
    definition: 'The fundamental cellular unit of the nervous system, specialized for receiving, processing, and transmitting information via electrical and chemical signals.',
    etymology: {
      roots: [{ root: 'neuron', language: 'Greek', meaning: 'nerve, sinew', examples: ['neural', 'neurology', 'neurotransmitter', 'neuralgia'] }],
      fullBreakdown: 'From Greek "neuron" (nerve/sinew). Greeks used this for both nerves and tendons before understanding their differences.',
      language: 'Greek', year: '19th century',
    },
    system: 'nervous', category: 'cell', difficulty: 'beginner',
    relatedTerms: ['synapse', 'axon', 'dendrite', 'myelin'],
    conceptConnections: [
      { termId: 'synapse', relationship: 'communicates via', strength: 'strong' },
      { termId: 'axon', relationship: 'transmits signals through', strength: 'strong' },
      { termId: 'dendrite', relationship: 'receives signals through', strength: 'strong' },
      { termId: 'myelin', relationship: 'insulated by', strength: 'strong' },
      { termId: 'cerebellum', relationship: 'most abundant in', strength: 'moderate' },
    ],
    emoji: '⚡', color: '#9b59b6',
    funFact: 'You have approximately 86 billion neurons! Neural signals can travel up to 268 mph.',
    mnemonic: 'NEURON = Never Ever Use Rush Orders Now',
  },
  {
    id: 'synapse',
    term: 'Synapse',
    pronunciation: 'SIN-aps',
    definition: 'The junction between two neurons where nerve impulses are transmitted by neurotransmitters crossing a tiny gap.',
    etymology: {
      roots: [
        { root: 'syn-', language: 'Greek', meaning: 'together', examples: ['synthesis', 'synchronize', 'syndrome'] },
        { root: 'haptein', language: 'Greek', meaning: 'to fasten, clasp', examples: ['haptic'] },
      ],
      fullBreakdown: '"Syn" (together) + "haptein" (to clasp) = to clasp together. The gap where neurons "clasp" across.',
      language: 'Greek', year: '1897',
    },
    system: 'nervous', category: 'structure', difficulty: 'intermediate',
    relatedTerms: ['neuron', 'axon', 'dendrite'],
    conceptConnections: [
      { termId: 'neuron', relationship: 'connects neurons together', strength: 'strong' },
      { termId: 'axon', relationship: 'releases chemicals from', strength: 'strong' },
      { termId: 'dendrite', relationship: 'received by', strength: 'strong' },
    ],
    emoji: '🔗', color: '#8e44ad',
    funFact: 'There are about 100 trillion synapses in the brain — more connections than stars in the Milky Way!',
  },
  {
    id: 'axon',
    term: 'Axon',
    pronunciation: 'AK-son',
    definition: 'The long projection of a neuron that conducts electrical impulses away from the cell body toward other neurons or effector organs.',
    etymology: {
      roots: [{ root: 'axon', language: 'Greek', meaning: 'axis, axle', examples: ['axial', 'axoneme'] }],
      fullBreakdown: 'From Greek "axon" meaning axis or axle — like the axle of a wheel, it\'s the central conducting shaft.',
      language: 'Greek',
    },
    system: 'nervous', category: 'structure', difficulty: 'intermediate',
    relatedTerms: ['neuron', 'dendrite', 'myelin', 'synapse'],
    conceptConnections: [
      { termId: 'neuron', relationship: 'part of', strength: 'strong' },
      { termId: 'myelin', relationship: 'wrapped in', strength: 'strong' },
      { termId: 'synapse', relationship: 'terminates at', strength: 'strong' },
      { termId: 'dendrite', relationship: 'opposite function of', strength: 'moderate' },
    ],
    emoji: '📡', color: '#9b59b6',
    funFact: 'Some axons can be over 3 feet long — running from your spine all the way to your toes!',
    mnemonic: 'AXON = Away from the cell body (Axon = Away)',
  },
  {
    id: 'dendrite',
    term: 'Dendrite',
    pronunciation: 'DEN-dryte',
    definition: 'Branch-like projections of a neuron that receive signals from other neurons and conduct them toward the cell body.',
    etymology: {
      roots: [{ root: 'dendron', language: 'Greek', meaning: 'tree', examples: ['rhododendron', 'philodendron', 'dendrology'] }],
      fullBreakdown: 'From Greek "dendron" (tree) because the branching structures look like tree branches.',
      language: 'Greek',
    },
    system: 'nervous', category: 'structure', difficulty: 'intermediate',
    relatedTerms: ['neuron', 'axon', 'synapse'],
    conceptConnections: [
      { termId: 'neuron', relationship: 'part of', strength: 'strong' },
      { termId: 'synapse', relationship: 'receives signals at', strength: 'strong' },
      { termId: 'axon', relationship: 'opposite function of', strength: 'moderate' },
    ],
    emoji: '🌿', color: '#8e44ad',
    funFact: 'A single neuron can have up to 10,000 dendritic branches receiving input from thousands of other neurons.',
    mnemonic: 'DENDRITE = DENDRite receives, like tree branches catch sunlight',
  },
  {
    id: 'myelin',
    term: 'Myelin',
    pronunciation: 'MY-uh-lin',
    definition: 'A fatty white substance forming a sheath around nerve fibers that insulates them and dramatically increases signal speed.',
    etymology: {
      roots: [{ root: 'myelos', language: 'Greek', meaning: 'marrow, of the spinal cord', examples: ['myeloma', 'myelitis', 'myeloid'] }],
      fullBreakdown: 'From Greek "myelos" meaning marrow — early anatomists thought this substance resembled bone marrow.',
      language: 'Greek',
    },
    system: 'nervous', category: 'tissue', difficulty: 'intermediate',
    relatedTerms: ['axon', 'neuron', 'schwann cell'],
    conceptConnections: [
      { termId: 'axon', relationship: 'insulates', strength: 'strong' },
      { termId: 'neuron', relationship: 'speeds signal in', strength: 'strong' },
    ],
    emoji: '🧤', color: '#9b59b6',
    funFact: 'Myelin increases nerve signal speed from 2 mph to 268 mph — a 134x speed increase!',
    mnemonic: 'MYELIN = MY Electrical insulation LINe',
  },
  {
    id: 'hypothalamus',
    term: 'Hypothalamus',
    pronunciation: 'hy-poh-THAL-ah-mus',
    definition: 'A small brain region linking the nervous and endocrine systems, regulating temperature, hunger, thirst, sleep, and hormones.',
    etymology: {
      roots: [
        { root: 'hypo-', language: 'Greek', meaning: 'under, below', examples: ['hypotension', 'hypoglycemia', 'hypothermia'] },
        { root: 'thalamos', language: 'Greek', meaning: 'inner chamber, bedroom', examples: ['thalamus', 'epithalamus'] },
      ],
      fullBreakdown: '"Hypo" (under) + "thalamus" (inner chamber) = the structure under the thalamus.',
      language: 'Greek',
    },
    system: 'nervous', category: 'organ', difficulty: 'advanced',
    relatedTerms: ['homeostasis', 'neuron', 'cortisol'],
    conceptConnections: [
      { termId: 'homeostasis', relationship: 'master regulator of', strength: 'strong' },
      { termId: 'neuron', relationship: 'composed of', strength: 'strong' },
      { termId: 'cortisol', relationship: 'regulates stress response triggering', strength: 'strong' },
      { termId: 'insulin', relationship: 'coordinates signals for', strength: 'moderate' },
    ],
    emoji: '🎛️', color: '#8e44ad',
    funFact: 'The hypothalamus is almond-sized but controls hunger, thirst, body temperature, sleep, and sex drive!',
    mnemonic: 'HYPO-THALAMUS = Below Chamber = your body\'s thermostat',
  },
  {
    id: 'cerebellum',
    term: 'Cerebellum',
    pronunciation: 'sehr-eh-BEL-um',
    definition: 'The "little brain" at the back of the skull that coordinates voluntary movements, balance, and fine motor control.',
    etymology: {
      roots: [{ root: 'cerebellum', language: 'Latin', meaning: 'little brain (diminutive of cerebrum)', examples: ['cerebellar', 'cerebellitis'] }],
      fullBreakdown: 'Diminutive of Latin "cerebrum" (brain) — literally "little brain." Contains more neurons than the rest of the brain combined.',
      language: 'Latin',
    },
    system: 'nervous', category: 'organ', difficulty: 'beginner',
    relatedTerms: ['cerebrum', 'neuron', 'motor cortex'],
    conceptConnections: [
      { termId: 'neuron', relationship: 'contains over half the body\'s', strength: 'strong' },
      { termId: 'myelin', relationship: 'neural pathways use', strength: 'moderate' },
    ],
    emoji: '🧠', color: '#9b59b6',
    funFact: 'The cerebellum is only 10% of brain volume but holds more than 50% of all the brain\'s neurons!',
    mnemonic: 'CEREBELLUM = little BELL-shaped brain at the back (bellum = little)',
  },
  {
    id: 'meninges',
    term: 'Meninges',
    pronunciation: 'meh-NIN-jeez',
    definition: 'The three protective membranes (dura mater, arachnoid, pia mater) that envelop the brain and spinal cord.',
    etymology: {
      roots: [{ root: 'meninx', language: 'Greek', meaning: 'membrane', examples: ['meningitis', 'meningocele', 'meningeal'] }],
      fullBreakdown: 'From Greek "meninx" (membrane). Three layers: Dura (tough), Arachnoid (spider-like), Pia (tender/soft).',
      language: 'Greek',
    },
    system: 'nervous', category: 'tissue', difficulty: 'advanced',
    relatedTerms: ['cerebellum', 'neuron', 'cerebrospinal fluid'],
    conceptConnections: [
      { termId: 'cerebellum', relationship: 'protects and encloses', strength: 'strong' },
      { termId: 'neuron', relationship: 'cushions and protects', strength: 'moderate' },
    ],
    emoji: '🫶', color: '#8e44ad',
    funFact: 'Meningitis is inflammation of these membranes — one of medicine\'s most dangerous emergencies.',
    mnemonic: 'MENINGES = MENINGitis is the inflammation of MENINGES',
  },

  // ─── DIGESTIVE ───────────────────────────────────────────────────────────────
  {
    id: 'peristalsis',
    term: 'Peristalsis',
    pronunciation: 'peh-rih-STAL-sis',
    definition: 'The involuntary wave-like muscular contractions that propel food through the digestive tract.',
    etymology: {
      roots: [
        { root: 'peri-', language: 'Greek', meaning: 'around', examples: ['perimeter', 'pericardium', 'periosteum'] },
        { root: 'stellein', language: 'Greek', meaning: 'to compress, to place', examples: ['peristalsis', 'systole', 'diastole'] },
      ],
      fullBreakdown: '"Peri" (around) + "stellein" (to compress) = compressing around — like squeezing toothpaste.',
      language: 'Greek',
    },
    system: 'digestive', category: 'process', difficulty: 'intermediate',
    relatedTerms: ['esophagus', 'stomach', 'intestine'],
    conceptConnections: [
      { termId: 'esophagus', relationship: 'moves food through', strength: 'strong' },
      { termId: 'villi', relationship: 'food moved past', strength: 'moderate' },
    ],
    emoji: '🌊', color: '#e67e22',
    funFact: 'Peristalsis is so powerful you can swallow food while standing on your head — gravity is irrelevant!',
    mnemonic: 'PERI-STALSIS = PERIodic waves that move food along',
  },
  {
    id: 'esophagus',
    term: 'Esophagus',
    pronunciation: 'ih-SOF-ah-gus',
    definition: 'The muscular tube connecting the throat to the stomach, through which food passes during swallowing.',
    etymology: {
      roots: [
        { root: 'oisein', language: 'Greek', meaning: 'to carry', examples: [] },
        { root: 'phagein', language: 'Greek', meaning: 'to eat', examples: ['phagocyte', 'dysphagia', 'macrophage'] },
      ],
      fullBreakdown: '"Oiso" (carry) + "phagein" (eat) = the carrier of food. Related to phagocyte (cell that eats)!',
      language: 'Greek',
    },
    system: 'digestive', category: 'organ', difficulty: 'beginner',
    relatedTerms: ['peristalsis', 'stomach', 'pharynx'],
    conceptConnections: [
      { termId: 'peristalsis', relationship: 'propelled by', strength: 'strong' },
      { termId: 'trachea', relationship: 'runs posterior and parallel to', strength: 'moderate' },
    ],
    emoji: '🫗', color: '#d35400',
    funFact: 'The esophagus is only about 25 cm long but can stretch considerably to accommodate large food.',
    mnemonic: 'ESO-PHAGUS = the EATING pathway (phagus = eating)',
  },
  {
    id: 'hepatic',
    term: 'Hepatic',
    pronunciation: 'heh-PAT-ik',
    definition: 'Relating to the liver — the body\'s largest internal organ responsible for metabolism, detoxification, and bile production.',
    etymology: {
      roots: [{ root: 'hepar/hepat', language: 'Greek', meaning: 'liver', examples: ['hepatitis', 'hepatology', 'hepatocyte', 'hepatomegaly'] }],
      fullBreakdown: 'From Greek "hepar" (liver). Ancient Greeks considered the liver more important than the heart — seat of courage and the soul!',
      language: 'Greek',
    },
    system: 'digestive', category: 'organ', difficulty: 'beginner',
    relatedTerms: ['bile', 'hepatitis', 'gluconeogenesis'],
    conceptConnections: [
      { termId: 'homeostasis', relationship: 'maintains blood glucose', strength: 'strong' },
      { termId: 'erythrocyte', relationship: 'breaks down aged', strength: 'moderate' },
      { termId: 'insulin', relationship: 'responds to signals to store glucose', strength: 'strong' },
    ],
    emoji: '🟤', color: '#e67e22',
    funFact: 'The liver performs over 500 distinct metabolic functions and is the only organ that can fully regenerate!',
    mnemonic: 'HEPATIC = HEP A, B, C are all LIVER diseases — hepatic = liver',
  },
  {
    id: 'villi',
    term: 'Villi',
    pronunciation: 'VIL-eye',
    definition: 'Tiny finger-like projections lining the small intestine that enormously increase the surface area available for nutrient absorption.',
    etymology: {
      roots: [{ root: 'villus', language: 'Latin', meaning: 'tuft of hair, shaggy hair', examples: ['villous', 'microvilli', 'villiform'] }],
      fullBreakdown: 'From Latin "villus" (shaggy hair) — the intestinal lining looks like a shag carpet under the microscope.',
      language: 'Latin',
    },
    system: 'digestive', category: 'structure', difficulty: 'intermediate',
    relatedTerms: ['microvilli', 'absorption', 'small intestine', 'capillary'],
    conceptConnections: [
      { termId: 'peristalsis', relationship: 'food moved past by', strength: 'moderate' },
      { termId: 'capillary', relationship: 'contains inside for nutrient uptake', strength: 'strong' },
    ],
    emoji: '🌾', color: '#e67e22',
    funFact: 'Villi increase the intestinal surface area to 250 m² — the size of a doubles tennis court!',
    mnemonic: 'VILLI = VILLage of tiny fingers reaching up to grab nutrients',
  },

  // ─── MUSCULOSKELETAL ──────────────────────────────────────────────────────────
  {
    id: 'osteoporosis',
    term: 'Osteoporosis',
    pronunciation: 'os-tee-oh-poh-ROH-sis',
    definition: 'A condition where bones become weak and brittle due to loss of bone density, making them prone to fractures.',
    etymology: {
      roots: [
        { root: 'osteon', language: 'Greek', meaning: 'bone', examples: ['osteology', 'osteoarthritis', 'osteocyte', 'periosteum'] },
        { root: 'poros', language: 'Greek', meaning: 'pore, passage, small hole', examples: ['porous', 'porosity'] },
        { root: '-osis', language: 'Greek', meaning: 'condition of, process', examples: ['fibrosis', 'cirrhosis', 'thrombosis'] },
      ],
      fullBreakdown: '"Osteo" (bone) + "porosis" (full of pores) = porous bone condition. Bones become like Swiss cheese!',
      language: 'Greek',
    },
    system: 'musculoskeletal', category: 'condition', difficulty: 'intermediate',
    relatedTerms: ['osteocyte', 'calcium', 'osteoblast', 'osteoclast'],
    conceptConnections: [
      { termId: 'homeostasis', relationship: 'failure of bone homeostasis', strength: 'moderate' },
      { termId: 'osteoblast', relationship: 'reduced activity causes', strength: 'strong' },
      { termId: 'osteoclast', relationship: 'excess activity causes', strength: 'strong' },
    ],
    emoji: '🦴', color: '#1abc9c',
    funFact: 'Astronauts lose 1-2% of bone mass per month in space due to lack of gravitational stress!',
    mnemonic: 'OSTEO-POROSIS = porous BONE disease',
  },
  {
    id: 'osteoblast',
    term: 'Osteoblast',
    pronunciation: 'OS-tee-oh-blast',
    definition: 'Bone-forming cells that synthesize and secrete the organic components of bone matrix and initiate mineralization.',
    etymology: {
      roots: [
        { root: 'osteon', language: 'Greek', meaning: 'bone', examples: ['osteology', 'osteocyte', 'osteoporosis'] },
        { root: 'blastos', language: 'Greek', meaning: 'germ, sprout, builder', examples: ['fibroblast', 'erythroblast', 'neuroblast'] },
      ],
      fullBreakdown: '"Osteo" (bone) + "blast" (builder/sprout) = bone builder. Osteoblasts BUILD; Osteoclasts BREAK DOWN.',
      language: 'Greek',
    },
    system: 'musculoskeletal', category: 'cell', difficulty: 'advanced',
    relatedTerms: ['osteoclast', 'osteocyte', 'osteoporosis', 'calcium'],
    conceptConnections: [
      { termId: 'osteoporosis', relationship: 'reduced activity leads to', strength: 'strong' },
      { termId: 'osteoclast', relationship: 'opposes action of', strength: 'strong' },
      { termId: 'homeostasis', relationship: 'maintains bone balance with osteoclasts', strength: 'strong' },
      { termId: 'collagen', relationship: 'secretes as bone matrix', strength: 'strong' },
    ],
    emoji: '🏗️', color: '#1abc9c',
    funFact: 'Your entire skeleton is rebuilt roughly every 10 years through combined action of osteoblasts and osteoclasts.',
    mnemonic: 'OSTEO-BLAST = bone BLAST (build) — blasters BUILD things up!',
  },
  {
    id: 'osteoclast',
    term: 'Osteoclast',
    pronunciation: 'OS-tee-oh-klast',
    definition: 'Large multinucleated cells that break down (resorb) bone tissue, releasing calcium and enabling bone remodeling.',
    etymology: {
      roots: [
        { root: 'osteon', language: 'Greek', meaning: 'bone', examples: ['osteoblast', 'osteocyte', 'osteoporosis'] },
        { root: 'klastos', language: 'Greek', meaning: 'broken, to break', examples: ['clastic', 'iconoclast', 'osteoclast'] },
      ],
      fullBreakdown: '"Osteo" (bone) + "clast" (to break) = bone breaker. Opposes osteoblasts.',
      language: 'Greek',
    },
    system: 'musculoskeletal', category: 'cell', difficulty: 'advanced',
    relatedTerms: ['osteoblast', 'osteocyte', 'osteoporosis'],
    conceptConnections: [
      { termId: 'osteoblast', relationship: 'opposes in bone remodeling', strength: 'strong' },
      { termId: 'homeostasis', relationship: 'balances bone density with osteoblasts', strength: 'strong' },
      { termId: 'osteoporosis', relationship: 'excess activity contributes to', strength: 'strong' },
    ],
    emoji: '⛏️', color: '#1abc9c',
    funFact: 'Osteoclasts are among the largest cells in the body and can have up to 50 nuclei!',
    mnemonic: 'OSTEO-CLAST = bone CLAST (COLLAPSE / break down)',
  },
  {
    id: 'tendon',
    term: 'Tendon',
    pronunciation: 'TEN-dun',
    definition: 'A tough, fibrous connective tissue band that attaches muscle to bone, transmitting the force of muscle contraction.',
    etymology: {
      roots: [{ root: 'tendo', language: 'Latin', meaning: 'to stretch, to extend', examples: ['tendinitis', 'tendinopathy', 'extend'] }],
      fullBreakdown: 'From Latin "tendo" (to stretch). Related to "extend" — tendons extend muscle force across joints to bone.',
      language: 'Latin',
    },
    system: 'musculoskeletal', category: 'tissue', difficulty: 'beginner',
    relatedTerms: ['ligament', 'muscle', 'bone', 'collagen'],
    conceptConnections: [
      { termId: 'collagen', relationship: 'primarily composed of', strength: 'strong' },
      { termId: 'osteoblast', relationship: 'attaches to bone tissue formed by', strength: 'moderate' },
    ],
    emoji: '🎀', color: '#1abc9c',
    funFact: 'The Achilles tendon is the strongest in the body — it can withstand forces of 3.9 times your body weight!',
    mnemonic: 'TENDON = TENDs to bONe (connects muscles to bones)',
  },
  {
    id: 'collagen',
    term: 'Collagen',
    pronunciation: 'KOL-ah-jen',
    definition: 'The most abundant protein in the body, forming the structural scaffolding of skin, tendons, ligaments, cartilage, and bone.',
    etymology: {
      roots: [
        { root: 'kolla', language: 'Greek', meaning: 'glue', examples: ['collagen', 'collodion'] },
        { root: '-gen', language: 'Greek', meaning: 'producing, creating', examples: ['pathogen', 'antigen', 'oxygen', 'hydrogen'] },
      ],
      fullBreakdown: '"Kolla" (glue) + "-gen" (producing) = glue producer. When boiled, collagen becomes gelatin — edible glue!',
      language: 'Greek',
    },
    system: 'musculoskeletal', category: 'tissue', difficulty: 'intermediate',
    relatedTerms: ['tendon', 'ligament', 'cartilage', 'bone', 'skin'],
    conceptConnections: [
      { termId: 'tendon', relationship: 'primary structural component of', strength: 'strong' },
      { termId: 'osteoblast', relationship: 'secreted as bone matrix by', strength: 'strong' },
      { termId: 'epidermis', relationship: 'provides structure beneath', strength: 'moderate' },
    ],
    emoji: '🧵', color: '#16a085',
    funFact: 'Collagen makes up about 30% of all the protein in your entire body!',
    mnemonic: 'COLLAGEN = glue (kolla) that holds the body together',
  },

  // ─── ENDOCRINE ────────────────────────────────────────────────────────────────
  {
    id: 'homeostasis',
    term: 'Homeostasis',
    pronunciation: 'hoh-mee-oh-STAY-sis',
    definition: 'The ability of the body to maintain a stable internal environment despite external changes, regulating temperature, pH, blood sugar, and more.',
    etymology: {
      roots: [
        { root: 'homoios', language: 'Greek', meaning: 'similar, like', examples: ['homeopathy', 'homogeneous', 'homologous'] },
        { root: 'stasis', language: 'Greek', meaning: 'standing still, staying', examples: ['stasis', 'metastasis', 'hemostasis'] },
      ],
      fullBreakdown: '"Homeo" (same) + "stasis" (standing) = staying the same. Coined by Walter Cannon in 1926.',
      language: 'Greek', year: '1926',
    },
    system: 'endocrine', category: 'process', difficulty: 'beginner',
    relatedTerms: ['feedback loop', 'thermoregulation', 'insulin', 'hypothalamus'],
    conceptConnections: [
      { termId: 'hypothalamus', relationship: 'regulated by', strength: 'strong' },
      { termId: 'insulin', relationship: 'blood glucose balanced by', strength: 'strong' },
      { termId: 'osteoblast', relationship: 'bone density maintained by balance of', strength: 'moderate' },
    ],
    emoji: '⚖️', color: '#f39c12',
    funFact: 'Your body temperature is regulated to within 0.1°C, blood pH within 0.05 units — incredibly precise!',
    mnemonic: 'HOMEOSTASIS = HOME stays the SAME',
  },
  {
    id: 'insulin',
    term: 'Insulin',
    pronunciation: 'IN-syoo-lin',
    definition: 'A hormone produced by pancreatic beta cells that allows cells to absorb glucose from the bloodstream, lowering blood sugar.',
    etymology: {
      roots: [{ root: 'insula', language: 'Latin', meaning: 'island', examples: ['insulin', 'insular', 'peninsula'] }],
      fullBreakdown: 'From Latin "insula" (island) — named for the Islets of Langerhans, tiny island-like cell clusters in the pancreas.',
      language: 'Latin', year: '1922',
    },
    system: 'endocrine', category: 'process', difficulty: 'intermediate',
    relatedTerms: ['glucagon', 'pancreas', 'homeostasis', 'diabetes'],
    conceptConnections: [
      { termId: 'homeostasis', relationship: 'maintains blood glucose for', strength: 'strong' },
      { termId: 'hypothalamus', relationship: 'release coordinated by', strength: 'moderate' },
      { termId: 'hepatic', relationship: 'signals liver to store glucose', strength: 'strong' },
    ],
    emoji: '🔑', color: '#f39c12',
    funFact: 'Insulin was discovered in 1921. Before that, Type 1 diabetes was always fatal.',
    mnemonic: 'INSULIN = In-SULin — it INvites SUgar In (to cells)',
  },
  {
    id: 'cortisol',
    term: 'Cortisol',
    pronunciation: 'KOR-tih-sol',
    definition: 'A steroid hormone released by the adrenal glands during stress that raises blood sugar, suppresses immunity, and aids metabolism.',
    etymology: {
      roots: [
        { root: 'cortex', language: 'Latin', meaning: 'bark, outer layer', examples: ['cortisol', 'cortex', 'corticosteroid'] },
        { root: '-ol', language: 'French', meaning: 'alcohol (steroid suffix)', examples: ['cortisol', 'estradiol', 'cholesterol'] },
      ],
      fullBreakdown: '"Cortex" (bark/outer layer) + "-ol" (steroid-alcohol) = steroid from the adrenal cortex (outer layer).',
      language: 'Latin/French',
    },
    system: 'endocrine', category: 'process', difficulty: 'intermediate',
    relatedTerms: ['adrenaline', 'stress', 'homeostasis', 'adrenal'],
    conceptConnections: [
      { termId: 'homeostasis', relationship: 'disrupts when chronically elevated', strength: 'strong' },
      { termId: 'leukocyte', relationship: 'suppresses when elevated', strength: 'moderate' },
      { termId: 'hypothalamus', relationship: 'release regulated by HPA axis via', strength: 'strong' },
    ],
    emoji: '😰', color: '#f39c12',
    funFact: 'Cortisol peaks 30 minutes after waking — it\'s your body\'s natural alarm clock hormone.',
    mnemonic: 'CORTISOL = CORTex produced STRESS hormone',
  },

  // ─── IMMUNE ────────────────────────────────────────────────────────────────────
  {
    id: 'hemoglobin',
    term: 'Hemoglobin',
    pronunciation: 'HEE-moh-gloh-bin',
    definition: 'The iron-containing protein in red blood cells that carries oxygen from the lungs to body tissues and returns carbon dioxide.',
    etymology: {
      roots: [
        { root: 'haima', language: 'Greek', meaning: 'blood', examples: ['hematology', 'hemorrhage', 'hemophilia', 'hematoma'] },
        { root: 'globus', language: 'Latin', meaning: 'ball, sphere', examples: ['globulin', 'globular', 'global'] },
      ],
      fullBreakdown: '"Hemo" (blood) + "globin" (spherical protein) = the spherical blood protein. Binds 4 oxygen molecules!',
      language: 'Greek/Latin',
    },
    system: 'immune', category: 'cell', difficulty: 'beginner',
    relatedTerms: ['alveoli', 'erythrocyte', 'oxygen', 'anemia'],
    conceptConnections: [
      { termId: 'alveoli', relationship: 'picks up oxygen at', strength: 'strong' },
      { termId: 'capillary', relationship: 'delivered through walls of', strength: 'strong' },
      { termId: 'erythrocyte', relationship: 'carried inside', strength: 'strong' },
    ],
    emoji: '🔴', color: '#c0392b',
    funFact: 'Hemoglobin makes blood red! Oxygenated = bright red; deoxygenated = dark red (not blue!).',
    mnemonic: 'HEMO = HEMOrrhage helps remember hemo = blood',
  },
  {
    id: 'erythrocyte',
    term: 'Erythrocyte',
    pronunciation: 'ih-RITH-roh-syte',
    definition: 'A red blood cell — the biconcave, nucleus-free cell that carries hemoglobin and transports oxygen throughout the body.',
    etymology: {
      roots: [
        { root: 'erythros', language: 'Greek', meaning: 'red', examples: ['erythema', 'erythromycin', 'erythropoietin'] },
        { root: 'kytos', language: 'Greek', meaning: 'hollow vessel, cell', examples: ['leukocyte', 'lymphocyte', 'phagocyte', 'cytoplasm'] },
      ],
      fullBreakdown: '"Erythro" (red) + "cyte" (cell) = red cell. The "-cyte" suffix marks all blood and immune cells!',
      language: 'Greek',
    },
    system: 'immune', category: 'cell', difficulty: 'beginner',
    relatedTerms: ['hemoglobin', 'leukocyte', 'thrombocyte', 'anemia'],
    conceptConnections: [
      { termId: 'hemoglobin', relationship: 'contains', strength: 'strong' },
      { termId: 'alveoli', relationship: 'picks up oxygen at', strength: 'strong' },
      { termId: 'capillary', relationship: 'squeezes through smallest', strength: 'strong' },
    ],
    emoji: '🔴', color: '#e74c3c',
    funFact: 'Red blood cells have no nucleus — they\'re hollow bags of hemoglobin that live only about 120 days.',
    mnemonic: 'ERYTHRO = RED — erythro = red!',
  },
  {
    id: 'leukocyte',
    term: 'Leukocyte',
    pronunciation: 'LOO-koh-syte',
    definition: 'A white blood cell — the immune system cells that defend the body against infection and foreign substances.',
    etymology: {
      roots: [
        { root: 'leukos', language: 'Greek', meaning: 'white, clear', examples: ['leukemia', 'leukoplakia'] },
        { root: 'kytos', language: 'Greek', meaning: 'hollow vessel, cell', examples: ['erythrocyte', 'lymphocyte', 'phagocyte'] },
      ],
      fullBreakdown: '"Leuko" (white) + "cyte" (cell) = white cell. Leukemia literally means "white blood" — excess white cells!',
      language: 'Greek',
    },
    system: 'immune', category: 'cell', difficulty: 'beginner',
    relatedTerms: ['erythrocyte', 'thrombocyte', 'lymphocyte', 'phagocyte'],
    conceptConnections: [
      { termId: 'erythrocyte', relationship: 'travels alongside in blood', strength: 'moderate' },
      { termId: 'cortisol', relationship: 'suppressed by elevated', strength: 'moderate' },
      { termId: 'antibody', relationship: 'B cells (type of) produce', strength: 'strong' },
      { termId: 'phagocyte', relationship: 'includes phagocytic types', strength: 'strong' },
    ],
    emoji: '🛡️', color: '#2ecc71',
    funFact: '4,500–11,000 white blood cells per microliter of blood, but they make up less than 1% of blood.',
    mnemonic: 'LEUKO = white — leukocyte = white cell',
  },
  {
    id: 'thrombocyte',
    term: 'Thrombocyte',
    pronunciation: 'THROM-boh-syte',
    definition: 'A platelet — a small, colorless blood cell fragment crucial for blood clotting and wound healing.',
    etymology: {
      roots: [
        { root: 'thrombos', language: 'Greek', meaning: 'clot, lump', examples: ['thrombosis', 'thrombus', 'thromboembolism'] },
        { root: 'kytos', language: 'Greek', meaning: 'hollow vessel, cell', examples: ['erythrocyte', 'leukocyte', 'lymphocyte'] },
      ],
      fullBreakdown: '"Thrombo" (clot) + "cyte" (cell) = clotting cell. Thrombosis forms when these create dangerous clots.',
      language: 'Greek',
    },
    system: 'immune', category: 'cell', difficulty: 'beginner',
    relatedTerms: ['erythrocyte', 'leukocyte', 'fibrin', 'hemostasis'],
    conceptConnections: [
      { termId: 'erythrocyte', relationship: 'circulates alongside', strength: 'moderate' },
      { termId: 'homeostasis', relationship: 'maintains hemostasis for', strength: 'moderate' },
    ],
    emoji: '🩹', color: '#f39c12',
    funFact: 'Platelets are fragments of giant cells called megakaryocytes and live only 8–10 days!',
    mnemonic: 'THROMBO = throw a clot — that\'s what they do!',
  },
  {
    id: 'antibody',
    term: 'Antibody',
    pronunciation: 'AN-tih-bod-ee',
    definition: 'A Y-shaped protein produced by B cells that specifically recognizes and neutralizes antigens such as bacteria and viruses.',
    etymology: {
      roots: [
        { root: 'anti-', language: 'Greek', meaning: 'against, opposing', examples: ['antibiotic', 'antigen', 'antihistamine', 'antiseptic'] },
        { root: 'body', language: 'Old English', meaning: 'physical body (generalized to substance)', examples: [] },
      ],
      fullBreakdown: '"Anti" (against) + "body" = substance against foreign bodies. Translated from German "Antikörper".',
      language: 'Greek/Old English',
    },
    system: 'immune', category: 'process', difficulty: 'intermediate',
    relatedTerms: ['antigen', 'leukocyte', 'immunoglobulin'],
    conceptConnections: [
      { termId: 'leukocyte', relationship: 'produced by B cell type of', strength: 'strong' },
      { termId: 'phagocyte', relationship: 'marks targets for', strength: 'strong' },
    ],
    emoji: '🎯', color: '#27ae60',
    funFact: 'Your immune system can produce over 10 billion different antibodies — one for nearly any pathogen.',
    mnemonic: 'ANTI-BODY = ANTI means against = against invading antigen bodies',
  },
  {
    id: 'phagocyte',
    term: 'Phagocyte',
    pronunciation: 'FAY-goh-syte',
    definition: 'A type of immune cell that protects the body by ingesting and destroying bacteria, dead cells, and foreign particles.',
    etymology: {
      roots: [
        { root: 'phagein', language: 'Greek', meaning: 'to eat, to devour', examples: ['phagocyte', 'macrophage', 'esophagus', 'dysphagia'] },
        { root: 'kytos', language: 'Greek', meaning: 'hollow vessel, cell', examples: ['erythrocyte', 'leukocyte', 'lymphocyte'] },
      ],
      fullBreakdown: '"Phago" (to eat) + "cyte" (cell) = eating cell. Macrophage literally means "big eater"!',
      language: 'Greek',
    },
    system: 'immune', category: 'cell', difficulty: 'intermediate',
    relatedTerms: ['macrophage', 'leukocyte', 'neutrophil', 'antibody'],
    conceptConnections: [
      { termId: 'leukocyte', relationship: 'is a specialized type of', strength: 'strong' },
      { termId: 'antibody', relationship: 'works alongside to clear pathogens', strength: 'strong' },
      { termId: 'esophagus', relationship: 'shares "phago" (eating) root with', strength: 'weak' },
    ],
    emoji: '👾', color: '#2ecc71',
    funFact: 'A macrophage can engulf up to 100 bacteria before it exhausts and dies!',
    mnemonic: 'PHAGO-CYTE = PHAGO = EAT bacteria!',
  },

  // ─── INTEGUMENTARY ───────────────────────────────────────────────────────────
  {
    id: 'epidermis',
    term: 'Epidermis',
    pronunciation: 'ep-ih-DER-mis',
    definition: 'The outermost layer of skin that serves as a physical barrier, preventing water loss and blocking entry of pathogens.',
    etymology: {
      roots: [
        { root: 'epi-', language: 'Greek', meaning: 'upon, over, above', examples: ['epidemic', 'epicardium', 'epithelium', 'epilogue'] },
        { root: 'derma', language: 'Greek', meaning: 'skin', examples: ['dermatology', 'dermis', 'hypodermic', 'eczema'] },
      ],
      fullBreakdown: '"Epi" (upon) + "derma" (skin) = upon the skin. The outermost of skin\'s three layers.',
      language: 'Greek',
    },
    system: 'integumentary', category: 'tissue', difficulty: 'beginner',
    relatedTerms: ['dermis', 'hypodermis', 'keratinocyte', 'melanocyte'],
    conceptConnections: [
      { termId: 'melanocyte', relationship: 'contains in deepest layer', strength: 'strong' },
      { termId: 'leukocyte', relationship: 'first barrier preventing need for', strength: 'moderate' },
      { termId: 'collagen', relationship: 'supported beneath by', strength: 'moderate' },
    ],
    emoji: '🧴', color: '#e91e63',
    funFact: 'You shed approximately 30,000–40,000 skin cells every hour — about 1 million cells per day!',
    mnemonic: 'EPI-DERMIS = UPON the SKIN (epi = upon, dermis = skin)',
  },
  {
    id: 'melanocyte',
    term: 'Melanocyte',
    pronunciation: 'meh-LAN-oh-syte',
    definition: 'Pigment-producing cells in the epidermis that produce melanin, responsible for skin and hair color and UV protection.',
    etymology: {
      roots: [
        { root: 'melanos', language: 'Greek', meaning: 'black, dark', examples: ['melanin', 'melanoma', 'melancholy', 'melanocyte'] },
        { root: 'kytos', language: 'Greek', meaning: 'hollow vessel, cell', examples: ['erythrocyte', 'leukocyte', 'phagocyte'] },
      ],
      fullBreakdown: '"Melano" (black/dark) + "cyte" (cell) = dark cell. Melanoma = cancer of these cells. "Melancholy" shares the root — black bile was thought to cause sadness!',
      language: 'Greek',
    },
    system: 'integumentary', category: 'cell', difficulty: 'intermediate',
    relatedTerms: ['epidermis', 'melanin', 'melanoma', 'UV radiation'],
    conceptConnections: [
      { termId: 'epidermis', relationship: 'located in deepest layer of', strength: 'strong' },
    ],
    emoji: '🎨', color: '#e91e63',
    funFact: 'All humans have roughly the same number of melanocytes — skin color differences are due to how much melanin each produces!',
    mnemonic: 'MELANO-CYTE = MELANOma comes from these dark pigment cells',
  },

  // ─── URINARY ─────────────────────────────────────────────────────────────────
  {
    id: 'nephron',
    term: 'Nephron',
    pronunciation: 'NEF-ron',
    definition: 'The functional unit of the kidney — each nephron filters blood, reabsorbs useful substances, and produces urine from the remainder.',
    etymology: {
      roots: [{ root: 'nephros', language: 'Greek', meaning: 'kidney', examples: ['nephrology', 'nephritis', 'nephrosis', 'nephrectomy'] }],
      fullBreakdown: 'From Greek "nephros" (kidney). Root of nephrology, nephritis, and nephrectomy (kidney removal).',
      language: 'Greek',
    },
    system: 'urinary', category: 'structure', difficulty: 'intermediate',
    relatedTerms: ['glomerulus', 'kidney', 'urine', 'filtration'],
    conceptConnections: [
      { termId: 'homeostasis', relationship: 'key regulator of fluid balance for', strength: 'strong' },
      { termId: 'capillary', relationship: 'filters blood from glomerular', strength: 'strong' },
      { termId: 'glomerulus', relationship: 'contains filtration unit', strength: 'strong' },
    ],
    emoji: '🔬', color: '#00bcd4',
    funFact: 'Each kidney has about 1 million nephrons. Together they filter about 180 liters of blood every day!',
    mnemonic: 'NEPHRON = NEPHROlogy = kidney unit',
  },
  {
    id: 'glomerulus',
    term: 'Glomerulus',
    pronunciation: 'gloh-MEHR-yoo-lus',
    definition: 'A tiny ball of capillaries within the kidney nephron where blood is filtered under pressure to produce the initial filtrate.',
    etymology: {
      roots: [{ root: 'glomus', language: 'Latin', meaning: 'ball of yarn, cluster', examples: ['glomerulus', 'glomerulonephritis', 'glomerate'] }],
      fullBreakdown: 'From Latin "glomus" (ball of yarn) — diminutive "glomerulus" = little ball of tangled capillaries!',
      language: 'Latin',
    },
    system: 'urinary', category: 'structure', difficulty: 'advanced',
    relatedTerms: ['nephron', 'capillary', 'Bowman\'s capsule', 'filtration'],
    conceptConnections: [
      { termId: 'nephron', relationship: 'filtration unit within', strength: 'strong' },
      { termId: 'capillary', relationship: 'consists of a ball of', strength: 'strong' },
      { termId: 'homeostasis', relationship: 'filters blood to maintain', strength: 'strong' },
    ],
    emoji: '⚽', color: '#00bcd4',
    funFact: 'The glomerulus filters about 120 mL of blood per minute — that\'s 173 liters every 24 hours!',
    mnemonic: 'GLOMERULUS = GLOM = tangled ball of capillaries',
  },

  // ─── REPRODUCTIVE ────────────────────────────────────────────────────────────
  {
    id: 'meiosis',
    term: 'Meiosis',
    pronunciation: 'my-OH-sis',
    definition: 'A specialized cell division process that produces gametes (eggs and sperm) with half the normal chromosome number.',
    etymology: {
      roots: [{ root: 'meiosis', language: 'Greek', meaning: 'lessening, reduction', examples: ['meiosis', 'meiotic'] }],
      fullBreakdown: 'From Greek "meioun" (to lessen) — reduces chromosome number from 46 to 23, creating haploid gametes.',
      language: 'Greek',
    },
    system: 'reproductive', category: 'process', difficulty: 'advanced',
    relatedTerms: ['mitosis', 'gamete', 'chromosome', 'fertilization'],
    conceptConnections: [
      { termId: 'homeostasis', relationship: 'enables species genetic continuity', strength: 'weak' },
    ],
    emoji: '✂️', color: '#ff6b9d',
    funFact: 'During meiosis, chromosomes swap sections ("crossing over") — creating unique genetic diversity in every generation!',
    mnemonic: 'MEIOSIS = MEIOSis = Makes Eggs In Ovaries (Sex cells)',
  },
];

export const ETYMOLOGY_ROOTS: EtymologyRoot[] = [
  { root: 'kardia', language: 'Greek', meaning: 'heart', examples: ['cardiac', 'pericardium', 'myocardium', 'tachycardia', 'bradycardia'] },
  { root: 'haima/hemo', language: 'Greek', meaning: 'blood', examples: ['hemoglobin', 'hematology', 'hemorrhage', 'hemophilia'] },
  { root: 'neuron', language: 'Greek', meaning: 'nerve', examples: ['neuron', 'neurology', 'neural', 'neurotransmitter'] },
  { root: 'kytos', language: 'Greek', meaning: 'cell', examples: ['erythrocyte', 'leukocyte', 'thrombocyte', 'lymphocyte', 'phagocyte'] },
  { root: 'osteon', language: 'Greek', meaning: 'bone', examples: ['osteoporosis', 'osteocyte', 'osteology', 'periosteum'] },
  { root: 'myo/mys', language: 'Greek', meaning: 'muscle', examples: ['myocardium', 'myology', 'myalgia', 'myosin'] },
  { root: 'derma', language: 'Greek', meaning: 'skin', examples: ['dermatology', 'epidermis', 'dermis', 'hypodermic'] },
  { root: 'hepat', language: 'Greek', meaning: 'liver', examples: ['hepatitis', 'hepatology', 'hepatocyte', 'hepatomegaly'] },
  { root: 'nephro', language: 'Greek', meaning: 'kidney', examples: ['nephrology', 'nephritis', 'nephrosis', 'glomerulonephritis'] },
  { root: 'pulmo', language: 'Latin', meaning: 'lung', examples: ['pulmonary', 'pneumonia', 'pulmonic'] },
  { root: 'tachy', language: 'Greek', meaning: 'fast/rapid', examples: ['tachycardia', 'tachypnea', 'tachyon'] },
  { root: 'brady', language: 'Greek', meaning: 'slow', examples: ['bradycardia', 'bradypnea', 'bradykinesia'] },
  { root: 'hyper', language: 'Greek', meaning: 'over/above/excessive', examples: ['hypertension', 'hyperglycemia', 'hyperthyroidism'] },
  { root: 'hypo', language: 'Greek', meaning: 'under/below/deficient', examples: ['hypothalamus', 'hypotension', 'hypoglycemia', 'hypothermia'] },
  { root: 'erythro', language: 'Greek', meaning: 'red', examples: ['erythrocyte', 'erythema', 'erythromycin'] },
  { root: 'leuko', language: 'Greek', meaning: 'white', examples: ['leukocyte', 'leukemia', 'leukoplakia'] },
  { root: 'peri', language: 'Greek', meaning: 'around/surrounding', examples: ['pericardium', 'periosteum', 'peristalsis', 'perimeter'] },
  { root: 'endo', language: 'Greek', meaning: 'within/inner', examples: ['endocardium', 'endocrine', 'endoscopy', 'endoplasmic'] },
  { root: '-itis', language: 'Greek', meaning: 'inflammation of', examples: ['hepatitis', 'arthritis', 'appendicitis', 'dermatitis', 'bronchitis'] },
  { root: '-osis', language: 'Greek', meaning: 'condition/process', examples: ['osteoporosis', 'thrombosis', 'fibrosis', 'cirrhosis'] },
  { root: '-ectomy', language: 'Greek', meaning: 'surgical removal', examples: ['appendectomy', 'tonsillectomy', 'mastectomy', 'gastrectomy'] },
  { root: '-plasty', language: 'Greek', meaning: 'surgical repair/molding', examples: ['rhinoplasty', 'arthroplasty', 'cardioplasty'] },
  { root: 'phago', language: 'Greek', meaning: 'to eat/engulf', examples: ['phagocyte', 'macrophage', 'esophagus', 'dysphagia'] },
  { root: 'blastos', language: 'Greek', meaning: 'germ/sprout/builder', examples: ['osteoblast', 'fibroblast', 'erythroblast', 'neuroblast'] },
  { root: 'klastos', language: 'Greek', meaning: 'broken/to break', examples: ['osteoclast', 'iconoclast'] },
  { root: 'melanos', language: 'Greek', meaning: 'black/dark', examples: ['melanocyte', 'melanin', 'melanoma', 'melancholy'] },
  { root: 'insula', language: 'Latin', meaning: 'island', examples: ['insulin', 'insular', 'peninsula'] },
  { root: 'kolla', language: 'Greek', meaning: 'glue', examples: ['collagen', 'collodion'] },
  { root: '-gen', language: 'Greek', meaning: 'producing/creating', examples: ['collagen', 'pathogen', 'antigen', 'oxygen', 'hydrogen'] },
  { root: 'anti-', language: 'Greek', meaning: 'against/opposing', examples: ['antibody', 'antibiotic', 'antigen', 'antihistamine'] },
];

export const QUIZ_QUESTIONS = {
  etymology: [
    { id: 'q1', question: 'What does the Greek root "kardia" mean?', options: ['Brain', 'Heart', 'Blood', 'Muscle'], correct: 1, explanation: '"Kardia" is the Greek word for heart. It appears in cardiac, myocardium, tachycardia, and bradycardia.', relatedTerms: ['cardiac', 'myocardium', 'tachycardia', 'bradycardia'] },
    { id: 'q2', question: 'The suffix "-cyte" in erythrocyte, leukocyte, thrombocyte comes from Greek "kytos" meaning:', options: ['Blood', 'Cell', 'Nucleus', 'Membrane'], correct: 1, explanation: '"Kytos" means hollow vessel or cell. Any word ending in "-cyte" is a type of cell!', relatedTerms: ['erythrocyte', 'leukocyte', 'thrombocyte'] },
    { id: 'q3', question: 'Tachycardia vs Bradycardia: if "tachy" means fast and "brady" means slow, what is "-cardia"?', options: ['Heart condition', 'Blood pressure', 'Breathing rate', 'Brain activity'], correct: 0, explanation: 'Both terms share "-cardia" from "kardia" (heart). Tachy = fast heart, Brady = slow heart.', relatedTerms: ['tachycardia', 'bradycardia', 'cardiac'] },
    { id: 'q4', question: 'Dendrite comes from Greek "dendron" meaning:', options: ['Electric signal', 'Tree', 'Connection', 'Brain'], correct: 1, explanation: '"Dendron" means tree. Dendrites look like tree branches! Rhododendron also means "rose tree"!', relatedTerms: ['dendrite', 'neuron', 'axon'] },
    { id: 'q5', question: 'The medical suffix "-itis" means:', options: ['Removal of', 'Inflammation of', 'Study of', 'Condition of'], correct: 1, explanation: '"-Itis" means inflammation! Hepatitis = liver inflammation, arthritis = joint inflammation.', relatedTerms: [] },
    { id: 'q6', question: 'What does "hypo-" mean in hypothalamus and hypoglycemia?', options: ['Above/over', 'Below/under', 'Around', 'Within'], correct: 1, explanation: '"Hypo" means below or under. Hypothalamus = below the thalamus. Opposite of "hyper" (over)!', relatedTerms: ['hypothalamus', 'homeostasis'] },
    { id: 'q7', question: 'Myocardium = "myo" + "cardium". What does "myo" mean?', options: ['Blood', 'Heart', 'Muscle', 'Layer'], correct: 2, explanation: '"Myo/mys" means muscle! Myocardium = heart muscle. Also in myalgia (muscle pain).', relatedTerms: ['myocardium', 'cardiac'] },
    { id: 'q8', question: 'What does the prefix "erythro-" mean in erythrocyte and erythema?', options: ['White', 'Red', 'Clear', 'Large'], correct: 1, explanation: '"Erythros" means red in Greek! Erythrocyte = red cell. Leuko = white (opposite).', relatedTerms: ['erythrocyte', 'leukocyte', 'hemoglobin'] },
    { id: 'q9', question: '"Phagocyte" contains "phago" — from Greek "phagein." What does it mean?', options: ['To divide', 'To eat/devour', 'To carry', 'To protect'], correct: 1, explanation: '"Phagein" means to eat. Phagocyte = eating cell. Macrophage = "big eater." Even esophagus contains this root!', relatedTerms: ['phagocyte', 'esophagus'] },
    { id: 'q10', question: 'Insulin was named after "insula" (Latin for island). Why?', options: ['Discovered on an island', 'Produced in islet clusters of the pancreas', 'It isolates sugar from blood', 'Molecule looks like an island'], correct: 1, explanation: 'Insulin is produced in the Islets of Langerhans — small island-like clusters of cells in the pancreas!', relatedTerms: ['insulin', 'homeostasis'] },
    { id: 'q11', question: '"Osteo" means bone. "Blastos" = build. "Klastos" = break. What do osteoblasts do?', options: ['Break down bone', 'Build new bone', 'Store calcium', 'Produce marrow'], correct: 1, explanation: '"Blast" = builder. "Clast" = breaker. Osteoblasts BUILD; osteoclasts BREAK. Both remodel the skeleton!', relatedTerms: ['osteoblast', 'osteoclast', 'osteoporosis'] },
    { id: 'q12', question: 'Collagen comes from Greek "kolla" (glue) + "-gen" (producing). What other words share "-gen"?', options: ['Pathogen, antigen, oxygen', 'Nephron, neuron, axon', 'Derma, epidermis, dermis', 'Tachy, brady, arrhythmia'], correct: 0, explanation: '"-Gen" means producing. Pathogen (disease producer), antigen (antibody producer), oxygen (acid producer in Greek)!', relatedTerms: ['collagen', 'antibody'] },
  ],
};
