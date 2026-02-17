import styled from "styled-components";
import { FaChessKing } from "react-icons/fa";

const Loader = ({ isVisible = true }: { isVisible?: boolean }) => {
  return (
    <StyledWrapper className={isVisible ? "" : "fade-out"}>
      <div className="bg-glow" />
      <div className="bg-gradient" />
      <div className="loader-container">
        <div className="loader">
          <div className="box">
            <div className="logo">
              <FaChessKing className="chess-king" />
            </div>
          </div>
          <div className="box" />
          <div className="box" />
          <div className="box" />
          <div className="box" />
        </div>
        <p className="loading-text">Loading 3D Chess Pro...</p>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #020617;
  z-index: 9999;
  transition:
    opacity 0.8s ease-in-out,
    visibility 0.8s;
  overflow: hidden;

  &.fade-out {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  .bg-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at top left,
      rgba(59, 130, 246, 0.1),
      transparent 70%
    );
    pointer-events: none;
  }

  .bg-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(2, 6, 23, 0.4) 50%,
      #020617 100%
    );
    pointer-events: none;
  }

  .loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }

  .loading-text {
    color: white;
    font-family: "Outfit", sans-serif;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4em;
    opacity: 0.6;
    animation: pulse 2s infinite ease-in-out;
  }

  .loader {
    --size: 180px;
    --duration: 2s;
    --logo-color: rgba(255, 255, 255, 0.2);
    --background: linear-gradient(
      0deg,
      rgba(59, 130, 246, 0.05) 0%,
      rgba(139, 92, 246, 0.05) 100%
    );
    height: var(--size);
    aspect-ratio: 1;
    position: relative;
  }

  .loader .box {
    position: absolute;
    background: var(--background);
    border-radius: 40px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: rgba(0, 0, 0, 0.5) 0px 15px 25px -5px;
    backdrop-filter: blur(10px);
    animation: ripple var(--duration) infinite ease-in-out;
  }

  .loader .box:nth-child(1) {
    inset: 35%;
    z-index: 99;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .loader .box:nth-child(2) {
    inset: 25%;
    z-index: 98;
    animation-delay: 0.2s;
  }

  .loader .box:nth-child(3) {
    inset: 15%;
    z-index: 97;
    animation-delay: 0.4s;
  }

  .loader .box:nth-child(4) {
    inset: 5%;
    z-index: 96;
    animation-delay: 0.6s;
  }

  .loader .box:nth-child(5) {
    inset: -5%;
    z-index: 95;
    animation-delay: 0.8s;
  }

  .loader .logo {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loader .chess-king {
    font-size: 32px;
    color: white;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
    animation: king-bounce var(--duration) infinite ease-in-out;
  }

  @keyframes ripple {
    0%,
    100% {
      transform: scale(1) translateY(0);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.1) translateY(-10px);
      opacity: 1;
    }
  }

  @keyframes king-bounce {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.8;
    }
  }
`;

export default Loader;
