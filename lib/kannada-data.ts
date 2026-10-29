export type Phrase = {
  id: string
  kannada: string
  transliteration: string
  english: string
  category: string
}

export type LessonCategory = {
  id: string
  kannada: string
  english: string
  subtitleKn: string
  subtitleEn: string
  icon: 'compass' | 'shopping' | 'health' | 'bus' | 'briefcase' | 'food'
  phrases: Phrase[]
}

const phrase = (
  id: string,
  kannada: string,
  transliteration: string,
  english: string,
  category: string,
): Phrase => ({ id, kannada, transliteration, english, category })

export const LESSON_CATEGORIES: LessonCategory[] = [
  {
    id: 'travel',
    kannada: 'ಪ್ರಯಾಣ',
    english: 'Travel',
    subtitleKn: 'ವಿಮಾನ, ರೈಲು ಮತ್ತು ವಾಸ್ತವ್ಯ',
    subtitleEn: 'Airport, railway, bus, and hotel',
    icon: 'compass',
    phrases: [
      phrase('hello', 'ನಮಸ್ಕಾರ', 'Namaskāra', 'Hello.', 'Travel'),
      phrase('need-help', 'ನನಗೆ ಸಹಾಯ ಬೇಕು.', 'Nanage sahāya bēku.', 'I need help.', 'Travel'),
      phrase('where-bus', 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?', 'Bus nildāṇa ellide?', 'Where is the bus stop?', 'Travel'),
      phrase('little-kannada', 'ನನಗೆ ಕನ್ನಡ ಸ್ವಲ್ಪ ಮಾತ್ರ ಬರುತ್ತದೆ.', 'Nanage Kannada swalpa mātra baruttade.', 'I speak only a little Kannada.', 'Travel'),
      phrase('speak-slowly', 'ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ.', 'Dayaviṭṭu nidhānavāgi mātanāḍi.', 'Please speak slowly.', 'Travel'),
      phrase('need-water', 'ನನಗೆ ನೀರು ಬೇಕು.', 'Nanage nīru bēku.', 'I need water.', 'Travel'),
    ],
  },
  {
    id: 'shopping',
    kannada: 'ಖರೀದಿ',
    english: 'Shopping',
    subtitleKn: 'ಮಾರುಕಟ್ಟೆ ಮತ್ತು ಅಂಗಡಿಗಳು',
    subtitleEn: 'Markets, stores, and everyday purchases',
    icon: 'shopping',
    phrases: [
      phrase('price', 'ಇದು ಎಷ್ಟು?', 'Idu eṣṭu?', 'How much is this?', 'Shopping'),
      phrase('lower-price', 'ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ.', 'Swalpa kaḍime māḍi.', 'Please lower the price a little.', 'Shopping'),
      phrase('want-this', 'ನನಗೆ ಇದು ಬೇಕು.', 'Nanage idu bēku.', 'I would like this.', 'Shopping'),
      phrase('looks-good', 'ಇದು ಚೆನ್ನಾಗಿದೆ.', 'Idu chennāgide.', 'This looks good.', 'Shopping'),
      phrase('card-accepted', 'ಕಾರ್ಡ್ ಸ್ವೀಕರಿಸುತ್ತೀರಾ?', 'Kārḍ svīkarisuttīrā?', 'Do you accept cards?', 'Shopping'),
      phrase('no-bag', 'ಚೀಲ ಬೇಡ, ಧನ್ಯವಾದಗಳು.', 'Chīla bēḍa, dhanyavādagalu.', 'No bag, thank you.', 'Shopping'),
    ],
  },
  {
    id: 'healthcare',
    kannada: 'ಆರೋಗ್ಯ ಸೇವೆ',
    english: 'Healthcare',
    subtitleKn: 'ಆಸ್ಪತ್ರೆ, ಔಷಧಿ ಮತ್ತು ವೈದ್ಯರು',
    subtitleEn: 'Hospital, pharmacy, and doctor visits',
    icon: 'health',
    phrases: [
      phrase('hospital-where', 'ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ?', 'Āspatre ellide?', 'Where is the hospital?', 'Healthcare'),
      phrase('need-doctor', 'ನನಗೆ ವೈದ್ಯರ ಸಹಾಯ ಬೇಕು.', 'Nanage vaidyar sahāya bēku.', 'I need medical assistance.', 'Healthcare'),
      phrase('fever', 'ನನಗೆ ಜ್ವರ ಬಂದಿದೆ.', 'Nanage jvara bandide.', 'I have a fever.', 'Healthcare'),
      phrase('head-hurts', 'ನನ್ನ ತಲೆಗೆ ನೋವು ಇದೆ.', 'Nanna talege nōvu ide.', 'I have a headache.', 'Healthcare'),
      phrase('medicine', 'ಈ ಔಷಧಿ ಹೇಗೆ ತೆಗೆದುಕೊಳ್ಳಬೇಕು?', 'Ī auṣadhi hēge tegedukoḷḷabēku?', 'How should I take this medicine?', 'Healthcare'),
      phrase('water-health', 'ನನಗೆ ನೀರು ಬೇಕು.', 'Nanage nīru bēku.', 'I need water.', 'Healthcare'),
    ],
  },
  {
    id: 'transport',
    kannada: 'ಸಾರಿಗೆ',
    english: 'Transport',
    subtitleKn: 'ಬಸ್, ರೈಲು, ಟ್ಯಾಕ್ಸಿ ಮತ್ತು ಆಟೋ',
    subtitleEn: 'Bus, train, taxi, and auto-rickshaw',
    icon: 'bus',
    phrases: [
      phrase('bus-stop', 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?', 'Bus nildāṇa ellide?', 'Where is the bus stop?', 'Transport'),
      phrase('train-station', 'ರೈಲು ನಿಲ್ದಾಣಕ್ಕೆ ಹೇಗೆ ಹೋಗುವುದು?', 'Railu nildāṇakke hēge hōguvudu?', 'How do I get to the railway station?', 'Transport'),
      phrase('stop-here', 'ದಯವಿಟ್ಟು ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ.', 'Dayaviṭṭu illi nillisi.', 'Please stop here.', 'Transport'),
      phrase('use-meter', 'ದಯವಿಟ್ಟು ಮೀಟರ್ ಹಾಕಿ.', 'Dayaviṭṭu mīṭar hāki.', 'Please use the meter.', 'Transport'),
      phrase('how-far', 'ಇದು ಎಷ್ಟು ದೂರ?', 'Idu eṣṭu dūra?', 'How far is it?', 'Transport'),
      phrase('go-straight', 'ನೇರವಾಗಿ ಹೋಗಿ.', 'Nēravāgi hōgi.', 'Go straight.', 'Transport'),
    ],
  },
  {
    id: 'workplace',
    kannada: 'ಕೆಲಸದ ಸ್ಥಳ',
    english: 'Workplace',
    subtitleKn: 'ಕಚೇರಿ, ಸಭೆಗಳು ಮತ್ತು ಪರಿಚಯಗಳು',
    subtitleEn: 'Office, meetings, and introductions',
    icon: 'briefcase',
    phrases: [
      phrase('good-morning', 'ಶುಭೋದಯ.', 'Śubhōdaya.', 'Good morning.', 'Workplace'),
      phrase('my-name', 'ನನ್ನ ಹೆಸರು ...', 'Nanna hesaru ...', 'My name is ...', 'Workplace'),
      phrase('meeting-when', 'ಸಭೆ ಯಾವಾಗ ಆರಂಭವಾಗುತ್ತದೆ?', 'Sabhe yāvāga ārambhavāguttade?', 'When does the meeting start?', 'Workplace'),
      phrase('please-explain', 'ದಯವಿಟ್ಟು ವಿವರಿಸಿ.', 'Dayaviṭṭu vivarisi.', 'Please explain.', 'Workplace'),
      phrase('send-email', 'ನಾನು ಇಮೇಲ್ ಕಳುಹಿಸಿದ್ದೇನೆ.', 'Nānu email kaḷuhisiddēne.', 'I have sent the email.', 'Workplace'),
      phrase('thank-you', 'ಧನ್ಯವಾದಗಳು.', 'Dhanyavādagalu.', 'Thank you.', 'Workplace'),
    ],
  },
  {
    id: 'food',
    kannada: 'ಊಟ ಮತ್ತು ಉಪಾಹಾರ ಗೃಹ',
    english: 'Food & Restaurant',
    subtitleKn: 'ಸ್ಥಳೀಯ ಆಹಾರ ಮತ್ತು ಊಟದ ಆರ್ಡರ್',
    subtitleEn: 'Local food, menus, and ordering',
    icon: 'food',
    phrases: [
      phrase('show-menu', 'ಮೆನುವನ್ನು ತೋರಿಸಿ.', 'Menuvannu tōrisi.', 'Please show me the menu.', 'Food & Restaurant'),
      phrase('one-dosa', 'ಒಂದು ದೋಸೆ ಕೊಡಿ.', 'Ondu dōse koḍi.', 'One dosa, please.', 'Food & Restaurant'),
      phrase('less-spicy', 'ಖಾರ ಕಡಿಮೆ ಮಾಡಿ, ದಯವಿಟ್ಟು.', 'Khāra kaḍime māḍi, dayaviṭṭu.', 'Please make it less spicy.', 'Food & Restaurant'),
      phrase('give-water', 'ನೀರು ಕೊಡಿ, ದಯವಿಟ್ಟು.', 'Nīru koḍi, dayaviṭṭu.', 'Water, please.', 'Food & Restaurant'),
      phrase('bill-please', 'ಬಿಲ್ ಕೊಡಿ.', 'Bill koḍi.', 'The bill, please.', 'Food & Restaurant'),
      phrase('what-food', 'ಊಟಕ್ಕೆ ಏನು ಇದೆ?', 'Ūṭakke ēnu ide?', 'What is available to eat?', 'Food & Restaurant'),
    ],
  },
]

export const ALL_PHRASES = LESSON_CATEGORIES.flatMap((category) => category.phrases)

export type QuizQuestion = {
  id: string
  prompt: string
  promptKannada?: string
  options: string[]
  correctIndex: number
  explanation: string
}

export function createLessonQuiz(category: LessonCategory): QuizQuestion[] {
  return category.phrases.slice(0, 3).map((correctPhrase, index) => {
    const distractors = category.phrases
      .filter((item) => item.id !== correctPhrase.id)
      .slice(index, index + 2)
    const options = [correctPhrase.kannada, ...distractors.map((item) => item.kannada)]
    return {
      id: `${category.id}-lesson-${index + 1}`,
      prompt: correctPhrase.english,
      options,
      correctIndex: 0,
      explanation: `${correctPhrase.kannada} (${correctPhrase.transliteration}) means “${correctPhrase.english}”.`,
    }
  })
}

export const DAILY_WORDS: Array<Phrase & { example: string; exampleEnglish: string }> = [
  {
    ...phrase('daily-namaskara', 'ನಮಸ್ಕಾರ', 'Namaskāra', 'Hello; a respectful greeting.', 'Word of the day'),
    example: 'ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?',
    exampleEnglish: 'Hello, how are you?',
  },
  {
    ...phrase('daily-dhanyavadagalu', 'ಧನ್ಯವಾದಗಳು', 'Dhanyavādagalu', 'Thank you.', 'Word of the day'),
    example: 'ನಿಮ್ಮ ಸಹಾಯಕ್ಕೆ ಧನ್ಯವಾದಗಳು.',
    exampleEnglish: 'Thank you for your help.',
  },
  {
    ...phrase('daily-neeru', 'ನೀರು', 'Nīru', 'Water.', 'Word of the day'),
    example: 'ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ನೀರು ಕೊಡಿ.',
    exampleEnglish: 'Please give me some water.',
  },
  {
    ...phrase('daily-dayavittu', 'ದಯವಿಟ್ಟು', 'Dayaviṭṭu', 'Please.', 'Word of the day'),
    example: 'ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ.',
    exampleEnglish: 'Please speak slowly.',
  },
  {
    ...phrase('daily-eshtu', 'ಎಷ್ಟು?', 'Eṣṭu?', 'How much? / How many?', 'Word of the day'),
    example: 'ಇದು ಎಷ್ಟು?',
    exampleEnglish: 'How much is this?',
  },
  {
    ...phrase('daily-beku', 'ಬೇಕು', 'Bēku', 'Need / want.', 'Word of the day'),
    example: 'ನನಗೆ ಕಾಫಿ ಬೇಕು.',
    exampleEnglish: 'I would like coffee.',
  },
  {
    ...phrase('daily-swalpa', 'ಸ್ವಲ್ಪ', 'Swalpa', 'A little.', 'Word of the day'),
    example: 'ನನಗೆ ಕನ್ನಡ ಸ್ವಲ್ಪ ಬರುತ್ತದೆ.',
    exampleEnglish: 'I know a little Kannada.',
  },
]

export function getWordOfTheDay(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0)
  const day = Math.floor((date.getTime() - start.getTime()) / 86_400_000)
  return DAILY_WORDS[(day - 1) % DAILY_WORDS.length]
}

export const DAILY_QUIZ: QuizQuestion[] = [
  {
    id: 'daily-greeting',
    prompt: 'How do you say “Hello” politely?',
    options: ['ನಮಸ್ಕಾರ', 'ಶುಭೋದಯ', 'ಧನ್ಯವಾದಗಳು', 'ನೀರು'],
    correctIndex: 0,
    explanation: 'ನಮಸ್ಕಾರ (Namaskāra) is a respectful everyday greeting.',
  },
  {
    id: 'daily-water',
    prompt: 'What does “ನೀರು ಕೊಡಿ, ದಯವಿಟ್ಟು.” mean?',
    options: ['Please show me the menu.', 'Water, please.', 'Where is the bus stop?', 'I have a fever.'],
    correctIndex: 1,
    explanation: 'ನೀರು ಕೊಡಿ, ದಯವಿಟ್ಟು. (Nīru koḍi, dayaviṭṭu.) means “Water, please.”',
  },
  {
    id: 'daily-bus',
    prompt: 'Choose the phrase for “Where is the bus stop?”',
    options: ['ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ?', 'ಇದು ಎಷ್ಟು?', 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?', 'ನನಗೆ ನೀರು ಬೇಕು.'],
    correctIndex: 2,
    explanation: 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ? (Bus nildāṇa ellide?) asks where the bus stop is.',
  },
  {
    id: 'daily-slowly',
    prompt: 'How do you ask someone to speak slowly?',
    options: ['ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ.', 'ಬಿಲ್ ಕೊಡಿ.', 'ಚೀಲ ಬೇಡ.', 'ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ.'],
    correctIndex: 0,
    explanation: 'ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ. means “Please speak slowly.”',
  },
  {
    id: 'daily-thanks',
    prompt: 'What does “ಧನ್ಯವಾದಗಳು” mean?',
    options: ['Water', 'Please', 'Thank you', 'Hospital'],
    correctIndex: 2,
    explanation: 'ಧನ್ಯವಾದಗಳು (Dhanyavādagalu) means “Thank you.”',
  },
  {
    id: 'daily-restaurant',
    prompt: 'Which phrase asks for one dosa?',
    options: ['ಒಂದು ದೋಸೆ ಕೊಡಿ.', 'ನನಗೆ ಜ್ವರ ಬಂದಿದೆ.', 'ನೇರವಾಗಿ ಹೋಗಿ.', 'ಕಾರ್ಡ್ ಸ್ವೀಕರಿಸುತ್ತೀರಾ?'],
    correctIndex: 0,
    explanation: 'ಒಂದು ದೋಸೆ ಕೊಡಿ. (Ondu dōse koḍi.) means “One dosa, please.”',
  },
]

export type ConversationReply = {
  phrase: Phrase
  correct: boolean
  feedback: string
}

export type ConversationTurn = {
  other: Phrase
  hint: string
  replies: ConversationReply[]
}

export type ConversationScenario = {
  id: string
  kannada: string
  english: string
  description: string
  icon: 'car' | 'food' | 'map' | 'shop' | 'users' | 'health'
  turns: ConversationTurn[]
}

const reply = (id: string, kn: string, roman: string, en: string, category: string, correct: boolean, feedback: string): ConversationReply => ({
  phrase: phrase(id, kn, roman, en, category),
  correct,
  feedback,
})

export const CONVERSATIONS: ConversationScenario[] = [
  {
    id: 'auto-driver', kannada: 'ಆಟೋ ಚಾಲಕರೊಂದಿಗೆ', english: 'Talking to an auto driver', description: 'Tell your driver where to go and ask for a stop.', icon: 'car',
    turns: [
      {
        other: phrase('auto-where', 'ಎಲ್ಲಿಗೆ ಹೋಗಬೇಕು?', 'Ellige hōgabēku?', 'Where would you like to go?', 'Auto ride'),
        hint: 'Name the place you want to visit.',
        replies: [
          reply('auto-palace', 'ಮೈಸೂರು ಅರಮನೆಗೆ ಹೋಗಬೇಕು.', 'Mysūru aramanegē hōgabēku.', 'I want to go to Mysore Palace.', 'Auto ride', true, 'That clearly tells the driver your destination.'),
          reply('auto-water', 'ನನಗೆ ನೀರು ಬೇಕು.', 'Nanage nīru bēku.', 'I need water.', 'Auto ride', false, 'That is useful, but it does not answer where you want to go.'),
          reply('auto-greeting', 'ನಮಸ್ಕಾರ.', 'Namaskāra.', 'Hello.', 'Auto ride', false, 'A greeting is friendly, but the driver asked for your destination.'),
        ],
      },
      {
        other: phrase('auto-meter-question', 'ಮೀಟರ್ ಹಾಕಲಾ?', 'Mīṭar hākalā?', 'Shall I use the meter?', 'Auto ride'),
        hint: 'Agree and politely ask the driver to use the meter.',
        replies: [
          reply('auto-meter-yes', 'ಹೌದು, ಮೀಟರ್ ಹಾಕಿ.', 'Haudu, mīṭar hāki.', 'Yes, please use the meter.', 'Auto ride', true, 'ಹೌದು means “yes”; this is a polite, direct reply.'),
          reply('auto-bill', 'ಬಿಲ್ ಕೊಡಿ.', 'Bill koḍi.', 'The bill, please.', 'Auto ride', false, 'That phrase is for asking for a bill, not the meter.'),
          reply('auto-stop', 'ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ.', 'Illi nillisi.', 'Stop here.', 'Auto ride', false, 'That phrase is for choosing where to stop.'),
        ],
      },
      {
        other: phrase('auto-stop-question', 'ಇಲ್ಲಿ ಇಳಿಯಬೇಕೇ?', 'Illi iḷiyabēkē?', 'Would you like to get down here?', 'Auto ride'),
        hint: 'Confirm the stop and ask the driver to stop here.',
        replies: [
          reply('auto-stop-yes', 'ಹೌದು, ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ.', 'Haudu, illi nillisi.', 'Yes, please stop here.', 'Auto ride', true, 'This confirms the stop and gives a clear polite instruction.'),
          reply('auto-destination', 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?', 'Bus nildāṇa ellide?', 'Where is the bus stop?', 'Auto ride', false, 'This asks for a bus stop rather than confirming your stop.'),
          reply('auto-thanks', 'ಧನ್ಯವಾದಗಳು.', 'Dhanyavādagalu.', 'Thank you.', 'Auto ride', false, 'A kind phrase, but it does not answer the question.'),
        ],
      },
    ],
  },
  {
    id: 'restaurant', kannada: 'ಉಪಾಹಾರ ಗೃಹದಲ್ಲಿ', english: 'Ordering food in a restaurant', description: 'Choose a dish, ask for water, and request the bill.', icon: 'food',
    turns: [
      {
        other: phrase('restaurant-order', 'ಏನು ಆರ್ಡರ್ ಮಾಡುತ್ತೀರಾ?', 'Ēnu ārḍar māḍuttīrā?', 'What would you like to order?', 'Restaurant'),
        hint: 'Ask for a familiar dish.',
        replies: [
          reply('restaurant-dose', 'ಒಂದು ದೋಸೆ ಕೊಡಿ.', 'Ondu dōse koḍi.', 'One dosa, please.', 'Restaurant', true, 'A natural way to order one dosa.'),
          reply('restaurant-bus', 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?', 'Bus nildāṇa ellide?', 'Where is the bus stop?', 'Restaurant', false, 'That question is useful outside, but not for ordering food.'),
          reply('restaurant-fever', 'ನನಗೆ ಜ್ವರ ಬಂದಿದೆ.', 'Nanage jvara bandide.', 'I have a fever.', 'Restaurant', false, 'That phrase describes a symptom.'),
        ],
      },
      {
        other: phrase('restaurant-more', 'ಇನ್ನೇನಾದರೂ ಬೇಕೇ?', 'Innēnādaru bēkē?', 'Would you like anything else?', 'Restaurant'),
        hint: 'Ask for a drink politely.',
        replies: [
          reply('restaurant-water', 'ನೀರು ಕೊಡಿ, ದಯವಿಟ್ಟು.', 'Nīru koḍi, dayaviṭṭu.', 'Water, please.', 'Restaurant', true, 'This politely asks for water.'),
          reply('restaurant-meter', 'ದಯವಿಟ್ಟು ಮೀಟರ್ ಹಾಕಿ.', 'Dayaviṭṭu mīṭar hāki.', 'Please use the meter.', 'Restaurant', false, 'That request is for an auto ride.'),
          reply('restaurant-slow', 'ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ.', 'Dayaviṭṭu nidhānavāgi mātanāḍi.', 'Please speak slowly.', 'Restaurant', false, 'A helpful phrase, but it does not request anything else.'),
        ],
      },
      {
        other: phrase('restaurant-bill-question', 'ಬಿಲ್ ಬೇಕೇ?', 'Bill bēkē?', 'Would you like the bill?', 'Restaurant'),
        hint: 'Confirm and ask for the bill.',
        replies: [
          reply('restaurant-bill-yes', 'ಹೌದು, ಬಿಲ್ ಕೊಡಿ.', 'Haudu, bill koḍi.', 'Yes, the bill, please.', 'Restaurant', true, 'This confirms and asks for the bill.'),
          reply('restaurant-less-spicy', 'ಖಾರ ಕಡಿಮೆ ಮಾಡಿ.', 'Khāra kaḍime māḍi.', 'Make it less spicy.', 'Restaurant', false, 'That is a request to adjust your dish.'),
          reply('restaurant-hello', 'ನಮಸ್ಕಾರ.', 'Namaskāra.', 'Hello.', 'Restaurant', false, 'A greeting does not answer the bill question.'),
        ],
      },
    ],
  },
  {
    id: 'directions', kannada: 'ದಾರಿ ಕೇಳುವುದು', english: 'Asking for directions', description: 'Ask where a place is and follow a simple direction.', icon: 'map',
    turns: [
      {
        other: phrase('direction-where-to', 'ಯಾವ ಜಾಗಕ್ಕೆ ಹೋಗಬೇಕು?', 'Yāva jāgakke hōgabēku?', 'Which place do you need to go to?', 'Directions'),
        hint: 'Say that you need to reach the bus stop.',
        replies: [
          reply('direction-bus', 'ಬಸ್ ನಿಲ್ದಾಣಕ್ಕೆ ಹೋಗಬೇಕು.', 'Bus nildāṇakke hōgabēku.', 'I need to go to the bus stop.', 'Directions', true, 'You have named the place you are trying to reach.'),
          reply('direction-food', 'ಒಂದು ದೋಸೆ ಕೊಡಿ.', 'Ondu dōse koḍi.', 'One dosa, please.', 'Directions', false, 'That is a restaurant order.'),
          reply('direction-thanks', 'ಧನ್ಯವಾದಗಳು.', 'Dhanyavādagalu.', 'Thank you.', 'Directions', false, 'A polite phrase, but it does not name a destination.'),
        ],
      },
      {
        other: phrase('direction-go-straight', 'ನೇರವಾಗಿ ಹೋಗಿ, ನಂತರ ಬಲಕ್ಕೆ ತಿರುಗಿ.', 'Nēravāgi hōgi, nantara balakke tirugi.', 'Go straight, then turn right.', 'Directions'),
        hint: 'Acknowledge the directions politely.',
        replies: [
          reply('direction-thank-you', 'ಧನ್ಯವಾದಗಳು.', 'Dhanyavādagalu.', 'Thank you.', 'Directions', true, 'This is a natural way to acknowledge the directions.'),
          reply('direction-water', 'ನನಗೆ ನೀರು ಬೇಕು.', 'Nanage nīru bēku.', 'I need water.', 'Directions', false, 'That does not respond to the route instructions.'),
          reply('direction-price', 'ಇದು ಎಷ್ಟು?', 'Idu eṣṭu?', 'How much is this?', 'Directions', false, 'That question is for shopping.'),
        ],
      },
      {
        other: phrase('direction-understand', 'ಅರ್ಥವಾಯಿತೇ?', 'Arthavāyitē?', 'Did you understand?', 'Directions'),
        hint: 'Confirm that you understand.',
        replies: [
          reply('direction-understood', 'ಹೌದು, ಅರ್ಥವಾಯಿತು.', 'Haudu, arthavāyitu.', 'Yes, I understand.', 'Directions', true, 'ಹೌದು means “yes”; ಅರ್ಥವಾಯಿತು means “I understood.”'),
          reply('direction-bill', 'ಬಿಲ್ ಕೊಡಿ.', 'Bill koḍi.', 'The bill, please.', 'Directions', false, 'That is used when paying at a restaurant.'),
          reply('direction-name', 'ನನ್ನ ಹೆಸರು ...', 'Nanna hesaru ...', 'My name is ...', 'Directions', false, 'That phrase introduces yourself.'),
        ],
      },
    ],
  },
  {
    id: 'market', kannada: 'ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ', english: 'Shopping in a local market', description: 'Ask for produce, choose what you need, and decline a bag.', icon: 'shop',
    turns: [
      {
        other: phrase('market-what', 'ಏನು ಬೇಕು?', 'Ēnu bēku?', 'What would you like?', 'Market'),
        hint: 'Ask for one kilo of tomatoes.',
        replies: [
          reply('market-tomatoes', 'ಒಂದು ಕಿಲೋ ಟೊಮೇಟೊ ಕೊಡಿ.', 'Ondu kilō ṭomēṭō koḍi.', 'One kilo of tomatoes, please.', 'Market', true, 'This gives the item and quantity you want.'),
          reply('market-slow', 'ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ.', 'Dayaviṭṭu nidhānavāgi mātanāḍi.', 'Please speak slowly.', 'Market', false, 'That is useful if you cannot follow, but it does not order produce.'),
          reply('market-hospital', 'ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ?', 'Āspatre ellide?', 'Where is the hospital?', 'Market', false, 'That question is for asking directions.'),
        ],
      },
      {
        other: phrase('market-anything', 'ಬೇರೆ ಏನಾದರೂ ಬೇಕೇ?', 'Bēre ēnādaru bēkē?', 'Would you like anything else?', 'Market'),
        hint: 'Say that this is enough.',
        replies: [
          reply('market-enough', 'ಇಲ್ಲ, ಇಷ್ಟೇ ಸಾಕು.', 'Illa, iṣṭē sāku.', 'No, that is enough.', 'Market', true, 'This politely says you do not need anything else.'),
          reply('market-dose', 'ಒಂದು ದೋಸೆ ಕೊಡಿ.', 'Ondu dōse koḍi.', 'One dosa, please.', 'Market', false, 'That is a restaurant order, not a market response.'),
          reply('market-hello', 'ನಮಸ್ಕಾರ.', 'Namaskāra.', 'Hello.', 'Market', false, 'A greeting does not answer the question.'),
        ],
      },
      {
        other: phrase('market-bag', 'ಚೀಲ ಬೇಕೇ?', 'Chīla bēkē?', 'Would you like a bag?', 'Market'),
        hint: 'Politely say you do not need a bag.',
        replies: [
          reply('market-no-bag', 'ಚೀಲ ಬೇಡ, ಧನ್ಯವಾದಗಳು.', 'Chīla bēḍa, dhanyavādagalu.', 'No bag, thank you.', 'Market', true, 'This politely declines the bag.'),
          reply('market-yes-bag', 'ಹೌದು, ಚೀಲ ಕೊಡಿ.', 'Haudu, chīla koḍi.', 'Yes, please give me a bag.', 'Market', false, 'This asks for a bag rather than declining it.'),
          reply('market-water', 'ನೀರು ಕೊಡಿ.', 'Nīru koḍi.', 'Give me water.', 'Market', false, 'That asks for water.'),
        ],
      },
    ],
  },
  {
    id: 'student', kannada: 'ಕಾಲೇಜು ವಿದ್ಯಾರ್ಥಿಯೊಂದಿಗೆ', english: 'Talking to a college student', description: 'Introduce yourself and share that you are learning Kannada.', icon: 'users',
    turns: [
      {
        other: phrase('student-name-question', 'ನಿಮ್ಮ ಹೆಸರು ಏನು?', 'Nimma hesaru ēnu?', 'What is your name?', 'Introductions'),
        hint: 'Introduce yourself.',
        replies: [
          reply('student-name', 'ನನ್ನ ಹೆಸರು ...', 'Nanna hesaru ...', 'My name is ...', 'Introductions', true, 'This is the standard way to introduce your name.'),
          reply('student-fever', 'ನನಗೆ ಜ್ವರ ಬಂದಿದೆ.', 'Nanage jvara bandide.', 'I have a fever.', 'Introductions', false, 'That describes how you are feeling when unwell.'),
          reply('student-price', 'ಇದು ಎಷ್ಟು?', 'Idu eṣṭu?', 'How much is this?', 'Introductions', false, 'That question is for shopping.'),
        ],
      },
      {
        other: phrase('student-learn-question', 'ನೀವು ಕನ್ನಡ ಕಲಿಯುತ್ತಿದ್ದೀರಾ?', 'Nīvu Kannada kaliyuttiddīrā?', 'Are you learning Kannada?', 'Introductions'),
        hint: 'Say yes and that you are learning a little at a time.',
        replies: [
          reply('student-learning', 'ಹೌದು, ಸ್ವಲ್ಪ ಸ್ವಲ್ಪ ಕಲಿಯುತ್ತಿದ್ದೇನೆ.', 'Haudu, swalpa swalpa kaliyuttiddēne.', 'Yes, I am learning little by little.', 'Introductions', true, 'This answers yes and describes your progress.'),
          reply('student-bill', 'ಬಿಲ್ ಕೊಡಿ.', 'Bill koḍi.', 'The bill, please.', 'Introductions', false, 'That phrase is used at a restaurant.'),
          reply('student-bus', 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?', 'Bus nildāṇa ellide?', 'Where is the bus stop?', 'Introductions', false, 'That asks for a location.'),
        ],
      },
      {
        other: phrase('student-help-question', 'ನಿಮಗೆ ಸಹಾಯ ಬೇಕೇ?', 'Nimage sahāya bēkē?', 'Do you need help?', 'Introductions'),
        hint: 'Accept the offer and say thank you.',
        replies: [
          reply('student-help-yes', 'ಹೌದು, ಧನ್ಯವಾದಗಳು.', 'Haudu, dhanyavādagalu.', 'Yes, thank you.', 'Introductions', true, 'A simple, polite answer that accepts help.'),
          reply('student-less-spicy', 'ಖಾರ ಕಡಿಮೆ ಮಾಡಿ.', 'Khāra kaḍime māḍi.', 'Make it less spicy.', 'Introductions', false, 'That phrase is used when ordering food.'),
          reply('student-straight', 'ನೇರವಾಗಿ ಹೋಗಿ.', 'Nēravāgi hōgi.', 'Go straight.', 'Introductions', false, 'That phrase gives someone directions.'),
        ],
      },
    ],
  },
  {
    id: 'hospital-help', kannada: 'ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ಸಹಾಯ ಕೇಳುವುದು', english: 'Asking for help at a hospital', description: 'Describe a symptom and ask to see a doctor.', icon: 'health',
    turns: [
      {
        other: phrase('hospital-problem', 'ನಿಮಗೆ ಏನು ತೊಂದರೆ?', 'Nimage ēnu tondare?', 'What is troubling you?', 'Hospital visit'),
        hint: 'Describe a common symptom.',
        replies: [
          reply('hospital-fever', 'ನನಗೆ ಜ್ವರ ಬಂದಿದೆ.', 'Nanage jvara bandide.', 'I have a fever.', 'Hospital visit', true, 'This clearly describes a fever.'),
          reply('hospital-price', 'ಇದು ಎಷ್ಟು?', 'Idu eṣṭu?', 'How much is this?', 'Hospital visit', false, 'That question is for asking a price.'),
          reply('hospital-dosa', 'ಒಂದು ದೋಸೆ ಕೊಡಿ.', 'Ondu dōse koḍi.', 'One dosa, please.', 'Hospital visit', false, 'That is a restaurant order.'),
        ],
      },
      {
        other: phrase('hospital-pain', 'ನೋವು ಎಲ್ಲಿದೆ?', 'Nōvu ellide?', 'Where is the pain?', 'Hospital visit'),
        hint: 'Say that your head hurts.',
        replies: [
          reply('hospital-headache', 'ನನ್ನ ತಲೆಗೆ ನೋವು ಇದೆ.', 'Nanna talege nōvu ide.', 'I have a headache.', 'Hospital visit', true, 'This says that you have pain in your head.'),
          reply('hospital-no-water', 'ಚೀಲ ಬೇಡ.', 'Chīla bēḍa.', 'No bag.', 'Hospital visit', false, 'That is used when declining a shopping bag.'),
          reply('hospital-straight', 'ನೇರವಾಗಿ ಹೋಗಿ.', 'Nēravāgi hōgi.', 'Go straight.', 'Hospital visit', false, 'That phrase gives directions.'),
        ],
      },
      {
        other: phrase('hospital-doctor', 'ವೈದ್ಯರನ್ನು ನೋಡಬೇಕೇ?', 'Vaidyarannu nōḍabēkē?', 'Would you like to see a doctor?', 'Hospital visit'),
        hint: 'Agree politely.',
        replies: [
          reply('hospital-yes-doctor', 'ಹೌದು, ದಯವಿಟ್ಟು.', 'Haudu, dayaviṭṭu.', 'Yes, please.', 'Hospital visit', true, 'This is a clear, polite confirmation.'),
          reply('hospital-hello', 'ನಮಸ್ಕಾರ.', 'Namaskāra.', 'Hello.', 'Hospital visit', false, 'A greeting is kind, but it does not answer the question.'),
          reply('hospital-more-spicy', 'ಖಾರ ಕಡಿಮೆ ಮಾಡಿ.', 'Khāra kaḍime māḍi.', 'Make it less spicy.', 'Hospital visit', false, 'That phrase is used when ordering food.'),
        ],
      },
    ],
  },
]

export type HeritagePlace = {
  id: string
  name: string
  kannada: string
  location: string
  description: string
  fact: string
  vocabulary: Phrase
  image: string
  imageAlt: string
}


export const HERITAGE_PLACES: HeritagePlace[] = [
  {
    id: 'mysore-palace', name: 'Mysore Palace', kannada: 'ಮೈಸೂರು ಅರಮನೆ', location: 'Mysuru · Southern Karnataka',
    description: 'A landmark in the heart of Mysuru, associated with the city’s royal heritage and public celebrations.',
    fact: 'The present palace was rebuilt in the Indo-Saracenic style and completed in 1912.',
    vocabulary: phrase('vocab-palace', 'ಅರಮನೆ ಎಲ್ಲಿದೆ?', 'Aramane ellide?', 'Where is the palace?', 'Heritage visit'),
    image: '/images/mysore-palace.jpg', imageAlt: 'Mysore Palace illuminated at sunset',
  },
  {
    id: 'hampi', name: 'Hampi', kannada: 'ಹಂಪಿ', location: 'Vijayanagara · Northern Karnataka',
    description: 'A landscape of temples and historic structures associated with the former Vijayanagara capital.',
    fact: 'Hampi is inscribed on UNESCO’s World Heritage List.',
    vocabulary: phrase('vocab-temple', 'ದೇವಾಲಯ ಎಲ್ಲಿದೆ?', 'Dēvā­laya ellide?', 'Where is the temple?', 'Heritage visit'),
    image: '/images/hampi.jpg', imageAlt: 'Historic stone architecture and landscape at Hampi',
  },
  {
    id: 'halebidu', name: 'Halebidu', kannada: 'ಹಳೇಬೀಡು', location: 'Hassan · Southern Karnataka',
    description: 'A Hoysala heritage town known for intricately carved temple architecture.',
    fact: 'The Hoysaleswara Temple is celebrated for detailed stone sculpture.',
    vocabulary: phrase('vocab-stone-carving', 'ಈ ಕೆತ್ತನೆ ಸುಂದರವಾಗಿದೆ.', 'Ī ketthane sundaravāgide.', 'This carving is beautiful.', 'Heritage visit'),
    image: '/images/halebidu.jpg', imageAlt: 'Carved Hoysala temple stonework at Halebidu',
  },
  {
    id: 'belur', name: 'Belur', kannada: 'ಬೇಲೂರು', location: 'Hassan · Southern Karnataka',
    description: 'A historic temple town whose Chennakeshava Temple is a major example of Hoysala architecture.',
    fact: 'The Chennakeshava Temple was commissioned in the 12th century by Hoysala king Vishnuvardhana.',
    vocabulary: phrase('vocab-temple-ticket', 'ಪ್ರವೇಶ ಶುಲ್ಕ ಎಷ್ಟು?', 'Pravēśa śulka eṣṭu?', 'How much is the entrance fee?', 'Heritage visit'),
    image: '/images/belur-chennakeshava.png', imageAlt: 'Illustrative view of the Chennakeshava Temple at Belur',
  },
  {
    id: 'badami', name: 'Badami', kannada: 'ಬಾದಾಮಿ', location: 'Bagalkot · Northern Karnataka',
    description: 'A historic town known for rock-cut cave temples and early Chalukya-era architecture.',
    fact: 'The cave temples are carved into red sandstone cliffs overlooking Agastya Lake.',
    vocabulary: phrase('vocab-cave', 'ಗುಹೆಗಳು ಎಲ್ಲಿವೆ?', 'Guhegalu ellive?', 'Where are the caves?', 'Heritage visit'),
    image: '/images/badami-caves.png', imageAlt: 'Illustrative view of the Badami Cave Temples in red sandstone',
  },
]

export const FESTIVALS = [
  {
    id: 'ugadi', kannada: 'ಯುಗಾದಿ', transliteration: 'Yugādi', english: 'Ugadi',
    summary: 'Ugadi marks the new year in Karnataka and several neighboring regions, following the lunisolar calendar.',
    detail: 'In Karnataka, families may prepare bevu-bella, combining neem and jaggery as a reminder that life includes different experiences. Practices vary by household.',
    vocabulary: phrase('culture-new-year', 'ಹೊಸ ವರ್ಷದ ಶುಭಾಶಯಗಳು.', 'Hosa varṣada śubhāśayagalu.', 'New year wishes.', 'Culture'),
  },
  {
    id: 'mysore-dasara', kannada: 'ಮೈಸೂರು ದಸರಾ', transliteration: 'Mysūru Dasarā', english: 'Mysore Dasara',
    summary: 'A ten-day celebration in Mysuru connected with Navaratri and the city’s royal heritage.',
    detail: 'The season includes public cultural programs and a decorated palace; the schedule and events can change from year to year.',
    vocabulary: phrase('culture-festival', 'ಹಬ್ಬ ಯಾವಾಗ ಆರಂಭವಾಗುತ್ತದೆ?', 'Habba yāvāga ārambhavāguttade?', 'When does the festival begin?', 'Culture'),
  },
  {
    id: 'deepavali', kannada: 'ದೀಪಾವಳಿ', transliteration: 'Dīpāvaḷi', english: 'Deepavali',
    summary: 'A festival of lights observed in many communities, with customs that differ across families and traditions.',
    detail: 'Homes and public spaces may be lit with lamps. The dates follow the Hindu lunisolar calendar, and local observances vary.',
    vocabulary: phrase('culture-lamp', 'ದೀಪಗಳು ಸುಂದರವಾಗಿವೆ.', 'Dīpagaḷu sundaravāgive.', 'The lamps are beautiful.', 'Culture'),
  },
  {
    id: 'hampi-utsava', kannada: 'ಹಂಪಿ ಉತ್ಸವ', transliteration: 'Hampi Utsava', english: 'Hampi Utsava',
    summary: 'A cultural festival held at Hampi, featuring performances and arts in a historic setting.',
    detail: 'Program details and dates vary by edition; check current local announcements before planning a visit.',
    vocabulary: phrase('culture-music', 'ಸಂಗೀತ ಕಾರ್ಯಕ್ರಮ ಎಲ್ಲಿದೆ?', 'Saṅgīta kāryakrama ellide?', 'Where is the music program?', 'Culture'),
  },
]

export const CULTURE_QUIZ: QuizQuestion[] = [
  {
    id: 'culture-ugadi', prompt: 'Which festival marks the new year in Karnataka?',
    options: ['Ugadi', 'Deepavali', 'Hampi Utsava'], correctIndex: 0,
    explanation: 'Ugadi marks the new year in Karnataka and several neighboring regions.',
  },
  {
    id: 'culture-mysore', prompt: 'Which celebration is closely associated with Mysuru?',
    options: ['Mysore Dasara', 'Ugadi', 'Hampi Utsava'], correctIndex: 0,
    explanation: 'Mysore Dasara is a ten-day celebration connected with Mysuru and Navaratri.',
  },
  {
    id: 'culture-hampi', prompt: 'Which festival is held in the historic setting of Hampi?',
    options: ['Deepavali', 'Hampi Utsava', 'Ugadi'], correctIndex: 1,
    explanation: 'Hampi Utsava is a cultural festival held at Hampi; dates and programs vary.',
  },
]

export const EMERGENCY_PHRASES: Phrase[] = [
  phrase('emergency-help', 'ಸಹಾಯ ಮಾಡಿ!', 'Sahāya māḍi!', 'Please help!', 'Emergency'),
  phrase('emergency-hospital', 'ನನಗೆ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಬೇಕು.', 'Nanage āspatrege hōgabēku.', 'I need to go to the hospital.', 'Emergency'),
  phrase('emergency-understand', 'ನನಗೆ ಕನ್ನಡ ಅರ್ಥವಾಗುವುದಿಲ್ಲ.', 'Nanage Kannada arthavāguvudilla.', 'I do not understand Kannada.', 'Emergency'),
  phrase('emergency-police', 'ಪೊಲೀಸರನ್ನು ಕರೆಸಿ.', 'Pōlīsarannu karesi.', 'Please call the police.', 'Emergency'),
  phrase('emergency-medical', 'ನನಗೆ ವೈದ್ಯರ ಸಹಾಯ ಬೇಕು.', 'Nanage vaidyar sahāya bēku.', 'I need medical assistance.', 'Emergency'),
]

export type SurvivalStage = {
  id: string
  title: string
  kannada: string
  intro: string
  scenario: string
  scenarioKn: string
  phrases: Phrase[]
  questions: QuizQuestion[]
}

export const SURVIVAL_STAGES: SurvivalStage[] = [
  {
    id: 'greetings', title: 'Greetings & introductions', kannada: 'ಶುಭಾಶಯಗಳು ಮತ್ತು ಪರಿಚಯ',
    intro: 'Start with a greeting, say your name, and share that you are learning Kannada.',
    scenario: 'You arrive at a homestay and need to greet your host and introduce yourself.',
    scenarioKn: 'ನೀವು ಹೋಂಸ್ಟೇಗೆ ಬಂದು ಆತಿಥೇಯರನ್ನು ವಂದಿಸಿ ನಿಮ್ಮ ಪರಿಚಯ ನೀಡಬೇಕು.',
    phrases: [LESSON_CATEGORIES[0].phrases[0], LESSON_CATEGORIES[4].phrases[1], LESSON_CATEGORIES[0].phrases[3]],
    questions: [
      { id: 'survival-greeting', prompt: 'How do you say hello politely?', options: ['ನಮಸ್ಕಾರ', 'ನೀರು', 'ಬಿಲ್ ಕೊಡಿ'], correctIndex: 0, explanation: 'ನಮಸ್ಕಾರ is a respectful everyday greeting.' },
      { id: 'survival-name', prompt: 'Choose “My name is …”', options: ['ನನ್ನ ಹೆಸರು ...', 'ನನಗೆ ಜ್ವರ ಬಂದಿದೆ.', 'ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ.'], correctIndex: 0, explanation: 'ನನ್ನ ಹೆಸರು ... means “My name is …”.' },
      { id: 'survival-learning', prompt: 'How do you say “I speak only a little Kannada”?', options: ['ನನಗೆ ಕನ್ನಡ ಸ್ವಲ್ಪ ಮಾತ್ರ ಬರುತ್ತದೆ.', 'ಕಾರ್ಡ್ ಸ್ವೀಕರಿಸುತ್ತೀರಾ?', 'ಒಂದು ದೋಸೆ ಕೊಡಿ.'], correctIndex: 0, explanation: 'ನನಗೆ ಕನ್ನಡ ಸ್ವಲ್ಪ ಮಾತ್ರ ಬರುತ್ತದೆ. is a useful beginner phrase.' },
    ],
  },
  {
    id: 'directions', title: 'Asking for directions', kannada: 'ದಾರಿ ಕೇಳುವುದು',
    intro: 'Ask where a place is and understand a simple direction.',
    scenario: 'You are in a new neighborhood and need directions to the bus stop.',
    scenarioKn: 'ನೀವು ಹೊಸ ಪ್ರದೇಶದಲ್ಲಿದ್ದೀರಿ; ಬಸ್ ನಿಲ್ದಾಣಕ್ಕೆ ದಾರಿ ಕೇಳಬೇಕು.',
    phrases: [LESSON_CATEGORIES[0].phrases[2], LESSON_CATEGORIES[3].phrases[5], LESSON_CATEGORIES[3].phrases[4]],
    questions: [
      { id: 'survival-direction-where', prompt: 'Where is the bus stop?', options: ['ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?', 'ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ.', 'ನೀರು ಕೊಡಿ.'], correctIndex: 0, explanation: 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ? asks where the bus stop is.' },
      { id: 'survival-direction-straight', prompt: 'Choose “Go straight.”', options: ['ನೇರವಾಗಿ ಹೋಗಿ.', 'ಇದು ಎಷ್ಟು?', 'ಧನ್ಯವಾದಗಳು.'], correctIndex: 0, explanation: 'ನೇರವಾಗಿ ಹೋಗಿ. means “Go straight.”' },
      { id: 'survival-direction-thanks', prompt: 'What is a polite way to thank someone?', options: ['ಧನ್ಯವಾದಗಳು.', 'ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ?', 'ಮೀಟರ್ ಹಾಕಿ.'], correctIndex: 0, explanation: 'ಧನ್ಯವಾದಗಳು means “Thank you.”' },
    ],
  },
  {
    id: 'transport', title: 'Bus & auto travel', kannada: 'ಬಸ್ ಮತ್ತು ಆಟೋ ಪ್ರಯಾಣ',
    intro: 'Name your destination, ask for the meter, and request a stop.',
    scenario: 'You need to tell an auto driver your destination and ask them to stop.',
    scenarioKn: 'ಆಟೋ ಚಾಲಕರಿಗೆ ಗಮ್ಯಸ್ಥಾನ ತಿಳಿಸಿ, ನಿಲ್ಲಿಸಲು ಹೇಳಬೇಕು.',
    phrases: [LESSON_CATEGORIES[3].phrases[1], LESSON_CATEGORIES[3].phrases[3], LESSON_CATEGORIES[3].phrases[2]],
    questions: [
      { id: 'survival-transport-station', prompt: 'How do you ask where the bus stop is?', options: ['ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?', 'ನನಗೆ ವೈದ್ಯರ ಸಹಾಯ ಬೇಕು.', 'ಚೀಲ ಬೇಡ.'], correctIndex: 0, explanation: 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ? asks for the bus stop.' },
      { id: 'survival-transport-meter', prompt: 'Choose “Please use the meter.”', options: ['ದಯವಿಟ್ಟು ಮೀಟರ್ ಹಾಕಿ.', 'ನೇರವಾಗಿ ಹೋಗಿ.', 'ಒಂದು ದೋಸೆ ಕೊಡಿ.'], correctIndex: 0, explanation: 'ದಯವಿಟ್ಟು ಮೀಟರ್ ಹಾಕಿ. is a polite request to use the meter.' },
      { id: 'survival-transport-stop', prompt: 'Choose “Please stop here.”', options: ['ದಯವಿಟ್ಟು ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ.', 'ಇದು ಎಷ್ಟು?', 'ನನ್ನ ಹೆಸರು ...'], correctIndex: 0, explanation: 'ದಯವಿಟ್ಟು ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ. asks the driver to stop here.' },
    ],
  },
  {
    id: 'food', title: 'Ordering food', kannada: 'ಊಟ ಆರ್ಡರ್ ಮಾಡುವುದು',
    intro: 'Order a local favorite, ask for water, and request the bill.',
    scenario: 'At a restaurant, order a dosa, ask for water, and request the bill.',
    scenarioKn: 'ರೆಸ್ಟೋರೆಂಟ್‌ನಲ್ಲಿ ದೋಸೆ ಆರ್ಡರ್ ಮಾಡಿ, ನೀರು ಕೇಳಿ, ಬಿಲ್ ಕೇಳಬೇಕು.',
    phrases: [LESSON_CATEGORIES[5].phrases[1], LESSON_CATEGORIES[5].phrases[2], LESSON_CATEGORIES[5].phrases[3]],
    questions: [
      { id: 'survival-food-order', prompt: 'How do you order one dosa?', options: ['ಒಂದು ದೋಸೆ ಕೊಡಿ.', 'ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ?', 'ಮೀಟರ್ ಹಾಕಿ.'], correctIndex: 0, explanation: 'ಒಂದು ದೋಸೆ ಕೊಡಿ. means “One dosa, please.”' },
      { id: 'survival-food-spice', prompt: 'Choose “Please make it less spicy.”', options: ['ಖಾರ ಕಡಿಮೆ ಮಾಡಿ, ದಯವಿಟ್ಟು.', 'ದಯವಿಟ್ಟು ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ.', 'ನನ್ನ ಹೆಸರು ...'], correctIndex: 0, explanation: 'ಖಾರ ಕಡಿಮೆ ಮಾಡಿ asks for less spice.' },
      { id: 'survival-food-water', prompt: 'What do you say when asking for water?', options: ['ನೀರು ಕೊಡಿ, ದಯವಿಟ್ಟು.', 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?', 'ಕಾರ್ಡ್ ಸ್ವೀಕರಿಸುತ್ತೀರಾ?'], correctIndex: 0, explanation: 'ನೀರು ಕೊಡಿ, ದಯವಿಟ್ಟು. means “Water, please.”' },
    ],
  },
  {
    id: 'shopping', title: 'Shopping & payments', kannada: 'ಖರೀದಿ ಮತ್ತು ಪಾವತಿ',
    intro: 'Ask the price, request a small discount, and talk about payment.',
    scenario: 'At a market, ask a price, request a lower price, and ask about card payment.',
    scenarioKn: 'ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಬೆಲೆ ಕೇಳಿ, ಕಡಿಮೆ ಮಾಡಲು ವಿನಂತಿಸಿ, ಕಾರ್ಡ್ ಪಾವತಿ ಬಗ್ಗೆ ಕೇಳಬೇಕು.',
    phrases: [LESSON_CATEGORIES[1].phrases[0], LESSON_CATEGORIES[1].phrases[1], LESSON_CATEGORIES[1].phrases[4]],
    questions: [
      { id: 'survival-shopping-price', prompt: 'How do you ask “How much is this?”', options: ['ಇದು ಎಷ್ಟು?', 'ನನಗೆ ನೀರು ಬೇಕು.', 'ಸಭೆ ಯಾವಾಗ ಆರಂಭವಾಗುತ್ತದೆ?'], correctIndex: 0, explanation: 'ಇದು ಎಷ್ಟು? asks how much an item costs.' },
      { id: 'survival-shopping-discount', prompt: 'Choose “Please lower the price a little.”', options: ['ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ.', 'ಬಿಲ್ ಕೊಡಿ.', 'ನೇರವಾಗಿ ಹೋಗಿ.'], correctIndex: 0, explanation: 'ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ. is a polite request for a lower price.' },
      { id: 'survival-shopping-card', prompt: 'How do you ask if cards are accepted?', options: ['ಕಾರ್ಡ್ ಸ್ವೀಕರಿಸುತ್ತೀರಾ?', 'ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ.', 'ನನಗೆ ಜ್ವರ ಬಂದಿದೆ.'], correctIndex: 0, explanation: 'ಕಾರ್ಡ್ ಸ್ವೀಕರಿಸುತ್ತೀರಾ? asks whether cards are accepted.' },
    ],
  },
  {
    id: 'asking-help', title: 'Asking for help', kannada: 'ಸಹಾಯ ಕೇಳುವುದು',
    intro: 'Use clear phrases when you need assistance or medical help.',
    scenario: 'You need to ask someone for help and explain that you need medical support.',
    scenarioKn: 'ನಿಮಗೆ ಸಹಾಯ ಕೇಳಿ ವೈದ್ಯಕೀಯ ನೆರವು ಬೇಕೆಂದು ತಿಳಿಸಬೇಕು.',
    phrases: [LESSON_CATEGORIES[0].phrases[1], EMERGENCY_PHRASES[0], EMERGENCY_PHRASES[4]],
    questions: [
      { id: 'survival-help', prompt: 'How do you say “I need help”?', options: ['ನನಗೆ ಸಹಾಯ ಬೇಕು.', 'ಒಂದು ದೋಸೆ ಕೊಡಿ.', 'ಚೀಲ ಬೇಡ.'], correctIndex: 0, explanation: 'ನನಗೆ ಸಹಾಯ ಬೇಕು. means “I need help.”' },
      { id: 'survival-help-hospital', prompt: 'Choose “I need to go to the hospital.”', options: ['ನನಗೆ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಬೇಕು.', 'ಇದು ಎಷ್ಟು?', 'ನಮಸ್ಕಾರ.'], correctIndex: 0, explanation: 'ನನಗೆ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಬೇಕು. means “I need to go to the hospital.”' },
      { id: 'survival-help-doctor', prompt: 'How do you ask for medical assistance?', options: ['ನನಗೆ ವೈದ್ಯರ ಸಹಾಯ ಬೇಕು.', 'ಮೆನುವನ್ನು ತೋರಿಸಿ.', 'ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ.'], correctIndex: 0, explanation: 'ನನಗೆ ವೈದ್ಯರ ಸಹಾಯ ಬೇಕು. means “I need medical assistance.”' },
    ],
  },
]
