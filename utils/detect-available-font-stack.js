var FontStackDetector = function () {
    function detect(fonts) {
        let availableFonts = [];

        for (const font of fonts) {
            const detector = new FontDetector();

            if (detector.detect(font)) {
                availableFonts.push(font);
            }
        }

        return availableFonts;
    }

    this.detect = detect;
};

// Expose to global scope
window.FontStackDetector = FontStackDetector;