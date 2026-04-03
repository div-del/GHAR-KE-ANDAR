export type ActionType = 'move' | 'talk' | 'task';

export interface DialogueChoice {
  id: string;
  text: string;
  nextNodeId: string | null;
  emotionalImpact?: number;
}

export interface DialogueNode {
  id: string;
  characterId: string;
  text: string;
  internalThought: string;
  choices: DialogueChoice[];
}

export interface Character {
  id: string;
  name: string;
  description: string;
  currentLocation: string;
}

export interface GameAction {
  id: string;
  type: ActionType;
  label: string;
  targetLocation?: string;
  targetCharacter?: string;
  targetTask?: string;
  requiredLocation: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  entryThought: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  location: string;
}

export interface GameData {
  locations: Record<string, Location>;
  characters: Record<string, Character>;
  actions: GameAction[];
  dialogues: Record<string, DialogueNode>;
  tasks: Record<string, Task>;
}

export const gameData: GameData = {
  locations: {
    home_bedroom: {
      id: 'home_bedroom',
      name: 'My Room',
      description: 'It is small, but it is mine. My school books are stacked neatly on the desk, right next to the secret diary Maa does not know about. The ceiling fan clicks rhythmically.',
      entryThought: 'I should probably get out of my room before someone calls for me.'
    },
    home_kitchen: {
      id: 'home_kitchen',
      name: 'Rasoi (Kitchen)',
      description: 'The air is thick with the smell of roasting cumin and ghee. The radio is playing old Kishore Kumar songs faintly in the background.',
      entryThought: 'The heart of the house. Also the place where all the lectures happen.'
    },
    home_living_room: {
      id: 'home_living_room',
      name: 'Hall (Living Room)',
      description: 'The TV is always on. Sunlight streams through the slightly dusty windowpanes, catching the flying dust particles.',
      entryThought: 'I hope Papa is in a good mood today.'
    },
    street: {
      id: 'street',
      name: 'Gali Outside',
      description: 'The familiar chaos of our neighborhood. Scooters honking, street dogs sleeping in the shade, kids playing cricket.',
      entryThought: 'Ah, fresh air. Sometimes this gali feels like the whole world.'
    },
    shop: {
      id: 'shop',
      name: "Sharma Ji's Kirana",
      description: 'Stacked to the brim with biscuit packets, dal, and soaps. It smells like old paper and detergent.',
      entryThought: 'I always end up doing these errands.'
    },
    neighbor_house: {
      id: 'neighbor_house',
      name: 'Padosan Aunty ka Ghar',
      description: 'The drawing room is covered in plastic seat covers. The air feels heavy with judgment and unsolicited advice.',
      entryThought: 'I really hope she doesn\'t start with her questions today.'
    },
    dairy: {
      id: 'dairy',
      name: 'Dairy / Doodh ki Dukaan',
      description: 'A small booth filled with the smell of fresh milk and curd. The owner sits surrounded by blue plastic crates.',
      entryThought: 'Just get the milk and head back.'
    },
    school: {
      id: 'school',
      name: 'School',
      description: 'Empty classrooms, a dusty playground, and the echo of the school bell. It feels like freedom here.',
      entryThought: 'My favorite place. For a few hours, I\'m just a student, not a daughter.'
    }
  },
  characters: {
    maa: {
      id: 'maa',
      name: 'Maa',
      description: 'Always busy, always worrying. She expresses love through food and scolding.',
      currentLocation: 'home_kitchen'
    },
    papa: {
      id: 'papa',
      name: 'Papa',
      description: 'Strict on the outside, silently caring. He is currently reading the Hindi newspaper.',
      currentLocation: 'home_living_room'
    },
    dadi: {
      id: 'dadi',
      name: 'Dadi',
      description: 'Sitting on her bed, counting her prayer beads. She knows everything that happens in the house.',
      currentLocation: 'home_bedroom'
    },
    bhai: {
      id: 'bhai',
      name: 'Chhota Bhai',
      description: 'My annoying 12-year-old brother. Full of energy and demands.',
      currentLocation: 'street'
    },
    aunty: {
      id: 'aunty',
      name: 'Padosan Aunty',
      description: 'Nosy and judgmental. She makes it her business to know what every girl in the neighborhood is doing.',
      currentLocation: 'neighbor_house'
    }
  },
  actions: [
    // Movement Actions
    { id: 'move_kitchen', type: 'move', label: 'Go to Kitchen', targetLocation: 'home_kitchen', requiredLocation: 'home_bedroom' },
    { id: 'move_hall_from_bedroom', type: 'move', label: 'Go to Hall', targetLocation: 'home_living_room', requiredLocation: 'home_bedroom' },
    
    { id: 'move_bedroom_from_kitchen', type: 'move', label: 'Go to Bedroom', targetLocation: 'home_bedroom', requiredLocation: 'home_kitchen' },
    { id: 'move_hall_from_kitchen', type: 'move', label: 'Go to Hall', targetLocation: 'home_living_room', requiredLocation: 'home_kitchen' },
    
    { id: 'move_bedroom_from_hall', type: 'move', label: 'Go to Bedroom', targetLocation: 'home_bedroom', requiredLocation: 'home_living_room' },
    { id: 'move_kitchen_from_hall', type: 'move', label: 'Go to Kitchen', targetLocation: 'home_kitchen', requiredLocation: 'home_living_room' },
    { id: 'move_street_from_hall', type: 'move', label: 'Go Outside', targetLocation: 'street', requiredLocation: 'home_living_room' },
    
    { id: 'move_hall_from_street', type: 'move', label: 'Go Inside', targetLocation: 'home_living_room', requiredLocation: 'street' },
    { id: 'move_shop_from_street', type: 'move', label: 'Go to Sharma Ji\'s Shop', targetLocation: 'shop', requiredLocation: 'street' },
    { id: 'move_neighbor_from_street', type: 'move', label: 'Go to Aunty\'s House', targetLocation: 'neighbor_house', requiredLocation: 'street' },
    { id: 'move_dairy_from_street', type: 'move', label: 'Go to Dairy', targetLocation: 'dairy', requiredLocation: 'street' },
    { id: 'move_school_from_street', type: 'move', label: 'Go to School', targetLocation: 'school', requiredLocation: 'street' },
    
    { id: 'move_street_from_shop', type: 'move', label: 'Go back to Gali', targetLocation: 'street', requiredLocation: 'shop' },
    { id: 'move_street_from_neighbor', type: 'move', label: 'Go back to Gali', targetLocation: 'street', requiredLocation: 'neighbor_house' },
    { id: 'move_street_from_dairy', type: 'move', label: 'Go back to Gali', targetLocation: 'street', requiredLocation: 'dairy' },
    { id: 'move_street_from_school', type: 'move', label: 'Go back to Gali', targetLocation: 'street', requiredLocation: 'school' },

    // Talk Actions
    { id: 'talk_maa', type: 'talk', label: 'Talk to Maa', targetCharacter: 'maa', requiredLocation: 'home_kitchen' },
    { id: 'talk_papa', type: 'talk', label: 'Talk to Papa', targetCharacter: 'papa', requiredLocation: 'home_living_room' },
    { id: 'talk_dadi', type: 'talk', label: 'Talk to Dadi', targetCharacter: 'dadi', requiredLocation: 'home_bedroom' },
    { id: 'talk_bhai', type: 'talk', label: 'Talk to Bhai', targetCharacter: 'bhai', requiredLocation: 'street' },
    { id: 'talk_aunty', type: 'talk', label: 'Talk to Aunty', targetCharacter: 'aunty', requiredLocation: 'neighbor_house' },

    // Tasks
    { id: 'task_buy_milk', type: 'task', label: 'Buy milk packet', targetTask: 'buy_milk', requiredLocation: 'shop' },
    { id: 'task_wash_dishes', type: 'task', label: 'Wash the dishes', targetTask: 'wash_dishes', requiredLocation: 'home_kitchen' },
    { id: 'task_buy_milk_dairy', type: 'task', label: 'Buy milk packet', targetTask: 'buy_milk_dairy', requiredLocation: 'dairy' },
    { id: 'task_attend_class', type: 'task', label: 'Attend class', targetTask: 'attend_class', requiredLocation: 'school' }
  ],
  dialogues: {
    // Maa's Dialogues
    'maa_1': {
      id: 'maa_1',
      characterId: 'maa',
      text: "Utensils pile up ho rahe hain, jaa bartan dho. Tera bhai toh padh raha hai. (Dishes are piling up, go wash them. Your brother is studying.)",
      internalThought: "Why is his studying always an excuse, but mine is an interruption?",
      choices: [
        { id: 'c1', text: "But Maa, why always me? Bhai can do it too.", nextNodeId: 'maa_2' },
        { id: 'c2', text: "Okay Maa. But I need to talk to you about Pune college...", nextNodeId: 'maa_3' }
      ]
    },
    'maa_2': {
      id: 'maa_2',
      characterId: 'maa',
      text: "Ladki ho, seekhna padega. Sasural mein kaun karega? Uska kaam alag hai. Tu apna dekh. (You're a girl, you need to learn. Who will do it at your in-laws? His work is different. Focus on yours.)",
      internalThought: "Sasural. The invisible place that decides my entire life.",
      choices: [
        { id: 'c1', text: "[Sigh] I'll wash them.", nextNodeId: 'maa_4' }
      ]
    },
    'maa_3': {
      id: 'maa_3',
      characterId: 'maa',
      text: "Baad mein baat karenge. Pehle dairy se doodh le aa, chai banani hai. (We'll talk later. First go get milk from the dairy, I have to make tea.)",
      internalThought: "Deflected again. My things can always wait.",
      choices: [
        { id: 'c1', text: "Okay Maa, going.", nextNodeId: null }
      ]
    },
    'maa_4': {
      id: 'maa_4',
      characterId: 'maa',
      text: "Aur sun, jaldi aana. Dairy se doodh bhi laana hai. (And listen, come back fast. You need to get milk from the dairy too.)",
      internalThought: "Chores and errands. Always.",
      choices: [
        { id: 'c1', text: "Yes Maa.", nextNodeId: null }
      ]
    },

    // Papa's Dialogues
    'papa_1': {
      id: 'papa_1',
      characterId: 'papa',
      text: "[Doesn't look up from newspaper] Padhai kaisi chal rahi hai? Zyada bahar mat jaya karo, log kya kahenge. (How are the studies going? Don't go out too much, what will people say.)",
      internalThought: "'Log kya kahenge'. The favorite dialogue of this house.",
      choices: [
        { id: 'c1', text: "I only go to school and errands, Papa. About applying to that college in Pune...", nextNodeId: 'papa_2' },
        { id: 'c2', text: "Studies are fine, Papa.", nextNodeId: 'papa_3' }
      ]
    },
    'papa_2': {
      id: 'papa_2',
      characterId: 'papa',
      text: "Pune? Ladkiyon ko door bhejke kya fayda? Yahan bhi toh padh sakti hai. Tera bhai ka admission Delhi mein karwana hai, uspe kharcha hoga. (What's the point of sending girls far? You can study here too. Your brother needs admission in Delhi, that will cost money.)",
      internalThought: "So his education is an investment, and mine is just a waste of money.",
      choices: [
        { id: 'c1', text: "But Papa, the opportunities there are much better! I can get a scholarship.", nextNodeId: 'papa_4' },
        { id: 'c2', text: "Ji Papa. (Yes Papa.)", nextNodeId: null }
      ]
    },
    'papa_3': {
      id: 'papa_3',
      characterId: 'papa',
      text: "Hmm. Dhyaan se padho. Maths weak hai tumhara. Aur ghar ke kaam mein bhi maa ki madad kiya karo. (Hmm. Study carefully. Your math is weak. And help your mother with housework too.)",
      internalThought: "Study well, but also do all the housework. Got it.",
      choices: [
        { id: 'c1', text: "Okay Papa.", nextNodeId: null }
      ]
    },
    'papa_4': {
      id: 'papa_4',
      characterId: 'papa',
      text: "Ek baar keh diya na? Yahan ke college mein admission le lena. Ab jao, Maa ki madad karo. (Said it once, didn't I? Take admission in the local college. Now go, help your mother.)",
      internalThought: "And that's the end of the conversation. I feel so suffocated.",
      choices: [
        { id: 'c1', text: "Leave quietly.", nextNodeId: null }
      ]
    },

    // Dadi's Dialogues
    'dadi_1': {
      id: 'dadi_1',
      characterId: 'dadi',
      text: "Aaja beta. Dupatta theek kar le thoda. Bahar jaate waqt dhyaan rakhna chahiye. (Come child. Fix your dupatta a bit. You should be careful going out.)",
      internalThought: "Always policing how I dress. But Dadi means well... I think.",
      choices: [
        { id: 'c1', text: "Dadi, it's just a normal suit. Why do girls have to be so careful all the time?", nextNodeId: 'dadi_2' },
        { id: 'c2', text: "Okay Dadi.", nextNodeId: 'dadi_3' }
      ]
    },
    'dadi_2': {
      id: 'dadi_2',
      characterId: 'dadi',
      text: "[Sighs] Zamana badal raha hai, par duniya ki nazar wahi hai. Humare time pe toh ghar se nikalna bhi mana tha. (Times are changing, but the world's gaze is the same. In our time, even leaving the house was forbidden.)",
      internalThought: "She was kept in a cage, so she thinks a bigger cage is freedom.",
      choices: [
        { id: 'c1', text: "Papa won't let me go to Pune for college. He says Bhai needs to go to Delhi.", nextNodeId: 'dadi_4' }
      ]
    },
    'dadi_3': {
      id: 'dadi_3',
      characterId: 'dadi',
      text: "Jawan khoon ho, bura jaldi maan jaate ho. Ja thoda aaram kar le. (You're young blood, you get offended quickly. Go rest a bit.)",
      internalThought: "I'm not offended, I'm just tired of the rules.",
      choices: [
        { id: 'c1', text: "Okay Dadi.", nextNodeId: null }
      ]
    },
    'dadi_4': {
      id: 'dadi_4',
      characterId: 'dadi',
      text: "[Pats your hand softly] Tere Papa darte hain. Ladki hai na. Par tu koshish mat chhodna. Main baat karungi unse sahi waqt aane par. (Your father is scared. You're a girl. But don't give up trying. I will talk to him when the time is right.)",
      internalThought: "She actually understands. This is the closest I get to an ally.",
      choices: [
        { id: 'c1', text: "Thanks Dadi. It means a lot.", nextNodeId: null }
      ]
    },

    // Aunty's Dialogues
    'aunty_1': {
      id: 'aunty_1',
      characterId: 'aunty',
      text: "Arre beta! Kitni badi ho gayi! Ab toh bas shaadi ki umar ho rahi hai. Tumhari Maa ki bhi is umar mein shaadi ho gayi thi. (Oh child! You've grown so much! Marriage age is approaching. Your mother was married at this age.)",
      internalThought: "Why is marriage the only timeline that matters?",
      choices: [
        { id: 'c1', text: "Aunty, I'm just 17. I want to study further and get a job.", nextNodeId: 'aunty_2' },
        { id: 'c2', text: "[Smile awkwardly]", nextNodeId: 'aunty_3' }
      ]
    },
    'aunty_2': {
      id: 'aunty_2',
      characterId: 'aunty',
      text: "Sapne toh theek hain, par ladkiyon ko practical sochna chahiye. Aage jake chulha-chauka hi toh karna hai. (Dreams are fine, but girls should think practical. Eventually you have to manage the kitchen anyway.)",
      internalThought: "I feel like screaming. Practical just means giving up.",
      choices: [
        { id: 'c1', text: "Times have changed, Aunty. Girls can do both.", nextNodeId: 'aunty_4' }
      ]
    },
    'aunty_3': {
      id: 'aunty_3',
      characterId: 'aunty',
      text: "Aaj kal main dekhti hoon, tu bada bahar ghoomti hai. Itna ghoomti hai, padosan log kya sochenge? Ghar pe reh ke kaam seekh. (Nowadays I see you roam outside a lot. You roam so much, what will neighbors think? Stay home and learn chores.)",
      internalThought: "You are the 'padosan log'! Everyone else is busy with their lives.",
      choices: [
        { id: 'c1', text: "I only go to school and errands, Aunty. Gotta go now.", nextNodeId: null }
      ]
    },
    'aunty_4': {
      id: 'aunty_4',
      characterId: 'aunty',
      text: "[Frowns] Badi tezz zubaan ho gayi hai aaj kal ki ladkiyon ki. Apni Maa ko bolna thoda sanskar sikhayein. (Girls these days have a sharp tongue. Tell your mother to teach you some manners.)",
      internalThought: "Stand up for yourself, and you're 'sanskaar-less'.",
      choices: [
        { id: 'c1', text: "Namaste, Aunty.", nextNodeId: null }
      ]
    },

    // Bhai's Dialogues
    'bhai_1': {
      id: 'bhai_1',
      characterId: 'bhai',
      text: "Didi! Didi! Ball daal do ek over! Main toh cricket khelne jaa raha hoon dosto ke saath. (Didi! Bowl one over! I'm going to play cricket with friends.)",
      internalThought: "He gets to play, while I have to wash dishes.",
      choices: [
        { id: 'c1', text: "Maa didn't give you any chores? I have to wash dishes AND get milk.", nextNodeId: 'bhai_2' },
        { id: 'c2', text: "Only one over, okay? Then I have to go.", nextNodeId: 'bhai_3' }
      ]
    },
    'bhai_2': {
      id: 'bhai_2',
      characterId: 'bhai',
      text: "Mujhe toh Maa ne kuch nahi kaha. Tu ladki hai na isliye tujhe kaam karna padta hai. [Laughs and runs away] (Maa didn't say anything to me. You're a girl, that's why you have to work.)",
      internalThought: "He doesn't even realize how cruel that sounds. It's just a fact of life to him.",
      choices: [
        { id: 'c1', text: "Watch him go.", nextNodeId: null }
      ]
    },
    'bhai_3': {
      id: 'bhai_3',
      characterId: 'bhai',
      text: "Yay! Theek hai. Spin daalna please! Par jaldi kar, mere dost wait kar rahe hain. (Yay! Okay. Bowl spin please! But hurry, my friends are waiting.)",
      internalThought: "At least he's happy. Even if it's unfair.",
      choices: [
        { id: 'c1', text: "[Bowl the ball]", nextNodeId: null }
      ]
    }
  },
  tasks: {
    'buy_milk': {
      id: 'buy_milk',
      name: 'Buy Milk',
      description: 'Get a half-liter packet of milk from Sharma Ji for morning tea.',
      location: 'shop'
    },
    'wash_dishes': {
      id: 'wash_dishes',
      name: 'Wash Dishes',
      description: 'Scrub the greasy plates and pans piling up in the sink.',
      location: 'home_kitchen'
    },
    'buy_milk_dairy': {
      id: 'buy_milk_dairy',
      name: 'Buy Milk from Dairy',
      description: 'Get fresh milk from the dairy booth.',
      location: 'dairy'
    },
    'attend_class': {
      id: 'attend_class',
      name: 'Attend Class',
      description: 'Sit in the classroom, listen to the teacher, and escape reality for a bit.',
      location: 'school'
    }
  }
};
