'use client';

export default function LoadingScreen({ progress = 0, loaded = false }) {
    return (
        <div
            className={`h-screen w-full text-center min-h-screen flex flex-col items-center justify-center fixed inset-0 z-[50000] bg-black transition-opacity duration-700 ease-in-out ${
                loaded
                    ? "opacity-0 pointer-events-none"
                    : "opacity-100"
            }`}
        >
            <div className="max-w-[650px] text-white">
                <h2 className="uppercase">Loading</h2>
                <div className="h-[2px] w-full my-2 bg-stone-200 relative overflow-hidden">
                    <div
                        className="h-full bg-white transition-all duration-200 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div>{progress}%</div>
            </div>
        </div>
    );
}
