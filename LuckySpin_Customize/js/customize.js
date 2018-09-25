// theWheel = new Luckywheel({
//     'numSegments': 3, // Specify number of segments.
//     'outerRadius': 212, // Set radius to so wheel fits the background.
//     'innerRadius': 60, // Set inner radius to make wheel hollow.
//     'textFontSize': 20, // Set font size accordingly.
//     'textMargin': 0, // Take out default margin.
//     'segments': [
//                   { fillStyle: "#FFC252", text: "20%", winresult: "You got 20% Discount",IsCouponCode:"true",CouponCode:"LUCKY20"},
//                   { fillStyle: "#24CFFF", text: "15%", winresult: "You got 15% Discount",IsCouponCode: "true", CouponCode: "LUCKY15" },
//                   { fillStyle: "gold", text: "No Discount", winresult: "Sorry Better Luck Next Time", IsCouponCode: "false", CouponCode: "" }
//                 ],
//     'wheelTextColor': "white", // Set font size accordingly.
//     'WheelStrokeColor': "white",
//     'WheelStrokeWidth': "3",
//     'animation': // Define spin to stop animation.
//     {
//         'type': 'spinToStop',
//         'duration': 5,
//         'spins': 8,
//         'callbackFinished': alertWinResult,
//         // 'callbackBefore': animbefore,
//         // 'callbackAfter': animafter,
//         'callbackSound': playSpinSound, // Function to call when the tick sound is to be triggered.
//     }
// });

//load your JSON from settings.json file
function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'settings.json', true); 
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // use of callback (xobj.responseText)
        }
    };
    xobj.send(null);
}
var arrSegmentsList = [];
var theWheel = [];
function init() {
    loadJSON(function (response) {
            // Parse JSON string into object 
            actual_JSON = JSON.parse(response);
            var segList = actual_JSON.data[0].segmentsList;
            cookidy = actual_JSON.data[0].cookiedays;
            var segno = 1;
            for (i = 0; i < segList.length; i++) {
                segmentsForSpin.push(segList[i].txtDisplayText);
                var v = parseInt(segList[i].hdnGravityPerc);
                var rang = v / 10;
                var cntrec = Math.round(rang);
                for (var p = 0; p < cntrec; p++) {
                    arrsp.push(segno);
                }
                arrSegmentsList.push({
                    fillStyle: segList[i].txtBackgroundColor,
                    text: segList[i].txtDisplayText,
                    winResult: segList[i].txtResultText,
                    isCouponExist: segList[i].IsCouponCode,
                    CouponCode: segList[i].CouponCode,
                });
                segno = segno + 1;
            }
            strarr = arrsp.join('|');
        });
}
init();


var font_size = actual_JSON.data[0].WheelTextSize;
var gameover_text = actual_JSON.data[0].GameOverText;
var wheel_text_color = actual_JSON.data[0].WheelTextColor;
var wheel_stroke_color = actual_JSON.data[0].WheelStrokeColor;
var wheel_stroke_width = actual_JSON.data[0].WheelStrokeWidth;
var wheel_inner_radious = actual_JSON.data[0].InnerRadious;
var wheel_outer_radious = actual_JSON.data[0].OuterRadious;

theWheel = new Luckywheel({
    'numSegments': arrSegmentsList.length, // Specify number of segments.
    'outerRadius': parseInt(wheel_outer_radious), // Set outer radius 
    'innerRadius': parseInt(wheel_inner_radious), // Set inner radius 
    'textFontSize': font_size, // Set font size accordingly.
    'textMargin': 0, // Take out default margin.
    'segments': arrSegmentsList, // Object of segment list
    'wheelTextColor': wheel_text_color, // Set text color accordingly.
    'WheelStrokeColor': wheel_stroke_color, // Stroke color between each segment
    'WheelStrokeWidth': wheel_stroke_width,
    'animation': // Define spin to stop animation.
            {
                'type': 'spinToStop',
                'duration': 5,
                'spins': 8,
                'callbackFinished': alertWinResult,
                'callbackBefore': animbefore,
                'callbackAfter': animafter,
                'callbackSound': playSpinSound, // Function to call when the tick sound is to be triggered.
            },
});

function alertWinResult(selectedSegment) {
    
    jQuery(".spin_pin").rotate(0);
    $("#spinWinResult").text(gameover_text);
    $(".power_controls").hide();

    var response = "";
    if (selectedSegment.isCouponExist == "true")
    {
        response += "<p>" + selectedSegment.winResult + "</p>";
        response += "<p> Your Coupon Code is " + selectedSegment.CouponCode + "</p>";
    }
    else
    {
        response += "<p>" + selectedSegment.winResult + "</p>";
    }

    $("#displayprice").html(response);
    $('#spin').modal('show');
    $(".reset_btn").show();
}

var audio = new Audio('spinsound.mp3');  // Create audio object and load spinsound.mp3 file.
function playSpinSound() {
    audio.pause();
    audio.currentTime = 0;

    // Play the sound.
    audio.play();
}