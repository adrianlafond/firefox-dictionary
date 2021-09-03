const audio: any = {
  tracks: {},

  init(panel: HTMLElement) {
    audio.destroy(panel);
    const audioButtons = panel.querySelectorAll('button[data-audio]');
    for (let i = 0; i < audioButtons.length; i++) {
      const track = audioButtons[i].getAttribute(AUDIO_TRACK);
      if (track) {
        audioButtons[i].addEventListener('click', audio.playAudio);
        audio.tracks[track] = new Audio(track);
      }
    }
  },

  destroy(panel: HTMLElement) {
    const audioButtons = panel.querySelectorAll('button[data-audio]');
    for (let i = 0; i < audioButtons.length; i++) {
      audioButtons[i].removeEventListener('click', audio.playAudio);
    }
    audio.tracks = {};
  },

  playAudio: (event: MouseEvent) => {
    const button = event.target as HTMLButtonElement;
    const track = button.getAttribute(AUDIO_TRACK);
    if (track) {
      //
    }
  }
};
