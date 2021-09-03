const audio: any = {
  tracks: {},
  initTimeout: 0,

  init(panel: HTMLElement) {
    audio.destroy(panel);
    audio.initTimeout = setTimeout(() => {
      const audioButtons = panel.querySelectorAll(`button[${AUDIO_TRACK}]`);
      console.log(`button[${AUDIO_TRACK}]`);
      console.log(audioButtons);
      for (let i = 0; i < audioButtons.length; i++) {
        const button = audioButtons[i] as HTMLButtonElement;
        const track = button.getAttribute(AUDIO_TRACK);
        if (track) {
          // const htmlAudio = new Audio(track);
          audio.tracks[track] = new Audio(track);
          // audio: htmlAudio,
          // button,
          // canPlay: () => {
          //   button.removeAttribute('disabled');
          // },
          // play: () => {
          //   htmlAudio.play();
          // }
          // };
          // audio.tracks[track].addEventListener('canplaythrough',
          //   audio.tracks[track].canPlay);
          button.addEventListener('click', audio.playAudio);
          console.log(track);
        }
      }
    }, 0);
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
    const button = event.target as HTMLButtonElement;
    const track = button.getAttribute(AUDIO_TRACK);
    if (track) {
      audio.tracks[track].play();
    }
  }
};
