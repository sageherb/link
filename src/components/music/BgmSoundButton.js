import { useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { ReactComponent as Sound } from "../../assets/icon/Sound.svg";
import { ReactComponent as SoundOff } from "../../assets/icon/SoundOff.svg";
import stageBGM from "../../assets/music/stageBGM.mp3";

export default function BgmSoundButton({
  isBGMOn,
  handleToggleBackgroundSoundButtonClick,
}) {
  const audioRef = useRef(null);

  // Create one persistent <audio> element on mount, tear it down on unmount.
  // Using an HTMLAudioElement (not THREE.Audio) keeps pause() synchronous, so
  // there is no async "load-then-play" callback that can resume an orphaned
  // instance after cleanup — which is what caused the double-audio bug under
  // React StrictMode's mount/cleanup/remount cycle.
  useEffect(() => {
    const audio = new Audio(stageBGM);
    audio.loop = true;
    audio.volume = 0.1;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Drive that single element from the toggle state.
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return undefined;
    }

    if (isBGMOn) {
      audio.play().catch(() => {
        // Browsers block autoplay until the first user gesture; ignore.
      });
    } else {
      audio.pause();
    }

    return undefined;
  }, [isBGMOn]);

  return isBGMOn ? (
    <BgSoundOnButton
      type="button"
      onClick={handleToggleBackgroundSoundButtonClick}
    />
  ) : (
    <BgSoundOffButton
      type="button"
      onClick={handleToggleBackgroundSoundButtonClick}
    />
  );
}

const BgSoundOnButton = styled(Sound)`
  z-index: 999;
  position: absolute;
  cursor: pointer;
  top: 7.7vh;
  right: 15vw;
`;

const BgSoundOffButton = styled(SoundOff)`
  z-index: 999;
  position: absolute;
  cursor: pointer;
  top: 7.7vh;
  right: 15vw;
`;

BgmSoundButton.propTypes = {
  isBGMOn: PropTypes.bool.isRequired,
  handleToggleBackgroundSoundButtonClick: PropTypes.func.isRequired,
};
