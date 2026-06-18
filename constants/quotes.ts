export interface Quote {
  text: string;
  author: string;
}

export const quotes: Quote[] = [
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
];

export function getRandomQuote(): Quote {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}
