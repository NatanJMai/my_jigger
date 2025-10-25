/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Coming Soon
 */

class Countdown {

    initCountDown() {

        if (document.getElementById("days")) {
            // The data/time we want to countdown to
            const eventCountDown = new Date("Dec 17, 2027 12:00:01").getTime();

            // Run myfunc every second
            const count = setInterval(function () {

                const now = new Date().getTime();
                const timeleft = eventCountDown - now;

                // Calculating the days, hours, minutes and seconds left
                const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

                // Result is output to the specific element
                document.getElementById("days").innerHTML = days
                document.getElementById("hours").innerHTML = hours
                document.getElementById("minutes").innerHTML = minutes
                document.getElementById("seconds").innerHTML = seconds


                // Display the message when countdown is over
                if (timeleft < 0) {
                    clearInterval(count);
                    document.getElementById("days").innerHTML = ""
                    document.getElementById("hours").innerHTML = ""
                    document.getElementById("minutes").innerHTML = ""
                    document.getElementById("seconds").innerHTML = ""

                    const end = document.getElementById("end")
                    if (end) {
                        end.innerHTML = "00:00:00:00";
                    }
                }
            }, 1000);
        }
    }

    init() {
        this.initCountDown();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Countdown().init();
})