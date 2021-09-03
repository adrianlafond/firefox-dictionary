const audio: any = {
  tracks: {},
  initTimeout: 0,

  checkSiteSecurity() {
    document.addEventListener('securitypolicyviolation', event => {
      console.log(event);
    });
  },

  init(panel: HTMLElement) {
    audio.destroy(panel);
    const audioButtons = panel.querySelectorAll(`button[${AUDIO_TRACK}]`);
    for (let i = 0; i < audioButtons.length; i++) {
      const button = audioButtons[i] as HTMLButtonElement;
      const track = button.getAttribute(AUDIO_TRACK);
      if (track) {
        try {
          audio.tracks[track] = new Audio(track);
        } catch (error) {
          console.log(error);
        }
        button.addEventListener('click', audio.playAudio);
      }
    }
  },

  destroy(panel: HTMLElement) {
    const audioButtons = panel.querySelectorAll('button[data-audio]');
    for (let i = 0; i < audioButtons.length; i++) {
      audioButtons[i].removeEventListener('click', audio.playAudio);
    }
    audio.tracks = {};
    clearTimeout(audio.initTimeout);
  },

  playAudio: (event: MouseEvent) => {
    const button = event.currentTarget as HTMLButtonElement;
    const track = button.getAttribute(AUDIO_TRACK);
    if (track) {
      try {
        audio.tracks[track].play();
      } catch (error) {
        console.log(error);
      }
    }
  }
};
