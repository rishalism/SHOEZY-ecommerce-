
let totalproducts = document.getElementById('totalproduct');
let totalusers = document.getElementById('totalusers')
let totalorders = document.getElementById('totalorders')
let totalrevenue = document.getElementById('totalrevenue')
let paymentOrderCount = []
let dailyorders = []
let weeklyOrders = []
let monthlyorders = []
let yearlyorders = []
window.addEventListener('load', () => {
    fetch('/admin/dashboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                let paymentSalesData = data.paymentSalesData;
                totalorders.innerHTML = data.totalorders
                totalproducts.innerHTML = data.totalProducts
                totalrevenue.innerHTML = `₹ ${data.totalRevenue}`
                totalusers.innerHTML = data.totalusers
                paymentOrderCount = paymentSalesData.map((item) => item.orderCount)
                dailyorders = data.todaySales
                weeklyOrders = data.weeklySales
                monthlyorders = data.monthlySales
                yearlyorders = data.yearlySales
                updateWeeklyChart(weeklyOrders)
                updateMonthlySales(monthlyorders)
                updateyearlychart(yearlyorders)
                updateChart(dailyorders);

            }
        })
        .catch(error => {
            console.log(error);
        });
});


function getPastSevenDays() {
    const dateLabels = [];
    const currentDate = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - i);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}`;
        dateLabels.push(formattedDate);
    }

    return dateLabels;
}

// Function to format today's date
function getFormattedToday() {
    const todayDate = new Date();
    const formattedToday = `${todayDate.getFullYear()}-${(todayDate.getMonth() + 1).toString().padStart(2, '0')}-${todayDate.getDate().toString().padStart(2, '0')}`;
    return formattedToday;
}

function updateChart({ orderCount}) {

    const dateLabels = getPastSevenDays();
    const today = getFormattedToday();

    console.log(dailyorders,today,orderCount);
    // Determine the y-axis max value based on the orderCount
    const yAxisMax = Math.ceil(orderCount / 10) * 10;

    var ctx1 = $("#daily-orders").get(0).getContext("2d");
    const myChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: dateLabels, // Dynamically generated date labels
            datasets: [{
                label: `Orders for ${today}`,
                data: [0, 0, 0, 0, 0, 0, orderCount],
                backgroundColor: ['rgba(235, 22, 22, .7)'],
                borderColor: ['rgba(235, 22, 22, .7)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true,
                    max: yAxisMax,
                    ticks: {
                        stepSize: 10 // Set the interval for y-axis ticks
                    }
                }
            },
            responsive: true
        }
    });


    //////////////////  cod and upi /////////////

    const ctx2 = $("#salse-revenue").get(0).getContext("2d");
    const myChart2 = new Chart(ctx2, {
        type: "doughnut",
        data: {
            labels: ['cod', 'net banking'],
            datasets: [{
                label: 'My First Dataset',
                data: paymentOrderCount,
                backgroundColor: [
                    'rgba(235, 22, 22, .7)',
                    'rgba(54, 162, 235,.5)',
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
        }
    });
};



function updateWeeklyChart({ orderCount, label }) {
    const ctx3 = $("#weekly-orders").get(0).getContext("2d");

    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get the number of weeks in the current month
    const weeksInMonth = getWeeksInMonth(currentYear, currentMonth);

    // Dynamically generate week labels for the current month
    const weekLabels = [];
    for (let i = 1; i <= weeksInMonth; i++) {
        weekLabels.push(`Week ${i}`);
    }

    // Initialize the weekly orders chart
    const weeklyOrdersChart = new Chart(ctx3, {
        type: "bar",
        data: {
            labels: weekLabels,
            datasets: [
                {
                    label: "Orders",
                    data: orderCount,
                    borderWidth: 1,
                    borderColor: "white",
                    backgroundColor: "rgba(54, 162, 235,.5)",
                },
            ],
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        color: "rgba(235, 22, 22, .7)", // Change x-axis label color here
                    },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "rgba(54, 162, 235,.5)", // Change y-axis label color here
                    },
                },
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: "rgba(54, 162, 235,.3)", // Change legend label color here
                    },
                },
            },
        },
    });
}

// Function to get the number of weeks in a month
function getWeeksInMonth(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const firstDayOfWeek = firstDay.getDay();
    const daysBeforeFirstSunday = firstDayOfWeek === 0 ? 0 : 7 - firstDayOfWeek;

    const daysAfterLastSunday = (daysInMonth - daysBeforeFirstSunday) % 7;

    const fullWeeks = (daysInMonth - daysBeforeFirstSunday - daysAfterLastSunday) / 7;

    return Math.ceil(fullWeeks + (daysAfterLastSunday > 0 ? 1 : 0));
}








function updateMonthlySales({ orderCount, month }) {

    const ctx4 = $("#Monthly-orders").get(0).getContext("2d");

    const monthlyOrdersChart = new Chart(ctx4, {
        type: "bar",
        data: {
            labels: month,
            datasets: [
                {
                    label: "Orders",
                    data: orderCount,
                    borderWidth: 1,
                    borderColor: "rgba(235, 22, 22, .7)",
                    backgroundColor: "'rgba(235, 22, 22, .7)",
                },
            ],
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        color: "rgba(235, 22, 22, .7)", // Change x-axis label color here
                    },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "rgba(54, 162, 235,.5)", // Change y-axis label color here
                    },
                },
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: "rgba(54, 162, 235,.3)", // Change legend label color here
                    },
                },
            },
        },
    });

}


function updateyearlychart({ orderCount, year }) {
    const ctx5 = $("#Yearly-orders").get(0).getContext("2d");

    const yearlyOrdersChart = new Chart(ctx5, {
        type: "bar",
        data: {
            labels: year,
            datasets: [
                {
                    label: "Orders",
                    data: orderCount,
                    borderWidth: 1,
                    borderColor: "rgba(235, 22, 22, .7)",
                    backgroundColor: "rgba(235, 22, 22, .7)",
                },
            ],
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        color: "rgba(235, 22, 22, .7)", // Change x-axis label color here
                    },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "rgba(54, 162, 235, .5)", // Change y-axis label color here
                    },
                },
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: "rgba(54, 162, 235, .3)", // Change legend label color here
                    },
                },
            },
        },
    });
}





document.addEventListener('DOMContentLoaded', () => {
    (function ($) {
        "use strict";

        // Spinner
        var spinner = function () {
            setTimeout(function () {
                if ($('#spinner').length > 0) {
                    $('#spinner').removeClass('show');
                }
            }, 1);
        };
        spinner();


        // Back to top button
        $(window).scroll(function () {
            if ($(this).scrollTop() > 300) {
                $('.back-to-top').fadeIn('slow');
            } else {
                $('.back-to-top').fadeOut('slow');
            }
        });
        $('.back-to-top').click(function () {
            $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
            return false;
        });


        // Sidebar Toggler
        $('.sidebar-toggler').click(function () {
            $('.sidebar, .content').toggleClass("open");
            return false;
        });


        // Progress Bar
        $('.pg-bar').waypoint(function () {
            $('.progress .progress-bar').each(function () {
                $(this).css("width", $(this).attr("aria-valuenow") + '%');
            });
        }, { offset: '80%' });


        // Calender
        $('#calender').datetimepicker({
            inline: true,
            format: 'L'
        });


        // Testimonials carousel
        $(".testimonial-carousel").owlCarousel({
            autoplay: true,
            smartSpeed: 1000,
            items: 1,
            dots: true,
            loop: true,
            nav: false
        });


        // Chart Global Color
        // Worldwide Sales Chart
        // var ctx1 = $("#worldwide-sales").get(0).getContext("2d");
        // var myChart1 = new Chart(ctx1, {
        //     type: "bar",
        //     data: {
        //         labels: label,
        //         datasets: [{
        //             label: "WEEKLY",
        //             data: ordercount,
        //             backgroundColor: "rgba(235, 22, 22, .7)"
        //         },
        //         {
        //             label: "MONTHLY",
        //             data: [8, 35, 40, 60, 70, 55, 75],
        //             backgroundColor: "rgba(235, 22, 22, .5)"
        //         },
        //         {
        //             label: "YEARLY",
        //             data: [12, 25, 45, 55, 65, 70, 60],
        //             backgroundColor: "rgba(235, 22, 22, .3)"
        //         }
        //         ]
        //     },
        //     options: {
        //         responsive: true
        //     }
        // });


        // Salse & Revenue Chart
        // var ctx2 = $("#salse-revenue").get(0).getContext("2d");
        // var myChart2 = new Chart(ctx2, {
        //     type: "line",
        //     data: {
        //         labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
        //         datasets: [{
        //             label: "cod",
        //             data: [15, 30, 55, 45, 70, 65, 85],
        //             backgroundColor: "rgba(235, 22, 22, .7)",
        //             fill: true
        //         },
        //         {
        //             label: "net banking",
        //             data: [99, 135, 170, 130, 190, 180, 270],
        //             backgroundColor: "rgba(235, 22, 22, .5)",
        //             fill: true
        //         }
        //         ]
        //     },
        //     options: {
        //         responsive: true
        //     }
        // });




        // Single Line Chart
        var ctx3 = $("#line-chart").get(0).getContext("2d");
        var myChart3 = new Chart(ctx3, {
            type: "line",
            data: {
                labels: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
                datasets: [{
                    label: "Salse",
                    fill: false,
                    backgroundColor: "rgba(235, 22, 22, .7)",
                    data: [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15]
                }]
            },
            options: {
                responsive: true
            }
        });


        // Single Bar Chart
        var ctx4 = $("#bar-chart").get(0).getContext("2d");
        var myChart4 = new Chart(ctx4, {
            type: "bar",
            data: {
                labels: ["Italy", "France", "Spain", "USA", "Argentina"],
                datasets: [{
                    backgroundColor: [
                        "rgba(235, 22, 22, .7)",
                        "rgba(235, 22, 22, .6)",
                        "rgba(235, 22, 22, .5)",
                        "rgba(235, 22, 22, .4)",
                        "rgba(235, 22, 22, .3)"
                    ],
                    data: [55, 49, 44, 24, 15]
                }]
            },
            options: {
                responsive: true
            }
        });


        // Pie Chart
        var ctx5 = $("#pie-chart").get(0).getContext("2d");
        var myChart5 = new Chart(ctx5, {
            type: "pie",
            data: {
                labels: ["Italy", "France", "Spain", "USA", "Argentina"],
                datasets: [{
                    backgroundColor: [
                        "rgba(235, 22, 22, .7)",
                        "rgba(235, 22, 22, .6)",
                        "rgba(235, 22, 22, .5)",
                        "rgba(235, 22, 22, .4)",
                        "rgba(235, 22, 22, .3)"
                    ],
                    data: [55, 49, 44, 24, 15]
                }]
            },
            options: {
                responsive: true
            }
        });


        // Doughnut Chart
        var ctx6 = $("#doughnut-chart").get(0).getContext("2d");
        var myChart6 = new Chart(ctx6, {
            type: "doughnut",
            data: {
                labels: ["Italy", "France", "Spain", "USA", "Argentina"],
                datasets: [{
                    backgroundColor: [
                        "rgba(235, 22, 22, .7)",
                        "rgba(235, 22, 22, .6)",
                        "rgba(235, 22, 22, .5)",
                        "rgba(235, 22, 22, .4)",
                        "rgba(235, 22, 22, .3)"
                    ],
                    data: [55, 49, 44, 24, 15]
                }]
            },
            options: {
                responsive: true
            }
        });


    })(jQuery);

})


