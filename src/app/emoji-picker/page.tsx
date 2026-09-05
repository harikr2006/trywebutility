"use client";
import { useState, useEffect, useMemo } from "react";
import ToolShell from "@/components/shared/ToolShell";

interface EmojiEntry {
  emoji: string;
  name: string;
  keywords: string[];
  category: string;
}

const EMOJIS: EmojiEntry[] = [
  // Smileys
  { emoji: "😀", name: "grinning face", keywords: ["smile", "happy", "grin"], category: "Smileys" },
  { emoji: "😃", name: "grinning face with big eyes", keywords: ["smile", "happy", "open"], category: "Smileys" },
  { emoji: "😄", name: "grinning face with smiling eyes", keywords: ["smile", "happy", "laugh"], category: "Smileys" },
  { emoji: "😁", name: "beaming face with smiling eyes", keywords: ["grin", "happy"], category: "Smileys" },
  { emoji: "😆", name: "grinning squinting face", keywords: ["laugh", "funny", "lol"], category: "Smileys" },
  { emoji: "😅", name: "grinning face with sweat", keywords: ["sweat", "hot", "relief"], category: "Smileys" },
  { emoji: "🤣", name: "rolling on the floor laughing", keywords: ["rofl", "lol", "funny"], category: "Smileys" },
  { emoji: "😂", name: "face with tears of joy", keywords: ["laugh", "cry", "joy"], category: "Smileys" },
  { emoji: "🙂", name: "slightly smiling face", keywords: ["smile", "happy"], category: "Smileys" },
  { emoji: "😉", name: "winking face", keywords: ["wink", "joke"], category: "Smileys" },
  { emoji: "😊", name: "smiling face with smiling eyes", keywords: ["smile", "blush"], category: "Smileys" },
  { emoji: "😇", name: "smiling face with halo", keywords: ["angel", "innocent", "halo"], category: "Smileys" },
  { emoji: "🥰", name: "smiling face with hearts", keywords: ["love", "hearts", "adore"], category: "Smileys" },
  { emoji: "😍", name: "smiling face with heart-eyes", keywords: ["love", "heart", "adore"], category: "Smileys" },
  { emoji: "🤩", name: "star-struck", keywords: ["star", "wow", "amazing"], category: "Smileys" },
  { emoji: "😘", name: "face blowing a kiss", keywords: ["kiss", "love", "blow"], category: "Smileys" },
  { emoji: "😗", name: "kissing face", keywords: ["kiss"], category: "Smileys" },
  { emoji: "😚", name: "kissing face with closed eyes", keywords: ["kiss", "eyes"], category: "Smileys" },
  { emoji: "😋", name: "face savoring food", keywords: ["yum", "delicious", "food"], category: "Smileys" },
  { emoji: "😛", name: "face with tongue", keywords: ["tongue", "playful"], category: "Smileys" },
  { emoji: "🤪", name: "zany face", keywords: ["crazy", "silly", "wild"], category: "Smileys" },
  { emoji: "😜", name: "winking face with tongue", keywords: ["wink", "tongue"], category: "Smileys" },
  { emoji: "🤑", name: "money-mouth face", keywords: ["money", "rich", "cash"], category: "Smileys" },
  { emoji: "🤗", name: "hugging face", keywords: ["hug", "warm", "embrace"], category: "Smileys" },
  { emoji: "🤭", name: "face with hand over mouth", keywords: ["oops", "secret", "giggle"], category: "Smileys" },
  { emoji: "😐", name: "neutral face", keywords: ["neutral", "meh", "blank"], category: "Smileys" },
  { emoji: "😑", name: "expressionless face", keywords: ["expressionless", "blank"], category: "Smileys" },
  { emoji: "😶", name: "face without mouth", keywords: ["silent", "quiet", "mute"], category: "Smileys" },
  { emoji: "😏", name: "smirking face", keywords: ["smirk", "smug", "sly"], category: "Smileys" },
  { emoji: "😒", name: "unamused face", keywords: ["unamused", "bored", "meh"], category: "Smileys" },
  { emoji: "🙄", name: "face with rolling eyes", keywords: ["eye roll", "sarcastic", "whatever"], category: "Smileys" },
  { emoji: "😬", name: "grimacing face", keywords: ["grimace", "awkward", "yikes"], category: "Smileys" },
  { emoji: "😔", name: "pensive face", keywords: ["sad", "pensive", "reflective"], category: "Smileys" },
  { emoji: "😪", name: "sleepy face", keywords: ["sleep", "tired", "drowsy"], category: "Smileys" },
  { emoji: "🤔", name: "thinking face", keywords: ["think", "hmm", "ponder"], category: "Smileys" },
  { emoji: "😴", name: "sleeping face", keywords: ["sleep", "zzz", "tired"], category: "Smileys" },
  { emoji: "😤", name: "face with steam from nose", keywords: ["triumph", "angry", "steam"], category: "Smileys" },
  { emoji: "😠", name: "angry face", keywords: ["angry", "mad", "grr"], category: "Smileys" },
  { emoji: "😡", name: "pouting face", keywords: ["rage", "angry", "red"], category: "Smileys" },
  { emoji: "🤬", name: "face with symbols on mouth", keywords: ["swear", "angry", "cursing"], category: "Smileys" },
  { emoji: "😱", name: "face screaming in fear", keywords: ["scream", "fear", "scared"], category: "Smileys" },
  { emoji: "😨", name: "fearful face", keywords: ["fear", "scared", "anxious"], category: "Smileys" },
  { emoji: "😰", name: "anxious face with sweat", keywords: ["anxious", "sweat", "nervous"], category: "Smileys" },
  { emoji: "😥", name: "sad but relieved face", keywords: ["sad", "relieved", "disappointed"], category: "Smileys" },
  { emoji: "😢", name: "crying face", keywords: ["cry", "sad", "tear"], category: "Smileys" },
  { emoji: "😭", name: "loudly crying face", keywords: ["cry", "sob", "sad"], category: "Smileys" },
  { emoji: "😵", name: "dizzy face", keywords: ["dizzy", "confused", "spinning"], category: "Smileys" },
  { emoji: "🤯", name: "exploding head", keywords: ["mind blown", "wow", "shock"], category: "Smileys" },
  { emoji: "🤠", name: "cowboy hat face", keywords: ["cowboy", "western", "hat"], category: "Smileys" },
  { emoji: "🥳", name: "partying face", keywords: ["party", "celebrate", "birthday"], category: "Smileys" },
  // People
  { emoji: "👶", name: "baby", keywords: ["baby", "infant", "child"], category: "People" },
  { emoji: "👦", name: "boy", keywords: ["boy", "child", "kid"], category: "People" },
  { emoji: "👧", name: "girl", keywords: ["girl", "child", "kid"], category: "People" },
  { emoji: "👨", name: "man", keywords: ["man", "male", "person"], category: "People" },
  { emoji: "👩", name: "woman", keywords: ["woman", "female", "person"], category: "People" },
  { emoji: "👴", name: "old man", keywords: ["old", "elderly", "grandfather"], category: "People" },
  { emoji: "👵", name: "old woman", keywords: ["old", "elderly", "grandmother"], category: "People" },
  { emoji: "👮", name: "police officer", keywords: ["cop", "police", "law"], category: "People" },
  { emoji: "💂", name: "guard", keywords: ["guard", "soldier", "royal"], category: "People" },
  { emoji: "🕵️", name: "detective", keywords: ["detective", "spy", "investigate"], category: "People" },
  { emoji: "👷", name: "construction worker", keywords: ["worker", "construction", "hard hat"], category: "People" },
  { emoji: "👸", name: "princess", keywords: ["princess", "royal", "crown"], category: "People" },
  { emoji: "🤴", name: "prince", keywords: ["prince", "royal", "crown"], category: "People" },
  { emoji: "🧙", name: "mage", keywords: ["wizard", "magic", "witch"], category: "People" },
  { emoji: "🧛", name: "vampire", keywords: ["vampire", "dracula", "halloween"], category: "People" },
  { emoji: "🧟", name: "zombie", keywords: ["zombie", "undead", "halloween"], category: "People" },
  { emoji: "🧝", name: "elf", keywords: ["elf", "fantasy", "magic"], category: "People" },
  { emoji: "🧑‍💻", name: "technologist", keywords: ["coder", "developer", "programmer"], category: "People" },
  { emoji: "👩‍🎨", name: "woman artist", keywords: ["artist", "painter", "creative"], category: "People" },
  { emoji: "👨‍🍳", name: "man cook", keywords: ["chef", "cook", "food"], category: "People" },
  { emoji: "🤝", name: "handshake", keywords: ["handshake", "deal", "agree"], category: "People" },
  { emoji: "👏", name: "clapping hands", keywords: ["clap", "applause", "bravo"], category: "People" },
  { emoji: "🙌", name: "raising hands", keywords: ["celebrate", "hooray", "praise"], category: "People" },
  { emoji: "👐", name: "open hands", keywords: ["open", "hug", "welcome"], category: "People" },
  { emoji: "🤲", name: "palms up together", keywords: ["pray", "ask", "hands"], category: "People" },
  { emoji: "🙏", name: "folded hands", keywords: ["pray", "please", "thanks"], category: "People" },
  { emoji: "✌️", name: "victory hand", keywords: ["peace", "victory", "v"], category: "People" },
  { emoji: "🤞", name: "crossed fingers", keywords: ["luck", "hope", "wish"], category: "People" },
  { emoji: "👍", name: "thumbs up", keywords: ["like", "good", "approve"], category: "People" },
  { emoji: "👎", name: "thumbs down", keywords: ["dislike", "bad", "disapprove"], category: "People" },
  // Animals
  { emoji: "🐶", name: "dog face", keywords: ["dog", "puppy", "woof"], category: "Animals" },
  { emoji: "🐱", name: "cat face", keywords: ["cat", "kitten", "meow"], category: "Animals" },
  { emoji: "🐭", name: "mouse face", keywords: ["mouse", "rodent"], category: "Animals" },
  { emoji: "🐹", name: "hamster", keywords: ["hamster", "pet"], category: "Animals" },
  { emoji: "🐰", name: "rabbit face", keywords: ["rabbit", "bunny"], category: "Animals" },
  { emoji: "🦊", name: "fox", keywords: ["fox", "clever"], category: "Animals" },
  { emoji: "🐻", name: "bear", keywords: ["bear", "teddy"], category: "Animals" },
  { emoji: "🐼", name: "panda", keywords: ["panda", "bear", "china"], category: "Animals" },
  { emoji: "🐨", name: "koala", keywords: ["koala", "australia"], category: "Animals" },
  { emoji: "🐯", name: "tiger face", keywords: ["tiger", "stripe"], category: "Animals" },
  { emoji: "🦁", name: "lion", keywords: ["lion", "king", "roar"], category: "Animals" },
  { emoji: "🐮", name: "cow face", keywords: ["cow", "moo", "farm"], category: "Animals" },
  { emoji: "🐷", name: "pig face", keywords: ["pig", "oink", "farm"], category: "Animals" },
  { emoji: "🐸", name: "frog", keywords: ["frog", "green", "ribbit"], category: "Animals" },
  { emoji: "🐵", name: "monkey face", keywords: ["monkey", "primate"], category: "Animals" },
  { emoji: "🦆", name: "duck", keywords: ["duck", "quack", "bird"], category: "Animals" },
  { emoji: "🦅", name: "eagle", keywords: ["eagle", "bird", "freedom"], category: "Animals" },
  { emoji: "🦉", name: "owl", keywords: ["owl", "wise", "bird"], category: "Animals" },
  { emoji: "🦋", name: "butterfly", keywords: ["butterfly", "transform", "beautiful"], category: "Animals" },
  { emoji: "🐝", name: "honeybee", keywords: ["bee", "honey", "sting"], category: "Animals" },
  { emoji: "🐢", name: "turtle", keywords: ["turtle", "slow", "shell"], category: "Animals" },
  { emoji: "🦈", name: "shark", keywords: ["shark", "fish", "ocean"], category: "Animals" },
  { emoji: "🐬", name: "dolphin", keywords: ["dolphin", "ocean", "smart"], category: "Animals" },
  { emoji: "🐘", name: "elephant", keywords: ["elephant", "big", "trunk"], category: "Animals" },
  { emoji: "🦒", name: "giraffe", keywords: ["giraffe", "tall", "africa"], category: "Animals" },
  { emoji: "🦓", name: "zebra", keywords: ["zebra", "stripe", "africa"], category: "Animals" },
  { emoji: "🦏", name: "rhinoceros", keywords: ["rhino", "horn", "big"], category: "Animals" },
  { emoji: "🐊", name: "crocodile", keywords: ["crocodile", "alligator", "reptile"], category: "Animals" },
  { emoji: "🦀", name: "crab", keywords: ["crab", "seafood", "claw"], category: "Animals" },
  { emoji: "🐙", name: "octopus", keywords: ["octopus", "tentacle", "sea"], category: "Animals" },
  // Food
  { emoji: "🍎", name: "red apple", keywords: ["apple", "fruit", "red"], category: "Food" },
  { emoji: "🍊", name: "tangerine", keywords: ["orange", "fruit", "citrus"], category: "Food" },
  { emoji: "🍋", name: "lemon", keywords: ["lemon", "citrus", "sour"], category: "Food" },
  { emoji: "🍇", name: "grapes", keywords: ["grapes", "fruit", "purple"], category: "Food" },
  { emoji: "🍓", name: "strawberry", keywords: ["strawberry", "fruit", "red"], category: "Food" },
  { emoji: "🍒", name: "cherries", keywords: ["cherry", "fruit", "red"], category: "Food" },
  { emoji: "🍑", name: "peach", keywords: ["peach", "fruit"], category: "Food" },
  { emoji: "🥭", name: "mango", keywords: ["mango", "fruit", "tropical"], category: "Food" },
  { emoji: "🍕", name: "pizza", keywords: ["pizza", "food", "italian"], category: "Food" },
  { emoji: "🍔", name: "hamburger", keywords: ["burger", "hamburger", "fast food"], category: "Food" },
  { emoji: "🍟", name: "french fries", keywords: ["fries", "chips", "fast food"], category: "Food" },
  { emoji: "🌮", name: "taco", keywords: ["taco", "mexican", "food"], category: "Food" },
  { emoji: "🌯", name: "burrito", keywords: ["burrito", "wrap", "mexican"], category: "Food" },
  { emoji: "🍜", name: "steaming bowl", keywords: ["noodle", "ramen", "soup"], category: "Food" },
  { emoji: "🍣", name: "sushi", keywords: ["sushi", "japanese", "fish"], category: "Food" },
  { emoji: "🍦", name: "soft ice cream", keywords: ["ice cream", "soft serve", "dessert"], category: "Food" },
  { emoji: "🍩", name: "doughnut", keywords: ["donut", "sweet", "dessert"], category: "Food" },
  { emoji: "🎂", name: "birthday cake", keywords: ["cake", "birthday", "candle"], category: "Food" },
  { emoji: "🍫", name: "chocolate bar", keywords: ["chocolate", "sweet", "candy"], category: "Food" },
  { emoji: "☕", name: "hot beverage", keywords: ["coffee", "tea", "hot", "drink"], category: "Food" },
  { emoji: "🍺", name: "beer mug", keywords: ["beer", "drink", "cheers"], category: "Food" },
  { emoji: "🍷", name: "wine glass", keywords: ["wine", "drink", "glass"], category: "Food" },
  { emoji: "🥂", name: "clinking glasses", keywords: ["champagne", "celebrate", "toast"], category: "Food" },
  { emoji: "🧁", name: "cupcake", keywords: ["cupcake", "dessert", "sweet"], category: "Food" },
  { emoji: "🥗", name: "green salad", keywords: ["salad", "healthy", "vegetable"], category: "Food" },
  { emoji: "🍿", name: "popcorn", keywords: ["popcorn", "movie", "snack"], category: "Food" },
  { emoji: "🧇", name: "waffle", keywords: ["waffle", "breakfast", "sweet"], category: "Food" },
  { emoji: "🥞", name: "pancakes", keywords: ["pancake", "breakfast", "syrup"], category: "Food" },
  { emoji: "🍳", name: "cooking", keywords: ["egg", "fry", "breakfast", "cook"], category: "Food" },
  { emoji: "🥪", name: "sandwich", keywords: ["sandwich", "lunch", "food"], category: "Food" },
  // Travel
  { emoji: "✈️", name: "airplane", keywords: ["plane", "travel", "fly", "airport"], category: "Travel" },
  { emoji: "🚀", name: "rocket", keywords: ["rocket", "space", "launch"], category: "Travel" },
  { emoji: "🚂", name: "locomotive", keywords: ["train", "locomotive", "steam"], category: "Travel" },
  { emoji: "🚗", name: "automobile", keywords: ["car", "drive", "vehicle"], category: "Travel" },
  { emoji: "🚕", name: "taxi", keywords: ["taxi", "cab", "yellow"], category: "Travel" },
  { emoji: "🚌", name: "bus", keywords: ["bus", "transit", "public"], category: "Travel" },
  { emoji: "🚢", name: "ship", keywords: ["ship", "boat", "cruise", "ocean"], category: "Travel" },
  { emoji: "🛸", name: "flying saucer", keywords: ["ufo", "alien", "space"], category: "Travel" },
  { emoji: "🏖️", name: "beach with umbrella", keywords: ["beach", "summer", "vacation"], category: "Travel" },
  { emoji: "🏔️", name: "snow-capped mountain", keywords: ["mountain", "snow", "hike"], category: "Travel" },
  { emoji: "🗺️", name: "world map", keywords: ["map", "world", "travel"], category: "Travel" },
  { emoji: "🧭", name: "compass", keywords: ["compass", "direction", "navigate"], category: "Travel" },
  { emoji: "🏕️", name: "camping", keywords: ["camp", "tent", "outdoor"], category: "Travel" },
  { emoji: "🗼", name: "tokyo tower", keywords: ["tower", "tokyo", "japan"], category: "Travel" },
  { emoji: "🗽", name: "statue of liberty", keywords: ["liberty", "new york", "usa"], category: "Travel" },
  { emoji: "🏰", name: "european castle", keywords: ["castle", "europe", "medieval"], category: "Travel" },
  { emoji: "🌋", name: "volcano", keywords: ["volcano", "eruption", "lava"], category: "Travel" },
  { emoji: "🏝️", name: "desert island", keywords: ["island", "tropical", "paradise"], category: "Travel" },
  { emoji: "🌍", name: "globe europe-africa", keywords: ["earth", "world", "globe"], category: "Travel" },
  { emoji: "🌏", name: "globe asia-australia", keywords: ["earth", "asia", "globe"], category: "Travel" },
  { emoji: "🎡", name: "ferris wheel", keywords: ["ferris wheel", "amusement", "fair"], category: "Travel" },
  { emoji: "🎢", name: "roller coaster", keywords: ["roller coaster", "fun", "theme park"], category: "Travel" },
  { emoji: "🎪", name: "circus tent", keywords: ["circus", "tent", "fun"], category: "Travel" },
  { emoji: "🏟️", name: "stadium", keywords: ["stadium", "arena", "sports"], category: "Travel" },
  { emoji: "🛤️", name: "railway track", keywords: ["railway", "track", "train"], category: "Travel" },
  // Activities
  { emoji: "⚽", name: "soccer ball", keywords: ["soccer", "football", "sport"], category: "Activities" },
  { emoji: "🏀", name: "basketball", keywords: ["basketball", "sport", "ball"], category: "Activities" },
  { emoji: "🏈", name: "american football", keywords: ["football", "nfl", "sport"], category: "Activities" },
  { emoji: "⚾", name: "baseball", keywords: ["baseball", "sport", "ball"], category: "Activities" },
  { emoji: "🎾", name: "tennis", keywords: ["tennis", "sport", "ball"], category: "Activities" },
  { emoji: "🏐", name: "volleyball", keywords: ["volleyball", "sport", "ball"], category: "Activities" },
  { emoji: "🎮", name: "video game", keywords: ["game", "controller", "gaming"], category: "Activities" },
  { emoji: "🎲", name: "game die", keywords: ["dice", "game", "random"], category: "Activities" },
  { emoji: "🎯", name: "direct hit", keywords: ["target", "bullseye", "aim"], category: "Activities" },
  { emoji: "🎸", name: "guitar", keywords: ["guitar", "music", "rock"], category: "Activities" },
  { emoji: "🎹", name: "musical keyboard", keywords: ["piano", "keyboard", "music"], category: "Activities" },
  { emoji: "🎺", name: "trumpet", keywords: ["trumpet", "music", "jazz"], category: "Activities" },
  { emoji: "🎻", name: "violin", keywords: ["violin", "music", "classical"], category: "Activities" },
  { emoji: "🥁", name: "drum", keywords: ["drum", "music", "beat"], category: "Activities" },
  { emoji: "🎨", name: "artist palette", keywords: ["art", "paint", "creative"], category: "Activities" },
  { emoji: "📸", name: "camera with flash", keywords: ["camera", "photo", "flash"], category: "Activities" },
  { emoji: "🎬", name: "clapper board", keywords: ["movie", "film", "action"], category: "Activities" },
  { emoji: "🏋️", name: "person lifting weights", keywords: ["weightlifting", "gym", "exercise"], category: "Activities" },
  { emoji: "🤸", name: "person cartwheeling", keywords: ["gymnastics", "cartwheel", "acrobat"], category: "Activities" },
  { emoji: "🧘", name: "person in lotus position", keywords: ["yoga", "meditate", "calm"], category: "Activities" },
  { emoji: "🏊", name: "person swimming", keywords: ["swim", "pool", "water"], category: "Activities" },
  { emoji: "🚴", name: "person biking", keywords: ["bike", "cycle", "sport"], category: "Activities" },
  { emoji: "⛷️", name: "skier", keywords: ["ski", "snow", "winter"], category: "Activities" },
  { emoji: "🏄", name: "person surfing", keywords: ["surf", "wave", "ocean"], category: "Activities" },
  { emoji: "🎭", name: "performing arts", keywords: ["theater", "drama", "mask"], category: "Activities" },
  // Objects
  { emoji: "💡", name: "light bulb", keywords: ["idea", "light", "bright"], category: "Objects" },
  { emoji: "🔥", name: "fire", keywords: ["fire", "hot", "flame"], category: "Objects" },
  { emoji: "⭐", name: "star", keywords: ["star", "favorite", "rating"], category: "Objects" },
  { emoji: "🌈", name: "rainbow", keywords: ["rainbow", "color", "pride"], category: "Objects" },
  { emoji: "☀️", name: "sun", keywords: ["sun", "sunny", "bright"], category: "Objects" },
  { emoji: "🌙", name: "crescent moon", keywords: ["moon", "night", "crescent"], category: "Objects" },
  { emoji: "💎", name: "gem stone", keywords: ["diamond", "gem", "jewel"], category: "Objects" },
  { emoji: "🔑", name: "key", keywords: ["key", "unlock", "access"], category: "Objects" },
  { emoji: "🔒", name: "locked", keywords: ["lock", "secure", "closed"], category: "Objects" },
  { emoji: "📱", name: "mobile phone", keywords: ["phone", "mobile", "smartphone"], category: "Objects" },
  { emoji: "💻", name: "laptop", keywords: ["laptop", "computer", "tech"], category: "Objects" },
  { emoji: "⌨️", name: "keyboard", keywords: ["keyboard", "type", "computer"], category: "Objects" },
  { emoji: "🖥️", name: "desktop computer", keywords: ["desktop", "computer", "monitor"], category: "Objects" },
  { emoji: "🖨️", name: "printer", keywords: ["printer", "print", "office"], category: "Objects" },
  { emoji: "📺", name: "television", keywords: ["tv", "television", "watch"], category: "Objects" },
  { emoji: "📷", name: "camera", keywords: ["camera", "photo", "picture"], category: "Objects" },
  { emoji: "🎁", name: "wrapped gift", keywords: ["gift", "present", "birthday"], category: "Objects" },
  { emoji: "🏆", name: "trophy", keywords: ["trophy", "win", "award"], category: "Objects" },
  { emoji: "📚", name: "books", keywords: ["book", "read", "library"], category: "Objects" },
  { emoji: "✏️", name: "pencil", keywords: ["pencil", "write", "draw"], category: "Objects" },
  { emoji: "🔭", name: "telescope", keywords: ["telescope", "space", "astronomy"], category: "Objects" },
  { emoji: "🔬", name: "microscope", keywords: ["microscope", "science", "biology"], category: "Objects" },
  { emoji: "💊", name: "pill", keywords: ["pill", "medicine", "drug"], category: "Objects" },
  { emoji: "🧲", name: "magnet", keywords: ["magnet", "attract", "force"], category: "Objects" },
  { emoji: "⚙️", name: "gear", keywords: ["gear", "settings", "machine"], category: "Objects" },
  // Symbols
  { emoji: "❤️", name: "red heart", keywords: ["heart", "love", "red"], category: "Symbols" },
  { emoji: "🧡", name: "orange heart", keywords: ["heart", "orange"], category: "Symbols" },
  { emoji: "💛", name: "yellow heart", keywords: ["heart", "yellow"], category: "Symbols" },
  { emoji: "💚", name: "green heart", keywords: ["heart", "green"], category: "Symbols" },
  { emoji: "💙", name: "blue heart", keywords: ["heart", "blue"], category: "Symbols" },
  { emoji: "💜", name: "purple heart", keywords: ["heart", "purple"], category: "Symbols" },
  { emoji: "🖤", name: "black heart", keywords: ["heart", "black", "dark"], category: "Symbols" },
  { emoji: "💔", name: "broken heart", keywords: ["broken", "heartbreak", "sad"], category: "Symbols" },
  { emoji: "✅", name: "check mark button", keywords: ["check", "done", "yes", "ok"], category: "Symbols" },
  { emoji: "❌", name: "cross mark", keywords: ["x", "no", "wrong", "cancel"], category: "Symbols" },
  { emoji: "⚠️", name: "warning", keywords: ["warning", "caution", "alert"], category: "Symbols" },
  { emoji: "🚫", name: "prohibited", keywords: ["no", "banned", "forbidden"], category: "Symbols" },
  { emoji: "♻️", name: "recycling symbol", keywords: ["recycle", "green", "environment"], category: "Symbols" },
  { emoji: "💯", name: "hundred points", keywords: ["100", "perfect", "score"], category: "Symbols" },
  { emoji: "🔞", name: "no one under eighteen", keywords: ["adult", "18", "restricted"], category: "Symbols" },
  { emoji: "🆒", name: "cool button", keywords: ["cool", "blue", "word"], category: "Symbols" },
  { emoji: "🆓", name: "free button", keywords: ["free", "word"], category: "Symbols" },
  { emoji: "🆕", name: "new button", keywords: ["new", "word"], category: "Symbols" },
  { emoji: "🔴", name: "red circle", keywords: ["red", "circle", "dot"], category: "Symbols" },
  { emoji: "🟠", name: "orange circle", keywords: ["orange", "circle"], category: "Symbols" },
  { emoji: "🟡", name: "yellow circle", keywords: ["yellow", "circle"], category: "Symbols" },
  { emoji: "🟢", name: "green circle", keywords: ["green", "circle"], category: "Symbols" },
  { emoji: "🔵", name: "blue circle", keywords: ["blue", "circle"], category: "Symbols" },
  { emoji: "⚡", name: "high voltage", keywords: ["lightning", "electric", "bolt"], category: "Symbols" },
  { emoji: "❄️", name: "snowflake", keywords: ["snow", "cold", "winter", "ice"], category: "Symbols" },
  // Flags
  { emoji: "🏁", name: "chequered flag", keywords: ["race", "finish", "flag"], category: "Flags" },
  { emoji: "🚩", name: "triangular flag", keywords: ["flag", "warning", "red"], category: "Flags" },
  { emoji: "🎌", name: "crossed flags", keywords: ["japan", "celebration", "flags"], category: "Flags" },
  { emoji: "🏴", name: "black flag", keywords: ["black", "flag", "pirate"], category: "Flags" },
  { emoji: "🏳️", name: "white flag", keywords: ["white", "flag", "surrender"], category: "Flags" },
  { emoji: "🏳️‍🌈", name: "rainbow flag", keywords: ["pride", "lgbt", "rainbow"], category: "Flags" },
  { emoji: "🇺🇸", name: "flag united states", keywords: ["usa", "america", "flag"], category: "Flags" },
  { emoji: "🇬🇧", name: "flag united kingdom", keywords: ["uk", "britain", "england", "flag"], category: "Flags" },
  { emoji: "🇯🇵", name: "flag japan", keywords: ["japan", "flag"], category: "Flags" },
  { emoji: "🇩🇪", name: "flag germany", keywords: ["germany", "flag", "deutsch"], category: "Flags" },
  { emoji: "🇫🇷", name: "flag france", keywords: ["france", "flag", "french"], category: "Flags" },
  { emoji: "🇮🇳", name: "flag india", keywords: ["india", "flag", "hindi"], category: "Flags" },
  { emoji: "🇨🇳", name: "flag china", keywords: ["china", "flag", "chinese"], category: "Flags" },
  { emoji: "🇧🇷", name: "flag brazil", keywords: ["brazil", "flag", "portuguese"], category: "Flags" },
  { emoji: "🇨🇦", name: "flag canada", keywords: ["canada", "flag", "maple"], category: "Flags" },
  { emoji: "🇦🇺", name: "flag australia", keywords: ["australia", "flag", "aussie"], category: "Flags" },
  { emoji: "🇰🇷", name: "flag south korea", keywords: ["korea", "flag", "kpop"], category: "Flags" },
  { emoji: "🇲🇽", name: "flag mexico", keywords: ["mexico", "flag", "spanish"], category: "Flags" },
  { emoji: "🇮🇹", name: "flag italy", keywords: ["italy", "flag", "italian"], category: "Flags" },
  { emoji: "🇪🇸", name: "flag spain", keywords: ["spain", "flag", "spanish"], category: "Flags" },
  { emoji: "🇷🇺", name: "flag russia", keywords: ["russia", "flag", "russian"], category: "Flags" },
  { emoji: "🇿🇦", name: "flag south africa", keywords: ["south africa", "flag"], category: "Flags" },
  { emoji: "🇳🇬", name: "flag nigeria", keywords: ["nigeria", "flag", "africa"], category: "Flags" },
  { emoji: "🇸🇬", name: "flag singapore", keywords: ["singapore", "flag", "asia"], category: "Flags" },
  { emoji: "🇦🇪", name: "flag united arab emirates", keywords: ["uae", "dubai", "flag"], category: "Flags" },
];

const CATEGORIES = ["All", "Smileys", "People", "Animals", "Food", "Travel", "Activities", "Objects", "Symbols", "Flags"];
const CAT_ICONS: Record<string, string> = {
  All: "🌟", Smileys: "😊", People: "👤", Animals: "🐾", Food: "🍎",
  Travel: "✈️", Activities: "⚽", Objects: "💡", Symbols: "❤️", Flags: "🏳️",
};

const STORAGE_KEY = "emoji-picker-recent";
const MAX_RECENT = 20;

function loadRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecent(emojis: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(emojis));
}

export default function EmojiPickerPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [recent, setRecent] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return EMOJIS.filter((e) => {
      const inCat = category === "All" || e.category === category;
      if (!q) return inCat;
      return inCat && (e.name.includes(q) || e.keywords.some((k) => k.includes(q)));
    });
  }, [search, category]);

  function handleCopy(emoji: string, name: string) {
    navigator.clipboard.writeText(emoji).then(() => {
      setRecent((prev) => {
        const next = [emoji, ...prev.filter((e) => e !== emoji)].slice(0, MAX_RECENT);
        saveRecent(next);
        return next;
      });
      setToast(`Copied ${emoji} ${name}`);
      setTimeout(() => setToast(null), 2000);
    });
  }

  return (
    <ToolShell
      title="Emoji Picker"
      description="Search and copy emojis by name or keyword. Browse by category and see your recently used emojis."
    >
      <div className="space-y-4">
        {/* Toast */}
        {toast && (
          <div className="fixed top-4 right-4 z-50 bg-foreground text-background text-sm px-4 py-2 rounded-lg shadow-lg animate-fade-in">
            {toast}
          </div>
        )}

        {/* Search */}
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emojis..."
          className="w-full rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        {/* Category tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                category === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {CAT_ICONS[cat]} {cat}
            </button>
          ))}
        </div>

        {/* Recently used */}
        {recent.length > 0 && !search && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recently Used</p>
            <div className="flex flex-wrap gap-1">
              {recent.map((e) => {
                const entry = EMOJIS.find((x) => x.emoji === e);
                return (
                  <button
                    key={e}
                    onClick={() => handleCopy(e, entry?.name ?? e)}
                    title={entry?.name ?? e}
                    className="text-2xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted/60 transition-colors"
                  >
                    {e}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Emoji grid */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {filtered.length} emoji{filtered.length !== 1 ? "s" : ""}
            {search ? ` for "${search}"` : category !== "All" ? ` in ${category}` : ""}
          </p>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No emojis found for &quot;{search}&quot;</div>
          ) : (
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-0.5">
              {filtered.map((e) => (
                <button
                  key={e.emoji + e.name}
                  onClick={() => handleCopy(e.emoji, e.name)}
                  title={`${e.emoji} ${e.name}`}
                  className="text-2xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted/60 transition-colors"
                >
                  {e.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground">Click any emoji to copy it to your clipboard.</p>
      </div>
    </ToolShell>
  );
}
