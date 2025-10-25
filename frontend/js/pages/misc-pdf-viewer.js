/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Misc PDF Viewer
 */
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/plugins/pdf.worker.min.js';

const url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.5;
const zoomRange = 0.25;

const canvas = document.getElementById("the-canvas");
const ctx = canvas.getContext("2d");
const pageCountEl = document.getElementById("page_count");
const pageNumInput = document.getElementById("page_num");


// Render the current page
function renderPage(num) {
    pageRendering = true;

    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({scale});
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: ctx,
            viewport
        };

        const renderTask = page.render(renderContext);

        renderTask.promise.then(() => {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    }).catch(err => {
        console.error(`Error rendering page ${num}:`, err);
    });

    pageNumInput.value = num;
}


// Queue page rendering if another is already in progress
function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}


// Navigate to the previous page
function onPrevPage() {
    if (pageNum > 1) {
        pageNum--;
        queueRenderPage(pageNum);
    }
}

const prevButton = document.getElementById('prev')
if (prevButton) {
    prevButton.addEventListener('click', onPrevPage);
}


// Navigate to the next page
function onNextPage() {
    if (pageNum < pdfDoc.numPages) {
        pageNum++;
        queueRenderPage(pageNum);
    }
}

const nextButton = document.getElementById('next')
if (nextButton) {
    nextButton.addEventListener('click', onNextPage);
}


// Zoom in
function onZoomIn() {
    scale += zoomRange;
    queueRenderPage(pageNum);
}

const zoomInButton = document.getElementById('zoomin')
if (zoomInButton) {
    zoomInButton.addEventListener('click', onZoomIn);
}


// Zoom out
function onZoomOut() {
    if (scale > zoomRange) {
        scale -= zoomRange;
        queueRenderPage(pageNum);
    }
}

const zoomOutButton = document.getElementById('zoomout')
if (zoomOutButton) {
    zoomOutButton.addEventListener('click', onZoomOut);
}


// Reset zoom to default
function onZoomFit() {
    scale = 1;
    queueRenderPage(pageNum);
}

const zoomFitButton = document.getElementById('zoomfit')
if (zoomFitButton) {
    zoomFitButton.addEventListener('click', onZoomFit);
}


// Validate and go to page number from input
function onPageInputChange(e) {
    const value = Number(e.target.value);
    if (value >= 1 && value <= pdfDoc.numPages) {
        pageNum = value;
        queueRenderPage(pageNum);
    } else {
        e.target.value = pageNum;
    }
}

pageNumInput.addEventListener("change", onPageInputChange);


// Initialize PDF Viewer
function initPDFViewer(pdfUrl) {
    if (typeof pdfjsLib === 'undefined' || typeof pdfjsLib.getDocument !== 'function') {
        console.error("PDF.js is not available or not loaded.");
        return;
    }

    if (!pdfUrl || typeof pdfUrl !== 'string') {
        console.error("Invalid PDF URL:", pdfUrl);
        return;
    }

    pdfjsLib.getDocument(pdfUrl).promise.then(doc => {
        pdfDoc = doc;
        pageCountEl.textContent = `/ ${pdfDoc.numPages}`;
        renderPage(pageNum);
    }).catch(err => {
        console.error("Failed to load PDF:", err);
        alert("Error loading PDF document.");
    });
}

initPDFViewer(url)