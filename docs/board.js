// Moves the example job strip between the three lanes.
(function () {
  var steps = [
    {
      lane: "raw",
      file: "Raw/2026-11-podcast-ep12/",
      text: "Clips, audio, B-roll and a notes.md go into one subfolder. That subfolder is the job.",
      next: "Hand the job to the editor"
    },
    {
      lane: "exports",
      file: "podcast-ep12_v1.mp4",
      text: "The first draft comes back in Exports, named after its Raw folder with a version number.",
      next: "Write your feedback"
    },
    {
      lane: "exports",
      file: "feedback.md",
      text: "You watch the draft and write your notes beside it.",
      next: "Get the next draft"
    },
    {
      lane: "exports",
      file: "podcast-ep12_v2_9x16.mp4",
      text: "A new version follows your notes, cut for the platform you asked for.",
      next: "Approve this version"
    },
    {
      lane: "approved",
      file: "Approved Videos/podcast-ep12",
      text: "Signed off. It is now one of the examples the next edit is matched to first.",
      next: "Start the job again"
    }
  ];

  var strip = document.getElementById("job-strip");
  var file = document.getElementById("job-file");
  var text = document.getElementById("job-text");
  var button = document.getElementById("advance");
  var label = document.getElementById("advance-label");
  var count = document.getElementById("step-count");
  if (!strip || !button) return;

  var index = 0;

  function render() {
    var step = steps[index];
    var slot = document.querySelector('.lane[data-lane="' + step.lane + '"] .slot');
    if (slot && strip.parentNode !== slot) slot.appendChild(strip);
    file.textContent = step.file;
    text.textContent = step.text;
    label.textContent = step.next;
    count.textContent = "Step " + (index + 1) + " of " + steps.length;
  }

  function advance() {
    index = (index + 1) % steps.length;
    if (document.startViewTransition) {
      document.startViewTransition(render);
    } else {
      render();
    }
  }

  // The job plays itself once, until the visitor takes over.
  var beat = 2600;
  var timer = null;

  function stopPlaying() {
    if (timer) clearTimeout(timer);
    timer = null;
    strip.classList.remove("playing");
  }

  function tick() {
    if (index >= steps.length - 1) { stopPlaying(); return; }
    strip.classList.remove("playing");
    void strip.offsetWidth;
    strip.style.setProperty("--beat", beat + "ms");
    strip.classList.add("playing");
    timer = setTimeout(function () { advance(); tick(); }, beat);
  }

  var taken = false;

  button.addEventListener("click", function () {
    taken = true;
    stopPlaying();
    // Announce changes only once the visitor is driving.
    strip.setAttribute("aria-live", "polite");
    advance();
  });

  render();

  // Motion is opt-in: no reveals or autoplay under reduced motion.
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (calm || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("motion");

  var groups = [
    [".panel h2", "rise"],
    [".lane", ""],
    [".order > div", ""],
    [".fields li", "drop"],
    [".seg", "drop"],
    [".steps li", "rise"]
  ];
  var watched = [];
  groups.forEach(function (group) {
    var counts = new Map();
    document.querySelectorAll(group[0]).forEach(function (el) {
      var parent = el.parentNode;
      var i = counts.get(parent) || 0;
      counts.set(parent, i + 1);
      el.classList.add("reveal");
      if (group[1]) el.classList.add(group[1]);
      el.style.setProperty("--i", i);
      watched.push(el);
    });
  });
  document.querySelectorAll(".order, .steps").forEach(function (el) { watched.push(el); });

  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      seen.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.15 });
  watched.forEach(function (el) { seen.observe(el); });

  // Autoplay runs only while the lanes are on screen, and never after
  // the visitor has pressed the button.
  var lanes = document.querySelector(".lanes");
  var wait = null;
  var onLanes = new IntersectionObserver(function (entries) {
    if (taken) { onLanes.disconnect(); return; }
    if (entries[0].isIntersecting) {
      if (!timer && !wait && index < steps.length - 1) {
        wait = setTimeout(function () { wait = null; if (!taken) tick(); }, 900);
      }
    } else {
      if (wait) { clearTimeout(wait); wait = null; }
      stopPlaying();
    }
  }, { threshold: 0.6 });
  if (lanes) onLanes.observe(lanes);
})();
