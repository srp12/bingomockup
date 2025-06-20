document.addEventListener('DOMContentLoaded', () => {
    const lights = document.querySelectorAll('.light');
    const sideTab = document.getElementById('side-tab');
    const tabHandle = document.getElementById('tab-handle');
    const handleIcon = document.getElementById('handle-icon');
    const mainScreen = document.getElementById('main-screen');
    const timelineContainer = document.getElementById('timeline-container');
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const modalMetricsList = document.getElementById('modal-metrics-list');
    const modalChartContainer = document.getElementById('modal-chart-container');
    const tooltip = document.getElementById('tooltip');

    const biomarkers = {
        Heart: {
            unit: 'bpm',
            range: [50, 70],
            data: [
                { 
                    date: '2023-01-15', 
                    value: 75, 
                    evidence: 'Elevated heart rate, possibly due to holiday stress and lower physical activity. High resting heart rate can be a sign of poor cardiovascular fitness.',
                    metrics: [
                        { name: 'Resting Heart Rate', value: '75 bpm', source: 'Apple Health', confidence: 0.8, resultFile: 'data/heart/2023-01-15_apple_health.json' },
                        { name: 'HRV', value: '45 ms', source: 'Oura Ring', confidence: 0.9, resultFile: 'data/heart/2023-01-15_oura_ring.json' },
                        { name: 'Self-reported stress', value: 'High', source: 'Daily Journal', confidence: 0.5, resultFile: 'data/journal/2023-01-15.txt' }
                    ]
                },
                { date: '2023-02-20', value: 68, evidence: 'Heart rate improving with new exercise routine. Consistent cardio exercise strengthens the heart muscle.' },
                { date: '2023-03-25', value: 62, evidence: 'Optimal heart rate achieved. This is a good indicator of cardiovascular health and recovery.' },
                { date: '2023-04-10', value: 58, evidence: 'Consistently in the optimal range. The body is adapting well to the fitness regimen.' },
                { date: '2023-05-18', value: 78, evidence: 'Slight increase, possibly due to a period of poor sleep. Lack of sleep can put stress on the heart.' }
            ]
        },
        Brain: {
            unit: 'ms',
            range: [350, 450], // Lower is better
            data: [
                { 
                    date: '2023-01-20', 
                    value: 480, 
                    evidence: 'Slower cognitive processing speed, potentially linked to high stress levels.',
                    metrics: [
                        { name: 'Reaction Time', value: '480 ms', source: 'Cognitive Test App', confidence: 0.9, resultFile: 'data/brain/2023-01-20_cog_test.json' },
                        { name: 'Sleep Duration', value: '6.2 hours', source: 'Oura Ring', confidence: 0.9, resultFile: 'data/sleep/2023-01-20_oura_ring.json' }
                    ]
                },
                { date: '2023-02-25', value: 440, evidence: 'Improvement after incorporating mindfulness and getting more consistent sleep.' },
                { date: '2023-03-30', value: 410, evidence: 'Well within the optimal range. Mental acuity is high.' },
                { date: '2023-05-01', value: 380, evidence: 'Excellent processing speed. Neuro-protective habits like reading and puzzles are paying off.' }
            ]
        },
        Lungs: {
            unit: 'ml/kg/min',
            range: [45, 55],
            data: [
                { 
                    date: '2023-01-10', 
                    value: 42, 
                    evidence: 'Below optimal VO2 Max. Indicates need for more vigorous cardiovascular exercise to improve oxygen uptake.',
                    metrics: [
                        { name: 'VO2 Max Estimate', value: '42 ml/kg/min', source: 'Apple Watch', confidence: 0.75, resultFile: 'data/lungs/2023-01-10_apple_watch.json' }
                    ]
                },
                { date: '2023-02-15', value: 46, evidence: 'Improvement shown after incorporating high-intensity interval training (HIIT) twice a week.' },
                { date: '2023-03-20', value: 48, evidence: 'Entering the optimal range. The lungs and heart are becoming more efficient at using oxygen.' },
                { date: '2023-04-25', value: 52, evidence: 'Solidly in the optimal range. Represents excellent cardiorespiratory fitness.' },
                { date: '2023-05-22', value: 54, evidence: 'Continued improvement. This level of fitness is associated with a significantly lower risk of chronic disease.' }
            ]
        },
        Bone: {
            unit: 'T-score',
            range: [-1, 1],
            data: [
                { date: '2022-12-01', value: -1.2, evidence: 'Slightly low bone density (osteopenia). Increased calcium and vitamin D intake recommended.' },
                { date: '2023-03-05', value: -0.9, evidence: 'Improvement after dietary changes and incorporating weight-bearing exercise.' },
                { date: '2023-06-10', value: -0.5, evidence: 'Good progress, now within the optimal range.' }
            ]
        },
        Hydration: {
            unit: 'SG',
            range: [1.005, 1.015],
            data: [
                { date: '2023-05-01', value: 1.025, evidence: 'Likely dehydrated. Increase daily water intake.' },
                { date: '2023-05-08', value: 1.018, evidence: 'Better, but still on the higher side of optimal.' },
                { date: '2023-05-15', value: 1.012, evidence: 'Excellent hydration status. Maintain current fluid intake.' },
                { date: '2023-05-22', value: 1.008, evidence: 'Consistently well-hydrated.' }
            ]
        },
        Strength: {
            unit: 'kg',
            range: [45, 55], // Grip Strength
            data: [
                { date: '2023-01-05', value: 43, evidence: 'Below optimal grip strength. Indicates need for resistance training.' },
                { date: '2023-03-01', value: 48, evidence: 'Significant improvement after starting a consistent strength training program.' },
                { date: '2023-05-10', value: 52, evidence: 'Excellent strength gains, well within the optimal range for age.' }
            ]
        },
        Sleep: {
            unit: 'score',
            range: [85, 100],
            data: [
                { 
                    date: '2023-04-20', 
                    value: 78, 
                    evidence: 'Sleep quality is suboptimal. Review sleep hygiene practices.',
                    metrics: [
                        { name: 'Sleep Score', value: '78', source: 'Oura Ring', confidence: 0.9, resultFile: 'data/sleep/2023-04-20_oura_ring.json' },
                        { name: 'Time in Deep Sleep', value: '55 min', source: 'Oura Ring', confidence: 0.85, resultFile: 'data/sleep/2023-04-20_oura_ring.json' },
                        { name: 'Time in REM Sleep', value: '90 min', source: 'Oura Ring', confidence: 0.85, resultFile: 'data/sleep/2023-04-20_oura_ring.json' }
                    ]
                },
                { date: '2023-04-27', value: 82, evidence: 'Improvement after reducing screen time before bed.' },
                { date: '2023-05-04', value: 88, evidence: 'Good sleep score. The body is getting adequate rest and recovery.' },
                { date: '2023-05-11', value: 92, evidence: 'Excellent and consistent sleep quality.' }
            ]
        },
        Immunity: {
            unit: 'mg/L', // hs-CRP
            range: [0, 1.0],
            data: [
                { date: '2023-01-18', value: 2.5, evidence: 'Elevated hs-CRP, indicating inflammation. May be due to recent illness or high stress.' },
                { date: '2023-03-12', value: 1.2, evidence: 'Inflammation markers are decreasing. Anti-inflammatory diet may be helping.' },
                { date: '2023-05-20', value: 3.1, evidence: 'Elevated hs-CRP, indicating significant inflammation. Requires medical consultation.' }
            ]
        },
        'Cancer Risk': {
            unit: '10-Year Risk %',
            range: [0, 15], // Tyrer-Cuzick model: <15% is average risk
            data: [
                { date: '2023-01-01', value: 12, evidence: 'Initial assessment places risk in the average category.' },
                { date: '2023-06-01', value: 22, evidence: 'Risk elevated to high-risk category based on new health data. Annual screening with breast MRI and mammography is recommended.' }
            ]
        }
    };

    let selectedLights = new Set();

    function drawBellCurve(metrics, container) {
        container.innerHTML = ''; // Clear previous chart
    
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 280 - margin.left - margin.right;
        const height = 150 - margin.top - margin.bottom;
    
        const svg = d3.select(container).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
    
        // Bell curve data generator
        function bellCurve(mean, stdDev) {
            let points = [];
            for (let i = -3; i <= 3; i += 0.1) {
                let x = mean + i * stdDev;
                let y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
                points.push({x: x, y: y});
            }
            return points;
        }
    
        // For simplicity, we'll just draw one representative curve
        // In a real scenario, you might average confidence or show multiple curves
        const overallConfidence = metrics.reduce((acc, m) => acc + m.confidence, 0) / metrics.length;
        
        // Let's map confidence (0-1) to a standard deviation. Higher confidence = smaller std dev.
        const stdDev = (1.2 - overallConfidence) * 0.8; // Heuristic mapping
        const mean = 0; // Center the curve
    
        const data = bellCurve(mean, stdDev);
    
        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.x))
            .range([0, width]);
    
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.y)])
            .range([height, 0]);
    
        const line = d3.line()
            .x(d => x(d.x))
            .y(d => y(d.y))
            .curve(d3.curveBasis);
    
        svg.append("path")
          .datum(data)
          .attr("fill", "rgba(92, 184, 92, 0.3)")
          .attr("stroke", "#5cb85c")
          .attr("stroke-width", 1.5)
          .attr("d", line);
    
        svg.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x).ticks(3).tickFormat(d => d === 0 ? "Avg" : ""));
    
        // Add a title for the chart
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "#E0E0E0")
            .text(`Overall Data Confidence`);
    
    }

    function getLightColor(biomarkerName) {
        const biomarker = biomarkers[biomarkerName];
        if (!biomarker || !biomarker.data || biomarker.data.length === 0) {
            return '#333'; // Default color for no data
        }

        const latestData = biomarker.data[biomarker.data.length - 1];
        const value = latestData.value;
        const [min, max] = biomarker.range;
        const span = max - min;
        const yellowThreshold = 0.5 * span; // 50% of the range span for yellow

        if (value >= min && value <= max) {
            return '#5cb85c'; // Green
        } else if (
            (value >= min - yellowThreshold && value < min) ||
            (value > max && value <= max + yellowThreshold)
        ) {
            return '#f0ad4e'; // Yellow
        } else {
            return '#d9534f'; // Red
        }
    }

    tabHandle.addEventListener('click', () => {
        sideTab.classList.toggle('open');
        if (sideTab.classList.contains('open')) {
            handleIcon.classList.remove('fa-chevron-right');
            handleIcon.classList.add('fa-chevron-left');
        } else {
            handleIcon.classList.remove('fa-chevron-left');
            handleIcon.classList.add('fa-chevron-right');
        }
    });

    lights.forEach(light => {
        const biomarkerName = light.dataset.name;
        if (biomarkerName && biomarkers[biomarkerName]) {
            const color = getLightColor(biomarkerName);
            light.style.setProperty('--light-color', color);
            light.dataset.color = color;
        }

        let pressTimer;
        let isLongPress = false;

        const showTooltip = (e) => {
            const lightElement = e.currentTarget || e.target;
            const name = lightElement.dataset.name;
            tooltip.textContent = name;
            
            const rect = lightElement.getBoundingClientRect();
            const sideTabRect = sideTab.getBoundingClientRect();
            tooltip.style.top = `${rect.top + rect.height / 2}px`;
            tooltip.style.left = `${sideTabRect.right + 10}px`;
            
            tooltip.classList.add('visible');
        };

        const hideTooltip = () => {
            tooltip.classList.remove('visible');
        };

        const handleMouseDown = (e) => {
            isLongPress = false;
            pressTimer = window.setTimeout(() => {
                isLongPress = true;
                showTooltip(e);
            }, 500);
        };
        
        const handleMouseUp = (e) => {
            clearTimeout(pressTimer);
            if(isLongPress) {
                // Use a slight delay to prevent the click event from firing on mobile after a long press
                setTimeout(hideTooltip, 100);
            }
        };

        const handleClick = (e) => {
            if (isLongPress) {
                e.preventDefault();
                return;
            }

            const lightElement = e.currentTarget;

            if (lightElement.classList.contains('disabled')) {
                modalTitle.textContent = "Premium Feature";
                modalText.innerHTML = "Your current plan doesn't contain results from the required assessments to activate this light.<br/><br/>Schedule a consult with your coach to learn more.";
                modal.classList.remove('hidden');
                return;
            }

            const lightName = lightElement.dataset.name;
            lightElement.classList.toggle('selected');

            if (selectedLights.has(lightName)) {
                selectedLights.delete(lightName);
            } else {
                selectedLights.add(lightName);
            }
            
            if (selectedLights.size > 0) {
                 mainScreen.classList.add('hidden');
                 drawTimeline();
            } else {
                mainScreen.classList.remove('hidden');
                timelineContainer.innerHTML = '';
            }
        };

        // Desktop
        light.addEventListener('mouseenter', showTooltip);
        light.addEventListener('mouseleave', hideTooltip);

        // Mobile
        light.addEventListener('touchstart', handleMouseDown, { passive: true });
        light.addEventListener('touchend', handleMouseUp);
        light.addEventListener('touchcancel', handleMouseUp);
        
        // Universal Click
        light.addEventListener('click', handleClick);
    });

    function drawTimeline() {
        timelineContainer.innerHTML = '';

        const containerRect = timelineContainer.getBoundingClientRect();
        const isMobile = containerRect.width < 768;

        const margin = { 
            top: 40, 
            right: isMobile ? 40 : 80, 
            bottom: 40, 
            left: isMobile ? 40 : 80 
        };

        const width = containerRect.width - margin.left - margin.right;
        const height = containerRect.height - margin.top - margin.bottom;

        if (width <= 0 || height <= 0) return;

        const svg = d3.select("#timeline-container").append("svg")
            .attr("width", containerRect.width)
            .attr("height", containerRect.height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear().domain([0, 2]).range([0, width]);
        const xAxis = d3.axisBottom(x)
            .tickValues([0, 1, 2])
            .tickFormat(d => ["Below Range", "Optimal", "Above Range"][d]);
        
        const xAxisGroup = svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .attr("color", "#E0E0E0")
            .style("font-size", isMobile ? "10px" : "12px");
        
        xAxisGroup.selectAll(".tick text")
            .style("text-anchor", d => {
                if (d === 0) return "start";
                if (d === 1) return "middle";
                if (d === 2) return "end";
            });

        xAxisGroup.select(".domain").remove();
        xAxisGroup.selectAll(".tick line").remove();

        let allDates = [];
        selectedLights.forEach(lightName => {
            const biomarker = biomarkers[lightName];
            if (biomarker && biomarker.data) {
                biomarker.data.forEach(d => allDates.push(new Date(d.date)));
            }
        });

        if (allDates.length === 0) return;

        const y = d3.scaleTime().domain(d3.extent(allDates)).range([0, height]);
        const yAxisGroup = svg.append("g").call(d3.axisLeft(y).ticks(0));
        yAxisGroup.select(".domain").remove();

        selectedLights.forEach(lightName => {
            const biomarker = biomarkers[lightName];
            const color = document.querySelector(`.light[data-name="${lightName}"]`).dataset.color;
            if (!biomarker || !biomarker.data) return;

            const lineData = biomarker.data.map(d => {
                let xPos;
                if (d.value < biomarker.range[0]) {
                    const lowerBound = d3.min(biomarker.data, d => d.value);
                    const rangeMin = biomarker.range[0];
                    const extent = Math.max(rangeMin - lowerBound, rangeMin * 0.2);
                    xPos = d3.scaleLinear().domain([rangeMin - extent, rangeMin]).range([0, width / 3])(d.value);
                } else if (d.value > biomarker.range[1]) {
                    const upperBound = d3.max(biomarker.data, d => d.value);
                    const rangeMax = biomarker.range[1];
                    const extent = Math.max(upperBound - rangeMax, rangeMax * 0.2);
                    xPos = d3.scaleLinear().domain([rangeMax, rangeMax + extent]).range([2 * width / 3, width])(d.value);
                } else {
                    xPos = d3.scaleLinear().domain(biomarker.range).range([width / 3, 2 * width / 3])(d.value);
                }
                return { x: xPos, y: y(new Date(d.date)), original: d };
            });

            const initialLineData = lineData.map(d => ({ x: width / 2, y: d.y, original: d.original }));

            const lineGenerator = d3.line().curve(d3.curveBasis).x(d => d.x).y(d => d.y);

            const path = svg.append("path")
                .datum(lineData)
                .attr("fill", "none")
                .attr("stroke", color)
                .attr("stroke-width", 4)
                .attr("d", lineGenerator(initialLineData));

            path.transition()
                .duration(1500)
                .ease(d3.easeCubicOut)
                .attr("d", lineGenerator);

            const latestPoint = lineData[lineData.length - 1];
            if (latestPoint) {
                const isNearRightEdge = latestPoint.x > width - 60; // 60px buffer
                const labelX = isNearRightEdge ? latestPoint.x - 10 : latestPoint.x + 10;
                const textAnchor = isNearRightEdge ? "end" : "start";

                svg.append("text")
                    .attr("x", width / 2 + 10)
                    .attr("y", latestPoint.y)
                    .attr("dy", "0.35em")
                    .attr("text-anchor", textAnchor)
                    .text("Latest")
                    .attr("fill", "#E0E0E0")
                    .style("font-size", isMobile ? "10px" : "12px")
                    .style("font-style", "italic")
                    .attr("opacity", 0)
                    .transition()
                    .duration(1500)
                    .ease(d3.easeCubicOut)
                    .attr("x", labelX)
                    .attr("opacity", 1);
            }

            svg.selectAll(`.${lightName}-dot`)
                .data(lineData)
                .enter().append("circle")
                .attr("class", `${lightName}-dot`)
                .attr("cx", width / 2)
                .attr("cy", d => d.y)
                .attr("r", 5)
                .attr("fill", (d, i) => i === lineData.length - 1 ? color : "#121212")
                .attr("stroke", color)
                .attr("stroke-width", 2)
                .attr("opacity", 0)
                .on("click", (event, d) => {
                    modalTitle.textContent = `${lightName} Reading: ${d.original.value} ${biomarkers[lightName].unit}`;
                    modalText.innerHTML = `<b>Date:</b> ${d.original.date}<br/><b>Evidence:</b> ${d.original.evidence}<br/><br/><hr><p style="font-size:12px; color:#757575;"><b>Disclaimer:</b> The "optimal" range shown is a general guideline. Individual optimal ranges may vary based on age, sex, genetics, diet, location, and other lifestyle factors. Consult with a healthcare professional for personalized advice.</p>`;
                    
                    // Clear previous metrics and chart
                    modalMetricsList.innerHTML = '';
                    modalChartContainer.innerHTML = '';

                    if (d.original.metrics && d.original.metrics.length > 0) {
                        d.original.metrics.forEach(metric => {
                            const li = document.createElement('li');
                            li.innerHTML = `<b>${metric.name}:</b> ${metric.value} (<i>Source: ${metric.source}</i>) - <a href="${metric.resultFile}" target="_blank">Raw Data</a>`;
                            modalMetricsList.appendChild(li);
                        });
                        
                        drawBellCurve(d.original.metrics, modalChartContainer);
                    }

                    modal.classList.remove('hidden');
                })
                .transition()
                .duration(1500)
                .ease(d3.easeCubicOut)
                .attr("cx", d => d.x)
                .attr("opacity", 1);
        });
    }

    modalClose.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.classList.add('hidden');
        }
    });

    window.addEventListener('resize', () => {
        if (selectedLights.size > 0) {
            drawTimeline();
        }
    });
}); 