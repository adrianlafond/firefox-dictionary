const audio: any = {
  tracks: {},
  disabled: false,
  panel: null,

  init(panel: HTMLElement) {
    audio.destroy();
    audio.panel = panel;
    if (audio.disabled) {
      audio.disableButtons();
    } else {
      document.addEventListener('securitypolicyviolation', audio.handleSecurityPolicyViolation);
      const audioButtons = audio.panel.querySelectorAll(`button[${AUDIO_TRACK}]`);
      for (let i = 0; i < audioButtons.length; i++) {
        const button = audioButtons[i] as HTMLButtonElement;
        const track = button.getAttribute(AUDIO_TRACK);
        if (track) {
          audio.tracks[track] = new Audio(track);
          button.addEventListener('click', audio.playAudio);
        }
      }
    }
  },

  destroy() {
    if (audio.panel) {
      const audioButtons = audio.panel.querySelectorAll(`button[${AUDIO_TRACK}]`);
      for (let i = 0; i < audioButtons.length; i++) {
        audioButtons[i].removeEventListener('click', audio.playAudio);
      }
      audio.tracks = {};
      audio.panel = null;
      document.removeEventListener('securitypolicyviolation', audio.handleSecurityPolicyViolation);
    }
  },

  disableButtons() {
    const audioButtons = audio.panel.querySelectorAll(`button[${AUDIO_TRACK}]`);
    for (let i = 0; i < audioButtons.length; i++) {
      (audioButtons[i] as HTMLButtonElement).disabled = true;
    }
    audio.destroy();
  },

  showCspWarning() {
    const warning = audio.panel.querySelector(`.${BLOCK}__csp`);
    if (warning) {
      warning.classList.add(`${BLOCK}__csp--shown`);
    }
  },

  handleSecurityPolicyViolation: (event: SecurityPolicyViolationEvent) => {
    if (event.blockedURI && event.blockedURI.endsWith('.mp3')) {
      audio.disabled = true;
      audio.showCspWarning();
      audio.disableButtons();
    }
  },

  playAudio: (event: MouseEvent) => {
    const button = event.currentTarget as HTMLButtonElement;
    const track = button.getAttribute(AUDIO_TRACK);
    if (track && audio.tracks[track]) {
      audio.tracks[track].play();
    }
  }
};
