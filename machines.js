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
   ========================================================== */

const MACHINES = [
{
    name: "Cohort",
    type: "Machine",
    os: "Linux",
    difficulty: "Easy",
    status: "Rooted",
    date: "2026-10-24",
    tags: ["ssrf", "marimo", "cve-2026-39987", "packagekit", "cve-2026-41651", "toctou", "suid", "web", "linux"],
    summary: "Web application with SSRF leads to discovery of an internal Marimo notebook service vulnerable to pre-auth RCE. Initial access as marimo, then privilege escalation via PackageKit TOCTOU race condition to obtain root.",
    steps: [
      { title: "Foothold", text: "Enumerated the web app; found /api/validate endpoint. Exploited SSRF (bypassing loopback filter with 0.0.0.0) to access internal Nginx /status page. Leaked internal vhost: nb-1be3782a8afd3ad5.cohort.htb → 127.0.0.1:8888 (Marimo). Exploited CVE-2026-39987 (Marimo pre-auth RCE) via /terminal/ws WebSocket to execute commands as user marimo." },
      { title: "Privilege Escalation", text: "Identified PackageKit 1.2.8 (vulnerable to CVE-2026-41651 TOCTOU). Ran public exploit to race D-Bus transaction, dropping SUID bash at /var/tmp/.suid_bash. Executed /var/tmp/.suid_bash -p to gain root shell and read /root/root.txt." },
      { title: "Lateral Movement", text: "None required (direct user → root)." }
    ],
    lesson: "Always enumerate API endpoints and inspect JavaScript bundles for hidden routes. SSRF filters can be bypassed with alternative localhost representations (0.0.0.0, 127.1, [::1], decimal IP). Race conditions in privileged services (PackageKit) can yield root via SUID drops. Keep reverse shells alive by maintaining the parent WebSocket connection; use setsid/nohup for stability. Check both /tmp and /var/tmp for dropped SUID binaries.",
    link: "https://app.hackthebox.com/machines/Cohort"
  },
  {
    name: "Cap",
    type: "Machine",
    os: "Linux",
    difficulty: "Easy",
    status: "Rooted",
    date: "2021-06-05",
    tags: ["staff pick", "idor", "capabilities"],
    summary: "Easy Linux machine focusing on IDOR and Linux capabilities.",
    steps: [
      { title: "Recon", text: "Nmap scan found ports 21 (FTP), 22 (SSH), and 80 (HTTP)." },
      { title: "Foothold", text: "Exploited an IDOR vulnerability in the web app to download a PCAP file and extract FTP credentials." },
      { title: "Privilege escalation", text: "Used the 'cap_setuid' capability on Python to get a root shell." }
    ],
    lesson: "Always check for file capabilities using 'getcap -r /' on Linux.",
    link: ""
  },
  {
    name: "Autopilot",
    type: "Machine",
    os: "Windows",
    difficulty: "Insane",
    status: "Rooted",
    date: "2026-10-17",
    tags: ["seasonal", "active-directory", "grommunio", "wmiexec", "runas"],
    summary: "Insane hybrid environment involving grommunio-web exploitation, Postfix manipulation, and lateral movement to AD.",
    steps: [
      { title: "Foothold", text: "Exploited deborah.hernandez to gain a Web Shell inside grofiles." },
      { title: "Linux Root & Creds", text: "Used Admin API dbconf to change Postfix daemon_directory to /var/spool/mail and replaced a local binary to get SUID Bash. Read /var/lib/grommunio-web/session/ and decrypted sess_ku5... with an all-zero AES key to get stephanie.lewis's password." },
      { title: "Lateral Movement", text: "Used Stephanie's credentials to wmiexec into WS02." },
      { title: "Root", text: "Found C:\\Users\\stephanie.lewis\\Videos\\runas.exe -> Enabled RDP -> Logged in via RDP -> Executed runas.exe \"powershell.exe\" -> Read root.txt from DC01." }
    ],
    lesson: "Session files can be decrypted with default keys, and tools like runas.exe can be abused for privilege escalation.",
    link: ""
  },
    {
    name: "Stream",
    type: "Machine",
    os: "Linux",
    difficulty: "Medium",
    status: "Rooted",
    date: "2026-10-10",
    tags: ["xxe", "kafka", "clickhouse", "actuator", "heapdump"],
    summary: "Medium Linux machine featuring a microservices architecture, a downstream XXE vulnerability, Kafka credential leakage, and ClickHouse abuse for root RCE.",
    steps: [
      { title: "Recon & Actuator", text: "Found nginx reverse proxy (Spring Boot API) and an AIDX FastAPI ingest service. Discovered the db.htb-airport.htb vhost pointing to ClickHouse. Downloaded a 45MB heapdump from the exposed Spring Boot Actuator." },
      { title: "Foothold (XXE & ClickHouse)", text: "Extracted ClickHouse credentials from the heapdump to query the pipeline database. Discovered the FastAPI ingest didn't parse XML; the downstream Kafka consumer did. Triggered XXE in the consumer to read local files and exfiltrate them directly into the ClickHouse database via the parser." },
      { title: "User & Credential Pivoting", text: "Used XXE to read /opt/kafka_2.13-4.3.1/config/server.properties to extract SASL PLAIN credentials and SSH'd as svc-infra. Consumed the aidx.identity.json.v1 Kafka topic to extract martin_cole's bcrypt hash, cracked it to 'tinkerbell', and pivoted to the user account." },
      { title: "Root", text: "Captured the ClickHouse 'default' password by monitoring root's dlq_drainer.py process command line via /proc. Used INSERT INTO FUNCTION file() to overwrite /var/lib/clickhouse/user_files/aidx_quarantine.py with a malicious Python payload. The root-owned cron drainer executed the script, granting root access." }
    ],
    lesson: "Dangerous parsing isn't always at the entry point (ingest APIs can be dumb pipes). Internal message buses (Kafka) can leak credentials, and root processes may blindly execute files in unexpected locations like ClickHouse user_files.",
    link: ""
  },
  {
    name: "Touch",
    type: "Machine",
    os: "Windows",
    difficulty: "Easy",
    status: "Rooted",
    date: "2026-10-03",
    tags: ["windows", "web"],
    summary: "Easy Windows machine focusing on web application exploitation.",
    steps: [
      { title: "Recon", text: "Nmap scan found IIS web server." },
      { title: "Foothold", text: "Exploited a web vulnerability to get an initial shell." },
      { title: "Privilege escalation", text: "Abused Windows token privileges or unquoted service paths to gain SYSTEM." }
    ],
    lesson: "Check for standard Windows privilege escalation vectors like 'SeImpersonatePrivilege'.",
    link: ""
  },
  {
    name: "Layover",
    type: "Machine",
    os: "Linux",
    difficulty: "Medium",
    status: "Rooted",
    date: "2026-09-26",
    tags: ["linux", "api"],
    summary: "Medium Linux box with a focus on API exploitation.",
    steps: [
      { title: "Recon", text: "Found web services and API endpoints." },
      { title: "Foothold", text: "Interacted with the API to bypass authentication." },
      { title: "Privilege escalation", text: "Exploited a vulnerable local service to escalate to root." }
    ],
    lesson: "APIs often have hidden endpoints that can be discovered through fuzzing.",
    link: ""
  },
  {
    name: "Management",
    type: "Machine",
    os: "Linux",
    difficulty: "Easy",
    status: "Rooted",
    date: "2026-09-12",
    tags: ["linux", "tomcat"],
    summary: "Easy Linux machine involving Java/Tomcat management.",
    steps: [
      { title: "Recon", text: "Identified an Apache Tomcat server." },
      { title: "Foothold", text: "Used default or weak credentials to access the Manager App and deploy a malicious WAR file." },
      { title: "Privilege escalation", text: "Found credentials in configuration files or abused a SUID binary to get root." }
    ],
    lesson: "Never leave default management interfaces exposed with weak credentials.",
    link: ""
  },
  {
    name: "Nexus",
    type: "Machine",
    os: "Linux",
    difficulty: "Easy",
    status: "Rooted",
    date: "2026-06-23",
    tags: ["linux", "web"],
    summary: "Easy Linux machine focusing on repository management systems.",
    steps: [
      { title: "Recon", text: "Discovered a Nexus Repository Manager instance." },
      { title: "Foothold", text: "Exploited a known CVE or misconfiguration in the software." },
      { title: "Privilege escalation", text: "Escalated via local enumeration of sensitive files." }
    ],
    lesson: "Always check software versions against known public exploits.",
    link: ""
  },
  {
    name: "Orion",
    type: "Machine",
    os: "Linux",
    difficulty: "Easy",
    status: "Rooted",
    date: "2026-06-23",
    tags: ["staff pick", "linux", "cms"],
    summary: "Easy Linux machine featuring a custom CMS.",
    steps: [
      { title: "Recon", text: "Found a web application powered by a custom CMS." },
      { title: "Foothold", text: "Exploited an SQL injection or file upload vulnerability." },
      { title: "Privilege escalation", text: "Leveraged a misconfigured systemd service to get root." }
    ],
    lesson: "Custom web applications often have unique logical flaws.",
    link: ""
  }
];
