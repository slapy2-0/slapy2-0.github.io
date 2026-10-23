/* ==========================================================
   THIS IS THE ONLY FILE YOU EDIT FOR THE MAIN PAGE.

   ADD A PROJECT        copy one { ... } block in PROJECTS, paste it
                        at the top of the list, change the text.
   ADD A CERTIFICATION  copy one { ... } block in CERTS, same way.
   ADD A SKILL GROUP    copy one { ... } block in SKILLS.
   ADD A LINK           copy one { ... } block in LINKS.

   Save, push to GitHub. Done. Keep the commas between blocks.

   link : a full URL. Use "" to hide the link/button.
   tags : short words shown as small chips. Use [] for none.
   ========================================================== */

const SITE = {
  hello: "Hello, I'm",
  name: "Pawan Sirimanna",
  title: "Network & Cybersecurity Student",
  roles: ["Penetration testing", "Ethical hacking", "Red teaming"],
  intro: [
    "Building practical experience in networking, Linux system administration and cybersecurity through hands-on labs and projects.",
    "My direction is offensive security: finding weaknesses the way an attacker would, so they can be fixed."
  ]
};

const ABOUT = {
  /* each string is one paragraph */
  paragraphs: [
    "I am a Higher National Diploma student focusing on networking, system administration and cybersecurity. I am developing my technical skills through practical labs, projects, certifications and continuous learning.",
    "My goal is to work as a penetration tester and red teamer. I practise on Hack The Box, where I work through Linux, Windows and Active Directory machines, and I write notes for each one covering recon, foothold, privilege escalation and what I learned.",
    "A solid networking and Linux base is what makes attacking systems make sense, so I keep building both alongside the offensive work."
  ],
  /* small label / value rows */
  facts: [
    ["Studying", "Higher National Diploma"],
    ["Focus", "Penetration testing, red teaming"],
    ["Practice", "Hack The Box labs"],
    ["Base", "Networking, Linux, system administration"]
  ],
  /* the order I work in, shown as numbered steps */
  approach: [
    { title: "Recon", text: "Scan and map what is exposed." },
    { title: "Enumeration", text: "Dig into services, endpoints and versions." },
    { title: "Foothold", text: "Turn a weakness into first access." },
    { title: "Privilege escalation", text: "Move from a user to full control." },
    { title: "Write-up", text: "Document the path and the fix." }
  ]
};

const SKILLS = [
  { name: "Offensive security", text: "Recon and enumeration, web exploitation (SSRF, LFI, IDOR), Linux and Windows privilege escalation, Active Directory lateral movement" },
  { name: "Networking", text: "CCNA, TCP/IP, VLANs, Routing & Switching, Subnetting, Wireshark" },
  { name: "Linux & System Administration", text: "Linux, CentOS, SSH, Apache, DNS, DHCP, Firewall Management" },
  { name: "Cybersecurity", text: "Kali Linux, Nmap, Wireshark, Network Security and Security Monitoring" },
  { name: "Programming", text: "Python, HTML, CSS, JavaScript and SQL" }
];

const PROJECTS = [
  {
    name: "Linux Server Administration Lab",
    summary: "Practical Linux server administration including SSH, Apache, DNS, firewall and user management.",
    tags: ["linux", "ssh", "apache", "dns"],
    link: ""
  },
  {
    name: "Networking Labs",
    summary: "CCNA-based networking labs covering VLANs, routing, switching and IP addressing.",
    tags: ["ccna", "vlan", "routing"],
    link: ""
  },
  {
    name: "Wireshark Network Analysis",
    summary: "Network traffic analysis and packet inspection using Wireshark.",
    tags: ["wireshark", "packets"],
    link: ""
  }
];

const CERTS = [
  { name: "CCNA", issuer: "Cisco Networking Academy", year: "", link: "" },
  { name: "Microsoft Learn", issuer: "Microsoft technical learning credentials", year: "", link: "" }
];

const LINKS = [
  { label: "GitHub", url: "https://github.com/slapy2-0" },
  { label: "LinkedIn", url: "#" },
  { label: "Email", url: "mailto:your-email@example.com" }
];
