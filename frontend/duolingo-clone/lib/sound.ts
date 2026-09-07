/** Tiny sound-effect player for Duolingo SFX (preloaded, replayable). */

const sounds: Record<string, HTMLAudioElement> = {};

export function playSound(src: string): void {
  let audio = sounds[src];
  if (!audio) {
    audio = new Audio(src);
    sounds[src] = audio;
  }
  audio.currentTime = 0;
  void audio.play().catch(() => {
    /* autoplay blocked until first user gesture — answer clicks count */
  });
}
