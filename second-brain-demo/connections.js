(function () {
  const canvas = document.getElementById("connection-map");
  const panel = document.getElementById("connection-panel");
  if (!canvas || !panel) return;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const logicalWidth = canvas.width;
  const logicalHeight = canvas.height;
  canvas.width = logicalWidth * dpr;
  canvas.height = logicalHeight * dpr;
  ctx.scale(dpr, dpr);

  const nodes = [
    {
      id: "soul",
      label: "SOUL.md",
      x: 180,
      y: 110,
      color: "#f59e0b",
      description: "Defines voice, persona, and operating posture. It shapes how every model shows up before it says a word.",
      meta: "Connects to Alice, Butch, Doctor Little, and model behavior.",
    },
    {
      id: "memory",
      label: "MEMORY.md",
      x: 390,
      y: 120,
      color: "#a78bfa",
      description: "Curated long-term memory. It connects diary history, HARVEST output, wiki summaries, and session carryover.",
      meta: "Connects to diary, wiki, sessions, HARVEST output, and every model that needs instant context.",
    },
    {
      id: "diary",
      label: "Diary",
      x: 620,
      y: 145,
      color: "#38bdf8",
      description: "The running record of what happened. The diary is raw enough to preserve detail and durable enough to feed reconciliation.",
      meta: "Connects to MEMORY.md, D Second Brain, HARVEST, and session history.",
    },
    {
      id: "wiki",
      label: "Wiki",
      x: 885,
      y: 135,
      color: "#22d3ee",
      description: "Structured, linked context built from repeated work and distilled facts. This is how new models get up to speed fast.",
      meta: "Connects to HARVEST cron, MEMORY.md, agents, sessions, and D Second Brain.",
    },
    {
      id: "alice",
      label: "Alice",
      x: 255,
      y: 300,
      color: "#fb7185",
      description: "Alice reads MEMORY.md, updates wiki context, runs reconciliation, and keeps work moving with ej.",
      meta: "Reads MEMORY.md, writes to wiki, references diary, and talks to ej.",
    },
    {
      id: "butch",
      label: "Butch",
      x: 470,
      y: 310,
      color: "#f97316",
      description: "Strategic board-level operator. Butch looks across projects, direction, and system shape rather than only local tasks.",
      meta: "Connects to Alice, D Second Brain, major project docs, and strategic memory.",
    },
    {
      id: "janice",
      label: "Janice",
      x: 690,
      y: 300,
      color: "#34d399",
      description: "House spirit and reconciliation helper. Janice keeps household systems and second-brain upkeep from drifting.",
      meta: "Connects to diary, D Second Brain, and reconciliation work.",
    },
    {
      id: "doctor",
      label: "Doctor Little",
      x: 920,
      y: 295,
      color: "#60a5fa",
      description: "Admin and household operator focused on logistics, follow-up, and practical task handling.",
      meta: "Connects to sessions, schedules, diary notes, and family logistics.",
    },
    {
      id: "mempalace",
      label: "MemPalace",
      x: 160,
      y: 520,
      color: "#818cf8",
      description: "Semantic storage layer for recall at scale. It helps the system surface patterns beyond a single transcript.",
      meta: "Connects to MEMORY.md, sessions, and the larger recall stack.",
    },
    {
      id: "sessions",
      label: "Sessions",
      x: 395,
      y: 520,
      color: "#f472b6",
      description: "The raw conversational substrate where work actually happens and where HARVEST starts its reading.",
      meta: "Connects to HARVEST, MEMORY.md, agents, and diary updates.",
    },
    {
      id: "harvest",
      label: "HARVEST cron",
      x: 635,
      y: 520,
      color: "#c084fc",
      description: "Scheduled processing that reads sessions, extracts durable change, writes wiki updates, and closes the loop.",
      meta: "Connects to sessions, wiki, MEMORY.md, and future agent context.",
    },
    {
      id: "dsecondbrain",
      label: "D Second Brain",
      x: 905,
      y: 515,
      color: "#facc15",
      description: "The shared source of truth where diary pages, wiki material, and operating artifacts accumulate into infrastructure.",
      meta: "Connects to diary, wiki, agents, HARVEST, and the human's working world.",
    },
  ];

  const edges = [
    ["soul", "alice"], ["soul", "butch"], ["soul", "doctor"],
    ["memory", "alice"], ["memory", "wiki"], ["memory", "sessions"], ["memory", "diary"], ["memory", "harvest"],
    ["diary", "wiki"], ["diary", "harvest"], ["diary", "dsecondbrain"],
    ["wiki", "harvest"], ["wiki", "dsecondbrain"], ["wiki", "alice"], ["wiki", "butch"],
    ["alice", "butch"], ["alice", "janice"], ["alice", "sessions"],
    ["butch", "janice"], ["butch", "doctor"],
    ["janice", "dsecondbrain"], ["doctor", "sessions"],
    ["mempalace", "memory"], ["mempalace", "sessions"],
    ["sessions", "harvest"], ["sessions", "dsecondbrain"],
    ["harvest", "dsecondbrain"], ["harvest", "alice"],
  ];

  let selected = null;
  let tick = 0;

  function findNode(id) {
    return nodes.find((node) => node.id === id);
  }

  function connectedSet(id) {
    const set = new Set([id]);
    edges.forEach(([a, b]) => {
      if (a === id) set.add(b);
      if (b === id) set.add(a);
    });
    return set;
  }

  function drawBackground() {
    ctx.clearRect(0, 0, logicalWidth, logicalHeight);
    for (let i = 0; i < 80; i += 1) {
      const x = (i * 173) % logicalWidth;
      const y = (i * 97) % logicalHeight;
      const radius = (i % 3) + 1;
      const alpha = 0.08 + ((i % 5) * 0.03);
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawEdges(activeSet) {
    edges.forEach(([aId, bId]) => {
      const a = findNode(aId);
      const b = findNode(bId);
      const highlight = activeSet && activeSet.has(aId) && activeSet.has(bId);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = highlight ? "rgba(165, 180, 252, 0.85)" : "rgba(71, 85, 105, 0.5)";
      ctx.lineWidth = highlight ? 3 : 1.5;
      ctx.shadowBlur = highlight ? 18 : 0;
      ctx.shadowColor = highlight ? "rgba(129,140,248,0.85)" : "transparent";
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  }

  function drawNodes(activeSet) {
    nodes.forEach((node, index) => {
      const pulse = 2 + Math.sin((tick / 20) + index) * 1.5;
      const highlighted = activeSet ? activeSet.has(node.id) : true;
      ctx.beginPath();
      ctx.fillStyle = highlighted ? node.color : "rgba(71,85,105,0.85)";
      ctx.shadowBlur = highlighted ? 24 : 8;
      ctx.shadowColor = highlighted ? node.color : "rgba(71,85,105,0.35)";
      ctx.arc(node.x, node.y, 18 + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.strokeStyle = highlighted ? "rgba(255,255,255,0.9)" : "rgba(148,163,184,0.45)";
      ctx.lineWidth = highlighted ? 2.5 : 1.25;
      ctx.arc(node.x, node.y, 22 + pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = highlighted ? "#f8fafc" : "#94a3b8";
      ctx.font = "600 18px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.label, node.x, node.y + 44);
    });
  }

  function render() {
    tick += 1;
    const activeSet = selected ? connectedSet(selected.id) : null;
    drawBackground();
    drawEdges(activeSet);
    drawNodes(activeSet);
    window.requestAnimationFrame(render);
  }

  function updatePanel(node) {
    selected = node;
    panel.classList.add("has-selection");
    panel.innerHTML = `
      <h3>${node.label}</h3>
      <p>${node.description}</p>
      <div class="panel-meta">${node.meta}</div>
    `;
  }

  function hitTest(x, y) {
    return nodes.find((node) => {
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) <= 28;
    });
  }

  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = logicalWidth / rect.width;
    const scaleY = logicalHeight / rect.height;
    const node = hitTest((event.clientX - rect.left) * scaleX, (event.clientY - rect.top) * scaleY);
    if (node) updatePanel(node);
  });

  updatePanel(findNode("memory"));
  render();
})();
