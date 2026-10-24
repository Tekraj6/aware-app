export interface Quote {
  text: string;
  author: string;
}

export const quotes: Quote[] = [
  // --- Original 20 Wisdom Quotes ---
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
  { text: "The more we know about ourselves, the more we can grow.", author: "Joseph Luft" },
  { text: "Until you make the unconscious conscious, it will direct your life and you will call it fate.", author: "Carl Jung" },
  { text: "Vulnerability is the birthplace of innovation, creativity, and change.", author: "Brené Brown" },
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "Everything that irritates us about others can lead us to an understanding of ourselves.", author: "Carl Jung" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "The privilege of a lifetime is to become who you truly are.", author: "Carl Jung" },
  { text: "We don't see things as they are, we see them as we are.", author: "Anaïs Nin" },
  { text: "The only journey is the journey within.", author: "Rainer Maria Rilke" },
  { text: "Owning our story and loving ourselves through that process is the bravest thing we'll ever do.", author: "Brené Brown" },
  { text: "Your visions will become clear only when you can look into your own heart.", author: "Carl Jung" },
  { text: "You can live your whole life not realizing that what you're looking for is right behind your eyes.", author: "Tara Brach" },
  { text: "We cannot change what we are not aware of, and once we are aware, we cannot help but change.", author: "Sheryl Sandberg" },
  { text: "The curious paradox is that when I accept myself just as I am, then I can change.", author: "Carl Rogers" },
  { text: "Between stimulus and response there is a space. In that space is our power to choose.", author: "Viktor Frankl" },
  { text: "People will do anything, no matter how absurd, to avoid facing their own souls.", author: "Carl Jung" },
  { text: "Self-awareness is not self-centeredness, and spirituality is not narcissism.", author: "Marianne Williamson" },
  { text: "He who knows others is wise; he who knows himself is enlightened.", author: "Lao Tzu" },
  { text: "The greatest thing in the world is to know how to belong to oneself.", author: "Michel de Montaigne" },

  // --- 30 New Curated Quotes for Johari Pillars ---
  { text: "Feedback is the breakfast of champions.", author: "Ken Blanchard" },
  { text: "We judge ourselves by our intentions and others by their behavior.", author: "Stephen M.R. Covey" },
  { text: "It takes two to speak the truth—one to speak, and another to hear.", author: "Henry David Thoreau" },
  { text: "If you want to know yourself, observe how others act. If you want to understand others, look into your own heart.", author: "Friedrich Schiller" },
  { text: "The eye cannot see itself; it discovers itself only through reflection.", author: "William Shakespeare" },
  { text: "We rarely see our own blind spots without a mirror held up by those who care about us.", author: "Adam Grant" },
  { text: "Criticism may not be agreeable, but it is necessary. It fulfills the same function as pain in the human body; it calls attention to an unhealthy state of things.", author: "Winston Churchill" },
  { text: "Most people do not listen with the intent to understand; they listen with the intent to reply.", author: "Stephen R. Covey" },
  { text: "Honesty and transparency make you vulnerable. Be honest and transparent anyway.", author: "Mother Teresa" },
  { text: "There is nothing more courageous than an open heart that has known fear.", author: "David Whyte" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson" },
  { text: "True humility is not thinking less of yourself; it is thinking of yourself less.", author: "C.S. Lewis" },
  { text: "Integrity is choosing courage over comfort; choosing what is right over what is fun, fast, or easy.", author: "Brené Brown" },
  { text: "When we reveal our strengths and our flaws openly, we give others permission to do the same.", author: "Harry Ingham" },
  { text: "A leader is someone who holds her or himself accountable for finding potential in people and processes.", author: "Brené Brown" },
  { text: "Who looks outside, dreams; who looks inside, awakes.", author: "Carl Jung" },
  { text: "The most painful thing is losing yourself in the process of valuing someone too much, and forgetting that you are special too.", author: "Ernest Hemingway" },
  { text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.", author: "Rumi" },
  { text: "In the depth of winter, I finally learned that within me there lay an invincible summer.", author: "Albert Camus" },
  { text: "We often suffer more in imagination than in reality.", author: "Seneca" },
  { text: "The soul should always stand ajar, ready to welcome the ecstatic experience.", author: "Emily Dickinson" },
  { text: "You are not your thoughts; you are the observer of your thoughts.", author: "Eckhart Tolle" },
  { text: "Not until we are lost do we begin to understand ourselves.", author: "Henry David Thoreau" },
  { text: "What you seek is seeking you.", author: "Rumi" },
  { text: "There are years that ask questions and years that answer.", author: "Zora Neale Hurston" },
  { text: "I have been a seeker and I still am, but I stopped asking the books and the stars; I started listening to the teaching of my soul.", author: "Hermann Hesse" },
  { text: "Life will give you whatever experience is most helpful for the evolution of your consciousness.", author: "Eckhart Tolle" },
  { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
  { text: "Do not be satisfied with the stories that come before you. Unfold your own myth.", author: "Rumi" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" }
];

const LAST_QUOTE_KEY = 'aware_last_quote_index';

export function getRandomQuote(): Quote {
  if (quotes.length === 0) {
    return { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" };
  }

  let lastIndex = -1;
  try {
    const saved = localStorage.getItem(LAST_QUOTE_KEY);
    if (saved !== null) {
      lastIndex = parseInt(saved, 10);
    }
  } catch {
    // Ignore storage error
  }

  let newIndex = Math.floor(Math.random() * quotes.length);
  // Ensure we don't repeat the exact same quote back-to-back on consecutive app opens
  if (quotes.length > 1 && newIndex === lastIndex) {
    newIndex = (newIndex + 1 + Math.floor(Math.random() * (quotes.length - 1))) % quotes.length;
  }

  try {
    localStorage.setItem(LAST_QUOTE_KEY, newIndex.toString());
  } catch {
    // Ignore storage error
  }

  return quotes[newIndex];
}
