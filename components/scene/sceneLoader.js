'use client';

import { useCallback, useEffect, useState } from "react";
import ThreeJsScene from "@/components/scene/threeScene";
import LoadingScreen from "@/components/loading/loadingScreen";

export default function SceneLoader() {
    const [progress, setProgress] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [showLoader, setShowLoader] = useState(true);

    const handleProgress = useCallback((percent) => {
        setProgress(percent);
    }, []);

    const handleLoaded = useCallback(() => {
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (!loaded) return;

        // Keep the overlay mounted long enough for the
        // fade-out transition (see loadingScreen.js) to
        // finish, then remove it from the DOM entirely.
        const timeout = setTimeout(() => {
            setShowLoader(false);
        }, 700);

        return () => clearTimeout(timeout);
    }, [loaded]);

    return (
        <>
            {showLoader && (
                <LoadingScreen progress={progress} loaded={loaded} />
            )}
            <ThreeJsScene
                onProgress={handleProgress}
                onLoaded={handleLoaded}
            />
        </>
    );
}
