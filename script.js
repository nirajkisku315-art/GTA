/**
 * ============================================================================
 * GTA VI CLIPS — ULTRA-MINIMAL CORE SCRIPT
 * Transparent Glass UI, YouTube Cinema Player, and Audio Sync
 * ============================================================================
 */

/* ==========================================================================
   1. CLIPS REPOSITORY (Replace or add YouTube Video IDs easily)
   ========================================================================== */
const CLIPS_DATA = [
  {
    id: "clip-1",
    youtubeId: "QdBZY2fkU-0",
    title: "Official Vice City High-Speed Highway Chase",
    creatorTag: "@RockstarGames",
    category: "viral-moments",
    duration: "1:31"
  },
  {
    id: "clip-2",
    youtubeId: "VQRLujxTmAA",
    title: "Hovercraft Mega Jump Across Vice Beach Pier",
    creatorTag: "@ViceDrifter",
    category: "insane-stunts",
    duration: "0:52"
  },
  {
    id: "clip-3",
    youtubeId: "Wn6r38sHwZ0",
    title: "Alligator Steals Beer In Convenience Store (AI Fail)",
    creatorTag: "@FloridaManGaming",
    category: "funny-fails",
    duration: "0:44"
  },
  {
    id: "clip-4",
    youtubeId: "kLg5S9Q2y4Y",
    title: "Streamer Finds Secret Underwater Military Bunker",
    creatorTag: "@Tfue",
    category: "top-creators",
    duration: "2:14"
  },
  {
    id: "clip-5",
    youtubeId: "HqU9Jg4c8Xg",
    title: "5-Star Police Pursuit Down Ocean Drive In Muscle Car",
    creatorTag: "@NeonOutlaw",
    category: "viral-moments",
    duration: "1:48"
  },
  {
    id: "clip-6",
    youtubeId: "3v8v9d7a2y0",
    title: "Rooftop Motorbike Backflip Into Moving Cargo Yacht",
    creatorTag: "@StuntMasterVice",
    category: "insane-stunts",
    duration: "0:38"
  },
  {
    id: "clip-7",
    youtubeId: "7qJ4g6m1o3a",
    title: "Cruiser Launches Into Orbit After Hitting Traffic Cone",
    creatorTag: "@GlitchesAndGiggles",
    category: "funny-fails",
    duration: "0:29"
  },
  {
    id: "clip-8",
    youtubeId: "4kR2w8y9p0x",
    title: "xQc Loses It Over Next-Gen Ocean Wave Dynamics",
    creatorTag: "@xQcOW",
    category: "top-creators",
    duration: "1:15"
  },
  {
    id: "clip-9",
    youtubeId: "9bZkp7q19f0",
    title: "Threading The Needle: Flying Helicopter Through Tunnel",
    creatorTag: "@AeroAce",
    category: "insane-stunts",
    duration: "0:47"
  },
  {
    id: "clip-10",
    youtubeId: "6f5a3b2c1d0",
    title: "Malibu Club Neon Heist Shootout Cinematic",
    creatorTag: "@ViceCityCinematics",
    category: "viral-moments",
    duration: "2:05"
  },
  {
    id: "clip-11",
    youtubeId: "2n3m4k5l6p7",
    title: "Pedestrian Parallel Parking Disaster In Vice Marina",
    creatorTag: "@RagdollKing",
    category: "funny-fails",
    duration: "0:35"
  },
  {
    id: "clip-12",
    youtubeId: "5j8h7g6f5d4",
    title: "Shroud 60FPS Sniping Test From 200MPH Speedboat",
    creatorTag: "@shroud",
    category: "top-creators",
    duration: "1:52"
  }
];

/* ==========================================================================
   2. DOM ELEMENTS
   ========================================================================== */
const gtaAudio = document.getElementById("gta-audio");
const musicToggleBtn = document.getElementById("music-toggle");
const musicStateLabel = document.getElementById("music-state-label");

const clipsGrid = document.getElementById("clips-grid");
const filterPills = document.querySelectorAll(".c-pill[data-category]");
const clipSearchInput = document.getElementById("clip-search-input");
const noResultsState = document.getElementById("no-results-state");
const resetFilterBtn = document.getElementById("reset-filter-btn");

// Cinema Modal
const cinemaModal = document.getElementById("cinema-modal");
const modalBackdrop = document.getElementById("modal-backdrop");
const modalCloseBtn = document.getElementById("modal-close-btn");
const youtubePlayerFrame = document.getElementById("youtube-player-frame");
const modalClipTitle = document.getElementById("modal-clip-title");
const modalCreatorTag = document.getElementById("modal-creator-tag");
const modalShareBtn = document.getElementById("modal-share-btn");
const modalYoutubeLink = document.getElementById("modal-youtube-link");

// Toast
const toastBox = document.getElementById("toast-box");
const toastMessage = document.getElementById("toast-message");
let toastTimer = null;

// State Tracking
let activeCategory = "all";
let searchQuery = "";
let currentClip = null;
let wasMusicPlayingBeforeModal = false;

/* ==========================================================================
   3. AUDIO PLAYER (gta-music.mp3)
   ========================================================================== */
function setMusicPlayingState(isPlaying) {
  if (isPlaying) {
    musicToggleBtn.classList.add("playing");
    musicStateLabel.textContent = "ON AIR";
  } else {
    musicToggleBtn.classList.remove("playing");
    musicStateLabel.textContent = "RADIO";
  }
}

async function toggleRadioAudio() {
  if (!gtaAudio) return;
  if (gtaAudio.paused) {
    try {
      await gtaAudio.play();
      setMusicPlayingState(true);
    } catch (e) {
      showToast("Tap again to play audio");
    }
  } else {
    gtaAudio.pause();
    setMusicPlayingState(false);
  }
}

if (musicToggleBtn) {
  musicToggleBtn.addEventListener("click", toggleRadioAudio);
}

/* ==========================================================================
   4. RENDER COMPACT CLIPS GRID
   ========================================================================== */
function renderClips(clips) {
  if (!clipsGrid) return;
  clipsGrid.innerHTML = "";

  if (clips.length === 0) {
    if (noResultsState) noResultsState.style.display = "block";
    return;
  }
  if (noResultsState) noResultsState.style.display = "none";

  const fragment = document.createDocumentFragment();

  clips.forEach((clip) => {
    const card = document.createElement("div");
    card.className = "compact-clip-card";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", clip.title);

    const primaryThumb = `https://img.youtube.com/vi/${clip.youtubeId}/hqdefault.jpg`;

    card.innerHTML = `
      <div class="compact-thumb-wrap">
        <img 
          src="${primaryThumb}" 
          alt="${clip.title}" 
          class="compact-thumb-img" 
          loading="lazy"
        >
        <div class="compact-play-icon"><i class="fa-solid fa-play"></i></div>
        <span class="compact-duration">${clip.duration}</span>
      </div>
      <div class="compact-card-body">
        <span class="compact-clip-title" title="${clip.title}">${clip.title}</span>
        <div class="compact-creator-row">
          <span class="compact-creator-tag">${clip.creatorTag}</span>
          <button class="compact-share-btn" title="Share clip" aria-label="Share clip">
            <i class="fa-solid fa-share-nodes"></i>
          </button>
        </div>
      </div>
    `;

    // Click card to open modal
    card.addEventListener("click", (e) => {
      if (e.target.closest(".compact-share-btn")) {
        e.stopPropagation();
        shareClip(clip);
        return;
      }
      openCinemaModal(clip);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openCinemaModal(clip);
      }
    });

    fragment.appendChild(card);
  });

  clipsGrid.appendChild(fragment);
}

/* ==========================================================================
   5. FILTERING & SEARCH
   ========================================================================== */
function applyFilterAndSearch() {
  const query = searchQuery.trim().toLowerCase();

  const filtered = CLIPS_DATA.filter((clip) => {
    const matchesCat = activeCategory === "all" || clip.category === activeCategory;
    const matchesQuery =
      query === "" ||
      clip.title.toLowerCase().includes(query) ||
      clip.creatorTag.toLowerCase().includes(query);
    return matchesCat && matchesQuery;
  });

  renderClips(filtered);
}

// Category filter pills
filterPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    filterPills.forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    activeCategory = pill.dataset.category;
    applyFilterAndSearch();
  });
});

// Search input
if (clipSearchInput) {
  clipSearchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    applyFilterAndSearch();
  });
}

// Reset button
if (resetFilterBtn) {
  resetFilterBtn.addEventListener("click", () => {
    activeCategory = "all";
    searchQuery = "";
    if (clipSearchInput) clipSearchInput.value = "";
    filterPills.forEach((p) => {
      p.classList.toggle("active", p.dataset.category === "all");
    });
    applyFilterAndSearch();
  });
}

/* ==========================================================================
   6. CINEMA YOUTUBE MODAL (With Music Auto-Pause / Resume)
   ========================================================================== */
function openCinemaModal(clip) {
  currentClip = clip;

  // 1. AUTO-PAUSE GTA-MUSIC.MP3 IF PLAYING
  if (gtaAudio && !gtaAudio.paused) {
    wasMusicPlayingBeforeModal = true;
    gtaAudio.pause();
    setMusicPlayingState(false);
  } else {
    wasMusicPlayingBeforeModal = false;
  }

  // 2. Set modal content
  modalClipTitle.textContent = clip.title;
  modalCreatorTag.textContent = clip.creatorTag;
  modalYoutubeLink.href = `https://www.youtube.com/watch?v=${clip.youtubeId}`;
  youtubePlayerFrame.src = `https://www.youtube.com/embed/${clip.youtubeId}?autoplay=1&rel=0&modestbranding=1`;

  // 3. Display modal
  cinemaModal.style.display = "flex";
  void cinemaModal.offsetWidth;
  cinemaModal.classList.add("active");
}

function closeCinemaModal() {
  if (!cinemaModal.classList.contains("active")) return;

  // 1. Clear iframe src to STOP video immediately
  youtubePlayerFrame.src = "";
  cinemaModal.classList.remove("active");

  setTimeout(() => {
    cinemaModal.style.display = "none";
  }, 250);

  // 2. RESUME GTA-MUSIC.MP3 IF PLAYING BEFORE OPENING MODAL
  if (wasMusicPlayingBeforeModal && gtaAudio) {
    gtaAudio.play().then(() => {
      setMusicPlayingState(true);
    }).catch(() => {});
    wasMusicPlayingBeforeModal = false;
  }
}

if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeCinemaModal);
if (modalBackdrop) modalBackdrop.addEventListener("click", closeCinemaModal);

if (modalShareBtn) {
  modalShareBtn.addEventListener("click", () => {
    if (currentClip) shareClip(currentClip);
  });
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && cinemaModal.classList.contains("active")) {
    closeCinemaModal();
  }
});

/* ==========================================================================
   7. TOAST & SHARING
   ========================================================================== */
function showToast(msg) {
  if (toastMessage) toastMessage.textContent = msg;
  if (toastBox) {
    toastBox.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastBox.classList.remove("show");
    }, 2400);
  }
}

function shareClip(clip) {
  const url = `https://www.youtube.com/watch?v=${clip.youtubeId}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      showToast("YouTube link copied!");
    }).catch(() => {
      showToast("Clip: " + clip.title);
    });
  } else {
    showToast("Clip: " + clip.title);
  }
}

/* ==========================================================================
   8. SCROLL CONTAINER SPY, SMOOTH ANCHOR NAV & INTERSECTION OBSERVER
   ========================================================================== */
const scrollContainer = document.querySelector(".scroll-container");
const navLinks = document.querySelectorAll(".nav-link");

// Smooth scroll to target section inside .scroll-container
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId && targetId !== "#") {
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

if (scrollContainer) {
  scrollContainer.addEventListener("scroll", () => {
    const scrollPos = scrollContainer.scrollTop + 150;
    const sections = document.querySelectorAll(".v-section");

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.dataset.section === id);
        });
      }
    });
  }, { passive: true });
}

// Background Video Observer (pauses background videos when scrolled away & enforces inline mobile playback)
function setupVideoObserver() {
  const videos = document.querySelectorAll(".section-bg-video");

  videos.forEach((video) => {
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
  });

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const playPromise = entry.target.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        } else {
          entry.target.pause();
        }
      });
    }, { threshold: 0.15 });

    videos.forEach((v) => obs.observe(v));
  }
}

/* ==========================================================================
   9. INITIALIZE
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderClips(CLIPS_DATA);
  setupVideoObserver();
});
