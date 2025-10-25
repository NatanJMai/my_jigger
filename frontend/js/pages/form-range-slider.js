/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Form Range Slider
 */
import noUiSlider from 'nouislider'

function createSlider(el, options, height) {
    if (el && typeof noUiSlider !== 'undefined') {
        if (height) el.style.height = height;
        noUiSlider.create(el, options);
    }
}

function createSliderGroup(selector, optionsFactory) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
        elements.forEach(el => {
            const options = typeof optionsFactory === 'function' ? optionsFactory(el) : optionsFactory;
            createSlider(el, options)
        });
    }
}

//  Basic
createSliderGroup('[data-slider="default"]', (el => ({
    start: parseInt(el.getAttribute('data-value')) || 50,
    connect: 'lower',
    range: {min: 0, max: 255}
})));


// Multi range handle
createSliderGroup('#rangeslider_multielement', {
    start: [20, 80],
    connect: true,
    range: {min: 0, max: 100}
});


//  Non linear slider
const nonLinearSlider = document.getElementById('nonlinear');
if (nonLinearSlider) {
    const lowerValue = document.getElementById('lower-value');
    const upperValue = document.getElementById('upper-value');

    createSlider(nonLinearSlider, {
        connect: true,
        behaviour: 'tap',
        start: [500, 4000],
        range: {
            'min': [0],
            '10%': [500, 500],
            '50%': [4000, 1000],
            'max': [10000]
        }
    });

    if (lowerValue && upperValue) {
        nonLinearSlider.noUiSlider.on('update', (values, handle, _, __, positions) => {
            const targets = [lowerValue, upperValue];
            targets[handle].innerHTML = `${values[handle]}, ${positions[handle].toFixed(2)}%`;
        });
    }
}


// Locked Sliders
let lockedState = false;
let lockedValues = [60, 80];

const slider1 = document.getElementById('slider1');
const slider2 = document.getElementById('slider2');
const lockButton = document.getElementById('lockbutton');
const slider1Value = document.getElementById('slider1-span');
const slider2Value = document.getElementById('slider2-span');

if (slider1 && slider2) {
    createSlider(slider1, {
        start: 60,
        animate: false,
        range: { min: 50, max: 100 }
    });

    createSlider(slider2, {
        start: 80,
        animate: false,
        range: { min: 50, max: 100 }
    });

    function crossUpdate(value, slider) {
        if (!lockedState) return;
        const a = slider1 === slider ? 0 : 1;
        const b = 1 - a;
        value -= lockedValues[b] - lockedValues[a];
        slider.noUiSlider.set(value);
    }

    function setLockedValues() {
        lockedValues = [Number(slider1.noUiSlider.get()), Number(slider2.noUiSlider.get())];
    }

    slider1.noUiSlider.on('update', (values, handle) => slider1Value.innerHTML = values[handle]);
    slider2.noUiSlider.on('update', (values, handle) => slider2Value.innerHTML = values[handle]);
    slider1.noUiSlider.on('change', setLockedValues);
    slider2.noUiSlider.on('change', setLockedValues);
    slider1.noUiSlider.on('slide', (values, handle) => crossUpdate(values[handle], slider2));
    slider2.noUiSlider.on('slide', (values, handle) => crossUpdate(values[handle], slider1));

    if (lockButton) {
        lockButton.addEventListener('click', () => {
            lockedState = !lockedState;
            lockButton.innerHTML = lockedState
                ? '<i class="ti ti-lock-off me-1"></i> Unlock'
                : '<i class="ti ti-lock me-1"></i> Lock';
        });
    }
}


// Tooltip merge slider
const mergingTooltipSlider = document.getElementById('slider-merging-tooltips');
if (mergingTooltipSlider) {
    createSlider(mergingTooltipSlider, {
        start: [20, 75],
        connect: true,
        tooltips: [true, true],
        range: { min: 0, max: 100 }
    });
    mergeTooltips(mergingTooltipSlider, 5, ' - ');
}

function mergeTooltips(slider, threshold, separator) {
    if (!slider || !slider.noUiSlider) return;

    const textIsRtl = getComputedStyle(slider).direction === 'rtl';
    const isRtl = slider.noUiSlider.options.direction === 'rtl';
    const isVertical = slider.noUiSlider.options.orientation === 'vertical';
    const tooltips = slider.noUiSlider.getTooltips();
    const origins = slider.noUiSlider.getOrigins();

    tooltips.forEach((tooltip, index) => {
        if (tooltip) origins[index].appendChild(tooltip);
    });

    slider.noUiSlider.on('update', (values, _, __, ___, positions) => {
        const pools = [[]], poolPositions = [[]], poolValues = [[]];
        let atPool = 0;

        if (tooltips[0]) {
            pools[0][0] = 0;
            poolPositions[0][0] = positions[0];
            poolValues[0][0] = values[0];
        }

        for (let i = 1; i < positions.length; i++) {
            if (!tooltips[i] || (positions[i] - positions[i - 1]) > threshold) {
                atPool++;
                pools[atPool] = [];
                poolValues[atPool] = [];
                poolPositions[atPool] = [];
            }
            if (tooltips[i]) {
                pools[atPool].push(i);
                poolValues[atPool].push(values[i]);
                poolPositions[atPool].push(positions[i]);
            }
        }

        pools.forEach((pool, poolIndex) => {
            const count = pool.length;
            pool.forEach((handleNumber, j) => {
                if (j === count - 1) {
                    const last = isRtl ? 0 : count - 1;
                    let offset = poolPositions[poolIndex].reduce((acc, val) => acc + 1000 - val, 0);
                    const lastOffset = 1000 - poolPositions[poolIndex][last];
                    const direction = isVertical ? 'bottom' : 'right';
                    offset = (textIsRtl && !isVertical ? 100 : 0) + (offset / count) - lastOffset;

                    tooltips[handleNumber].innerHTML = poolValues[poolIndex].join(separator);
                    tooltips[handleNumber].style.display = 'block';
                    tooltips[handleNumber].style[direction] = offset + '%';
                } else {
                    tooltips[handleNumber].style.display = 'none';
                }
            });
        });
    });
}


// Soft limit slider
const softSlider = document.getElementById('soft');
if (softSlider) {
    createSlider(softSlider, {
        start: 50,
        range: { min: 0, max: 100 },
        pips: {
            mode: 'values',
            values: [20, 80],
            density: 4
        }
    });

    softSlider.noUiSlider.on('change', (values, handle) => {
        if (values[handle] < 20) softSlider.noUiSlider.set(20);
        else if (values[handle] > 80) softSlider.noUiSlider.set(80);
    });
}


// Vertical
createSliderGroup('#slider-vertical', {
    start: [40, 60],
    connect: true,
    behaviour: 'drag',
    orientation: "vertical",
    range: { min: 0, max: 100 }
});

createSlider(document.getElementById('slider-connect-upper'), {
    start:40,
    orientation: 'vertical',
    behaviour: 'drag',
    connect: 'upper',
    range: { min: 0, max: 100 }
}, '200px');

createSlider(document.getElementById('slider-vertical-tooltip'), {
    start: 10,
    orientation: 'vertical',
    behaviour: 'drag',
    tooltips: true,
    range: { min: 0, max: 100 }
}, '200px');

createSlider(document.getElementById('slider-vertical-limit'), {
    start: [0, 40],
    orientation: 'vertical',
    behaviour: 'drag',
    limit: 60,
    connect: true,
    tooltips: true,
    range: { min: 0, max: 100 }
}, '200px');
