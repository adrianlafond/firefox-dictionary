class PronunciationAudio {
  private tracks: { [key: string]: HTMLAudioElement } = {};

  private disabled = false;

  constructor(private panel: HTMLElement) {}

  initialize() {
    this.destroy();
    if (this.disabled) {
      this.disableButtons();
    } else {
      document.addEventListener('securitypolicyviolation', this.handleSecurityPolicyViolation);
      this.traverseButtons((button: HTMLButtonElement) => {
        const track = button.getAttribute(AUDIO_TRACK);
        if (track) {
          this.tracks[track] = new Audio(track);
          button.addEventListener('click', this.playAudio);
        }
      });
    }
  }

  destroy() {
    this.traverseButtons((button: HTMLButtonElement) => button.removeEventListener('click', this.playAudio));
    this.tracks = {};
    document.removeEventListener('securitypolicyviolation', this.handleSecurityPolicyViolation);
  }

  private traverseButtons(func: (button: HTMLButtonElement) => void) {
    const buttons = this.panel.querySelectorAll(`button[${AUDIO_TRACK}]`);
    for (let i = 0; i < buttons.length; i++) {
      func(buttons[i] as HTMLButtonElement);
    }
  }

  private disableButtons() {
    this.traverseButtons((button: HTMLButtonElement) => button.disabled = true);
    this.destroy();
  }

  private showCspWarning() {
    const warning = this.panel.querySelector(`.${BLOCK}__csp`);
    if (warning) {
      warning.classList.add(`${BLOCK}__csp--shown`);
    }
  }

  private handleSecurityPolicyViolation = (event: SecurityPolicyViolationEvent) => {
    if(event.blockedURI && event.blockedURI.endsWith('.mp3')) {
      this.disabled = true;
      this.showCspWarning();
      this.disableButtons();
    }
  }

  private playAudio = (event: MouseEvent) => {
    const button = event.currentTarget as HTMLButtonElement;
    const track = button.getAttribute(AUDIO_TRACK);
    if (track && this.tracks[track]) {
      this.tracks[track].play();
    }
  }
}
