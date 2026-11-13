(function animateFavicon() {
    const FRAME_COUNT = 94;
    const FRAME_INTERVAL_MS = 40; // ~25 fps

    // 1. Grab the current working favicon link tag that Jekyll successfully built
    const initialFavicon = document.getElementById('animated-favicon');
    if (!initialFavicon) return;

    // 2. Extract the base folder path (cleans out the filename, preserves domain/subfolders)
    const currentHref = initialFavicon.href;
    const baseDir = currentHref.substring(0, currentHref.lastIndexOf('/') + 1);

    // 3. Build the absolute paths array for all 94 frames
    const frameUrls = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
        frameUrls.push(`${baseDir}j_${i}.gif`);
    }

    // 4. Preload all the frames into browser memory so the swap doesn't flicker
    frameUrls.forEach(src => { 
        const img = new Image(); 
        img.src = src; 
    });

    let frameIndex = 0;

    // 5. Loop engine
    setInterval(() => {
        const link = document.getElementById('animated-favicon');
        if (link) {
            link.href = frameUrls[frameIndex];
        }
        frameIndex = (frameIndex + 1) % FRAME_COUNT;
    }, FRAME_INTERVAL_MS);
})();
