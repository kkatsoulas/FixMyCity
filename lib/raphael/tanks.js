
function loadTankData() {
    $.when(
        $.getJSON("../../Data/Get/gtanks,it.additive=false"),
        $.getJSON("../../Data/Get/products"),
        $.getJSON("../../Data/Get/colors")
    ).done(function (tankData, productData, colorData) {
        var data = {};
        data.tankData = tankData[0];
        data.productData = productData[0];
        data.colorData = colorData[0];
        data.tankControls = {};
        for (aTankIndex = 0; aTankIndex < data.tankData.length; aTankIndex++) {
            var aTank = drawTank("tankContainer" + (aTankIndex + 1), data.tankData[aTankIndex], data.productData, data.colorData);
            data.tankControls[aTankIndex] = aTank;
        }
        window.data = data;
    }).fail(function () {
        alert('error reading tank data');
        });
    window.tankDataInitialized = true;
}

function refreshTanks() {
    if (!window.tankDataInitialized) {
        return;
    }
    $.getJSON("../../Data/Get/gtanks,it.additive=false", function (tankData) {
        for (aTankIndex = 0; aTankIndex < data.tankData.length; aTankIndex++) {
            refreshTank(aTankIndex, tankData[aTankIndex], window.data.productData, window.data.colorData);
        }
    }).error(function () {
        alert("error reading tank data");
    });
}

function drawTank(aContainer, aTank, productData, colorData) {
    //var myNode = document.getElementById(aContainer);
    //while (myNode.firstChild) {
    //    myNode.removeChild(myNode.firstChild);
    //}
    var w = 200;
    var h = 180;

    var aTankControl = {};
    var paper = Raphael(aContainer);
    paper.setViewBox(0, 0, w, h, true);
    paper.setSize('100%', '100%');

    var aColor = "#F8F8F8";
    var filledColor = "#F8F8F8";
    var productName = "";

    var aProductId = aTank.product;
    for (p = 0; p < productData.length; p++) {
        if (productData[p].id == aProductId) {
            productName = productData[p].product;
            var aColorId = productData[p].color;
            for (c = 0; c < colorData.length; c++) {
                if (colorData[c].id == aColorId) {
                    aColor = fromNumericColor(colorData[c].backcolor);
                    filledColor = fromNumericColor(colorData[c].forecolor);
                    break;
                }
            }
            break;
        }
    }

    var tankMarginX = 20;
    var tankMarginY = 5;
    var width = w - 2 * tankMarginX;
    var height = h - 2 * tankMarginY;
    var eclipseRadius = 12;

    var tankRect = paper.rect(tankMarginX, tankMarginY + eclipseRadius, width, height - 2 * eclipseRadius);
    tankRect.attr({
        fill: "0-#666-#FFF-#666", "stroke-width": 1, opacity: 1
    });

    var tankBottom = paper.ellipse(w / 2, tankMarginY + height - eclipseRadius, width / 2, eclipseRadius);
    tankBottom.attr({
        fill: "0-#666-#FFF-#666", "stroke-width": 0, opacity: 1
    });
    aTankControl.tankBottom = aTankControl.tankBottom;
    var tankRoof = paper.ellipse(w / 2, tankMarginY + eclipseRadius, width / 2, eclipseRadius);
    aTankControl.tankRoof = aTankControl.tankRoof;
    tankRoof.attr({
        fill: "0-" + aColor + "-" + filledColor, "stroke-width": 1, opacity: 1
    });

    var fuelHeight = height - 2 * eclipseRadius;
    var fuelBar = paper.rect(w / 2 - 10, tankMarginY + 2 * eclipseRadius, 20, fuelHeight);
    fuelBar.attr({
        fill: aColor, "stroke-width": 1, opacity: 0.5
    });
    aTankToollTip = "<h3>Tank " + (aTank.name) + "</h3> c: 2000";
    setToolTip(fuelBar, aTankToollTip);
    //if (delivered != orderedCapacity && delivered != 0) {
    if (!aTank.clevel) {
        aTank.clevel = 0;
    }
    if (aTank.clevel > aTank.maxLevel) {
        aTank.clevel = aTank.maxLevel;
    }
    var fposY = fuelHeight * (aTank.maxLevel - aTank.clevel) / aTank.maxLevel;
    var fHeight = fuelHeight * aTank.clevel / aTank.maxLevel;
    var fuelBarFilled = paper.rect(w / 2 - 10, tankMarginY + 2 * eclipseRadius + fposY, 20, fHeight);
    fuelBarFilled.attr({
        fill: filledColor, "stroke-width": 1, opacity: 1
    });
    setToolTip(fuelBarFilled, aTankToollTip);

    //paper.text(posX + width / 2, posY + height / 2, aTank.number).attr({ fill: '#000000' });
    //paper.text(posX + width / 2, initialPosY + initialHeight / 2, aTank.number).attr({ fill: '#000000' });

    aTankControl.fuelBar = fuelBar;
    aTankControl.fuelBarFilled = fuelBarFilled;

    aTankControl.tankName = paper.text(w / 2, tankMarginY + eclipseRadius, aTank.name).attr({
        fill: '#000000', "font-size": 16
    });

    var yStep = 16;
    currentY = tankMarginY + 2 * eclipseRadius + yStep;

    paper.text(w / 2 - 14, currentY, lang.tankControlProduct).attr({
        fill: '#000000', "font-size": 12, "text-anchor": "end"
    });
    aTankControl.tankControlProduct = paper.text(w / 2 + 15, currentY, productName).attr({
        fill: '#000000', "font-size": 12, "text-anchor": "start"
    });

    currentY += yStep;
    paper.text(w / 2 - 14, currentY, lang.tankControlLevel).attr({
        fill: '#000000', "font-size": 12, "text-anchor": "end"
    });
    aTankControl.tankControlLevel = paper.text(w / 2 + 15, currentY, (aTank.clevel).toLocaleString()).attr({
        fill: '#000000', "font-size": 12, "text-anchor": "start"
    });

    currentY += yStep;
    paper.text(w / 2 - 14, currentY, lang.tankControlTemp).attr({
        fill: '#000000', "font-size": 12, "text-anchor": "end"
    });
    aTankControl.tankControlTemp = paper.text(w / 2 + 15, currentY, aTank.temperature).attr({
        fill: '#000000', "font-size": 12, "text-anchor": "start"
    });

    currentY += yStep;
    paper.text(w / 2 - 14, currentY, lang.tankControlFlow).attr({
        fill: '#000000', "font-size": 12, "text-anchor": "end"
    });
    aTankControl.tankControlFlow = paper.text(w / 2 + 15, currentY, (aTank.pflow * 3.6).toLocaleString()).attr({
        fill: '#000000', "font-size": 12, "text-anchor": "start"
    });

    currentY += yStep;
    paper.text(w / 2 - 14, currentY, lang.tankControlNonPumpable).attr({
        fill: '#000000', "font-size": 12, "text-anchor": "end"
    });
    aTankControl.tankControlNonPumpable = paper.text(w / 2 + 15, currentY, (aTank.minlevel).toLocaleString()).attr({
        fill: '#000000', "font-size": 12, "text-anchor": "start"
    });

    currentY += yStep;
    paper.text(w / 2 - 14, currentY, lang.tankControlTime).attr({
        fill: '#000000', "font-size": 12, "text-anchor": "end"
    });
    aTankControl.tankControlTime = paper.text(w / 2 + 15, currentY, getRemainingTime(aTank)).attr({
        fill: '#000000', "font-size": 12, "text-anchor": "start"
    });

    currentY += yStep;
    paper.text(w / 2 - 14, currentY, lang.tankControlEmpty).attr({
        fill: '#000000', "font-size": 12, "text-anchor": "end"
    });
    aTankControl.tankControlEmpty = paper.text(w / 2 + 15, currentY, (aTank.oVolumeC - aTank.net).toLocaleString()).attr({
        fill: '#000000', "font-size": 12, "text-anchor": "start"
    });

    currentY += yStep;
    paper.text(w / 2 - 14, currentY, lang.tankControlPumpable).attr({
        fill: '#000000', "font-size": 12, "text-anchor": "end"
    });
    aTankControl.tankControlPumpable = paper.text(w / 2 + 15, currentY, (aTank.net - aTank.minlevel).toLocaleString()).attr({
        fill: '#000000', "font-size": 12, "text-anchor": "start"
    });

    return aTankControl;
}

function getRemainingTime(aTank) {
    var remTime = 0.0;
    if (aTank.pflow > 0) {
        remTime = ((aTank.oVolumeC - aTank.net) / 3600) / Math.abs(aTank.pflow);
    }
    else if (aTank.pflow < 0) {
        remTime = ((aTank.net - aTank.minlevel) / 3600) / Math.abs(aTank.pflow);
    }
    else {
        return "-";
    }

    var remHours = Math.floor(remTime);
    var remMinutes = Math.round((remTime - remHours) * 60);
    return remHours + ":" + padNum(remMinutes,2);
}

function padNum(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

function fromNumericColor(aNumber) {
    var s = aNumber.toString(16).toUpperCase();
    while (s.length < 6) { s = "0" + s; }
    return "#" + s.substring(4, 6) + s.substring(2, 4) + s.substring(0, 2);
}

function setToolTip(aControl, aText) {
    var ttip = document.getElementById('tooltip');
    cssString = "background-color: #fff; padding:10px; border: 3px #000 solid; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; font-size: 12pt; position: absolute;display:none;z-index:1";
    ttip.style.cssText = cssString;
    var f_in = function () {
        var ttip = document.getElementById('tooltip');
        ttip.innerHTML = aText;//"<h4>Languages1</h4></br>";
        $('#tooltip').show();
    }
    var f_out = function () {
        $('#tooltip').hide();

    }
    aControl.hover(f_in, f_out)
    $('#container').mousemove(function (location) {
        var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var desc = $('#tooltip').css('top', location.clientY + 10 + scrollTop).css('left', location.clientX + 10 + scrollLeft);
    })
}

function refreshTank(aTankIndex, aTank, productData, colorData) {
    //var myNode = document.getElementById(aContainer);
    //while (myNode.firstChild) {
    //    myNode.removeChild(myNode.firstChild);
    //}
    var w = 200;
    var h = 180;

    var aTankControl = data.tankControls[aTankIndex];

    var aColor = "#F8F8F8";
    var filledColor = "#F8F8F8";
    var productName = "";

    var aProductId = aTank.product;
    for (p = 0; p < productData.length; p++) {
        if (productData[p].id == aProductId) {
            productName = productData[p].product;
            var aColorId = productData[p].color;
            for (c = 0; c < colorData.length; c++) {
                if (colorData[c].id == aColorId) {
                    aColor = fromNumericColor(colorData[c].backcolor);
                    filledColor = fromNumericColor(colorData[c].forecolor);
                    break;
                }
            }
            break;
        }
    }

    var tankMarginX = 20;
    var tankMarginY = 5;
    var width = w - 2 * tankMarginX;
    var height = h - 2 * tankMarginY;
    var eclipseRadius = 12;

    var fuelHeight = height - 2 * eclipseRadius;

    //if (delivered != orderedCapacity && delivered != 0) {
    if (!aTank.clevel) {
        aTank.clevel = 0;
    }
    if (aTank.clevel > aTank.maxLevel) {
        aTank.clevel = aTank.maxLevel;
    }
    var fposY = fuelHeight * (aTank.maxLevel - aTank.clevel) / aTank.maxLevel;
    var fHeight = fuelHeight * aTank.clevel / aTank.maxLevel;
    //var fuelBarFilled = paper.rect(w / 2 - 10, tankMarginY + 2 * eclipseRadius + fposY, 20, fHeight);
    aTankControl.fuelBarFilled.attr({
        x: w / 2 - 10, y: tankMarginY + 2 * eclipseRadius + fposY, width: 20, height: fHeight,
        fill: filledColor, "stroke-width": 1, opacity: 1
    });


    (aTankControl.tankName).attr({text: aTank.name,
        fill: '#000000', "font-size": 16
    });

    (aTankControl.tankControlProduct).attr({text: productName,
        fill: '#000000', "font-size": 12, "text-anchor": "start"
    });

    aTankControl.tankControlLevel.attr({ text: (aTank.clevel).toLocaleString(),
        fill: '#000000', "font-size": 12, "text-anchor": "start"
    });

    aTankControl.tankControlTemp.attr({ text: aTank.temperature,
        fill: '#000000', "font-size": 12, "text-anchor": "start"
    });

    aTankControl.tankControlFlow.attr({ text:  (aTank.pflow * 3.6).toLocaleString(),
        fill: '#000000', "font-size": 12, "text-anchor": "start"
    });

    aTankControl.tankControlNonPumpable.attr({ text: (aTank.minlevel).toLocaleString(),
        fill: '#000000', "font-size": 12, "text-anchor": "start"
    });

    aTankControl.tankControlTime.attr({ text: getRemainingTime(aTank),
        fill: '#000000', "font-size": 12, "text-anchor": "start"
    });

    aTankControl.tankControlEmpty.attr({ text: (aTank.oVolumeC - aTank.net).toLocaleString(),
        fill: '#000000', "font-size": 12, "text-anchor": "start"
    });

    aTankControl.tankControlPumpable.attr({ text: (aTank.net - aTank.minlevel).toLocaleString(),
        fill: '#000000', "font-size": 12, "text-anchor": "start"
    });

    return aTankControl;
}

