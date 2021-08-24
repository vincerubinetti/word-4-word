const Loading = () => (
  <main className="flex justify-center flex-col items-center h-screen">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-50 -50 100 100"
      id="loading"
      className="w-20"
    >
      <style>
        {`
          #loading > .spinner {
            animation: rotate 1s linear forwards infinite;
          }
          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <path
        class="spinner"
        fill="none"
        stroke="currentColor"
        stroke-width="10"
        d="M -45 0 A 45 45 0 1 0 0 -45"
      />
    </svg>
    <div className="mt-20 text-center">This game may contain profanity 😳</div>
  </main>
);

export default Loading;
