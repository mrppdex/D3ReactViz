import React from 'react';

const SaveSVGButton = ({ svgSelector }) => {
    
    const saveSVG = () => {
        const svgElement = document.querySelector(svgSelector);
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([svgData], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "chart.svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <button onClick={saveSVG}>Save SVG</button>
    );
}

export default SaveSVGButton;