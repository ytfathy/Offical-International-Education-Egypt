/* =====================================================================
   INTERNATIONAL EDUCATION EGYPT — SITE CONFIGURATION
   ---------------------------------------------------------------------
   This is the ONLY file you need to edit to update the website content.
   • Add a grade:   add an entry to `grades`.
   • Add a subject: add an entry to `subjects` (icon + colour).
   • Add a program: add an entry to `programs` (grade + subject keys).
   • Videos accept: YouTube links, Vimeo links, or a direct .mp4 URL.
     Leave `video: ""` to show the "upload your video" placeholder.
   • Poster (optional): a still image shown before the video plays,
     e.g. poster: "assets/videos/g6-math-poster.jpg".
   • Screenshots: list image paths, e.g. "assets/screens/g6-math-1.jpg".
     Leave empty to show the illustrated preview.
   • App link: set `appUrl` on a program to make its "Open app" button
     open the app. Without it, "Open app" opens WhatsApp to request access.
   • Features: ONLY list features that the program really includes.
     Pick from the keys in `featureLibrary` below.
   ===================================================================== */

window.IEE_CONFIG = {
  site: {
    name: "International Education Egypt",
    shortName: "IEE",
    logo: "assets/iee-logo.png",           // exact official logo (proportional copy)
    whatsappNumber: "[INSERT WHATSAPP NUMBER WITH COUNTRY CODE]", // e.g. "201001234567" (digits only)
    whatsappTemplate: "Hello International Education Egypt, I am interested in the {program}. Please send me more information.",
    whatsappGeneral: "Hello International Education Egypt, I would like to know more about your interactive learning programs.",
    // Used by "Open app" when a program has no appUrl yet:
    whatsappBuyTemplate: "Hello International Education Egypt, I would like to get access to the {program} app. Please send me the details.",
    email: "",                              // optional, e.g. "info@example.com"
    // Shows small editor notes (missing video, missing testimonials, etc.).
    // Set to false before going live.
    showEditorHints: true,
    social: {
      facebook: "",
      instagram: "",
      youtube: "",
      tiktok: "",
      linkedin: ""
    }
  },

  grades: [
    { key: "g6", label: "Grade 6", short: "G6" },
    { key: "g8", label: "Grade 8", short: "G8" }
  ],

  /* Each subject takes its colour from the rainbow lettering of the official logo. */
  subjects: [
    { key: "math",    name: "Mathematics",    nameAr: "الرياضيات",       color: "#1E5BFF", icon: "math" },
    { key: "science", name: "Science",        nameAr: "العلوم",          color: "#139E58", icon: "science" },
    { key: "social",  name: "Social Studies", nameAr: "الدراسات الاجتماعية", color: "#EF7D12", icon: "social" },
    { key: "german",  name: "German",         nameAr: "اللغة الألمانية",  color: "#D9A200", icon: "german" },
    { key: "arabic",  name: "Arabic",         nameAr: "اللغة العربية",    color: "#7A3FE0", icon: "arabic" },
    { key: "arsocial", name: "Arabic Social Studies", nameAr: "الدراسات الاجتماعية", color: "#0E9AA7", icon: "arsocial" }
  ],

  /* Master list of learning-experience features. Programs reference these keys. */
  featureLibrary: {
    interactive: { title: "Interactive learning",       text: "Lessons you click, drag and explore instead of only reading." },
    quizzes:     { title: "Smart quizzes",              text: "Question sets that check understanding after each lesson." },
    autocorrect: { title: "Automatic answer correction", text: "Answers are marked the moment they are submitted." },
    feedback:    { title: "Instant feedback",           text: "Clear explanations show why an answer is right or wrong." },
    videos:      { title: "Educational videos",         text: "Short videos that walk through each key idea." },
    visual:      { title: "Visual explanations",        text: "Diagrams and animations make hard ideas easier to see." },
    progress:    { title: "Progress tracking",          text: "Students and parents can see what is done and what is next." },
    practice:    { title: "Practice and revision",      text: "Extra practice to revise before tests and exams." },
    friendly:    { title: "Student-friendly interface", text: "A clean, simple layout students can use on their own." },
    audio:       { title: "Read-aloud audio",           text: "Hear words, sentences and lessons read aloud." },
    glossary:    { title: "Searchable glossary",        text: "Key terms with clear definitions and examples." }
  },

  /* ---- PROGRAMS --------------------------------------------------------
     ⚠ IMPORTANT: confirm each program's `features` list before launch.
     The lists below are a starting point based on the feature categories
     in the website brief — remove any feature a program does not include.
  ------------------------------------------------------------------------ */
  programs: [
    // GRADE 6
    { grade: "g6", subject: "math",
      description: "Grade 6 mathematics turned into guided, step-by-step practice that builds speed and confidence with numbers, shapes and problem solving.",
      benefits: ["Understand the method, not just the answer", "Practise each skill until it sticks", "Spot and fix mistakes right away"],
      // Features below are confirmed by the program's promotional video.
      features: ["interactive", "autocorrect", "feedback", "practice", "progress", "visual"],
      appUrl: "https://mathgrade6final.vercel.app/",
      video: "assets/videos/g6-math.mp4",
      poster: "assets/videos/g6-math-poster.jpg",
      screenshots: ["assets/screens/g6-math-1.jpg", "assets/screens/g6-math-2.jpg", "assets/screens/g6-math-3.jpg"] },
    { grade: "g6", subject: "science",
      description: "Into Science Grade 6 with interactive 3D science simulations, chapter-synced explanation videos with key takeaways, a searchable glossary with lab examples and self-paced practice, organised quarter by quarter.",
      benefits: ["See chemical reactions and energy changes in clear visuals", "Learn every key term with its definition and a real lab example", "Follow each lesson in order: lab, glossary, then test yourself"],
      // Features below are confirmed by the program's promotional video.
      features: ["interactive", "videos", "visual", "glossary", "practice"],
      appUrl: "https://science-grade-6-seven.vercel.app/",
      video: "assets/videos/g6-science.mp4",
      poster: "assets/videos/g6-science-poster.jpg",
      screenshots: ["assets/screens/g6-science-1.jpg", "assets/screens/g6-science-2.jpg", "assets/screens/g6-science-3.jpg"] },
    { grade: "g6", subject: "arsocial",
      description: "Grade 6 Social Studies in Arabic for Term 1, built on the school textbook: interactive lessons with maps and read-aloud text, XP, badges and levels for every correct answer, and auto-graded assessments with an instant score and a model answer under each question.",
      benefits: ["Study each lesson through key facts, maps and read-aloud text", "Earn XP, badges and levels for every correct answer", "Get an instant score and a model answer for every question"],
      // Features below are confirmed by the program's promotional video.
      features: ["interactive", "visual", "audio", "autocorrect", "feedback", "progress"],
      appUrl: "https://ass6final-qll2.vercel.app/",
      video: "assets/videos/g6-arsocial.mp4",
      poster: "assets/videos/g6-arsocial-poster.jpg",
      screenshots: ["assets/screens/g6-arsocial-1.jpg", "assets/screens/g6-arsocial-2.jpg", "assets/screens/g6-arsocial-3.jpg"] },
    { grade: "g6", subject: "social",
      description: "Grade 6 social studies mastered one question at a time, with a visual infographic, key words and a full quiz for every lesson, taken from the textbook.",
      benefits: ["See each lesson as a clear visual infographic", "Learn the key words for every topic", "Understand every answer through its explanation"],
      // Features below are confirmed by the program's promotional video.
      features: ["visual", "quizzes", "autocorrect", "feedback", "progress", "interactive"],
      appUrl: "https://essgrade6final.vercel.app/",
      video: "assets/videos/g6-social.mp4",
      poster: "assets/videos/g6-social-poster.jpg",
      screenshots: ["assets/screens/g6-social-1.jpg", "assets/screens/g6-social-2.jpg", "assets/screens/g6-social-3.jpg"] },
    { grade: "g6", subject: "german",
      description: "Grade 6 German vocabulary learned one word at a time: see the picture, hear the word, read it in an example sentence, then test yourself in a review game, with story and grammar videos.",
      benefits: ["Hear the pronunciation of every word", "Learn der, die or das with each noun", "See which words to practise next after every review"],
      // Features below are confirmed by the program's promotional video.
      features: ["interactive", "audio", "visual", "videos", "quizzes", "practice"],
      appUrl: "https://german-grade-6-stories.vercel.app/",
      video: "assets/videos/g6-german.mp4",
      poster: "assets/videos/g6-german-poster.jpg",
      screenshots: ["assets/screens/g6-german-1.jpg", "assets/screens/g6-german-2.jpg", "assets/screens/g6-german-3.jpg"] },
    { grade: "g6", subject: "arabic",
      description: "Grade 6 Arabic with every question from the performance and assessments book made interactive: instant correction, a read-aloud lesson review, a smart exam builder and progress tracking.",
      benefits: ["Practise every question in the assessments book", "Know instantly whether each answer is right", "Build your own exam from the lessons you choose"],
      // Features below are confirmed by the program's promotional video.
      features: ["interactive", "autocorrect", "feedback", "audio", "quizzes", "progress"],
      appUrl: "https://arabic-g6.vercel.app/",
      video: "assets/videos/g6-arabic.mp4",
      poster: "assets/videos/g6-arabic-poster.jpg",
      screenshots: ["assets/screens/g6-arabic-1.jpg", "assets/screens/g6-arabic-2.jpg", "assets/screens/g6-arabic-3.jpg"] },

    // GRADE 8
    { grade: "g8", subject: "math",
      description: "Grade 8 mathematics as a Quarter 1 expedition through five stations: equations, slope, functions, proportional relationships and number of solutions. Every answer is checked instantly, in English or Arabic.",
      benefits: ["Know straight away whether each answer is right", "See the correct answer and why after every mistake", "Review accuracy and progress station by station"],
      // Features below are confirmed by the program's promotional video.
      features: ["interactive", "autocorrect", "feedback", "practice", "progress"],
      appUrl: "https://gr8math.vercel.app/",
      video: "assets/videos/g8-math.mp4",
      poster: "assets/videos/g8-math-poster.jpg",
      screenshots: ["assets/screens/g8-math-1.jpg", "assets/screens/g8-math-2.jpg", "assets/screens/g8-math-3.jpg"] },
    { grade: "g8", subject: "science",
      description: "Grade 8 science that uses visual models and interactive questions to make deeper scientific concepts clear and memorable.",
      benefits: ["Visualise processes that are hard to imagine", "Link concepts across topics", "Test understanding with smart quizzes"],
      features: ["interactive", "visual", "quizzes", "feedback", "videos"],
      appUrl: "https://science-gr8.vercel.app/",
      video: "", screenshots: [] },
    { grade: "g8", subject: "arsocial",
      description: "Grade 8 Social Studies in Arabic, built entirely on the approved 2026/2027 Ministry textbook: interactive mind maps, clickable geography maps, smart feedback that grades meaning rather than memorisation, and a smart exam generator with instant analytics.",
      benefits: ["Explore geography through clickable interactive maps", "Get three-level feedback showing what each answer is missing", "Build custom exams and see results by lesson and skill"],
      // Features below are confirmed by the program's promotional video.
      features: ["interactive", "visual", "autocorrect", "feedback", "quizzes", "progress"],
      appUrl: "https://ass-grade8-final.vercel.app/",
      video: "assets/videos/g8-arsocial.mp4",
      poster: "assets/videos/g8-arsocial-poster.jpg",
      screenshots: ["assets/screens/g8-arsocial-1.jpg", "assets/screens/g8-arsocial-2.jpg", "assets/screens/g8-arsocial-3.jpg"] },
    { grade: "g8", subject: "social",
      description: "HMH English Social Studies final review for Modules 16 and 17, The Atlantic World 1492–1700: narrated infographics, read-aloud lessons, an interactive timeline, an Atlantic map game and every class worksheet question with instant correction.",
      benefits: ["Learn each lesson through infographics explained aloud", "Practise every question from your class worksheets", "See your accuracy lesson by lesson"],
      // Features below are confirmed by the program's promotional video.
      features: ["visual", "audio", "autocorrect", "feedback", "progress", "interactive"],
      appUrl: "https://hmh-english-social-studies-grade-8.vercel.app/",
      video: "assets/videos/g8-social.mp4",
      poster: "assets/videos/g8-social-poster.jpg",
      screenshots: ["assets/screens/g8-social-1.jpg", "assets/screens/g8-social-2.jpg", "assets/screens/g8-social-3.jpg"] },
    { grade: "g8", subject: "german",
      description: "Grade 8 German learned through an illustrated bilingual storybook, read aloud by a German voice, with illustrated vocabulary cards, a quiz with instant feedback and a story video for every act.",
      benefits: ["Follow a real story in German and English side by side", "Hear every sentence read by a German voice", "Learn der, die or das with colour-coded vocabulary cards"],
      // Features below are confirmed by the program's promotional video.
      features: ["interactive", "audio", "visual", "quizzes", "feedback", "videos"],
      appUrl: "https://german-grade-8-final.vercel.app/",
      video: "assets/videos/g8-german.mp4",
      poster: "assets/videos/g8-german-poster.jpg",
      screenshots: ["assets/screens/g8-german-1.jpg", "assets/screens/g8-german-2.jpg", "assets/screens/g8-german-3.jpg"] },
    { grade: "g8", subject: "arabic",
      description: "Grade 8 Arabic covering reading, grammar and expression with structured activities that deepen language mastery.",
      benefits: ["Master grammar rules with clear practice", "Improve comprehension of longer texts", "Track improvement over time"],
      features: ["interactive", "quizzes", "autocorrect", "feedback", "practice"],
      appUrl: "https://arabic-g8.vercel.app/",
      video: "", screenshots: [] }
  ],

  /* Verified figures only. Leave empty to show the program counts (always true). */
  stats: [
    // { value: 1500, suffix: "+", label: "Students enrolled" }
  ],

  /* Authentic parent testimonials only. */
  testimonials: [
    // { quote: "…", name: "Parent name", detail: "Parent of a Grade 6 student" }
  ]
};
