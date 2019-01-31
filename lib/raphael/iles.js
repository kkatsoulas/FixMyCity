

function loadIleViewData() {
    $.when(
        $.getJSON("../../Data/GetLog/ViewLog"),
        $.getJSON("../../Data/Get/meters,it.auto=true"),
        $.getJSON("../../Data/Get/products"),
        $.getJSON("../../Data/Get/colors"),
        $.getJSON("../../Data/Get/alarms"),
        $.getJSON("../../Data/Get/states")
    ).done(function (viewLogData, meterData, productData, colorData, alarmData, stateData) {
        var data = {};
        data.viewLogData = viewLogData[0];
        data.meterData = meterData[0];
        data.productData = productData[0];
        data.colorData = colorData[0];
        data.alarmData = alarmData[0];
        data.stateData = stateData[0];
        data.ileOrders = [-1, -1, -1, -1 - 1, -1, -1, -1 - 1, -1, -1, -1 - 1, -1, -1, -1 - 1, -1, -1, -1 - 1, -1, -1, -1];
        data.ileControls = {};
        window.data = data;
        for (anIle = 1; anIle <= siteIles; anIle++) {
            var anOrderId = -1;
            var ileViewLog;
            var ileMeters = data.meterData.filter(function (item) {
                ileViewLog = data.viewLogData.filter(function (logItem) {
                    if (logItem.order > 0 && logItem.meter == item.id &&
                        item.ile == anIle && logItem.state > 30 && item.active && item.auto) {
                        anOrderId = logItem.order;
                    }
                    return logItem.meter == item.id;

                });
                if (ileViewLog.length > 0) {
                    item.viewLog = ileViewLog[0];
                }
                else {
                    item.viewLog = null;
                }

                return item.ile == anIle;
            });
            window.data.ileOrders[anIle] = anOrderId;
            if (ileMeters.length > 0) {
                loadIleData(anIle, anOrderId, ileMeters);
            }
            else {
                loadIleData(anIle, anOrderId, null);
            }
        }
    }).fail(function () {
        alert('error reading data 1');
    });
    window.ileViewInitialized = true;
}

function loadIleData(anIle, anOrderId, ileMeters) {

    $.getJSON("../../Data/Get/orders,it.id = " + anOrderId, function (orderData) {
        var truckId = -1;
        var driverId = -1;
        if (orderData.length > 0) {
            truckId = orderData[0].truck;
            driverId = orderData[0].driver;
        }
        $.when(
            $.getJSON("../../Data/Get/order_detail,it.order = " + anOrderId),
            $.getJSON("../../Data/Get/trucks,it.id = " + truckId),
            $.getJSON("../../Data/Get/tanks,it.truck = " + truckId),
            $.getJSON("../../Data/Get/drivers,it.id = " + driverId)
        ).done(function (orderDetailData, truckData, tankData, driverData) {
            data.orderDetailData = orderDetailData[0];
            data.truckData = truckData[0][0];
            data.tankData = tankData[0];
            data.driverData = driverData[0][0];
            window.data=data;
            //for (curIle = 1; curIle <= 7; curIle++) {
            if (ileMeters) {
                if (ileMeters.length > 0) {
                    var ileControl = drawTruck("truckContainer" + anIle, data.truckData, data.tankData, data.orderData, data.orderDetailData, anIle, ileMeters);
                    window.data.ileControls[anIle] = ileControl;
                }
            }
            //}

            //drawTruck("truckContainer2", data.truckData, data.tankData, data.orderData, data.orderDetailData);
            //drawTruck("truckContainer3", data.truckData, data.tankData);
        }).fail(function () {
            alert('error reading data 2');
        });
    });
}

function refreshIles() {
    if (!window.ileViewInitialized) {
        return;
    }
    if (!window.data) {
        return;
    }

    $.when(
        $.getJSON("../../Data/GetLog/ViewLog"),
        $.getJSON("../../Data/Get/meters")
    ).done(function (viewLogData, meterData) {

        window.data.viewLogData = viewLogData[0];
        window.data.meterData = meterData[0];
        for (anIle = 1; anIle <= siteIles; anIle++) {
            var anOrderId = -1;
            var ileViewLog;
            var ileMeters = data.meterData.filter(function (item) {
                ileViewLog = data.viewLogData.filter(function (logItem) {
                    if (logItem.order > 0 && logItem.meter == item.id &&
                        item.ile == anIle && logItem.state > 30 && item.active && item.auto) {
                        anOrderId = logItem.order;
                    }
                    return logItem.meter == item.id;

                });
                if (ileViewLog.length > 0) {
                    item.viewLog = ileViewLog[0];
                }
                else {
                    item.viewLog = null;
                }

                return item.ile == anIle;
            });
            if (window.data.ileOrders[anIle] != anOrderId) {
                if (ileMeters.length > 0) {
                    loadIleData(anIle, anOrderId, ileMeters);
                }
                else {
                    loadIleData(anIle, anOrderId, null);
                }
                window.data.ileOrders[anIle] = anOrderId;
            }
            else {
                refreshIleData(anIle, anOrderId, ileMeters);
            }
        }
    }).fail(function () {
        alert('error reading data 1');
    });
}

function refreshIleData(anIle, anOrderId, ileMeters) {

    $.getJSON("../../Data/Get/orders,it.id = " + anOrderId, function (orderData) {
        var truckId = -1;
        var driverId = -1;
        if (orderData.length > 0) {
            truckId = orderData[0].truck;
            driverId = orderData[0].driver;
        }
        $.when(
            $.getJSON("../../Data/Get/order_detail,it.order = " + anOrderId),
            $.getJSON("../../Data/Get/trucks,it.id = " + truckId),
            $.getJSON("../../Data/Get/tanks,it.truck = " + truckId),
            $.getJSON("../../Data/Get/drivers,it.id = " + driverId)
        ).done(function (orderDetailData, truckData, tankData, driverData) {
            window.data.orderData = orderData[0];
            window.data.orderDetailData = orderDetailData[0];
            window.data.truckData = truckData[0][0];
            window.data.tankData = tankData[0];
            window.data.driverData = driverData[0][0];
            var data = window.data;
            //for (curIle = 1; curIle <= 7; curIle++) {
            if (ileMeters) {
                if (ileMeters.length > 0) {
                    refreshTruck("truckContainer" + anIle, data.truckData, data.tankData, data.orderData, data.orderDetailData, anIle, ileMeters);
                }
            }
            //}

            //drawTruck("truckContainer2", data.truckData, data.tankData, data.orderData, data.orderDetailData);
            //drawTruck("truckContainer3", data.truckData, data.tankData);
        }).fail(function () {
            alert('error reading data 2');
        });
    });
}

function loadIleOrderData(anOrderId, aTruckContainer) {
    $.getJSON("../../Data/Get/orders,it.id = " + anOrderId, function (orderData) {
        $.when(
            $.getJSON("../../Data/Get/order_detail,it.order = " + anOrderId),
            $.getJSON("../../Data/Get/trucks,it.id = " + orderData[0].truck),
            $.getJSON("../../Data/Get/tanks,it.truck = " + orderData[0].truck),
            $.getJSON("../../Data/Get/drivers,it.id = " + orderData[0].driver),
            $.getJSON("../../Data/Get/products"),
            $.getJSON("../../Data/Get/colors")
        ).done(function (orderDetailData, truckData, tankData, driverData, productData, colorData) {
            var data = {};
            data.orderData = orderData[0];
            data.orderDetailData = orderDetailData[0];
            data.truckData = truckData[0][0];
            data.tankData = tankData[0];
            data.driverData = driverData[0][0];
            data.productData = productData[0];
            data.colorData = colorData[0];
            window.data = data;
            if (!aTruckContainer) {
                aTruckContainer = "truckContainer1";
            }
            drawTruck(aTruckContainer, data.truckData, data.tankData, data.orderData, data.orderDetailData);
            //drawTruck("truckContainer2", data.truckData, data.tankData, data.orderData, data.orderDetailData);
            //drawTruck("truckContainer3", data.truckData, data.tankData);
        }).fail(function () {
            alert('error reading data');
        });
    });


    //$.getJSON("../../Data/Get/orders,it.id = " + anOrderId, function (orderData) {
    //    $.getJSON("../../Data/Get/order_detail,it.id = " + anOrderId, function (orderDetailData) {
    //        $.getJSON("../../Data/Get/trucks,it.id = " + orderData[0].truck, function (truckData) {
    //            $.getJSON("../../Data/Get/products", function (productData) {
    //                $.getJSON("../../Data/Get/colors", function (colorData) {
    //                    window.colorData = colorData;
    //                    $.getJSON("../../Data/Get/tanks,it.truck = " + orderData[0].truck, function (tankData) {
    //                        drawTruck("truckContainer1", truckData[0], tankData);
    //                        drawTruck("truckContainer2", truckData[0], tankData);
    //                        drawTruck("truckContainer3", truckData[0], tankData);
    //                    });
    //                });
    //            });
    //        });
    //    });
    //});
}


function loadTruckListData(anOrder, aTruckContainer) {
    $.getJSON("../../Data/Get/orders,it.id = " + anOrderId, function (orderData) {
        $.when(
            $.getJSON("../../Data/Get/order_detail,it.order = " + anOrder.id),
            $.getJSON("../../Data/Get/trucks,it.id = " + anOrder.truck),
            $.getJSON("../../Data/Get/tanks,it.truck = " + anOrder.truck),
            $.getJSON("../../Data/Get/drivers,it.id = " + anOrder.driver)
        ).done(function (orderDetailData, truckData, tankData, driverData) {
            if (!aTruckContainer) {
                aTruckContainer = "truckContainer1";
            }
            data.driverData = driverData[0][0];
            drawTruck(aTruckContainer, truckData[0][0], tankData[0], anOrder, orderDetailData[0]);
        }).fail(function () {
            alert('error reading data');
        });
    });
}

function loadIleTruckData(aTruckId) {
    $.getJSON("../../Data/Get/trucks,it.id = " + aTruckId, function (truckData) {
        $.getJSON("../../Data/Get/tanks,it.truck = " + aTruckId, function (tankData) {
            drawTruck("truckContainer1", truckData[0], tankData, orderData, orderDetailData);
            drawTruck("truckContainer2", truckData[0], tankData, orderData, orderDetailData);
            drawTruck("truckContainer3", truckData[0], tankData, orderData, orderDetailData);
        });
    });
}

function drawTruck(aContainer, aTruck, tankData, orderData, orderDetailData, anIle, ileMeters) {
    var myNode = document.getElementById(aContainer);
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    var w = 500;
    var h = 112;
    if (ileMeters) {
        w = 680;
    }
    var ileControl = {};
    var paper = Raphael(aContainer);
    paper.setViewBox(0, 0, w, h, true);
    paper.setSize('100%', '100%');
    //paper.setSize('80%', '80%');
    //paper.top = (anIle - 1) * -40;
    //var paper = Raphael("truckContainer", 600, 110);


    var minTruckFrontWidth = 100;
    var minTruckTrailerWidth = 80;

    var truckFrontTotal = 0
    var truckTrailerTotal = 0;
    var truckFrontCount = 0;
    var truckTrailerCount = 0;

    for (i = 0; i < tankData.length; i++) {
        if (tankData[i].trailer) {
            truckFrontCount += 1;
            truckTrailerTotal += tankData[i].capacity;
        }
        else {
            truckFrontCount += 1;
            truckFrontTotal += tankData[i].capacity;
        }
    }
    var scalefactor = 300 / 40000;
    var slepiFlag = false;
    if (aTruck) {
        if (aTruck.trailNumber) {
            if ((aTruck.trailNumber.toUpperCase() == "ΣΛΕΠΙ") || (aTruck.trailNumber.toUpperCase() == "SLEPI")) {
                scalefactor = 300 / 1600000;
                slepiFlag = true;
            }
        }
    };

    var frontWidth = truckFrontTotal * scalefactor;
    var trailerWidth = truckTrailerTotal * scalefactor;


    if (frontWidth < minTruckFrontWidth) {
        frontWidth = minTruckFrontWidth;
    }
    if (trailerWidth < minTruckTrailerWidth) {
        trailerWidth = minTruckTrailerWidth;
    }
    if (aTruck) {
        drawTruckFront(paper, frontWidth, aTruck, slepiFlag);
        if (aTruck.trailer) {
            drawTruckTrailer(paper, frontWidth, trailerWidth, aTruck);
        }
        else {
            trailerWidth = 0;
        }
    }

    var offX = 0;
    var offY = 0;
    var tankH = 50;
    if (slepiFlag) {
        offX = -60;
        offY = 47;
        tankH = 40;
    }
    ileControl.tanks = {};
    for (i = 0; i < tankData.length; i++) {
        var tankWidth = Math.round(tankData[i].capacity * scalefactor);
        var aTank;
        var anOrderDetail = undefined;
        if (orderDetailData) {
            if (orderDetailData.length >= i) {
                anOrderDetail = orderDetailData[i];
            }
        }
        if (!tankData[i].trailer) {
            ileControl.tanks[i] = drawtank(paper, tankData[i], 115 + offX, 25 + offY, tankWidth - 2, tankH, anOrderDetail, anIle);
            offX += tankWidth;
        }
        else {
            ileControl.tanks[i] = drawtank(paper, tankData[i], 115 + 15 + offX, 25 + offY, tankWidth - 2, tankH, anOrderDetail, anIle);
            offX += tankWidth;
        }
    }
    var truckEnd = 450; //130 + frontWidth + trailerWidth;
    if (orderData) {
        var aText = orderData.sn + " " + data.driverData.name + " " + aTruck.number;
        paper.text(250, 13, aText).attr({ fill: '#000000', "font-size": 13 });
    }

    if (ileMeters) {
        drawIleNumber(paper, 10, 20, anIle, ileMeters);

        ileMeters = ileMeters.sort(function (a, b) {
            return a.position > b.position ? 1 : 0;
        })

        var meterYOffset = 2;
        var meterCount = 0;
        var ileGround = false;
        ileControl.meters = {};
        for (aMeterIndex = 0; aMeterIndex < ileMeters.length; aMeterIndex++) {
            var aMeter = ileMeters[aMeterIndex];
            sessionStorage.setItem("alr" + aMeter.id, 0);
            if (aMeter.auto) {
                if (aMeter.viewLog) {
                    if (aMeter.active && aMeter.viewLog.ground) {
                        ileGround = true;
                    };
                }
                var aMeterControl = drawMeter(paper, truckEnd, 22 * meterCount + meterYOffset, 20, aMeter);
                ileControl.meters[aMeterIndex] = aMeterControl;
                meterCount++;
            }
        }
        var ground = drawGround(paper, 30, 20, 8, ileGround);
        ileControl.ground = ground;
        return ileControl;
    }
}

function refreshTruck(aContainer, aTruck, tankData, orderData, orderDetailData, anIle, ileMeters) {
    var ileControl = window.data.ileControls[anIle];
    if (!ileControl) {
        return;
    }
    for (i = 0; i < tankData.length; i++) {
        aTank = ileControl.tanks[i];
        var anOrderDetail = undefined;
        if (orderDetailData) {
            if (orderDetailData.length >= i) {
                anOrderDetail = orderDetailData[i];
            }
        }
        orderedCapacity = anOrderDetail.capacity;
        delivered = anOrderDetail.delivered;
        if (anIle) {
            var aLogView = window.data.viewLogData.filter(function (item) {
                return item.tank == anOrderDetail.tank && item.order == anOrderDetail.order;
            });
            if (aLogView) {
                if (aLogView.length > 0) {
                    if (aLogView[0].cvolume) {
                        delivered = delivered + aLogView[0].cvolume;
                    }
                }
            }
        }
        rectFilled = aTank.rectFilled;
        var fposY = aTank.attrs.y + aTank.attrs.height * (orderedCapacity - delivered) / orderedCapacity;
        var fHeight = aTank.attrs.height * delivered / orderedCapacity;
        //rectFilled.attrs.y = fposY;
        //rectFilled.attrs.height = fHeight;
        //rectFilled.attrs['stroke-width'] = 1;
        rectFilled.attr({
            y: fposY, height: fHeight, "stroke-width": 1
        })
    }

    var meterCount = 0;
    var ileGround = false;
    for (aMeterIndex = 0; aMeterIndex < ileMeters.length; aMeterIndex++) {
        var aMeter = ileMeters[aMeterIndex];
        if (aMeter.auto) {
            if (aMeter.viewLog) {
                if (aMeter.active && aMeter.viewLog.ground) {
                    ileGround = true;
                };
            }
            var aMeterControl = ileControl.meters[aMeterIndex];
            refreshMeter(aMeter, aMeterControl);
            //meterCount++;
        }
    }


    var ground = ileControl.ground;
    var fillGround = "r(0.5, 0.5)#ff0000-#990000";
    if (ileGround) {
        fillGround = "r(0.5, 0.5)#00ff00-#009900";
    }
    ground.attr({
        fill: fillGround, "stroke-width": 1
    });

}

function drawTruckFront(paper, frontWidth, aTruck, slepiFlag) {

    if (!slepiFlag) {
        var rect1 = paper.rect(100, 80, frontWidth + 20, 5);
        var rect3 = paper.rect(112, 22, frontWidth + 7, 56);
        var img = paper.image("../../images/truck.png", 0, 10, 111, 100);
        rect1.attr({ fill: "gray" });
        rect3.attr({ fill: "90-#666-#FFF-#666" });
        if (aTruck) {
            if (aTruck.type) {
                var rect2 = paper.rect(100, 86, 70, 5);
                rect2.attr({ fill: "gray" });
                drawWheel(paper, 150, 93, 16);
            }
        }
        drawWheel(paper, frontWidth + 37 + 13, 93, 16);
        drawWheel(paper, frontWidth + 70 + 13, 93, 16);
    }
    else {
        var img = paper.image("./images/slepi.png", 0, 10, 373, 120);
    }
}

function drawTruckTrailer(paper, frontWidth, trailerWidth, aTruck) {
    var trailerOffset = 15
    var rect1 = paper.rect(112 + frontWidth + trailerOffset, 80, trailerWidth + 10, 5);
    var rect2 = paper.rect(112 + frontWidth + trailerOffset - 6, 82, 4, 2);
    var rect3 = paper.rect(112 + frontWidth + trailerOffset, 22, trailerWidth + 7, 56);

    rect1.attr({ fill: "gray" });
    rect2.attr({ fill: "gray" });
    rect3.attr({ fill: "90-#666-#FFF-#666" });

    drawWheel(paper, 112 + frontWidth + 20 + 13, 93, 16);
    drawWheel(paper, 112 + frontWidth + trailerWidth + trailerOffset - 10, 93, 16);
}

function drawtank(paper, aTank, posX, posY, width, height, anOrderDetail, anIle) {
    var initialPosY = posY;
    var initialHeight = height;
    var aColor = "#F8F8F8";
    var filledColor = "#F8F8F8";
    var aCapacity = aTank.capacity;
    var orderedCapacity = aTank.capacity;
    var delivered = 0;
    if (anOrderDetail) {
        if (anOrderDetail.product) {
            orderedCapacity = anOrderDetail.capacity;
            delivered = anOrderDetail.delivered;
            if (anIle) {
                var aLogView = window.data.viewLogData.filter(function (item) {
                    return item.tank == anOrderDetail.tank && item.order == anOrderDetail.order;
                });
                if (aLogView) {
                    if (aLogView.length > 0) {
                        if (aLogView[0].cvolume) {
                            delivered = delivered + aLogView[0].cvolume;
                        }
                    }
                }
            }
            var aProductId = anOrderDetail.product;
            for (p = 0; p < data.productData.length; p++) {
                if (data.productData[p].id == aProductId) {
                    var aColorId = data.productData[p].color;
                    for (c = 0; c < data.colorData.length; c++) {
                        if (data.colorData[c].id == aColorId) {
                            aColor = fromNumericColor(data.colorData[c].backcolor);
                            filledColor = fromNumericColor(data.colorData[c].forecolor);
                            break;
                        }
                    }
                    break;
                }
            }
        }
    }

    if (aCapacity < orderedCapacity) {
        orderedCapacity = aCapacity;
    }
    if (aCapacity != orderedCapacity) {
        posY += height * (aCapacity - orderedCapacity) / aCapacity;
        height = height * orderedCapacity / aCapacity;
    }
    if (delivered == orderedCapacity && delivered != 0) {
        aColor == filledColor;
    }
    var rect = paper.rect(posX, posY, width, height);
    rect.attr({
        fill: aColor, "stroke-width": 0, opacity: 0.5
    });
    aTankToollTip = "<h3>Tank " + (i + 1) + "</h3> c: 2000";
    setToolTip(rect, aTankToollTip);
    //if (delivered != orderedCapacity && delivered != 0) {
    if (!delivered) {
        delivered = 0;
    }

    var fposY = posY + height * (orderedCapacity - delivered) / orderedCapacity;
    var fHeight = height * delivered / orderedCapacity;
    var rectFilled = paper.rect(posX, fposY, width, fHeight);
    rectFilled.attr({
        fill: filledColor, "stroke-width": 1, opacity: 0.5
    });
    setToolTip(rectFilled, aTankToollTip);
    rect.rectFilled = rectFilled;

    //paper.text(posX + width / 2, posY + height / 2, aTank.number).attr({ fill: '#000000' });
    paper.text(posX + width / 2, initialPosY + initialHeight / 2, aTank.number).attr({ fill: '#000000' });



    return rect;
}

function drawWheel(paper, posX, posY, radius) {
    var wheel11 = paper.circle(posX, posY, radius);
    var wheel12 = paper.circle(posX, posY, radius * 9 / 16);
    var wheel13 = paper.circle(posX, posY, radius * 3 / 16);
    var fillWheel2 = "r(0.5, 0.5)#ffffff-#a9a9a9";
    var fillWheel1 = "r(0.5, 0.5)#404040-#404040";
    wheel11.attr({ fill: fillWheel1 });
    wheel12.attr({ fill: fillWheel2 });
    wheel13.attr({ fill: "gray" });
}

function drawIleNumber(paper, posX, posY, anIle) {
    //var ground = paper.circle(posX, posY, 8);
    //ground.attr({
    //    fill: "white", "stroke-width": 1
    //});
    paper.text(posX, posY, anIle).attr({ fill: '#000000', "font-size": 13 });
}

function drawGround(paper, posX, posY, radius, ileGround) {
    var ground = paper.circle(posX, posY, radius);
    var fillGround = "r(0.5, 0.5)#ff0000-#990000";
    if (ileGround) {
        fillGround = "r(0.5, 0.5)#00ff00-#009900";
    }
    ground.attr({
        fill: fillGround, "stroke-width": 1
    });
    return ground;
}

function drawMeter(paper, posX, posY, height, aMeter) {

    var aColor = "#FFFFFF";
    var filledColor = "#FFFFFF";
    var aProductId = aMeter.product;
    for (p = 0; p < data.productData.length; p++) {
        if (data.productData[p].id == aProductId) {
            var aColorId = data.productData[p].color;
            for (c = 0; c < data.colorData.length; c++) {
                if (data.colorData[c].id == aColorId) {
                    aColor = fromNumericColor(data.colorData[c].backcolor);
                    filledColor = fromNumericColor(data.colorData[c].forecolor);
                    break;
                }
            }
            break;
        }
    }

    var labelMeterWidth = 25;
    var buttonMeterWidth = 30;
    var statusMeterWidth = 160;
    var labelMeter = paper.rect(posX, posY, labelMeterWidth, height);
    labelMeter.attr({
        fill: aColor, "stroke-width": 1, opacity: 1
    });
    var labelMeterText = paper.text(posX + labelMeterWidth / 2, posY + height / 2, aMeter.name).attr({ fill: '#000000' });
    var label1 = paper.set();
    label1.push(labelMeter);
    label1.push(labelMeterText);
    //buttonMeter.push(buttonText);
    label1.mouseover(function (event) {
        this.attr({ 'cursor': 'pointer' });
        this.oGlow = label1.glow({
            opacity: 0.85,
            color: 'black',
            width: 15
        });
    }).mouseout(function (event) {
        this.attr({ 'cursor': 'default' });
        this.oGlow.remove();
    });
    label1.click(function (e) {
        //refreshIles();
        //alert("clicked");
    });
    var buttonMeter = paper.rect(posX + labelMeterWidth + 3, posY, buttonMeterWidth, height);
    buttonMeter.attr({
        fill: "lightgray", "stroke-width": 1, opacity: 1
    });

    var buttonMeterText = paper.text((posX + labelMeterWidth + 3) + buttonMeterWidth / 2, posY + height / 2, "ESB").attr({ fill: '#000000' });

    var button1 = paper.set();
    button1.push(buttonMeter);
    button1.push(buttonMeterText);

    //buttonMeter.push(buttonText);
    button1.mouseover(function (event) {
        this.attr({ 'cursor': 'pointer' });
        this.oGlow = button1.glow({
            opacity: 0.85,
            color: 'black',
            width: 15
        });
    }).mouseout(function (event) {
        this.attr({ 'cursor': 'default' });
        this.oGlow.remove();
    });
    var aMeterViewStatus = -1;
    if (aMeter.viewLog) {
        aMeterViewStatus = aMeter.viewLog.state;
    }
    var aMeterStatus = "";
    var aMeterStatusColor = "lightGray";
    for (aStatusIndex = 0; aStatusIndex < window.data.stateData.length; aStatusIndex++) {
        if (window.data.stateData[aStatusIndex].id == aMeterViewStatus) {
            aMeterStatus = window.data.stateData[aStatusIndex].name;
            break;
        }
    }
    if (!aMeter.active) {
        aMeterStatus = "Out of Order"
        aMeterStatusColor = "darkGray";
    }
    if (aMeterViewStatus == 80) {
        aMeterStatusColor = aColor;
        var cvolume = 0;
        var volume = 0;
        if (aMeter.viewLog.cvolume) { cvolume = aMeter.viewLog.cvolume; };
        if (aMeter.viewLog.volume) { volume = aMeter.viewLog.volume; };
        aMeterStatus = aMeter.viewLog.tank + ":" + cvolume + " of " + volume;
    }
    var statusMeter = paper.rect(posX + labelMeterWidth + buttonMeterWidth + 6, posY, statusMeterWidth, height);
    statusMeter.attr({
        fill: aMeterStatusColor, "stroke-width": 1, opacity: 1
    });
    var statusMeterText = paper.text((posX + labelMeterWidth + buttonMeterWidth + 6) + statusMeterWidth / 2, posY + height / 2, aMeterStatus).attr({ fill: '#000000' });
    setToolTip(statusMeter, aMeterStatus);
    var aMeterControl = {
        "labelMeter": labelMeter, "labelMeterText": labelMeterText,
        "buttonMeter": buttonMeter, "buttonMeterText": buttonMeterText,
        "statusMeter": statusMeter, "statusMeterText": statusMeterText
    };
    button1.click(function (e) {
        handleMeterButton(aMeter, aMeterControl);
        //alert("clicked");
    });
    if (aMeter.auto) {
        refreshMeter(aMeter, aMeterControl);
    }
    return aMeterControl;
}

function refreshMeter(aMeter, aMeterControl) {
    if (!aMeter.auto) {
        return;
    }
    if (!aMeterControl) {
        console.log("No meter control");
        console.log(aMeter.name);
        location.reload();
        return;
    }
    var aColor = "#FFFFFF";
    var filledColor = "#FFFFFF";
    var aProductId = aMeter.product;
    for (p = 0; p < data.productData.length; p++) {
        if (data.productData[p].id == aProductId) {
            var aColorId = data.productData[p].color;
            for (c = 0; c < data.colorData.length; c++) {
                if (data.colorData[c].id == aColorId) {
                    aColor = fromNumericColor(data.colorData[c].backcolor);
                    filledColor = fromNumericColor(data.colorData[c].forecolor);
                    break;
                }
            }
            break;
        }
    }

    var labelMeter = aMeterControl["labelMeter"];
    var labelMeterText = aMeterControl["labelMeterText"];
    labelMeter.attr({
        fill: aColor, "stroke-width": 1, opacity: 1
    });

    var statusMeter = aMeterControl["statusMeter"];
    var statusMeterText = aMeterControl["statusMeterText"];
    var aMeterViewStatus = -1;
    if (aMeter.viewLog) {
        aMeterViewStatus = aMeter.viewLog.state;
    }
    var aMeterStatus = "";
    var aMeterStatusColor = "lightGray";

    labelMeter.attr({
        fill: aColor, "stroke-width": 1, opacity: 1
    });
    labelMeterText.attr({
        text: aMeter.name
    });

    for (aStatusIndex = 0; aStatusIndex < window.data.stateData.length; aStatusIndex++) {
        if (window.data.stateData[aStatusIndex].id == aMeterViewStatus) {
            aMeterStatus = window.data.stateData[aStatusIndex].name;
            break;
        }
    }

    if (aMeterViewStatus == 80) {
        aMeterStatusColor = aColor;
        var cvolume = 0;
        var volume = 0;
        if (aMeter.viewLog.cvolume) { cvolume = aMeter.viewLog.cvolume; };
        if (aMeter.viewLog.volume) { volume = aMeter.viewLog.volume; };
        aMeterStatus = aMeter.viewLog.tank + ":" + cvolume + " of " + volume;
    }
    if (!aMeter.active) {
        aMeterStatus = "Out of Order"
        aMeterStatusColor = "darkGray";
    }
    statusMeter.attr({
        fill: aMeterStatusColor, "stroke-width": 1, opacity: 1
    });

    statusMeterText.attr({
        text: aMeterStatus
    });

    if (aMeter.active) {
        showAlarm(aMeter, aMeterControl);
        showESB(aMeter, aMeterControl);
        showState(aMeter, aMeterControl);
    }
}

function showESB(aMeter, aMeterControl) {
    var aMeterViewLogESB = false;
    aMeterViewLogAlarmType = 0;
    if (aMeter.viewLog) {
        aMeterViewLogESB = aMeter.viewLog.esb;
        aMeterViewLogAlarmType = aMeter.viewLog.alarmType;
    }
    var statusMeter = aMeterControl["statusMeter"];
    var buttonMeter = aMeterControl["buttonMeter"];
    var buttonMeterText = aMeterControl["buttonMeterText"];
    if (aMeterViewLogESB == false) {
        if (aMeterViewLogAlarmType == 0) {
            buttonMeter.attr({
                fill: "lightgray", "stroke-width": 1, opacity: 1
            });
            buttonMeterText.attr({
                text: "ESB"
            })
        }
    }
    else {
        buttonMeter.attr({
            fill: "white", "stroke-width": 1, opacity: 1
        }).animate({ fill: "Gold" }, 1000,
            function () {
                buttonMeter.animate({ fill: "white" }, 1000,
                    function () {
                        buttonMeter.animate({ fill: "Gold" }, 1000,
                            function () { buttonMeter.animate({ fill: "white" }, 1000) })
                    })
            });
        statusMeter.attr({
            fill: "white", "stroke-width": 1, opacity: 1
        }).animate({ fill: "Gold" }, 1000,
            function () {
                statusMeter.animate({ fill: "white" }, 1000,
                    function () {
                        statusMeter.animate({ fill: "Gold" }, 1000,
                            function () { statusMeter.animate({ fill: "white" }, 1000) })
                    })
            });
        buttonMeterText.attr({
            text: "RES"
        })
    }
}

function alarmString(aMeter, aString) {
    var aMeterType = 1;
    if (aMeter) {
        aMeterType = aMeter.type;
    }
    var alr = [false];
    var cnt= 0;
    for (index = 1; index <= 12; index++) {
        var anAlr = aString.charCodeAt(index - 1) - 48;
        if (anAlr > 0) {
            if (anAlr & 1) {
                alr[(index - 1) * 4 + 4] = true;
                cnt += 1;
            }
            if (anAlr & 2) {
                alr[(index - 1) * 4 + 3] = true;
                cnt += 1;
            }
            if (anAlr & 4) {
                alr[(index - 1) * 4 + 1] = true;
                cnt += 1;
            }
            if (anAlr & 8) {
                alr[(index - 1) * 4 + 1] = true;
                cnt += 1;
            }
        }
    }
    aMeterType = aMeterType - 1;
    var alrString = "";
    for (index = 0; index < window.data.alarmData.length; index++) {
        var anAlarm = window.data.alarmData[index];
        if ((anAlarm.id > aMeterType * 100) && (anAlarm.id < (aMeterType +1)* 100)){
            if (alr[anAlarm.id - aMeterType * 100] == true) {
                if (cnt > 1) {
                    if (alrString != "") {
                        alrString += "-";
                    }
                    alrString += anAlarm.shortname;
                }
                else {
                    alrString = anAlarm.shortname + "-" + anAlarm.name;
                }
            }
        }  
    }
    return alrString;
}

function showAlarm(aMeter, aMeterControl) {
    var aMeterViewLogAlarmType = 0;
    var aMeterViewLogAlarm = "000000000000";
    if (aMeter.viewLog) {
        aMeterViewLogAlarmType = aMeter.viewLog.alarmType;
        aMeterViewLogAlarm = aMeter.viewLog.alarm;
    }
    var statusMeter = aMeterControl["statusMeter"];
    var statusMeterText = aMeterControl["statusMeterText"];
    var buttonMeter = aMeterControl["buttonMeter"];
    var buttonMeterText = aMeterControl["buttonMeterText"];
    if (aMeterViewLogAlarmType > 0) {
        var alrString = alarmString(aMeter, aMeterViewLogAlarm);
        if (aMeterViewLogAlarmType == 2) {
            alrString = "NR " + alrString;
            buttonMeterText.attr({
                text: "NR"
            })
        }
        else {
            buttonMeterText.attr({
                text: "ALR"
            })
            var alrCheckBox = $('#AlrCheckBox')[0];

            if (aMeterViewLogAlarm != "000000000004") {
                if (alrCheckBox.checked) {
                    var alrCnt = 0;
                    if (sessionStorage.getItem("alr" + aMeter.id)) {
                        alrCnt = parseInt(sessionStorage.getItem("alr" + aMeter.id));
                    }
                    alrCnt += 1;
                    sessionStorage.setItem("alr" + aMeter.id, alrCnt);
                    if (alrCnt < 10) {
                        $.getJSON("../../Data/AckAlr/" + aMeter.id, function (aRes) {
                            var aRet = aRes;
                        });
                    }
                }
            }
        }
        buttonMeter.attr({
            fill: "red", "stroke-width": 1, opacity: 1
        });
        buttonMeter.attr({
            fill: "Red", "stroke-width": 1, opacity: 1
        }).animate({ fill: "red" }, 1000,
            function () {
                buttonMeter.animate({ fill: "lightgray" }, 1000,
                    function () {
                        buttonMeter.animate({ fill: "red" }, 1000,
                            function () { buttonMeter.animate({ fill: "lightgray" }, 1000) })
                    })
            });
        statusMeter.attr({
            fill: "lightgray", "stroke-width": 1, opacity: 1
        }).animate({ fill: "red" }, 1000,
            function () {statusMeter.animate({ fill: "lightgray" }, 1000, 
                function () {statusMeter.animate({ fill: "red" }, 1000,
                    function () {statusMeter.animate({ fill: "lightgray" }, 1000)})
                })
            });
        statusMeterText.attr({
            text: alrString
        });
    }
    else {

    };
}

function showState(aMeter, aMeterControl) {

}
function handleMeterButton(aMeter, aMeterControl) {
    var buttonMeterText = aMeterControl["buttonMeterText"];
    if (buttonMeterText.attrs.text == "ESB") {
        $.getJSON("../../Data/SetEsb/" + aMeter.id, function (aRes) {
            var aRet = aRes;
        });
    }
    if (buttonMeterText.attrs.text == "RES") {
        $.getJSON("../../Data/ResEsb/" + aMeter.id, function (aRes) {
            var aRet = aRes;
        });
    }
    if (buttonMeterText.attrs.text == "ALR") {
        sessionStorage.setItem("alr" + aMeter.id, 0);
        $.getJSON("../../Data/AckAlr/" + aMeter.id, function (aRes) {
            var aRet = aRes;
        });
    }
}

function refreshtank(paper, aTank, posX, posY, width, height, anOrderDetail, anIle) {
    var initialPosY = posY;
    var initialHeight = height;
    var aColor = "#F8F8F8";
    var filledColor = "#F8F8F8";
    var aCapacity = aTank.capacity;
    var orderedCapacity = aTank.capacity;
    var delivered = 0;
    if (anOrderDetail) {
        if (anOrderDetail.product) {
            orderedCapacity = anOrderDetail.capacity;
            delivered = anOrderDetail.delivered;
            if (anIle) {
                var aLogView = window.data.viewLogData.filter(function (item) {
                    return item.tank == anOrderDetail.tank && item.order == anOrderDetail.order;
                });
                if (aLogView) {
                    if (aLogView.length > 0) {
                        delivered = delivered + aLogView[0].cvolume;
                    }
                }
            }
            var aProductId = anOrderDetail.product;
            for (p = 0; p < data.productData.length; p++) {
                if (data.productData[p].id == aProductId) {
                    var aColorId = data.productData[p].color;
                    for (c = 0; c < data.colorData.length; c++) {
                        if (data.colorData[c].id == aColorId) {
                            aColor = fromNumericColor(data.colorData[c].backcolor);
                            filledColor = fromNumericColor(data.colorData[c].forecolor);
                            break;
                        }
                    }
                    break;
                }
            }
        }
    }

    if (aCapacity < orderedCapacity) {
        orderedCapacity = aCapacity;
    }
    if (aCapacity != orderedCapacity) {
        posY += height * (aCapacity - orderedCapacity) / aCapacity;
        height = height * orderedCapacity / aCapacity;
    }
    if (delivered == orderedCapacity && delivered != 0) {
        aColor == filledColor;
    }
    var rect = paper.rect(posX, posY, width, height);
    rect.attr({
        fill: aColor, "stroke-width": 0, opacity: 0.5
    });
    aTankToollTip = "<h3>Tank " + (i + 1) + "</h3> c: 2000";
    setToolTip(rect, aTankToollTip);
    if (delivered != orderedCapacity && delivered != 0) {
        var fposY = posY + height * (orderedCapacity - delivered) / orderedCapacity;
        var fHeight = height * delivered / orderedCapacity;
        var rectFilled = paper.rect(posX, fposY, width, fHeight);
        rectFilled.attr({
            fill: filledColor, "stroke-width": 1, opacity: 0.5
        });
        setToolTip(rectFilled, aTankToollTip);
    }
    else {
        var fposY = posY + height * (orderedCapacity - delivered) / orderedCapacity;
        var fHeight = 1;
        var rectFilled = paper.rect(posX, fposY, width, fHeight);
        rectFilled.attr({
            fill: filledColor, "stroke-width": 0, opacity: 0.5
        });
        setToolTip(rectFilled, aTankToollTip);
    }
    rect.rectFilled = rectFilled;


    //paper.text(posX + width / 2, posY + height / 2, aTank.number).attr({ fill: '#000000' });
    paper.text(posX + width / 2, initialPosY + initialHeight / 2, aTank.number).attr({ fill: '#000000' });


    return rect;
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

