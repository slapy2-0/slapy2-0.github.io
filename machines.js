/* ==========================================================
   HOW TO ADD A NEW MACHINE
   1. Copy one block { ... }, from "{" to "},"
   2. Paste it at the top of the list below
   3. Change the text, save, push to GitHub. Done.

   difficulty : "Easy" | "Medium" | "Hard" | "Insane"
   type       : "Machine" | "Challenge"
   os         : "Linux" | "Windows" | "Web" | anything you like
   status     : "Rooted" | "User only" | "In progress"
   date       : "YYYY-MM-DD"
   steps      : the order you solved it (shown as a numbered list)
   link       : optional, a full write-up URL. Use "" to hide the button.
   Delete the two example entries once you add real ones.
   ========================================================== */

const MACHINES = [
  {
    name: "Example Machine",
    type: "Machine",
    os: "Linux",
    difficulty: "Easy",
    status: "Rooted",
    date: "2026-10-23",
    tags: ["nmap", "web", "privesc"],
    summary: "One or two lines on what this box is about.",
    steps: [
      { title: "Recon", text: "Nmap scan found ports 22 and 80." },
      { title: "Foothold", text: "What gave you the first shell." },
      { title: "Privilege escalation", text: "How you became root." }
    ],
    lesson: "The one thing you will remember from this box.",
    link: ""
  },
  {
    name: "Example Challenge",
    type: "Challenge",
    os: "Web",
    difficulty: "Medium",
    status: "In progress",
    date: "2026-10-22",
    tags: ["enumeration", "gobuster"],
    summary: "Replace this with your own notes.",
    steps: [{ title: "Enumeration", text: "Directory brute force with gobuster." }],
    lesson: "",
    link: ""
  }
];
