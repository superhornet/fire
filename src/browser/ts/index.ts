import { Fire } from './Fire.ts';

(() => {
    const fire = new Fire();
    setInterval(() => {
        fire.animate();
    }, 1000 / 60);
    // console.log(fire.colors);

    document.body.onkeyup = (e: KeyboardEvent) => {
        if (e.key === undefined) {
            throw new TypeError('Invalid Key.');
        }
        if (e.key >= '0' && e.key <= '9') {
            const cp = e.key.codePointAt(0) || 0;
            fire.intensity = cp - 48;
            fire.intensity /= 8;
            fire.intensity *= 0.4;
            fire.intensity += 0.2;
            fire.threshold = 1 - fire.intensity;
        } else {
            fire.intensity = 0;
            fire.randomizeThreshold();
        }

        console.log(
            `Threshold: ${fire.threshold} Intensity: ${fire.intensity}`
            //`KeyboardCode.code: ${e.code} ${e.key} ${e.key.codePointAt(0)}`
        );
    };
})();
